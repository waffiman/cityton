import type { Benefit } from "@/content/home";

/** Lucide-style thin-stroke icons (stroke-width 1.5) for the benefit cards. */
export default function BenefitIcon({ name }: { name: Benefit["icon"] }) {
  const props = {
    width: 30,
    height: 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--color-accent)",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    "aria-hidden": true,
  };

  if (name === "sun")
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
      </svg>
    );

  if (name === "shield")
    return (
      <svg {...props}>
        <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );

  if (name === "bolt")
    return (
      <svg {...props}>
        <path d="M13 2L5 14h6l-1 8 8-12h-6l1-8z" />
      </svg>
    );

  return (
    <svg {...props}>
      <rect x="4" y="4" width="16" height="16" />
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}
