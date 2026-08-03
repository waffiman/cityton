import { CountUp } from "@/components/motion/CountUp";
import { cn } from "@/lib/utils";
import type { CompanyStat } from "@/content/company";

type StatGridProps = {
  stats: Array<CompanyStat & { label: string }>;
  className?: string;
  placeholderNote?: string;
};

export function StatGrid({ stats, className, placeholderNote }: StatGridProps) {
  return (
    <div className={cn("w-full", className)}>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-border"
          >
            <dt className="order-2 mt-2 text-sm text-text-muted">{stat.label}</dt>
            <dd className="order-1 text-4xl font-semibold tracking-tight text-teal md:text-5xl">
              <CountUp
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </dd>
            {stat.placeholder && placeholderNote ? (
              <p className="mt-2 text-[10px] uppercase tracking-wide text-amber">
                {placeholderNote}
              </p>
            ) : null}
          </div>
        ))}
      </dl>
    </div>
  );
}
