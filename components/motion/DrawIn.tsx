"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type DrawInProps = {
  children: ReactNode;
  className?: string;
  duration?: number;
};

/**
 * Wraps an SVG diagram and animates stroke-dashoffset on scroll into view.
 * Paths/lines/polylines/circles/rects with a stroke get drawn in.
 */
export function DrawIn({
  children,
  className,
  duration = 1200,
}: DrawInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = root.querySelectorAll<SVGGeometryElement>(
      "path[stroke], line[stroke], polyline[stroke], circle[stroke], rect[stroke], ellipse[stroke]",
    );

    if (reduced) {
      targets.forEach((el) => {
        el.style.strokeDasharray = "none";
        el.style.strokeDashoffset = "0";
      });
      return;
    }

    targets.forEach((el) => {
      try {
        const length = el.getTotalLength?.() ?? 0;
        if (!length) return;
        el.style.strokeDasharray = String(length);
        el.style.strokeDashoffset = String(length);
        el.style.transition = "none";
      } catch {
        /* some SVG elements may not support getTotalLength */
      }
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        targets.forEach((el, i) => {
          try {
            const length = el.getTotalLength?.() ?? 0;
            if (!length) return;
            el.style.transition = `stroke-dashoffset ${duration}ms ease-out ${i * 40}ms`;
            el.style.strokeDashoffset = "0";
          } catch {
            /* ignore */
          }
        });
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [duration, reduced]);

  return (
    <div ref={ref} className={cn("draw-in", className)}>
      {children}
    </div>
  );
}
