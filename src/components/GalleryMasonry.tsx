"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import type { GalleryItem } from "@/lib/gallery-media";
import ImageLightbox from "@/components/ImageLightbox";
import MutedLoopVideo from "@/components/MutedLoopVideo";
import styles from "@/app/[locale]/gallery/gallery.module.css";

type Props = {
  images: GalleryItem[];
};

export default function GalleryMasonry({ images }: Props) {
  const t = useTranslations("gallery");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const go = useCallback(
    (delta: number) => {
      setOpenIndex((i) => {
        if (i === null || images.length === 0) return i;
        return (i + delta + images.length) % images.length;
      });
    },
    [images.length],
  );

  if (images.length === 0) return null;

  return (
    <>
      <ul className={styles.masonry}>
        {images.map((item, i) => (
          <li key={item.src} className={styles.tile}>
            <button
              type="button"
              className={styles.tileBtn}
              onClick={() => setOpenIndex(i)}
              aria-label={`${item.project} — ${item.film}. ${item.kind === "video" ? t("enlargeVideo") : t("enlargeImage")}`}
            >
              {item.kind === "video" ? (
                <MutedLoopVideo
                  src={item.src}
                  poster={item.poster}
                  className={styles.tileVideo}
                  title={item.alt}
                />
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={800}
                  height={1000}
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  className={styles.tileImg}
                />
              )}
              <span className={styles.tileOverlay} aria-hidden="true">
                <span className={styles.tileProject}>{item.project}</span>
                <span className={styles.tileFilm}>{item.film}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <ImageLightbox items={images} index={openIndex} onClose={close} onNavigate={go} />
    </>
  );
}
