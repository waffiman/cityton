import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CtaBand from "@/components/CtaBand";
import GalleryMasonry from "@/components/GalleryMasonry";
import { listGalleryImages, type GalleryCaption } from "@/lib/gallery-media";
import { pageAlternates } from "@/lib/seo";
import styles from "./gallery.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return {
    title: t("title"),
    description: t("lead"),
    alternates: pageAlternates("/gallery", locale),
  };
}

/** Fresh folder scan so newly dropped photos appear after refresh. */
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const t = await getTranslations("gallery");
  const captions = t.raw("captions") as Record<string, GalleryCaption>;
  const fallback: GalleryCaption = {
    project: t("captionFallbackProject"),
    film: t("captionFallbackFilm"),
  };
  const images = await listGalleryImages(captions, fallback);
  const tCommon = await getTranslations("common");

  return (
    <>
      <section
        className="section--3"
        style={{ position: "relative", overflow: "hidden", paddingTop: 56, paddingBottom: 40 }}
      >
        <div className="diagonal-fx" aria-hidden="true">
          <span className="diagonal-sheet" />
          <span className="diagonal-sheet" />
          <span className="diagonal-sheet" />
          <span className="diagonal-orb" />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className="lead" style={{ maxWidth: "58ch" }}>
            {t("lead")}
          </p>
        </div>
      </section>

      <section className={`container ${styles.gallerySection}`}>
        {images.length === 0 ? (
          <p className={styles.empty}>{t("empty")}</p>
        ) : (
          <GalleryMasonry images={images} />
        )}
      </section>

      <CtaBand
        title={tCommon("ctaGalleryTitle")}
        body={tCommon("ctaGalleryBody")}
        cta={tCommon("ctaGalleryCta")}
      />
    </>
  );
}
