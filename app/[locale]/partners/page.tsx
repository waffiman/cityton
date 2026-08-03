import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { IconCard } from "@/components/IconCard";
import { IconBuilding, IconUsers } from "@/components/icons";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partners" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: { languages: { de: "/de/partners", en: "/en/partners" } },
  };
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("partners");
  const tc = await getTranslations("common");

  const models = [
    "construction",
    "glass",
    "facility",
    "architects",
    "property",
    "developers",
  ] as const;

  return (
    <>
      <Section dark className="!py-16">
        <p className="text-sm font-semibold tracking-widest text-teal uppercase">
          {t("subtitle")}
        </p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{t("title")}</h1>
        <p className="mt-4 max-w-2xl text-white/75">{t("intro")}</p>
        <p className="mt-3 max-w-2xl text-sm text-teal">{t("pricingNote")}</p>
      </Section>
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((m) => (
            <IconCard
              key={m}
              icon={m === "architects" || m === "developers" ? <IconUsers /> : <IconBuilding />}
              title={t(`models.${m}`)}
              description={t(`models.${m}Desc`)}
            />
          ))}
        </div>
        <div className="mt-10 rounded-2xl bg-bg-soft p-8 text-center ring-1 ring-dashed ring-border">
          <h2 className="text-lg font-semibold text-teal-dark">{t("formTitle")}</h2>
          <p className="mt-2 text-sm text-text-muted">{tc("comingSoon")}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-dark"
          >
            {tc("becomePartner")}
          </Link>
        </div>
      </Section>
    </>
  );
}
