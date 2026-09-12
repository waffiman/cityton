/**
 * Minimal in-memory rate limiter for the public POST endpoints.
 *
 * Deliberately not backed by Redis: at this traffic level a per-process sliding
 * window is enough, and losing the counters on redeploy is harmless. It exists
 * to stop a bot from filling the Inquiry table, not to be a security boundary.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 12;
/** Chat is more expensive (LLM) — tighter budget than form posts. */
const CHAT_WINDOW_MS = 10 * 60 * 1000;
const CHAT_MAX_HITS = 15;
/** Stop the map from growing without bound if many IPs hit the endpoint. */
const MAX_TRACKED_IPS = 10_000;

const hits = new Map<string, number[]>();
const chatHits = new Map<string, number[]>();

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

function allowInMap(
  map: Map<string, number[]>,
  ip: string,
  windowMs: number,
  maxHits: number,
): boolean {
  const now = Date.now();
  const recent = (map.get(ip) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= maxHits) {
    map.set(ip, recent);
    return false;
  }

  recent.push(now);
  map.set(ip, recent);

  if (map.size > MAX_TRACKED_IPS) {
    for (const [key, times] of map) {
      if (times.every((t) => now - t >= windowMs)) map.delete(key);
    }
  }

  return true;
}

/** True when the caller is still within its allowance (and records the hit). */
export function allowRequest(ip: string): boolean {
  return allowInMap(hits, ip, WINDOW_MS, MAX_HITS);
}

/** Tighter limiter for /api/chat (LLM cost). */
export function allowChatRequest(ip: string): boolean {
  return allowInMap(chatHits, `chat:${ip}`, CHAT_WINDOW_MS, CHAT_MAX_HITS);
}

/** 429 response shared by both public endpoints. */
export function tooManyRequests(): Response {
  return Response.json(
    { ok: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
    { status: 429 },
  );
}
