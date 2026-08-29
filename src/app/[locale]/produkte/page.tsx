import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CtaBand from "@/components/CtaBand";
import FilmCatalog from "@/components/FilmCatalog";
import SeriesCard from "@/components/SeriesCard";
import { getCatalogProducts, getVisibleSeries } from "@/lib/products";
import { pageAlternates } from "@/lib/seo";
import styles from "./products.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const tp = await getTranslations({ locale, namespace: "produkte" });
  return {
    title: t("products"),
    description: tp("metaDescription"),
    alternates: pageAlternates("/produkte", locale),
  };
}

export default async function ProductsPage() {
  const [series, films, t] = await Promise.all([
    getVisibleSeries(),
    getCatalogProducts(),
    getTranslations("produkte"),
  ]);
  return (
    <>
      <section className={`section--3 ${styles.seriesBand}`}>
        <div className={styles.seriesFx} aria-hidden="true">
          <span className={styles.seriesSheet} />
          <span className={styles.seriesSheet} />
          <span className={styles.seriesSheet} />
          <span className={styles.seriesOrb} />
        </div>
        <div className={`container ${styles.bandInner}`}>
          <div className={styles.seriesHead}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.lead}>{t("lead")}</p>
          </div>
          <div className={styles.seriesList}>
            {series.map((item) => (
              <SeriesCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section id="katalog" className={`section--2 ${styles.catalogBand}`}>
        <div className={styles.catalogFx} aria-hidden="true" />
        <div className={`container ${styles.bandInner}`}>
          <h2 className={styles.sectionTitle}>{t("catalogTitle")}</h2>
          <p className={styles.sectionLead}>{t("catalogLead")}</p>
          <FilmCatalog films={films} />
        </div>
      </section>

      <CtaBand title={t("ctaTitle")} body={t("ctaBody")} />
    </>
  );
}
