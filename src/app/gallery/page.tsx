import type { Metadata } from "next";
import GalleryMasonry from "@/components/GalleryMasonry";
import { gallery } from "@/content/gallery";
import { listGalleryImages } from "@/lib/gallery-media";
import styles from "./gallery.module.css";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Objektgalerie montierter Sonnenschutz- und Sicherheitsfolien von City-Ton Austria.",
};

/** Fresh folder scan so newly dropped photos appear after refresh. */
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await listGalleryImages();

  return (
    <>
      <section className="container" style={{ paddingTop: 56 }}>
        <h6 className="eyebrow">{gallery.eyebrow}</h6>
        <h1 className={styles.title}>{gallery.title}</h1>
        <p className="lead" style={{ maxWidth: "58ch" }}>
          {gallery.lead}
        </p>
      </section>

      <section className={`container ${styles.gallerySection}`}>
        {images.length === 0 ? (
          <p className={styles.empty}>{gallery.empty}</p>
        ) : (
          <GalleryMasonry images={images} />
        )}
      </section>

      <div className="ramp ramp--1to6" aria-hidden="true" />
    </>
  );
}
