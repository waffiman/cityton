import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { series } from "@/content/series";
import { footerColumns, site } from "@/content/site";
import styles from "./SiteFooter.module.css";

export default async function SiteFooter() {
  const t = await getTranslations();

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <div className={styles.wordmark}>CITY-TON AUSTRIA</div>
          <div className={styles.tagline}>SUN PROTECTION · SAFETY FILMS</div>
          <p className={styles.blurb}>{t("footer.blurb")}</p>
        </div>

        {footerColumns.map((col) => (
          <div key={col.titleKey}>
            <h2 className={styles.colTitle}>{t(`footer.${col.titleKey}`)}</h2>
            <div className={styles.links}>
              {col.links.map((l) => (
                <Link key={l.href} href={l.href} className={styles.link}>
                  {t(`nav.${l.key}`)}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h2 className={styles.colTitle}>{t("footer.seriesTitle")}</h2>
          <div className={styles.links}>
            {series.map((s) => (
              <Link key={s.slug} href={`/produkte/${s.slug}`} className={styles.link}>
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className={styles.colTitle}>{t("footer.contactTitle")}</h2>
          <div className={styles.links}>
            <a href={`tel:${site.contact.phoneTel}`} className={styles.link}>
              {site.contact.phone}
            </a>
            <a href={`mailto:${site.contact.email}`} className={styles.link}>
              {site.contact.email}
            </a>
            <span className={styles.link}>{site.contact.address}</span>
          </div>
        </div>
      </div>

      <div className={styles.legal}>
        <span>
          © {new Date().getFullYear()} {site.name} · {t("footer.partnerLine")}
        </span>
        <span>
          <Link href="/impressum" className={styles.legalLink}>
            {t("footer.imprint")}
          </Link>{" "}
          ·{" "}
          <Link href="/datenschutz" className={styles.legalLink}>
            {t("footer.privacy")}
          </Link>
        </span>
      </div>
    </footer>
  );
}
