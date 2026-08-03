"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@/lib/utils";

export type Metric = {
  value: string;
  label: string;
};

export type BeforeAfterSliderProps = {
  before: React.ReactNode;
  after: React.ReactNode;
  beforeMetrics?: Metric[];
  afterMetrics?: Metric[];
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number;
  className?: string;
};

export function BeforeAfterSlider({
  before,
  after,
  beforeMetrics,
  afterMetrics,
  beforeLabel = "Before",
  afterLabel = "After",
  initialPosition = 50,
  className,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(initialPosition);
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const labelId = useId();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: ReactPointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPosition(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPosition(100);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={containerRef}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-bg-soft ring-1 ring-border select-none touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="absolute inset-0">{after}</div>

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
          aria-hidden
        >
          <div
            className="absolute inset-y-0 left-0"
            style={{ width: width || "100%" }}
          >
            {before}
          </div>
        </div>

        <div
          className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.25)]"
          style={{ left: `${position}%` }}
        >
          <button
            type="button"
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            aria-labelledby={labelId}
            aria-orientation="horizontal"
            className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-teal-dark shadow-md ring-1 ring-border transition hover:scale-105"
            onKeyDown={onKeyDown}
          >
            <span className="sr-only" id={labelId}>
              {beforeLabel} / {afterLabel}
            </span>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8 12H4M4 12l3-3M4 12l3 3M16 12h4M20 12l-3-3M20 12l-3 3" />
            </svg>
          </button>
        </div>

        <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {beforeLabel}
        </span>
        <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {afterLabel}
        </span>
      </div>

      {(beforeMetrics?.length || afterMetrics?.length) && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MetricList metrics={beforeMetrics} tone="red" />
          <MetricList metrics={afterMetrics} tone="teal" />
        </div>
      )}
    </div>
  );
}

function MetricList({
  metrics,
  tone,
}: {
  metrics?: Metric[];
  tone: "red" | "teal";
}) {
  if (!metrics?.length) return null;
  return (
    <ul className="space-y-2 rounded-xl bg-bg-soft p-4 ring-1 ring-border">
      {metrics.map((m) => (
        <li key={m.label} className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-text-muted">{m.label}</span>
          <span
            className={cn(
              "text-lg font-bold",
              tone === "red" ? "text-red" : "text-teal",
            )}
          >
            {m.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
