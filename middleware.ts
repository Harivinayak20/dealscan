import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const isWorkersDev = host.endsWith(".workers.dev");
  const { pathname } = request.nextUrl;

  // Admin auth
  if (pathname.startsWith("/admin") || pathname === "/deployment-dashboard") {
    if (pathname === "/admin") {
      const response = NextResponse.next();
      if (isWorkersDev) response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }

    const expectedToken = process.env.ADMIN_TOKEN;
    const token = request.cookies.get("admin_token")?.value;

    if (!expectedToken || token !== expectedToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    const response = NextResponse.next();
    if (isWorkersDev) response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  // Block workers.dev from search engine indexing
  if (isWorkersDev) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/deployment-dashboard",
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)",
  ],
};
