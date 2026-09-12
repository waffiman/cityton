import type { Metadata } from "next";
import Image from "next/image";
import Corners from "@/components/Corners";
import PartnerIcon from "@/components/PartnerIcon";
import PartnerInquiryForm from "@/components/PartnerInquiryForm";
import {
  audiences,
  benefits,
  contributions,
  models,
  processSteps,
  references,
  services,
  solutions,
} from "@/content/partner";
import { site } from "@/content/site";
import { pageAlternates } from "@/lib/seo";
import styles from "./partner.module.css";

export const metadata: Metadata = {
  title: { absolute: "B2B Partnerschaft | City-Ton Austria" },
  description:
    "B2B-Partnerschaft mit City-Ton Austria: Sie stellen den Kontakt her, wir übernehmen Beratung, Produktauswahl, Montage und Garantie – mit attraktiver Partnervergütung.",
  alternates: pageAlternates("/partner", "de", { hasEnglish: false }),
};

const audienceCopy: Record<string, { title: string; body: string }> = {
  makler: {
    title: "Immobilienmakler",
    body: "Zusätzlicher Service für Käufer, Eigentümer und Mieter von Immobilien.",
  },
  facility: {
    title: "Hausverwaltungen & Facility Management",
    body: "Lösungen für Wohngebäude, Büroflächen und gewerbliche Objekte.",
  },
  glaserei: {
    title: "Glasereien & Fensterbauer",
    body: "Ergänzung des bestehenden Portfolios ohne Aufbau eines eigenen Bereichs für Fensterfolien.",
  },
  architekt: {
    title: "Architekten & Planer",
    body: "Technische Lösungen für bestehende Verglasungen und individuelle Projektanforderungen.",
  },
  interior: {
    title: "Innenausbau & Interior Design",
    body: "Sonnenschutz, UV-Schutz und Privatsphäre für hochwertige Innenräume und große Glasflächen.",
  },
  gebaeudetechnik: {
    title: "Sonnenschutz- und Gebäudetechnik-Unternehmen",
    body: "Eine zusätzliche Lösung dort, wo Fensterfolien technisch oder wirtschaftlich eine sinnvolle Alternative darstellen.",
  },
  bautraeger: {
    title: "Bauträger / Immobilienentwickler",
    body: "Professionelle Folienlösungen für Bestand und neue Objekte – ohne eigenen Folienbereich.",
  },
};

const solutionCopy: Record<string, { title: string; body: string }> = {
  sonne: {
    title: "Sonnenschutz",
    body: "Reduzierung des solaren Wärmeeintrags und störender Blendung.",
  },
  uv: {
    title: "UV-Schutz",
    body: "Schutz von Möbeln, Böden, Textilien, Waren und Innenräumen vor UV-bedingten Einflüssen.",
  },
  sicht: {
    title: "Sichtschutz & Privatsphäre",
    body: "Folienlösungen für Büros, Ordinationen, Wohnräume und gewerbliche Flächen.",
  },
  sicherheit: {
    title: "Sicherheits- & Splitterschutz",
    body: "Folienlösungen zur Reduzierung des Verletzungsrisikos bei Glasbruch und zur Erhöhung des Widerstands bestehender Verglasungen.",
  },
};

const processCopy: Record<string, { title: string; body: string }> = {
  anfrage: {
    title: "Anfrage / Empfehlung",
    body: "Der Partner stellt den Kontakt zu einem interessierten Kunden her.",
  },
  beratung: {
    title: "Beratung & Analyse",
    body: "Wir klären Anforderungen und prüfen die vorhandene Verglasung.",
  },
  kalkulation: {
    title: "Produktauswahl & Kalkulation",
    body: "Wir wählen eine technisch geeignete Folienlösung und erstellen das Angebot.",
  },
  montage: {
    title: "Fachgerechte Montage",
    body: "Unsere Montage erfolgt direkt beim Kunden vor Ort.",
  },
  betreuung: {
    title: "Betreuung & Garantie",
    body: "City-Ton bleibt Ansprechpartner für die ausgeführte Folienlösung.",
  },
  verguetung: {
    title: "Partnervergütung",
    body: "Bei erfolgreich realisierten Projekten erhält der B2B-Partner die vereinbarte Partnervergütung.",
  },
};

