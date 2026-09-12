import { validatePartnerInquiry } from "@/lib/partner-inquiry";
import { savePartnerInquiry } from "@/lib/partner-inquiries-store";
import { sendPartnerAutoReply, sendPartnerInquiryNotification } from "@/lib/mailer";
import { allowRequest, clientIp, tooManyRequests } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";

/**
 * POST /api/partner — accept a B2B partnership inquiry.
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

  const parsed = validatePartnerInquiry(record);
  if (!parsed.ok) {
    if (parsed.spam) {
      return Response.json({ ok: true });
    }
    return Response.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const { inquiry } = parsed;
  const result = await savePartnerInquiry(inquiry);

  if (result.status === "duplicate") {
    return Response.json(
      {
        ok: false,
        code: "duplicate",
        error: "Mit diesen Kontaktdaten wurde bereits eine Partneranfrage übermittelt.",
      },
      { status: 409 },
    );
  }

  const sent = await Promise.allSettled([
    sendPartnerInquiryNotification(result.inquiry),
    sendPartnerAutoReply(result.inquiry),
  ]);
  for (const outcome of sent) {
    if (outcome.status === "rejected") {
      console.error("[partner] mail failed:", outcome.reason);
    }
  }

  return Response.json({ ok: true, id: result.inquiry.id });
}
