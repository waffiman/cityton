export type FilmStructureKey = "reflective" | "safety" | "sputtered";

export type FilmStructureLayer = {
  n: number;
  caption: string;
  /** Fill of the schema rectangle. */
  color: string;
  /** Relative thickness in the stack (1 = default). */
  weight?: number;
};

export type FilmStructureContent = {
  title: string;
  layers: FilmStructureLayer[];
};

const liner = "#f4f5f5";
const hardcoat = "#e6ecee";
const pet = "#c5d5d8";
const adhesive = "#9bb7bc";
const uvPet = "#c9dde2";
const aluminium = "#5a6b70";
const sputterMetal = "#7a8a86";
const clearPet = "#b7c9cd";

/** Layer fill colours per technology — captions come from messages
 * (`filmStructure.<key>.layer1..6`), keyed by position, not text. */
export const filmStructureColors: Record<FilmStructureKey, string[]> = {
  reflective: [hardcoat, clearPet, aluminium, uvPet, adhesive, liner],
  safety: [hardcoat, clearPet, adhesive, pet, adhesive, liner],
  sputtered: [hardcoat, clearPet, sputterMetal, uvPet, adhesive, liner],
};

/** Series slug → schema. UV Clear and Sichtschutz have no matching stack. */
export const SERIES_STRUCTURE_KEY: Record<string, FilmStructureKey> = {
  "serie-r": "reflective",
  spektralselektive: "sputtered",
  safety: "safety",
};

export function structureKeyForSeries(slug: string): FilmStructureKey | undefined {
  return SERIES_STRUCTURE_KEY[slug];
}

/**
 * Build the translated structure for a series. `t` is a next-intl translator
 * scoped to (or able to resolve) the `filmStructure` namespace — pass
 * `getTranslations("filmStructure")`. `override` lets a specific series swap
 * captions/colours per layer (none currently do; kept for future series).
 */
export function structureForSeries(
  slug: string,
  t: (key: string) => string,
  override?: { layers: Array<Partial<FilmStructureLayer> & { n: number; caption: string }> },
): FilmStructureContent | undefined {
  const key = structureKeyForSeries(slug);
  if (!key) return undefined;
  const colors = filmStructureColors[key];
  const base: FilmStructureContent = {
    title: t(`${key}.title`),
    layers: colors.map((color, i) => ({
      n: i + 1,
      caption: t(`${key}.layer${i + 1}`),
      color,
      weight: 1,
    })),
  };
  if (!override?.layers?.length) return base;
  return {
    ...base,
    layers: base.layers.map((layer) => {
      const next = override.layers.find((l) => l.n === layer.n);
      return next ? { ...layer, caption: next.caption, color: next.color ?? layer.color } : layer;
    }),
  };
}
