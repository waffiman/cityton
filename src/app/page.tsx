import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import AutoplayVideo from "@/components/AutoplayVideo";
import BeforeAfter from "@/components/BeforeAfter";
import BenefitIcon from "@/components/BenefitIcon";
import Corners from "@/components/Corners";
import Faq from "@/components/Faq";
import HeroFull from "@/components/HeroFull";
import HeroSplit from "@/components/HeroSplit";
import SeriesCard from "@/components/SeriesCard";
import Stars from "@/components/Stars";
import { benefits, comparisonRows, consultation, faq, processSteps, reviews } from "@/content/home";
import { series } from "@/content/series";
import { site } from "@/content/site";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <>
      {site.heroVariant === "split" ? <HeroSplit /> : <HeroFull />}

      {site.heroVariant === "vollbild" && (
        <section className={styles.partnerBar}>
          <div className={`container ${styles.partnerInner}`}>
            <span className={styles.partnerLabel}>OFFIZIELLER PARTNER VON</span>
            <Image src="/media/logo-llumar.png" alt="LLumar" width={120} height={30} className={styles.logoLlumar} />
            <Image src="/media/logo-armolan.png" alt="Armolan Europe" width={160} height={44} className={styles.logoArmolan} />
          </div>
        </section>
      )}

      {/* ── Was die Folie leistet ─────────────────────────────────────────── */}
      <section className="container section-tight">
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
      </section>

      {/* ── Vorher / Nachher auf dem dunklen Feld ─────────────────────────── */}
      <section className={`on-dark ${styles.compare}`}>
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

      {/* ── Ablauf ────────────────────────────────────────────────────────── */}
      <section className="container section">
        <h2 className={styles.processTitle}>Von der Anfrage bis zur fertigen Folierung</h2>
        <ol className={styles.processGrid}>
          {processSteps.map((step) => (
            <li key={step.title}>
              <figure className={`blueprint ${styles.processFigure}`}>
                <Corners />
                <AutoplayVideo
                  src={step.video}
                  poster={step.poster}
                  startAt={step.startAt}
                  clipLength={step.clipLength}
                  className={styles.processVideo}
                />
              </figure>
              <div className={styles.processCopy}>
                <div className={styles.processStepTitle}>{step.title}</div>
                <p className={styles.processStepBody}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Serien ────────────────────────────────────────────────────────── */}
      <section className="container section">
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
      </section>

      {/* ── Beratungstermin ──────────────────────────────────────────────── */}
      <section className={styles.consult}>
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
            <Link href="/kontakt" className="btn btn-primary btn-lg blueprint">
              <Corners />
              {site.cta}
            </Link>
            <span className={styles.consultPhone}>
              oder anrufen: <span className={styles.placeholder}>{site.contact.phone}</span>
            </span>
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

      {/* ── Rezensionen ──────────────────────────────────────────────────── */}
      <section className="container section">
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
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="container section">
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
      </section>
    </>
  );
}
