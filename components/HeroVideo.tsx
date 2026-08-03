"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { media } from "@/content/media";
import { cn } from "@/lib/utils";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type HeroVideoProps = {
  children: React.ReactNode;
  className?: string;
};

export function HeroVideo({ children, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      /* autoplay may be blocked — poster remains */
    });
  }, [reducedMotion]);

  return (
    <section
      className={cn(
        "relative isolate min-h-[92vh] overflow-hidden bg-ink text-white",
        className,
      )}
    >
      <Image
        src={media.hero.poster}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
      />

      {!reducedMotion ? (
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            ready ? "opacity-100" : "opacity-0",
          )}
          poster={media.hero.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          onCanPlay={() => setReady(true)}
          aria-hidden
        >
          <source
            src={media.hero.portraitMp4}
            type="video/mp4"
            media="(max-width: 768px)"
          />
          <source src={media.hero.landscapeWebm} type="video/webm" />
          <source src={media.hero.landscapeMp4} type="video/mp4" />
        </video>
      ) : null}

      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-ink/25 backdrop-blur-[1px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-[1600px] flex-col justify-end px-5 pb-16 pt-32 sm:px-8 md:pb-24 lg:px-10">
        {children}
      </div>
    </section>
  );
}
