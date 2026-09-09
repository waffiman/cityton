/**
 * Rewrite the latest user turn into a standalone retrieval query.
 * For English locale, also emit a German paraphrase so we can match the
 * German-only technical corpus without relying on cross-lingual embeddings alone.
 */

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { chatModel } from "@/lib/rag/config";

export type ChatTurn = { role: "user" | "assistant"; content: string };

const rewriteSchema = z.object({
  standalone: z
    .string()
    .describe("Self-contained search query in the user's language, resolving pronouns/follow-ups."),
  german: z
    .string()
    .nullable()
    .describe(
      "German paraphrase of the same intent for retrieving German technical content. Null when the user already wrote German or no paraphrase helps.",
    ),
});

export type RewriteResult = {
  standalone: string;
  german: string | null;
};

export async function rewriteQuery(
  messages: ChatTurn[],
  locale: "de" | "en",
): Promise<RewriteResult> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return { standalone: "", german: null };

  // Single-turn German: no rewrite needed.
  if (messages.filter((m) => m.role === "user").length === 1 && locale === "de") {
    return { standalone: lastUser.content.trim(), german: null };
  }

  const history = messages
    .slice(-8)
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  try {
    const { object } = await generateObject({
      model: openai(chatModel()),
      schema: rewriteSchema,
      system:
        "You prepare search queries for a retrieval system about Austrian window films " +
        "(Sonnenschutz, UV, Sicherheit, Energiesparen). Resolve follow-up pronouns into a " +
        "standalone query. If locale is en, also provide a concise German paraphrase that " +
        "uses product/technical terms (VLT, TSER, g-Wert, Sonnenschutzfolie, Sicherheitsfolie). " +
        "If locale is de, set german to null unless the user mixed languages.",
      prompt: `Locale: ${locale}\n\nConversation:\n${history}\n\nRewrite the latest user message.`,
    });

    return {
      standalone: object.standalone?.trim() || lastUser.content.trim(),
      german: object.german?.trim() || null,
    };
  } catch (err) {
    console.error("[chat] rewrite failed:", err);
    return {
      standalone: lastUser.content.trim(),
      german: locale === "en" ? lastUser.content.trim() : null,
    };
  }
}
