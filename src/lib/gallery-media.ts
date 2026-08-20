import { readdir } from "node:fs/promises";
import path from "node:path";
import { gallery, type GalleryCaption } from "@/content/gallery";

export type GalleryItem = {
  kind: "image" | "video";
  src: string;
  alt: string;
  project: string;
  film: string;
};

/** @deprecated Use GalleryItem */
export type GalleryImage = GalleryItem;

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm"]);

function captionFor(name: string): GalleryCaption {
  return (gallery.captions as Record<string, GalleryCaption>)[name] ?? gallery.captionFallback;
}

function toItem(name: string, kind: GalleryItem["kind"]): GalleryItem {
  const { project, film } = captionFor(name);
  return {
    kind,
    src: `/media/referenzen/${name.split("/").map(encodeURIComponent).join("/")}`,
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
 * Captions come from `gallery.captions` keyed by basename.
 */
export async function listGalleryImages(): Promise<GalleryItem[]> {
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
    const ext = path.extname(name).toLowerCase();
    if (IMAGE_EXT.has(ext)) photos.push(toItem(name, "image"));
    else if (VIDEO_EXT.has(ext)) videos.push(toItem(name, "video"));
  }

  return interleave(photos, videos);
}
