import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Fragment } from "react";
import BeforeAfter from "@/components/BeforeAfter";
import BenefitIcon from "@/components/BenefitIcon";
import ConsultLeadForm from "@/components/ConsultLeadForm";
import Corners from "@/components/Corners";
import Faq from "@/components/Faq";
import HeroFull from "@/components/HeroFull";
import HeroSplit from "@/components/HeroSplit";
import JsonLd from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import MutedLoopVideo from "@/components/MutedLoopVideo";
import PartnerCarousel from "@/components/PartnerCarousel";
import ProcessRibbon from "@/components/ProcessRibbon";
import SeriesCard from "@/components/SeriesCard";
import { benefits, consultation, praxisMontage, processSteps } from "@/content/home";
import { site } from "@/content/site";
import { pageAlternates } from "@/lib/seo";
import { faqNode } from "@/lib/schema";
import { getVisibleSeries } from "@/lib/products";
import styles from "./home.module.css";

// Reads live category data; rendered per request so admin edits show immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: pageAlternates("/", locale) };
}

type Row = { without: string; with: string };
type Quote = { body: string; meta: string };
type FaqItem = { q: string; a: string };

/**
 * Block order is fixed. Backgrounds alone carry the colour journey: each light
 * band lands one rung deeper than the previous light band (s0 → s1 → s2 → s3),
 * and each inverted field is one rung deeper than the previous inverted field
 * (s4 → s5), with the footer on s6 as the darkest stop.
 */
