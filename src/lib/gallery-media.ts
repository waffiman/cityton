import { readdir } from "node:fs/promises";
import path from "node:path";

export type GalleryCaption = { project: string; film: string };

export type GalleryItem = {
  kind: "image" | "video";
  src: string;
  /** First-frame still for video tiles — see public/media/video-posters/. */
  poster?: string;
  alt: string;
  project: string;
  film: string;
};

/** @deprecated Use GalleryItem */
export type GalleryImage = GalleryItem;

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm"]);

function toItem(
  name: string,
  kind: GalleryItem["kind"],
  captions: Record<string, GalleryCaption>,
  fallback: GalleryCaption,
): GalleryItem {
  const { project, film } = captions[name] ?? fallback;
  const base = name.slice(0, name.length - path.extname(name).length);
  return {
    kind,
    src: `/media/referenzen/${name.split("/").map(encodeURIComponent).join("/")}`,
    // Grid videos don't autoplay on mobile (see MutedLoopVideo) and
    // preload="metadata" alone doesn't guarantee a decoded frame — without a
    // poster the tile is just blank until tapped. Generated once via ffmpeg
    // (first frame, scripts/generate-video-posters.sh), not per-request.
    poster:
      kind === "video" ? `/media/video-posters/${encodeURIComponent(base)}.jpg` : undefined,
    alt: `${project} — ${film}`,
    project,
    film,
  };
}

function byName(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

/**
 * Spread videos at even intervals among photos so they sit in the masonry
 * together. Order is stable (filename sort + even slots), not shuffled.
 */
function interleave<T>(photos: T[], videos: T[]): T[] {
  if (videos.length === 0) return photos;
  if (photos.length === 0) return videos;

  const out: T[] = [];
  const groups = videos.length + 1;
  const base = Math.floor(photos.length / groups);
  let extra = photos.length % groups;
  let pi = 0;

  for (let g = 0; g < groups; g++) {
    const take = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra -= 1;
    out.push(...photos.slice(pi, pi + take));
    pi += take;
    if (g < videos.length) out.push(videos[g]);
  }

  return out;
}

/**
 * List images and videos in public/media/referenzen/.
 * `captions`/`fallback` come from messages (`gallery.captions`,
 * `gallery.captionFallback*`) — keyed by basename, passed in so this stays
 * locale-agnostic (no content import here).
 */
export async function listGalleryImages(
  captions: Record<string, GalleryCaption>,
  fallback: GalleryCaption,
): Promise<GalleryItem[]> {
  const dir = path.join(process.cwd(), "public", "media", "referenzen");

  let names: string[];
  try {
    names = await readdir(dir);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    throw err;
  }

  const photos: GalleryItem[] = [];
  const videos: GalleryItem[] = [];

  for (const name of names.sort(byName)) {
    // Skip dotfiles and macOS AppleDouble siblings ("._foo.mp4"), which a tar
    // upload from a Mac leaves next to real files. They end in a media
    // extension, so without this they become uncaptioned, unplayable tiles.
    if (name.startsWith(".")) continue;
    const ext = path.extname(name).toLowerCase();
    if (IMAGE_EXT.has(ext)) photos.push(toItem(name, "image", captions, fallback));
    else if (VIDEO_EXT.has(ext)) videos.push(toItem(name, "video", captions, fallback));
  }

  return interleave(photos, videos);
}
