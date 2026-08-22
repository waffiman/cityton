import type { MetadataRoute } from "next";
import { series } from "@/content/series";
import { nav, site } from "@/content/site";
import { prisma } from "@/lib/db";
import { allFilmSlugs } from "@/lib/films";

// Queries Post via prisma, so this can't be statically prerendered at Docker
// build time (the db container isn't reachable during `npm run build` there,
// only once the compose network is up at runtime) — must render per request.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = nav.map((n) => ({
    url: `${site.url}${n.href === "/" ? "" : n.href}`,
    lastModified: now,
    priority: n.href === "/" ? 1 : 0.7,
  }));
  const products = series.map((s) => ({
    url: `${site.url}/produkte/${s.slug}`,
    lastModified: now,
    priority: 0.8,
  }));
  const foils = allFilmSlugs().map((slug) => ({
    url: `${site.url}/produkte/folie/${slug}`,
    lastModified: now,
    priority: 0.65,
  }));
  const publishedPosts = await prisma.post.findMany({
    where: { status: "published" },
    select: { slug: true, publishedAt: true, updatedAt: true },
  });
  const posts = publishedPosts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: p.publishedAt ?? p.updatedAt,
    priority: 0.6,
  }));
  return [...pages, ...products, ...foils, ...posts];
}
