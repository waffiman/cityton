"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** How far the child moves as a fraction of scroll through the parent (0–1). */
  strength?: number;
};

export function Parallax({
  children,
  className,
  strength = 0.2,
}: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    const child = childRef.current;
    if (!container || !child) return;

    let raf = 0;
    const update = () => {
      const rect = container.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      const offset = (clamped - 0.5) * strength * 100;
      child.style.transform = `translate3d(0, ${offset}%, 0) scale(1.12)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, strength]);

  const style: CSSProperties = reduced
    ? { transform: "scale(1.05)" }
    : { transform: "translate3d(0, 0, 0) scale(1.12)", willChange: "transform" };

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)}>
      <div ref={childRef} className="h-full w-full" style={style}>
        {children}
      </div>
    </div>
  );
}
