/**
 * Locale-aware blog reads.
 *
 * German is the source language and lives in `title` / `excerpt` /
 * `contentHtml`; the `*En` columns hold the translation. A post without one
 * falls back to German rather than disappearing from /en/blog — the same rule
 * the catalog uses (see src/lib/products.ts), so an untranslated post is still
 * reachable instead of silently missing.
 */

import { prisma } from "@/lib/db";

export type LocalizedPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  contentHtml: string;
  coverUrl: string | null;
  galleryUrls: string[];
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  /** False when this locale is being served the German source as a fallback. */
  translated: boolean;
};

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  contentHtml: string;
  titleEn: string | null;
  excerptEn: string | null;
  contentHtmlEn: string | null;
  coverUrl: string | null;
  galleryUrls: string[];
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function has(v: string | null | undefined): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function localize(row: PostRow, locale: string): LocalizedPost {
  const english = locale.startsWith("en");
  // The body decides: a post counts as translated once its article text exists,
  // and then title/excerpt follow it, each still falling back on its own.
  const body = english && has(row.contentHtmlEn) ? row.contentHtmlEn : null;

  return {
    id: row.id,
    slug: row.slug,
    title: english && has(row.titleEn) ? row.titleEn : row.title,
    excerpt: english && has(row.excerptEn) ? row.excerptEn : row.excerpt,
    contentHtml: body ?? row.contentHtml,
    coverUrl: row.coverUrl,
    galleryUrls: row.galleryUrls,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    translated: !english || body !== null,
  };
}

const postSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  contentHtml: true,
  titleEn: true,
  excerptEn: true,
  contentHtmlEn: true,
  coverUrl: true,
  galleryUrls: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getPublishedPosts(locale: string): Promise<LocalizedPost[]> {
  const rows = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: postSelect,
  });
  return rows.map((row) => localize(row, locale));
}

export async function getPublishedPost(
  slug: string,
  locale: string,
): Promise<LocalizedPost | null> {
  const row = await prisma.post.findFirst({
    where: { slug, status: "published" },
    select: postSelect,
  });
  return row ? localize(row, locale) : null;
}
