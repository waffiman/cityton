import { readdir } from "node:fs/promises";
import path from "node:path";

export type GalleryImage = {
  src: string;
  alt: string;
};

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

/**
 * List every image in public/media/referenzen/, sorted by filename.
 * Called from the Gallery page so newly dropped files show after refresh.
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
    .map((name) => ({
      src: `/media/referenzen/${name.split("/").map(encodeURIComponent).join("/")}`,
      alt: "Montiertes Objekt",
    }));
}
