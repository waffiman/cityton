import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { producerInputSchema } from "@/lib/admin-schemas";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }
  const parsed = producerInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Daten." },
      { status: 400 },
    );
  }
  const d = parsed.data;
  try {
    const created = await prisma.producer.create({ data: d });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    const code = (err as { code?: string })?.code;
    const msg = code === "P2002" ? "Name oder Slug ist bereits vergeben." : "Speichern fehlgeschlagen.";
    return NextResponse.json({ ok: false, error: msg }, { status: 409 });
  }
}
