import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { knowledgeBaseImportSchema } from "@/lib/admin-schemas";
import { prisma } from "@/lib/db";
import { scheduleReindex } from "@/lib/rag/schedule-reindex";

export const runtime = "nodejs";

/** Question + locale identify an entry across re-imports of the same file. */
function dedupeKey(question: string, locale: string): string {
  return `${locale}::${question.trim().toLowerCase()}`;
}

/**
 * POST /api/admin/knowledge/bulk — import many Q&A entries from a JSON file.
 *
 * Idempotent by question + locale: re-importing the same file either skips the
 * existing entries or overwrites them, depending on `mode`.
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

  const parsed = knowledgeBaseImportSchema.safeParse(body);
  if (!parsed.success) {
    // Point at the offending array position so the file can be fixed.
    const issues = parsed.error.issues.slice(0, 10).map((issue) => {
      const index = typeof issue.path[1] === "number" ? issue.path[1] : null;
      return index === null ? issue.message : `Eintrag ${index + 1}: ${issue.message}`;
    });
    return NextResponse.json(
      { ok: false, error: issues[0] ?? "Ungültige Daten.", issues },
      { status: 400 },
    );
  }

  const { entries, mode } = parsed.data;

  // Last occurrence wins for duplicates inside the uploaded file itself.
  const byKey = new Map<string, (typeof entries)[number]>();
  for (const entry of entries) byKey.set(dedupeKey(entry.question, entry.locale), entry);
  const duplicatesInFile = entries.length - byKey.size;

  try {
    const existing = await prisma.knowledgeBase.findMany({
      select: { id: true, question: true, locale: true },
    });
    const existingByKey = new Map(
      existing.map((row) => [dedupeKey(row.question, row.locale), row.id]),
    );

    const toCreate: (typeof entries)[number][] = [];
    const toUpdate: { id: string; entry: (typeof entries)[number] }[] = [];
    let skipped = duplicatesInFile;

    for (const [key, entry] of byKey) {
      const existingId = existingByKey.get(key);
      if (!existingId) {
        toCreate.push(entry);
      } else if (mode === "update") {
        toUpdate.push({ id: existingId, entry });
      } else {
        skipped += 1;
      }
    }

    await prisma.$transaction([
      ...(toCreate.length
        ? [
            prisma.knowledgeBase.createMany({
              data: toCreate.map((entry) => ({
                question: entry.question,
                answer: entry.answer,
                category: entry.category ?? null,
                keywords: entry.keywords ?? [],
                locale: entry.locale,
                visible: entry.visible,
                sortOrder: entry.sortOrder,
              })),
            }),
          ]
        : []),
      ...toUpdate.map(({ id, entry }) =>
        prisma.knowledgeBase.update({
          where: { id },
          data: {
            question: entry.question,
            answer: entry.answer,
            category: entry.category ?? null,
            keywords: entry.keywords ?? [],
            locale: entry.locale,
            visible: entry.visible,
            sortOrder: entry.sortOrder,
          },
        }),
      ),
    ]);

    // One pass over the whole knowledge base instead of one per entry.
    if (toCreate.length || toUpdate.length) scheduleReindex("kb:");

    return NextResponse.json({
      ok: true,
      created: toCreate.length,
      updated: toUpdate.length,
      skipped,
      total: entries.length,
    });
  } catch (err) {
    console.error("[admin/knowledge/bulk] POST failed:", err);
    return NextResponse.json({ ok: false, error: "Import fehlgeschlagen." }, { status: 500 });
  }
}
