/**
 * Content abstraction for blog posts and case studies.
 * Currently file-based (MDX/JSON). Swap the implementations below
 * for a Headless CMS (Sanity / Strapi) without changing page consumers.
 */

export type Locale = "de" | "en";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  locale: Locale;
};

export type CaseStudy = {
  slug: string;
  title: string;
  objectType: "residential" | "office" | "retail" | "security" | "other";
  filmSeries: string;
  excerpt: string;
  locale: Locale;
};

// Seed empty collections — populate via MDX/JSON later
const blogPosts: BlogPost[] = [];
const caseStudies: CaseStudy[] = [];

export async function getBlogPosts(locale: Locale): Promise<BlogPost[]> {
  return blogPosts.filter((p) => p.locale === locale);
}

export async function getBlogPost(
  slug: string,
  locale: Locale,
): Promise<BlogPost | undefined> {
  return blogPosts.find((p) => p.slug === slug && p.locale === locale);
}

export async function getCaseStudies(locale: Locale): Promise<CaseStudy[]> {
  return caseStudies.filter((c) => c.locale === locale);
}

export async function getCaseStudy(
  slug: string,
  locale: Locale,
): Promise<CaseStudy | undefined> {
  return caseStudies.find((c) => c.slug === slug && c.locale === locale);
}
