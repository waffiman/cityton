import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { routing } from "./i18n/routing";

// Next.js 16 renamed middleware.ts -> proxy.ts (same API, new file/export
// name) — next-intl's own docs already reflect this, so this is their
// documented setup, not an adaptation.
const intlProxy = createMiddleware(routing);

/**
 * Guards the admin panel. Unauthenticated /admin/** requests are redirected to
 * the login page; unauthenticated /api/admin/** requests get 401. The login page
 * and login endpoint are always reachable. Public APIs (/api/kontakt,
 * /api/beratung) fall through untouched — see the /api/ branch in `proxy`.
 *
 * The admin panel is excluded from locale routing entirely (see `config`
 * below) — this runs instead of next-intl's proxy for those paths, never
 * alongside it.
 */
async function adminGuard(request: NextRequest) {
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

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return adminGuard(request);
  }
  // Route handlers live outside the [locale] segment, so they must never reach
  // the locale proxy: it rewrites /api/kontakt to /de/api/kontakt, which does
  // not exist, and the lead forms 404 instead of submitting. The matcher below
  // can't express this on its own — excluding /api there would also drop the
  // /api/admin guard above.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }
  return intlProxy(request);
}

export const config = {
  // Runs on every route except Next internals and static files — the
  // function above dispatches admin paths to adminGuard and everything else
  // to next-intl's locale proxy, so both need to be reachable here.
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
