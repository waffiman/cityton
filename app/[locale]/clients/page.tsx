import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { IconCard } from "@/components/IconCard";
import {
  IconBuilding,
  IconHome,
  IconShield,
  IconStore,
} from "@/components/icons";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "clients" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: { languages: { de: "/de/clients", en: "/en/clients" } },
  };
}

export default async function ClientsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("clients");
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
        <div className="grid gap-4 sm:grid-cols-3">
          <IconCard icon={<IconHome />} title={t("problems.heat")} />
          <IconCard icon={<IconSunIcon />} title={t("problems.glare")} />
          <IconCard icon={<IconShield />} title={t("problems.privacy")} />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <IconCard
            icon={<IconHome />}
            title={t("propertyTypes.homes")}
            description={t("propertyTypes.homesDesc")}
          />
          <IconCard
            icon={<IconBuilding />}
            title={t("propertyTypes.offices")}
            description={t("propertyTypes.officesDesc")}
          />
          <IconCard
            icon={<IconStore />}
            title={t("propertyTypes.shopfronts")}
            description={t("propertyTypes.shopfrontsDesc")}
          />
          <IconCard
            icon={<IconShield />}
            title={t("propertyTypes.security")}
            description={t("propertyTypes.securityDesc")}
          />
        </div>
        <div className="mt-10 rounded-2xl bg-bg-soft p-8 text-center ring-1 ring-dashed ring-border">
          <h2 className="text-lg font-semibold text-teal-dark">{t("formTitle")}</h2>
          <p className="mt-2 text-sm text-text-muted">{tc("comingSoon")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-dark"
            >
              {tc("viewProducts")}
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-teal-dark ring-1 ring-border hover:bg-bg-soft"
            >
              {tc("requestConsultation")}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

function IconSunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
