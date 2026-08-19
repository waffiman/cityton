/**
 * Goal filter for the /produkte chooser. Kept out of lib/products.ts because
 * SeriesChooser is a client component — importing that module would pull
 * Prisma and pg into the browser bundle.
 */
export const SERIES_GOALS = [
  ["alle", "Alle"],
  ["hitze", "Hitze"],
  ["blendung", "Blendung"],
  ["uv", "UV"],
  ["sicherheit", "Sicherheit"],
  ["sichtschutz", "Sichtschutz"],
] as const;

export type SeriesGoal = (typeof SERIES_GOALS)[number][0];

const GOALS_BY_SLUG: Record<string, SeriesGoal[]> = {
  "serie-r": ["hitze", "blendung"],
  "arm-platinum-spectrum": ["hitze", "blendung", "uv"],
  safety: ["sicherheit"],
  "uv-protection-clear": ["uv"],
  "sichtschutz-dekor": ["sichtschutz"],
};

/** Series left unmapped stay visible under every goal rather than vanishing. */
export function seriesMatchesGoal(slug: string, goal: SeriesGoal): boolean {
  if (goal === "alle") return true;
  const goals = GOALS_BY_SLUG[slug];
  return goals ? goals.includes(goal) : true;
}
