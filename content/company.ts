/**
 * Company proof figures.
 * Values marked TODO are placeholders — replace with confirmed numbers.
 */
export const COMPANY = {
  /** TODO: content — confirm founded year */
  foundedYear: 2023,
  /** TODO: content — confirm total m² installed */
  sqmInstalled: 2500,
  /** TODO: content — confirm completed projects count */
  projectsCompleted: 40,
  /** TODO: content — confirm team size */
  teamSize: 4,
  /** TODO: content — confirm markets */
  markets: ["Austria", "Ukraine"] as const,
  /** Placeholder until street address is provided */
  addressLine: null as string | null,
  city: "Vienna",
  country: "Austria",
  /** City-level map fallback (Vienna centre) until exact coords arrive */
  mapLat: 48.2082,
  mapLng: 16.3738,
} as const;

export type CompanyStat = {
  id: string;
  value: number;
  suffix?: string;
  prefix?: string;
  /** Translation key under company.stats.* */
  labelKey: string;
  /** True when the figure is still a placeholder */
  placeholder?: boolean;
};

export const COMPANY_STATS: CompanyStat[] = [
  {
    id: "sqm",
    value: COMPANY.sqmInstalled,
    suffix: "+",
    labelKey: "sqm",
    placeholder: true,
  },
  {
    id: "projects",
    value: COMPANY.projectsCompleted,
    suffix: "+",
    labelKey: "projects",
    placeholder: true,
  },
  {
    id: "years",
    value: new Date().getFullYear() - COMPANY.foundedYear,
    suffix: "+",
    labelKey: "years",
    placeholder: true,
  },
  {
    id: "markets",
    value: COMPANY.markets.length,
    labelKey: "markets",
    placeholder: false,
  },
];
