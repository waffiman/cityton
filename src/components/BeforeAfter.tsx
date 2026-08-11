"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Corners from "./Corners";
import styles from "./BeforeAfter.module.css";

type Side = {
  src: string;
  alt: string;
  label: string;
  /** Optional callout under the label (e.g. a temperature). */
  value?: string;
  objectPosition?: string;
};

type Props = {
  before: Side;
  after: Side;
  /** CSS aspect-ratio for the rail. Defaults to the heat-comparison portrait. */
  aspectRatio?: string;
  className?: string;
};

/**
 * Draggable before/after wipe. Pointer events cover mouse, touch and pen;
 * the divider is also a real slider input for keyboard and screen-reader users.
 */
export default function BeforeAfter({ before, after, aspectRatio, className }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [pct, setPct] = useState(46);

  const setFromClientX = useCallback((clientX: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const r = rail.getBoundingClientRect();
    setPct(Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (dragging.current) setFromClientX(e.clientX);
    };
    const up = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [setFromClientX]);

  return (
    <div
      ref={railRef}
      className={`blueprint on-dark ${styles.rail}${className ? ` ${className}` : ""}`}
      style={aspectRatio ? { aspectRatio } : undefined}
      onPointerDown={(e) => {
        dragging.current = true;
        setFromClientX(e.clientX);
      }}
    >
      <Corners />

      <Image
        src={before.src}
        alt={before.alt}
        fill
        sizes="(max-width: 900px) 100vw, 420px"
        className={styles.img}
        style={before.objectPosition ? { objectPosition: before.objectPosition } : undefined}
        draggable={false}
        priority={false}
      />
      <Image
        src={after.src}
        alt={after.alt}
        fill
        sizes="(max-width: 900px) 100vw, 420px"
        className={styles.img}
        style={{
          clipPath: `inset(0 0 0 ${pct}%)`,
          ...(after.objectPosition ? { objectPosition: after.objectPosition } : {}),
        }}
        draggable={false}
      />

      <div className={`${styles.badgeLeft}${before.value ? "" : ` ${styles.badgeLabelOnly}`}`}>
        <div className={styles.badgeLabelWarm}>{before.label}</div>
        {before.value ? <div className={styles.badgeValue}>{before.value}</div> : null}
      </div>
      <div className={`${styles.badgeRight}${after.value ? "" : ` ${styles.badgeLabelOnly}`}`}>
        <div className={styles.badgeLabelCool}>{after.label}</div>
        {after.value ? <div className={styles.badgeValue}>{after.value}</div> : null}
      </div>

      <div className={styles.divider} style={{ left: `${pct}%` }}>
        <div className={styles.handle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 6l-4 6 4 6M15 6l4 6-4 6" />
          </svg>
        </div>
      </div>

      <label className={styles.srOnly}>
        Vergleich Vorher / Nachher
        <input
          type="range"
          min={2}
          max={98}
          value={Math.round(pct)}
          onChange={(e) => setPct(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
