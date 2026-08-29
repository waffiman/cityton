import { site } from "@/content/site";

/**
 * Canonical + hreflang `alternates` for a page's `generateMetadata`.
 *
 * `dePath` is the unprefixed (German) path — "/" for home, "/produkte" etc.
 * English lives at the same path under `/en` (see src/i18n/routing.ts).
 *
 * Pages whose body content comes straight from the database (product
 * series/film detail, blog posts) aren't actually translated — the `/en/...`
 * URL exists and renders, but shows the same German copy. Declaring it as a
 * language alternate would tell Google two URLs are translations of each
 * other when they're not, so those pages should pass `hasEnglish: false`:
 * canonical always points at the German URL, and no `languages` block is
 * emitted (matches the same distinction already made in src/app/sitemap.ts).
 */
export function pageAlternates(
  dePath: string,
  locale: string,
  { hasEnglish = true }: { hasEnglish?: boolean } = {},
) {
  const clean = dePath === "/" ? "" : dePath;
  const deUrl = `${site.url}${clean}`;

  if (!hasEnglish) {
    return { canonical: deUrl };
  }

  const enUrl = `${site.url}/en${clean}`;
  return {
    canonical: locale === "en" ? enUrl : deUrl,
    languages: {
      de: deUrl,
      en: enUrl,
      "x-default": deUrl,
    },
  };
}
