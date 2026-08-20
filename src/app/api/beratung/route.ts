import { parseContact } from "@/lib/contact-lead";
import { saveLead } from "@/lib/beratung-leads-store";
import { sendLeadNotification } from "@/lib/mailer";
import { allowRequest, clientIp, tooManyRequests } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";

type Body = { contact?: unknown; turnstileToken?: unknown };

/**
 * POST /api/beratung — accept a single phone or email lead, dedupe server-side.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!allowRequest(ip)) return tooManyRequests();

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return Response.json(
      { ok: false, error: "Bot-Prüfung fehlgeschlagen. Bitte Seite neu laden." },
      { status: 400 },
    );
  }

  if (typeof body.contact !== "string") {
    return Response.json(
      { ok: false, error: "Bitte Telefonnummer oder E-Mail eingeben." },
      { status: 400 },
    );
  }

  const parsed = parseContact(body.contact);
  if (!parsed.ok) {
    return Response.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const result = await saveLead({
    key: parsed.key,
    kind: parsed.kind,
    contact: parsed.display,
  });

  if (result.status === "duplicate") {
    return Response.json(
      {
        ok: false,
        code: "duplicate",
        error: "Diese Kontaktangabe wurde bereits übermittelt.",
      },
      { status: 409 },
    );
  }

  // Best effort — the lead is saved either way, but a failure must still be
  // visible in the logs.
  try {
    await sendLeadNotification(result.lead.kind, result.lead.contact);
  } catch (err) {
    console.error("[beratung] mail failed:", err);
  }

  return Response.json({
    ok: true,
    kind: result.lead.kind,
    contact: result.lead.contact,
  });
}
