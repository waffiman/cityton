"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { media } from "@/content/media";

type LoopKey = keyof typeof media.loops;

type LoopVideoProps = {
  loop: LoopKey;
  className?: string;
  title?: string;
};

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getSnap() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function LoopVideo({ loop, className, title }: LoopVideoProps) {
  const reduced = useSyncExternalStore(subscribe, getSnap, () => false);
  const asset = media.loops[loop];

  if (reduced) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset.poster}
        alt={title ?? ""}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <video
      className={cn("h-full w-full object-cover", className)}
      autoPlay
      muted
      loop
      playsInline
      poster={asset.poster}
      aria-label={title}
    >
      <source src={asset.webm} type="video/webm" />
      <source src={asset.mp4} type="video/mp4" />
    </video>
  );
}
