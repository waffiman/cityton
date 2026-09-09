import { z } from "zod";

/** Option lists mirrored from the Film/Series types in src/content/series.ts. */
export const FAMILIES = [
  "reflektierend",
  "sputtered",
  "dual-reflektierend",
  "spektralselektiv",
  "low-e",
  "klar",
  "sicherheit",
  "sichtschutz",
] as const;

export const MOUNTS = ["innen", "außen", "innen / außen"] as const;
export const GLYPHS = ["reflexion", "absorption", "kraft", "uv", "dekor"] as const;
export const GLYPH_FIELDS = ["dark", "paper"] as const;

/** FilmValues fields, in display order. `uv` is a string ("<1", ">5"); the rest are numeric. */
export const FILM_VALUE_FIELDS: { key: string; label: string; kind: "number" | "string" }[] = [
  { key: "vlt", label: "VLT (Lichtdurchlass %)", kind: "number" },
  { key: "tser", label: "TSER (%)", kind: "number" },
  { key: "uv", label: "UV-Durchlass", kind: "string" },
  { key: "glare", label: "Blendschutz (%)", kind: "number" },
  { key: "solarTransmission", label: "Strahlungsdurchlass (%)", kind: "number" },
  { key: "solarReflection", label: "Strahlungsreflexion (%)", kind: "number" },
  { key: "solarAbsorption", label: "Strahlungsabsorption (%)", kind: "number" },
  { key: "visibleReflection", label: "Lichtreflexion (%)", kind: "number" },
  { key: "visibleReflectionExt", label: "Lichtreflexion außen (%)", kind: "number" },
  { key: "visibleReflectionInt", label: "Lichtreflexion innen (%)", kind: "number" },
  { key: "sc", label: "Shading Coefficient", kind: "number" },
  { key: "g", label: "g-Wert", kind: "number" },
  { key: "emissivity", label: "Emissivität", kind: "number" },
  { key: "uValue", label: "U-Wert (W/m²K)", kind: "number" },
  { key: "colourRendering", label: "Farbwiedergabe", kind: "number" },
];

const filmValuesSchema = z
  .object({
    vlt: z.number(),
    tser: z.number(),
    uv: z.string().min(1).max(20),
    glare: z.number().optional(),
    solarTransmission: z.number().optional(),
    solarReflection: z.number().optional(),
    solarAbsorption: z.number().optional(),
    visibleReflection: z.number().optional(),
    visibleReflectionExt: z.number().optional(),
    visibleReflectionInt: z.number().optional(),
    sc: z.number().optional(),
    g: z.number().optional(),
    emissivity: z.number().optional(),
    uValue: z.number().optional(),
    colourRendering: z.number().optional(),
  })
  .strict();

const nullableInt = z.number().int().nullable().optional();

export const productInputSchema = z.object({
  code: z.string().min(1).max(80),
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120),
  family: z.enum(FAMILIES),
  mount: z.enum(MOUNTS),
  producerId: z.string().min(1),
  categoryId: z.string().min(1).nullable().optional(),
  thicknessMil: nullableInt,
  thicknessMicron: nullableInt,
  application: z.string().max(300).nullable().optional(),
  certification: z.string().max(300).nullable().optional(),
  note: z.string().max(1000).nullable().optional(),
  single: filmValuesSchema,
  dual: filmValuesSchema.nullable().optional(),
  imageUrl: z.string().max(600).nullable().optional(),
  visible: z.boolean(),
  sortOrder: z.number().int(),
});
export type ProductInput = z.infer<typeof productInputSchema>;

const seriesMetricSchema = z.object({
  label: z.string(),
  value: z.string(),
  bar: z.number(),
});

export const categoryInputSchema = z.object({
  slug: z.string().min(1).max(120),
  name: z.string().min(1).max(120),
  family: z.string().min(1).max(160),
  tag: z.string().min(1).max(80),
  extraTag: z.string().max(80).nullable().optional(),
  summary: z.string().min(1).max(2000),
  glyph: z.enum(GLYPHS),
  glyphField: z.enum(GLYPH_FIELDS),
  useCases: z.array(z.string().max(120)).max(20),
  metrics: z.array(seriesMetricSchema).max(6).nullable().optional(),
  visible: z.boolean(),
  sortOrder: z.number().int(),
});
export type CategoryInput = z.infer<typeof categoryInputSchema>;

/** A gallery tile is either a photo or a short clip. */
export const GALLERY_KINDS = ["image", "video"] as const;

export const galleryItemInputSchema = z.object({
  /** "/media/referenzen/…", "/uploads/…" or an absolute S3 URL. */
  url: z.string().min(1).max(600),
  kind: z.enum(GALLERY_KINDS),
  posterUrl: z.string().max(600).nullable().optional(),
  projectDe: z.string().min(1).max(120),
  filmDe: z.string().min(1).max(120),
  projectEn: z.string().min(1).max(120),
  filmEn: z.string().min(1).max(120),
  visible: z.boolean(),
  sortOrder: z.number().int(),
});
export type GalleryItemInput = z.infer<typeof galleryItemInputSchema>;

