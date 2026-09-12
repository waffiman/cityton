import { NextResponse } from "next/server";
import { chatSessionCookieOptions, createChatSessionToken } from "@/lib/chat-session";
import { isChatEnabled } from "@/lib/rag/config";
import { allowRequest, clientIp, tooManyRequests } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

type Body = { turnstileToken?: unknown };

/**
 * POST /api/chat/session — verify Turnstile once and set the chat session cookie.
 */
export async function POST(request: Request) {
  if (!isChatEnabled()) {
    return NextResponse.json({ ok: false, error: "Chat disabled." }, { status: 503 });
  }

  const ip = clientIp(request);
  if (!allowRequest(ip)) return tooManyRequests();

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json(
      { ok: false, error: "Bot-Prüfung fehlgeschlagen. Bitte Seite neu laden." },
      { status: 400 },
    );
  }

  try {
    const token = await createChatSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(chatSessionCookieOptions(token));
    return response;
  } catch (err) {
    console.error("[chat/session] failed:", err);
    return NextResponse.json({ ok: false, error: "Session konnte nicht erstellt werden." }, { status: 500 });
  }
}
