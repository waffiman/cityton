/**
 * Gather every document the chat index should know about.
 *
 * Each document gets a stable `sourceId` and a content hash so the builder can
 * skip unchanged sources. Prose-only: structural key modules (home/about/
 * principles/kontakt.ts) and series.ts (already seeded into Category) are
 * intentionally skipped — see the RAG plan.
 */

import { createHash } from "node:crypto";
import { seriesCertificates } from "@/content/certificates";
import { site } from "@/content/site";
import { prisma } from "@/lib/db";
import { TERM_TOOLTIPS } from "@/lib/term-tooltips";
import type { FilmValues } from "@/content/series";
import deMessages from "@/messages/de.json";
import enMessages from "@/messages/en.json";

export type SourceDoc = {
  sourceId: string;
  sourceHash: string;
  locale: "de" | "en";
  title: string;
  /** Locale-agnostic path (no /en prefix) — prompt layer adds the prefix. */
  url: string | null;
  content: string;
};

function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex").slice(0, 32);
}

function doc(
  sourceId: string,
  locale: "de" | "en",
  title: string,
  url: string | null,
  content: string,
): SourceDoc | null {
  const trimmed = content.replace(/\s+/g, " ").trim();
  if (trimmed.length < 20) return null;
  return {
    sourceId,
    sourceHash: hashContent(`${locale}\n${title}\n${url ?? ""}\n${trimmed}`),
    locale,
    title,
    url,
    content: trimmed,
  };
}

/** Strip HTML tags for indexing; entities left as-is are fine for embeddings. */
export function stripHtml(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*p\s*>/gi, "\n\n")
    .replace(/<\/\s*li\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function flattenMessages(
  value: unknown,
  path: string[] = [],
): Array<{ path: string; text: string }> {
  if (typeof value === "string") {
    return [{ path: path.join("."), text: value }];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => flattenMessages(item, [...path, String(i)]));
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
      flattenMessages(v, [...path, k]),
    );
  }
  return [];
}

/** Namespaces that carry real visitor-facing prose worth indexing. */
const MESSAGE_NAMESPACES = [
  "site",
  "home",
  "about",
  "gallery",
  "principle",
  "kontakt",
  "certificates",
  "filmStructure",
  "produkte",
  "produkteFolie",
  "blog",
  "partner",
  "produkteSeriePage",
  "produkteFolieDetail",
  "common",
] as const;

function messageUrl(path: string): string | null {
  if (path.startsWith("home.faq")) return "/";
  if (path.startsWith("home.")) return "/";
  if (path.startsWith("about.")) return "/ueber-uns";
  if (path.startsWith("principle.")) return "/funktionsprinzip";
  if (path.startsWith("kontakt.")) return "/kontakt";
  if (path.startsWith("gallery.")) return "/gallery";
  if (path.startsWith("produkte") || path.startsWith("filmStructure") || path.startsWith("certificates")) {
    return "/produkte";
  }
  if (path.startsWith("blog.")) return "/blog";
  if (path.startsWith("partner.")) return "/partner";
  return null;
}

function collectMessages(
  locale: "de" | "en",
  root: Record<string, unknown>,
): SourceDoc[] {
  const out: SourceDoc[] = [];

  // FAQ: one chunk per Q&A pair.
  const faqItems = (root.home as { faq?: { items?: Array<{ q: string; a: string }> } })?.faq
    ?.items;
  if (Array.isArray(faqItems)) {
    for (let i = 0; i < faqItems.length; i++) {
      const item = faqItems[i];
      if (!item?.q || !item?.a) continue;
      const d = doc(
        `faq:${locale}.${i}`,
        locale,
        item.q,
        "/",
        `Frage: ${item.q}\nAntwort: ${item.a}`,
      );
      if (d) out.push(d);
    }
  }

  // Group remaining prose by top-level namespace into a handful of chunks.
  for (const ns of MESSAGE_NAMESPACES) {
    const tree = root[ns];
    if (!tree) continue;
    const leaves = flattenMessages(tree, [ns]).filter((l) => {
      // Skip FAQ items already indexed as pairs, and skip tiny UI chrome.
      if (l.path.includes("home.faq.items")) return false;
      if (l.text.length < 40) return false;
      // Skip pure labels / button text.
      if (/^(title|cta|label|button|submit|aria|alt)/i.test(l.path.split(".").pop() ?? "")) {
        return l.text.length >= 80;
      }
      return true;
    });
    if (!leaves.length) continue;

    // Bucket into ~chunks of joined text per namespace.
    let bucket = "";
    let bucketIdx = 0;
    const flush = () => {
      if (!bucket.trim()) return;
      const d = doc(
        `messages:${locale}.${ns}.${bucketIdx}`,
        locale,
        `${ns} (${locale})`,
        messageUrl(ns),
        bucket,
      );
      if (d) out.push(d);
      bucket = "";
      bucketIdx += 1;
    };
    for (const leaf of leaves) {
      const line = `${leaf.path}: ${leaf.text}`;
      if (bucket.length + line.length > 1800) flush();
      bucket = bucket ? `${bucket}\n${line}` : line;
    }
    flush();
  }

  return out;
}

