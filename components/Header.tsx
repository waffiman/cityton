"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { IconClose, IconMenu } from "./icons";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "/products", key: "products" as const },
  { href: "/how-it-works", key: "howItWorks" as const },
  { href: "/cases", key: "cases" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/clients", key: "clients" as const },
  { href: "/partners", key: "partners" as const },
  { href: "/contact", key: "contact" as const },
];

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-dark-green text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/brand/logo-header.png"
            alt="City-Ton Austria"
            width={140}
            height={48}
            className="h-9 w-auto brightness-0 invert"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-sm font-medium transition",
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white",
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/10 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? t("closeMenu") : t("openMenu")}</span>
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-white/10 bg-dark-green px-4 py-4 xl:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-2.5 text-sm font-medium",
                      active
                        ? "bg-white/15 text-white"
                        : "text-white/80 hover:bg-white/10",
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
