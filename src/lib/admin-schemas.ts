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
