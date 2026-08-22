"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Corners from "./Corners";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { nav, site } from "@/content/site";
import styles from "./SiteHeader.module.css";

const LOCALE_LABEL: Record<string, string> = { de: "DE", en: "EN" };

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const activeLocale = useLocale();
  // Transparent over full-bleed heroes until the page is scrolled.
  const [hasHero, setHasHero] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Solid bar while the drawer is open so the close icon isn't light-on-light.
  const overHero = hasHero && !scrolled && !open;

  // Close the mobile drawer on navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const update = () => {
      setHasHero(!!document.getElementById("hero-zone-end"));
      setScrolled(window.scrollY > 4);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={`${styles.header}${overHero ? ` ${styles.overHero}` : ""}`}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label={`${site.name} — Startseite`}>
          <Image
            src="/media/logo-city-ton.png"
            alt=""
            width={168}
            height={50}
            className={styles.logo}
            priority
          />
        </Link>

        <nav className={styles.nav} aria-label={t("nav.mainNav")}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.link}
              aria-current={isCurrent(item.href) ? "page" : undefined}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className={styles.locales} aria-label={t("nav.language")}>
          {routing.locales.map((code) => (
            <Link
              key={code}
              href={pathname}
              locale={code}
              className={code === activeLocale ? styles.localeActive : styles.locale}
              aria-current={code === activeLocale ? "true" : undefined}
            >
              {LOCALE_LABEL[code]}
            </Link>
          ))}
        </div>

        <Link href="/kontakt" className={`btn btn-primary blueprint ${styles.cta}`}>
          <Corners />
          {t("site.cta")}
        </Link>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{t("nav.menu")}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className={styles.drawer} aria-label={t("nav.mobileNav")}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.drawerLink}
              aria-current={isCurrent(item.href) ? "page" : undefined}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          <Link href="/kontakt" className="btn btn-primary btn-lg">
            {t("site.cta")}
          </Link>
        </nav>
      )}
    </header>
  );
}
