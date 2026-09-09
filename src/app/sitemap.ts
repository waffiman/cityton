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
  // Every page exists in both locales (German unprefixed, English under /en/):
  // the catalog now carries per-locale columns, and the blog index's chrome and
  // post titles are translated too, so /blog no longer belongs here. Individual
  // posts are the exception and are gated on their own English body below.
  const germanOnly = new Set<string>();
  const pages = nav.flatMap((n) => {
    const dePath = n.href === "/" ? "" : n.href;
    const entries = [
      { url: `${site.url}${dePath}`, lastModified: now, priority: n.href === "/" ? 1 : 0.7 },
    ];
    if (!germanOnly.has(n.href)) {
      entries.push({
        url: `${site.url}/en${dePath}`,
        lastModified: now,
        priority: n.href === "/" ? 0.9 : 0.6,
      });
    }
    return entries;
  });
  const products = series.flatMap((s) => [
    { url: `${site.url}/produkte/${s.slug}`, lastModified: now, priority: 0.8 },
    { url: `${site.url}/en/produkte/${s.slug}`, lastModified: now, priority: 0.7 },
  ]);
  const foils = allFilmSlugs().flatMap((slug) => [
    { url: `${site.url}/produkte/folie/${slug}`, lastModified: now, priority: 0.65 },
    { url: `${site.url}/en/produkte/folie/${slug}`, lastModified: now, priority: 0.55 },
  ]);
  const publishedPosts = await prisma.post.findMany({
    where: { status: "published" },
    select: { slug: true, publishedAt: true, updatedAt: true, contentHtmlEn: true },
  });
  const posts = publishedPosts.flatMap((p) => {
    const lastModified = p.publishedAt ?? p.updatedAt;
    const de = { url: `${site.url}/blog/${p.slug}`, lastModified, priority: 0.6 };
    // An untranslated post still renders under /en, but in German — not worth
    // submitting as an English URL.
    return p.contentHtmlEn?.trim()
      ? [de, { url: `${site.url}/en/blog/${p.slug}`, lastModified, priority: 0.5 }]
      : [de];
  });
  // /blog itself is already emitted by the `nav` loop above (it's a nav item),
  // so there's nothing to add here — a second entry would list it twice.
  return [...pages, ...products, ...foils, ...posts];
}
