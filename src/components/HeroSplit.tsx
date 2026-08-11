import Link from "next/link";
import AutoplayVideo from "./AutoplayVideo";
import Corners from "./Corners";
import { site } from "@/content/site";
import styles from "./HeroSplit.module.css";

/** Two-column hero with the looping install video (site.heroVariant === "split"). */
export default function HeroSplit() {
  const stats = [
    { value: "−7,6 °C", label: "RAUMTEMPERATUR" },
    { value: "99 %", label: "UV-FILTERUNG" },
    { value: "20+", label: "OBJEKTE" },
  ];

  return (
    <section className={styles.hero}>
      <div className={styles.copyCol}>
        <div className={styles.eyebrow}>
          <span className={styles.tick} />
          OFFIZIELLER PARTNER · LLUMAR &amp; ARMOLAN
        </div>
        <h1 className={styles.title}>Wir verkaufen keine Folienrollen. Wir liefern das Ergebnis.</h1>
        <p className={styles.body}>
          Beratung, Material, Montage und Betreuung in einem Paket — Sonnenschutz, UV-Schutz,
          Energieeffizienz und Einbruchschutz.
        </p>
        <div className={styles.actions}>
          <Link href="/kontakt" className="btn btn-primary btn-lg blueprint">
            <Corners />
            {site.cta}
          </Link>
          <Link href="/produkte" className="btn btn-lg btn-inverse">
            Folien-Serien
          </Link>
        </div>
        <div className={styles.stats}>
          {stats.map((s) => (
            <div key={s.label}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.mediaCol}>
        <AutoplayVideo
          src="/media/hero-loop.mp4"
          poster="/media/hero-loop-poster.jpg"
          className={styles.video}
        />
      </div>
      <div id="hero-zone-end" className={styles.end} aria-hidden="true" />
    </section>
  );
}
