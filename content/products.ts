/**
 * Product catalog content — seeded from City-Ton Austria brochure (page 5).
 * Locale-specific strings live in messages/*.json under products_content.
 */

export const SECURITY_STANDARD = "TBD"; // TODO: content — client to confirm (EN 12600 / ANSI Z97.1 / UL 972)
export const SECURITY_TEST_VIDEO_URL: string | null = null; // TODO: content

export type ProductSlug =
  | "serie-r"
  | "arm-platinum-spectrum"
  | "safety-serie"
  | "uv-protection-clear";

export type UseCaseFilter = "solar" | "uv" | "security" | "clarity";

export type ProductMetrics = {
  tser?: { max: number };
  vlt?: { value?: number; max?: number };
  uv: number;
  thickness?: string;
};

export type ProductSeries = {
  slug: ProductSlug;
  tserMax: number;
  vltMax: number;
  uvProtection: number;
  filters: UseCaseFilter[];
  metrics: ProductMetrics;
  certified?: boolean;
  colors?: string[];
};

export const products: ProductSeries[] = [
  {
    slug: "serie-r",
    tserMax: 80,
    vltMax: 95,
    uvProtection: 99,
    filters: ["solar"],
    metrics: {
      tser: { max: 80 },
      uv: 99,
    },
    colors: ["Silver", "Grey", "Bronze", "Blue", "Green", "Gold"],
  },
  {
    slug: "arm-platinum-spectrum",
    tserMax: 60,
    vltMax: 80,
    uvProtection: 99,
    filters: ["solar", "clarity"],
    metrics: {
      tser: { max: 60 },
      vlt: { max: 80 },
      uv: 99,
    },
  },
  {
    slug: "safety-serie",
    tserMax: 20,
    vltMax: 90,
    uvProtection: 99,
    filters: ["security", "uv"],
    metrics: {
      uv: 99,
      thickness: "4 / 7 / 8 / 12 / 13 mil · 100–336 µm",
    },
    certified: true,
  },
  {
    slug: "uv-protection-clear",
    tserMax: 20,
    vltMax: 89,
    uvProtection: 99.9,
    filters: ["uv", "clarity"],
    metrics: {
      tser: { max: 20 },
      vlt: { value: 89 },
      uv: 99.9,
    },
  },
];

export function formatMetricPercent(
  locale: string,
  opts: { max?: number; value?: number },
): string {
  const upTo = locale === "de" ? "bis" : "up to";
  const pct = locale === "de" ? " %" : "%";
  if (opts.value != null) {
    const v = opts.value % 1 === 0 ? String(opts.value) : String(opts.value).replace(".", ",");
    return `${v}${pct}`;
  }
  if (opts.max != null) {
    return `${upTo} ${opts.max}${pct}`;
  }
  return "";
}

export function formatUv(locale: string, value: number): string {
  const pct = locale === "de" ? " %" : "%";
  const v = value % 1 === 0 ? String(value) : String(value).replace(".", ",");
  return `${v}${pct}`;
}

export function getProduct(slug: string): ProductSeries | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): ProductSlug[] {
  return products.map((p) => p.slug);
}

/** Example data point for How It Works — Armolan R Silver 20 */
export const EXAMPLE_FILM = {
  name: "Armolan R Silver 20",
  tser: "78 %",
  uv: ">99 %",
  glareReduction: "81 %",
} as const;

/** Solar transmission diagram values from brochure page 3 */
export const SOLAR_WITHOUT_FILM = {
  transmission: 85,
  reflection: 8,
  absorption: 7,
} as const;

export const SOLAR_WITH_FILM = {
  transmission: 5,
  reflection: 70,
  absorption: 89,
} as const;

/** Live temperature measurement from brochure page 6 */
export const TEMP_MEASUREMENT = {
  without: 33.3,
  with: 25.7,
  delta: -8.0,
} as const;

/** Company contact — real data from build prompt */
export const CONTACT = {
  phone: "+43 677 61520700",
  email: "office@city-ton.com",
  // TODO: content — exact address and coordinates
  address: null as string | null,
  lat: null as number | null,
  lng: null as number | null,
} as const;
