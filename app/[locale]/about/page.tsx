import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: { languages: { de: "/de/about", en: "/en/about" } },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tc = await getTranslations("common");

  return (
    <>
      <Section dark className="!py-16">
        <p className="text-sm font-semibold tracking-widest text-teal uppercase">
          {t("subtitle")}
        </p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{t("title")}</h1>
        <p className="mt-4 max-w-2xl text-white/75">{t("intro")}</p>
      </Section>
      <Section>
        <blockquote className="mx-auto max-w-2xl rounded-2xl bg-bg-soft p-8 text-center text-lg font-medium text-teal-dark ring-1 ring-border">
          „{t("quote")}“
        </blockquote>
        <div className="mt-10 rounded-2xl bg-bg-soft p-8 text-center ring-1 ring-dashed ring-border">
          <p className="text-text-muted">{tc("comingSoon")}</p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-dark"
          >
            {tc("backToHome")}
          </Link>
        </div>
      </Section>
    </>
  );
}
