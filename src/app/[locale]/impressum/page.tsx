import type { Metadata } from "next";
import { site } from "@/content/site";
import styles from "../datenschutz/legal.module.css";

export const metadata: Metadata = { title: "Impressum", robots: { index: false } };

/**
 * Offenlegung nach § 5 ECG, § 14 UGB und § 25 MedienG.
 *
 * Spans marked `styles.todo` are facts only the client can supply — they come
 * off the Gewerbeschein and the Firmenbuch extract, and none of them can be
 * derived from anything already in this repo. The page is deliberately live
 * with the gaps visible rather than withheld: an Austrian commercial site is
 * required to carry an Impressum, and a partly-filled one is better than the
 * placeholder that stood here before. The whole text still needs a legal
 * review before it can be relied on.
 *
 * Shares legal.module.css with the Datenschutz page — same document type,
 * same typography.
 */
export default function ImpressumPage() {
  return (
    <section className={`container ${styles.page}`}>
      <h1 className={styles.title}>Impressum</h1>
      <p className={styles.updated}>Offenlegung gemäß § 5 ECG, § 14 UGB und § 25 MedienG</p>

      <div className={styles.prose}>
        <h2>1. Medieninhaber und Diensteanbieter</h2>
        <div className={styles.contactCard}>
          <p>
            <strong>City-Ton Austria</strong>
          </p>
          <p>
            <span className={styles.todo}>
              Firmenwortlaut und Rechtsform laut Firmenbuch — vom Kunden zu ergänzen
            </span>
          </p>
          <p>{site.contact.address}</p>
          <p>Österreich</p>
          <p>Telefon: {site.contact.phone}</p>
          <p>E-Mail: {site.contact.email}</p>
          <p>Web: city-ton.com</p>
        </div>
        <p>
          Für den Inhalt verantwortlich:{" "}
          <span className={styles.todo}>
            Name des Inhabers bzw. der vertretungsbefugten Person — vom Kunden zu ergänzen
          </span>
        </p>

        <h2>2. Unternehmensgegenstand</h2>
        <p>
          Beratung, Planung und fachgerechte Montage von Architektur- und Fensterfolien
          (Sonnenschutz, UV-Schutz, Sichtschutz und Sicherheitsfolien) auf Glasflächen.
        </p>
        <p>
          Wortlaut der Gewerbeberechtigung:{" "}
          <span className={styles.todo}>
            Gewerbewortlaut laut Gewerbeschein — vom Kunden zu ergänzen
          </span>
        </p>

        <h2>3. Firmenbuch und Umsatzsteuer</h2>
        <p>
          Firmenbuchnummer:{" "}
          <span className={styles.todo}>
            FN — vom Kunden zu ergänzen, entfällt bei nicht eingetragenem Einzelunternehmen
          </span>
        </p>
        <p>
          Firmenbuchgericht:{" "}
          <span className={styles.todo}>
            zuständiges Gericht — vom Kunden zu ergänzen, bei Wiener Sitz in der Regel
            Handelsgericht Wien
          </span>
        </p>
        <p>
          UID-Nummer:{" "}
          <span className={styles.todo}>
            ATU — vom Kunden zu ergänzen, entfällt bei Kleinunternehmerregelung
          </span>
        </p>

        <h2>4. Gewerbebehörde und Kammerzugehörigkeit</h2>
        <p>
          Gewerbebehörde: Magistratisches Bezirksamt für den 22. Bezirk, Wien — als für den
          Unternehmenssitz zuständige Bezirksverwaltungsbehörde.
        </p>
        <p>
          Kammerzugehörigkeit: Wirtschaftskammer Wien,{" "}
          <span className={styles.todo}>Fachgruppe bzw. Fachverband — vom Kunden zu ergänzen</span>
        </p>
        <p>
          Anwendbare Rechtsvorschrift: Gewerbeordnung 1994 (GewO) in der geltenden Fassung,
          abrufbar über das Rechtsinformationssystem des Bundes unter{" "}
          <a href="https://www.ris.bka.gv.at" target="_blank" rel="noopener noreferrer">
            ris.bka.gv.at
          </a>
          .
        </p>

        <h2>5. Blattlinie</h2>
        <p>
          Diese Website dient der Information über das Leistungsangebot von City-Ton Austria im
          Bereich Architektur- und Fensterfolien sowie der Kontaktaufnahme mit Interessentinnen
          und Interessenten. Sie enthält keine periodischen redaktionellen Inhalte im Sinne einer
          Berichterstattung.
        </p>

        <h2>6. Hosting</h2>
        <p>
          Diese Website wird auf einem Server in Deutschland betrieben. Einzelheiten zur
          Datenverarbeitung beim Seitenaufruf finden Sie in unserer{" "}
          <a href="/datenschutz">Datenschutzerklärung</a>.
        </p>

        <h2>7. Verbraucherstreitbeilegung</h2>
        <p>
          <span className={styles.todo}>
            Vom Kunden festzulegen: Bereitschaft zur Teilnahme an einem Streitbeilegungsverfahren
            vor einer Verbraucherschlichtungsstelle (in der Regel: keine Verpflichtung und keine
            Bereitschaft)
          </span>
        </p>
        <p>
          Hinweis: Die Online-Streitbeilegungsplattform der Europäischen Kommission wurde mit
          20. Juli 2025 eingestellt. Ein Verweis darauf ist daher nicht mehr aufzunehmen.
        </p>

        <h2>8. Haftung für Inhalte</h2>
        <p>
          Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die
          Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr
          übernehmen. Angaben zu technischen Kennwerten von Folien (etwa Lichtdurchlass,
          Gesamtenergiedurchlass oder UV-Schutz) stammen aus Datenblättern der Hersteller und
          beziehen sich jeweils auf den dort angegebenen Glasaufbau. Die im Einzelfall erzielbare
          Wirkung hängt von Glasart, Beschichtung, Einbausituation und Ausrichtung ab und wird vor
          Ort ermittelt.
        </p>

        <h2>9. Haftung für Links</h2>
        <p>
          Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
          Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
          verantwortlich. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar.
        </p>

        <h2>10. Urheberrecht</h2>
        <p>
          Die auf dieser Website veröffentlichten Inhalte, Texte, Fotografien und Grafiken sind
          urheberrechtlich geschützt. Eine Verwendung außerhalb der Grenzen des Urheberrechts
          bedarf unserer vorherigen schriftlichen Zustimmung. Die Marken- und Produktbezeichnungen
          LLumar und Armolan sowie die zugehörigen Logos sind Eigentum der jeweiligen Hersteller
          und werden mit deren Einverständnis verwendet.
        </p>
      </div>
    </section>
  );
}
