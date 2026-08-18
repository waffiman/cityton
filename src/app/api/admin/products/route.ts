import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { productInputSchema } from "@/lib/admin-schemas";
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
  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Daten." },
      { status: 400 },
    );
  }
  const d = parsed.data;
  try {
    const created = await prisma.product.create({
      data: {
        code: d.code,
        name: d.name,
        slug: d.slug,
        family: d.family,
        mount: d.mount,
        producerId: d.producerId,
        categoryId: d.categoryId ?? null,
        thicknessMil: d.thicknessMil ?? null,
        thicknessMicron: d.thicknessMicron ?? null,
        application: d.application ?? null,
        certification: d.certification ?? null,
        note: d.note ?? null,
        single: d.single,
        dual: d.dual ?? undefined,
        imageUrl: d.imageUrl ?? null,
        visible: d.visible,
        sortOrder: d.sortOrder,
      },
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    return NextResponse.json({ ok: false, error: conflictMessage(err) }, { status: 409 });
  }
}

export function conflictMessage(err: unknown): string {
  const code = (err as { code?: string })?.code;
  if (code === "P2002") return "Code oder Slug ist bereits vergeben.";
  if (code === "P2003") return "Ungültiger Hersteller oder Serie.";
  return "Speichern fehlgeschlagen.";
}
