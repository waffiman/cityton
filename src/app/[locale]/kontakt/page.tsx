import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Corners from "@/components/Corners";
import KontaktInquiryForm from "@/components/KontaktInquiryForm";
import { mapEmbedSrc, mapLinkHref } from "@/content/kontakt";
import { site } from "@/content/site";
import styles from "./kontakt.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kontakt" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function KontaktPage() {
  const t = await getTranslations("kontakt");

  return (
    <>
      <section
        className="section--3"
        style={{ position: "relative", overflow: "hidden", paddingTop: 56, paddingBottom: 40 }}
      >
        <div className="diagonal-fx" aria-hidden="true">
          <span className="diagonal-sheet" />
          <span className="diagonal-sheet" />
          <span className="diagonal-sheet" />
          <span className="diagonal-orb" />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className="lead" style={{ maxWidth: "58ch" }}>
            {t("lead")}
          </p>
        </div>
      </section>

      <section className="container">
        <div className={styles.layout}>
          <KontaktInquiryForm />

          <div className={styles.sideColumn}>
            <div className={styles.mapFrame}>
              <iframe
                title={t("mapTitle")}
                src={mapEmbedSrc}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={mapLinkHref}
              className={styles.mapLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("showLargerMap")}
            </a>

            <aside className={`blueprint ${styles.side}`}>
              <Corners />
              <h2 className={styles.sideTitle}>{t("sideTitle")}</h2>
              <ul className={styles.sideList}>
                <li className={styles.sideItem}>
                  <span className={styles.sideLabel}>{t("sidePhoneLabel")}</span>
                  <a href={`tel:${site.contact.phoneTel}`} className={styles.sideValue}>
                    {site.contact.phone}
                  </a>
                </li>
                <li className={styles.sideItem}>
                  <span className={styles.sideLabel}>{t("sideEmailLabel")}</span>
                  <a href={`mailto:${site.contact.email}`} className={styles.sideValue}>
                    {site.contact.email}
                  </a>
                </li>
                <li className={styles.sideItem}>
                  <span className={styles.sideLabel}>{t("sideAddressLabel")}</span>
                  <span className={styles.sideValue}>{site.contact.address}</span>
                </li>
                <li className={styles.sideItem}>
                  <span className={styles.sideLabel}>{t("sideHoursLabel")}</span>
                  <span className={styles.sideValue}>{t("hours")}</span>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
