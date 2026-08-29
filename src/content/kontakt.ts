/**
 * Kontakt page structural data. Copy lives in messages under `kontakt.*`.
 *
 * `objectTypeValues`/`goalValues` are persisted into `Inquiry.objektart`/
 * `.goals` in Postgres — never translate or rename these, only their
 * labels (looked up as `kontakt.objectTypes.<value>` / `kontakt.goals.<value>`
 * in messages) change per locale.
 */

export const objectTypeValues = ["wohnung", "haus", "buero", "gewerbe", "sonstiges"] as const;
export const goalValues = [
  "sonnenschutz",
  "uv",
  "energie",
  "einbruchschutz",
  "privatsphaere",
] as const;

/** Google Maps embed centered on Wien. */
export const mapEmbedSrc =
  "https://www.google.com/maps?q=Adelheid-Popp-Gasse+24%2C+1220+Wien%2C+%C3%96sterreich&hl=de&z=16&output=embed";
export const mapLinkHref =
  "https://www.google.com/maps?q=Adelheid-Popp-Gasse+24%2C+1220+Wien%2C+%C3%96sterreich&hl=de&z=16";

export type ObjektartValue = (typeof objectTypeValues)[number];
export type GoalValue = (typeof goalValues)[number];
