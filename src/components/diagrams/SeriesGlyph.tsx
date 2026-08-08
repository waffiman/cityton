import type { Series } from "@/content/series";

/**
 * Small technical glyph on each series overview card. Two colour worlds:
 * `dark` sits on the --color-accent-900 field, `paper` on the light ground.
 */
export default function SeriesGlyph({ variant, field }: { variant: Series["glyph"]; field: "dark" | "paper" }) {
  const ink = field === "dark" ? "var(--color-accent-300)" : "var(--color-accent-700)";
  const label = field === "dark" ? "var(--color-accent-300)" : "var(--color-accent-700)";
  const line = { fill: "none", strokeWidth: 1.4, strokeLinecap: "round" } as const;

  if (variant === "reflexion") {
    return (
      <svg viewBox="0 0 200 110" aria-hidden="true">
        <rect x="96" y="8" width="9" height="94" fill="var(--color-accent-500)" opacity=".2" />
        <line x1="96" y1="8" x2="96" y2="102" stroke={ink} strokeWidth="1" />
        <line x1="105" y1="8" x2="105" y2="102" stroke={ink} strokeWidth="1" />
        <g stroke="var(--color-signal)" {...line}>
          <path d="M18 20 L94 48" />
          <path d="M18 48 L94 76" />
        </g>
        <g stroke="var(--color-signal)" opacity=".8" {...line}>
          <path d="M94 48 L20 74" />
          <path d="M94 76 L20 100" />
        </g>
        <line x1="107" y1="62" x2="176" y2="70" stroke="var(--color-accent-400)" strokeWidth="1.4" strokeLinecap="round" />
        <text x="18" y="14" fontSize="9" letterSpacing="1" fill={label}>REFLEXION</text>
      </svg>
    );
  }

  if (variant === "absorption") {
    return (
      <svg viewBox="0 0 200 110" aria-hidden="true">
        <rect x="96" y="8" width="9" height="94" fill="var(--color-accent-500)" opacity=".14" />
        <line x1="96" y1="8" x2="96" y2="102" stroke={ink} strokeWidth="1" />
        <line x1="105" y1="8" x2="105" y2="102" stroke={ink} strokeWidth="1" />
        <g fill="var(--color-accent-600)">
          {[16, 30, 44, 58, 72, 86, 99].map((cy) => (
            <circle key={cy} cx="100" cy={cy} r="1.8" />
          ))}
        </g>
        <g stroke="var(--color-signal)" {...line}>
          <path d="M18 26 L94 44" />
          <path d="M18 62 L94 78" />
        </g>
        <g stroke="var(--color-accent-400)" {...line}>
          <path d="M107 44 L182 52" />
          <path d="M107 78 L182 84" />
        </g>
        <text x="18" y="14" fontSize="9" letterSpacing="1" fill={label}>ABSORPTION</text>
      </svg>
    );
  }

  if (variant === "kraft") {
    return (
      <svg viewBox="0 0 200 110" aria-hidden="true">
        <rect x="96" y="8" width="11" height="94" fill="var(--color-accent-500)" opacity=".2" />
        <line x1="96" y1="8" x2="96" y2="102" stroke={ink} strokeWidth="1" />
        <line x1="107" y1="8" x2="107" y2="102" stroke={ink} strokeWidth="1.6" />
        <circle cx="80" cy="55" r="9" fill="var(--color-signal)" />
        <line x1="22" y1="55" x2="68" y2="55" stroke="var(--color-signal)" strokeWidth="1.6" />
        <g stroke="var(--color-accent-400)" fill="none" strokeWidth="1.2" strokeLinecap="round">
          <path d="M107 55 L146 20" />
          <path d="M107 55 L152 38" />
          <path d="M107 55 L156 55" />
          <path d="M107 55 L152 72" />
          <path d="M107 55 L146 90" />
          <path d="M107 55 L124 14" />
          <path d="M107 55 L124 96" />
        </g>
        <text x="20" y="14" fontSize="9" letterSpacing="1" fill={label}>KRAFTVERTEILUNG</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 110" aria-hidden="true">
      <rect x="96" y="8" width="7" height="94" fill="var(--color-accent-500)" opacity=".12" />
      <line x1="96" y1="8" x2="96" y2="102" stroke={ink} strokeWidth="1" />
      <line x1="103" y1="8" x2="103" y2="102" stroke={ink} strokeWidth="1" />
      <g stroke="var(--color-accent-400)" {...line}>
        <path d="M18 30 L182 42" />
        <path d="M18 74 L182 84" />
      </g>
      <g stroke="var(--color-signal)" {...line}>
        <path d="M18 52 L92 56" />
        <path d="M92 56 L20 66" opacity=".8" />
      </g>
      <circle cx="94" cy="56" r="4" fill="none" stroke="var(--color-signal)" strokeWidth="1.4" />
      <text x="18" y="14" fontSize="9" letterSpacing="1" fill={label}>UV GESPERRT</text>
      <text x="118" y="102" fontSize="9" letterSpacing="1" fill={label}>LICHT PASSIERT</text>
    </svg>
  );
}
