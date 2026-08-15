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
    name: "City-Ton Austria",
    src: "/media/logo-city-ton.png",
    href: "/",
    width: 160,
    height: 48,
  },
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

/**
 * Infinite logo marquee for the post-hero partner strip.
 * Logos are duplicated so the CSS loop has no gap; pauses on hover/focus.
 */
export default function PartnerCarousel({
  label = "OFFIZIELLER PARTNER VON",
  logos = DEFAULT_LOGOS,
}: {
  label?: string;
  logos?: PartnerLogo[];
}) {
  // Triple the set so wide viewports still fill while scrolling.
  const track = [...logos, ...logos, ...logos];

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{label}</span>
      <div className={styles.viewport} aria-label="Partner-Logos">
        <ul className={styles.track}>
          {track.map((logo, i) => {
            const img = (
              <Image
                src={logo.src}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
                className={styles.logo}
              />
            );
            const key = `${logo.name}-${i}`;
            return (
              <li key={key} className={styles.item} aria-hidden={i >= logos.length}>
                {logo.href ? (
                  <a
                    href={logo.href}
                    className={styles.link}
                    target={logo.href.startsWith("http") ? "_blank" : undefined}
                    rel={logo.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    tabIndex={i >= logos.length ? -1 : undefined}
                    aria-label={
                      logo.href.startsWith("http")
                        ? `${logo.name} — Website in neuem Tab öffnen`
                        : logo.name
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
      </div>
    </div>
  );
}
