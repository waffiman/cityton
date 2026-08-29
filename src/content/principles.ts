/** /funktionsprinzip — order of principles. Copy lives in messages under `principle.*`. */

export type PrincipleId = "reflexion" | "absorption" | "uv" | "einbruchschutz" | "sichtschutz";

/** Resolved shape PrincipleScroller renders — built from messages at request time. */
export type Principle = { id: PrincipleId; kicker: string; title: string; body: string | string[] };

export const principleIds: PrincipleId[] = [
  "reflexion",
  "absorption",
  "uv",
  "einbruchschutz",
  "sichtschutz",
];