const serviceCopy: Record<string, { title: string; body: string }> = {
  beratung: {
    title: "Technische Beratung",
    body: "Analyse der Anforderungen und der vorhandenen Verglasung.",
  },
  auswahl: {
    title: "Auswahl der passenden Folie",
    body: "Auswahl nach Glasaufbau, Einsatzbereich und gewünschter Funktion.",
  },
  aufmass: {
    title: "Aufmaß & Kalkulation",
    body: "Projektbezogene Berechnung und Angebotserstellung.",
  },
  material: {
    title: "Material",
    body: "Bereitstellung professioneller Architekturfolien.",
  },
  montage: {
    title: "Fachgerechte Montage",
    body: "Professionelle Installation direkt am Objekt.",
  },
  garantie: {
    title: "Garantie & Betreuung",
    body: "Klare Zuständigkeit auch nach Projektabschluss.",
  },
};

const contributionCopy: Record<(typeof contributions)[number], string> = {
  bedarf: "Bedarf bei Kunden oder Projekten mit großen Glasflächen erkennen",
  kontakt: "Den Kontakt oder die Anfrage an City-Ton weiterleiten",
  aufwand: "Keine technische Prüfung, kein Aufmaß und keine Montage auf Ihrer Seite",
  begleitung: "Den Kunden bei Bedarf im eigenen Projekt begleiten",
};

const benefitCopy: Record<(typeof benefits)[number], string> = {
  mehrwert: "Zusätzlicher Mehrwert für Ihre Kunden",
  ansprechpartner: "Professioneller Ansprechpartner für Fensterfolien",
  aufwand: "Keine eigene technische Abwicklung erforderlich",
  montage: "Beratung und Montage durch City-Ton Austria",
  verguetung: "Partnervergütung bei erfolgreich realisierten Projekten",
  langfristig: "Möglichkeit einer langfristigen Zusammenarbeit",
};

const modelCopy: Record<string, { title: string; body: string }> = {
  empfehlung: {
    title: "Empfehlungsmodell",
    body: "Sie empfehlen City-Ton Ihrem Kunden. Wir übernehmen anschließend Beratung, Angebot und Umsetzung. Bei erfolgreichem Projektabschluss erhalten Sie die vereinbarte Partnervergütung.",
  },
  projekt: {
    title: "Projektpartnerschaft / Subunternehmer",
    body: "Bei Bedarf können wir unsere Leistungen auch im Rahmen Ihrer Projekte übernehmen – von der technischen Auswahl bis zur Montage vor Ort.",
  },
};

function AudienceCard({ item, duplicate }: { item: (typeof audiences)[number]; duplicate?: boolean }) {
  const copy = audienceCopy[item.key];
  return (
    <article className={`blueprint ${styles.audienceCard}`} aria-hidden={duplicate || undefined}>
      <PartnerIcon name={item.icon} />
      <h3 className={styles.audienceTitle}>{copy.title}</h3>
      <p className={styles.audienceBody}>{copy.body}</p>
    </article>
  );
}

