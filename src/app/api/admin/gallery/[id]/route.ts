import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { galleryItemInputSchema } from "@/lib/admin-schemas";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// Caption edits send the changed fields; the visibility badge and the reorder
// arrows send a single key each.
const patchSchema = galleryItemInputSchema.partial();

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
    await prisma.galleryItem.update({
      where: { id },
      data: { ...d, posterUrl: "posterUrl" in d ? (d.posterUrl ?? null) : undefined },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === "P2025") {
      return NextResponse.json({ ok: false, error: "Nicht gefunden." }, { status: 404 });
    }
    const msg =
      code === "P2002" ? "Dieses Bild ist bereits in der Galerie." : "Speichern fehlgeschlagen.";
    return NextResponse.json({ ok: false, error: msg }, { status: 409 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    // Only the row goes. The file stays in the uploads volume (or in the repo,
    // for the imported originals) so a mis-click is undoable by re-adding it.
    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Nicht gefunden." }, { status: 404 });
  }
}
