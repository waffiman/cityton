import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { categoryInputSchema } from "@/lib/admin-schemas";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export function conflictMessage(err: unknown): string {
  const code = (err as { code?: string })?.code;
  if (code === "P2002") return "Slug ist bereits vergeben.";
  return "Speichern fehlgeschlagen.";
}

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
  const parsed = categoryInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Daten." },
      { status: 400 },
    );
  }
  const d = parsed.data;
  try {
    const created = await prisma.category.create({
      data: {
        slug: d.slug,
        name: d.name,
        family: d.family,
        tag: d.tag,
        extraTag: d.extraTag ?? null,
        summary: d.summary,
        glyph: d.glyph,
        glyphField: d.glyphField,
        useCases: d.useCases,
        metrics: d.metrics ?? undefined,
        visible: d.visible,
        sortOrder: d.sortOrder,
      },
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    return NextResponse.json({ ok: false, error: conflictMessage(err) }, { status: 409 });
  }
}
