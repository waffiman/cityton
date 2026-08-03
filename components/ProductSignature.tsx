import { cn } from "@/lib/utils";
import type { ProductSlug } from "@/content/products";

type ProductSignatureProps = {
  slug: ProductSlug;
  className?: string;
  /** Compact for cards */
  compact?: boolean;
};

/**
 * Abstract SVG identity per film series, driven by its character:
 * - serie-r: reflective mirror shards
 * - arm-platinum-spectrum: nano-particle field
 * - safety-serie: laminated protective lattice
 * - uv-protection-clear: clear UV barrier arcs
 */
export function ProductSignature({
  slug,
  className,
  compact = false,
}: ProductSignatureProps) {
  const h = compact ? 120 : 200;

  if (slug === "serie-r") {
    return (
      <svg
        viewBox="0 0 320 200"
        className={cn("w-full", className)}
        style={{ maxHeight: h }}
        aria-hidden
      >
        <defs>
          <linearGradient id="r-shine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c8d8e0" />
            <stop offset="45%" stopColor="#358a9a" />
            <stop offset="100%" stopColor="#0a1f24" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="#0c1a1e" rx="16" />
        <polygon points="40,160 120,30 200,160" fill="url(#r-shine)" opacity="0.9" />
        <polygon points="140,170 220,40 300,170" fill="url(#r-shine)" opacity="0.55" />
        <line x1="20" y1="40" x2="300" y2="20" stroke="#7eb8c4" strokeWidth="1.5" opacity="0.6" />
        <line x1="40" y1="180" x2="280" y2="150" stroke="#ffffff" strokeWidth="1" opacity="0.25" />
      </svg>
    );
  }

  if (slug === "arm-platinum-spectrum") {
    return (
      <svg
        viewBox="0 0 320 200"
        className={cn("w-full", className)}
        style={{ maxHeight: h }}
        aria-hidden
      >
        <rect width="320" height="200" fill="#f3f0eb" rx="16" />
        {Array.from({ length: 48 }).map((_, i) => {
          const x = 24 + (i % 12) * 24;
          const y = 28 + Math.floor(i / 12) * 40;
          const r = 3 + (i % 3);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill={i % 4 === 0 ? "#358a9a" : i % 3 === 0 ? "#d4a04a" : "#1e4a54"}
              opacity={0.35 + (i % 5) * 0.1}
            />
          );
        })}
        <rect
          x="40"
          y="30"
          width="240"
          height="140"
          rx="8"
          fill="none"
          stroke="#358a9a"
          strokeWidth="1.5"
          opacity="0.4"
        />
      </svg>
    );
  }

  if (slug === "safety-serie") {
    return (
      <svg
        viewBox="0 0 320 200"
        className={cn("w-full", className)}
        style={{ maxHeight: h }}
        aria-hidden
      >
        <rect width="320" height="200" fill="#0a1f24" rx="16" />
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={28 + col * 34}
              y={24 + row * 28}
              width="28"
              height="22"
              rx="2"
              fill="none"
              stroke="#358a9a"
              strokeWidth="1.2"
              opacity={0.4 + ((row + col) % 3) * 0.15}
            />
          )),
        )}
        <circle
          cx="160"
          cy="100"
          r="36"
          fill="none"
          stroke="#d4a04a"
          strokeWidth="3"
          opacity="0.85"
        />
        <circle cx="160" cy="100" r="8" fill="#d4a04a" />
      </svg>
    );
  }

  // uv-protection-clear
  return (
    <svg
      viewBox="0 0 320 200"
      className={cn("w-full", className)}
      style={{ maxHeight: h }}
      aria-hidden
    >
      <rect width="320" height="200" fill="#faf8f5" rx="16" />
      <rect
        x="70"
        y="30"
        width="180"
        height="140"
        rx="6"
        fill="#e8f2f4"
        stroke="#358a9a"
        strokeWidth="2"
      />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M ${90 + i * 12} 20 Q 160 ${50 + i * 18} ${230 - i * 12} 20`}
          fill="none"
          stroke="#d4a04a"
          strokeWidth="2"
          opacity={0.9 - i * 0.15}
        />
      ))}
      <text
        x="160"
        y="110"
        textAnchor="middle"
        fontSize="14"
        fontFamily="system-ui,sans-serif"
        fill="#1e4a54"
        fontWeight="600"
      >
        UV 99.9%
      </text>
    </svg>
  );
}
