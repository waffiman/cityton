"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useId } from "react";
import MutedLoopVideo from "@/components/MutedLoopVideo";
import styles from "@/app/[locale]/gallery/gallery.module.css";

export type LightboxItem = {
  kind: "image" | "video";
  src: string;
  /** First-frame still for video items. */
  poster?: string;
  alt: string;
  /** Caption lines. Both optional — the blog gallery has no captions. */
  project?: string;
  film?: string;
};

/**
 * Full-screen overlay for a list of images/videos, with arrow-key and Escape
 * navigation and the page scroll locked while open.
 *
 * Shared by the Galerie page (`GalleryMasonry`) and blog post galleries
 * (`PostGallery`); each owns its own thumbnail layout and open/close state and
 * hands the index in here. Styles stay in gallery.module.css so both look
 * identical.
 */
export default function ImageLightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: LightboxItem[];
  /** Index of the open item, or null when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (delta: number) => void;
}) {
  const t = useTranslations("common");
  const titleId = useId();
  const open = index !== null;

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(-1);
      if (e.key === "ArrowRight") onNavigate(1);
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, onNavigate]);

  if (!open) return null;
  const current = items[index];
  if (!current) return null;

  const caption = [current.project, current.film].filter(Boolean).join(" — ");

  return (
    <div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <span id={titleId} className="sr-only">
        {caption || current.alt}
      </span>

      <button type="button" className={styles.lightboxClose} onClick={onClose} aria-label={t("close")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </button>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(-1);
            }}
            aria-label={t("prev")}
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
              onNavigate(1);
            }}
            aria-label={t("next")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </>
      ) : null}

      <div className={styles.lightboxFigure} onClick={(e) => e.stopPropagation()}>
        {current.kind === "video" ? (
          <MutedLoopVideo
            src={current.src}
            poster={current.poster}
            className={styles.lightboxVideo}
            title={current.alt}
            alwaysAutoplay
          />
        ) : (
          <Image
            src={current.src}
            alt={current.alt}
            width={1600}
            height={1200}
            sizes="100vw"
            className={styles.lightboxImg}
            priority
            // Admin uploads can be site-relative /uploads/… paths, which the
            // optimiser rejects unless S3_PUBLIC_BASE_URL populates
            // images.remotePatterns. See src/lib/storage.ts.
            unoptimized={current.src.startsWith("/uploads/")}
          />
        )}
        {current.project || current.film ? (
          <div className={styles.lightboxCaption}>
            {current.project ? <p className={styles.lightboxProject}>{current.project}</p> : null}
            {current.film ? <p className={styles.lightboxFilm}>{current.film}</p> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
