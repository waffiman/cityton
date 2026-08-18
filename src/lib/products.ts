/**
 * DB-backed catalog reads for the public /produkte pages and home overview.
 * Returns the exact `Series` / `Film` shapes the existing components expect, so
 * page/component rendering is unchanged — only the data source moved to Postgres.
 *
 * Products (films) and category core fields (name, tag, metrics, visibility) are
 * live: admin edits show after revalidation. A category's long-form `detail`
 * (stats/facts/variant table) is stored as a JSON snapshot from the seed.
 */

import type { Film, FilmValues, Series } from "@/content/series";
import { prisma } from "@/lib/db";

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
  single: unknown;
  dual: unknown;
  imageUrl: string | null;
  producer: { name: string };
};

function toFilm(row: ProductRow): ProductFilm {
  return {
    code: row.code,
    name: row.name,
    brand: row.producer.name as Film["brand"],
    family: row.family as Film["family"],
    mount: row.mount as Film["mount"],
    thicknessMil: row.thicknessMil ?? undefined,
    thicknessMicron: row.thicknessMicron ?? undefined,
    application: row.application ?? undefined,
    certification: row.certification ?? undefined,
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
};

function toSeries(row: CategoryRow): Series {
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
  single: true,
  dual: true,
  imageUrl: true,
  producer: { select: { name: true } },
} as const;

/** All visible films for the filterable catalog, in admin sort order. */
export async function getCatalogProducts(): Promise<ProductFilm[]> {
  const rows = await prisma.product.findMany({
    where: { visible: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: productSelect,
  });
  return rows.map(toFilm);
}

/** All visible series for the overview cards, in admin sort order. */
export async function getVisibleSeries(): Promise<Series[]> {
  const rows = await prisma.category.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(toSeries);
}

export async function getSeriesBySlug(slug: string): Promise<Series | null> {
  const row = await prisma.category.findFirst({ where: { slug, visible: true } });
  return row ? toSeries(row) : null;
}

export async function getVisibleSeriesSlugs(): Promise<string[]> {
  const rows = await prisma.category.findMany({
    where: { visible: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getProductBySlug(slug: string): Promise<ProductFilm | null> {
  const row = await prisma.product.findFirst({
    where: { slug, visible: true },
    select: productSelect,
  });
  return row ? toFilm(row) : null;
}

export async function getVisibleProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { visible: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}
