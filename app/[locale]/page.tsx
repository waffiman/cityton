import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroVideo } from "@/components/HeroVideo";
import { Section, Eyebrow } from "@/components/Section";
import { ProductCard } from "@/components/ProductCard";
import { StatCallout } from "@/components/StatCallout";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { PartnerLogo } from "@/components/PartnerLogoBlock";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { StickySequence } from "@/components/motion/StickySequence";
import { TemperatureComparison } from "@/components/diagrams/TemperatureComparison";
import { ProcessTimeline } from "@/components/diagrams/ProcessTimeline";
import {
  IconEnergy,
  IconShield,
  IconSun,
  IconUv,
} from "@/components/icons";
import { products, TEMP_MEASUREMENT } from "@/content/products";
import { media } from "@/content/media";
import { caseStudies } from "@/content/cases-blog";
import { getFaqIds } from "@/content/faq";
import { PROCESS_STEP_KEYS } from "@/content/process";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("siteName"),
    description: t("defaultDescription"),
    alternates: { languages: { de: "/de", en: "/en" } },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const tp = await getTranslations("products_content");
  const tproc = await getTranslations("process");
  const tf = await getTranslations("faq");
  const tcases = await getTranslations("cases");

  const benefits = [
    { key: "solar" as const, icon: <IconSun className="h-5 w-5" /> },
    { key: "uv" as const, icon: <IconUv className="h-5 w-5" /> },
    { key: "energy" as const, icon: <IconEnergy className="h-5 w-5" /> },
    { key: "security" as const, icon: <IconShield className="h-5 w-5" /> },
  ];

  const steps = PROCESS_STEP_KEYS.map((key) => ({
    title: tproc(`steps.${key}.title`),
    description: tproc(`steps.${key}.description`),
  }));

  const faqTeaser = getFaqIds("shared", 3).map((id) => ({
    id,
    question: tf(`items.${id}.q`),
    answer: tf(`items.${id}.a`),
  }));

  const previewCases = caseStudies.slice(0, 2);

  return (
    <>
      <HeroVideo>
        <div className="max-w-3xl">
          <Eyebrow light>City-Ton Austria</Eyebrow>
          <h1 className="text-display text-white">{t("heroTitle")}</h1>
          <p className="mt-6 max-w-xl text-lede !text-white/75">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/clients"
              className="inline-flex rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal/25 transition hover:bg-teal/90"
            >
              {tc("requestConsultation")}
            </Link>
            <Link
              href="/partners"
              className="inline-flex rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white/15"
            >
              {tc("becomePartner")}
            </Link>
          </div>
        </div>

        <ul className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {benefits.map((b) => (
            <li
              key={b.key}
              className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3.5 backdrop-blur-md ring-1 ring-white/15"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal/30 text-teal">
                {b.icon}
              </span>
              <span className="text-sm font-medium text-white">
                {t(`benefits.${b.key}`)}
              </span>
            </li>
          ))}
        </ul>
      </HeroVideo>

      <Section>
        <StickySequence
          visual={
            <BeforeAfterSlider
              before={
                <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-red/50 to-amber/30 p-8">
                  <Image
                    src={media.photos.reflectiveFacade}
                    alt=""
                    fill
                    className="object-cover opacity-40"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="relative z-10 text-center">
                    <div className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
                      {t("tempWithout")}
                    </div>
                    <p className="mt-2 text-sm text-white/80">
                      {t("tempWithoutLabel")}
                    </p>
                  </div>
                </div>
              }
              after={
                <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-teal-dark to-teal p-8">
                  <Image
                    src={media.photos.reflectiveFacade}
                    alt=""
                    fill
                    className="object-cover opacity-35"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="relative z-10 text-center">
                    <div className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
                      {t("tempWith")}
                    </div>
                    <p className="mt-2 text-sm text-white/80">
                      {t("tempWithLabel")}
                    </p>
                  </div>
                </div>
              }
              beforeLabel={tc("withoutFilm")}
              afterLabel={tc("withFilm")}
            />
          }
        >
          <Reveal>
            <Eyebrow>{t("measurableTitle")}</Eyebrow>
            <h2 className="text-display-sm text-ink">{t("measurableTitle")}</h2>
            <p className="mt-4 text-lede">{t("measurableSubtitle")}</p>
            <div className="mt-10">
              <StatCallout
                value={t("tempDelta")}
                label={t("tempDeltaLabel")}
                accent="amber"
                className="text-left"
              />
            </div>
          </Reveal>
          <Reveal>
            <TemperatureComparison
              withoutValue={TEMP_MEASUREMENT.without}
              withValue={TEMP_MEASUREMENT.with}
              withoutLabel={tc("withoutFilm")}
              withLabel={tc("withFilm")}
            />
          </Reveal>
        </StickySequence>
      </Section>

      <Section soft fullBleed>
        <div className="grid lg:grid-cols-2">
          <Parallax className="relative min-h-[420px] lg:min-h-[560px]">
            <Image
              src={media.photos.installTeam}
              alt="City-Ton installation team"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Parallax>
          <div className="flex flex-col justify-center px-5 py-16 sm:px-10 lg:px-16">
            <Reveal>
              <Eyebrow>{t("productsTitle")}</Eyebrow>
              <h2 className="text-display-sm text-ink">{t("productsTitle")}</h2>
              <p className="mt-4 max-w-md text-lede">{t("productsSubtitle")}</p>
              <Link
                href="/products"
                className="mt-8 inline-flex w-fit rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-dark"
              >
                {tc("viewProducts")}
              </Link>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <ProductCard
                product={p}
                locale={locale}
                name={tp(`${p.slug}.name`)}
                tagline={tp(`${p.slug}.tagline`)}
                technology={tp(`${p.slug}.technology`)}
                certifiedLabel={tc("certified")}
                learnMoreLabel={tc("learnMore")}
                tserLabel={tc("tser")}
                vltLabel={tc("vlt")}
                uvLabel={tc("uvProtection")}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section soft>
        <Reveal>
          <ProcessTimeline
            compact
            eyebrow={tproc("eyebrow")}
            title={t("processTitle")}
            steps={steps}
          />
        </Reveal>
      </Section>

      <Section>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <Eyebrow>{tcases("subtitle")}</Eyebrow>
            <h2 className="text-display-sm text-ink">{t("casesPreviewTitle")}</h2>
          </div>
          <Link
            href="/cases"
            className="shrink-0 text-sm font-semibold text-teal hover:text-teal-dark"
          >
            {tc("viewCases")} →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {previewCases.map((c) => {
            const copy = locale === "de" ? c.de : c.en;
            return (
              <Reveal key={c.slug}>
                <Link
                  href={`/cases/${c.slug}`}
                  className="group block overflow-hidden rounded-3xl bg-white ring-1 ring-border transition hover:shadow-md"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={c.image}
                      alt={copy.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="50vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-ink">
                      {copy.title}
                    </h3>
                    <p className="mt-2 text-sm text-text-muted line-clamp-2">
                      {copy.excerpt}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section soft>
        <Reveal>
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            {t("partnersBandTitle")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <PartnerLogo partner="armolan" />
            <PartnerLogo partner="llumar" />
          </div>
        </Reveal>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <FaqAccordion items={faqTeaser} title={tf("teaserTitle")} />
          </Reveal>
          <Reveal delay={80}>
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-dark"
            >
              {t("faqTeaserCta")}
            </Link>
          </Reveal>
        </div>
      </Section>

      <Section dark fullBleed>
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[320px]">
            <Image
              src={media.photos.modernHome}
              alt=""
              fill
              className="object-cover opacity-40"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 to-ink/40" />
            <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-12">
              <h3 className="text-2xl font-semibold tracking-tight">
                {t("ctaClientsTitle")}
              </h3>
              <p className="mt-3 max-w-sm text-sm text-white/70">
                {t("ctaClientsText")}
              </p>
              <Link
                href="/clients"
                className="mt-6 inline-flex w-fit rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-bg-soft"
              >
                {tc("requestConsultation")}
              </Link>
            </div>
          </div>
          <div className="relative min-h-[320px] bg-teal-dark">
            <Image
              src={media.photos.installShopfront}
              alt=""
              fill
              className="object-cover opacity-30"
              sizes="50vw"
            />
            <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-12">
              <h3 className="text-2xl font-semibold tracking-tight">
                {t("ctaPartnersTitle")}
              </h3>
              <p className="mt-3 max-w-sm text-sm text-white/70">
                {t("ctaPartnersText")}
              </p>
              <Link
                href="/partners"
                className="mt-6 inline-flex w-fit rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal/90"
              >
                {tc("becomePartner")}
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
