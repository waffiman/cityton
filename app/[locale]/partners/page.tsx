import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, Eyebrow } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { IconCard } from "@/components/IconCard";
import { PartnerLogoBlock } from "@/components/PartnerLogoBlock";
import { StatGrid } from "@/components/StatGrid";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Gallery } from "@/components/Gallery";
import { LoopVideo } from "@/components/LoopVideo";
import { Reveal } from "@/components/motion/Reveal";
import { FilmLayers } from "@/components/diagrams/FilmLayers";
import { ProcessTimeline } from "@/components/diagrams/ProcessTimeline";
import { PartnerApplicationForm } from "@/components/forms/ContactForms";
import { IconBuilding, IconUsers } from "@/components/icons";
import { media } from "@/content/media";
import { COMPANY_STATS } from "@/content/company";
import { getFaqIds } from "@/content/faq";
import { FILM_LAYER_KEYS, PROCESS_STEP_KEYS } from "@/content/process";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partners" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: { languages: { de: "/de/partners", en: "/en/partners" } },
  };
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("partners");
  const tpc = await getTranslations("partnerCards");
  const tp = await getTranslations("process");
  const tl = await getTranslations("filmLayers");
  const tf = await getTranslations("faq");
  const tco = await getTranslations("company");

  const models = [
    "construction",
    "glass",
    "facility",
    "architects",
    "property",
    "developers",
  ] as const;

  const steps = PROCESS_STEP_KEYS.map((key) => ({
    title: tp(`steps.${key}.title`),
    description: tp(`steps.${key}.description`),
  }));

  const layers = FILM_LAYER_KEYS.map((key) => ({
    name: tl(`layers.${key}.name`),
    description: tl(`layers.${key}.description`),
    weight: key === "functional" ? 2 : 1,
  }));

  const faqItems = getFaqIds("partner").map((id) => ({
    id,
    question: tf(`items.${id}.q`),
    answer: tf(`items.${id}.a`),
  }));

  const stats = COMPANY_STATS.map((s) => ({
    ...s,
    label: tco(`stats.${s.labelKey}`),
  }));

  const projectProof = [
    {
      src: media.photos.installShopfront,
      alt: "Shopfront installation",
      caption: "Shopfront",
    },
    {
      src: media.photos.installDetail,
      alt: "Install detail",
      caption: "Detail",
    },
    {
      src: media.photos.installTeam,
      alt: "Installation team",
      caption: "Team",
    },
    {
      src: media.photos.processHands1,
      alt: "Installation process",
      caption: "Process",
    },
    {
      src: media.cases.viennaShopfront,
      alt: "Vienna shopfront",
      caption: "Vienna",
    },
    {
      src: media.photos.glassDetail1,
      alt: "Glass detail",
      caption: "Glass",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("subtitle")}
        title={t("title")}
        lede={t("intro")}
        imageSrc={media.photos.installClose1}
        cta={{ href: "#partner-form", label: t("ctaLabel") }}
      >
        <p className="mt-4 max-w-2xl text-sm text-teal">{t("pricingNote")}</p>
      </PageHero>

      <Section>
        <Reveal>
          <Eyebrow>{t("proofTitle")}</Eyebrow>
          <h2 className="mb-8 text-display-sm text-ink">{t("proofTitle")}</h2>
          <StatGrid stats={stats} placeholderNote={tco("placeholderNote")} />
        </Reveal>
      </Section>

      <Section soft>
        <Reveal>
          <Eyebrow>{t("credibilityTitle")}</Eyebrow>
          <h2 className="text-display-sm text-ink">{t("credibilityTitle")}</h2>
          <p className="mt-4 max-w-2xl text-lede">{t("credibilityIntro")}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <PartnerLogoBlock
              partner="armolan"
              name={tpc("armolan.name")}
              role={tpc("armolan.role")}
              bullets={tpc.raw("armolan.bullets") as string[]}
            />
          </Reveal>
          <Reveal delay={100}>
            <PartnerLogoBlock
              partner="llumar"
              name={tpc("llumar.name")}
              role={tpc("llumar.role")}
              bullets={tpc.raw("llumar.bullets") as string[]}
            />
          </Reveal>
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>{t("techProofTitle")}</Eyebrow>
          <h2 className="mb-8 text-display-sm text-ink">{t("techProofTitle")}</h2>
          <FilmLayers
            title={tl("title")}
            caption={tl("caption")}
            layers={layers}
          />
        </Reveal>
      </Section>

      <Section soft>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((m, i) => (
            <Reveal key={m} delay={i * 40}>
              <IconCard
                icon={
                  m === "architects" || m === "developers" ? (
                    <IconUsers />
                  ) : (
                    <IconBuilding />
                  )
                }
                title={t(`models.${m}`)}
                description={t(`models.${m}Desc`)}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>{t("projectProofTitle")}</Eyebrow>
          <h2 className="mb-8 text-display-sm text-ink">
            {t("projectProofTitle")}
          </h2>
          <Gallery items={projectProof} columns={3} />
        </Reveal>
      </Section>

      <Section soft>
        <Reveal>
          <ProcessTimeline
            eyebrow={tp("eyebrow")}
            title={tp("partnerTitle")}
            steps={steps}
          />
        </Reveal>
        <Reveal delay={100} className="mt-12">
          <div className="overflow-hidden rounded-3xl ring-1 ring-border">
            <div className="relative aspect-video md:aspect-[21/9]">
              <LoopVideo loop="partners" />
            </div>
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <FaqAccordion items={faqItems} title={tf("title")} />
        </Reveal>
      </Section>

      <Section soft id="partner-form">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>{t("formTitle")}</Eyebrow>
            <h2 className="text-display-sm text-ink">{t("formTitle")}</h2>
            <p className="mt-4 text-lede">{t("intro")}</p>
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src={media.photos.installTeam}
                alt=""
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <PartnerApplicationForm className="rounded-3xl bg-white p-6 ring-1 ring-border md:p-8" />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
