import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/Section";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { SolarTransmissionDiagram } from "@/components/diagrams/SolarTransmissionDiagram";
import { ForceDistributionDiagram } from "@/components/diagrams/ForceDistributionDiagram";
import { SeasonalDiagrams } from "@/components/diagrams/SeasonalDiagrams";
import { UvFlowDiagram } from "@/components/diagrams/UvFlowDiagram";
import { VideoEmbed } from "@/components/VideoEmbed";
import {
  EXAMPLE_FILM,
  SOLAR_WITH_FILM,
  SOLAR_WITHOUT_FILM,
} from "@/content/products";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "howItWorks" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      languages: {
        de: "/de/how-it-works",
        en: "/en/how-it-works",
      },
    },
  };
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("howItWorks");
  const tc = await getTranslations("common");
  const tp = await getTranslations("products");

  return (
    <>
      <Section dark className="!py-16">
        <p className="text-sm font-semibold tracking-widest text-teal uppercase">
          {t("subtitle")}
        </p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{t("title")}</h1>
        <p className="mt-4 max-w-2xl text-white/75">{t("intro")}</p>
        <p className="mt-3 text-sm text-teal">
          {t("exampleProduct")} ({EXAMPLE_FILM.name})
        </p>
      </Section>

      <Section>
        <BeforeAfterSlider
          before={
            <SolarTransmissionDiagram
              title={t("withoutTitle")}
              transmission={SOLAR_WITHOUT_FILM.transmission}
              reflection={SOLAR_WITHOUT_FILM.reflection}
              absorption={SOLAR_WITHOUT_FILM.absorption}
            />
          }
          after={
            <SolarTransmissionDiagram
              title={t("withTitle")}
              transmission={SOLAR_WITH_FILM.transmission}
              reflection={SOLAR_WITH_FILM.reflection}
              absorption={SOLAR_WITH_FILM.absorption}
            />
          }
          beforeLabel={tc("withoutFilm")}
          afterLabel={tc("withFilm")}
          beforeMetrics={[
            {
              value: `${SOLAR_WITHOUT_FILM.transmission} %`,
              label: "Transmission",
            },
            {
              value: `${SOLAR_WITHOUT_FILM.reflection} %`,
              label: "Reflektion",
            },
            {
              value: `${SOLAR_WITHOUT_FILM.absorption} %`,
              label: "Absorption",
            },
          ]}
          afterMetrics={[
            {
              value: `${SOLAR_WITH_FILM.transmission} %`,
              label: "Transmission",
            },
            { value: `${SOLAR_WITH_FILM.reflection} %`, label: "Reflektion" },
            { value: `${SOLAR_WITH_FILM.absorption} %`, label: "Absorption" },
          ]}
          initialPosition={48}
        />
      </Section>

      <Section soft>
        <h2 className="mb-8 text-center text-2xl font-bold text-teal-dark">
          {t("seasonalTitle")}
        </h2>
        <SeasonalDiagrams
          summerTitle={t("summerTitle")}
          winterTitle={t("winterTitle")}
          summerItems={[
            t("summerItems.reflected"),
            t("summerItems.absorption"),
            t("summerItems.uv"),
            t("summerItems.transmission"),
            t("summerItems.glare"),
          ]}
          winterItems={[
            t("winterItems.co2"),
            t("winterItems.cold"),
            t("winterItems.heatLoss"),
            t("winterItems.savings"),
            t("winterItems.heating"),
          ]}
        />
      </Section>

      <Section>
        <UvFlowDiagram
          title={t("uvTitle")}
          steps={[t("uvStep1"), t("uvStep2"), t("uvStep3")]}
        />
      </Section>

      <Section soft>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-teal-dark">{t("securityTitle")}</h2>
          <p className="mt-3 text-text-muted">{t("securityIntro")}</p>
        </div>
        <div className="mt-10">
          <ForceDistributionDiagram
            title={t("forceTitle")}
            caption={t("forceCaption")}
          />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-4 text-sm text-text-muted ring-1 ring-border">
            {t("withoutSecurity")}
          </div>
          <div className="rounded-xl bg-white p-4 text-sm text-text-muted ring-1 ring-border">
            {t("withSecurity")}
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <VideoEmbed
            title={tp("videoTitle")}
            pendingLabel={tp("videoPending")}
          />
        </div>
      </Section>
    </>
  );
}
