import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CtaBand from "@/components/CtaBand";
import PrincipleScroller from "@/components/PrincipleScroller";
import { principleIds, type Principle } from "@/content/principles";
import { pageAlternates } from "@/lib/seo";
import styles from "./principle.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "principle" });
  return {
    title: t("pageTitle"),
    description: t("metaDescription"),
    alternates: pageAlternates("/funktionsprinzip", locale),
  };
}

export default async function PrinciplePage() {
  const t = await getTranslations("principle");
  const principles: Principle[] = principleIds.map((id) => ({
    id,
    kicker: t(`${id}.kicker`),
    title: t(`${id}.title`),
    body: t(`${id}.body`),
  }));

  return (
    <>
      <section className="container" style={{ paddingTop: 56 }}>
        <h1 className={styles.title}>{t("pageTitle")}</h1>
        <p className="lead" style={{ maxWidth: "60ch" }}>
          {t("pageLead")}
        </p>
      </section>

      <section className="container" style={{ paddingTop: 48 }}>
        <PrincipleScroller principles={principles} />
      </section>

      <CtaBand title={t("ctaTitle")} body={t("ctaBody")} />
    </>
  );
}
