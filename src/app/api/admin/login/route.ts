import { NextResponse } from "next/server";

const COOKIE_NAME = "admin_token";

export async function POST(request: Request) {
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

  if (token !== expectedToken) {
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
