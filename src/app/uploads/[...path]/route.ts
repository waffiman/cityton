import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { LOCAL_UPLOAD_DIR } from "@/lib/storage";

export const runtime = "nodejs";
// Reads the filesystem per request — the whole point is serving files that did
// not exist when the app was built.
export const dynamic = "force-dynamic";

/**
 * Serve admin-uploaded images from the local-disk storage backend.
 *
 * These can't live in `public/`: Next resolves that directory at build time, so
 * anything written afterwards 404s. The upload directory is a Docker volume
 * mounted outside the build output, and this handler streams from it.
 *
 * Inert when S3 is configured — `uploadImage` then returns absolute S3 URLs and
 * nothing points here.
 */

const CONTENT_TYPE: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

export async function GET(_request: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await ctx.params;

  // Every segment must be a plain name. Rejecting "..", separators and dotfiles
  // here means the resolved path can never escape the upload directory.
  const safe = segments.length > 0 && segments.every((s) => /^[A-Za-z0-9._-]+$/.test(s) && s !== ".." && !s.startsWith("."));
  if (!safe) return new Response("Not found", { status: 404 });

  const ext = path.extname(segments[segments.length - 1]).toLowerCase();
  const contentType = CONTENT_TYPE[ext];
  if (!contentType) return new Response("Not found", { status: 404 });

  const root = path.join(process.cwd(), LOCAL_UPLOAD_DIR);
  const file = path.join(root, ...segments);
  // Belt and braces: confirm the resolved path really is inside the root.
  if (!file.startsWith(root + path.sep)) return new Response("Not found", { status: 404 });

  let size: number;
  try {
    const info = await stat(file);
    if (!info.isFile()) return new Response("Not found", { status: 404 });
    size = info.size;
  } catch {
    return new Response("Not found", { status: 404 });
  }

  // Keys embed a timestamp and random suffix, so a given URL is immutable.
  const stream = Readable.toWeb(createReadStream(file)) as ReadableStream;
  return new Response(stream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
