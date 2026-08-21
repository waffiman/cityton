"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  className?: string;
  title?: string;
};

/** Silent looping clip — behaves like a GIF, not a player. */
export default function MutedLoopVideo({ src, className, title }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    v.muted = true;
    v.defaultMuted = true;
    v.volume = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.removeAttribute("autoplay");
      v.pause();
      return;
    }

    const play = () => {
      v.muted = true;
      v.volume = 0;
      void v.play().catch(() => {});
    };

    play();
    v.addEventListener("loadeddata", play);
    return () => v.removeEventListener("loadeddata", play);
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      title={title}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      disablePictureInPicture
      controls={false}
      tabIndex={-1}
      aria-hidden={title ? undefined : true}
      style={{ pointerEvents: "none" }}
    />
  );
}
