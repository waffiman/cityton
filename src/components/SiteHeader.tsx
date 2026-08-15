"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Corners from "./Corners";
import { nav, site } from "@/content/site";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Transparent header while the hero zone is still on screen (home only).
  const [pastHero, setPastHero] = useState(false);
  const overHero = pathname === "/" && !pastHero;

  // Close the mobile drawer on navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const update = () => {
      const sentinel = document.getElementById("hero-zone-end");
      setPastHero(sentinel ? sentinel.getBoundingClientRect().top <= 0 : pathname !== "/");
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

        <nav className={styles.nav} aria-label="Hauptnavigation">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.link}
              aria-current={isCurrent(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.locales} aria-label="Sprache">
          {site.locales.map((l) => (
            <span key={l.code} className={l.active ? styles.localeActive : styles.locale}>
              {l.label}
            </span>
          ))}
        </div>

        <Link href="/kontakt" className={`btn btn-primary blueprint ${styles.cta}`}>
          <Corners />
          {site.cta}
        </Link>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menü</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className={styles.drawer} aria-label="Navigation (mobil)">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.drawerLink}
              aria-current={isCurrent(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/kontakt" className="btn btn-primary btn-lg">
            {site.cta}
          </Link>
        </nav>
      )}
    </header>
  );
}
