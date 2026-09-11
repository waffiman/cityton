/**
 * Tunable RAG constants. Kept in one place so retrieval quality and cost
 * knobs are not scattered across route handlers and the index builder.
 */

export const CHUNK_SIZE = 1000;
export const CHUNK_OVERLAP = 150;

/** How many chunks to pass into the generation prompt. */
export const TOP_K = 8;

/** Drop hits below this cosine similarity (0–1). */
export const MIN_SIMILARITY = 0.25;

export const MAX_INPUT_CHARS = 2000;
export const MAX_TURNS = 16;
/** Rough char budget for the assembled context block. */
export const MAX_CONTEXT_CHARS = 12_000;

export const EMBEDDING_DIMENSIONS = Number(process.env.EMBEDDING_DIMENSIONS ?? 1536);

export function chatModel(): string {
  return process.env.CHAT_MODEL?.trim() || "gpt-5.6-luna";
}

export function embeddingModelId(): string {
  return process.env.EMBEDDING_MODEL?.trim() || "text-embedding-3-large";
}

/** Kill switch: missing key or CHAT_ENABLED=false disables the public endpoints. */
export function isChatEnabled(): boolean {
  if (process.env.CHAT_ENABLED === "false") return false;
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}
