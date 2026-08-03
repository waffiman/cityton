import { cn } from "@/lib/utils";

type StatCalloutProps = {
  value: string;
  label: string;
  className?: string;
  accent?: "teal" | "amber" | "red" | "default";
};

export function StatCallout({
  value,
  label,
  className,
  accent = "teal",
}: StatCalloutProps) {
  const color =
    accent === "amber"
      ? "text-amber"
      : accent === "red"
        ? "text-red"
        : accent === "default"
          ? "text-ink"
          : "text-teal";

  return (
    <div className={cn("text-center", className)}>
      <div
        className={cn(
          "text-5xl font-semibold tracking-tight md:text-6xl",
          color,
        )}
      >
        {value}
      </div>
      <div className="mt-3 text-sm text-text-muted md:text-base">{label}</div>
    </div>
  );
}
