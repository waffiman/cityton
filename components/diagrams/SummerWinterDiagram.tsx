type SummerWinterDiagramProps = {
  summerTitle: string;
  winterTitle: string;
  summer: {
    reflected: string;
    absorption: string;
    transmission: string;
    uv: string;
    glare: string;
  };
  winter: {
    co2: string;
    cold: string;
    heatLoss: string;
    savings: string;
    heating: string;
  };
  className?: string;
};

/**
 * Brochure-style summer / winter SVG diagrams (from summer_winter_infographic.jsx).
 * Labels are passed in so DE/EN can both work without hardcoding.
 */
export function SummerWinterDiagram({
  summerTitle,
  winterTitle,
  summer,
  winter,
  className,
}: SummerWinterDiagramProps) {
  return (
    <div
      className={`mx-auto grid w-full max-w-[1100px] gap-6 md:grid-cols-2 ${className ?? ""}`}
    >
      {/* Summer */}
      <div className="rounded-3xl bg-[#eef4f5] p-5 md:p-6">
        <div className="mb-6 flex items-center justify-center rounded-xl bg-teal-dark px-6 py-4 text-lg font-bold text-white md:text-xl">
          <span aria-hidden className="mr-2">
            ☀
          </span>
          {summerTitle}
        </div>

        <div className="relative w-full" style={{ aspectRatio: "400 / 380", minHeight: 280 }}>
          <svg
            viewBox="0 0 400 380"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={summerTitle}
          >
            <defs>
              <marker
                id="sw-arrow-amber"
                markerWidth="10"
                markerHeight="8"
                refX="8"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 10 4, 0 8" fill="#dca042" />
              </marker>
              <marker
                id="sw-arrow-dark"
                markerWidth="10"
                markerHeight="8"
                refX="8"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 10 4, 0 8" fill="#1e4a54" />
              </marker>
            </defs>

            <rect x="185" y="40" width="30" height="300" fill="#b7c6cc" />
            <line
              x1="200"
              y1="40"
              x2="200"
              y2="340"
              stroke="#c0392b"
              strokeWidth="3"
            />

            <path
              d="M 195 55 C 140 60, 90 75, 50 95"
              fill="none"
              stroke="#dca042"
              strokeWidth="4"
              markerEnd="url(#sw-arrow-amber)"
            />
            {splitLabel(summer.reflected, 45, 60, 78)}

            <line
              x1="330"
              y1="70"
              x2="215"
              y2="120"
              stroke="#1e4a54"
              strokeWidth="4"
              markerEnd="url(#sw-arrow-dark)"
            />
            {splitLabel(summer.absorption, 280, 55, 73)}

            <line
              x1="205"
              y1="250"
              x2="330"
              y2="300"
              stroke="#dca042"
              strokeWidth="4"
              markerEnd="url(#sw-arrow-amber)"
            />
            {splitLabel(summer.transmission, 270, 325, 343)}

            <text x="30" y="290" fill="#1e4a54" fontWeight="700" fontSize="14">
              {summer.uv}
            </text>
          </svg>
        </div>

        <p className="mt-2 text-center text-base font-bold text-teal-dark md:text-lg">
          {summer.glare}
        </p>
      </div>

      {/* Winter */}
      <div className="rounded-3xl bg-[#eef4f5] p-5 md:p-6">
        <div className="mb-6 flex items-center justify-center rounded-xl bg-teal px-6 py-4 text-lg font-bold text-white md:text-xl">
          <span aria-hidden className="mr-2">
            ❄
          </span>
          {winterTitle}
        </div>

        <div className="relative w-full" style={{ aspectRatio: "400 / 380", minHeight: 280 }}>
          <svg
            viewBox="0 0 400 380"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={winterTitle}
          >
            <defs>
              <marker
                id="sw-arrow-teal"
                markerWidth="10"
                markerHeight="8"
                refX="8"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 10 4, 0 8" fill="#358a9a" />
              </marker>
            </defs>

            <rect x="175" y="40" width="18" height="300" fill="#b7c6cc" />
            <rect x="205" y="40" width="18" height="300" fill="#b7c6cc" />

            <text
              x="200"
              y="25"
              textAnchor="middle"
              fill="#1e4a54"
              fontWeight="700"
              fontSize="13"
            >
              {winter.co2}
            </text>

            <line
              x1="30"
              y1="190"
              x2="170"
              y2="190"
              stroke="#358a9a"
              strokeWidth="4"
              markerEnd="url(#sw-arrow-teal)"
            />
            {splitLabel(winter.cold, 30, 165, 183)}

            <line
              x1="228"
              y1="190"
              x2="368"
              y2="190"
              stroke="#358a9a"
              strokeWidth="4"
              markerEnd="url(#sw-arrow-teal)"
            />
            {splitLabel(winter.heatLoss, 245, 165, 183)}

            {splitLabel(winter.savings, 245, 330, 348)}
          </svg>
        </div>

        <p className="mt-2 text-center text-base font-bold text-teal-dark md:text-lg">
          {winter.heating}
        </p>
      </div>
    </div>
  );
}

/** Split multi-word labels onto two SVG text lines when needed. */
function splitLabel(label: string, x: number, y1: number, y2: number) {
  const parts = label.split(/\s+/);
  if (parts.length <= 1) {
    return (
      <text x={x} y={y1} fill="#1e4a54" fontWeight="700" fontSize="14">
        {label}
      </text>
    );
  }
  // Prefer a natural break after first word for hyphenated DE labels like "Wärme-absorption"
  const mid = Math.ceil(parts.length / 2);
  const line1 = parts.slice(0, mid).join(" ");
  const line2 = parts.slice(mid).join(" ");
  return (
    <>
      <text x={x} y={y1} fill="#1e4a54" fontWeight="700" fontSize="14">
        {line1}
      </text>
      <text x={x} y={y2} fill="#1e4a54" fontWeight="700" fontSize="14">
        {line2}
      </text>
    </>
  );
}
