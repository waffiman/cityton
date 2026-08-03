type SeasonalDiagramsProps = {
  summerTitle: string;
  winterTitle: string;
  summerItems: string[];
  winterItems: string[];
  className?: string;
};

export function SeasonalDiagrams({
  summerTitle,
  winterTitle,
  summerItems,
  winterItems,
  className,
}: SeasonalDiagramsProps) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 ${className ?? ""}`}>
      <SeasonCard
        title={summerTitle}
        items={summerItems}
        accent="#dca042"
        icon="sun"
      />
      <SeasonCard
        title={winterTitle}
        items={winterItems}
        accent="#358a9a"
        icon="snow"
      />
    </div>
  );
}

function SeasonCard({
  title,
  items,
  accent,
  icon,
}: {
  title: string;
  items: string[];
  accent: string;
  icon: "sun" | "snow";
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border">
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: accent }}
          aria-hidden
        >
          {icon === "sun" ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1L19.1 4.9" />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-semibold text-teal-dark">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-text-muted">
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: accent }}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
