import { NextResponse } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { findBetterDeals } from "@/lib/better-deals";

const REQUESTS_PER_WINDOW = 20;

export async function POST(request: Request) {
  const rl = await checkRateLimit(request, REQUESTS_PER_WINDOW);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterMs, REQUESTS_PER_WINDOW);

  let body: { make?: unknown; model?: unknown; year?: unknown; price?: unknown; zip?: unknown };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Send vehicle details as JSON." }, { status: 400 });
  }

  const make = typeof body.make === "string" ? body.make.trim() : "";
  const model = typeof body.model === "string" ? body.model.trim() : "";
  const price = typeof body.price === "number" ? body.price : Number(body.price);

  if (!make || !model || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ result: { status: "no-vehicle" } });
  }

  const result = await findBetterDeals({
    make,
    model,
    year: typeof body.year === "string" ? body.year : null,
    price,
    zip: typeof body.zip === "string" && /^\d{5}$/.test(body.zip) ? body.zip : null,
  });

  return NextResponse.json({ result });
}
