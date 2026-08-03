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
          ? "text-teal-dark"
          : "text-teal";

  return (
    <div className={cn("text-center", className)}>
      <div className={cn("text-4xl font-bold tracking-tight md:text-5xl", color)}>
        {value}
      </div>
      <div className="mt-2 text-sm text-text-muted md:text-base">{label}</div>
    </div>
  );
}
