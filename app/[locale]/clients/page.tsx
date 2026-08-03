import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, Eyebrow } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { Gallery } from "@/components/Gallery";
import { FaqAccordion } from "@/components/FaqAccordion";
import { LoopVideo } from "@/components/LoopVideo";
import { Reveal } from "@/components/motion/Reveal";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { TemperatureComparison } from "@/components/diagrams/TemperatureComparison";
import { ProcessTimeline } from "@/components/diagrams/ProcessTimeline";
import { ClientInquiryForm } from "@/components/forms/ContactForms";
import { media } from "@/content/media";
import { getFaqIds } from "@/content/faq";
import { PROCESS_STEP_KEYS } from "@/content/process";
import { TEMP_MEASUREMENT } from "@/content/products";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "clients" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: { languages: { de: "/de/clients", en: "/en/clients" } },
  };
}

export default async function ClientsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("clients");
  const tc = await getTranslations("common");
  const tp = await getTranslations("process");
  const tf = await getTranslations("faq");

  const steps = PROCESS_STEP_KEYS.map((key) => ({
    title: tp(`steps.${key}.title`),
    description: tp(`steps.${key}.description`),
  }));

  const faqItems = getFaqIds("client").map((id) => ({
    id,
    question: tf(`items.${id}.q`),
    answer: tf(`items.${id}.a`),
  }));

  const propertyGallery = [
    {
      src: media.photos.modernHome,
      alt: t("propertyTypes.homes"),
      caption: t("propertyTypes.homes"),
    },
    {
      src: media.photos.interior1,
      alt: t("propertyTypes.offices"),
      caption: t("propertyTypes.offices"),
    },
    {
      src: media.photos.installShopfront,
      alt: t("propertyTypes.shopfronts"),
      caption: t("propertyTypes.shopfronts"),
    },
    {
      src: media.photos.architectureDetail,
      alt: t("propertyTypes.security"),
      caption: t("propertyTypes.security"),
    },
    {
      src: media.photos.interior2,
      alt: t("propertyConservatory"),
      caption: t("propertyConservatory"),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("subtitle")}
        title={t("title")}
        lede={t("intro")}
        imageSrc={media.photos.interior1}
        cta={{ href: "#inquiry", label: t("ctaLabel") }}
        secondaryCta={{ href: "/products", label: tc("viewProducts") }}
      />

      <Section>
        <Reveal>
          <Eyebrow>{t("problemsTitle")}</Eyebrow>
          <h2 className="text-display-sm max-w-2xl text-ink">
            {t("problemsTitle")}
          </h2>
        </Reveal>

        {/* Heat */}
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <BeforeAfterSlider
              before={
                <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-red/50 to-amber/30 p-8">
                  <Image
                    src={media.photos.windowClose}
                    alt=""
                    fill
                    className="object-cover opacity-45"
                    sizes="50vw"
                  />
                  <div className="relative z-10 text-center">
                    <div className="text-5xl font-semibold text-white">
                      {TEMP_MEASUREMENT.without} °C
                    </div>
                    <p className="mt-2 text-sm text-white/80">
                      {tc("withoutFilm")}
                    </p>
                  </div>
                </div>
              }
              after={
                <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-teal-dark to-teal p-8">
                  <Image
                    src={media.photos.interiorWork1}
                    alt=""
                    fill
                    className="object-cover opacity-40"
                    sizes="50vw"
                  />
                  <div className="relative z-10 text-center">
                    <div className="text-5xl font-semibold text-white">
                      {TEMP_MEASUREMENT.with} °C
                    </div>
                    <p className="mt-2 text-sm text-white/80">{tc("withFilm")}</p>
                  </div>
                </div>
              }
              beforeLabel={tc("withoutFilm")}
              afterLabel={tc("withFilm")}
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">
              {t("heatStat")}
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-ink">
              {t("heatTitle")}
            </h3>
            <p className="mt-4 text-lede">{t("heatText")}</p>
            <div className="mt-8">
              <TemperatureComparison
                withoutValue={TEMP_MEASUREMENT.without}
                withValue={TEMP_MEASUREMENT.with}
                withoutLabel={tc("withoutFilm")}
                withLabel={tc("withFilm")}
              />
            </div>
          </Reveal>
        </div>

        {/* Glare */}
        <div className="mt-20 grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
              {t("glareStat")}
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-ink">
              {t("glareTitle")}
            </h3>
            <p className="mt-4 text-lede">{t("glareText")}</p>
          </Reveal>
          <Reveal delay={100} className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src={media.photos.detailPortrait}
                alt=""
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </Reveal>
        </div>

        {/* Privacy */}
        <div className="mt-20 grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src={media.photos.reflectiveFacade2}
                alt=""
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
              {t("privacyStat")}
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-ink">
              {t("privacyTitle")}
            </h3>
            <p className="mt-4 text-lede">{t("privacyText")}</p>
          </Reveal>
        </div>
      </Section>

      <Section soft>
        <Reveal>
          <Eyebrow>{t("propertyTitle")}</Eyebrow>
          <h2 className="mb-10 text-display-sm text-ink">{t("propertyTitle")}</h2>
          <Gallery items={propertyGallery} columns={3} />
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <ProcessTimeline
            eyebrow={tp("eyebrow")}
            title={tp("title")}
            steps={steps}
          />
        </Reveal>
        <Reveal delay={100} className="mt-14">
          <div className="overflow-hidden rounded-3xl ring-1 ring-border">
            <div className="relative aspect-video md:aspect-[21/9]">
              <LoopVideo loop="clients" title={t("processVideoTitle")} />
            </div>
            <p className="bg-bg-soft px-5 py-3 text-sm text-text-muted">
              {t("processVideoTitle")}
            </p>
          </div>
        </Reveal>
      </Section>

      <Section soft>
        <Reveal>
          <FaqAccordion items={faqItems} title={tf("title")} />
        </Reveal>
      </Section>

      <Section id="inquiry">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>{t("formTitle")}</Eyebrow>
            <h2 className="text-display-sm text-ink">{t("formTitle")}</h2>
            <p className="mt-4 text-lede">{t("intro")}</p>
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src={media.photos.facadeWide}
                alt=""
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-dark"
              >
                {tc("viewProducts")}
              </Link>
              <Link
                href="/cases"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink ring-1 ring-border hover:bg-bg-soft"
              >
                {tc("viewCases")}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <ClientInquiryForm className="rounded-3xl bg-bg-soft p-6 ring-1 ring-border md:p-8" />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
