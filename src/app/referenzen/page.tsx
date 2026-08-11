import type { Metadata } from "next";
import ReferenzenGallery from "@/components/ReferenzenGallery";
import { referenzen } from "@/content/referenzen";
import { listReferenzenImages } from "@/lib/referenzen-media";
import styles from "./referenzen.module.css";

export const metadata: Metadata = {
  title: "Referenzen",
  description:
    "Objektgalerie montierter Sonnenschutz- und Sicherheitsfolien von City-Ton Austria.",
};

/** Fresh folder scan so newly dropped photos appear after refresh. */
export const dynamic = "force-dynamic";

export default async function ReferenzenPage() {
  const images = await listReferenzenImages();

  return (
    <>
      <section className="container" style={{ paddingTop: 56 }}>
        <h6 className="eyebrow">{referenzen.eyebrow}</h6>
        <h1 className={styles.title}>{referenzen.title}</h1>
        <p className="lead" style={{ maxWidth: "58ch" }}>
          {referenzen.lead}
        </p>
      </section>

      <section className={`container ${styles.gallerySection}`}>
        {images.length === 0 ? (
          <p className={styles.empty}>{referenzen.empty}</p>
        ) : (
          <ReferenzenGallery images={images} />
        )}
      </section>
    </>
  );
}
