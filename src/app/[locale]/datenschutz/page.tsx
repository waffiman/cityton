import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import DatenschutzDe from "./DatenschutzDe";
import DatenschutzEn from "./DatenschutzEn";
import styles from "./legal.module.css";

// Rendered per request: the layout's footer reads the series list from the
// database, which isn't reachable while the Docker image is being built.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal");
  return { title: t("datenschutzTitle"), robots: { index: false } };
}

/** German governs; the English version is a translation. See ImpressumPage. */
export default async function DatenschutzPage() {
  const locale = await getLocale();
  if (!locale.startsWith("en")) return <DatenschutzDe />;

  const t = await getTranslations("legal");
  return (
    <>
      <div className={`container ${styles.noteWrap}`}>
        <p className={styles.note}>{t("bindingVersionNote")}</p>
      </div>
      <DatenschutzEn />
    </>
  );
}
