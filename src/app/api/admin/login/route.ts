import { NextResponse } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const COOKIE_NAME = "admin_token";

function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  let diff = aBytes.length === bBytes.length ? 0 : 1;
  for (let i = 0; i < Math.max(aBytes.length, bBytes.length); i++) {
    diff |= (aBytes[i % aBytes.length] ?? 0) ^ (bBytes[i % bBytes.length] ?? 0);
  }
  return diff === 0;
}

export async function POST(request: Request) {
  const rl = checkRateLimit(request, 5);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterMs, 5);

  const expectedToken = process.env.ADMIN_TOKEN;

  if (!expectedToken) {
    return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
  }

  let token = "";
  try {
    const body = (await request.json()) as { token?: unknown };
    token = typeof body.token === "string" ? body.token : "";
  } catch {
    return NextResponse.json({ error: "Send a valid admin token." }, { status: 400 });
  }

  if (!timingSafeEqual(token, expectedToken)) {
    return NextResponse.json({ error: "Invalid admin token." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}
