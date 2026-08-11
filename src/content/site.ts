/**
 * Site-wide content and configuration.
 *
 * Everything a marketing edit touches lives in src/content/* so page components
 * stay layout-only. When a CMS arrives, these modules are the shape to fetch into.
 */

export const site = {
  name: "City-Ton Austria",
  wordmark: "CITY-TON",
  tagline: "AUSTRIA · SUN PROTECTION",
  description:
    "Sonnenschutz, UV-Schutz, Energieeffizienz und Einbruchschutz für Glasflächen. Beratung, Material, Montage und Betreuung in einem Paket.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.city-ton.at",
  contact: {
    phone: "+43 677 61520700",
    phoneTel: "+4367761520700",
    email: "office@city-ton.com",
    address: "[Adresse einfügen]",
  },
  cta: "Kostenlose Beratung",
  /** "vollbild" = full-bleed photo hero, "split" = two-column hero with video. */
  heroVariant: "vollbild" as "vollbild" | "split",
  locales: [
    { code: "de", label: "DE", active: true },
    { code: "en", label: "EN", active: false },
  ],
};

export type NavItem = { href: string; label: string };

export const nav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/produkte", label: "Produkte" },
  { href: "/funktionsprinzip", label: "Funktionsprinzip" },
  { href: "/referenzen", label: "Referenzen" },
  // { href: "/blog", label: "Blog" },
  // { href: "/partner", label: "Für Partner" },
  { href: "/kontakt", label: "Kontakt" },
];

export const footerColumns: { title: string; links: NavItem[] }[] = [
  {
    title: "Seiten",
    links: [
      { href: "/ueber-uns", label: "Über uns" },
      { href: "/produkte", label: "Produkte" },
      { href: "/funktionsprinzip", label: "Funktionsprinzip" },
      { href: "/partner", label: "Für Partner" },
    ],
  },
];
