/**
 * Film listing helpers: slugs, katalog image resolution, filter helpers.
 * Product data lives in `@/content/series` (`films`).
 */

import { films, type Film } from "@/content/series";

// NB: must match the on-disk directory name exactly (public/media/katalog,
// lowercase) — Linux/Vercel deployments are case-sensitive even though local
// Windows/macOS dev doesn't notice a mismatch.
const KATALOG_DIR = "/media/katalog";

/** Filenames present under public/media/Katalog (web JPEGs). */
const KATALOG_FILES = [
  "AIR 75 IR SR HPR.jpg",
  "AIR 80 BL SR HPR.jpg",
  "ARM ANTI GRAFFITY 4 MIL CLEAR.jpg",
  "AU 85 UV SR HPR.jpg",
  "DR 15 SR CDF.jpg",
  "DRN 25 SR CDF.jpg",
  "DRN 35 SR CDF.jpg",
  "N 1020 B SR CDF.jpg",
  "N 1020 SR CDF.jpg",
  "N 1035 B SR CDF.jpg",
  "N 1040 SR CDF.jpg",
  "N 1050 SR CDF.jpg",
  "N 1065 SR CDF.jpg",
  "N1040 SR PS 8.jpg",
  "N1050 SR PS 8.jpg",
  "NF SOLAR BRONZE 20.jpg",
  "NHE 1020 BR ER HPR.jpg",
  "NHE 1020 ER HPR.jpg",
  "NHE 1035 BR ER HPR.jpg",
  "NHE 1035 ER HPR.jpg",
  "NRM PS 6.jpg",
  "R 15 BL SR HPR.jpg",
  "R 20 SR CDF.jpg",
  "R 35 SR HPR.jpg",
  "R 50 SR HPR.jpg",
  "R BLUE 15 (EXTERIOR).jpg",
  "R BLUE 15 (INTERIOR).jpg",
  "R BRONZE 10 (EXTERIOR).jpg",
  "R BRONZE 10 (INTERIOR).jpg",
  "R GREEN 10.jpg",
  "R GREY 10.jpg",
  "R SILVER 15.jpg",
  "R SILVER 20.jpg",
  "R SILVER 35 (EXTERIOR).jpg",
  "R SILVER 35 (INTERIOR).jpg",
  "R SILVER 50 (EXTERIOR).jpg",
  "R SILVER 50 (INTERIOR).jpg",
  "R SILVER 60.jpg",
  "RA CHARCOAL 22.jpg",
  "RHE 20 SI ER HPR.jpg",
  "RHE 35 SI ER HPR.jpg",
  "RHE 50 SI ER HPR.jpg",
  "RN 07 GR SR HPR.jpg",
  "SAFETY 12 MIL CLEAR.jpg",
  "SAFETY 7 MIL CLEAR.jpg",
  "SCL SR PS 8.jpg",
  "SILVER MATT.jpg",
  "THE 80 BL ER HPR.jpg",
  "UV PROTECTION CLEAR.jpg",
  "V 14 SR CDF.jpg",
  "V 28 SR CDF.jpg",
  "V 38 SR CDF.jpg",
  "VE 35 SR CDF.jpg",
  "VE 50 SR CDF.jpg",
  "VHE 14 SI ER HPR.jpg",
  "VS 20 SR CDF.jpg",
  "VS 30 SR CDF.jpg",
  "VS 50 SR CDF.jpg",
  "VS 60 SR CDF.jpg",
  "VS 61 SR CDF.jpg",
  "VS 70 SR CDF.jpg",
  "WHITE MATT.jpg",
  "WHITE OUT.jpg",
  "XHE 70 SS ER HPR.jpg",
] as const;

const katalogByStem = new Map<string, string[]>();
for (const file of KATALOG_FILES) {
  const stem = file.replace(/\.jpg$/i, "");
  const base = stem.replace(/\s*\((INTERIOR|EXTERIOR)\)\s*$/i, "").trim();
  const key = normalizeKey(base);
  const list = katalogByStem.get(key) ?? [];
  list.push(file);
  katalogByStem.set(key, list);
}

function normalizeKey(s: string): string {
  return s
    .toUpperCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** URL-safe slug from film code. */
export function filmSlug(code: string): string {
  return code
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const filmsBySlug = new Map(films.map((f) => [filmSlug(f.code), f]));

export function getFilmBySlug(slug: string): Film | undefined {
  return filmsBySlug.get(slug);
}

export function allFilmSlugs(): string[] {
  return films.map((f) => filmSlug(f.code));
}

/**
 * Public path to a katalog JPEG for this film, or null if none matches.
 * Prefers INTERIOR/EXTERIOR variants when the filename encodes mount.
 */
/**
 * Should `next/image` optimisation be bypassed for this src?
 *
 * Only for remote (admin-uploaded, S3) images: `images.remotePatterns` is
 * derived from `S3_PUBLIC_BASE_URL`, so when S3 isn't configured the optimiser
 * rejects any absolute URL outright. Local files under `public/media` must
 * always go through the optimiser — the katalog swatches are 24-megapixel
 * (~3 MB) originals rendered as ~200 px thumbnails, so serving them raw ships
 * ~150 MB for one catalogue page.
 */
export function shouldBypassOptimizer(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

export function filmImageSrc(film: Film): string | null {
  const key = normalizeKey(film.code);
  // ARM ANTI GRAFFITY 4 MIL → … CLEAR.jpg
  const candidates =
    katalogByStem.get(key) ??
    katalogByStem.get(normalizeKey(`${film.code} CLEAR`)) ??
    [];

  if (candidates.length === 0) return null;

  const wantInterior = film.mount === "innen" || film.mount === "innen / außen";
  const wantExterior = film.mount === "außen" || film.mount === "innen / außen";

  const interior = candidates.find((f) => /\(INTERIOR\)/i.test(f));
  const exterior = candidates.find((f) => /\(EXTERIOR\)/i.test(f));
  const plain = candidates.find((f) => !/\((INTERIOR|EXTERIOR)\)/i.test(f));

  if (film.mount === "innen" && interior) return pathFor(interior);
  if (film.mount === "außen" && exterior) return pathFor(exterior);
  if (wantInterior && interior) return pathFor(interior);
  if (wantExterior && exterior) return pathFor(exterior);
  if (plain) return pathFor(plain);
  return pathFor(candidates[0]);
}

function pathFor(file: string): string {
  // Keep the real filename; the browser / next/image encode spaces in the URL.
  return `${KATALOG_DIR}/${file}`;
}

export type BrandFilter = "alle" | Film["brand"];
export type MountFilter = "alle" | "innen" | "außen" | "innen / außen";

export function filterFilms<T extends Film>(
  list: T[],
  brand: BrandFilter,
  mount: MountFilter,
): T[] {
  return list.filter((f) => {
    if (brand !== "alle" && f.brand !== brand) return false;
    if (mount === "alle") return true;
    if (mount === "innen / außen") return f.mount === "innen / außen";
    // innen / außen foils appear under both innen and außen filters
    if (mount === "innen") return f.mount === "innen" || f.mount === "innen / außen";
    if (mount === "außen") return f.mount === "außen" || f.mount === "innen / außen";
    return true;
  });
}

/**
 * Central glossary for the ⓘ info hints — re-exported from
 * `@/lib/term-tooltips` so existing imports of `@/lib/films` keep working.
 */
export { TERM_TOOLTIPS } from "@/lib/term-tooltips";
