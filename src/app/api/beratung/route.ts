import { parseContact } from "@/lib/contact-lead";
import { saveLead } from "@/lib/beratung-leads-store";

export const runtime = "nodejs";

type Body = { contact?: unknown };

/**
 * POST /api/beratung — accept a single phone or email lead, dedupe server-side.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
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

  return Response.json({
    ok: true,
    kind: result.lead.kind,
    contact: result.lead.contact,
  });
}