function formatFilmValues(label: string, values: FilmValues | null | undefined): string {
  if (!values) return "";
  const parts = [
    `VLT ${values.vlt}%`,
    `TSER ${values.tser}%`,
    `UV-Durchlass ${values.uv}`,
  ];
  if (values.glare != null) parts.push(`Blendschutz ${values.glare}%`);
  if (values.g != null) parts.push(`g-Wert ${values.g}`);
  if (values.sc != null) parts.push(`SC ${values.sc}`);
  return `${label}: ${parts.join(", ")}`;
}

function collectContactFacts(): SourceDoc[] {
  const c = site.contact;
  const hours = `${c.openingHours.days.join("–")} ${c.openingHours.opens}–${c.openingHours.closes}`;
  const content = [
    `${site.name}`,
    `Adresse: ${c.address}`,
    `Telefon: ${c.phone}`,
    `E-Mail: ${c.email}`,
    `Öffnungszeiten: ${hours}`,
    `Marken: ${site.brands.join(", ")}`,
  ].join("\n");
  const d = doc("site:contact", "de", "Kontaktdaten City-Ton Austria", "/kontakt", content);
  return d ? [d] : [];
}

function collectCertificates(): SourceDoc[] {
  const out: SourceDoc[] = [];
  for (const [seriesSlug, certs] of Object.entries(seriesCertificates)) {
    for (const cert of certs) {
      const content = [
        `Prüfbericht ${cert.report}`,
        `Folie: ${cert.film}`,
        `Marke: ${cert.brand}`,
        `Norm: ${cert.standard}`,
        `Ergebnis: ${cert.result}`,
        cert.caption,
      ].join("\n");
      const d = doc(
        `certificate:${seriesSlug}:${cert.report}`,
        "de",
        `${cert.standard} — ${cert.film}`,
        `/produkte/${seriesSlug}`,
        content,
      );
      if (d) out.push(d);
    }
  }
  return out;
}

function collectTermTooltips(): SourceDoc[] {
  return Object.entries(TERM_TOOLTIPS)
    .map(([term, definition]) =>
      doc(`term:${term}`, "de", term, "/produkte", `${term}: ${definition}`),
    )
    .filter((d): d is SourceDoc => d !== null);
}

async function collectProducts(): Promise<SourceDoc[]> {
  const rows = await prisma.product.findMany({
    where: { visible: true },
    include: { producer: { select: { name: true } }, category: { select: { slug: true, name: true } } },
    orderBy: { sortOrder: "asc" },
  });
  const out: SourceDoc[] = [];
  for (const row of rows) {
    const single = row.single as FilmValues;
    const dual = row.dual as FilmValues | null;
    const lines = [
      `Folie: ${row.name} (${row.code})`,
      `Marke: ${row.producer.name}`,
      row.category ? `Serie: ${row.category.name}` : null,
      `Familie: ${row.family}`,
      `Montage: ${row.mount}`,
      row.thicknessMil != null
        ? `Stärke: ${row.thicknessMil} mil` +
          (row.thicknessMicron != null ? ` / ${row.thicknessMicron} µ` : "")
        : null,
      row.application ? `Anwendung: ${row.application}` : null,
      row.certification ? `Zertifizierung: ${row.certification}` : null,
      row.note ? `Hinweis: ${row.note}` : null,
      formatFilmValues("Einfachverglasung", single),
      formatFilmValues("Isolierglas", dual),
    ].filter(Boolean);
    const d = doc(
      `product:${row.slug}`,
      "de",
      row.name,
      `/produkte/folie/${row.slug}`,
      lines.join("\n"),
    );
    if (d) out.push(d);
  }
  return out;
}

