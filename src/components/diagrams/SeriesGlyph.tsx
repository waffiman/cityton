import type { Series } from "@/content/series";

/**
 * Small technical glyph on each series overview card. Two colour worlds:
 * `dark` sits on the --color-accent-900 field, `paper` on the light ground.
 * Wordless by design — the card's copy carries the naming.
 */
export default function SeriesGlyph({ variant, field }: { variant: Series["glyph"]; field: "dark" | "paper" }) {
  const ink = field === "dark" ? "var(--color-accent-300)" : "var(--color-accent-700)";
  const line = { fill: "none", strokeWidth: 1.4, strokeLinecap: "round" } as const;

  if (variant === "reflexion") {
    return (
      <svg viewBox="0 0 200 110" aria-hidden="true">
        {/* glass pane */}
        <rect x="96" y="8" width="9" height="94" fill="var(--color-accent-500)" opacity=".2" />
        <line x1="96" y1="8" x2="96" y2="102" stroke={ink} strokeWidth="1" />
        <line x1="105" y1="8" x2="105" y2="102" stroke={ink} strokeWidth="1" />

        {/* incoming solar radiation */}
        <g stroke="var(--color-signal)" {...line} strokeWidth={1.7}>
          <path d="M14 14 L93 53.5" />
          <path d="M14 30 L93 69.5" />
        </g>
        <g fill="var(--color-signal)">
          <path d="M94 54 L87.03 55.23 L88.32 49.78 Z" />
          <path d="M94 70 L87.06 71.4 L88.22 65.92 Z" />
        </g>

        {/* reflected off the metallised layer — the bulk of the energy */}
        <g stroke="var(--color-signal)" {...line} strokeWidth={1.7}>
          <path d="M96 55 L31 87.5" />
          <path d="M96 71 L43 97.5" />
        </g>
        <g fill="var(--color-signal)">
          <path d="M30 88 L34.6 82.6 L37.1 87.6 Z" />
          <path d="M42 98 L46.6 92.6 L49.1 97.6 Z" />
        </g>

        {/* small remainder transmitted through the pane */}
        <g stroke="var(--color-accent-400)" {...line} strokeWidth={1.1} opacity=".85">
          <path d="M96 55 L105 59.5" />
          <path d="M105 59.5 L167 90.5" />
        </g>
        <g fill="var(--color-accent-400)" opacity=".85">
          <path d="M168 91 L160.9 90.6 L163.4 85.6 Z" />
        </g>
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
          {[14, 28, 42, 55, 68, 82, 96].map((cy) => (
            <circle key={cy} cx="100" cy={cy} r="1.8" />
          ))}
        </g>

        {/* incoming solar radiation */}
        <g stroke="var(--color-signal)" {...line} strokeWidth={1.7}>
          <path d="M14 18 L93 37.7" />
          <path d="M14 60 L93 77.6" />
        </g>
        <g fill="var(--color-signal)">
          <path d="M94 38 L87.03 39.23 L88.32 33.78 Z" />
          <path d="M94 78 L87.06 79.4 L88.22 73.92 Z" />
        </g>

        {/* what leaves the pane — damped by the ceramic particles */}
        <g stroke="var(--color-accent-400)" {...line} strokeWidth={1.1} opacity=".8">
          <path d="M107 38 L182 46" />
          <path d="M107 78 L182 84" />
        </g>
        <g fill="var(--color-accent-400)" opacity=".8">
          <path d="M183 46 L176.24 48.09 L176.83 42.53 Z" />
          <path d="M183 84 L176.3 86.27 L176.74 80.69 Z" />
        </g>
      </svg>
    );
  }

  if (variant === "kraft") {
    // Laminated glass seen face-on: it cracks, but the film holds every
    // fragment in the frame — nothing falls out.
    return (
      <svg viewBox="0 0 200 110" aria-hidden="true">
        <rect x="26" y="10" width="148" height="90" fill="var(--color-accent-500)" opacity=".14" />

        {/* radial cracks — irregular, and many die out before the edge */}
        <g stroke="var(--color-accent-400)" fill="none" strokeWidth="0.9" strokeLinejoin="round" strokeLinecap="round" opacity=".95">
          <path d="M100 55 L113.9 56 L123.6 61.1 L132.1 62" />
          <path d="M100 55 L112.5 69.3 L124 78.4 L131.7 87.3" />
          <path d="M100 55 L105.3 71.7 L109.4 84.4 L113.6 94.3" />
          <path d="M100 55 L100.1 73.6 L97.7 87.7 L98.6 99.2" />
          <path d="M100 55 L87.5 68.7 L79.7 80.6 L71.7 88.8" />
          <path d="M100 55 L78 63.1 L61.8 70.6 L48.6 76.6" />
          <path d="M100 55 L75.3 55.1 L56.5 54 L41.3 51.6" />
          <path d="M100 55 L71.6 42 L50.2 31.4 L33.9 20.9" />
          <path d="M100 55 L93.6 47.2 L90.7 40.1 L87 35.1" />
          <path d="M100 55 L99.5 43.4 L99.1 34.6 L100.2 27.5" />
          <path d="M100 55 L109.4 38.7 L115.2 25.4 L121.9 15.8" />
          <path d="M100 55 L127.6 43 L148.6 33.6 L164.7 24.2" />
        </g>

        {/* partial concentric cracks — fragments stay interlocked */}
        <g stroke="var(--color-accent-400)" fill="none" strokeWidth="0.8" strokeLinejoin="round" strokeLinecap="round" opacity=".55">
          <path d="M109.9 83.8 L98.9 89.1 L78.8 80.3" />
          <path d="M90.1 39.8 L100.2 35.5 L115.3 27.7" />
          <path d="M110.6 85.5 L99 87.5 L78 81.3 L59 72.2" />
          <path d="M89.7 67.3 L82.4 62.4 L79 53.8" />
          <path d="M99.4 72.5 L89.5 67.5 L79.6 63.6 L79.3 53.8" />
          <path d="M49.9 29.1 L90 39.7 L100.2 35.2 L119 21" />
          <path d="M99.1 82.9 L79.7 79.3 L62.4 70.8 L55.4 52.4" />
        </g>

        {/* the laminate, bonded across the pane and unbroken */}
        <rect x="30" y="14" width="140" height="82" fill="none" stroke="var(--color-accent-400)" strokeWidth="0.8" opacity=".4" />
        {/* frame edge stays continuous — the pane holds together */}
        <rect x="26" y="10" width="148" height="90" fill="none" stroke={ink} strokeWidth="1.3" />

        {/* strike point */}
        <circle cx="100" cy="55" r="9" fill="none" stroke="var(--color-signal)" strokeWidth="1.3" opacity=".5" />
        <circle cx="100" cy="55" r="4.5" fill="var(--color-signal)" />
      </svg>
    );
  }

  if (variant === "dekor") {
    // Matt/privacy film: light still gets through, but the etched surface
    // scatters it, so the view behind the glass dissolves.
    return (
      <svg viewBox="0 0 200 110" aria-hidden="true">
        <rect x="96" y="8" width="9" height="94" fill="var(--color-accent-500)" opacity=".14" />
        <line x1="96" y1="8" x2="96" y2="102" stroke={ink} strokeWidth="1" />

        {/* etched face — the matt side that breaks the image up */}
        <path
          d="M105 12 L107.6 16.3 L105 20.6 L107.6 24.9 L105 29.2 L107.6 33.5 L105 37.8 L107.6 42.1 L105 46.4 L107.6 50.7 L105 55 L107.6 59.3 L105 63.6 L107.6 67.9 L105 72.2 L107.6 76.5 L105 80.8 L107.6 85.1 L105 89.4 L107.6 93.7 L105 98"
          fill="none"
          stroke={ink}
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* one clean sightline in */}
        <g stroke="var(--color-signal)" {...line} strokeWidth={1.7}>
          <path d="M14 55 L93 55" />
        </g>
        <path d="M94 55 L87.4 57.5 L87.4 52.5 Z" fill="var(--color-signal)" />

        {/* scattered on the way out — light passes, the image does not */}
        <g stroke="var(--color-accent-400)" {...line} strokeWidth={1.1} opacity=".9">
          <path d="M107.2 53 L148.8 15.5" />
          <path d="M107.7 53.7 L163.4 26.5" />
          <path d="M108 54.5 L169 43.7" />
          <path d="M108 55.5 L169 66.3" />
          <path d="M107.7 56.3 L163.4 83.5" />
          <path d="M107.2 57 L148.8 94.5" />
        </g>
        <g fill="var(--color-accent-400)" opacity=".9">
          <path d="M149.6 14.9 L146.8 20.7 L143.5 17 Z" />
          <path d="M164.3 26.1 L160 30.9 L157.8 26.5 Z" />
          <path d="M170 43.5 L164.5 47 L163.7 42.1 Z" />
          <path d="M170 66.5 L163.7 67.9 L164.5 63 Z" />
          <path d="M164.3 83.9 L157.8 83.5 L160 79.1 Z" />
          <path d="M149.6 95.1 L143.5 93 L146.8 89.3 Z" />
        </g>
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
        <path d="M14 22 L182 34" />
        <path d="M14 82 L182 92" />
      </g>
      <g fill="var(--color-accent-400)">
        <path d="M183 34 L176.31 36.32 L176.72 30.73 Z" />
        <path d="M183 92 L176.34 94.4 L176.68 88.81 Z" />
      </g>

      {/* UV stopped at the film and turned back */}
      <g stroke="var(--color-signal)" {...line} strokeWidth={1.7}>
        <path d="M14 52 L88 55.78" />
      </g>
      <g stroke="var(--color-signal)" {...line} strokeWidth={1.7} opacity=".8">
        <path d="M90 56 L17 65.86" />
      </g>
      <g fill="var(--color-signal)">
        <path d="M88 55.78 L81.36 58.23 L81.66 52.63 Z" />
        <path d="M16 66 L22.04 62.31 L22.83 67.85 Z" opacity=".8" />
      </g>
      <circle cx="94" cy="56" r="4" fill="none" stroke="var(--color-signal)" strokeWidth="1.4" />
    </svg>
  );
}
