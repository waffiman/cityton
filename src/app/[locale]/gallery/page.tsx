import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CtaBand from "@/components/CtaBand";
import GalleryMasonry from "@/components/GalleryMasonry";
import { listGalleryImages, type GalleryCaption } from "@/lib/gallery-media";
import styles from "./gallery.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return {
    title: "Gallery",
    description: t("lead"),
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
      <section className="container" style={{ paddingTop: 56 }}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className="lead" style={{ maxWidth: "58ch" }}>
          {t("lead")}
        </p>
      </section>

      <section className={`container ${styles.gallerySection}`}>
        {images.length === 0 ? (
          <p className={styles.empty}>{t("empty")}</p>
        ) : (
          <GalleryMasonry images={images} />
        )}
      </section>

      <CtaBand title={tCommon("ctaGalleryTitle")} body={tCommon("ctaGalleryBody")} />
    </>
  );
}
