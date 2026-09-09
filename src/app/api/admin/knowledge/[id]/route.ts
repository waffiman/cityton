import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { knowledgeBaseInputSchema } from "@/lib/admin-schemas";
import { prisma } from "@/lib/db";
import { scheduleReindex } from "@/lib/rag/schedule-reindex";

export const runtime = "nodejs";

function conflictMessage(err: unknown): string {
  const code = (err as { code?: string })?.code;
  if (code === "P2002") return "Eintrag existiert bereits.";
  return "Speichern fehlgeschlagen.";
}

/**
 * GET /api/admin/knowledge/[id] — fetch a single knowledge base entry.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const item = await prisma.knowledgeBase.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ ok: false, error: "Nicht gefunden." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item });
  } catch (err) {
    console.error("[admin/knowledge/id] GET failed:", err);
    return NextResponse.json(
      { ok: false, error: "Laden fehlgeschlagen." },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/admin/knowledge/[id] — update a knowledge base entry.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const parsed = knowledgeBaseInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Daten." },
      { status: 400 },
    );
  }

  const d = parsed.data;
  try {
    const updated = await prisma.knowledgeBase.update({
      where: { id },
      data: {
        question: d.question,
        answer: d.answer,
        category: d.category ?? null,
        keywords: d.keywords ?? [],
        locale: d.locale,
        visible: d.visible,
        sortOrder: d.sortOrder,
      },
    });

    // Schedule chatbot re-indexing
    scheduleReindex(`kb:${updated.id}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/knowledge/id] PATCH failed:", err);
    return NextResponse.json({ ok: false, error: conflictMessage(err) }, { status: 409 });
  }
}

/**
 * DELETE /api/admin/knowledge/[id] — delete a knowledge base entry.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.knowledgeBase.delete({ where: { id } });

    // Schedule chatbot re-indexing to remove deleted entry
    scheduleReindex(`kb:${id}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/knowledge/id] DELETE failed:", err);
    return NextResponse.json(
      { ok: false, error: "Löschen fehlgeschlagen." },
      { status: 500 },
    );
  }
}
