import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Corners from "@/components/Corners";
import PartnerInquiryForm from "@/components/PartnerInquiryForm";
import {
  AudienceIcon,
  CheckIcon,
  ServiceIcon,
  SolutionIcon,
} from "@/components/PartnerIcons";
import {
  advantageKeys,
  audienceKeys,
  contributionKeys,
  heroImage,
  modelKeys,
  processKeys,
  refItems,
  serviceKeys,
  solutionKeys,
} from "@/content/partner";
import { site } from "@/content/site";
import { pageAlternates } from "@/lib/seo";
import styles from "./partner.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partner" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: pageAlternates("/partner", locale),
  };
}

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "partner" });

  const processTop = processKeys.slice(0, 3);
  const processBottom = processKeys.slice(3);

  return (
    <>
      <section className={styles.hero}>
        <Image
          src={heroImage.src}
          alt={t(`images.${heroImage.altKey}`)}
          fill
          priority
          sizes="100vw"
          className={styles.photo}
        />
        <div className={styles.scrim} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <div className={styles.heroEyebrow}>
              <span className={styles.heroTick} />
              {t("hero.eyebrow")}
            </div>
            <h1 className={styles.heroTitle}>{t("hero.title")}</h1>
            <p className={styles.heroSubtitle}>{t("hero.subtitle")}</p>
            <p className={`blueprint on-dark ${styles.heroPlate}`}>{t("hero.plate")}</p>
            <div className={styles.heroActions}>
              <a href="#partner-anfrage" className="btn btn-primary btn-lg">
                {t("hero.ctaPrimary")}
              </a>
              <a href={`tel:${site.contact.phoneTel}`} className="btn btn-inverse btn-lg">
                {t("hero.ctaSecondary")}
              </a>
            </div>
          </div>
        </div>
        <div id="hero-zone-end" className={styles.heroEnd} aria-hidden="true" />
      </section>

      <section className={`section--1 ${styles.audienceBand}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{t("audience.title")}</h2>
          </div>
        </div>
        <div className={styles.audienceViewport}>
          <div className={styles.audienceTrack}>
            {[false, true].map((dup) => (
              <div
                key={dup ? "dup" : "main"}
                className={styles.audienceSet}
                aria-hidden={dup || undefined}
              >
                {audienceKeys.map((key) => (
                  <article key={key} className={`blueprint ${styles.audienceCard}`}>
                    <AudienceIcon name={key} />
                    <h3 className={styles.audienceTitle}>{t(`audience.items.${key}.title`)}</h3>
                    <p className={styles.audienceBody}>{t(`audience.items.${key}.body`)}</p>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`section--1 ${styles.band}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{t("solutions.title")}</h2>
          </div>
          <div className={styles.solutionGrid}>
            {solutionKeys.map((key) => (
              <article key={key} className={`card blueprint ${styles.solutionCard}`}>
                <Corners />
                <SolutionIcon name={key} />
                <div className="card-title">{t(`solutions.items.${key}.title`)}</div>
                <p className="card-body">{t(`solutions.items.${key}.body`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section--5 on-dark ${styles.processBand}`}>
        <div className="container">
          <h2 className={styles.processTitle}>{t("process.title")}</h2>
          <div className={styles.processSnake}>
            <div className={`${styles.processRow} ${styles.processRowTop}`}>
              <div className={styles.processRail} aria-hidden="true" />
              <ol className={styles.processList}>
                {processTop.map((key, i) => (
                  <li key={key} className={styles.processStep}>
                    <div className={styles.processNum}>{String(i + 1).padStart(2, "0")}</div>
                    <h3 className={styles.processStepTitle}>{t(`process.steps.${key}.title`)}</h3>
                    <p className={styles.processStepBody}>{t(`process.steps.${key}.body`)}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className={styles.processRow}>
              <div className={styles.processRail} aria-hidden="true" />
              <ol className={`${styles.processList} ${styles.processListReturn}`}>
                {processBottom.map((key, i) => (
                  <li key={key} className={styles.processStep}>
                    <div className={styles.processNum}>{String(i + 4).padStart(2, "0")}</div>
                    <h3 className={styles.processStepTitle}>{t(`process.steps.${key}.title`)}</h3>
                    <p className={styles.processStepBody}>{t(`process.steps.${key}.body`)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className={`section--0 ${styles.band}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{t("services.title")}</h2>
          </div>
          <div className={styles.serviceGrid}>
            {serviceKeys.map((key) => (
              <article key={key} className={`card blueprint ${styles.serviceCard}`}>
                <Corners />
                <ServiceIcon name={key} />
                <div className="card-title">{t(`services.items.${key}.title`)}</div>
                <p className="card-body">{t(`services.items.${key}.body`)}</p>
              </article>
            ))}
          </div>
          <div className={styles.highlight}>
            <p className={styles.highlightText}>{t("services.highlight")}</p>
          </div>
        </div>
      </section>

      <section className={`section--1 ${styles.band}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{t("comp.title")}</h2>
            <p className={styles.sectionLead}>{t("comp.lead")}</p>
          </div>
          <div className={styles.compLayout}>
            <div className={styles.benefitPlate}>
              <p className={`eyebrow ${styles.benefitEyebrow}`}>{t("comp.contributionTitle")}</p>
              <ul className={styles.benefitList}>
                {contributionKeys.map((key) => (
                  <li key={key} className={styles.benefitItem}>
                    <CheckIcon className={styles.benefitCheck} />
                    <span>{t(`comp.contribution.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.benefitPlate}>
              <p className={`eyebrow ${styles.benefitEyebrow}`}>{t("comp.advantageTitle")}</p>
              <ul className={styles.benefitList}>
                {advantageKeys.map((key) => (
                  <li key={key} className={styles.benefitItem}>
                    <CheckIcon className={styles.benefitCheck} />
                    <span>{t(`comp.advantage.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className={styles.compFootnote}>{t("comp.footnote")}</p>
        </div>
      </section>

      <section className={`section--2 ${styles.band}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{t("models.title")}</h2>
          </div>
          <div className={styles.modelGrid}>
            {modelKeys.map((key) => (
              <article
                key={key}
                className={`${styles.modelCard}${key === "project" ? ` ${styles.modelCardDark}` : ""}`}
              >
                <p className={styles.modelRole}>{t(`models.items.${key}.role`)}</p>
                <h3 className={styles.modelTitle}>{t(`models.items.${key}.title`)}</h3>
                <p className={styles.modelBody}>{t(`models.items.${key}.body`)}</p>
              </article>
            ))}
          </div>
          <p className={styles.modelNote}>{t("models.note")}</p>
        </div>
      </section>

      <section className={`section--3 ${styles.geoBand}`}>
        <div className="diagonal-fx" aria-hidden="true">
          <span className="diagonal-sheet" />
          <span className="diagonal-sheet" />
          <span className="diagonal-sheet" />
          <span className="diagonal-orb" />
        </div>
        <div className={`container ${styles.geoInner}`}>
          <h2 className={styles.geoTitle}>{t("geo.title")}</h2>
          <p className={styles.geoBody}>{t("geo.body")}</p>
        </div>
      </section>

      <section className={`section--0 ${styles.band}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{t("refs.title")}</h2>
          </div>
          <div className={styles.refGrid}>
            {refItems.map((item) => (
              <figure
                key={item.src}
                className={`blueprint ${styles.refItem}${item.wide ? ` ${styles.refItemWide}` : ""}`}
              >
                <Corners />
                <div className={styles.refClip}>
                  <Image
                    src={item.src}
                    alt={t(`refs.${item.altKey}`)}
                    fill
                    sizes={item.wide ? "(max-width: 800px) 100vw, 50vw" : "(max-width: 800px) 100vw, 25vw"}
                    className={styles.refImg}
                  />
                </div>
                <figcaption className={styles.refCaption}>{t(`refs.${item.captionKey}`)}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={`section--5 on-dark ${styles.ctaBand}`}>
        <div className={styles.ctaFx} aria-hidden="true" />
        <div className={`container ${styles.ctaInner}`}>
          <h2 className={styles.ctaTitle}>{t("cta.title")}</h2>
          <p className={styles.ctaBody}>{t("cta.body1")}</p>
          <p className={styles.ctaBody}>{t("cta.body2")}</p>
          <div className={styles.ctaActions}>
            <a href="#partner-anfrage" className="btn btn-primary btn-lg">
              {t("cta.ctaPrimary")}
            </a>
            <a href={`tel:${site.contact.phoneTel}`} className="btn btn-inverse btn-lg">
              {t("cta.ctaSecondary")}
            </a>
          </div>
          <div className={styles.ctaContact}>
            <div className={styles.ctaContactItem}>
              <span className={styles.ctaContactLabel}>{t("cta.companyLabel")}</span>
              <span className={styles.ctaContactValue}>{site.name}</span>
            </div>
            <div className={styles.ctaContactItem}>
              <span className={styles.ctaContactLabel}>{t("cta.contactLabel")}</span>
              <span className={styles.ctaContactValue}>{t("cta.contactName")}</span>
            </div>
            <div className={styles.ctaContactItem}>
              <span className={styles.ctaContactLabel}>{t("cta.phoneLabel")}</span>
              <a className={styles.ctaContactValue} href={`tel:${site.contact.phoneTel}`}>
                {site.contact.phone}
              </a>
            </div>
            <div className={styles.ctaContactItem}>
              <span className={styles.ctaContactLabel}>{t("cta.emailLabel")}</span>
              <a className={styles.ctaContactValue} href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="partner-anfrage" className={`section--1 ${styles.formBand}`}>
        <div className={`container ${styles.formWrap}`}>
          <h2 className={styles.formTitle}>{t("form.title")}</h2>
          <p className={styles.formLead}>{t("form.lead")}</p>
          <PartnerInquiryForm />
        </div>
      </section>
    </>
  );
}
