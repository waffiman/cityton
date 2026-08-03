"use client";

import { cn } from "@/lib/utils";

export type VltStop = {
  value: number;
  label?: string;
};

type VltScaleProps = {
  title?: string;
  caption?: string;
  stops?: VltStop[];
  /** Highlight this VLT value (or nearest). */
  active?: number;
  className?: string;
  activeLabel?: string;
  onSelect?: (value: number) => void;
};

const DEFAULT_STOPS: VltStop[] = [
  { value: 5 },
  { value: 15 },
  { value: 20 },
  { value: 35 },
  { value: 50 },
  { value: 70 },
  { value: 89 },
  { value: 95 },
];

function tintFor(vlt: number) {
  // Higher VLT = more transparent / lighter
  const darkness = Math.max(0, Math.min(1, 1 - vlt / 100));
  const g = Math.round(255 - darkness * 180);
  return `rgb(${g}, ${Math.round(g * 1.02)}, ${Math.round(g * 1.05)})`;
}

export function VltScale({
  title,
  caption,
  stops = DEFAULT_STOPS,
  active,
  className,
  activeLabel = "Selected",
  onSelect,
}: VltScaleProps) {
  const nearest =
    active != null
      ? stops.reduce((best, s) =>
          Math.abs(s.value - active) < Math.abs(best.value - active) ? s : best,
        )
      : null;

  return (
    <div className={cn("w-full", className)}>
      {title ? (
        <h3 className="mb-1 text-center text-lg font-semibold text-ink">
          {title}
        </h3>
      ) : null}
      {caption ? (
        <p className="mb-6 text-center text-sm text-text-muted">{caption}</p>
      ) : null}

      <div className="flex flex-wrap items-end justify-center gap-2 sm:gap-3">
        {stops.map((stop) => {
          const isActive = nearest?.value === stop.value;
          return (
            <button
              key={stop.value}
              type="button"
              onClick={() => onSelect?.(stop.value)}
              className={cn(
                "group flex w-[4.25rem] flex-col items-center rounded-xl p-2 transition",
                isActive
                  ? "bg-teal/10 ring-2 ring-teal"
                  : "hover:bg-bg-soft ring-1 ring-transparent hover:ring-border",
                !onSelect && "cursor-default",
              )}
              aria-pressed={isActive}
              aria-label={`VLT ${stop.value}%`}
            >
              <div
                className="relative mb-2 h-16 w-10 overflow-hidden rounded-md shadow-inner ring-1 ring-black/10"
                style={{ backgroundColor: tintFor(stop.value) }}
              >
                {/* Simulated outdoor brightness behind tint */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background:
                      "linear-gradient(135deg, #f0e8d8 0%, #88b0c0 50%, #d8e8f0 100%)",
                    mixBlendMode: "multiply",
                  }}
                />
              </div>
              <span
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  isActive ? "text-teal" : "text-ink",
                )}
              >
                {stop.value}%
              </span>
              {isActive ? (
                <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-teal">
                  {activeLabel}
                </span>
              ) : (
                <span className="mt-0.5 text-[10px] text-transparent">·</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
