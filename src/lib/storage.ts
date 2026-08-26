import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

/**
 * Storage for admin image uploads, with two interchangeable backends.
 *
 * S3-compatible object storage (Cloudflare R2, Backblaze B2, MinIO) is used
 * whenever it is fully configured. Otherwise uploads go to a directory under
 * `public/`, which Next serves statically — on the VPS that path is a Docker
 * volume, so the files outlive `compose up --build` the same way the Postgres
 * data does.
 *
 * Deliberately in that order: setting the six `S3_*` vars switches a running
 * deployment over to object storage with no code change, so local disk is a
 * working default rather than a dead end.
 */

let cached: S3Client | null = null;

/** Directory (relative to the app root) backing the local-disk fallback. */
const LOCAL_DIR = "public/uploads";
/** URL prefix the same files are served from. */
const LOCAL_URL_PREFIX = "/uploads";

/** Every S3 var present? A half-filled config is treated as "not configured". */
function s3Configured(): boolean {
  return Boolean(
    process.env.S3_ENDPOINT &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_BUCKET &&
      process.env.S3_PUBLIC_BASE_URL,
  );
}

function client(): S3Client {
  if (cached) return cached;
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION || "auto";
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("S3 storage is not configured (S3_ENDPOINT / keys missing).");
  }
  cached = new S3Client({
    region,
    endpoint,
    forcePathStyle: true, // required by MinIO and most self-hosted S3
    credentials: { accessKeyId, secretAccessKey },
  });
  return cached;
}

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export function isAllowedImageType(contentType: string): boolean {
  return contentType in EXT_BY_TYPE;
}

/**
 * Build the stored object key. `folder` reaches here already restricted to a
 * fixed set by the upload route, but this is a library — re-check rather than
 * trust the caller, so a folder can never climb out of the upload directory.
 */
function objectKey(contentType: string, folder: string): string {
  const ext = EXT_BY_TYPE[contentType];
  if (!ext) throw new Error(`Unsupported image type: ${contentType}`);
  if (!/^[a-z0-9-]+$/.test(folder)) throw new Error(`Invalid upload folder: ${folder}`);
  return `${folder}/${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;
}

/**
 * Upload an image and return its public URL — an absolute URL on S3, or a
 * site-relative `/uploads/...` path on local disk.
 * `folder` groups objects (e.g. "products", "posts").
 */
export async function uploadImage(
  data: Buffer | Uint8Array,
  contentType: string,
  folder: string,
): Promise<string> {
  const key = objectKey(contentType, folder);

  if (!s3Configured()) {
    const dest = path.join(process.cwd(), LOCAL_DIR, key);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, data);
    return `${LOCAL_URL_PREFIX}/${key}`;
  }

  await client().send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: data,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${process.env.S3_PUBLIC_BASE_URL!.replace(/\/$/, "")}/${key}`;
}