export default function PartnerPage() {
  return (
    <>
      {/* ── 01 Hero ──────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <Image
          src="/media/Architect-1.jpg"
          alt="Architekt bei der Planung an einem Fensterprojekt"
          fill
          priority
          sizes="100vw"
          className={styles.photo}
          style={{ objectFit: "cover", objectPosition: "center 42%" }}
        />
        <div className={styles.scrim} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <div className={styles.heroEyebrow}>
              <span className={styles.heroTick} />
              B2B-Partnerschaft
            </div>
            <h1 className={styles.heroTitle}>
              Gemeinsam mehr bieten – B2B-Partnerschaft mit City-Ton Austria
            </h1>
            <p className={styles.heroSubtitle}>
              Sie haben Kunden oder Projekte mit großen Fenster- und Glasflächen? Wir
              übernehmen die professionelle Folienlösung – von der technischen Beratung
              und Produktauswahl bis zur fachgerechten Montage.
            </p>
            <p className={`blueprint on-dark ${styles.heroPlate}`}>
              Für erfolgreich vermittelte Projekte bieten wir unseren B2B-Partnern eine
              attraktive Partnervergütung.
            </p>
            <div className={styles.heroActions}>
              <a href="#partner-anfrage" className="btn btn-primary btn-lg">
                B2B-Partnerschaft anfragen
              </a>
              <a href={`tel:${site.contact.phoneTel}`} className="btn btn-inverse btn-lg">
                Persönliches Gespräch vereinbaren
              </a>
            </div>
          </div>
        </div>
        <div id="hero-zone-end" className={styles.heroEnd} aria-hidden="true" />
      </section>

      {/* ── 02 Für wen ───────────────────────────────────────────────────── */}
      <section className={`section--1 ${styles.audienceBand}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Für wen ist eine Zusammenarbeit interessant?</h2>
          </div>
        </div>
        <div className={styles.audienceViewport}>
          <div className={styles.audienceTrack}>
            <div className={styles.audienceSet}>
              {audiences.map((item) => (
                <AudienceCard key={item.key} item={item} />
              ))}
            </div>
            <div className={styles.audienceSet} aria-hidden="true">
              {audiences.map((item) => (
                <AudienceCard key={`${item.key}-dup`} item={item} duplicate />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 Lösungen ──────────────────────────────────────────────────── */}
      <section className={`section--1 ${styles.band}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Professionelle Lösungen für bestehende Verglasungen</h2>
          </div>
          <div className={styles.solutionGrid}>
            {solutions.map((item) => {
              const copy = solutionCopy[item.key];
              return (
                <article key={item.key} className={`card blueprint ${styles.solutionCard}`}>
                  <Corners />
                  <PartnerIcon name={item.icon} />
                  <div className="card-title">{copy.title}</div>
                  <p className="card-body">{copy.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 04 Ablauf ────────────────────────────────────────────────────── */}
      <section className={`section--5 on-dark ${styles.processBand}`}>
        <div className="container">
          <h2 className={styles.processTitle}>
            Sie stellen den Kontakt her – wir kümmern uns um die Umsetzung.
          </h2>
          <ol className={styles.processList}>
            {processSteps.map((step) => {
              const copy = processCopy[step.key];
              return (
                <li key={step.key} className={styles.processStep}>
                  <div className={styles.processStepMedia} aria-hidden="true">
                    <Image
                      src={step.img}
                      alt=""
                      fill
                      sizes="50vw"
                      className={styles.processStepPhoto}
                    />
                  </div>
                  <div className={styles.processStepInner}>
                    <div className={styles.processNum}>{step.num}</div>
                    <h3 className={styles.processStepTitle}>{copy.title}</h3>
                    <p className={styles.processStepBody}>{copy.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── 05 Kompletter Service ────────────────────────────────────────── */}
      <section className={`section--0 ${styles.band}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Kompletter Service aus einer Hand</h2>
          </div>
          <div className={styles.serviceGrid}>
            {services.map((item) => {
              const copy = serviceCopy[item.key];
              return (
                <article key={item.key} className={`card blueprint ${styles.serviceCard}`}>
                  <Corners />
                  <PartnerIcon name={item.icon} />
                  <div className="card-title">{copy.title}</div>
                  <p className="card-body">{copy.body}</p>
                </article>
              );
            })}
          </div>
          <div className={styles.highlight}>
            <p className={styles.highlightText}>
              Für Sie als Partner entsteht kein zusätzlicher technischer oder organisatorischer
              Aufwand – City-Ton übernimmt die komplette Projektabwicklung im Bereich Fensterfolien.
            </p>
          </div>
        </div>
      </section>

      {/* ── 06 Partnervergütung ──────────────────────────────────────────── */}
      <section className={`section--5 on-dark ${styles.band} ${styles.compBand}`}>
        <div className={styles.compMedia} aria-hidden="true">
          <Image
            src="/media/install-together.jpg"
            alt=""
            fill
            sizes="100vw"
            className={styles.compPhoto}
          />
        </div>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Partnerschaft, die sich für beide Seiten lohnt</h2>
            <p className={styles.sectionLead}>
              Für erfolgreich vermittelte und realisierte Projekte bieten wir unseren
              B2B-Partnern eine attraktive Partnervergütung.
            </p>
          </div>
          <div className={styles.compLayout}>
            <div className={styles.benefitPlate}>
              <p className={`eyebrow ${styles.benefitEyebrow}`}>Ihr Beitrag zur Zusammenarbeit:</p>
              <ul className={styles.benefitList}>
                {contributions.map((key) => (
                  <li key={key} className={styles.benefitItem}>
                    <svg
                      className={styles.benefitCheck}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                    <span>{contributionCopy[key]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.benefitPlate}>
              <p className={`eyebrow ${styles.benefitEyebrow}`}>Ihre Vorteile als Partner:</p>
              <ul className={styles.benefitList}>
                {benefits.map((key) => (
                  <li key={key} className={styles.benefitItem}>
                    <svg
                      className={styles.benefitCheck}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                    <span>{benefitCopy[key]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className={styles.compFootnote}>
            Die konkrete Vergütung kann je nach Projektumfang und Kooperationsmodell individuell
            vereinbart werden.
          </p>
        </div>
      </section>

      {/* ── 07 Kooperationsmodelle ───────────────────────────────────────── */}
      <section className={`section--2 ${styles.band}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Zwei Modelle der Zusammenarbeit</h2>
          </div>
          <div className={styles.modelGrid}>
            {models.map((model) => {
              const copy = modelCopy[model.key];
              return (
                <article
                  key={model.key}
                  className={`${styles.modelCard}${model.inverted ? ` ${styles.modelCardDark}` : ""}`}
                >
                  <p className={styles.modelRole}>{model.role}</p>
                  <h3 className={styles.modelTitle}>{copy.title}</h3>
                  <p className={styles.modelBody}>{copy.body}</p>
                </article>
              );
            })}
          </div>
          <p className={styles.modelNote}>
            Beide Modelle sind kombinierbar – je nach Projekt und Partnersegment wählen wir
            gemeinsam die passende Form der Zusammenarbeit.
          </p>
        </div>
      </section>

      {/* ── 08 Montage österreichweit ────────────────────────────────────── */}
      <section className={`section--3 ${styles.geoBand}`}>
        <div className="diagonal-fx" aria-hidden="true">
          <span className="diagonal-sheet" />
          <span className="diagonal-sheet" />
          <span className="diagonal-sheet" />
          <span className="diagonal-orb" />
        </div>
        <div className={`container ${styles.geoInner}`}>
          <h2 className={styles.geoTitle}>Montage österreichweit</h2>
          <p className={styles.geoBody}>
            City-Ton Austria betreut private und gewerbliche Projekte in ganz Österreich.
          </p>
        </div>
      </section>

      {/* ── 09 Realisierte Projekte ──────────────────────────────────────── */}
      <section className={`section--0 ${styles.band}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Bereits realisierte Projekte</h2>
          </div>
          <div className={styles.refGrid}>
            {references.map((item) => (
              <figure key={item.src} className={`blueprint ${styles.refItem}`}>
                <Corners />
                <div className={styles.refClip}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    className={styles.refImg}
                  />
                </div>
                <figcaption className={styles.refCaption}>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10 Final CTA ─────────────────────────────────────────────────── */}
      <section className={`section--5 on-dark ${styles.ctaBand}`}>
        <div className={styles.ctaFx} aria-hidden="true" />
        <div className={`container ${styles.ctaInner}`}>
          <h2 className={styles.ctaTitle}>Interesse an einer Zusammenarbeit?</h2>
          <p className={styles.ctaBody}>
            Sie möchten City-Ton als Partner für professionelle Fensterfolienlösungen
            kennenlernen?
          </p>
          <p className={styles.ctaBody}>
            Lassen Sie uns unverbindlich über mögliche Kooperationsmodelle sprechen.
          </p>
          <div className={styles.ctaActions}>
            <a href="#partner-anfrage" className="btn btn-primary btn-lg">
              B2B-Partnerschaft anfragen
            </a>
            <a href={`tel:${site.contact.phoneTel}`} className="btn btn-inverse btn-lg">
              Gespräch vereinbaren
            </a>
          </div>
          <div className={styles.ctaContact}>
            <div className={styles.ctaContactItem}>
              <span className={styles.ctaContactLabel}>Unternehmen</span>
              <span className={styles.ctaContactValue}>{site.name}</span>
            </div>
            <div className={styles.ctaContactItem}>
              <span className={styles.ctaContactLabel}>Ansprechpartner</span>
              <span className={styles.ctaContactValue}>Dobrovolskyi Oleksandr</span>
            </div>
            <div className={styles.ctaContactItem}>
              <span className={styles.ctaContactLabel}>Telefon</span>
              <a href={`tel:${site.contact.phoneTel}`} className={styles.ctaContactValue}>
                {site.contact.phone}
              </a>
            </div>
            <div className={styles.ctaContactItem}>
              <span className={styles.ctaContactLabel}>E-Mail</span>
              <a href={`mailto:${site.contact.email}`} className={styles.ctaContactValue}>
                {site.contact.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11 B2B-Anfrage ───────────────────────────────────────────────── */}
      <section id="partner-anfrage" className={`section--1 ${styles.formBand}`}>
        <div className={`container ${styles.formWrap}`}>
          <h2 className={styles.formTitle}>B2B-Partnerschaft anfragen</h2>
          <p className={styles.formLead}>
            Kurze Angaben genügen. Wir melden uns persönlich, um das passende
            Kooperationsmodell zu besprechen.
          </p>
          <PartnerInquiryForm />
        </div>
      </section>
    </>
  );
}
