"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  /** First-frame still shown until playback starts (or forever, on mobile
   * where autoplay stays off) — without it the tile is blank. */
  poster?: string;
  className?: string;
  title?: string;
  /** Gallery lightbox: the user asked for this one, so always play it,
   * even on a touch device. Home hero and other always-visible placements
   * don't need this — they're not gated by `touch` below. */
  alwaysAutoplay?: boolean;
};

/**
 * Silent looping clip — behaves like a GIF, not a player.
 *
 * On touch devices, autoplay stays off unless `alwaysAutoplay` is set: the
 * gallery grid's nine clips are ~20 MB together, which is a lot to spend on
 * someone's mobile data before they've asked for any of it. `autoplay`
 * starts false so the server-rendered markup is the cheap variant and
 * desktop opts in after hydration — that also keeps SSR and first client
 * render identical.
 */
export default function MutedLoopVideo({
  src,
  poster,
  className,
  title,
  alwaysAutoplay = false,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    v.muted = true;
    v.defaultMuted = true;
    v.volume = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }

    const touch = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
    if (touch && !alwaysAutoplay) return;

    setAutoplay(true);
    const play = () => {
      v.muted = true;
      v.volume = 0;
      void v.play().catch(() => {});
    };
    play();
    v.addEventListener("loadeddata", play);
    return () => v.removeEventListener("loadeddata", play);
  }, [src, alwaysAutoplay]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className={className}
      title={title}
      muted
      loop
      playsInline
      autoPlay={autoplay}
      preload="metadata"
      disablePictureInPicture
      controls={false}
      tabIndex={-1}
      aria-hidden={title ? undefined : true}
      style={{ pointerEvents: "none" }}
    />
  );
}
