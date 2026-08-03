import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, Eyebrow } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { CertificationBadge } from "@/components/CertificationBadge";
import { ProductSignature } from "@/components/ProductSignature";
import { ProductCard } from "@/components/ProductCard";
import { VideoEmbed } from "@/components/VideoEmbed";
import { Reveal } from "@/components/motion/Reveal";
import { VltScale } from "@/components/diagrams/VltScale";
import { ThicknessScale } from "@/components/diagrams/ThicknessScale";
import { FilmLayers } from "@/components/diagrams/FilmLayers";
import { GlassImpactDiagram } from "@/components/diagrams/GlassImpactDiagram";
import {
  formatMetricPercent,
  formatUv,
  getAllProductSlugs,
  getProduct,
  products,
  SECURITY_STANDARD,
  type ProductSlug,
} from "@/content/products";
import { media } from "@/content/media";
import { FILM_LAYER_KEYS } from "@/content/process";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const USE_CASE_PHOTOS: Record<ProductSlug, string[]> = {
  "serie-r": [
    media.photos.reflectiveFacade,
    media.photos.modernHome,
    media.photos.facadeWide,
  ],
  "arm-platinum-spectrum": [
    media.photos.installShopfront,
    media.photos.windowClose,
    media.photos.interior1,
  ],
  "safety-serie": [
    media.photos.architectureDetail,
    media.photos.installDetail,
    media.photos.windowFilm2,
  ],
  "uv-protection-clear": [
    media.photos.detailPortrait,
    media.photos.interior2,
    media.photos.glassDetail1,
  ],
};

const ACCENT: Record<ProductSlug, "teal" | "amber" | "ink" | "silver"> = {
  "serie-r": "silver",
  "arm-platinum-spectrum": "teal",
  "safety-serie": "amber",
  "uv-protection-clear": "teal",
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
  const tv = await getTranslations("vltScale");
  const tth = await getTranslations("thicknessScale");
  const tl = await getTranslations("filmLayers");
  const th = await getTranslations("howItWorks");

  const useCases = tp.raw(`${product.slug}.useCases`) as string[];
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);
  const photos = USE_CASE_PHOTOS[product.slug];

  const layers = FILM_LAYER_KEYS.map((key) => ({
    name: tl(`layers.${key}.name`),
    description: tl(`layers.${key}.description`),
    weight: key === "functional" ? 2.5 : 1,
  }));

  const activeVlt =
    product.metrics.vlt?.value ?? product.metrics.vlt?.max ?? product.vltMax;

  return (
    <>
      <PageHero
        eyebrow={tp(`${product.slug}.tagline`)}
        title={tp(`${product.slug}.name`)}
        lede={tp(`${product.slug}.description`)}
        imageSrc={photos[0]}
        secondaryCta={{ href: "/products", label: t("backToCatalog") }}
      >
        {product.certified ? (
          <div className="mt-6">
            <CertificationBadge
              label={tc("certified")}
              standard={SECURITY_STANDARD}
            />
          </div>
        ) : null}
      </PageHero>

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <ProductSignature slug={product.slug} />
          </Reveal>
          <Reveal delay={100}>
            <Eyebrow>{t("metricsVisualTitle")}</Eyebrow>
            <h2 className="text-display-sm text-ink">{tc("keyMetrics")}</h2>
            <div className="mt-8 space-y-5">
              {product.metrics.tser ? (
                <MetricRow
                  label={tc("tser")}
                  value={formatMetricPercent(locale, product.metrics.tser)}
                  pct={product.tserMax}
                />
              ) : null}
              {product.metrics.vlt || product.slug !== "safety-serie" ? (
                <MetricRow
                  label={tc("vlt")}
                  value={
                    product.metrics.vlt
                      ? formatMetricPercent(locale, product.metrics.vlt)
                      : `up to ${product.vltMax}%`
                  }
                  pct={product.vltMax}
                />
              ) : null}
              <MetricRow
                label={tc("uvProtection")}
                value={formatUv(locale, product.metrics.uv)}
                pct={Math.min(100, product.uvProtection)}
              />
            </div>
            <p className="mt-6 text-sm leading-relaxed text-text-muted">
              <span className="font-medium text-teal-dark">{tc("technology")}:</span>{" "}
              {tp(`${product.slug}.technology`)}
            </p>
          </Reveal>
        </div>
      </Section>

      {product.slug === "safety-serie" ? (
        <Section soft>
          <Reveal>
            <ThicknessScale
              title={tth("title")}
              caption={tth("caption")}
              activeLabel={tth("activeLabel")}
              activeMil={8}
            />
          </Reveal>
          <Reveal delay={100} className="mt-12">
            <GlassImpactDiagram
              withoutTitle={th("impactWithoutTitle")}
              withTitle={th("impactWithTitle")}
              withoutCaption={th("impactWithoutCaption")}
              withCaption={th("impactWithCaption")}
            />
          </Reveal>
          <div className="mt-10">
            <VideoEmbed
              title={t("videoTitle")}
              pendingLabel={t("videoPending")}
            />
          </div>
        </Section>
      ) : (
        <Section soft>
          <Reveal>
            <VltScale
              title={tv("title")}
              caption={tv("caption")}
              active={activeVlt}
              activeLabel={tv("activeLabel")}
            />
          </Reveal>
        </Section>
      )}

      <Section>
        <Reveal>
          <FilmLayers
            title={tl("title")}
            caption={tl("caption")}
            layers={layers}
            accent={ACCENT[product.slug]}
          />
        </Reveal>
      </Section>

      <Section soft>
        <Reveal>
          <Eyebrow>{t("useCasesPhotosTitle")}</Eyebrow>
          <h2 className="mb-8 text-display-sm text-ink">
            {t("useCasesPhotosTitle")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {photos.map((src, i) => (
              <div
                key={src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Image
                  src={src}
                  alt={useCases[i] ?? ""}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
                {useCases[i] ? (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-4 pb-3 pt-10 text-sm font-medium text-white">
                    {useCases[i]}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-text-muted">
            <span className="font-medium text-teal-dark">{tc("idealFor")}:</span>{" "}
            {tp(`${product.slug}.idealFor`)}
          </p>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <h2 className="mb-8 text-display-sm text-ink">{t("relatedTitle")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
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
          <div className="mt-8">
            <Link
              href="/products"
              className="text-sm font-semibold text-teal hover:text-teal-dark"
            >
              ← {t("backToCatalog")}
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

function MetricRow({
  label,
  value,
  pct,
}: {
  label: string;
  value: string;
  pct: number;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm text-text-muted">{label}</span>
        <span className="text-lg font-semibold text-teal-dark">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-bg-soft">
        <div
          className="h-full rounded-full bg-teal"
          style={{ width: `${Math.max(4, Math.min(100, pct))}%` }}
        />
      </div>
    </div>
  );
}
