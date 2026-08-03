type ForceDistributionDiagramProps = {
  title: string;
  caption: string;
  className?: string;
};

export function ForceDistributionDiagram({
  title,
  caption,
  className,
}: ForceDistributionDiagramProps) {
  return (
    <div
      className={`flex w-full flex-col items-center rounded-3xl bg-bg-soft p-6 shadow-sm ring-1 ring-border md:p-10 ${className ?? ""}`}
    >
      <div className="mb-8 w-full rounded-xl bg-teal px-4 py-3 text-center shadow-sm">
        <h3 className="text-base font-bold tracking-wide text-white md:text-xl">
          {title}
        </h3>
      </div>

      <div className="relative w-full" style={{ aspectRatio: "2 / 1", minHeight: 240 }}>
        <svg
          viewBox="0 0 1000 500"
          className="absolute inset-0 h-full w-full drop-shadow-sm"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={title}
        >
          <defs>
            <marker
              id="force-arrow"
              markerWidth="12"
              markerHeight="9"
              refX="10"
              refY="4.5"
              orient="auto"
            >
              <polygon points="0 0, 12 4.5, 0 9" fill="#358a9a" />
            </marker>
          </defs>

          <rect x="150" y="50" width="700" height="400" fill="#cfdfe2" />
          <line x1="380" y1="150" x2="620" y2="350" stroke="#aababc" strokeWidth="2" />
          <line x1="620" y1="150" x2="380" y2="350" stroke="#aababc" strokeWidth="2" />
          <rect
            x="150"
            y="50"
            width="700"
            height="400"
            stroke="#444f52"
            strokeWidth="14"
            fill="none"
          />
          <line x1="500" y1="50" x2="500" y2="450" stroke="#444f52" strokeWidth="14" />
          <line x1="150" y1="250" x2="850" y2="250" stroke="#444f52" strokeWidth="14" />

          {/* Force arrows */}
          <line x1="500" y1="250" x2="500" y2="100" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />
          <line x1="500" y1="250" x2="500" y2="400" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />
          <line x1="500" y1="250" x2="800" y2="250" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />
          <line x1="500" y1="250" x2="200" y2="250" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />
          <line x1="500" y1="250" x2="720" y2="120" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />
          <line x1="500" y1="250" x2="280" y2="120" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />
          <line x1="500" y1="250" x2="720" y2="380" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />
          <line x1="500" y1="250" x2="280" y2="380" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />

          <circle cx="500" cy="250" r="10" fill="#2d3b3e" />
        </svg>
      </div>

      <p className="mt-6 max-w-3xl text-center text-sm font-semibold text-teal-dark md:text-base">
        {caption}
      </p>
    </div>
  );
}
