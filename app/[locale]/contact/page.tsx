import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, Eyebrow } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Reveal } from "@/components/motion/Reveal";
import { ContactModeForms } from "@/components/forms/ContactModeForms";
import { CONTACT } from "@/content/products";
import { COMPANY } from "@/content/company";
import { media } from "@/content/media";
import { getFaqIds } from "@/content/faq";

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
  const tf = await getTranslations("faq");

  const lat = CONTACT.lat ?? COMPANY.mapLat;
  const lng = CONTACT.lng ?? COMPANY.mapLng;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.05}%2C${lat - 0.03}%2C${lng + 0.05}%2C${lat + 0.03}&layer=mapnik&marker=${lat}%2C${lng}`;

  const faqItems = getFaqIds("shared").map((id) => ({
    id,
    question: tf(`items.${id}.q`),
    answer: tf(`items.${id}.a`),
  }));

  return (
    <>
      <PageHero
        eyebrow={t("subtitle")}
        title={t("title")}
        lede={t("intro")}
        imageSrc={media.photos.facadeWide}
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-3">
          <Reveal>
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              className="block rounded-2xl bg-white p-6 ring-1 ring-border transition hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                {t("phoneLabel")}
              </p>
              <p className="mt-3 text-lg font-semibold text-ink">
                {CONTACT.phone}
              </p>
            </a>
          </Reveal>
          <Reveal delay={60}>
            <a
              href={`mailto:${CONTACT.email}`}
              className="block rounded-2xl bg-white p-6 ring-1 ring-border transition hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                {t("emailLabel")}
              </p>
              <p className="mt-3 text-lg font-semibold text-ink">
                {CONTACT.email}
              </p>
            </a>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                {t("addressLabel")}
              </p>
              <p className="mt-3 text-lg font-semibold text-ink">
                {CONTACT.address ?? `${COMPANY.city}, ${COMPANY.country}`}
              </p>
              {!CONTACT.address ? (
                <p className="mt-1 text-xs text-text-muted">
                  {t("addressPending")}
                </p>
              ) : null}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section soft>
        <Reveal>
          <Eyebrow>{t("responseTitle")}</Eyebrow>
          <h2 className="mb-8 text-display-sm text-ink">{t("responseTitle")}</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {[t("response1"), t("response2"), t("response3")].map((step, i) => (
              <li
                key={step}
                className="rounded-2xl bg-white p-5 ring-1 ring-border"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <p className="mt-4 text-sm font-medium leading-relaxed text-ink">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src={media.photos.installClose2}
                alt=""
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <ContactModeForms />
          </Reveal>
          <Reveal delay={100}>
            <div className="overflow-hidden rounded-3xl ring-1 ring-border">
              <iframe
                title={t("mapPending")}
                src={mapSrc}
                className="aspect-[4/3] w-full border-0 lg:aspect-auto lg:min-h-[520px]"
                loading="lazy"
              />
              <p className="bg-bg-soft px-4 py-2 text-xs text-text-muted">
                {t("cityMapNote")}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section soft>
        <Reveal>
          <FaqAccordion items={faqItems} title={tf("title")} />
        </Reveal>
      </Section>
    </>
  );
}
