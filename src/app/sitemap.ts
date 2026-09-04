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
  // Static nav pages exist in both locales (German unprefixed, English under
  // /en/) — DB-driven pages below (series/films/posts) don't: their content
  // isn't translated, so an /en/ duplicate would serve German copy under an
  // English URL, a real SEO downside rather than a neutral one.
  // /blog is in `nav`, but the blog is German-only (like the posts it lists) —
  // its /en URL renders German copy and canonicalises back to /blog, so
  // submitting it would hand Google a URL that points somewhere else.
  const germanOnly = new Set(["/blog"]);
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
  // /blog itself is already emitted by the `nav` loop above (it's a nav item),
  // so there's nothing to add here — a second entry would list it twice.
  return [...pages, ...products, ...foils, ...posts];
}
