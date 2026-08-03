import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { CertificationBadge } from "@/components/CertificationBadge";
import { VideoEmbed } from "@/components/VideoEmbed";
import {
  formatMetricPercent,
  formatUv,
  getAllProductSlugs,
  getProduct,
  SECURITY_STANDARD,
} from "@/content/products";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return getAllProductSlugs().flatMap((slug) => [
    { locale: "de", slug },
    { locale: "en", slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const tp = await getTranslations({ locale, namespace: "products_content" });
  return {
    title: tp(`${product.slug}.name`),
    description: tp(`${product.slug}.description`),
    alternates: {
      languages: {
        de: `/de/products/${slug}`,
        en: `/en/products/${slug}`,
      },
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getProduct(slug);
  if (!product) notFound();

  const t = await getTranslations("products");
  const tc = await getTranslations("common");
  const tp = await getTranslations("products_content");

  const useCases = tp.raw(`${product.slug}.useCases`) as string[];

  return (
    <>
      <Section dark className="!py-16">
        <Link
          href="/products"
          className="text-sm font-medium text-white/70 transition hover:text-white"
        >
          ← {t("backToCatalog")}
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold md:text-4xl">
            {tp(`${product.slug}.name`)}
          </h1>
          {product.certified ? (
            <CertificationBadge
              label={tc("certified")}
              standard={SECURITY_STANDARD}
            />
          ) : null}
        </div>
        <p className="mt-2 text-lg text-teal">{tp(`${product.slug}.tagline`)}</p>
        <p className="mt-4 max-w-2xl text-white/75">
          {tp(`${product.slug}.description`)}
        </p>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-teal-dark">
              {tc("technology")}
            </h2>
            <p className="mt-3 text-text-muted leading-relaxed">
              {tp(`${product.slug}.technology`)}
            </p>

            <h2 className="mt-8 text-xl font-semibold text-teal-dark">
              {tc("keyMetrics")}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {product.metrics.tser ? (
                <li className="rounded-full bg-bg-soft px-4 py-2 text-sm font-medium text-teal-dark ring-1 ring-border">
                  {tc("tser")}{" "}
                  {formatMetricPercent(locale, product.metrics.tser)}
                </li>
              ) : null}
              {product.metrics.vlt ? (
                <li className="rounded-full bg-bg-soft px-4 py-2 text-sm font-medium text-teal-dark ring-1 ring-border">
                  {tc("vlt")}{" "}
                  {formatMetricPercent(locale, product.metrics.vlt)}
                </li>
              ) : null}
              <li className="rounded-full bg-bg-soft px-4 py-2 text-sm font-medium text-teal-dark ring-1 ring-border">
                {tc("uvProtection")} {formatUv(locale, product.metrics.uv)}
              </li>
              {product.metrics.thickness ? (
                <li className="rounded-full bg-bg-soft px-4 py-2 text-sm font-medium text-teal-dark ring-1 ring-border">
                  {t("thickness")}: {product.metrics.thickness}
                </li>
              ) : null}
            </ul>

            <h2 className="mt-8 text-xl font-semibold text-teal-dark">
              {t("useCasesTitle")}
            </h2>
            <ul className="mt-3 space-y-2">
              {useCases.map((u) => (
                <li key={u} className="flex gap-2 text-sm text-text-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                  {u}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-text-muted">
              <span className="font-medium text-teal-dark">{tc("idealFor")}:</span>{" "}
              {tp(`${product.slug}.idealFor`)}
            </p>
          </div>

          {product.certified ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-teal-dark">
                {t("certification")}
              </h2>
              <p className="text-sm text-text-muted">
                {SECURITY_STANDARD === "TBD"
                  ? t("certificationPending")
                  : SECURITY_STANDARD}
              </p>
              <VideoEmbed
                title={t("videoTitle")}
                pendingLabel={t("videoPending")}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-2xl bg-bg-soft p-10 ring-1 ring-border">
              <div className="text-center">
                <p className="text-4xl font-bold text-teal">
                  {formatUv(locale, product.metrics.uv)}
                </p>
                <p className="mt-2 text-sm text-text-muted">
                  {tc("uvProtection")}
                </p>
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
