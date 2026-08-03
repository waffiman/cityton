import { cn } from "@/lib/utils";

export type ProcessStep = {
  title: string;
  description: string;
};

type ProcessTimelineProps = {
  steps: ProcessStep[];
  className?: string;
  /** Compact strip for Home. */
  compact?: boolean;
  eyebrow?: string;
  title?: string;
};

export function ProcessTimeline({
  steps,
  className,
  compact = false,
  eyebrow,
  title,
}: ProcessTimelineProps) {
  return (
    <div className={cn("w-full", className)}>
      {(eyebrow || title) && (
        <div className={cn("mb-8", compact && "mb-6 text-center")}>
          {eyebrow ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2
              className={cn(
                "font-semibold text-ink",
                compact ? "text-display-sm" : "text-display-sm",
              )}
            >
              {title}
            </h2>
          ) : null}
        </div>
      )}

      <ol
        className={cn(
          "relative grid gap-6",
          compact
            ? "sm:grid-cols-2 lg:grid-cols-5"
            : "md:grid-cols-5",
        )}
      >
        {/* Desktop connector line */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[10%] right-[10%] top-7 hidden h-px bg-border md:block"
        />

        {steps.map((step, i) => (
          <li
            key={step.title}
            className={cn(
              "relative flex flex-col",
              compact ? "items-start md:items-center md:text-center" : "items-start md:items-center md:text-center",
            )}
          >
            <div className="relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal text-lg font-semibold text-white shadow-md ring-4 ring-background">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3
              className={cn(
                "font-semibold text-ink",
                compact ? "text-sm" : "text-base",
              )}
            >
              {step.title}
            </h3>
            {!compact ? (
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {step.description}
              </p>
            ) : (
              <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
                {step.description}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
