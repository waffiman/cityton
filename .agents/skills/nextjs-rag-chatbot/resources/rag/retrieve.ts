/**
 * In-memory cosine retrieval over ChatChunk rows.
 *
 * At a few thousand chunks a sequential scan is single-digit milliseconds and
 * avoids a pgvector migration. The cache reloads after the index builder calls
 * `invalidateRetrievalCache`.
 */

import { cosineSimilarity } from "ai";
import { prisma } from "@/lib/db";
import { MIN_SIMILARITY, TOP_K } from "@/lib/rag/config";
import { embedQuery } from "@/lib/rag/embed";

export type RetrievedChunk = {
  id: string;
  sourceId: string;
  locale: string;
  title: string;
  url: string | null;
  content: string;
  similarity: number;
};

type CacheRow = {
  id: string;
  sourceId: string;
  locale: string;
  title: string;
  url: string | null;
  content: string;
  embedding: number[];
};

let cache: CacheRow[] | null = null;
let loading: Promise<CacheRow[]> | null = null;

async function loadCache(): Promise<CacheRow[]> {
  if (cache) return cache;
  if (loading) return loading;
  loading = (async () => {
    const rows = await prisma.chatChunk.findMany({
      select: {
        id: true,
        sourceId: true,
        locale: true,
        title: true,
        url: true,
        content: true,
        embedding: true,
      },
    });
    cache = rows.map((r) => ({
      ...r,
      embedding: r.embedding as number[],
    }));
    loading = null;
    return cache;
  })();
  return loading;
}

export function invalidateRetrievalCache(): void {
  cache = null;
  loading = null;
}

function scoreAll(query: number[], rows: CacheRow[]): RetrievedChunk[] {
  const scored: RetrievedChunk[] = [];
  for (const row of rows) {
    if (!row.embedding?.length) continue;
    const similarity = cosineSimilarity(query, row.embedding);
    if (similarity < MIN_SIMILARITY) continue;
    scored.push({
      id: row.id,
      sourceId: row.sourceId,
      locale: row.locale,
      title: row.title,
      url: row.url,
      content: row.content,
      similarity,
    });
  }
  scored.sort((a, b) => b.similarity - a.similarity);
  return scored;
}

/**
 * Retrieve top-k chunks for one or more query strings (union + dedupe by id).
 * Prefer the visitor's locale when similarities are within 0.02 of each other.
 */
export async function retrieveChunks(
  queries: string[],
  opts: { locale?: string; topK?: number } = {},
): Promise<RetrievedChunk[]> {
  const topK = opts.topK ?? TOP_K;
  const locale = opts.locale;
  const rows = await loadCache();
  if (!rows.length || !queries.length) return [];

  const uniqueQueries = [...new Set(queries.map((q) => q.trim()).filter(Boolean))];
  const embeddings = await Promise.all(uniqueQueries.map((q) => embedQuery(q)));

  const best = new Map<string, RetrievedChunk>();
  for (const embedding of embeddings) {
    for (const hit of scoreAll(embedding, rows)) {
      const prev = best.get(hit.id);
      if (!prev || hit.similarity > prev.similarity) best.set(hit.id, hit);
    }
  }

  const ranked = [...best.values()].sort((a, b) => {
    if (locale && Math.abs(a.similarity - b.similarity) < 0.02) {
      const aMatch = a.locale === locale ? 1 : 0;
      const bMatch = b.locale === locale ? 1 : 0;
      if (aMatch !== bMatch) return bMatch - aMatch;
    }
    return b.similarity - a.similarity;
  });

  return ranked.slice(0, topK);
}
