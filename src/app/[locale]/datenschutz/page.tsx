import type { Metadata } from "next";
import { site } from "@/content/site";
import styles from "./legal.module.css";

export const metadata: Metadata = { title: "Datenschutzerklärung", robots: { index: false } };

/**
 * DSGVO notice describing what this site actually does: two lead forms writing
 * to our own Postgres, Cloudflare Turnstile, an embedded Google map, Google
 * Analytics (consent-gated via the cookie banner in CookieConsent.tsx), and
 * fonts self-hosted otherwise.
 *
 * Spans marked `styles.todo` are facts only the client can supply (registered
 * address, retention period, hosting contract). The whole text still needs a
 * legal review before it can be relied on.
 */
export default function DatenschutzPage() {
  return (
    <section className={`container ${styles.page}`}>
      <h1 className={styles.title}>Datenschutzerklärung</h1>
      <p className={styles.updated}>Stand: August 2026</p>

      <div className={styles.prose}>
        <p>
          Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Nachfolgend informieren wir
          Sie gemäß der Datenschutz-Grundverordnung (DSGVO) darüber, welche Daten wir beim Besuch
          dieser Website verarbeiten, zu welchem Zweck und auf welcher Rechtsgrundlage.
        </p>

        <h2>1. Verantwortlicher</h2>
        <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
        <div className={styles.contactCard}>
          <p>
            <strong>City-Ton Austria</strong>
          </p>
          <p>{site.contact.address}</p>
          <p>Österreich</p>
          <p>
            <span className={styles.todo}>
              Firmenwortlaut und UID-Nummer — vom Kunden zu ergänzen
            </span>
          </p>
          <p>Telefon: {site.contact.phone}</p>
          <p>E-Mail: {site.contact.email}</p>
        </div>
        <p>
          Ein Datenschutzbeauftragter ist nicht bestellt, da die gesetzlichen Voraussetzungen
          hierfür nicht vorliegen.
        </p>

        <h2>2. Hosting und Server-Logfiles</h2>
        <p>
          Diese Website wird auf einem Server in{" "}
          <span className={styles.todo}>Standort und Anbieter — vom Kunden zu ergänzen</span>{" "}
          betrieben. Beim Aufruf der Website werden automatisch Informationen an den Server
          übermittelt und vorübergehend in Logfiles gespeichert:
        </p>
        <ul>
          <li>IP-Adresse des anfragenden Geräts</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>aufgerufene Seite bzw. Datei</li>
          <li>übertragene Datenmenge und Meldung über den Abruf</li>
          <li>Browsertyp, Browserversion und Betriebssystem</li>
          <li>Referrer-URL</li>
        </ul>
        <p>
          Diese Verarbeitung erfolgt auf Grundlage unseres berechtigten Interesses am sicheren und
          stabilen Betrieb der Website (Art. 6 Abs. 1 lit. f DSGVO). Eine Zusammenführung dieser
          Daten mit anderen Datenquellen findet nicht statt.
        </p>

        <h2>3. Kontaktaufnahme über die Formulare</h2>
        <p>Auf dieser Website stehen zwei Formulare zur Verfügung:</p>
        <h3>Anfrageformular (Seite „Kontakt“)</h3>
        <p>Erhoben werden: Name, Objektart, optional die Fläche, Ihr Ziel bzw. Ihre Ziele,
          Telefonnummer und/oder E-Mail-Adresse sowie optional eine Nachricht.</p>
        <h3>Kurzanfrage (Startseite)</h3>
        <p>Erhoben wird ausschließlich eine Telefonnummer oder E-Mail-Adresse.</p>
        <p>
          Diese Daten verwenden wir ausschließlich, um Ihre Anfrage zu bearbeiten und mit Ihnen
          Kontakt aufzunehmen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung
          vorvertraglicher Maßnahmen) sowie Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO, die
          Sie beim Absenden des Anfrageformulars erteilen. Ihre Einwilligung können Sie jederzeit
          mit Wirkung für die Zukunft widerrufen.
        </p>
        <p>
          Die Daten werden in einer Datenbank auf dem oben genannten Server gespeichert und
          zusätzlich per E-Mail an unser Postfach übermittelt. Haben Sie eine E-Mail-Adresse
          angegeben, erhalten Sie eine automatische Empfangsbestätigung.
        </p>
        <p>
          <strong>Speicherdauer:</strong> Wir speichern Ihre Anfrage, solange dies zur Bearbeitung
          erforderlich ist, längstens jedoch{" "}
          <span className={styles.todo}>Aufbewahrungsfrist — vom Kunden festzulegen</span>.
          Gesetzliche Aufbewahrungspflichten, insbesondere nach UGB und BAO, bleiben unberührt.
        </p>

        <h2>4. Schutz vor automatisierten Anfragen (Cloudflare Turnstile)</h2>
        <p>
          Zum Schutz unserer Formulare vor missbräuchlicher automatisierter Nutzung setzen wir
          Turnstile der Cloudflare, Inc. ein. Dabei werden technische Informationen Ihres Browsers
          sowie Ihre IP-Adresse an Cloudflare übermittelt und dort ausgewertet, um zu erkennen, ob
          die Anfrage von einem Menschen stammt. Turnstile verwendet keine Cookies zur
          Wiedererkennung und erstellt kein Nutzerprofil zu Werbezwecken.
        </p>
        <p>
          Rechtsgrundlage ist unser berechtigtes Interesse an der Abwehr von Spam und
          missbräuchlichen Zugriffen (Art. 6 Abs. 1 lit. f DSGVO). Cloudflare kann Daten auch in
          Drittstaaten verarbeiten; die Übermittlung wird auf Standardvertragsklauseln gestützt.
          Weitere Informationen:{" "}
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
            cloudflare.com/privacypolicy
          </a>
          .
        </p>

        <h2>5. Kartendarstellung (Google Maps)</h2>
        <p>
          Auf der Kontaktseite binden wir eine Karte von Google Maps ein, einem Dienst der Google
          Ireland Limited. Beim Laden der Karte wird Ihre IP-Adresse an Google übertragen; die
          Verarbeitung kann auch auf Servern in den USA erfolgen. Rechtsgrundlage ist unser
          berechtigtes Interesse an einer leichten Auffindbarkeit unseres Standorts (Art. 6 Abs. 1
          lit. f DSGVO). Weitere Informationen finden Sie in der{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datenschutzerklärung von Google
          </a>
          .
        </p>

        <h2>6. Webanalyse (Google Analytics)</h2>
        <p>
          Mit Ihrer Einwilligung setzen wir Google Analytics ein, einen Webanalysedienst der
          Google Ireland Limited. Dabei werden Nutzungsdaten (u. a. aufgerufene Seiten, ungefährer
          Standort, Geräte- und Browserinformationen) erhoben und auf Servern von Google,
          gegebenenfalls auch in den USA, verarbeitet, um die Nutzung dieser Website statistisch
          auszuwerten.
        </p>
        <p>
          Google Analytics wird erst geladen, nachdem Sie im Cookie-Banner ausdrücklich zugestimmt
          haben. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie
          jederzeit mit Wirkung für die Zukunft widerrufen können, indem Sie die
          Website-Daten Ihres Browsers für diese Seite löschen (der Banner erscheint dann erneut)
          oder uns formlos kontaktieren. Weitere Informationen finden Sie in der{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datenschutzerklärung von Google
          </a>
          .
        </p>

        <h2>7. Cookies</h2>
        <p>
          Diese Website setzt <strong>keine Tracking- oder Marketing-Cookies</strong> ohne Ihre
          Zustimmung. Ein technisch notwendiges Cookie wird im internen Verwaltungsbereich
          gesetzt, wenn sich ein Mitarbeiter dort anmeldet; Ihre Entscheidung zum Cookie-Banner
          wird im lokalen Speicher Ihres Browsers (nicht als Cookie) hinterlegt. Stimmen Sie der
          Webanalyse zu, setzt Google Analytics zusätzlich eigene Cookies zur
          Wiedererkennung Ihres Browsers (siehe Punkt 6).
        </p>

        <h2>8. Schriftarten</h2>
        <p>
          Die verwendeten Schriftarten werden lokal von unserem Server ausgeliefert. Beim
          Seitenaufruf wird dadurch keine Verbindung zu Servern Dritter hergestellt und es werden
          keine Daten an Schriftanbieter übermittelt.
        </p>

        <h2>9. Empfänger und Auftragsverarbeiter</h2>
        <p>
          Eine Weitergabe Ihrer Daten an Dritte erfolgt nur, soweit dies zur Bearbeitung Ihrer
          Anfrage erforderlich ist oder wir gesetzlich dazu verpflichtet sind. Auftragsverarbeiter
          — insbesondere unser Hosting- und E-Mail-Anbieter — sind vertraglich nach Art. 28 DSGVO
          gebunden. Ein Verkauf Ihrer Daten findet nicht statt.
        </p>

        <h2>10. Ihre Rechte</h2>
        <p>Ihnen stehen gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten zu:</p>
        <ul>
          <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
          <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
          <li>Recht auf Löschung (Art. 17 DSGVO)</li>
          <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          <li>Recht auf Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
        </ul>
        <p>
          Zur Ausübung Ihrer Rechte genügt eine formlose Nachricht an{" "}
          <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
        </p>

        <h2>11. Beschwerderecht</h2>
        <p>
          Sind Sie der Ansicht, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht
          verstößt, können Sie sich bei der Aufsichtsbehörde beschweren:
        </p>
        <div className={styles.contactCard}>
          <p>
            <strong>Österreichische Datenschutzbehörde</strong>
          </p>
          <p>Barichgasse 40–42, 1030 Wien</p>
          <p>
            <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer">
              www.dsb.gv.at
            </a>
          </p>
        </div>

        <h2>12. Keine automatisierte Entscheidungsfindung</h2>
        <p>
          Eine automatisierte Entscheidungsfindung einschließlich Profiling im Sinne des Art. 22
          DSGVO findet nicht statt.
        </p>

        <h2>13. Änderungen dieser Datenschutzerklärung</h2>
        <p>
          Wir passen diese Datenschutzerklärung an, sobald sich die Verarbeitung oder die
          rechtlichen Rahmenbedingungen ändern. Es gilt jeweils die auf dieser Seite
          veröffentlichte Fassung.
        </p>
      </div>
    </section>
  );
}
