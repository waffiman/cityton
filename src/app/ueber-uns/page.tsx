import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Corners from "@/components/Corners";
import Stars from "@/components/Stars";
import { about } from "@/content/about";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "Über uns",
  description: about.body.slice(0, 155),
};

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="container" style={{ paddingTop: 56 }}>
        <div className={styles.intro}>
          <div>
            <h6 className="eyebrow">{about.eyebrow}</h6>
            <h1 className={styles.title}>{about.title}</h1>
            <p className="lead">{about.body}</p>
          </div>
          <figure className={`${styles.portrait}`}>
            <Corners />
            <Image
              src={about.image.src}
              alt={about.image.alt}
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className={styles.portraitImg}
              priority
            />
          </figure>
        </div>
      </section>

      {/* ── Quote ────────────────────────────────────────────────────────── */}
      <section className="container section">
        <blockquote className={`blueprint ${styles.quotePlate}`}>
          <Corners />
          <p className={styles.quote}>{about.quote}</p>
          <footer className={styles.quoteMeta}>{about.quoteMeta.toUpperCase()}</footer>
        </blockquote>
      </section>

      {/* ── Team mosaic ──────────────────────────────────────────────────── */}
      <section className="container section">
        <div className={styles.sectionHead}>
          <h6 className="eyebrow">{about.team.eyebrow}</h6>
          <h2 className={styles.sectionTitle}>{about.team.title}</h2>
          <p className={styles.sectionBody}>{about.team.body}</p>
        </div>
        <div className={styles.teamMosaic}>
          <figure className={`blueprint ${styles.teamMain}`}>
            <Corners />
            <Image
              src={about.team.main.src}
              alt={about.team.main.alt}
              fill
              sizes="(max-width: 900px) 100vw, 60vw"
              className={styles.mosaicImg}
            />
            {about.team.main.label ? (
              <figcaption className={styles.mosaicLabel}>{about.team.main.label}</figcaption>
            ) : null}
          </figure>
          <div className={styles.teamSide}>
            {about.team.side.map((img) => (
              <figure key={img.src} className={`blueprint ${styles.teamSideFig}`}>
                <Corners />
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 900px) 50vw, 28vw"
                  className={styles.mosaicImg}
                />
                {img.label ? <figcaption className={styles.mosaicLabel}>{img.label}</figcaption> : null}
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vor Ort ──────────────────────────────────────────────────────── */}
      <section className="container section">
        <div className={styles.sectionHead}>
          <h6 className="eyebrow">{about.onsite.eyebrow}</h6>
          <h2 className={styles.sectionTitle}>{about.onsite.title}</h2>
          <p className={styles.sectionBody}>{about.onsite.body}</p>
        </div>
        <div className={styles.onsiteGrid}>
          {about.onsite.images.map((img) => (
            <figure key={img.src} className={`blueprint ${styles.onsiteFig}`}>
              <Corners />
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 700px) 100vw, 33vw"
                className={styles.mosaicImg}
              />
            </figure>
          ))}
        </div>
        <Link href={about.onsite.cta.href} className={`btn btn-secondary ${styles.sectionCta}`}>
          {about.onsite.cta.label}
        </Link>
      </section>

      {/* ── People + process ─────────────────────────────────────────────── */}
      <section className="container section">
        <div className={styles.sectionHead}>
          <h6 className="eyebrow">{about.peopleSteps.eyebrow}</h6>
          <h2 className={styles.sectionTitle}>{about.peopleSteps.title}</h2>
          <p className={styles.sectionBody}>{about.peopleSteps.body}</p>
        </div>
        <div className={styles.steps}>
          {about.peopleSteps.items.map((step) => (
            <article key={step.num} className={`blueprint ${styles.step}`}>
              <Corners />
              <div className={styles.stepMedia}>
                <Image
                  src={step.image.src}
                  alt={step.image.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 30vw"
                  className={styles.mosaicImg}
                />
              </div>
              <div className={styles.stepCopy}>
                <div className={styles.stepNum}>{step.num}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Partners ─────────────────────────────────────────────────────── */}
      <section className="container section">
        <div className={styles.sectionHead}>
          <h6 className="eyebrow">{about.partnersEyebrow}</h6>
          <h2 className={styles.sectionTitle}>{about.partnersTitle}</h2>
        </div>
        <div className={styles.partnerGrid}>
          {about.partners.map((p) => (
            <div
              key={p.title}
              className={`card blueprint ${styles.partnerCard} ${p.highlight ? styles.partnerHighlight : ""}`}
            >
              <Corners />
              {p.logo ? (
                <div className={styles.partnerLogoWrap}>
                  <Image
                    src={p.logo.src}
                    alt={p.logo.alt}
                    width={p.logo.width}
                    height={p.logo.height}
                    className={styles.partnerLogo}
                  />
                </div>
              ) : null}
              <div className="card-kicker">{p.kicker}</div>
              <div className="card-title" style={{ fontSize: 20 }}>
                {p.title}
              </div>
              <p className="card-body" style={{ fontSize: 14 }}>
                {p.body}
              </p>
              {p.link ? (
                <a href={p.link.href} style={{ fontSize: 13 }} target="_blank" rel="noreferrer">
                  {p.link.label}
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* ── Why us ───────────────────────────────────────────────────────── */}
      <section className="container section">
        <div className={styles.sectionHead}>
          <h6 className="eyebrow">{about.why.eyebrow}</h6>
          <h2 className={styles.sectionTitle}>{about.why.title}</h2>
        </div>
        <div className={styles.whyGrid}>
          {about.why.items.map((item) => (
            <div key={item.num} className={`blueprint ${styles.whyCard}`}>
              <Corners />
              <div className={styles.whyNum}>{item.num}</div>
              <h3 className={styles.whyTitle}>{item.title}</h3>
              <p className={styles.whyBody}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Compact rating ───────────────────────────────────────────────── */}
      <section className="container section">
        <div className={`blueprint ${styles.ratingBlock}`}>
          <Corners />
          <div>
            <h6 className="eyebrow">{about.rating.eyebrow}</h6>
            <div className={styles.ratingRow}>
              <div className={styles.ratingValue}>
                {about.rating.value}
                <span className={styles.ratingScale}> / {about.rating.scale}</span>
              </div>
              <Stars size={18} />
            </div>
            <div className={styles.ratingMeta}>aus {about.rating.count} Google-Rezensionen</div>
          </div>
          <blockquote className={styles.ratingQuote}>„{about.rating.quote}“</blockquote>
          <Link href={about.rating.cta.href} className={styles.ratingLink}>
            {about.rating.cta.label}
          </Link>
        </div>
      </section>

      <section className={`section--5 on-dark ${styles.ctaBand}`}>
        <div className={styles.ctaFx} aria-hidden="true" />
        <div className={`container ${styles.bandInner}`}>
          <h2 className={styles.ctaTitle}>{about.finalCta.title}</h2>
          <p className={styles.ctaSubtitle}>{about.finalCta.subtitle}</p>
          <p className={styles.ctaBody}>{about.finalCta.body}</p>
          <Link href={about.finalCta.cta.href} className="btn btn-primary btn-lg">
            {about.finalCta.cta.label}
          </Link>
        </div>
      </section>
    </>
  );
}
