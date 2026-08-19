import { validateInquiry } from "@/lib/kontakt-inquiry";
import { saveInquiry } from "@/lib/kontakt-inquiries-store";
import { sendInquiryAutoReply, sendInquiryNotification } from "@/lib/mailer";
import { allowRequest, clientIp, tooManyRequests } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";

/**
 * POST /api/kontakt — accept a full inquiry, validate, honeypot-check, dedupe.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!allowRequest(ip)) return tooManyRequests();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  if (!(await verifyTurnstile(record.turnstileToken, ip))) {
    return Response.json(
      { ok: false, error: "Bot-Prüfung fehlgeschlagen. Bitte Seite neu laden." },
      { status: 400 },
    );
  }

  const parsed = validateInquiry(record);
  if (!parsed.ok) {
    if (parsed.spam) {
      // Pretend success so bots do not retry.
      return Response.json({ ok: true });
    }
    return Response.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const { inquiry } = parsed;
  const result = await saveInquiry({
    keys: inquiry.keys,
    name: inquiry.name,
    objektart: inquiry.objektart,
    flaeche: inquiry.flaeche,
    goals: inquiry.goals,
    message: inquiry.message,
    phone: inquiry.phone,
    email: inquiry.email,
  });

  if (result.status === "duplicate") {
    return Response.json(
      {
        ok: false,
        code: "duplicate",
        error: "Mit diesen Kontaktdaten wurde bereits eine Anfrage übermittelt.",
      },
      { status: 409 },
    );
  }

  // Best effort: the lead is already saved, so a mail failure must not surface
  // as a failed submission. Log rejections so a broken SMTP config is visible
  // in the container logs rather than silently swallowed.
  const sent = await Promise.allSettled([
    sendInquiryNotification(result.inquiry),
    sendInquiryAutoReply(result.inquiry),
  ]);
  for (const outcome of sent) {
    if (outcome.status === "rejected") {
      console.error("[kontakt] mail failed:", outcome.reason);
    }
  }

  return Response.json({ ok: true, id: result.inquiry.id });
}
