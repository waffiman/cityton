import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllProductSlugs } from "@/content/products";
import { blogPosts, caseStudies } from "@/content/cases-blog";

const BASE = "https://city-ton.com";

const PAGES = [
  "",
  "/about",
  "/products",
  "/how-it-works",
  "/cases",
  "/blog",
  "/clients",
  "/partners",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const productPaths = getAllProductSlugs().map((s) => `/products/${s}`);
  const casePaths = caseStudies.map((c) => `/cases/${c.slug}`);
  const blogPaths = blogPosts.map((p) => `/blog/${p.slug}`);
  const paths = [...PAGES, ...productPaths, ...casePaths, ...blogPaths];

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE}/${l}${path}`]),
        ),
      },
    })),
  );
}
