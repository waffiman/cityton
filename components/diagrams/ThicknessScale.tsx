import { cn } from "@/lib/utils";

export type ThicknessOption = {
  mil: number;
  microns: number;
  label?: string;
};

type ThicknessScaleProps = {
  title?: string;
  caption?: string;
  options?: ThicknessOption[];
  activeMil?: number;
  activeLabel?: string;
  className?: string;
};

const DEFAULT_OPTIONS: ThicknessOption[] = [
  { mil: 4, microns: 100 },
  { mil: 7, microns: 175 },
  { mil: 8, microns: 200 },
  { mil: 12, microns: 300 },
  { mil: 13, microns: 336 },
];

export function ThicknessScale({
  title,
  caption,
  options = DEFAULT_OPTIONS,
  activeMil,
  activeLabel = "Selected",
  className,
}: ThicknessScaleProps) {
  const maxMil = Math.max(...options.map((o) => o.mil));

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

      <div className="flex items-end justify-center gap-3 sm:gap-5">
        {options.map((opt) => {
          const isActive = activeMil === opt.mil;
          const heightPct = (opt.mil / maxMil) * 100;
          return (
            <div
              key={opt.mil}
              className={cn(
                "flex w-16 flex-col items-center sm:w-20",
                isActive && "scale-105",
              )}
            >
              <div className="relative mb-3 flex h-40 w-full items-end justify-center">
                <div
                  className={cn(
                    "w-10 rounded-t-md transition sm:w-12",
                    isActive
                      ? "bg-teal shadow-lg ring-2 ring-teal/40"
                      : "bg-teal-dark/70",
                  )}
                  style={{ height: `${heightPct}%` }}
                  aria-hidden
                />
              </div>
              <p
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  isActive ? "text-teal" : "text-ink",
                )}
              >
                {opt.mil} mil
              </p>
              <p className="text-xs text-text-muted tabular-nums">
                {opt.microns} µm
              </p>
              {isActive ? (
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-teal">
                  {activeLabel}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
