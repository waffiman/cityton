import { readdir } from "node:fs/promises";
import path from "node:path";
import { gallery, type GalleryCaption } from "@/content/gallery";

export type GalleryImage = {
  src: string;
  alt: string;
  project: string;
  film: string;
};

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function captionFor(name: string): GalleryCaption {
  return gallery.captions[name] ?? gallery.captionFallback;
}

/**
 * List every image in public/media/referenzen/, sorted by filename.
 * Captions come from `gallery.captions` keyed by basename.
 */
export async function listGalleryImages(): Promise<GalleryImage[]> {
  const dir = path.join(process.cwd(), "public", "media", "referenzen");

  let names: string[];
  try {
    names = await readdir(dir);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    throw err;
  }

  return names
    .filter((name) => IMAGE_EXT.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
    .map((name) => {
      const { project, film } = captionFor(name);
      return {
        src: `/media/referenzen/${name.split("/").map(encodeURIComponent).join("/")}`,
        alt: `${project} — ${film}`,
        project,
        film,
      };
    });
}
