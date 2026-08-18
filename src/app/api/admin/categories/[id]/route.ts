import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { categoryInputSchema } from "@/lib/admin-schemas";
import { prisma } from "@/lib/db";
import { conflictMessage } from "../route";

export const runtime = "nodejs";

// Full edit sends the whole object; the list toggle sends { visible }.
const patchSchema = categoryInputSchema.partial();

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
  const d = parsed.data;
  try {
    await prisma.category.update({
      where: { id },
      data: {
        slug: d.slug,
        name: d.name,
        family: d.family,
        tag: d.tag,
        extraTag: "extraTag" in d ? (d.extraTag ?? null) : undefined,
        summary: d.summary,
        glyph: d.glyph,
        glyphField: d.glyphField,
        useCases: d.useCases ?? undefined,
        metrics: "metrics" in d ? (d.metrics ?? undefined) : undefined,
        visible: d.visible,
        sortOrder: d.sortOrder,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === "P2025") {
      return NextResponse.json({ ok: false, error: "Nicht gefunden." }, { status: 404 });
    }
    return NextResponse.json({ ok: false, error: conflictMessage(err) }, { status: 409 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  // Detach products first so the FK does not block deletion.
  try {
    await prisma.product.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Nicht gefunden." }, { status: 404 });
  }
}
