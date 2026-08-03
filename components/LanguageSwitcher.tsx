"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-white/10 p-0.5 text-sm font-semibold",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => router.replace(pathname, { locale: l })}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase transition",
            locale === l
              ? "bg-teal text-white shadow-sm"
              : "text-white/70 hover:text-white",
          )}
          aria-pressed={locale === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
