import type { Metadata } from "next";
import Link from "next/link";
import FilmCatalog from "@/components/FilmCatalog";
import SeriesCard from "@/components/SeriesCard";
import { films, series } from "@/content/series";
import { site } from "@/content/site";
import styles from "./products.module.css";

export const metadata: Metadata = {
  title: "Produkte",
  description:
    "Vier Folienserien im Überblick und der vollständige Katalog — Armolan und LLumar, mit Kennwerten und Montagehinweis.",
};

export default function ProductsPage() {
  return (
    <>
      <section className={`section--3 ${styles.seriesBand}`}>
        <div className={styles.seriesFx} aria-hidden="true">
          <span className={styles.seriesSheet} />
          <span className={styles.seriesSheet} />
          <span className={styles.seriesSheet} />
          <span className={styles.seriesOrb} />
        </div>
        <div className={`container ${styles.bandInner}`}>
          <div className={styles.seriesHead}>
            <h6 className="eyebrow">Produkte</h6>
            <h1 className={styles.title}>Vier Serien, ein Ziel je Objekt</h1>
            <p className={styles.lead}>
              Welche Folie passt, entscheidet die Glasart und das Ziel — nicht der Katalog. Unten die
              Serien im Überblick und der vollständige Katalog zum Filtern.
            </p>
          </div>
          <div className={styles.seriesList}>
            {series.map((item) => (
              <SeriesCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section id="katalog" className={`section--2 ${styles.catalogBand}`}>
        <div className={styles.catalogFx} aria-hidden="true" />
        <div className={`container ${styles.bandInner}`}>
          <h2 className={styles.sectionTitle}>Alle Folien</h2>
          <p className={styles.sectionLead}>
            Nach Marke und Montageseite filtern. Jede Karte führt zur Detailseite mit allen
            Kennwerten.
          </p>
          <FilmCatalog films={films} />
        </div>
      </section>

      <section className={`section--5 on-dark ${styles.ctaBand}`}>
        <div className={styles.ctaFx} aria-hidden="true" />
        <div className={`container ${styles.bandInner}`}>
          <h2 className={styles.ctaTitle}>Unsicher, welche Folie passt?</h2>
          <p className={styles.ctaBody}>
            Wir bringen Musterstreifen und Messgerät mit — und legen die Serie vor Ort fest.
          </p>
          <Link href="/kontakt" className="btn btn-primary btn-lg">
            {site.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
