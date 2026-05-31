import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function GET() {
  const expectedToken = process.env.ADMIN_TOKEN;
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  return NextResponse.json({ authenticated: !!expectedToken && token === expectedToken });
}
