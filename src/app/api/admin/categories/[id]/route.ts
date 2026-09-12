import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { categoryInputSchema } from "@/lib/admin-schemas";
import { prisma } from "@/lib/db";
import { conflictMessage } from "../route";
import { scheduleReindex } from "@/lib/rag/schedule-reindex";

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
    const before = await prisma.category.findUnique({ where: { id }, select: { slug: true } });
    const updated = await prisma.category.update({
      where: { id },
      data: {
        slug: d.slug,
        name: d.name,
        family: d.family,
        tag: d.tag,
        extraTag: "extraTag" in d ? (d.extraTag ?? null) : undefined,
        summary: d.summary,
        nameEn: "nameEn" in d ? (d.nameEn ?? null) : undefined,
        familyEn: "familyEn" in d ? (d.familyEn ?? null) : undefined,
        tagEn: "tagEn" in d ? (d.tagEn ?? null) : undefined,
        extraTagEn: "extraTagEn" in d ? (d.extraTagEn ?? null) : undefined,
        summaryEn: "summaryEn" in d ? (d.summaryEn ?? null) : undefined,
        useCasesEn: d.useCasesEn ?? undefined,
        metricsEn: "metricsEn" in d ? ((d.metricsEn ?? undefined) as object) : undefined,
        glyph: d.glyph,
        glyphField: d.glyphField,
        useCases: d.useCases ?? undefined,
        metrics: "metrics" in d ? (d.metrics ?? undefined) : undefined,
        visible: d.visible,
        sortOrder: d.sortOrder,
      },
      select: { slug: true },
    });
    if (before && d.slug && d.slug !== before.slug) {
      scheduleReindex(`category:${before.slug}`);
    }
    scheduleReindex(`category:${updated.slug}`);
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
    const existing = await prisma.category.findUnique({ where: { id }, select: { slug: true } });
    await prisma.product.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
    await prisma.category.delete({ where: { id } });
    if (existing) scheduleReindex(`category:${existing.slug}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Nicht gefunden." }, { status: 404 });
  }
}
