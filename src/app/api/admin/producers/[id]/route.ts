import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { producerInputSchema } from "@/lib/admin-schemas";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const patchSchema = producerInputSchema.partial();

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Daten." },
      { status: 400 },
    );
  }
  try {
    await prisma.producer.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === "P2025") {
      return NextResponse.json({ ok: false, error: "Nicht gefunden." }, { status: 404 });
    }
    const msg = code === "P2002" ? "Name oder Slug ist bereits vergeben." : "Speichern fehlgeschlagen.";
    return NextResponse.json({ ok: false, error: msg }, { status: 409 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const count = await prisma.product.count({ where: { producerId: id } });
  if (count > 0) {
    return NextResponse.json(
      { ok: false, error: `Hersteller hat noch ${count} Produkt(e). Erst umzuordnen.` },
      { status: 409 },
    );
  }
  try {
    await prisma.producer.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Nicht gefunden." }, { status: 404 });
  }
}
