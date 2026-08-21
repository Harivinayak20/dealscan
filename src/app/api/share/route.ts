import { NextResponse } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createShare, validatePayload } from "@/lib/share-storage";
import { recordEvent } from "@/lib/analytics";

export async function POST(request: Request) {
  const rl = await checkRateLimit(request, 10, 60_000);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterMs, 10);

  let payload: unknown;
  try {
    const body = await request.json();
    payload = body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!validatePayload(payload)) {
    return NextResponse.json({ error: "Invalid share payload." }, { status: 400 });
  }

  const result = await createShare(payload);
  if (!result) {
    return NextResponse.json({ error: "Share storage is temporarily unavailable." }, { status: 503 });
  }

  await recordEvent({
    type: "share_created",
    path: "/api/share",
    meta: { score: payload.score, verdict: payload.verdict, analysisMode: payload.analysisMode },
  });

  return NextResponse.json({
    token: result.token,
    deletionSecret: result.deletionSecret,
    expiresAt: result.expiresAt,
    shareUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev"}/s/${result.token}`,
  }, { status: 201 });
}
