import Image from "next/image";
import { getTranslations } from "next-intl/server";
import styles from "./HeroFull.module.css";

/** Full-bleed photo hero (site.heroVariant === "vollbild"). */
export default async function HeroFull() {
  const t = await getTranslations("home.hero");

  return (
    <section className={styles.hero}>
      <Image
        src="/media/hero-section.jpg"
        alt={t("imageAlt")}
        fill
        priority
        sizes="100vw"
        className={styles.photo}
      />
      <div className={styles.scrim} />
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <div className={styles.eyebrow}>
            <span className={styles.tick} />
            {t("eyebrow")}
          </div>
          <h1 className={styles.title}>
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
          </h1>
        </div>
      </div>
      <div id="hero-zone-end" className={styles.end} aria-hidden="true" />
    </section>
  );
}
