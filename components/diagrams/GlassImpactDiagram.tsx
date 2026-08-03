type GlassImpactDiagramProps = {
  withoutTitle: string;
  withTitle: string;
  withoutCaption: string;
  withCaption: string;
  className?: string;
};

/**
 * Brochure-style without/with security film comparison
 * (from glass_impact_infographic.jsx).
 */
export function GlassImpactDiagram({
  withoutTitle,
  withTitle,
  withoutCaption,
  withCaption,
  className,
}: GlassImpactDiagramProps) {
  return (
    <div
      className={`mx-auto grid w-full max-w-[1100px] gap-6 md:grid-cols-2 ${className ?? ""}`}
    >
      {/* Without film */}
      <div className="rounded-3xl bg-[#eef4f5] p-5 md:p-6">
        <div className="mb-6 flex items-center justify-center rounded-xl bg-teal-dark px-4 py-4 text-center text-base font-bold text-white md:text-xl">
          {withoutTitle}
        </div>

        <div className="relative w-full" style={{ aspectRatio: "400 / 420", minHeight: 300 }}>
          <svg
            viewBox="0 0 400 420"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={withoutTitle}
          >
            <defs>
              <marker
                id="gi-arrow-red"
                markerWidth="10"
                markerHeight="8"
                refX="8"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 10 4, 0 8" fill="#e2472b" />
              </marker>
            </defs>

            <rect
              x="40"
              y="20"
              width="320"
              height="280"
              fill="#cddadd"
              stroke="#9fb3b8"
              strokeWidth="2"
            />

            <circle cx="200" cy="70" r="9" fill="#e2472b" />

            <polyline
              points="200,70 130,90 175,130 60,160"
              fill="none"
              stroke="#4a575b"
              strokeWidth="3"
            />
            <polyline
              points="200,70 300,90 260,130 340,155"
              fill="none"
              stroke="#4a575b"
              strokeWidth="3"
            />
            <polyline
              points="200,70 145,230 105,280"
              fill="none"
              stroke="#4a575b"
              strokeWidth="3"
            />
            <polyline
              points="200,70 200,300"
              fill="none"
              stroke="#4a575b"
              strokeWidth="3"
            />
            <polyline
              points="200,70 255,230 300,280"
              fill="none"
              stroke="#4a575b"
              strokeWidth="3"
            />

            <polygon points="90,300 130,300 110,335" fill="#9fb3b8" />
            <polygon points="180,300 220,300 200,335" fill="#9fb3b8" />
            <polygon points="270,300 310,300 290,335" fill="#9fb3b8" />

            <line
              x1="110"
              y1="335"
              x2="80"
              y2="380"
              stroke="#e2472b"
              strokeWidth="4"
              markerEnd="url(#gi-arrow-red)"
            />
            <line
              x1="200"
              y1="335"
              x2="200"
              y2="385"
              stroke="#e2472b"
              strokeWidth="4"
              markerEnd="url(#gi-arrow-red)"
            />
            <line
              x1="290"
              y1="335"
              x2="320"
              y2="380"
              stroke="#e2472b"
              strokeWidth="4"
              markerEnd="url(#gi-arrow-red)"
            />
          </svg>
        </div>

        <p className="mt-2 text-center text-base font-bold text-[#e2472b] md:text-lg">
          {withoutCaption}
        </p>
      </div>

      {/* With film */}
      <div className="rounded-3xl bg-[#eef4f5] p-5 md:p-6">
        <div className="mb-6 flex items-center justify-center rounded-xl bg-teal px-4 py-4 text-center text-base font-bold text-white md:text-xl">
          {withTitle}
        </div>

        <div className="relative w-full" style={{ aspectRatio: "400 / 420", minHeight: 300 }}>
          <svg
            viewBox="0 0 400 420"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={withTitle}
          >
            <defs>
              <marker
                id="gi-arrow-teal"
                markerWidth="10"
                markerHeight="8"
                refX="8"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 10 4, 0 8" fill="#1c7a8c" />
              </marker>
            </defs>

            <rect
              x="40"
              y="20"
              width="320"
              height="280"
              fill="#cddadd"
              stroke="#9fb3b8"
              strokeWidth="2"
            />

            <polyline
              points="200,70 130,90 175,130 60,160"
              fill="none"
              stroke="#c4ccce"
              strokeWidth="2"
            />
            <polyline
              points="200,70 300,90 260,130 340,155"
              fill="none"
              stroke="#c4ccce"
              strokeWidth="2"
            />

            <circle cx="200" cy="70" r="9" fill="#1a2b30" />

            <line
              x1="200"
              y1="70"
              x2="70"
              y2="45"
              stroke="#1c7a8c"
              strokeWidth="5"
              markerEnd="url(#gi-arrow-teal)"
            />
            <line
              x1="200"
              y1="70"
              x2="330"
              y2="45"
              stroke="#1c7a8c"
              strokeWidth="5"
              markerEnd="url(#gi-arrow-teal)"
            />
            <line
              x1="200"
              y1="70"
              x2="70"
              y2="180"
              stroke="#1c7a8c"
              strokeWidth="5"
              markerEnd="url(#gi-arrow-teal)"
            />
            <line
              x1="200"
              y1="70"
              x2="330"
              y2="180"
              stroke="#1c7a8c"
              strokeWidth="5"
              markerEnd="url(#gi-arrow-teal)"
            />
            <line
              x1="200"
              y1="70"
              x2="120"
              y2="290"
              stroke="#1c7a8c"
              strokeWidth="5"
              markerEnd="url(#gi-arrow-teal)"
            />
            <line
              x1="200"
              y1="70"
              x2="200"
              y2="290"
              stroke="#1c7a8c"
              strokeWidth="5"
              markerEnd="url(#gi-arrow-teal)"
            />
            <line
              x1="200"
              y1="70"
              x2="280"
              y2="290"
              stroke="#1c7a8c"
              strokeWidth="5"
              markerEnd="url(#gi-arrow-teal)"
            />

            <rect x="40" y="296" width="320" height="8" fill="#1c7a8c" />
          </svg>
        </div>

        <p className="mt-2 text-center text-base font-bold text-teal-dark md:text-lg">
          {withCaption}
        </p>
      </div>
    </div>
  );
}