export const producerInputSchema = z.object({
  name: z.string().min(1).max(80),
  slug: z.string().min(1).max(80),
  visible: z.boolean(),
  sortOrder: z.number().int(),
});
export type ProducerInput = z.infer<typeof producerInputSchema>;

export const postInputSchema = z.object({
  slug: z.string().min(1).max(160),
  title: z.string().min(1).max(200),
  excerpt: z.string().max(400).nullable().optional(),
  coverUrl: z.string().max(600).nullable().optional(),
  // Plain strings, not z.url(): with the local-disk storage backend uploadImage
  // returns site-relative paths like "/uploads/posts/…jpg".
  galleryUrls: z.array(z.string().max(600)).max(24).optional(),
  contentHtml: z.string().max(200000),
  status: z.enum(["draft", "published"]),
});
export type PostInput = z.infer<typeof postInputSchema>;

export const knowledgeBaseInputSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(10000),
  category: z.string().max(100).nullable().optional(),
  keywords: z.array(z.string().max(100)).max(20).optional(),
  locale: z.enum(["de", "en"]),
  visible: z.boolean(),
  sortOrder: z.number().int(),
});
export type KnowledgeBaseInput = z.infer<typeof knowledgeBaseInputSchema>;

/** Upper bound for one bulk import request. */
export const KNOWLEDGE_IMPORT_MAX_ENTRIES = 500;

/**
 * Answers are stored as the HTML the rich text editor produces. Imported files
 * usually carry plain text, so wrap it in paragraphs to keep both the editor
 * and the chat answer rendering happy.
 */
export function normalizeAnswerHtml(input: string): string {
  const text = input.trim();
  if (!text) return text;
  if (/<\/?[a-z][\s\S]*>/i.test(text)) return text;
  return text
    .split(/\n{2,}/)
    .map((block) => `<p>${block.trim().replace(/\n/g, "<br />")}</p>`)
    .join("");
}

/**
 * One Q&A entry from an uploaded JSON file. Deliberately lenient compared to
 * `knowledgeBaseInputSchema`: `q`/`a` shorthands are accepted, keywords may be
 * a comma-separated string, and everything but question/answer is optional.
 */
export const knowledgeBaseImportEntrySchema = z
  .object({
    question: z.string().max(500).optional(),
    q: z.string().max(500).optional(),
    answer: z.string().max(10000).optional(),
    a: z.string().max(10000).optional(),
    category: z.string().max(100).nullable().optional(),
    keywords: z
      .union([z.array(z.string().max(100)).max(20), z.string().max(600)])
      .nullable()
      .optional(),
    locale: z.enum(["de", "en"]).optional(),
    visible: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  })
  .transform((raw, ctx): KnowledgeBaseInput => {
    const question = (raw.question ?? raw.q ?? "").trim();
    const answer = (raw.answer ?? raw.a ?? "").trim();
    if (!question) {
      ctx.addIssue({ code: "custom", message: "„question“ fehlt oder ist leer." });
    }
    if (!answer) {
      ctx.addIssue({ code: "custom", message: "„answer“ fehlt oder ist leer." });
    }

    const keywords = (
      typeof raw.keywords === "string" ? raw.keywords.split(",") : (raw.keywords ?? [])
    )
      .map((k) => k.trim())
      .filter(Boolean)
      .slice(0, 20);

    return {
      question,
      answer: normalizeAnswerHtml(answer),
      category: raw.category?.trim() || null,
      keywords,
      locale: raw.locale ?? "de",
      visible: raw.visible ?? true,
      sortOrder: raw.sortOrder ?? 0,
    };
  });

export const knowledgeBaseImportSchema = z.object({
  entries: z.array(knowledgeBaseImportEntrySchema).min(1).max(KNOWLEDGE_IMPORT_MAX_ENTRIES),
  /** `skip` keeps existing entries untouched, `update` overwrites them. */
  mode: z.enum(["skip", "update"]).default("skip"),
});
export type KnowledgeBaseImportInput = z.infer<typeof knowledgeBaseImportSchema>;

/**
 * Pulls the entry array out of an uploaded file, accepting a bare array or a
 * wrapper object (`entries`, `items`, `faqs`, `data`).
 */
export function extractImportEntries(parsed: unknown): unknown[] | null {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === "object") {
    for (const key of ["entries", "items", "faqs", "qa", "data"] as const) {
      const value = (parsed as Record<string, unknown>)[key];
      if (Array.isArray(value)) return value;
    }
  }
  return null;
}

/** URL-safe slug — matches filmSlug() in src/lib/films.ts. */
export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
