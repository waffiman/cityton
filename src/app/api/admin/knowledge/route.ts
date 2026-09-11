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
 * GET /api/admin/knowledge — list all knowledge base entries.
 */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await prisma.knowledgeBase.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ ok: true, items });
  } catch (err) {
    console.error("[admin/knowledge] GET failed:", err);
    return NextResponse.json(
      { ok: false, error: "Laden fehlgeschlagen." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/knowledge — create a new knowledge base entry.
 */
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

  const parsed = knowledgeBaseInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Daten." },
      { status: 400 },
    );
  }

  const d = parsed.data;
  try {
    const created = await prisma.knowledgeBase.create({
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

    // Schedule chatbot re-indexing to include the new entry
    scheduleReindex(`kb:${created.id}`);

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    console.error("[admin/knowledge] POST failed:", err);
    return NextResponse.json({ ok: false, error: conflictMessage(err) }, { status: 409 });
  }
}
