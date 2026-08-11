import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import BeforeAfter from "@/components/BeforeAfter";
import BenefitIcon from "@/components/BenefitIcon";
import ConsultLeadForm from "@/components/ConsultLeadForm";
import Corners from "@/components/Corners";
import Faq from "@/components/Faq";
import HeroFull from "@/components/HeroFull";
import HeroSplit from "@/components/HeroSplit";
import ProcessMosaic from "@/components/ProcessMosaic";
import SeriesCard from "@/components/SeriesCard";
import Stars from "@/components/Stars";
import { benefits, comparisonRows, consultation, faq, processSteps, protectionRows, reviews } from "@/content/home";
import { series } from "@/content/series";
import { site } from "@/content/site";
import styles from "./home.module.css";

/**
 * Block order is fixed. Backgrounds alone carry the colour journey: each light
 * band lands one rung deeper than the previous light band (s0 → s1 → s2 → s3),
 * and each inverted field is one rung deeper than the previous inverted field
 * (s4 → s5), with the footer on s6 as the darkest stop.
 */
export default function HomePage() {
  return (
    <div className="journey">
      {site.heroVariant === "split" ? <HeroSplit /> : <HeroFull />}

      <div className="ramp ramp--5to0" />

      {site.heroVariant === "vollbild" && (
        <section className="section--0">
          <div className={`container ${styles.partnerInner}`}>
            <span className={styles.partnerLabel}>OFFIZIELLER PARTNER VON</span>
            <a
              href="https://llumar.com/en/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.partnerLogoLink}
              aria-label="LLumar — Website in neuem Tab öffnen"
            >
              <Image src="/media/logo-llumar.png" alt="LLumar" width={120} height={30} className={styles.logoLlumar} />
            </a>
            <a
              href="https://armolan.de/en/home"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.partnerLogoLink}
              aria-label="Armolan Europe — Website in neuem Tab öffnen"
            >
              <Image src="/media/logo-armolan.png" alt="Armolan Europe" width={160} height={44} className={styles.logoArmolan} />
            </a>
          </div>
        </section>
      )}

      {/* ── Was die Folie leistet ─────────────────────────────────────────── */}
      <section className={`section--0 ${styles.band}`}>
        <div className="container">
          <h2 className={styles.benefitsTitle}>
            Vier Mikrometer Folie. <span className="accent-word">Ein anderes Gebäude.</span>
          </h2>
          <div className={styles.benefitGrid}>
            {benefits.map((b) => (
              <div key={b.title} className={`card blueprint ${styles.benefitCard}`}>
                <Corners />
                <BenefitIcon name={b.icon} />
                <div className="card-title" style={{ fontSize: 20 }}>
                  {b.title}
                </div>
                <p className="card-body" style={{ fontSize: 14 }}>
                  {b.body}
                </p>
                <div className={`card-meta ${styles.benefitMeta}`}>{b.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ramp ramp--0to4" />

      {/* ── Vorher / Nachher ──────────────────────────────────────────────── */}
      <section className={`on-dark section--4 ${styles.compare}`}>
        <div className="container">
          <div className={styles.compareGrid}>
            <BeforeAfter
              before={{ src: "/media/before.jpg", alt: "Ohne Folie", label: "OHNE FOLIE", value: "33,3 °C" }}
              after={{ src: "/media/after.jpg", alt: "Mit Sonnenschutzfolie", label: "MIT FOLIE", value: "25,7 °C" }}
            />

            <div>
              <h2 className={styles.compareTitle}>Der Unterschied ist messbar</h2>

              <div className={styles.compareStats}>
                <div className={styles.compareStat}>
                  <div className={styles.compareStatValue}>−7,6 °C</div>
                  <div className={styles.compareStatLabel}>OBERFLÄCHE</div>
                </div>
                <div className={styles.compareStat}>
                  <div className={styles.compareStatValue}>99 %</div>
                  <div className={styles.compareStatLabel}>UV GEFILTERT</div>
                </div>
              </div>

              <div className={styles.compareTable}>
                <div className={styles.compareHeadWarm}>OHNE FOLIE</div>
                <div className={styles.compareHeadCool}>MIT FOLIE</div>
                {comparisonRows.map(([without, withFilm]) => (
                  <Fragment key={without}>
                    <div className={styles.compareCellWithout}>{without}</div>
                    <div className={styles.compareCellWith}>{withFilm}</div>
                  </Fragment>
                ))}
              </div>

              <Link href="/funktionsprinzip" className={`btn btn-inverse ${styles.compareCta}`}>
                Funktionsprinzip ansehen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Impact / safety-film comparison (mirrored) ─────────────────────── */}
      <section className={`on-dark section--4 ${styles.compare}`}>
        <div className="container">
          <div className={`${styles.compareGrid} ${styles.compareGridFlip}`}>
            <div>
              <h2 className={styles.compareTitle}>Der Unterschied liegt im Schutz</h2>

              <div className={styles.compareTable}>
                <div className={styles.compareHeadWarm}>OHNE FOLIE</div>
                <div className={styles.compareHeadCool}>MIT FOLIE</div>
                {protectionRows.map(([without, withFilm]) => (
                  <Fragment key={without}>
                    <div className={styles.compareCellWithout}>{without}</div>
                    <div className={styles.compareCellWith}>{withFilm}</div>
                  </Fragment>
                ))}
              </div>

              <Link href="/funktionsprinzip" className={`btn btn-inverse ${styles.compareCta} ${styles.compareCtaEnd}`}>
                Funktionsprinzip ansehen
              </Link>
            </div>

            <BeforeAfter
              aspectRatio="4 / 3"
              className={styles.compareProtectRail}
              before={{
                src: "/media/default-break.png",
                alt: "Glas zerbricht in scharfe Splitter → Splitter bleiben an der Folie haften",
                label: "OHNE FOLIE",
                objectPosition: "center center",
              }}
              after={{
                src: "/media/armed-break.png",
                alt: "Splitter können sich beim Aufprall verteilen → Splitter bleiben zusammen",
                label: "MIT FOLIE",
                objectPosition: "center 42%",
              }}
            />
          </div>
        </div>
      </section>

      <div className="ramp ramp--4to1" />

      {/* ── Ablauf ────────────────────────────────────────────────────────── */}
      <section className={`section--1 ${styles.band} ${styles.processBand}`}>
        <div className="container">
          <h2 className={styles.processTitle}>Von der Anfrage bis zur fertigen Folierung</h2>
          <ProcessMosaic steps={processSteps} />
        </div>
      </section>

      <div className="ramp ramp--1to2" />

      {/* ── Serien ────────────────────────────────────────────────────────── */}
      <section className={`section--2 ${styles.band}`}>
        <div className="container">
          <div className={styles.seriesHead}>
            <h2 className="section-title">Vier Serien, ein Ziel je Objekt</h2>
            <p className={styles.seriesIntro}>
              Welche Folie passt, entscheidet die Glasart und das Ziel — nicht der Katalog. Wir wählen
              die Serie im Aufmaß gemeinsam aus.
            </p>
          </div>
          <div className={styles.seriesList}>
            {series.map((item) => (
              <SeriesCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <div className="ramp ramp--2to5" />

      {/* ── Beratungstermin ──────────────────────────────────────────────── */}
      <section className={`section--5 ${styles.consult}`}>
        <div className={styles.consultCopy}>
          <div className={styles.consultEyebrow}>
            <span className={styles.consultTick} />
            {consultation.eyebrow.toUpperCase()}
          </div>
          <h3 className={styles.consultTitle}>
            {consultation.title[0]}
            <br />
            {consultation.title[1]}
          </h3>
          <p className={styles.consultBody}>{consultation.body}</p>
          <div className={styles.consultSpecs}>
            {consultation.specs.map((s) => (
              <div key={s.label} className={styles.consultSpec}>
                <span className={styles.consultSpecLabel}>{s.label}</span>
                <span className={styles.consultSpecValue}>{s.value}</span>
              </div>
            ))}
          </div>
          <div className={styles.consultActions}>
            <ConsultLeadForm />
          </div>
        </div>
        <div className={styles.consultMedia}>
          <Image
            src={consultation.image.src}
            alt={consultation.image.alt}
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            className={styles.consultImage}
          />
        </div>
      </section>

      <div className="ramp ramp--5to3" />

      {/* ── Rezensionen ──────────────────────────────────────────────────── */}
      <section className={`section--3 ${styles.band}`}>
        <div className="container">
          <h2 className={styles.reviewsTitle}>
            Werden Sie unser nächster <span className="accent-word">zufriedener Kunde.</span>
          </h2>
          <div className={styles.reviewsGrid}>
            <div className={`blueprint ${styles.ratingPlate}`}>
              <Corners />
              <div className={styles.ratingValue}>{reviews.rating}</div>
              <div className={styles.ratingStars}>
                <Stars size={18} />
              </div>
              <div className={styles.ratingMeta}>aus {reviews.count} Google-Rezensionen</div>
              {/* TODO(client): link to the real Google Business profile. */}
              <a href="#" className={styles.ratingLink}>
                Alle Rezensionen ansehen →
              </a>
            </div>
            <div className={styles.quoteGrid}>
              {reviews.quotes.map((q) => (
                <figure key={q.meta + q.body} className={`card blueprint ${styles.quoteCard}`}>
                  <Corners />
                  <Stars />
                  <blockquote className={`card-body ${styles.quoteBody}`}>{q.body}</blockquote>
                  <figcaption className="card-meta" style={{ fontSize: 12 }}>
                    {q.meta}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className={`section--3 ${styles.band}`}>
        <div className="container">
          <div className={styles.faqGrid}>
            <div>
              <h2 className={styles.faqTitle}>
                Fragen, die vor jedem
                <br />
                <span className="accent-word">Aufmaß gestellt werden.</span>
              </h2>
              <p className={styles.faqIntro}>
                Ihre Frage ist nicht dabei? Rufen Sie an — die Antwort dauert meist zwei Minuten.
              </p>
              <Link href="/kontakt" className="btn btn-secondary" style={{ marginTop: 12 }}>
                Frage stellen
              </Link>
            </div>
            <Faq items={faq} />
          </div>
        </div>
      </section>
    </div>
  );
}
