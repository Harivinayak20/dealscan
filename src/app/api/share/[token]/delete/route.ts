import { NextResponse } from "next/server";
import { deleteShare } from "@/lib/share-storage";
import { recordEvent } from "@/lib/analytics";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const rl = await checkRateLimit(request, 5, 60_000);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterMs, 5);

  const { token } = await params;
  let deletionSecret: string;

  try {
    const body = await request.json();
    deletionSecret = body.deletionSecret as string;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!deletionSecret || deletionSecret.length !== 32) {
    return NextResponse.json({ error: "Invalid deletion secret." }, { status: 400 });
  }

  const deleted = await deleteShare(token, deletionSecret);
  if (!deleted) {
    return NextResponse.json({ error: "Share not found or invalid deletion secret." }, { status: 404 });
  }

  await recordEvent({
    type: "share_deleted",
    path: "/s/[share]",
    meta: {},
  });

  return NextResponse.json({ success: true });
}
