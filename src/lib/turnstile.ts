/**
 * Cloudflare Turnstile verification.
 *
 * The widget alone proves nothing — a bot can POST straight to the API and skip
 * it entirely. This server-side check is what actually gates the endpoint.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Whether the server is configured to enforce Turnstile at all. */
export function turnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

/**
 * Verify a widget token. Returns true when Turnstile is not configured, so dev
 * and any deploy without keys keep accepting inquiries rather than silently
 * rejecting every visitor.
 */
export async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  if (typeof token !== "string" || !token) return false;

  const form = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "unknown") form.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
      // Never let a slow Cloudflare response hang a customer's submit.
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // Verification unreachable. Fail open: a missed bot is cheaper than a lost
    // customer, and the rate limiter still caps the damage.
    console.error("[turnstile] verification unreachable, allowing request");
    return true;
  }
}
