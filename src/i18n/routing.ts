import { defineRouting } from "next-intl/routing";

/**
 * German stays unprefixed at every URL it's at today (`/produkte`,
 * `/kontakt`, ...) — this is a live, indexed site and every URL built this
 * far must keep resolving identically. English lives under `/en/...`.
 */
export const routing = defineRouting({
  locales: ["de", "en"],
  defaultLocale: "de",
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];
