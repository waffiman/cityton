/**
 * Minimal in-memory rate limiter for the public POST endpoints.
 *
 * Deliberately not backed by Redis: at this traffic level a per-process sliding
 * window is enough, and losing the counters on redeploy is harmless. It exists
 * to stop a bot from filling the Inquiry table, not to be a security boundary.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 12;
/** Stop the map from growing without bound if many IPs hit the endpoint. */
const MAX_TRACKED_IPS = 10_000;

const hits = new Map<string, number[]>();

/**
 * Client IP as seen behind the reverse proxy. The app binds 127.0.0.1:3000, so
 * the socket address is always the proxy — x-forwarded-for is what identifies
 * the caller. The left-most entry is the original client.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** True when the caller is still within its allowance (and records the hit). */
export function allowRequest(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return false;
  }

  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > MAX_TRACKED_IPS) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return true;
}

/** 429 response shared by both public endpoints. */
export function tooManyRequests(): Response {
  return Response.json(
    { ok: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
    { status: 429 },
  );
}
