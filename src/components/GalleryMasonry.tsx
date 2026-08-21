"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";
import type { GalleryItem } from "@/lib/gallery-media";
import MutedLoopVideo from "@/components/MutedLoopVideo";
import styles from "@/app/gallery/gallery.module.css";

type Props = {
  images: GalleryItem[];
};

export default function GalleryMasonry({ images }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const titleId = useId();
  const open = openIndex !== null;

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

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, go]);

  if (images.length === 0) return null;

  const current = openIndex !== null ? images[openIndex] : null;

  return (
    <>
      <ul className={styles.masonry}>
        {images.map((item, i) => (
          <li key={item.src} className={styles.tile}>
            <button
              type="button"
              className={styles.tileBtn}
              onClick={() => setOpenIndex(i)}
              aria-label={`${item.project} — ${item.film}. ${item.kind === "video" ? "Video" : "Bild"} vergrößern`}
            >
              {item.kind === "video" ? (
                <MutedLoopVideo src={item.src} className={styles.tileVideo} title={item.alt} />
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

      {open && current ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={close}
        >
          <span id={titleId} className="sr-only">
            {current.project} — {current.film}
          </span>

          <button
            type="button"
            className={styles.lightboxClose}
            onClick={close}
            aria-label="Schließen"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Vorheriges"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Nächstes"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </>
          ) : null}

          <div
            className={styles.lightboxFigure}
            onClick={(e) => e.stopPropagation()}
          >
            {current.kind === "video" ? (
              <MutedLoopVideo src={current.src} className={styles.lightboxVideo} title={current.alt} />
            ) : (
              <Image
                src={current.src}
                alt={current.alt}
                width={1600}
                height={1200}
                sizes="100vw"
                className={styles.lightboxImg}
                priority
              />
            )}
            <div className={styles.lightboxCaption}>
              <p className={styles.lightboxProject}>{current.project}</p>
              <p className={styles.lightboxFilm}>{current.film}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
