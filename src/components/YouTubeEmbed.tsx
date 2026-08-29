"use client";

/**
 * Click-to-play YouTube facade.
 *
 * The poster is served from public/media, so an unplayed video sends nothing
 * to Google — the iframe (privacy-enhanced youtube-nocookie host) is mounted
 * only once the visitor presses play, which is the same two-click logic the
 * Datenschutz page describes for analytics. `autoplay=1` is what makes that
 * click also start the clip.
 */

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Corners from "@/components/Corners";
import styles from "./YouTubeEmbed.module.css";

type Props = {
  id: string;
  title: string;
  poster: string;
  credit?: string;
};

export default function YouTubeEmbed({ id, title, poster, credit }: Props) {
  const t = useTranslations("youtubeEmbed");
  const [playing, setPlaying] = useState(false);

  return (
    <figure className={styles.figure}>
      <div className={`blueprint ${styles.plate}`}>
        <Corners />
        <div className={styles.frame}>
          {playing ? (
            <iframe
              className={styles.player}
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className={styles.trigger}
              onClick={() => setPlaying(true)}
              aria-label={`${t("playLabel")}: ${title}`}
            >
              <Image
                src={poster}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 900px"
                className={styles.poster}
              />
              <span className={styles.play} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26" focusable="false">
                  <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.captionTitle}>
          {title}
          {credit ? ` · ${credit}` : null}
        </span>
        {!playing && <span className={styles.note}>{t("privacyNote")}</span>}
      </figcaption>
    </figure>
  );
}
