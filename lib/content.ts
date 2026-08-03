import {
  blogPosts,
  caseStudies,
  getBlogPost,
  getCase,
  type BlogPost,
  type CaseStudy,
} from "@/content/cases-blog";

export type Locale = "de" | "en";

export async function getBlogPosts(locale: Locale): Promise<
  Array<BlogPost & { title: string; excerpt: string }>
> {
  return blogPosts.map((p) => ({
    ...p,
    title: p[locale].title,
    excerpt: p[locale].excerpt,
  }));
}

export async function getBlogPostLocalized(slug: string, locale: Locale) {
  const p = getBlogPost(slug);
  if (!p) return undefined;
  return { ...p, ...p[locale] };
}

export async function getCaseStudies(locale: Locale): Promise<
  Array<CaseStudy & { title: string; excerpt: string }>
> {
  return caseStudies.map((c) => ({
    ...c,
    title: c[locale].title,
    excerpt: c[locale].excerpt,
  }));
}

export async function getCaseStudyLocalized(slug: string, locale: Locale) {
  const c = getCase(slug);
  if (!c) return undefined;
  return { ...c, ...c[locale] };
}
