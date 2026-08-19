import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import FilmCatalog from "@/components/FilmCatalog";
import SeriesCard from "@/components/SeriesCard";
import { getCatalogProducts, getVisibleSeries } from "@/lib/products";
import styles from "./products.module.css";

export const metadata: Metadata = {
  title: "Produkte",
  description:
    "Vier Folienserien im Überblick und der vollständige Katalog — Armolan und LLumar, mit Kennwerten und Montagehinweis.",
};

// Reads live catalog data; rendered per request so admin edits show immediately.
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [series, films] = await Promise.all([getVisibleSeries(), getCatalogProducts()]);
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
            <h1 className={styles.title}>Vier Serien, ein Ziel je Objekt</h1>
            <p className={styles.lead}>
              Welche Folie passt, entscheidet die Glasart und das Ziel — nicht der Katalog.
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

      <CtaBand
        title="Unsicher, welche Folie passt?"
        body="Wir bringen Musterstreifen und Messgerät mit — und legen die Serie vor Ort fest."
      />
    </>
  );
}
