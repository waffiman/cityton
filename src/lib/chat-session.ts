/**
 * Short-lived chat session cookie.
 *
 * Turnstile is verified once when the widget opens; subsequent /api/chat
 * requests only check this HMAC-signed cookie. Reuses SESSION_SECRET and the
 * same Web Crypto HMAC pattern as the admin session.
 */

export const CHAT_SESSION_COOKIE = "cityton_chat";
const CHAT_SESSION_TTL_SECONDS = 60 * 60 * 4; // 4 hours

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set.");
  return s;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (const b of arr) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toBase64Url(sig);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

/** Create a signed chat session token. */
export async function createChatSessionToken(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + CHAT_SESSION_TTL_SECONDS;
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify({ exp, kind: "chat" })));
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

/** Verify chat session signature, kind, and expiry. */
export async function verifyChatSessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmac(payload);
  if (!timingSafeEqual(sig, expected)) return false;
  try {
    const json = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(
          atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
          (c) => c.charCodeAt(0),
        ),
      ),
    ) as { exp?: number; kind?: string };
    return (
      json.kind === "chat" &&
      typeof json.exp === "number" &&
      json.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

export const CHAT_SESSION_MAX_AGE = CHAT_SESSION_TTL_SECONDS;

/** Cookie options shared by the session route. */
export function chatSessionCookieOptions(token: string) {
  return {
    name: CHAT_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: CHAT_SESSION_MAX_AGE,
  };
}
