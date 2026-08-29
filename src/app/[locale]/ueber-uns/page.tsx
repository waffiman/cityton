import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Corners from "@/components/Corners";
import { Link } from "@/i18n/navigation";
import { about } from "@/content/about";
import { pageAlternates } from "@/lib/seo";
import styles from "./about.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: pageAlternates("/ueber-uns", locale),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  const teamImages = [
    { ...about.team.main, alt: t("team.mainAlt"), label: t("team.mainLabel") },
    { ...about.team.side[0], alt: t("team.side1Alt"), label: t("team.side1Label") },
    { ...about.team.side[1], alt: t("team.side2Alt"), label: t("team.side2Label") },
  ];
  const onsiteImages = [
    { ...about.onsite.images[0], alt: t("onsite.img1Alt") },
    { ...about.onsite.images[1], alt: t("onsite.img2Alt") },
    { ...about.onsite.images[2], alt: t("onsite.img3Alt") },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="container" style={{ paddingTop: 56 }}>
        <div className={styles.intro}>
          <div>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className="lead">{t("body")}</p>
          </div>
          <figure className={`blueprint ${styles.portrait}`}>
            <div className={styles.portraitClip}>
              <Image
                src={about.image.src}
                alt={t("imageAlt")}
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
                className={styles.portraitImg}
                priority
              />
            </div>
            <Corners />
          </figure>
        </div>
      </section>

      {/* ── Quote ────────────────────────────────────────────────────────── */}
      <section className="section">
        <blockquote className={`blueprint ${styles.quotePlate}`}>
          <Corners />
          <div className={styles.quoteInner}>
            <p className={styles.quote}>{t("quote")}</p>
            <footer className={styles.quoteMeta}>{t("quoteMeta").toUpperCase()}</footer>
          </div>
        </blockquote>
      </section>

      {/* ── Team mosaic ──────────────────────────────────────────────────── */}
      <section className={`container section ${styles.teamSection}`}>
        <div className={styles.teamLayout}>
          <div className={styles.teamCopy}>
            <h2 className={styles.sectionTitle}>{t("team.title")}</h2>
          </div>
          <div className={styles.teamMosaic}>
            {teamImages.map((img) => (
              <figure key={img.src} className={`blueprint ${styles.teamFig}`}>
                <Corners />
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 1000px) 30vw, 140px"
                  className={styles.mosaicImg}
                />
                <figcaption className={styles.mosaicLabel}>{img.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vor Ort ──────────────────────────────────────────────────────── */}
      <section className={`section--5 on-dark ${styles.onsiteBand}`}>
        <div className={`container ${styles.onsiteLayout}`}>
          <div className={styles.onsiteCopy}>
            <h2 className={styles.onsiteTitle}>{t("onsite.title")}</h2>
            <p className={styles.onsiteBody}>{t("onsite.body")}</p>
            <Link href={about.onsite.cta.href} className={`btn btn-inverse ${styles.sectionCta}`}>
              {t("onsite.cta")}
            </Link>
          </div>
          <div className={styles.onsiteGrid}>
            {onsiteImages.map((img) => (
              <figure key={img.src} className={`blueprint on-dark ${styles.onsiteFig}`}>
                <div className={styles.onsiteClip}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 22vw"
                    className={styles.mosaicImg}
                  />
                </div>
                <Corners />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── People + process ─────────────────────────────────────────────── */}
      <section className="container section">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{t("peopleSteps.title")}</h2>
          <p className={styles.sectionBody}>{t("peopleSteps.body")}</p>
        </div>
        <div className={styles.steps}>
          {about.peopleSteps.items.map((step) => (
            <article key={step.key} className={`blueprint ${styles.step}`}>
              <Corners />
              <div className={styles.stepMedia}>
                <Image
                  src={step.image.src}
                  alt={t(`peopleSteps.${step.key}.imageAlt`)}
                  fill
                  sizes="(max-width: 900px) 100vw, 30vw"
                  className={styles.mosaicImg}
                />
              </div>
              <div className={styles.stepCopy}>
                <div className={styles.stepNum}>{step.num}</div>
                <h3 className={styles.stepTitle}>{t(`peopleSteps.${step.key}.title`)}</h3>
                <p className={styles.stepBody}>{t(`peopleSteps.${step.key}.body`)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Partners ─────────────────────────────────────────────────────── */}
      <section className="container section">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{t("partnersTitle")}</h2>
        </div>
        <div className={styles.partnerGrid}>
          {about.partners.map((p) => (
            <div key={p.key} className={`card blueprint ${styles.partnerCard}`}>
              <Corners />
              <div className={styles.partnerLogoWrap}>
                <Image
                  src={p.logo.src}
                  alt={t(`partners.${p.key}.title`)}
                  width={p.logo.width}
                  height={p.logo.height}
                  className={styles.partnerLogo}
                />
              </div>
              <div className="card-kicker">{t(`partners.${p.key}.kicker`)}</div>
              <div className="card-title" style={{ fontSize: 20 }}>
                {t(`partners.${p.key}.title`)}
              </div>
              <p className="card-body" style={{ fontSize: 14 }}>
                {t(`partners.${p.key}.body`)}
              </p>
              <a href={p.href} style={{ fontSize: 13 }} target="_blank" rel="noreferrer">
                {t(`partners.${p.key}.link`)}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why us ───────────────────────────────────────────────────────── */}
      <section className="container section">
        <div className={`${styles.sectionHead} ${styles.whyHead}`}>
          <h2 className={styles.sectionTitle}>{t("why.title")}</h2>
        </div>
        <div className={styles.whyGrid}>
          {about.why.keys.map((key) => (
            <div key={key} className={`blueprint ${styles.whyCard}`}>
              <Corners />
              <h3 className={styles.whyTitle}>{t(`why.${key}.title`)}</h3>
              <p className={styles.whyBody}>{t(`why.${key}.body`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Compact rating ───────────────────────────────────────────────── */}
      <section className="container section">
        <div className={`blueprint ${styles.ratingBlock}`}>
          <Corners />
          <blockquote className={styles.ratingQuote}>„{t("rating.quote")}“</blockquote>
        </div>
      </section>

      <section className={`section--5 on-dark ${styles.ctaBand}`}>
        <div className={styles.ctaFx} aria-hidden="true" />
        <div className={`container ${styles.bandInner}`}>
          <h2 className={styles.ctaTitle}>{t("finalCta.title")}</h2>
          <p className={styles.ctaSubtitle}>{t("finalCta.subtitle")}</p>
          <p className={styles.ctaBody}>{t("finalCta.body")}</p>
          <Link href={about.finalCta.cta.href} className="btn btn-primary btn-lg">
            {t("finalCta.cta")}
          </Link>
        </div>
      </section>
    </>
  );
}
