import type { Metadata } from "next";
import Corners from "@/components/Corners";
import KontaktInquiryForm from "@/components/KontaktInquiryForm";
import { kontakt } from "@/content/kontakt";
import { site } from "@/content/site";
import styles from "./kontakt.module.css";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kostenlose Beratung anfragen: Objektart, Ziel und Kontaktweg — City-Ton Austria meldet sich mit Terminvorschlag.",
};

export default function KontaktPage() {
  return (
    <>
      <section className="container" style={{ paddingTop: 56 }}>
        <h1 className={styles.title}>{kontakt.title}</h1>
        <p className="lead" style={{ maxWidth: "58ch" }}>
          {kontakt.lead}
        </p>
      </section>

      <section className="container">
        <div className={styles.layout}>
          <KontaktInquiryForm />

          <div className={styles.sideColumn}>
            <div className={styles.mapFrame}>
              <iframe
                title={kontakt.mapTitle}
                src={kontakt.mapEmbedSrc}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={kontakt.mapLinkHref}
              className={styles.mapLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Größere Karte anzeigen
            </a>

            <aside className={`blueprint ${styles.side}`}>
              <Corners />
              <h2 className={styles.sideTitle}>Direkt erreichen</h2>
              <ul className={styles.sideList}>
                <li className={styles.sideItem}>
                  <span className={styles.sideLabel}>Telefon</span>
                  <a href={`tel:${site.contact.phoneTel}`} className={styles.sideValue}>
                    {site.contact.phone}
                  </a>
                </li>
                <li className={styles.sideItem}>
                  <span className={styles.sideLabel}>E-Mail</span>
                  <a href={`mailto:${site.contact.email}`} className={styles.sideValue}>
                    {site.contact.email}
                  </a>
                </li>
                <li className={styles.sideItem}>
                  <span className={styles.sideLabel}>Adresse</span>
                  <span className={styles.sideValue}>{site.contact.address}</span>
                </li>
                <li className={styles.sideItem}>
                  <span className={styles.sideLabel}>Erreichbarkeit</span>
                  <span className={styles.sideValue}>{kontakt.hours}</span>
                </li>
              </ul>
              <p className={styles.sideNote}>{kontakt.mapNote}</p>
            </aside>
          </div>
        </div>
      </section>

    </>
  );
}
