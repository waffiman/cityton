#!/usr/bin/env tsx
/**
 * Build / refresh the chat retrieval index.
 * Usage: npm run chat:index
 */

import "dotenv/config";
import { buildChatIndex } from "../src/lib/rag/index-builder";
import { isChatEnabled } from "../src/lib/rag/config";

async function main() {
  if (!isChatEnabled()) {
    console.log("[chat:index] Skipped — OPENAI_API_KEY missing or CHAT_ENABLED=false.");
    return;
  }
  console.log("[chat:index] Building index…");
  const stats = await buildChatIndex();
  console.log(
    `[chat:index] Done. sources=${stats.sources} unchanged=${stats.unchanged} ` +
      `updated=${stats.updated} chunksWritten=${stats.chunksWritten} ` +
      `orphansRemoved=${stats.deletedOrphans}`,
  );
}

main().catch((err) => {
  console.error("[chat:index] Failed:", err);
  process.exit(1);
});
