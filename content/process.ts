export type ProcessVariant = "install" | "partner";

export const PROCESS_STEP_KEYS = [
  "consult",
  "measure",
  "select",
  "install",
  "inspect",
] as const;

export type ProcessStepKey = (typeof PROCESS_STEP_KEYS)[number];

/** Default film layer keys for FilmLayers diagram */
export const FILM_LAYER_KEYS = [
  "scratch",
  "uv",
  "functional",
  "adhesive",
  "liner",
] as const;

export type FilmLayerKey = (typeof FILM_LAYER_KEYS)[number];
