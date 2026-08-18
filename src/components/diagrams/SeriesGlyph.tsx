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
        {/* glass pane */}
        <rect x="96" y="8" width="9" height="94" fill="var(--color-accent-500)" opacity=".2" />
        <line x1="96" y1="8" x2="96" y2="102" stroke={ink} strokeWidth="1" />
        <line x1="105" y1="8" x2="105" y2="102" stroke={ink} strokeWidth="1" />

        {/* incoming solar radiation */}
        <g stroke="var(--color-signal)" {...line} strokeWidth={1.6}>
          <path d="M20 20 L93 56.5" />
          <path d="M20 32 L93 68.5" />
        </g>
        <g fill="var(--color-signal)">
          <path d="M94 57 L86.9 56.6 L89.4 51.6 Z" />
          <path d="M94 69 L86.9 68.6 L89.4 63.6 Z" />
        </g>

        {/* reflected off the metallised layer — the bulk of the energy */}
        <g stroke="var(--color-signal)" {...line} strokeWidth={1.6}>
          <path d="M96 58 L37 87.5" />
          <path d="M96 70 L45 95.5" />
        </g>
        <g fill="var(--color-signal)">
          <path d="M36 88 L40.6 82.6 L43.1 87.6 Z" />
          <path d="M44 96 L48.6 90.6 L51.1 95.6 Z" />
        </g>

        {/* small remainder transmitted through the pane */}
        <g stroke="var(--color-accent-400)" {...line} strokeWidth={1.1} opacity=".85">
          <path d="M96 58 L105 62.5" />
          <path d="M105 62.5 L167 93.5" />
        </g>
        <g fill="var(--color-accent-400)" opacity=".85">
          <path d="M168 94 L160.9 93.6 L163.4 88.6 Z" />
        </g>

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

        {/* incoming solar radiation */}
        <g stroke="var(--color-signal)" {...line} strokeWidth={1.6}>
          <path d="M18 26 L94 44" />
          <path d="M18 62 L94 78" />
        </g>
        <g fill="var(--color-signal)">
          <path d="M94 44 L87.03 45.23 L88.32 39.78 Z" />
          <path d="M94 78 L87.06 79.4 L88.22 73.92 Z" />
        </g>

        {/* what leaves the pane — damped by the ceramic particles */}
        <g stroke="var(--color-accent-400)" {...line} strokeWidth={1.1} opacity=".85">
          <path d="M107 44 L182 52" />
          <path d="M107 78 L182 84" />
        </g>
        <g fill="var(--color-accent-400)" opacity=".85">
          <path d="M182 52 L175.24 54.09 L175.83 48.53 Z" />
          <path d="M182 84 L175.3 86.27 L175.74 80.69 Z" />
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

        {/* impact */}
        <circle cx="80" cy="55" r="9" fill="var(--color-signal)" />
        <line x1="22" y1="55" x2="68" y2="55" stroke="var(--color-signal)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M68 55 L61.5 57.8 L61.5 52.2 Z" fill="var(--color-signal)" />

        {/* force spread across the laminate */}
        <g stroke="var(--color-accent-400)" fill="none" strokeWidth="1.2" strokeLinecap="round">
          <path d="M107 55 L146 20" />
          <path d="M107 55 L152 38" />
          <path d="M107 55 L156 55" />
          <path d="M107 55 L152 72" />
          <path d="M107 55 L146 90" />
          <path d="M107 55 L124 14" />
          <path d="M107 55 L124 96" />
        </g>
        <g fill="var(--color-accent-400)">
          <path d="M146 20 L143.45 25.38 L140.37 21.96 Z" />
          <path d="M152 38 L147.67 42.1 L146.04 37.79 Z" />
          <path d="M156 55 L150.5 57.3 L150.5 52.7 Z" />
          <path d="M152 72 L146.04 72.21 L147.67 67.9 Z" />
          <path d="M146 90 L140.37 88.04 L143.45 84.62 Z" />
          <path d="M124 14 L124.02 19.96 L119.77 18.2 Z" />
          <path d="M124 96 L119.77 91.8 L124.02 90.04 Z" />
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

      {/* visible light passes straight through */}
      <g stroke="var(--color-accent-400)" {...line}>
        <path d="M18 30 L182 42" />
        <path d="M18 74 L182 84" />
      </g>
      <g fill="var(--color-accent-400)">
        <path d="M182 42 L175.31 44.32 L175.72 38.73 Z" />
        <path d="M182 84 L175.34 86.4 L175.68 80.81 Z" />
      </g>

      {/* UV stopped at the film and turned back */}
      <g stroke="var(--color-signal)" {...line} strokeWidth={1.6}>
        <path d="M18 52 L88 55.78" />
      </g>
      <g stroke="var(--color-signal)" {...line} strokeWidth={1.6} opacity=".8">
        <path d="M90 56 L21 65.86" />
      </g>
      <g fill="var(--color-signal)">
        <path d="M88 55.78 L81.36 58.23 L81.66 52.63 Z" />
        <path d="M20 66 L26.04 62.31 L26.83 67.85 Z" opacity=".8" />
      </g>
      <circle cx="94" cy="56" r="4" fill="none" stroke="var(--color-signal)" strokeWidth="1.4" />

      <text x="18" y="14" fontSize="9" letterSpacing="1" fill={label}>UV GESPERRT</text>
      <text x="118" y="102" fontSize="9" letterSpacing="1" fill={label}>LICHT PASSIERT</text>
    </svg>
  );
}
