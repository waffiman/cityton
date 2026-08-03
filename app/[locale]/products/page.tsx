import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, Eyebrow } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ProductCatalog } from "@/components/ProductCatalog";
import { Reveal } from "@/components/motion/Reveal";
import { DrawIn } from "@/components/motion/DrawIn";
import { PortfolioRadar } from "@/components/diagrams/PortfolioRadar";
import { VltScale } from "@/components/diagrams/VltScale";
import { FilmLayers } from "@/components/diagrams/FilmLayers";
import { media } from "@/content/media";
import { FILM_LAYER_KEYS } from "@/content/process";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: { languages: { de: "/de/products", en: "/en/products" } },
  };
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");
  const tc = await getTranslations("common");
  const tp = await getTranslations("products_content");
  const tv = await getTranslations("vltScale");
  const tl = await getTranslations("filmLayers");

  const radarSeries = [
    {
      name: tp("serie-r.shortName"),
      tser: 80,
      vlt: 50,
      uv: 99,
      color: "#358a9a",
    },
    {
      name: tp("arm-platinum-spectrum.shortName"),
      tser: 60,
      vlt: 80,
      uv: 99,
      color: "#1e4a54",
    },
    {
      name: tp("safety-serie.shortName"),
      tser: 20,
      vlt: 90,
      uv: 99,
      color: "#d4a04a",
    },
    {
      name: tp("uv-protection-clear.shortName"),
      tser: 20,
      vlt: 89,
      uv: 99.9,
      color: "#52B2BF",
    },
  ];

  const layers = FILM_LAYER_KEYS.map((key) => ({
    name: tl(`layers.${key}.name`),
    description: tl(`layers.${key}.description`),
    weight: key === "functional" ? 2 : 1,
  }));

  return (
    <>
      <PageHero
        eyebrow={t("subtitle")}
        title={t("title")}
        lede={t("intro")}
        imageSrc={media.photos.reflectiveFacade}
      />

      <Section soft>
        <Reveal>
          <VltScale
            title={tv("title")}
            caption={tv("caption")}
            activeLabel={tv("activeLabel")}
          />
        </Reveal>
      </Section>

      <Section>
        <ProductCatalog />
      </Section>

      <Section soft>
        <h2 className="mb-10 text-center text-display-sm text-ink">
          {t("compareTitle")}
        </h2>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <ComparisonTable />
          </Reveal>
          <Reveal delay={100}>
            <DrawIn>
              <PortfolioRadar
                series={radarSeries}
                labels={{
                  tser: tc("tser"),
                  vlt: tc("vlt"),
                  uv: tc("uvProtection"),
                }}
              />
            </DrawIn>
          </Reveal>
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>{t("layersTitle")}</Eyebrow>
          <h2 className="mb-8 text-display-sm text-ink">{t("layersTitle")}</h2>
          <FilmLayers
            title={tl("title")}
            caption={tl("caption")}
            layers={layers}
          />
        </Reveal>
      </Section>
    </>
  );
}
