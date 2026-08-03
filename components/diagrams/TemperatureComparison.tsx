"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TemperatureComparisonProps = {
  withoutValue: number;
  withValue: number;
  withoutLabel: string;
  withLabel: string;
  unit?: string;
  className?: string;
};

export function TemperatureComparison({
  withoutValue,
  withValue,
  withoutLabel,
  withLabel,
  unit = "°C",
  className,
}: TemperatureComparisonProps) {
  const max = Math.max(withoutValue, withValue) * 1.15;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const bars = [
    { value: withoutValue, label: withoutLabel, color: "bg-red", text: "text-red" },
    { value: withValue, label: withLabel, color: "bg-teal", text: "text-teal" },
  ];

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <div className="flex h-64 items-end justify-center gap-10 md:gap-16">
        {bars.map((b) => {
          const pct = (b.value / max) * 100;
          return (
            <div key={b.label} className="flex w-28 flex-col items-center md:w-36">
              <div
                className={cn("mb-2 text-2xl font-bold md:text-3xl", b.text)}
              >
                {b.value.toLocaleString(undefined, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
                {unit}
              </div>
              <div className="relative flex h-48 w-full items-end rounded-t-xl bg-bg-soft ring-1 ring-border">
                <div
                  className={cn(
                    "w-full rounded-t-xl transition-all duration-1000 ease-out",
                    b.color,
                  )}
                  style={{ height: visible ? `${pct}%` : "0%" }}
                  role="img"
                  aria-label={`${b.label}: ${b.value}${unit}`}
                />
              </div>
              <div className="mt-3 text-center text-xs font-medium text-text-muted md:text-sm">
                {b.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
