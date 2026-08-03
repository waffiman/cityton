import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/Section";
import { CONTACT } from "@/content/products";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: { languages: { de: "/de/contact", en: "/en/contact" } },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tc = await getTranslations("common");
  const tf = await getTranslations("footer");

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
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-teal-dark">
              {tf("contactTitle")}
            </h2>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="font-medium text-teal-dark hover:text-teal"
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="font-medium text-teal-dark hover:text-teal"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="text-text-muted">{t("addressPending")}</li>
            </ul>
            <div className="mt-6 rounded-2xl bg-bg-soft p-6 ring-1 ring-dashed ring-border">
              <p className="text-sm text-text-muted">{tc("comingSoon")}</p>
              <p className="mt-1 text-xs text-text-muted">
                {t("modeB2c")} / {t("modeB2b")}
              </p>
            </div>
          </div>
          <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-bg-soft ring-1 ring-dashed ring-border">
            <p className="text-sm text-text-muted">{t("mapPending")}</p>
            {/* TODO: content — embed map once lat/lng provided */}
          </div>
        </div>
      </Section>
    </>
  );
}
