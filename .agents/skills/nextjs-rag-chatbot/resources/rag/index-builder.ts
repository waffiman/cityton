/**
 * Incremental chat index builder.
 *
 * For each source document: if `sourceHash` already matches stored chunks,
 * skip. Otherwise delete old chunks for that sourceId, split, embed, insert.
 * Orphan sourceIds (present in DB, absent from the current corpus) are removed
 * on a full rebuild.
 */

import { prisma } from "@/lib/db";
import { splitText } from "@/lib/rag/chunk";
import { CHUNK_OVERLAP, CHUNK_SIZE, isChatEnabled } from "@/lib/rag/config";
import { embedTexts } from "@/lib/rag/embed";
import {
  collectAllSources,
  collectSourcesByPrefix,
  type SourceDoc,
} from "@/lib/rag/sources";
import { invalidateRetrievalCache } from "@/lib/rag/retrieve";

export type BuildStats = {
  sources: number;
  unchanged: number;
  updated: number;
  chunksWritten: number;
  deletedOrphans: number;
};

async function upsertSource(doc: SourceDoc): Promise<{ wrote: number; skipped: boolean }> {
  const existing = await prisma.chatChunk.findFirst({
    where: { sourceId: doc.sourceId },
    select: { sourceHash: true },
  });
  if (existing?.sourceHash === doc.sourceHash) {
    return { wrote: 0, skipped: true };
  }

  await prisma.chatChunk.deleteMany({ where: { sourceId: doc.sourceId } });

  const pieces = splitText(doc.content, {
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });
  if (!pieces.length) return { wrote: 0, skipped: false };

  const embeddings = await embedTexts(pieces);
  await prisma.chatChunk.createMany({
    data: pieces.map((content, i) => ({
      sourceId: doc.sourceId,
      sourceHash: doc.sourceHash,
      locale: doc.locale,
      title: doc.title,
      url: doc.url,
      content,
      embedding: embeddings[i] ?? [],
    })),
  });
  return { wrote: pieces.length, skipped: false };
}

async function indexDocuments(docs: SourceDoc[], pruneOrphans: boolean): Promise<BuildStats> {
  const stats: BuildStats = {
    sources: docs.length,
    unchanged: 0,
    updated: 0,
    chunksWritten: 0,
    deletedOrphans: 0,
  };

  for (const doc of docs) {
    const result = await upsertSource(doc);
    if (result.skipped) stats.unchanged += 1;
    else {
      stats.updated += 1;
      stats.chunksWritten += result.wrote;
    }
  }

  if (pruneOrphans) {
    const keep = new Set(docs.map((d) => d.sourceId));
    const present = await prisma.chatChunk.findMany({
      distinct: ["sourceId"],
      select: { sourceId: true },
    });
    const orphans = present.map((r) => r.sourceId).filter((id) => !keep.has(id));
    if (orphans.length) {
      const deleted = await prisma.chatChunk.deleteMany({
        where: { sourceId: { in: orphans } },
      });
      stats.deletedOrphans = deleted.count;
    }
  }

  invalidateRetrievalCache();
  return stats;
}

/** Full corpus rebuild (deploy / npm run chat:index). */
export async function buildChatIndex(): Promise<BuildStats> {
  if (!isChatEnabled()) {
    return { sources: 0, unchanged: 0, updated: 0, chunksWritten: 0, deletedOrphans: 0 };
  }
  const docs = await collectAllSources();
  return indexDocuments(docs, true);
}

/**
 * Reindex one source (or family). Used from admin mutation routes after edits.
 * Pass a full sourceId (`product:folie-r20`) or a prefix (`gallery:<id>`).
 */
export async function reindexSource(sourceId: string): Promise<BuildStats> {
  if (!isChatEnabled()) {
    return { sources: 0, unchanged: 0, updated: 0, chunksWritten: 0, deletedOrphans: 0 };
  }
  const docs = await collectSourcesByPrefix(sourceId);
  if (!docs.length) {
    // Source gone — drop its chunks.
    await prisma.chatChunk.deleteMany({
      where: {
        OR: [{ sourceId }, { sourceId: { startsWith: `${sourceId}:` } }],
      },
    });
    invalidateRetrievalCache();
    return { sources: 0, unchanged: 0, updated: 0, chunksWritten: 0, deletedOrphans: 1 };
  }
  return indexDocuments(docs, false);
}
