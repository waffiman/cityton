"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster: string;
  /** Seconds into the clip where the loop starts. */
  startAt?: number;
  /** Loop length in seconds measured from `startAt`. */
  clipLength?: number;
  className?: string;
};

/**
 * Decorative, always-muted, always-looping background video.
 *
 * Browsers only autoplay muted video, and iOS additionally needs `playsInline`.
 * `startAt` / `clipLength` trim the loop to a usable window of a longer clip.
 * Users who ask for reduced motion get the poster frame instead.
 */
export default function AutoplayVideo({ src, poster, startAt = 0, clipLength, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.removeAttribute("autoplay");
      v.pause();
      return;
    }

    v.muted = true;
    v.volume = 0;

    const seekToStart = () => {
      if (startAt) v.currentTime = startAt;
    };
    const onTimeUpdate = () => {
      if (clipLength && v.currentTime >= startAt + clipLength) v.currentTime = startAt;
      else if (startAt && v.currentTime < startAt - 0.2) v.currentTime = startAt;
    };

    v.addEventListener("loadedmetadata", seekToStart);
    v.addEventListener("timeupdate", onTimeUpdate);
    void v.play().catch(() => {
      /* autoplay refused (e.g. battery saver) — poster stays visible */
    });

    return () => {
      v.removeEventListener("loadedmetadata", seekToStart);
      v.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [startAt, clipLength]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
