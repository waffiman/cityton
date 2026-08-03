import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, Eyebrow } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { IconCard } from "@/components/IconCard";
import { PartnerLogoBlock } from "@/components/PartnerLogoBlock";
import { StatGrid } from "@/components/StatGrid";
import { LoopVideo } from "@/components/LoopVideo";
import { Reveal } from "@/components/motion/Reveal";
import { FilmLayers } from "@/components/diagrams/FilmLayers";
import {
  IconCheck,
  IconEnergy,
  IconShield,
  IconSun,
  IconUsers,
} from "@/components/icons";
import { media } from "@/content/media";
import { COMPANY_STATS } from "@/content/company";
import { FILM_LAYER_KEYS } from "@/content/process";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: { languages: { de: "/de/about", en: "/en/about" } },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const ta = await getTranslations("advantages");
  const tp = await getTranslations("partnerCards");
  const tl = await getTranslations("filmLayers");
  const tco = await getTranslations("company");

  const advantages = [
    { key: "fast" as const, icon: <IconSun /> },
    { key: "quality" as const, icon: <IconCheck /> },
    { key: "pricing" as const, icon: <IconEnergy /> },
    { key: "flexibility" as const, icon: <IconUsers /> },
    { key: "contact" as const, icon: <IconUsers /> },
    { key: "reliability" as const, icon: <IconShield /> },
  ];

  const layers = FILM_LAYER_KEYS.map((key) => ({
    name: tl(`layers.${key}.name`),
    description: tl(`layers.${key}.description`),
    weight: key === "functional" ? 2 : 1,
  }));

  const stats = COMPANY_STATS.map((s) => ({
    ...s,
    label: tco(`stats.${s.labelKey}`),
  }));

  return (
    <>
      <PageHero
        eyebrow={t("subtitle")}
        title={t("title")}
        lede={t("intro")}
        imageSrc={media.photos.processHands1}
      />

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image
                src={media.photos.installTeam}
                alt="City-Ton installation"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <blockquote className="text-display-sm text-ink">
              „{t("quote")}“
            </blockquote>
          </Reveal>
        </div>
      </Section>

      <Section soft>
        <Reveal>
          <Eyebrow>{t("deepDiveTitle")}</Eyebrow>
          <h2 className="text-display-sm text-ink">{t("deepDiveTitle")}</h2>
          <p className="mt-4 max-w-2xl text-lede">{t("deepDiveIntro")}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <PartnerLogoBlock
              partner="armolan"
              name={tp("armolan.name")}
              role={tp("armolan.role")}
              bullets={tp.raw("armolan.bullets") as string[]}
            />
          </Reveal>
          <Reveal delay={100}>
            <PartnerLogoBlock
              partner="llumar"
              name={tp("llumar.name")}
              role={tp("llumar.role")}
              bullets={tp.raw("llumar.bullets") as string[]}
            />
          </Reveal>
        </div>
        <Reveal className="mt-8">
          <PartnerLogoBlock
            partner="city-ton"
            name={tp("cityTon.name")}
            role={tp("cityTon.role")}
            bullets={tp.raw("cityTon.bullets") as string[]}
          />
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <FilmLayers
            title={tl("title")}
            caption={tl("caption")}
            layers={layers}
          />
        </Reveal>
      </Section>

      <Section soft>
        <Reveal>
          <Eyebrow>{t("advantagesTitle")}</Eyebrow>
          <h2 className="text-display-sm text-ink">{t("advantagesTitle")}</h2>
          <p className="mt-3 max-w-2xl text-lede">{t("advantagesSubtitle")}</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((a) => (
              <IconCard
                key={a.key}
                icon={a.icon}
                title={ta(`${a.key}.title`)}
                description={ta(`${a.key}.text`)}
              />
            ))}
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>{t("processVideoTitle")}</Eyebrow>
          <h2 className="mb-6 text-display-sm text-ink">
            {t("processVideoTitle")}
          </h2>
          <div className="overflow-hidden rounded-3xl ring-1 ring-border">
            <div className="relative aspect-video md:aspect-[21/9]">
              <LoopVideo loop="about" title={t("processVideoTitle")} />
            </div>
          </div>
        </Reveal>
      </Section>

      <Section soft>
        <Reveal>
          <StatGrid stats={stats} placeholderNote={tco("placeholderNote")} />
        </Reveal>
      </Section>
    </>
  );
}
