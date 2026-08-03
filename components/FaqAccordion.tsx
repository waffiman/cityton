"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqEntry[];
  title?: string;
  className?: string;
};

export function FaqAccordion({ items, title, className }: FaqAccordionProps) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cn("w-full", className)}>
      {title ? (
        <h2 className="mb-6 text-display-sm text-ink">{title}</h2>
      ) : null}
      <div className="divide-y divide-border rounded-2xl bg-white ring-1 ring-border">
        {items.map((item) => {
          const isOpen = open === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-bg-soft/60"
              >
                <span className="font-medium text-ink">{item.question}</span>
                <span
                  aria-hidden
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-soft text-teal transition",
                    isOpen && "rotate-45 bg-teal text-white",
                  )}
                >
                  +
                </span>
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-text-muted">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
