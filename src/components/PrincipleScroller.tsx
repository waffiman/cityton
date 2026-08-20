"use client";

import { useEffect, useRef, useState } from "react";
import Corners from "./Corners";
import SeriesGlyph from "./diagrams/SeriesGlyph";
import type { Principle } from "@/content/principles";
import styles from "./PrincipleScroller.module.css";

/** Each chapter reuses the overview-card glyph that illustrates the same physics. */
const PRINCIPLE_GLYPH = {
  reflexion: "reflexion",
  absorption: "absorption",
  uv: "uv",
  einbruchschutz: "kraft",
  sichtschutz: "dekor",
} as const;

/**
 * Scroll-linked explainer: the diagram column sticks while the copy column
 * scrolls, and the active section swaps the drawing. IntersectionObserver
 * keeps this off the scroll thread.
 */
export default function PrincipleScroller({ principles }: { principles: Principle[] }) {
  const [active, setActive] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(Number((visible.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sectionRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const glyph = PRINCIPLE_GLYPH[principles[active].id];

  return (
    <div className={styles.grid}>
      <div className={styles.sticky}>
        <div className={`blueprint ${styles.plate}`}>
          <Corners />
          {/* .plate is --color-neutral-100, so the glyph takes the paper ink. */}
          <SeriesGlyph variant={glyph} field="paper" />
        </div>
        <div className={styles.ticks} aria-hidden="true">
          {principles.map((p, i) => (
            <span key={p.id} className={styles.tick} style={{ opacity: i === active ? 1 : 0.2 }} />
          ))}
        </div>
      </div>

      <div className={styles.copy}>
        {principles.map((p, i) => (
          <div
            key={p.id}
            data-index={i}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className={styles.step}
          >
            <h6 className="eyebrow">{p.kicker}</h6>
            <h2 className={styles.stepTitle}>{p.title}</h2>
            <p className={styles.stepBody}>{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
