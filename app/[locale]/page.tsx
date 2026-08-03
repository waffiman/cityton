import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { IconCard } from "@/components/IconCard";
import { ProductCard } from "@/components/ProductCard";
import { StatCallout } from "@/components/StatCallout";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { TemperatureComparison } from "@/components/diagrams/TemperatureComparison";
import {
  IconEnergy,
  IconShield,
  IconSun,
  IconUv,
} from "@/components/icons";
import { products, TEMP_MEASUREMENT } from "@/content/products";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("siteName"),
    description: t("defaultDescription"),
    alternates: {
      languages: { de: "/de", en: "/en" },
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const tp = await getTranslations("products_content");

  const benefits = [
    { key: "solar" as const, icon: <IconSun /> },
    { key: "uv" as const, icon: <IconUv /> },
    { key: "energy" as const, icon: <IconEnergy /> },
    { key: "security" as const, icon: <IconShield /> },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-green text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(53,138,154,0.35),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <p className="mb-4 text-sm font-semibold tracking-[0.15em] text-teal uppercase">
            City-Ton Austria
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75">{t("heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/clients"
              className="inline-flex items-center rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal/90"
            >
              {tc("requestConsultation")}
            </Link>
            <Link
              href="/partners"
              className="inline-flex items-center rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/15"
            >
              {tc("becomePartner")}
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {benefits.map((b) => (
              <div
                key={b.key}
                className="glass-panel flex flex-col items-center gap-3 rounded-2xl px-4 py-5 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/20 text-teal">
                  {b.icon}
                </div>
                <span className="text-sm font-medium text-white">
                  {t(`benefits.${b.key}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Measurable difference */}
      <Section soft>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-teal-dark md:text-3xl">
            {t("measurableTitle")}
          </h2>
          <p className="mt-3 text-text-muted">{t("measurableSubtitle")}</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
          <BeforeAfterSlider
            before={
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-red/40 via-amber/30 to-red/20 p-6">
                <div className="text-5xl font-bold text-red md:text-6xl">
                  {t("tempWithout")}
                </div>
                <p className="mt-3 max-w-xs text-center text-sm font-medium text-teal-dark/80">
                  {t("tempWithoutLabel")}
                </p>
              </div>
            }
            after={
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-teal/35 via-bg-soft to-teal/15 p-6">
                <div className="text-5xl font-bold text-teal md:text-6xl">
                  {t("tempWith")}
                </div>
                <p className="mt-3 max-w-xs text-center text-sm font-medium text-teal-dark/80">
                  {t("tempWithLabel")}
                </p>
              </div>
            }
            beforeLabel={tc("withoutFilm")}
            afterLabel={tc("withFilm")}
            beforeMetrics={[
              { value: t("tempWithout"), label: t("tempWithoutLabel") },
            ]}
            afterMetrics={[
              { value: t("tempWith"), label: t("tempWithLabel") },
            ]}
          />

          <div className="space-y-8">
            <TemperatureComparison
              withoutValue={TEMP_MEASUREMENT.without}
              withValue={TEMP_MEASUREMENT.with}
              withoutLabel={tc("withoutFilm")}
              withLabel={tc("withFilm")}
            />
            <StatCallout
              value={t("tempDelta")}
              label={t("tempDeltaLabel")}
              accent="amber"
            />
          </div>
        </div>
      </Section>

      {/* Product overview */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-teal-dark md:text-3xl">
            {t("productsTitle")}
          </h2>
          <p className="mt-3 text-text-muted">{t("productsSubtitle")}</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.slug}
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
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-dark"
          >
            {tc("viewProducts")}
          </Link>
        </div>
      </Section>

      {/* Dual CTAs */}
      <Section soft>
        <div className="grid gap-6 md:grid-cols-2">
          <IconCard
            icon={<IconSun />}
            title={t("ctaClientsTitle")}
            description={t("ctaClientsText")}
            className="!p-8"
          />
          <div className="flex flex-col justify-between rounded-2xl bg-teal-dark p-8 text-white shadow-sm">
            <div>
              <h3 className="text-lg font-semibold">{t("ctaPartnersTitle")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                {t("ctaPartnersText")}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/clients"
                className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-teal-dark transition hover:bg-bg-soft"
              >
                {tc("requestConsultation")}
              </Link>
              <Link
                href="/partners"
                className="inline-flex rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal/90"
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
