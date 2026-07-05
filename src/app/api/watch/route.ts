import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createWatch, FREE_WATCH_LIMIT } from "@/lib/watch-store";
import { isEmailConfigured } from "@/lib/alerts-email";
import { parseSafeHttpUrl } from "@/lib/url-safety";
import { isProRequest, PRO_WATCH_LIMIT } from "@/lib/pro";

const watchRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  listingUrl: z.string().trim().url().optional(),
  vehicleTitle: z.string().trim().max(120).optional(),
  price: z.number().int().positive().max(5_000_000).nullable().optional(),
  listingKey: z.string().trim().max(80).optional(),
});

export async function POST(request: Request) {
  const limit = 6;
  const rl = checkRateLimit(request, limit);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterMs, limit);

  let body: z.infer<typeof watchRequestSchema>;
  try {
    const parsed = watchRequestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Check the alert details and try again." },
        { status: 400 },
      );
    }
    body = parsed.data;
  } catch {
    return NextResponse.json({ error: "Send alert details as JSON." }, { status: 400 });
  }

  // Only public, safe http(s) URLs are ever re-fetched by the alert sweep.
  let safeUrl: string | null = null;
  if (body.listingUrl) {
    try {
      safeUrl = parseSafeHttpUrl(body.listingUrl).toString();
    } catch {
      return NextResponse.json({ error: "That listing URL can't be watched." }, { status: 400 });
    }
  }

  const pro = await isProRequest(request);
  const created = await createWatch({
    email: body.email,
    listingUrl: safeUrl,
    listingKey: body.listingKey ?? null,
    vehicleTitle: body.vehicleTitle ?? null,
    price: body.price ?? null,
    watchLimit: pro ? PRO_WATCH_LIMIT : FREE_WATCH_LIMIT,
  });

  if (!created.ok) {
    if (created.reason === "limit") {
      return NextResponse.json(
        {
          error: pro
            ? `Pro covers ${PRO_WATCH_LIMIT} watched listings at a time. Stop watching one first (link in any alert email).`
            : `Free alerts cover ${FREE_WATCH_LIMIT} listings at a time. Stop watching one first, or lift the cap with Pro (/pricing).`,
        },
        { status: 409 },
      );
    }
    if (created.reason === "duplicate") {
      return NextResponse.json({ error: "You're already watching this listing." }, { status: 409 });
    }
    return NextResponse.json(
      { error: "Alerts aren't available right now. Try again later." },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    emailConfigured: isEmailConfigured(),
  });
}
