/**
 * OpenAI embedding helpers used by the index builder and the retrieve path.
 */

import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { EMBEDDING_DIMENSIONS, embeddingModelId } from "@/lib/rag/config";

function model() {
  return openai.embeddingModel(embeddingModelId());
}

export async function embedQuery(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: model(),
    value: text,
    providerOptions: {
      openai: { dimensions: EMBEDDING_DIMENSIONS },
    },
  });
  return embedding;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const { embeddings } = await embedMany({
    model: model(),
    values: texts,
    maxParallelCalls: 2,
    providerOptions: {
      openai: { dimensions: EMBEDDING_DIMENSIONS },
    },
  });
  return embeddings;
}
