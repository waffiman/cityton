import type { Metadata } from "next";
import Link from "next/link";
import Corners from "@/components/Corners";
import SeriesCard from "@/components/SeriesCard";
import { series } from "@/content/series";
import { site } from "@/content/site";
import styles from "./products.module.css";

export const metadata: Metadata = {
  title: "Produkte",
  description:
    "Vier Folienserien für Sonnenschutz, UV-Schutz, Energieeffizienz und Einbruchschutz — mit TSER-, VLT- und UV-Werten im Vergleich.",
};

export default function ProductsPage() {
  return (
    <>
      <section className="container" style={{ paddingTop: 56 }}>
        <h6 className="eyebrow">Produkte</h6>
        <h1 className={styles.title}>Vier Serien, ein Ziel je Objekt</h1>
        <p className="lead" style={{ maxWidth: "60ch" }}>
          Welche Folie passt, entscheidet die Glasart und das Ziel — nicht der Katalog. Die Werte
          unten sind Richtwerte der Hersteller; im Aufmaß legen wir die Serie gemeinsam fest.
        </p>
      </section>

      <section className="container" style={{ paddingTop: 44 }}>
        <div className={styles.list}>
          {series.map((item) => (
            <SeriesCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <section className="container section">
        <div className={`blueprint ${styles.cta}`}>
          <Corners />
          <p className={styles.ctaText}>
            Sie wollen die Werte an Ihrer eigenen Scheibe sehen? Wir bringen Musterstreifen und
            Messgerät mit.
          </p>
          <Link href="/kontakt" className="btn btn-primary blueprint">
            <Corners />
            {site.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
