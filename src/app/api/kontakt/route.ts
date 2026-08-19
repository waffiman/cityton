import { validateInquiry } from "@/lib/kontakt-inquiry";
import { saveInquiry } from "@/lib/kontakt-inquiries-store";

export const runtime = "nodejs";

/**
 * POST /api/kontakt — accept a full inquiry, validate, honeypot-check, dedupe.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = validateInquiry(body as Record<string, unknown>);
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

  return Response.json({ ok: true, id: result.inquiry.id });
}
