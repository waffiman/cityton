"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { IconClose, IconMenu } from "./icons";
import { media } from "@/content/media";
import { cn } from "@/lib/utils";

const PRIMARY = [
  { href: "/products", key: "products" as const },
  { href: "/how-it-works", key: "howItWorks" as const },
  { href: "/clients", key: "clients" as const },
  { href: "/partners", key: "partners" as const },
  { href: "/contact", key: "contact" as const },
];

const MORE = [
  { href: "/about", key: "about" as const },
  { href: "/cases", key: "cases" as const },
  { href: "/blog", key: "blog" as const },
];

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const isHome = pathname === "/";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "z-50",
        isHome
          ? "absolute inset-x-0 top-0"
          : "sticky top-0 border-b border-border/80 bg-background/90 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="relative z-10 flex shrink-0 items-center"
          onClick={() => setOpen(false)}
        >
          <Image
            src={media.brand.logo}
            alt="City-Ton Austria"
            width={140}
            height={48}
            className={cn(
              "h-9 w-auto",
              isHome && "brightness-0 invert drop-shadow-sm",
            )}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {PRIMARY.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition",
                isHome
                  ? "text-white/85 hover:bg-white/10 hover:text-white"
                  : "text-ink/70 hover:bg-bg-soft hover:text-ink",
                isActive(item.href) &&
                  (isHome ? "bg-white/15 text-white" : "bg-bg-soft text-ink"),
              )}
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium",
                isHome
                  ? "text-white/85 hover:bg-white/10"
                  : "text-ink/70 hover:bg-bg-soft",
              )}
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((v) => !v)}
            >
              ···
            </button>
            {moreOpen ? (
              <div className="absolute right-0 top-full mt-2 min-w-[11rem] overflow-hidden rounded-xl bg-white py-1 shadow-xl ring-1 ring-border">
                {MORE.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="block px-4 py-2.5 text-sm text-ink hover:bg-bg-soft"
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher
            className={!isHome ? "!bg-ink/5 [&_button]:text-ink/60 [&_button[aria-pressed=true]]:!bg-teal [&_button[aria-pressed=true]]:!text-white" : undefined}
          />
          <button
            type="button"
            className={cn(
              "inline-flex rounded-lg p-2 lg:hidden",
              isHome ? "text-white hover:bg-white/10" : "text-ink hover:bg-bg-soft",
            )}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">
              {open ? t("closeMenu") : t("openMenu")}
            </span>
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className={cn(
            "border-t px-5 py-4 lg:hidden",
            isHome
              ? "border-white/10 bg-ink/95 backdrop-blur-md"
              : "border-border bg-background",
          )}
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {[...PRIMARY, ...MORE].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium",
                    isHome ? "text-white/85" : "text-ink/80",
                    isActive(item.href) &&
                      (isHome ? "bg-white/15 text-white" : "bg-bg-soft text-ink"),
                  )}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
