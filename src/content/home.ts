/**
 * Home-page structural data — file paths, keys. Text lives in
 * src/messages/*.json under the `home` namespace (key below picks the
 * message: e.g. benefit key "sun" -> `home.benefits.items.sun.title`).
 */

export type Benefit = { key: string; icon: "sun" | "shield" | "bolt" | "impact" };

export const benefits: Benefit[] = [
  { key: "sun", icon: "sun" },
  { key: "uv", icon: "shield" },
  { key: "energy", icon: "bolt" },
  { key: "safety", icon: "impact" },
];

export type ProcessStep = {
  key: string;
  video: string;
  poster: string;
  /** Seconds into the clip where the loop should start. */
  startAt?: number;
  /** Loop length in seconds from startAt. */
  clipLength?: number;
};

/** Shape ProcessRibbon actually renders — title/body resolved from messages. */
export type ResolvedProcessStep = {
  title: string;
  body: string;
  video: string;
  poster: string;
  startAt?: number;
  clipLength?: number;
};

// The clips are pre-trimmed to exactly the window that used to be selected at
// runtime via `startAt`/`clipLength` (the montage source was 45 s for a 5 s
// loop), so playback now needs no seeking and `loop` alone carries it.
export const processSteps: ProcessStep[] = [
  { key: "beratung", video: "/media/ablauf-messung.mp4", poster: "/media/install-detail.jpg" },
  { key: "muster", video: "/media/ablauf-beratung.mp4", poster: "/media/film-roll-1.jpg" },
  { key: "montage", video: "/media/ablauf-montage.mp4", poster: "/media/facade-wide.jpg" },
  { key: "abnahme", video: "/media/ablauf-abnahme.mp4", poster: "/media/install-team.jpg" },
];

export const praxisMontage = {
  cta: { href: "/gallery" },
  video: {
    // .mp4, not the original .MOV: Firefox refuses `video/quicktime` outright,
    // and the untranscoded original was 33 MB for a 20 s muted loop.
    src: "/media/film-montage.mp4",
    poster: "/media/film-montage-poster.jpg",
  },
};

export const consultation = {
  specKeys: ["termin", "dauer", "kosten"] as const,
  image: { src: "/media/referenzen/interior-2.jpg" },
};
