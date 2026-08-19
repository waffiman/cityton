"use client";

import Image from "next/image";
import styles from "./PartnerCarousel.module.css";

export type PartnerLogo = {
  name: string;
  src: string;
  href?: string;
  width: number;
  height: number;
  className?: string;
};

const DEFAULT_LOGOS: PartnerLogo[] = [
  {
    name: "LLumar",
    src: "/media/logo-llumar.png",
    href: "https://llumar.com/en/",
    width: 120,
    height: 30,
  },
  {
    name: "Armolan Europe",
    src: "/media/logo-armolan.png",
    href: "https://armolan.de/en/home",
    width: 160,
    height: 44,
  },
];

/** How many times to repeat the brand list inside one marquee half (fills wide screens). */
const SET_REPEAT = 8;

function LogoSet({
  logos,
  duplicate,
}: {
  logos: PartnerLogo[];
  duplicate?: boolean;
}) {
  // One half of the track: repeated brands so the strip stays full on wide viewports.
  const items = Array.from({ length: SET_REPEAT }, () => logos).flat();

  return (
    <ul className={styles.set} aria-hidden={duplicate || undefined}>
      {items.map((logo, i) => {
        const img = (
          <Image
            src={logo.src}
            alt={logo.name}
            width={logo.width}
            height={logo.height}
            className={styles.logo}
          />
        );
        const interactive = !duplicate && i < logos.length;
        return (
          <li key={`${logo.name}-${i}`} className={styles.item}>
            {logo.href ? (
              <a
                href={logo.href}
                className={styles.link}
                target={logo.href.startsWith("http") ? "_blank" : undefined}
                rel={logo.href.startsWith("http") ? "noopener noreferrer" : undefined}
                tabIndex={interactive ? undefined : -1}
                aria-label={
                  interactive
                    ? logo.href.startsWith("http")
                      ? `${logo.name} — Website in neuem Tab öffnen`
                      : logo.name
                    : undefined
                }
              >
                {img}
              </a>
            ) : (
              <span className={styles.link}>{img}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Infinite logo marquee for the post-hero partner strip.
 * Two identical halves + equal trailing gap so translateX(-50%) loops without a jump.
 */
export default function PartnerCarousel({
  label = "OFFIZIELLER PARTNER VON",
  logos = DEFAULT_LOGOS,
}: {
  label?: string;
  logos?: PartnerLogo[];
}) {
  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{label}</span>
      <div className={styles.viewport} aria-label="Partner-Logos">
        <div className={styles.track}>
          <LogoSet logos={logos} />
          <LogoSet logos={logos} duplicate />
        </div>
      </div>
    </div>
  );
}
