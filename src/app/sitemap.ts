import type { MetadataRoute } from "next";
import { series } from "@/content/series";
import { nav, site } from "@/content/site";
import { allFilmSlugs } from "@/lib/films";

export default function sitemap(): MetadataRoute.Sitemap {
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
  return [...pages, ...products, ...foils];
}
