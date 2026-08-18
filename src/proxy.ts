import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Guards the admin panel. Unauthenticated /admin/** requests are redirected to
 * the login page; unauthenticated /api/admin/** requests get 401. The login page
 * and login endpoint are always reachable. Public APIs (/api/kontakt,
 * /api/beratung) are not matched here.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Always allow the login screen and its endpoints through.
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = await verifySessionToken(token);
  if (authed) return NextResponse.next();

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  if (pathname !== "/admin") loginUrl.searchParams.set("from", pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
