/**
 * Site-wide structural config — non-text values only. Translatable copy
 * (tagline, description, cta, nav/footer labels) lives in src/messages/*.json;
 * these are just the paths/contact data/hrefs that don't change per locale.
 */

export const site = {
  name: "City-Ton Austria",
  wordmark: "CITY-TON",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://city-ton.com",
  contact: {
    phone: "+43 677 61520700",
    phoneTel: "+4367761520700",
    email: "office@city-ton.com",
    address: "Adelheid-Popp-Gasse 24, 1220 Wien",
  },
  /** "vollbild" = full-bleed photo hero, "split" = two-column hero with video. */
  heroVariant: "vollbild" as "vollbild" | "split",
};

export type NavItem = { href: string; key: string };

/** `key` looks up the label in messages under `nav.*`. */
export const nav: NavItem[] = [
  { href: "/", key: "home" },
  { href: "/ueber-uns", key: "about" },
  { href: "/produkte", key: "products" },
  { href: "/funktionsprinzip", key: "principle" },
  { href: "/gallery", key: "gallery" },
  // { href: "/partner", key: "partner" },
  { href: "/kontakt", key: "contact" },
];

/** `titleKey`/link `key`s look up messages under `footer.*`/`nav.*`. */
export const footerColumns: { titleKey: string; links: NavItem[] }[] = [
  {
    titleKey: "pagesTitle",
    links: [
      { href: "/ueber-uns", key: "about" },
      { href: "/produkte", key: "products" },
      { href: "/funktionsprinzip", key: "principle" },
      { href: "/partner", key: "partner" },
    ],
  },
];
