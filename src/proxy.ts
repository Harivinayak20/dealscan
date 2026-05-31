import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin") {
    return NextResponse.next();
  }

  const expectedToken = process.env.ADMIN_TOKEN;
  const token = request.cookies.get("admin_token")?.value;

  if (!expectedToken || token !== expectedToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/deployment-dashboard", "/docs/:path*"],
};
