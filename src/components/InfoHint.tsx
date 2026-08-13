"use client";

/**
 * ⓘ info hint: a small button next to an abbreviation/term that reveals its
 * explanation from the central `TERM_TOOLTIPS` glossary (`@/lib/term-tooltips`).
 * Renders nothing if the term has no glossary entry.
 *
 * The popover is portaled to `document.body` and positioned in the `fixed`
 * viewport frame from the trigger's own bounding rect — it can never be
 * clipped by an `overflow: auto` ancestor (e.g. the horizontally scrolling
 * comparison table), and its left offset / top-vs-bottom placement are
 * clamped against the viewport so it's never cut off at an edge. Toggling is
 * click/tap-driven (not hover-only) so it works the same on touch and mouse.
 */

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TERM_TOOLTIPS } from "@/lib/term-tooltips";
import styles from "./InfoHint.module.css";

type Placement = "top" | "bottom";

export default function InfoHint({ term, label }: { term: string; label?: string }) {
  const text = TERM_TOOLTIPS[term];
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; placement: Placement } | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      const target = e.target as Node | null;
      if (btnRef.current?.contains(target) || tipRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    // capture: true so this also fires for scrolls inside the table's own
    // `overflow-x: auto` wrapper, not just window scroll.
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !btnRef.current || !tipRef.current) return;
    const margin = 12;
    const gap = 8;
    const btnRect = btnRef.current.getBoundingClientRect();
    const tipRect = tipRef.current.getBoundingClientRect();

    let left = btnRect.left + btnRect.width / 2 - tipRect.width / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - margin - tipRect.width));

    const spaceAbove = btnRect.top;
    const placement: Placement =
      spaceAbove > tipRect.height + gap + margin ? "top" : "bottom";
    const top = placement === "top" ? btnRect.top - gap : btnRect.bottom + gap;

    setPos({ top, left, placement });
  }, [open]);

  if (!text) return null;

  return (
    <span className={styles.wrap}>
      <button
        ref={btnRef}
        type="button"
        className={styles.btn}
        aria-label={`${label ?? term}: Erklärung`}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        i
      </button>
      {mounted && open
        ? createPortal(
            <span
              role="tooltip"
              id={id}
              ref={tipRef}
              className={styles.tip}
              style={
                pos
                  ? {
                      top: pos.top,
                      left: pos.left,
                      transform: pos.placement === "top" ? "translateY(-100%)" : "none",
                      opacity: 1,
                      visibility: "visible",
                    }
                  : { top: 0, left: 0, opacity: 0, visibility: "hidden" }
              }
            >
              {text}
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}
