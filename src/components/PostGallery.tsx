"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import ImageLightbox, { type LightboxItem } from "@/components/ImageLightbox";
import styles from "@/app/[locale]/blog/blog.module.css";

/**
 * Photo gallery under a blog post: an even grid of uploaded images, each
 * opening the shared lightbox. No captions by design — alt text falls back to
 * the post title, which is all the context these photos have.
 */
export default function PostGallery({ urls, postTitle }: { urls: string[]; postTitle: string }) {
  const t = useTranslations("common");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const go = useCallback(
    (delta: number) => {
      setOpenIndex((i) => {
        if (i === null || urls.length === 0) return i;
        return (i + delta + urls.length) % urls.length;
      });
    },
    [urls.length],
  );

  if (urls.length === 0) return null;

  const items: LightboxItem[] = urls.map((src) => ({ kind: "image", src, alt: postTitle }));

  return (
    <>
      <ul className={styles.gallery}>
        {urls.map((src, i) => (
          <li key={src} className={styles.galleryTile}>
            <button
              type="button"
              className={styles.galleryBtn}
              onClick={() => setOpenIndex(i)}
              aria-label={`${postTitle} — ${t("enlargeImage")} (${i + 1}/${urls.length})`}
            >
              <Image
                src={src}
                alt={postTitle}
                fill
                sizes="(max-width: 700px) 50vw, 240px"
                style={{ objectFit: "cover" }}
                // Admin uploads are served from /uploads/… by our own route
                // handler; the optimiser rejects those unless S3 is configured.
                unoptimized
              />
            </button>
          </li>
        ))}
      </ul>

      <ImageLightbox items={items} index={openIndex} onClose={close} onNavigate={go} />
    </>
  );
}
