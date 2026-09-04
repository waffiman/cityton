/**
 * schema.org JSON-LD builders.
 *
 * Everything is anchored on stable `@id`s so the graph stays one entity set
 * across pages: the business is always `#organization`, the site always
 * `#website`. Page-level types (BreadcrumbList, FAQPage, Product, Article)
 * reference those instead of restating them.
 *
 * Only facts that exist in this repo go in — no invented geo coordinates,
 * ratings or price data. Google penalises structured data that contradicts
 * (or isn't visible in) the page, so every field here has a counterpart in
 * src/content/site.ts or in the rendered copy.
 */

import { site } from "@/content/site";

export const ORG_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

type JsonLdNode = Record<string, unknown>;

/**
 * The business itself. `LocalBusiness` rather than plain `Organization`:
 * this is a single Vienna workshop with a street address and opening hours,
 * which is exactly the distinction the local pack keys off.
 */
export function organizationNode(): JsonLdNode {
  const { contact } = site;
  return {
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    telephone: contact.phone,
    email: contact.email,
    image: `${site.url}/og-image.jpg`,
    logo: `${site.url}/apple-touch-icon.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.postalAddress.street,
      postalCode: contact.postalAddress.postalCode,
      addressLocality: contact.postalAddress.city,
      addressCountry: contact.postalAddress.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: contact.openingHours.days.map(
          (d) =>
            ({ Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday" })[d],
        ),
        opens: contact.openingHours.opens,
        closes: contact.openingHours.closes,
      },
    ],
    areaServed: [
      { "@type": "City", name: "Wien" },
      { "@type": "Country", name: "Österreich" },
    ],
    brand: site.brands.map((name) => ({ "@type": "Brand", name })),
  };
}

export function websiteNode(locale: string): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    inLanguage: locale === "en" ? "en" : "de-AT",
    publisher: { "@id": ORG_ID },
  };
}

/** Site-wide identity graph — emitted once per page from the locale layout. */
export function identityGraph(locale: string): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(), websiteNode(locale)],
  };
}

export function faqNode(items: { q: string; a: string }[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export type Crumb = { name: string; path: string };

/** `path` is the site-relative URL ("/produkte"); "" is the home page. */
export function breadcrumbNode(trail: Crumb[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path === "/" ? "" : crumb.path}`,
    })),
  };
}

/**
 * A window film as a Product. No `offers` block: the films aren't sold at a
 * listed price (every job is quoted after a site visit), and a fabricated
 * price would be exactly the kind of mismatch that earns a manual action.
 */
export function productNode(film: {
  name: string;
  brand: string;
  code: string;
  slug: string;
  description: string;
  image?: string | null;
  properties?: { name: string; value: string }[];
}): JsonLdNode {
  const node: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${film.brand} ${film.name}`,
    sku: film.code,
    mpn: film.code,
    brand: { "@type": "Brand", name: film.brand },
    description: film.description,
    url: `${site.url}/produkte/folie/${film.slug}`,
    category: "Fensterfolie",
    manufacturer: { "@type": "Organization", name: film.brand },
    seller: { "@id": ORG_ID },
  };
  if (film.image) node.image = film.image.startsWith("http") ? film.image : `${site.url}${film.image}`;
  if (film.properties?.length) {
    node.additionalProperty = film.properties.map((p) => ({
      "@type": "PropertyValue",
      name: p.name,
      value: p.value,
    }));
  }
  return node;
}

export function articleNode(post: {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverUrl?: string | null;
  publishedAt?: Date | null;
  updatedAt: Date;
}): JsonLdNode {
  const node: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    url: `${site.url}/blog/${post.slug}`,
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    inLanguage: "de-AT",
    dateModified: post.updatedAt.toISOString(),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
  if (post.publishedAt) node.datePublished = post.publishedAt.toISOString();
  if (post.excerpt) node.description = post.excerpt;
  if (post.coverUrl) {
    node.image = post.coverUrl.startsWith("http") ? post.coverUrl : `${site.url}${post.coverUrl}`;
  }
  return node;
}
