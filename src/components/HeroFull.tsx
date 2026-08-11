import Image from "next/image";
import styles from "./HeroFull.module.css";

/** Full-bleed photo hero (site.heroVariant === "vollbild"). */
export default function HeroFull() {
  return (
    <section className={styles.hero}>
      <Image
        src="/media/dual-reflective-residential.jpg"
        alt="Fassade mit Sonnenschutzfolie von außen"
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
            OFFIZIELLER PARTNER · LLUMAR &amp; ARMOLAN
          </div>
          <h1 className={styles.title}>
            Wir verkaufen keine Folienrollen.
            <br />
            Wir liefern das Ergebnis.
          </h1>
          <p className={styles.body}>
            Beratung, Material, Montage und Betreuung in einem Paket — für Sonnenschutz,
            UV-Schutz, Energieeffizienz und Einbruchschutz an Glasflächen in ganz Österreich.
          </p>
        </div>
      </div>
    </section>
  );
}
