import { randomBytes } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

/**
 * S3-compatible object storage for admin image uploads.
 * Works unchanged against Cloudflare R2 / Backblaze B2 now and MinIO on the VPS
 * later — only the env vars change.
 */

let cached: S3Client | null = null;

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
 * Upload an image and return its public URL.
 * `folder` groups objects (e.g. "products", "posts").
 */
export async function uploadImage(
  data: Buffer | Uint8Array,
  contentType: string,
  folder: string,
): Promise<string> {
  const bucket = process.env.S3_BUCKET;
  const publicBase = process.env.S3_PUBLIC_BASE_URL;
  if (!bucket || !publicBase) {
    throw new Error("S3 storage is not configured (S3_BUCKET / S3_PUBLIC_BASE_URL missing).");
  }
  const ext = EXT_BY_TYPE[contentType];
  if (!ext) throw new Error(`Unsupported image type: ${contentType}`);

  const key = `${folder}/${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;

  await client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: data,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${publicBase.replace(/\/$/, "")}/${key}`;
}
