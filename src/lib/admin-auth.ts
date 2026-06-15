import { cookies } from "next/headers";

// Server-side admin check. Mirrors the /api/admin/login + /api/admin/session
// cookie scheme so server components never expose data to unauthenticated users.
export async function isAdmin(): Promise<boolean> {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const token = (await cookies()).get("admin_token")?.value;
  return !!token && token === expected;
}
