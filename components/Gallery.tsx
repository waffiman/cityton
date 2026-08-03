"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
};

type GalleryProps = {
  items: GalleryItem[];
  className?: string;
  columns?: 2 | 3 | 4;
};

export function Gallery({ items, className, columns = 3 }: GalleryProps) {
  const [active, setActive] = useState<number | null>(null);

  const cols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <ul className={cn("grid gap-4", cols, className)}>
        {items.map((item, i) => (
          <li key={`${item.src}-${i}`}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-border focus-visible:outline-none"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width:768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              {item.caption ? (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-4 pb-3 pt-10 text-left text-sm font-medium text-white">
                  {item.caption}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {active != null && items[active] ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={items[active].alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4"
          onClick={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setActive(null);
          }}
        >
          <button
            type="button"
            className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-sm text-white ring-1 ring-white/30"
            onClick={() => setActive(null)}
          >
            Close
          </button>
          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={items[active].src}
              alt={items[active].alt}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
