/**
 * Grounded system prompt for the City-Ton assistant.
 */

import type { RetrievedChunk } from "@/lib/rag/retrieve";
import { MAX_CONTEXT_CHARS } from "@/lib/rag/config";

/** Prefix a locale-agnostic path for citation links. */
export function localePath(locale: "de" | "en", path: string | null | undefined): string | null {
  if (!path) return null;
  if (locale === "en") {
    if (path === "/") return "/en";
    return path.startsWith("/en") ? path : `/en${path}`;
  }
  return path;
}

export function buildSystemPrompt(
  locale: "de" | "en",
  chunks: RetrievedChunk[],
): string {
  const lang = locale === "en" ? "English" : "German";
  const contactPath = localePath(locale, "/kontakt") ?? "/kontakt";

  let context = "";
  for (const chunk of chunks) {
    const cite = localePath(locale, chunk.url);
    const block = [
      `### ${chunk.title}`,
      cite ? `URL: ${cite}` : null,
      chunk.content,
    ]
      .filter(Boolean)
      .join("\n");
    if (context.length + block.length > MAX_CONTEXT_CHARS) break;
    context = context ? `${context}\n\n${block}` : block;
  }

  return [
    `You are the digital specialist advisor for City-Ton Austria (Vienna) — Sonnenschutz-, UV-, Energiespar- und Sicherheitsfolien by LLumar and Armolan.`,
    `Answer professionally, clearly, friendly, and confidently.`,
    `Do not use unnecessarily uncertain phrasing such as "maybe", "possibly", or "perhaps" when a technical product property is clearly established.`,
    `Explain technical content in an understandable and precise way.`,
    `Answer ONLY from the CONTEXT below. If the context does not contain the answer, say you do not know and invite the visitor to the contact form at ${contactPath} for a free on-site consultation.`,
    `Always answer in ${lang}, even when CONTEXT passages are in German. Do not apologise for the language of the source material.`,
    `Never invent prices, discounts, or delivery times. Prices are never listed online — every job is calculated after an on-site visit.`,
    `When pointing the visitor to a page, use a Markdown link with a short human label, never the path as the label.`,
    `Correct: [contact form](${contactPath}) or [free consultation](${contactPath}).`,
    `Wrong: [${contactPath}](${contactPath}) or bare ${contactPath} with no link.`,
    `Use at most one or two links per answer.`,
    `Be concise and practical. Prefer metric film specs (VLT, TSER, g-Wert, UV) when recommending films.`,
    `If the visitor offers a name plus phone or email and wants a callback, call the erfasseKontakt tool. Do not claim a human has been notified until the tool succeeds.`,
    ``,
    `CONTEXT:`,
    context || "(no matching passages)",
  ].join("\n");
}
