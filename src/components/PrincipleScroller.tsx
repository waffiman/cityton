"use client";

import { useEffect, useRef, useState } from "react";
import Corners from "./Corners";
import { principleDiagrams } from "./diagrams/PrincipleDiagrams";
import type { Principle } from "@/content/principles";
import styles from "./PrincipleScroller.module.css";

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

  const Diagram = principleDiagrams[principles[active].id];

  return (
    <div className={styles.grid}>
      <div className={styles.sticky}>
        <div className={`blueprint ${styles.plate}`}>
          <Corners />
          <Diagram />
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
