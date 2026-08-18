import { NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/admin-password";
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { password?: unknown };
  try {
    body = (await request.json()) as { password?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (typeof body.password !== "string" || !verifyAdminPassword(body.password)) {
    return NextResponse.json({ ok: false, error: "Falsches Passwort." }, { status: 401 });
  }

  // Mark the cookie Secure only when the request actually arrived over HTTPS
  // (directly or via a TLS-terminating proxy). Over plain HTTP — e.g. accessing
  // the server by IP before a certificate is set up — a Secure cookie would be
  // dropped by the browser, so the session must not require it there.
  const isHttps =
    request.headers.get("x-forwarded-proto") === "https" ||
    new URL(request.url).protocol === "https:";

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
