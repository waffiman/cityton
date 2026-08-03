import { cn } from "@/lib/utils";

type CertificationBadgeProps = {
  label: string;
  standard?: string;
  className?: string;
};

export function CertificationBadge({
  label,
  standard,
  className,
}: CertificationBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal-dark ring-1 ring-teal/20",
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="h-3.5 w-3.5 text-teal"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 1.5l2.2 4.45 4.9.71-3.55 3.46.84 4.88L10 12.77 5.61 15l.84-4.88L2.9 6.66l4.9-.71L10 1.5z"
          clipRule="evenodd"
        />
      </svg>
      {label}
      {standard && standard !== "TBD" ? (
        <span className="font-normal text-text-muted">· {standard}</span>
      ) : null}
    </span>
  );
}