export default async function HomePage() {
  const [series, t] = await Promise.all([getVisibleSeries(), getTranslations("home")]);
  const compareRows = t.raw("compare.rows") as Row[];
  const protectionRows = t.raw("compare.protectionRows") as Row[];
  const quotes = t.raw("reviews.quotes") as Quote[];
  const faqItems = t.raw("faq.items") as FaqItem[];

  return (
    <div className="journey">
      {/* The same Q&A the <Faq> accordion renders below — rich results
          require the answer text to be visible on the page, which it is. */}
      <JsonLd data={faqNode(faqItems)} />
      {site.heroVariant === "split" ? <HeroSplit /> : <HeroFull />}

      {site.heroVariant === "vollbild" ? (
        <section className={`section--1 ${styles.partnersBand}`}>
          <div className="container">
            <PartnerCarousel />
          </div>
        </section>
      ) : null}

      {/* ── Was die Folie leistet ─────────────────────────────────────────── */}
      <section className={`section--1 ${styles.band}`}>
        <div className="container">
          <h2 className={styles.benefitsTitle}>
            {t("benefits.titleLine1")} <span className="accent-word">{t("benefits.titleAccent")}</span>
          </h2>
          <div className={styles.benefitGrid}>
            {benefits.map((b) => (
              <div key={b.key} className={`card blueprint ${styles.benefitCard}`}>
                <Corners />
                <BenefitIcon name={b.icon} />
                <div className="card-title" style={{ fontSize: 20 }}>
                  {t(`benefits.items.${b.key}.title`)}
                </div>
                <p className="card-body" style={{ fontSize: 14 }}>
                  {t(`benefits.items.${b.key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vorher / Nachher ──────────────────────────────────────────────── */}
      <section className={`section--1 ${styles.compare}`}>
        <div className="container">
          <div className={styles.compareGrid}>
            <BeforeAfter
              before={{
                src: "/media/before.jpg",
                alt: t("compare.img1WithoutAlt"),
                label: t("compare.withoutLabel"),
                value: t("compare.img1WithoutValue"),
              }}
              after={{
                src: "/media/after.jpg",
                alt: t("compare.img1AfterAlt"),
                label: t("compare.withLabel"),
                value: t("compare.img1AfterValue"),
              }}
            />

            <div>
              <h2 className={styles.compareTitle}>{t("compare.title")}</h2>

              <div className={styles.compareStats}>
                <div className={styles.compareStat}>
                  <div className={styles.compareStatValue}>{t("compare.surfaceValue")}</div>
                  <div className={styles.compareStatLabel}>{t("compare.surfaceLabel")}</div>
                </div>
                <div className={styles.compareStat}>
                  <div className={styles.compareStatValue}>{t("compare.uvValue")}</div>
                  <div className={styles.compareStatLabel}>{t("compare.uvLabel")}</div>
                </div>
              </div>

              <div className={styles.compareTable}>
                <div className={styles.compareHeadWarm}>{t("compare.withoutLabel")}</div>
                <div className={styles.compareHeadCool}>{t("compare.withLabel")}</div>
                {compareRows.map((row) => (
                  <Fragment key={row.without}>
                    <div className={styles.compareCellWithout}>{row.without}</div>
                    <div className={styles.compareCellWith}>{row.with}</div>
                  </Fragment>
                ))}
              </div>

              <Link href="/funktionsprinzip" className={`btn ${styles.compareCta}`}>
                {t("compare.cta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Impact / safety-film comparison (mirrored) ─────────────────────── */}
      <section className={`section--1 ${styles.compare}`}>
        <div className="container">
          <div className={`${styles.compareGrid} ${styles.compareGridFlip}`}>
            <div>
              <h2 className={styles.compareTitle}>{t("compare.titleProtect")}</h2>

              <div className={styles.compareTable}>
                <div className={styles.compareHeadWarm}>{t("compare.withoutLabel")}</div>
                <div className={styles.compareHeadCool}>{t("compare.withLabel")}</div>
                {protectionRows.map((row) => (
                  <Fragment key={row.without}>
                    <div className={styles.compareCellWithout}>{row.without}</div>
                    <div className={styles.compareCellWith}>{row.with}</div>
                  </Fragment>
                ))}
              </div>

              <Link
                href="/funktionsprinzip"
                className={`btn ${styles.compareCta} ${styles.compareCtaEnd}`}
              >
                {t("compare.cta")}
              </Link>
            </div>

            <BeforeAfter
              aspectRatio="4 / 3"
              className={styles.compareProtectRail}
              before={{
                src: "/media/broken-default.png",
                alt: t("compare.img2WithoutAlt"),
                label: t("compare.withoutLabel"),
                objectPosition: "center center",
              }}
              after={{
                src: "/media/broken-armed.png",
                alt: t("compare.img2AfterAlt"),
                label: t("compare.withLabel"),
                objectPosition: "center 42%",
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Ablauf ────────────────────────────────────────────────────────── */}
      <section className={`section--1 ${styles.band} ${styles.processBand}`}>
        <div className="container">
          <ProcessRibbon
            steps={processSteps.map((s) => ({
              title: t(`process.steps.${s.key}.title`),
              body: t(`process.steps.${s.key}.body`),
              video: s.video,
              poster: s.poster,
              startAt: s.startAt,
              clipLength: s.clipLength,
            }))}
            title={t("process.title")}
          />
        </div>
      </section>

      {/* ── Vor Ort / Montage ────────────────────────────────────────────── */}
      <section className={`section--4 ${styles.praxis}`}>
        <div className={styles.praxisMedia}>
          <MutedLoopVideo
            src={praxisMontage.video.src}
            poster={praxisMontage.video.poster}
            title={t("praxis.videoTitle")}
            className={styles.praxisVideo}
            alwaysAutoplay
          />
        </div>
        <div className={styles.praxisCopy}>
          <h2 className={styles.praxisTitle}>{t("praxis.title")}</h2>
          <p className={styles.praxisBody}>{t("praxis.body")}</p>
          <Link href={praxisMontage.cta.href} className="btn btn-inverse">
            {t("praxis.cta")}
          </Link>
        </div>
      </section>

      {/* ── Serien ────────────────────────────────────────────────────────── */}
      <section className={`section--1 ${styles.band}`}>
        <div className="container">
          <div className={styles.seriesHead}>
            <h2 className="section-title">{t("series.title")}</h2>
          </div>
          <div className={styles.seriesList}>
            {series.map((item) => (
              <SeriesCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Beratungstermin ──────────────────────────────────────────────── */}
      <section className={`section--5 ${styles.consult}`}>
        <div className={styles.consultCopy}>
          <h3 className={styles.consultTitle}>
            {t("consultation.titleLine1")}
            <br />
            {t("consultation.titleLine2")}
          </h3>
          <p className={styles.consultBody}>{t("consultation.body")}</p>
          <div className={styles.consultSpecs}>
            {consultation.specKeys.map((key) => (
              <div key={key} className={styles.consultSpec}>
                <span className={styles.consultSpecLabel}>{t(`consultation.specs.${key}.label`)}</span>
                <span className={styles.consultSpecValue}>{t(`consultation.specs.${key}.value`)}</span>
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
            alt={t("consultation.imageAlt")}
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            className={styles.consultImage}
          />
        </div>
      </section>

      {/* ── Rezensionen ──────────────────────────────────────────────────── */}
      <section id="bewertungen" className={`section--1 ${styles.band}`}>
        <div className="container">
          <h2 className={styles.reviewsTitle}>
            {t("reviews.titleLine1")} <span className="accent-word">{t("reviews.titleAccent")}</span>
          </h2>
          <div className={styles.reviewsGrid}>
            {quotes.map((q) => (
              <figure key={q.meta + q.body} className={`card blueprint ${styles.quoteCard}`}>
                <Corners />
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
      <section className={`section--1 ${styles.band}`}>
        <div className="container">
          <div className={styles.faqGrid}>
            <div>
              <h2 className={styles.faqTitle}>
                {t("faq.titleLine1")}
                <br />
                <span className="accent-word">{t("faq.titleAccent")}</span>
              </h2>
              <Link href="/kontakt" className="btn btn-secondary" style={{ marginTop: 12 }}>
                {t("faq.askButton")}
              </Link>
            </div>
            <Faq items={faqItems} />
          </div>
        </div>
      </section>
    </div>
  );
}
