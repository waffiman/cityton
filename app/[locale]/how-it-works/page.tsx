import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, Eyebrow } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Reveal } from "@/components/motion/Reveal";
import { DrawIn } from "@/components/motion/DrawIn";
import { SolarTransmissionDiagram } from "@/components/diagrams/SolarTransmissionDiagram";
import { ForceDistributionDiagram } from "@/components/diagrams/ForceDistributionDiagram";
import { SummerWinterDiagram } from "@/components/diagrams/SummerWinterDiagram";
import { GlassImpactDiagram } from "@/components/diagrams/GlassImpactDiagram";
import { UvFlowDiagram } from "@/components/diagrams/UvFlowDiagram";
import { VideoEmbed } from "@/components/VideoEmbed";
import {
  EXAMPLE_FILM,
  SOLAR_WITH_FILM,
  SOLAR_WITHOUT_FILM,
} from "@/content/products";
import { media } from "@/content/media";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "howItWorks" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      languages: { de: "/de/how-it-works", en: "/en/how-it-works" },
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
      <PageHero
        eyebrow={t("subtitle")}
        title={t("title")}
        lede={t("intro")}
        imageSrc={media.photos.windowFilm1}
      >
        <p className="mt-4 text-sm text-teal">
          {t("exampleProduct")} ({EXAMPLE_FILM.name})
        </p>
      </PageHero>

      <Section>
        <Reveal>
          <BeforeAfterSlider
            before={
              <DrawIn>
                <SolarTransmissionDiagram
                  title={t("withoutTitle")}
                  transmission={SOLAR_WITHOUT_FILM.transmission}
                  reflection={SOLAR_WITHOUT_FILM.reflection}
                  absorption={SOLAR_WITHOUT_FILM.absorption}
                />
              </DrawIn>
            }
            after={
              <DrawIn>
                <SolarTransmissionDiagram
                  title={t("withTitle")}
                  transmission={SOLAR_WITH_FILM.transmission}
                  reflection={SOLAR_WITH_FILM.reflection}
                  absorption={SOLAR_WITH_FILM.absorption}
                />
              </DrawIn>
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
        </Reveal>
      </Section>

      <Section soft>
        <Reveal>
          <h2 className="mb-10 text-center text-display-sm text-ink">
            {t("seasonalTitle")}
          </h2>
          <DrawIn>
            <SummerWinterDiagram
              summerTitle={t("summerTitle")}
              winterTitle={t("winterTitle")}
              summer={{
                reflected: t("summerItems.reflected"),
                absorption: t("summerItems.absorption"),
                transmission: t("summerItems.transmission"),
                uv: t("summerItems.uv"),
                glare: t("summerItems.glare"),
              }}
              winter={{
                co2: t("winterItems.co2"),
                cold: t("winterItems.cold"),
                heatLoss: t("winterItems.heatLoss"),
                savings: t("winterItems.savings"),
                heating: t("winterItems.heating"),
              }}
            />
          </DrawIn>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <DrawIn>
            <UvFlowDiagram
              title={t("uvTitle")}
              steps={[t("uvStep1"), t("uvStep2"), t("uvStep3")]}
            />
          </DrawIn>
        </Reveal>
      </Section>

      <Section soft>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-display-sm text-ink">{t("securityTitle")}</h2>
            <p className="mt-4 text-lede">{t("securityIntro")}</p>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <DrawIn>
            <GlassImpactDiagram
              withoutTitle={t("impactWithoutTitle")}
              withTitle={t("impactWithTitle")}
              withoutCaption={t("impactWithoutCaption")}
              withCaption={t("impactWithCaption")}
            />
          </DrawIn>
        </Reveal>

        <Reveal className="mt-12">
          <DrawIn>
            <ForceDistributionDiagram
              title={t("forceTitle")}
              caption={t("forceCaption")}
            />
          </DrawIn>
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl">
          <VideoEmbed
            title={tp("videoTitle")}
            pendingLabel={tp("videoPending")}
          />
        </div>
      </Section>
    </>
  );
}
