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

/** Technology keys — not series slugs. Map a series via `SERIES_STRUCTURE_KEY`. */
export const filmStructures: Record<FilmStructureKey, FilmStructureContent> = {
  reflective: {
    title: "Folienaufbau · Reflective",
    layers: [
      { n: 1, caption: "Kratzfeste Hartschicht", color: hardcoat, weight: 1 },
      { n: 2, caption: "Klare Polyesterfolie", color: clearPet, weight: 1 },
      { n: 3, caption: "Metallisierte Aluminiumschicht", color: aluminium, weight: 1 },
      { n: 4, caption: "Klare/getönte PET-Folie mit UV-Absorbern", color: uvPet, weight: 1 },
      { n: 5, caption: "Kleber mit UV-Absorbern", color: adhesive, weight: 1 },
      { n: 6, caption: "Trennfolie (Release Liner)", color: liner, weight: 1 },
    ],
  },
  safety: {
    title: "Folienaufbau · Safety",
    layers: [
      { n: 1, caption: "Kratzfeste Hartschicht", color: hardcoat, weight: 1 },
      { n: 2, caption: "Klare Polyesterfolie", color: clearPet, weight: 1 },
      { n: 3, caption: "Laminatkleber", color: adhesive, weight: 1 },
      { n: 4, caption: "Klare Polyesterfolie", color: pet, weight: 1 },
      { n: 5, caption: "Kleber mit UV-Absorbern", color: adhesive, weight: 1 },
      { n: 6, caption: "Trennfolie (Release Liner)", color: liner, weight: 1 },
    ],
  },
  sputtered: {
    title: "Folienaufbau · Sputtered",
    layers: [
      { n: 1, caption: "Kratzfeste Hartschicht", color: hardcoat, weight: 1 },
      { n: 2, caption: "Klare Polyesterfolie", color: clearPet, weight: 1 },
      { n: 3, caption: "Gesputterte Metallschicht", color: sputterMetal, weight: 1 },
      { n: 4, caption: "Klare/getönte PET-Folie mit UV-Absorbern", color: uvPet, weight: 1 },
      { n: 5, caption: "Kleber mit UV-Absorbern", color: adhesive, weight: 1 },
      { n: 6, caption: "Trennfolie (Release Liner)", color: liner, weight: 1 },
    ],
  },
};

/** Series slug → schema. UV Clear and Sichtschutz have no matching stack. */
export const SERIES_STRUCTURE_KEY: Record<string, FilmStructureKey> = {
  "serie-r": "reflective",
  spektralselektive: "sputtered",
  safety: "safety",
};

export function structureForSeries(
  slug: string,
  override?: { layers: Array<Partial<FilmStructureLayer> & { n: number; caption: string }> },
): FilmStructureContent | undefined {
  const key = SERIES_STRUCTURE_KEY[slug];
  if (!key) return undefined;
  const base = filmStructures[key];
  if (!override?.layers?.length) return base;
  return {
    ...base,
    layers: base.layers.map((layer) => {
      const next = override.layers.find((l) => l.n === layer.n);
      return next ? { ...layer, caption: next.caption, color: next.color ?? layer.color } : layer;
    }),
  };
}

