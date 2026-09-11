import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import ImpressumDe from "./ImpressumDe";
import ImpressumEn from "./ImpressumEn";
import styles from "../datenschutz/legal.module.css";

// Rendered per request: the layout's footer reads the series list from the
// database, which isn't reachable while the Docker image is being built.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal");
  return { title: t("impressumTitle"), robots: { index: false } };
}

/**
 * The two language versions are separate components rather than one component
 * fed from the message files. A disclosure statement is reviewed as a whole
 * document, and stitching it together from interpolated fragments would make
 * it far harder to read against the statute — so each version stays legible
 * JSX, with matching section numbering.
 *
 * German governs: the § 5 ECG / § 14 UGB / § 25 MedienG duties are owed in
 * German, so the English page is labelled a translation.
 */
export default async function ImpressumPage() {
  const locale = await getLocale();
  if (!locale.startsWith("en")) return <ImpressumDe />;

  const t = await getTranslations("legal");
  return (
    <>
      <div className={`container ${styles.noteWrap}`}>
        <p className={styles.note}>{t("bindingVersionNote")}</p>
      </div>
      <ImpressumEn />
    </>
  );
}
