type SolarTransmissionDiagramProps = {
  title: string;
  transmission: number;
  reflection: number;
  absorption: number;
  solarLabel?: string;
  transmissionLabel?: string;
  reflectionLabel?: string;
  absorptionLabel?: string;
  className?: string;
};

/**
 * Data-driven solar ray diagram (brochure page 3).
 * Renders both "without film" and "with film" states via props.
 */
export function SolarTransmissionDiagram({
  title,
  transmission,
  reflection,
  absorption,
  solarLabel = "Sonnenenergie",
  transmissionLabel = "Transmission",
  reflectionLabel = "Reflektion",
  absorptionLabel = "Absorption",
  className,
}: SolarTransmissionDiagramProps) {
  // Scale transmitted ray count by transmission percentage
  const rayCount = Math.max(1, Math.round((transmission / 100) * 4));
  const reflectedStrong = reflection >= 40;

  return (
    <div
      className={`flex h-full w-full flex-col bg-bg-soft p-4 md:p-6 ${className ?? ""}`}
    >
      <div className="mb-3 rounded-xl bg-teal-dark px-4 py-3 text-center">
        <h3 className="text-sm font-bold tracking-wide text-white md:text-base">
          {title}
        </h3>
      </div>

      <div className="relative min-h-0 flex-1" style={{ minHeight: 220 }}>
        <svg
          viewBox="0 0 1000 500"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={title}
        >
          <defs>
            <marker
              id={`arrow-${transmission}-${reflection}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#dca042" />
            </marker>
          </defs>

          {/* Glass pane — thicker when film present (high absorption) */}
          <rect
            x={absorption > 50 ? 485 : 490}
            y="50"
            width={absorption > 50 ? 30 : 20}
            height="400"
            fill={absorption > 50 ? "#8aa8b0" : "#bac7cd"}
          />
          {absorption > 50 ? (
            <rect x="505" y="50" width="6" height="400" fill="#358a9a" opacity="0.7" />
          ) : null}

          {/* Incoming rays */}
          {[120, 190, 260, 330].map((y, i) => (
            <line
              key={`in-${i}`}
              x1="120"
              y1={y}
              x2="490"
              y2={y + 40}
              stroke="#dca042"
              strokeWidth="4"
            />
          ))}

          {/* Transmitted rays */}
          {Array.from({ length: rayCount }).map((_, i) => {
            const y = 160 + i * 70;
            return (
              <line
                key={`out-${i}`}
                x1="520"
                y1={y}
                x2="880"
                y2={y + 40}
                stroke="#dca042"
                strokeWidth={reflectedStrong ? 3 : 4}
                opacity={reflectedStrong ? 0.55 : 1}
                markerEnd={`url(#arrow-${transmission}-${reflection})`}
              />
            );
          })}

          {/* Reflected ray(s) */}
          <line
            x1="490"
            y1="400"
            x2={reflectedStrong ? 160 : 220}
            y2={reflectedStrong ? 280 : 490}
            stroke="#dca042"
            strokeWidth={reflectedStrong ? 5 : 4}
            markerEnd={`url(#arrow-${transmission}-${reflection})`}
          />
          {reflectedStrong ? (
            <line
              x1="490"
              y1="320"
              x2="180"
              y2="200"
              stroke="#dca042"
              strokeWidth="4"
              markerEnd={`url(#arrow-${transmission}-${reflection})`}
            />
          ) : null}
        </svg>

        {/* Metric overlays */}
        <div className="pointer-events-none absolute top-[6%] left-[6%] min-w-[7rem] rounded-lg bg-white px-4 py-2 text-center shadow-md ring-1 ring-border">
          <div className="text-xl font-bold text-teal-dark">100 %</div>
          <div className="text-xs text-text-muted">{solarLabel}</div>
        </div>
        <div className="pointer-events-none absolute top-[14%] right-[6%] min-w-[7rem] rounded-lg bg-white px-4 py-2 text-center shadow-md ring-1 ring-border">
          <div className="text-xl font-bold text-teal-dark">{transmission} %</div>
          <div className="text-xs text-text-muted">{transmissionLabel}</div>
        </div>
        <div className="pointer-events-none absolute bottom-[12%] left-[8%] min-w-[6rem] rounded-lg bg-white px-4 py-2 text-center shadow-md ring-1 ring-border">
          <div className="text-xl font-bold text-teal-dark">{reflection} %</div>
          <div className="text-xs text-text-muted">{reflectionLabel}</div>
        </div>
        <div className="pointer-events-none absolute bottom-[2%] left-1/2 min-w-[6.5rem] -translate-x-1/2 rounded-lg bg-white px-4 py-2 text-center shadow-md ring-1 ring-border">
          <div className="text-xl font-bold text-teal-dark">{absorption} %</div>
          <div className="text-xs text-text-muted">{absorptionLabel}</div>
        </div>
      </div>
    </div>
  );
}
