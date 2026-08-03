import { cn } from "@/lib/utils";

export type FilmLayer = {
  name: string;
  description: string;
  /** Relative visual thickness weight */
  weight?: number;
};

type FilmLayersProps = {
  title?: string;
  caption?: string;
  layers: FilmLayer[];
  className?: string;
  /** Accent variant for different product series */
  accent?: "teal" | "amber" | "ink" | "silver";
};

const ACCENTS = {
  teal: ["#0a1f24", "#1e4a54", "#358a9a", "#7eb8c4", "#c5e0e6"],
  amber: ["#3d2a0a", "#8a6420", "#d4a04a", "#e8c888", "#f5e6c8"],
  ink: ["#0c1a1e", "#2a3a40", "#5a6a70", "#9aa6aa", "#d4dadc"],
  silver: ["#1a1a1a", "#3a3a3a", "#6a6a6a", "#a0a0a0", "#d8d8d8"],
} as const;

export function FilmLayers({
  title,
  caption,
  layers,
  className,
  accent = "teal",
}: FilmLayersProps) {
  const colors = ACCENTS[accent];
  const totalWeight = layers.reduce((s, l) => s + (l.weight ?? 1), 0);
  let y = 24;
  const rowH = 220;
  const layerRects = layers.map((layer, i) => {
    const h = ((layer.weight ?? 1) / totalWeight) * rowH;
    const rect = {
      y,
      h,
      color: colors[i % colors.length],
      layer,
      i,
    };
    y += h;
    return rect;
  });

  return (
    <div className={cn("w-full", className)}>
      {title ? (
        <h3 className="mb-2 text-center text-lg font-semibold text-ink">
          {title}
        </h3>
      ) : null}
      {caption ? (
        <p className="mb-6 text-center text-sm text-text-muted">{caption}</p>
      ) : null}

      <div className="grid items-center gap-8 lg:grid-cols-[220px_1fr]">
        <svg
          viewBox="0 0 160 280"
          className="mx-auto w-full max-w-[200px]"
          role="img"
          aria-label={title ?? "Film layer cross-section"}
        >
          {/* Glass substrate */}
          <rect
            x="30"
            y="8"
            width="100"
            height="16"
            rx="2"
            fill="#c8d4d8"
            stroke="#8aa0a8"
            strokeWidth="1"
          />
          <text
            x="80"
            y="19"
            textAnchor="middle"
            fontSize="7"
            fill="#3a4a50"
            fontFamily="system-ui,sans-serif"
          >
            Glass
          </text>

          {layerRects.map((r) => (
            <g key={r.i}>
              <rect
                x="30"
                y={r.y}
                width="100"
                height={r.h}
                fill={r.color}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.5"
              />
              {/* Callout line */}
              <line
                x1="130"
                y1={r.y + r.h / 2}
                x2="148"
                y2={r.y + r.h / 2}
                stroke={r.color}
                strokeWidth="1.5"
              />
            </g>
          ))}

          {/* Liner / release */}
          <rect
            x="30"
            y={y + 4}
            width="100"
            height="10"
            rx="1"
            fill="#e8e4dc"
            stroke="#c8c0b4"
            strokeWidth="1"
          />
        </svg>

        <ol className="space-y-3">
          {layers.map((layer, i) => (
            <li
              key={layer.name}
              className="flex gap-3 rounded-xl bg-white p-3 ring-1 ring-border"
            >
              <span
                className="mt-0.5 h-4 w-4 shrink-0 rounded-sm"
                style={{ backgroundColor: colors[i % colors.length] }}
                aria-hidden
              />
              <div>
                <p className="text-sm font-semibold text-ink">{layer.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-text-muted">
                  {layer.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
