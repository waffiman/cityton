/**
 * Shape of a /gallery tile, and the mapping from a stored row onto it.
 *
 * Deliberately free of both `node:fs` and Prisma imports: `GalleryMasonry` and
 * `ImageLightbox` are client components and import `GalleryItem` from here.
 * The query itself lives in the gallery page, which is a server component.
 */

export type GalleryItem = {
  kind: "image" | "video";
  src: string;
  /** First-frame still for video tiles — see public/media/video-posters/. */
  poster?: string;
  alt: string;
  project: string;
  film: string;
};

/** The columns of a GalleryItem row this module needs. */
export type GalleryRow = {
  url: string;
  kind: string;
  posterUrl: string | null;
  projectDe: string;
  filmDe: string;
  projectEn: string;
  filmEn: string;
};

/**
 * Pick the caption for `locale` and flatten the row into a tile.
 *
 * Captions live in the database rather than the message files because they are
 * per-item content the admin edits, not UI chrome — and next-intl reserves "."
 * in keys, which a file-name-keyed message block could never satisfy.
 */
export function toGalleryItem(row: GalleryRow, locale: string): GalleryItem {
  const english = locale.startsWith("en");
  const project = english ? row.projectEn : row.projectDe;
  const film = english ? row.filmEn : row.filmDe;

  return {
    kind: row.kind === "video" ? "video" : "image",
    src: row.url,
    // Grid videos don't autoplay on mobile (see MutedLoopVideo) and
    // preload="metadata" alone doesn't guarantee a decoded frame — without a
    // poster the tile is just blank until tapped.
    poster: row.posterUrl ?? undefined,
    alt: `${project} — ${film}`,
    project,
    film,
  };
}