async function collectCategories(): Promise<SourceDoc[]> {
  const rows = await prisma.category.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });
  const out: SourceDoc[] = [];
  for (const row of rows) {
    const detail =
      row.detail && typeof row.detail === "object"
        ? JSON.stringify(row.detail)
        : row.detail
          ? String(row.detail)
          : "";
    const lines = [
      `Serie: ${row.name}`,
      `Familie: ${row.family}`,
      `Tag: ${row.tag}${row.extraTag ? ` / ${row.extraTag}` : ""}`,
      row.summary,
      row.useCases.length ? `Anwendungsfälle: ${row.useCases.join(", ")}` : null,
      detail ? `Details: ${detail}` : null,
    ].filter(Boolean);
    const d = doc(
      `category:${row.slug}`,
      "de",
      row.name,
      `/produkte/${row.slug}`,
      lines.join("\n"),
    );
    if (d) out.push(d);
  }
  return out;
}

async function collectPosts(): Promise<SourceDoc[]> {
  const rows = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });
  const out: SourceDoc[] = [];
  for (const row of rows) {
    const body = stripHtml(row.contentHtml);
    const content = [row.title, row.excerpt ?? "", body].filter(Boolean).join("\n\n");
    const d = doc(`post:${row.slug}`, "de", row.title, `/blog/${row.slug}`, content);
    if (d) out.push(d);
  }
  return out;
}

async function collectGallery(): Promise<SourceDoc[]> {
  const rows = await prisma.galleryItem.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });
  const out: SourceDoc[] = [];
  for (const row of rows) {
    const de = doc(
      `gallery:${row.id}:de`,
      "de",
      row.projectDe || "Referenzprojekt",
      "/gallery",
      `Projekt: ${row.projectDe}\nFolie: ${row.filmDe}`,
    );
    if (de) out.push(de);
    if (row.projectEn || row.filmEn) {
      const en = doc(
        `gallery:${row.id}:en`,
        "en",
        row.projectEn || "Project reference",
        "/gallery",
        `Project: ${row.projectEn}\nFilm: ${row.filmEn}`,
      );
      if (en) out.push(en);
    }
  }
  return out;
}

async function collectKnowledgeBase(): Promise<SourceDoc[]> {
  const rows = await prisma.knowledgeBase.findMany({
    where: { visible: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  const out: SourceDoc[] = [];
  for (const row of rows) {
    const answerText = stripHtml(row.answer);
    const keywords = row.keywords.length ? `\nStichworte: ${row.keywords.join(", ")}` : "";
    const category = row.category ? `\nKategorie: ${row.category}` : "";
    const content = `Frage: ${row.question}\nAntwort: ${answerText}${keywords}${category}`;
    const d = doc(
      `kb:${row.id}`,
      row.locale as "de" | "en",
      row.question,
      null, // no URL since knowledge base entries are not published on website
      content,
    );
    if (d) out.push(d);
  }
  return out;
}

/** All documents currently worth indexing. */
export async function collectAllSources(): Promise<SourceDoc[]> {
  const [products, categories, posts, gallery, knowledgeBase] = await Promise.all([
    collectProducts(),
    collectCategories(),
    collectPosts(),
    collectGallery(),
    collectKnowledgeBase(),
  ]);
  return [
    ...collectMessages("de", deMessages as unknown as Record<string, unknown>),
    ...collectMessages("en", enMessages as unknown as Record<string, unknown>),
    ...collectContactFacts(),
    ...collectCertificates(),
    ...collectTermTooltips(),
    ...products,
    ...categories,
    ...posts,
    ...gallery,
    ...knowledgeBase,
  ];
}

/**
 * Re-collect a single source family for incremental admin reindexing.
 * `sourceId` prefixes: product:, category:, post:, gallery:
 */
export async function collectSourcesByPrefix(prefix: string): Promise<SourceDoc[]> {
  if (prefix.startsWith("product:")) {
    const slug = prefix.slice("product:".length);
    const all = await collectProducts();
    return all.filter((d) => d.sourceId === `product:${slug}` || d.sourceId === prefix);
  }
  if (prefix.startsWith("category:")) {
    const slug = prefix.slice("category:".length);
    const all = await collectCategories();
    return all.filter((d) => d.sourceId === `category:${slug}` || d.sourceId === prefix);
  }
  if (prefix.startsWith("post:")) {
    const slug = prefix.slice("post:".length);
    const all = await collectPosts();
    return all.filter((d) => d.sourceId === `post:${slug}` || d.sourceId === prefix);
  }
  if (prefix.startsWith("gallery:")) {
    const all = await collectGallery();
    return all.filter((d) => d.sourceId.startsWith(prefix) || d.sourceId === prefix);
  }
  if (prefix.startsWith("kb:")) {
    const id = prefix.slice("kb:".length);
    const all = await collectKnowledgeBase();
    // A bare "kb:" prefix means the whole knowledge base (used after bulk import).
    if (!id) return all;
    return all.filter((d) => d.sourceId === `kb:${id}` || d.sourceId === prefix);
  }
  return [];
}
