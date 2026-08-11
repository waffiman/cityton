"use client";

import { useLayoutEffect, useRef, useState } from "react";
import AutoplayVideo from "@/components/AutoplayVideo";
import type { ProcessStep } from "@/content/home";
import styles from "./ProcessMosaic.module.css";

/** How much of the overall section progress each card's own rise animation spans. */
const CARD_RANGE = 0.4;
/**
 * Fraction of scroll progress held back at the end: the last card finishes
 * rising here, not at 1, so the whole diagonal sits fully settled for a
 * beat while still pinned, before the section releases into normal scroll.
 */
const END_HOLD = 0.12;

/** Breakpoint where the section switches from the pinned desktop/tablet
 *  diagonal to the non-pinned, normal-flow mobile stack (must match the
 *  CSS module's `max-width: 700px` mobile query). */
const MOBILE_QUERY = "(max-width: 700px)";
/** Mobile: how far (px) a card still sits below its natural scroll position
 *  right as it settles — a small "catch-up" rise, not a full hide, because
 *  normal document flow (with generous gaps) already keeps it out of view
 *  until it's meant to appear. */
const MOBILE_RISE = 90;
/** Mobile: how much of the viewport height a card's own entrance takes to
 *  complete once its (untransformed) top crosses into the viewport. */
const MOBILE_REVEAL_VH_FRACTION = 0.55;

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * Scroll-driven "ribbon" composition: one dark strip (the design system's
 * darkest brand rung, --color-accent-900) runs behind the steps, each video
 * card's position tied directly to scroll offset — no timers, no
 * IntersectionObserver, no one-time entrance animation.
 *
 * Desktop/tablet: a single shared scroll progress for the whole (tall,
 * sticky-pinned) section is split into overlapping per-card ranges; cards
 * rise from a full stage-height below into their diagonal resting spot.
 *
 * Mobile: portrait cards this wide can't share one pinned frame without
 * overlapping — instead the section is a normal (non-pinned), generously
 * spaced vertical stack, and each card's small settling rise is driven by
 * its own scroll position crossing into the viewport, independently.
 */
export default function ProcessMosaic({ steps, title }: { steps: ProcessStep[]; title: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);

  const [progress, setProgress] = useState(0);
  const [riseDistance, setRiseDistance] = useState(0);
  const [mobileOffsets, setMobileOffsets] = useState<number[]>([]);
  const [isNarrow, setIsNarrow] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Track the mobile/desktop split reactively (a resize can cross it).
  useLayoutEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsNarrow(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceQuery.matches) {
      setReduced(true);
      setProgress(1);
      setMobileOffsets(steps.map(() => 0));
      return;
    }

    let ticking = false;

    const measureDesktop = () => {
      const stageH = stage.offsetHeight;
      setRiseDistance(stageH);

      // The stage sticks at `top: var(--header-height)`, not 0 (it parks
      // below the site header) — read the resolved value so the pin math
      // matches exactly where it actually sticks/releases.
      const topOffset = parseFloat(getComputedStyle(stage).top) || 0;
      const wrapRect = wrap.getBoundingClientRect();
      const runway = wrapRect.height - stageH;
      if (runway <= 0) {
        setProgress(1);
        return;
      }
      const raw = (topOffset - wrapRect.top) / runway;
      setProgress(clamp01(raw));
    };

    const measureMobile = () => {
      const vh = window.innerHeight;
      const revealDistance = Math.max(1, vh * MOBILE_REVEAL_VH_FRACTION);

      const next = cardRefs.current.map((el) => {
        if (!el) return MOBILE_RISE;
        // `offsetTop`/`offsetParent` reflect the element's *layout* box and
        // are unaffected by our own `transform` — reading them (instead of
        // the live, already-translated `getBoundingClientRect()`) avoids a
        // feedback loop where each frame's offset perturbs the next.
        const parent = el.offsetParent as HTMLElement | null;
        const parentTop = parent ? parent.getBoundingClientRect().top : 0;
        const naturalTop = parentTop + el.offsetTop;
        const local = clamp01((vh - naturalTop) / revealDistance);
        return (1 - smoothstep(local)) * MOBILE_RISE;
      });
      setMobileOffsets(next);
    };

    const measure = () => {
      ticking = false;
      if (isNarrow) measureMobile();
      else measureDesktop();
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [steps, isNarrow]);

  const count = steps.length;

  return (
    <div ref={wrapRef} className={styles.pinWrap}>
      <div ref={stageRef} className={styles.stage}>
        <h2 className={styles.heading}>{title}</h2>
        {/* Separate full-bleed wrapper: breaks the ribbon out to the true
            viewport edges (ignoring the section's max-width container)
            while still clipping it there, so it can never cause page-level
            horizontal scroll. Cards get their own clip wrapper below so
            *that* one can stay narrow (matching the stage) without also
            constraining the ribbon. */}
        <div className={styles.stripBleed} aria-hidden="true">
          <div className={styles.strip} />
        </div>
        <div className={styles.cardsClip}>
          <ol className={styles.cards}>
            {steps.map((step, i) => {
              let offsetY: number;
              if (isNarrow) {
                offsetY = reduced ? 0 : (mobileOffsets[i] ?? MOBILE_RISE);
              } else {
                const usableSpan = 1 - END_HOLD - CARD_RANGE;
                const start = count > 1 ? (i / (count - 1)) * usableSpan : 0;
                const end = start + CARD_RANGE;
                const local = (progress - start) / (end - start);
                const t = reduced ? 1 : smoothstep(clamp01(local));
                offsetY = (1 - t) * riseDistance;
              }

              return (
                <li
                  key={step.title}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={`${styles.card} ${styles[`card${i}`] ?? ""}`}
                  style={{ transform: `translate3d(0, ${offsetY.toFixed(1)}px, 0)` }}
                >
                  <div className={styles.cardSurface}>
                    <div className={styles.videoBox}>
                      <AutoplayVideo
                        src={step.video}
                        poster={step.poster}
                        startAt={step.startAt}
                        clipLength={step.clipLength}
                        className={styles.video}
                      />
                    </div>
                    <h3 className={styles.title}>{step.title}</h3>
                    <p className={styles.body}>{step.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
