import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllProductSlugs } from "@/content/products";

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
  const paths = [...PAGES, ...productPaths];

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
