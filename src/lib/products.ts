/**
 * DB-backed catalog reads for the public /produkte pages and home overview.
 * Returns the exact `Series` / `Film` shapes the existing components expect, so
 * page/component rendering is unchanged — only the data source moved to Postgres.
 *
 * Products (films) and category core fields (name, tag, metrics, visibility) are
 * live: admin edits show after revalidation. A category's long-form `detail`
 * (stats/facts/variant table) is stored as a JSON snapshot from the seed.
 *
 * Every read takes a locale. German is the source language and lives in the
 * bare columns; the `*En` siblings hold the translation and are null until one
 * exists, in which case German is served rather than a blank field.
 */

import type { Film, FilmValues, Series } from "@/content/series";
import { prisma } from "@/lib/db";

/** Serve the English column when it has content, else the German source. */
function pick(german: string, english: string | null | undefined): string;
function pick(german: string | null, english: string | null | undefined): string | null;
function pick(german: string | null, english: string | null | undefined): string | null {
  return english && english.trim() ? english : german;
}

/** Same, for the array/JSON columns — an empty array counts as "not translated". */
function pickList(german: string[], english: string[] | null | undefined): string[] {
  return english && english.length > 0 ? english : german;
}

function pickJson<T>(german: unknown, english: unknown): T {
  return (english ?? german) as T;
}

export type Locale = string;

/** True for the English locale; everything else falls back to the German source. */
function isEnglish(locale: Locale): boolean {
  return locale.startsWith("en");
}

/** A film plus its resolved image URL (S3 upload or seeded katalog path). */
export type ProductFilm = Film & { imageUrl: string | null };

type ProductRow = {
  code: string;
  name: string;
  family: string;
  mount: string;
  thicknessMil: number | null;
  thicknessMicron: number | null;
  application: string | null;
  certification: string | null;
  note: string | null;
  applicationEn: string | null;
  certificationEn: string | null;
  single: unknown;
  dual: unknown;
  imageUrl: string | null;
  producer: { name: string };
};

function toFilm(row: ProductRow, locale: Locale): ProductFilm {
  const en = isEnglish(locale);
  return {
    code: row.code,
    // `name` is brand naming ("Dual Reflective 15") and identical in both locales.
    name: row.name,
    brand: row.producer.name as Film["brand"],
    family: row.family as Film["family"],
    mount: row.mount as Film["mount"],
    thicknessMil: row.thicknessMil ?? undefined,
    thicknessMicron: row.thicknessMicron ?? undefined,
    application: (en ? pick(row.application, row.applicationEn) : row.application) ?? undefined,
    certification:
      (en ? pick(row.certification, row.certificationEn) : row.certification) ?? undefined,
    // `note` is an internal admin remark, never rendered — no translation.
    note: row.note ?? undefined,
    single: row.single as FilmValues,
    dual: (row.dual ?? undefined) as FilmValues | undefined,
    imageUrl: row.imageUrl,
  };
}

type CategoryRow = {
  slug: string;
  name: string;
  family: string;
  tag: string;
  extraTag: string | null;
  summary: string;
  glyph: string;
  glyphField: string;
  useCases: string[];
  metrics: unknown;
  detail: unknown;
  nameEn: string | null;
  familyEn: string | null;
  tagEn: string | null;
  extraTagEn: string | null;
  summaryEn: string | null;
  useCasesEn: string[];
  metricsEn: unknown;
  detailEn: unknown;
};

function toSeries(row: CategoryRow, locale: Locale): Series {
  if (!isEnglish(locale)) {
    return {
      slug: row.slug,
      name: row.name,
      family: row.family,
      tag: row.tag,
      extraTag: row.extraTag ?? undefined,
      glyph: row.glyph as Series["glyph"],
      glyphField: row.glyphField as Series["glyphField"],
      summary: row.summary,
      useCases: row.useCases,
      metrics: (row.metrics ?? []) as Series["metrics"],
      detail: (row.detail ?? undefined) as Series["detail"],
    };
  }
  return {
    slug: row.slug,
    name: pick(row.name, row.nameEn),
    family: pick(row.family, row.familyEn),
    tag: pick(row.tag, row.tagEn),
    extraTag: pick(row.extraTag, row.extraTagEn) ?? undefined,
    glyph: row.glyph as Series["glyph"],
    glyphField: row.glyphField as Series["glyphField"],
    summary: pick(row.summary, row.summaryEn),
    useCases: pickList(row.useCases, row.useCasesEn),
    metrics: pickJson<Series["metrics"]>(row.metrics ?? [], row.metricsEn),
    detail: pickJson<Series["detail"]>(row.detail ?? undefined, row.detailEn),
  };
}

const productSelect = {
  code: true,
  name: true,
  family: true,
  mount: true,
  thicknessMil: true,
  thicknessMicron: true,
  application: true,
  certification: true,
  note: true,
  applicationEn: true,
  certificationEn: true,
  single: true,
  dual: true,
  imageUrl: true,
  producer: { select: { name: true } },
} as const;

/** All visible films for the filterable catalog, in admin sort order. */
export async function getCatalogProducts(locale: Locale): Promise<ProductFilm[]> {
  const rows = await prisma.product.findMany({
    where: { visible: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: productSelect,
  });
  return rows.map((row) => toFilm(row, locale));
}

/** All visible series for the overview cards, in admin sort order. */
export async function getVisibleSeries(locale: Locale): Promise<Series[]> {
  const rows = await prisma.category.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((row) => toSeries(row, locale));
}

export async function getSeriesBySlug(slug: string, locale: Locale): Promise<Series | null> {
  const row = await prisma.category.findFirst({ where: { slug, visible: true } });
  return row ? toSeries(row, locale) : null;
}

export async function getVisibleSeriesSlugs(): Promise<string[]> {
  const rows = await prisma.category.findMany({
    where: { visible: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getProductBySlug(slug: string, locale: Locale): Promise<ProductFilm | null> {
  const row = await prisma.product.findFirst({
    where: { slug, visible: true },
    select: productSelect,
  });
  return row ? toFilm(row, locale) : null;
}

export async function getVisibleProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { visible: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}
