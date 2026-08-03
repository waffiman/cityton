import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/Section";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ProductCatalog } from "@/components/ProductCatalog";
import { PortfolioRadar } from "@/components/diagrams/PortfolioRadar";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      languages: { de: "/de/products", en: "/en/products" },
    },
  };
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");
  const tc = await getTranslations("common");
  const tp = await getTranslations("products_content");

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
      color: "#dca042",
    },
    {
      name: tp("uv-protection-clear.shortName"),
      tser: 20,
      vlt: 89,
      uv: 99.9,
      color: "#52B2BF",
    },
  ];

  return (
    <>
      <Section dark className="!py-16">
        <p className="text-sm font-semibold tracking-widest text-teal uppercase">
          {t("subtitle")}
        </p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{t("title")}</h1>
        <p className="mt-4 max-w-2xl text-white/75">{t("intro")}</p>
      </Section>

      <Section>
        <ProductCatalog />
      </Section>

      <Section soft>
        <h2 className="mb-8 text-center text-2xl font-bold text-teal-dark">
          {t("compareTitle")}
        </h2>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <ComparisonTable />
          <PortfolioRadar
            series={radarSeries}
            labels={{
              tser: tc("tser"),
              vlt: tc("vlt"),
              uv: tc("uvProtection"),
            }}
          />
        </div>
      </Section>
    </>
  );
}
