import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { addSubscriber } from "@/lib/subscribers";

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  source: z.enum(["footer", "guide"]).default("footer"),
});

export async function POST(request: Request) {
  const limit = 6;
  const rl = await checkRateLimit(request, limit);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterMs, limit);

  try {
    const parsed = subscribeSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Enter a valid email." }, { status: 400 });
    }
    const ok = await addSubscriber(parsed.data.email, parsed.data.source);
    if (!ok) return NextResponse.json({ error: "Signup isn't available right now." }, { status: 503 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Send an email address as JSON." }, { status: 400 });
  }
}
