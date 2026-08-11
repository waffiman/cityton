import Link from "next/link";
import { series } from "@/content/series";
import { footerColumns, site } from "@/content/site";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <>
      {/* Every page ends on the ground rung, so the ramp into the footer is the
          same everywhere and belongs here rather than at the end of each page. */}
      <div className={`ramp ${styles.tailRamp}`} />
      <footer className={styles.footer}>
        <div className={styles.grid}>
          <div>
            <div className={styles.wordmark}>CITY-TON AUSTRIA</div>
            <div className={styles.tagline}>SUN PROTECTION · SAFETY FILMS</div>
            <p className={styles.blurb}>
              Sonnenschutz, UV-Schutz, Energieeffizienz und Einbruchschutz für Glasflächen.
              Österreich &amp; Ukraine.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h6 className={styles.colTitle}>{col.title}</h6>
              <div className={styles.links}>
                {col.links.map((l) => (
                  <Link key={l.href} href={l.href} className={styles.link}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h6 className={styles.colTitle}>Serien</h6>
            <div className={styles.links}>
              {series.map((s) => (
                <Link key={s.slug} href={`/produkte/${s.slug}`} className={styles.link}>
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h6 className={styles.colTitle}>Kontakt</h6>
            <div className={styles.links}>
              <span className={styles.placeholder}>{site.contact.phone}</span>
              <span className={styles.placeholder}>{site.contact.email}</span>
              <span className={styles.placeholder}>{site.contact.address}</span>
            </div>
          </div>
        </div>

        <div className={styles.legal}>
          <span>© {new Date().getFullYear()} City-Ton Austria · Offizieller Partner von LLumar &amp; Armolan Europe</span>
          <span>
            <Link href="/impressum" className={styles.legalLink}>
              Impressum
            </Link>{" "}
            ·{" "}
            <Link href="/datenschutz" className={styles.legalLink}>
              Datenschutz
            </Link>
          </span>
        </div>
      </footer>
    </>
  );
}
