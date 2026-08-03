"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type StickySequenceProps = {
  /** Sticky visual column (left on desktop). */
  visual: ReactNode;
  /** Scrolling copy blocks. */
  children: ReactNode;
  className?: string;
  /** Reverse columns (visual on the right). */
  reverse?: boolean;
};

/**
 * Pins a visual while adjacent copy scrolls past.
 * On mobile, stacks normally without sticky behaviour.
 */
export function StickySequence({
  visual,
  children,
  className,
  reverse = false,
}: StickySequenceProps) {
  return (
    <div
      className={cn(
        "grid items-start gap-10 lg:grid-cols-2 lg:gap-14",
        reverse && "lg:[&>*:first-child]:order-2",
        className,
      )}
    >
      <div className="lg:sticky lg:top-28 lg:self-start">{visual}</div>
      <div className="flex flex-col gap-10 md:gap-14">{children}</div>
    </div>
  );
}
