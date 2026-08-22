import { getTranslations } from "next-intl/server";
import AutoplayVideo from "./AutoplayVideo";
import Corners from "./Corners";
import { Link } from "@/i18n/navigation";
import styles from "./HeroSplit.module.css";

/** Two-column hero with the looping install video (site.heroVariant === "split"). */
export default async function HeroSplit() {
  const [t, tsite] = await Promise.all([
    getTranslations("home.hero"),
    getTranslations("site"),
  ]);
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
          {t("eyebrow")}
        </div>
        <h1 className={styles.title}>
          {t("titleLine1")} {t("titleLine2")}
        </h1>
        <p className={styles.body}>{t("subtitle")}</p>
        <div className={styles.actions}>
          <Link href="/kontakt" className="btn btn-primary btn-lg blueprint">
            <Corners />
            {tsite("cta")}
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
