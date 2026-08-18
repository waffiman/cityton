import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { productInputSchema } from "@/lib/admin-schemas";
import { prisma } from "@/lib/db";
import { conflictMessage } from "../route";

export const runtime = "nodejs";

// Full edit sends the whole object; the list toggle sends a partial (e.g. { visible }).
const patchSchema = productInputSchema.partial();

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
    await prisma.product.update({
      where: { id },
      data: {
        code: d.code,
        name: d.name,
        slug: d.slug,
        family: d.family,
        mount: d.mount,
        producerId: d.producerId,
        categoryId: "categoryId" in d ? (d.categoryId ?? null) : undefined,
        thicknessMil: "thicknessMil" in d ? (d.thicknessMil ?? null) : undefined,
        thicknessMicron: "thicknessMicron" in d ? (d.thicknessMicron ?? null) : undefined,
        application: "application" in d ? (d.application ?? null) : undefined,
        certification: "certification" in d ? (d.certification ?? null) : undefined,
        note: "note" in d ? (d.note ?? null) : undefined,
        single: d.single ?? undefined,
        dual: "dual" in d ? (d.dual ?? undefined) : undefined,
        imageUrl: "imageUrl" in d ? (d.imageUrl ?? null) : undefined,
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
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Nicht gefunden." }, { status: 404 });
  }
}
