"use client";

import { useEffect, useRef, useState } from "react";
import AutoplayVideo from "@/components/AutoplayVideo";
import type { ProcessStep } from "@/content/home";
import styles from "./ProcessMosaic.module.css";

/**
 * Alternating inset mosaic: identical portraits; even rows tinted with --s2.
 * Copy drops into the lower vertical span of its video (desktop), matching the
 * mobile idea of text not sitting only beside mid-frame. Neighboring portraits
 * still overlap between rows.
 */
export default function ProcessMosaic({ steps }: { steps: ProcessStep[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const all: Record<string, boolean> = {};
      for (const el of nodes) {
        const id = el.dataset.reveal;
        if (id) all[id] = true;
      }
      setVisible(all);
      return;
    }

    const initial: Record<string, boolean> = {};
    for (const el of nodes) {
      const id = el.dataset.reveal;
      if (!id) continue;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        initial[id] = true;
      }
    }
    setVisible(initial);

    // Arm the hide/reveal transition only after the first paint so above-the-fold
    // blocks never flash from invisible → visible on load.
    const arm = requestAnimationFrame(() => setArmed(true));

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).dataset.reveal;
          if (!id) continue;
          setVisible((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
    );

    for (const el of nodes) {
      const id = el.dataset.reveal;
      if (id && !initial[id]) io.observe(el);
    }

    return () => {
      cancelAnimationFrame(arm);
      io.disconnect();
    };
  }, [steps]);

  const stepClass = [styles.step0, styles.step1, styles.step2, styles.step3];

  return (
    <ol ref={listRef} className={styles.mosaic}>
      {steps.map((step, i) => {
        const flip = i % 2 === 1;
        const mediaId = `m${i}`;
        const copyId = `c${i}`;
        const mediaIn = !armed || visible[mediaId];
        const copyIn = !armed || visible[copyId];
        return (
          <li key={step.title} className={`${styles.row} ${flip ? styles.rowFlip : ""} ${stepClass[i] ?? ""}`}>
            <div
              data-reveal={mediaId}
              className={`${styles.media} ${armed ? styles.reveal : ""} ${mediaIn ? styles.in : ""}`}
              style={{ transitionDelay: `${80 + i * 40}ms` }}
            >
              <figure className={styles.figure}>
                <AutoplayVideo
                  src={step.video}
                  poster={step.poster}
                  startAt={step.startAt}
                  clipLength={step.clipLength}
                  className={styles.video}
                />
              </figure>
            </div>

            <div
              data-reveal={copyId}
              className={`${styles.copy} ${armed ? styles.reveal : ""} ${copyIn ? styles.in : ""}`}
              style={{ transitionDelay: `${180 + i * 40}ms` }}
            >
              <div className={styles.copyInner}>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.body}>{step.body}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
