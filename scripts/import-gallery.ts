/**
 * One-time import of the file-based gallery into the GalleryItem table.
 *
 * Until now /gallery scanned public/media/referenzen/ on every request and
 * looked captions up in the message files by file name. This script copies that
 * exact result into the database — same files, same captions, same order — so
 * the page can read one source and the admin panel can edit it.
 *
 * The captions are inlined below rather than read from src/messages/*.json: the
 * message files lose their `gallery.captions` block in the same change, and a
 * migration that depends on what it deletes is a migration that runs once and
 * then rots. The folder itself is still scanned, so this can never claim to
 * import a file that was not actually shipped.
 *
 * Idempotent — `url` is unique and existing rows are skipped, so re-running
 * after adding a file to the folder imports only what is missing.
 *
 *   npx tsx scripts/import-gallery.ts [--dry-run]
 */

// Reads .env when run from a checkout; in the container DATABASE_URL is
// already in the environment and there is no .env to find.
import "dotenv/config";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const MEDIA_DIR = path.join(process.cwd(), "public", "media", "referenzen");
const URL_PREFIX = "/media/referenzen";
const POSTER_PREFIX = "/media/video-posters";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm"]);

/** [file name, Projekt (de), Folie (de), project (en), film (en)] */
const CAPTIONS: [string, string, string, string, string][] = [
  ["gallery_1.png", "Wohnobjekt · Sonnenschutz", "Dual Reflective Serie", "Residential · Solar control", "Dual Reflective series"],
  ["gallery_2.png", "Fassade · Tageslicht", "LLumar Architectural", "Façade · Daylight", "LLumar Architectural"],
  ["gallery_4.png", "Wohnobjekt · Dual Reflective", "Armolan Dual Reflective", "Residential · Dual Reflective", "Armolan Dual Reflective"],
  ["gallery_5.JPG", "Büro · Blendschutz", "Sonnenschutzfolie", "Office · Glare control", "Solar control film"],
  ["gallery_7.JPG", "Gewerbeobjekt", "Sicherheitsfolie", "Commercial object", "Security film"],
  ["gallery_8.jpg", "Schaufenster", "UV-Schutzfolie", "Shop window", "UV protection film"],
  ["gallery_9.JPG", "Innenraum · Privatsphäre", "Sichtschutzfolie", "Interior · Privacy", "Privacy film"],
  ["gallery_10.JPG", "Fassadenband", "Energiesparfolie", "Façade band", "Energy-saving film"],
  ["gallery_6.jpg", "Eckfenster · Wohnung", "Sonnenschutzfolie", "Corner window · Apartment", "Solar control film"],
  ["interior-2.jpg", "Interieur · Glaswand", "Sonnenschutzfolie", "Interior · Glass wall", "Solar control film"],
  ["photo_2026-08-14_23-59-53.jpg", "Montageobjekt", "Folie auf Anfrage", "Installation object", "Film on request"],
  ["reflective-facade-upscaled.jpg", "Reflektierende Fassade", "Dual Reflective Serie", "Reflective façade", "Dual Reflective series"],
  ["telegram_video.mp4", "Montage vor Ort", "Sonnenschutzfolie", "On-site installation", "Solar control film"],
  ["telegram_video(1).mp4", "Montage vor Ort", "Sonnenschutzfolie", "On-site installation", "Solar control film"],
  ["telegram_video(2).mp4", "Arbeit am Glas", "Sicherheitsfolie", "Work on glass", "Security film"],
  ["telegram_video(3).mp4", "Arbeit am Glas", "Sicherheitsfolie", "Work on glass", "Security film"],
  ["telegram_video(4).mp4", "Fassadenmontage", "Dual Reflective Serie", "Façade installation", "Dual Reflective series"],
  ["telegram_video(5).mp4", "Fassadenmontage", "Dual Reflective Serie", "Façade installation", "Dual Reflective series"],
  ["telegram_video(6).mp4", "Innenraum · Folierung", "Sichtschutzfolie", "Interior · Film application", "Privacy film"],
  ["telegram_video(7).mp4", "Innenraum · Folierung", "Sichtschutzfolie", "Interior · Film application", "Privacy film"],
  ["telegram_video(8).mp4", "Objekt nach der Montage", "Folie auf Anfrage", "Object after installation", "Film on request"],
];

/** Caption used for a file the list above does not cover. */
const FALLBACK = ["Projekt", "Folie auf Anfrage", "Project", "Film on request"] as const;

const captionByName = new Map(CAPTIONS.map(([name, ...rest]) => [name, rest]));

type Item = {
  url: string;
  kind: "image" | "video";
  posterUrl: string | null;
  projectDe: string;
  filmDe: string;
  projectEn: string;
  filmEn: string;
};

function encodePath(name: string): string {
  return `${URL_PREFIX}/${name.split("/").map(encodeURIComponent).join("/")}`;
}

function toItem(name: string, kind: Item["kind"]): Item {
  const [projectDe, filmDe, projectEn, filmEn] = captionByName.get(name) ?? FALLBACK;
  const base = name.slice(0, name.length - path.extname(name).length);
  return {
    url: encodePath(name),
    kind,
    posterUrl: kind === "video" ? `${POSTER_PREFIX}/${encodeURIComponent(base)}.jpg` : null,
    projectDe,
    filmDe,
    projectEn,
    filmEn,
  };
}

/**
 * Spread videos at even intervals among the photos — the ordering the page used
 * when it built the list per request. Reproduced here so the imported
 * `sortOrder` renders the gallery exactly as it looks today.
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

async function collect(): Promise<Item[]> {
  const names = await readdir(MEDIA_DIR);
  const photos: Item[] = [];
  const videos: Item[] = [];

  for (const name of names.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))) {
    // Dotfiles and the macOS AppleDouble siblings ("._foo.mp4") a tar upload
    // leaves behind are not media, despite the extension.
    if (name.startsWith(".")) continue;
    const ext = path.extname(name).toLowerCase();
    if (IMAGE_EXT.has(ext)) photos.push(toItem(name, "image"));
    else if (VIDEO_EXT.has(ext)) videos.push(toItem(name, "video"));
  }

  return interleave(photos, videos);
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const items = await collect();
  const existing = new Set(
    (await prisma.galleryItem.findMany({ select: { url: true } })).map((r) => r.url),
  );

  let created = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const skip = existing.has(item.url);
    const mark = skip ? "skip" : "add ";
    console.log(`  ${String(i).padStart(2)} ${mark} ${item.kind.padEnd(5)} ${item.projectDe} — ${item.url}`);
    if (skip || dryRun) continue;
    await prisma.galleryItem.create({ data: { ...item, visible: true, sortOrder: i } });
    created += 1;
  }

  console.log(
    dryRun
      ? `\n${items.length} item(s) found, ${items.length - existing.size} would be created (dry run).`
      : `\n${items.length} item(s) found, ${created} created, ${items.length - created} already present.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
