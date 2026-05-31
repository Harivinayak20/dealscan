import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  let email: string;

  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim() : "";
  } catch {
    return NextResponse.json({ error: "Send a valid email as JSON." }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  // Store to KV or external service when connected.
  // For now, log and acknowledge.
  console.log("[waitlist] signup:", email);

  return NextResponse.json({
    message: "Thanks for subscribing! We'll keep you posted.",
  });
}
