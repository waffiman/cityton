/** Lucide-style icons for the B2B partner page sections. */

const base = {
  width: 30,
  height: 30,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "var(--color-accent)",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function AudienceIcon({ name }: { name: string }) {
  if (name === "broker")
    return (
      <svg {...base}>
        <path d="M3 11L12 4l9 7" />
        <path d="M5 10.5V20h14v-9.5" />
        <path d="M10 20v-6h4v6" />
        <path d="M16 8.5V6h5v4h-5" />
      </svg>
    );
  if (name === "facility")
    return (
      <svg {...base}>
        <path d="M4 21V7l6-3 6 3v14" />
        <path d="M16 10h4v11h-4" />
        <path d="M8 10h.01M12 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
      </svg>
    );
  if (name === "glazier")
    return (
      <svg {...base}>
        <rect x="4" y="3" width="16" height="18" />
        <path d="M12 3v18M4 12h16" />
      </svg>
    );
  if (name === "architect")
    return (
      <svg {...base}>
        <circle cx="12" cy="12" r="9" />
        <path d="M14.5 9.5l-1.8 5.2-5.2 1.8 1.8-5.2z" />
      </svg>
    );
  if (name === "interior")
    return (
      <svg {...base}>
        <rect x="5" y="3" width="14" height="18" />
        <path d="M12 3v18M5 12h14" />
        <path d="M5 3c2.2 2.8 2.2 6.2 0 9M19 3c-2.2 2.8-2.2 6.2 0 9" />
      </svg>
    );
  if (name === "sunshade")
    return (
      <svg {...base}>
        <path d="M3 10l9-6 9 6" />
        <path d="M4 10h16v2H4z" />
        <path d="M6 12v8M18 12v8M12 12v8" />
      </svg>
    );
  return (
    <svg {...base}>
      <path d="M3 21V11h7v10" />
      <path d="M5 14h.01M8 14h.01M5 17h.01M8 17h.01" />
      <path d="M13 21V5M10 21h8" />
      <path d="M13 5h9M13 8h4" />
      <path d="M20 5v7" />
      <path d="M18.5 12h3v2.5h-3z" />
    </svg>
  );
}

export function SolutionIcon({ name }: { name: string }) {
  if (name === "sun")
    return (
      <svg {...base}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
      </svg>
    );
  if (name === "uv")
    return (
      <svg {...base}>
        <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  if (name === "privacy")
    return (
      <svg {...base}>
        <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M4 20L20 4" />
      </svg>
    );
  return (
    <svg {...base}>
      <rect x="4" y="4" width="16" height="16" />
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}

export function ServiceIcon({ name }: { name: string }) {
  if (name === "advice")
    return (
      <svg {...base}>
        <path d="M8 4h8a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2z" />
        <path d="M9 9h6M9 13h4" />
      </svg>
    );
  if (name === "film")
    return (
      <svg {...base}>
        <path d="M12 3l9 5-9 5-9-5z" />
        <path d="M3 13l9 5 9-5" />
        <path d="M3 17l9 5 9-5" />
      </svg>
    );
  if (name === "measure")
    return (
      <svg {...base}>
        <path d="M3 8h18v8H3z" />
        <path d="M7 8v3M11 8v5M15 8v3M19 8v5" />
      </svg>
    );
  if (name === "material")
    return (
      <svg {...base}>
        <ellipse cx="7" cy="12" rx="3" ry="7" />
        <path d="M7 5h8.5M7 19h8.5" />
        <ellipse cx="15.5" cy="12" rx="3" ry="7" />
        <ellipse cx="15.5" cy="12" rx="1.1" ry="2.4" />
      </svg>
    );
  if (name === "montage")
    return (
      <svg {...base}>
        <rect x="3" y="3.5" width="11" height="17" />
        <path d="M3 12h11M8.5 3.5v17" />
        <path d="M13 7.5h8" />
        <path d="M17 7.5v9.5" />
        <path d="M15 17h4" />
      </svg>
    );
  return (
    <svg {...base}>
      <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      width={18}
      height={18}
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}
