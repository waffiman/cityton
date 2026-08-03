type SeriesPoint = {
  name: string;
  tser: number;
  vlt: number;
  uv: number;
  color: string;
};

type PortfolioRadarProps = {
  series: SeriesPoint[];
  labels: { tser: string; vlt: string; uv: string };
  className?: string;
};

/** Hand-authored SVG radar chart — no chart library. */
export function PortfolioRadar({ series, labels, className }: PortfolioRadarProps) {
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 130;
  const axes = [
    { key: "tser" as const, label: labels.tser, angle: -90 },
    { key: "vlt" as const, label: labels.vlt, angle: 30 },
    { key: "uv" as const, label: labels.uv, angle: 150 },
  ];

  function polar(angleDeg: number, r: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function polygonPoints(s: SeriesPoint) {
    return axes
      .map((a) => {
        const value = s[a.key];
        const p = polar(a.angle, (value / 100) * radius);
        return `${p.x},${p.y}`;
      })
      .join(" ");
  }

  return (
    <div className={`w-full ${className ?? ""}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto h-auto w-full max-w-md"
        role="img"
        aria-label="Portfolio radar comparison"
      >
        {/* Grid rings */}
        {[25, 50, 75, 100].map((pct) => (
          <polygon
            key={pct}
            points={axes
              .map((a) => {
                const p = polar(a.angle, (pct / 100) * radius);
                return `${p.x},${p.y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#dce4e6"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        {axes.map((a) => {
          const p = polar(a.angle, radius);
          const labelPos = polar(a.angle, radius + 28);
          return (
            <g key={a.key}>
              <line
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke="#dce4e6"
                strokeWidth="1"
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-teal-dark"
                fontSize="12"
                fontWeight="600"
              >
                {a.label}
              </text>
            </g>
          );
        })}

        {/* Series polygons */}
        {series.map((s) => (
          <polygon
            key={s.name}
            points={polygonPoints(s)}
            fill={s.color}
            fillOpacity="0.25"
            stroke={s.color}
            strokeWidth="2"
          />
        ))}
      </svg>

      <ul className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
        {series.map((s) => (
          <li key={s.name} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: s.color }}
              aria-hidden
            />
            <span className="text-teal-dark">{s.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
