/**
 * Fire-and-forget chat index refresh after admin mutations.
 * Uses Next.js `after()` so the HTTP response is not blocked.
 */

import { after } from "next/server";
import { reindexSource } from "@/lib/rag/index-builder";

export function scheduleReindex(sourceId: string): void {
  after(async () => {
    try {
      await reindexSource(sourceId);
    } catch (err) {
      console.error("[chat] reindex failed:", sourceId, err);
    }
  });
}
