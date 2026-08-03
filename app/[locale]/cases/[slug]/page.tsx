import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { Gallery } from "@/components/Gallery";
import { Reveal } from "@/components/motion/Reveal";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { caseStudies } from "@/content/cases-blog";
import { getCaseStudyLocalized, type Locale } from "@/lib/content";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return caseStudies.flatMap((c) => [
    { locale: "de", slug: c.slug },
    { locale: "en", slug: c.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const c = await getCaseStudyLocalized(slug, locale as Locale);
  if (!c) return {};
  return {
    title: c.title,
    description: c.excerpt,
    alternates: {
      languages: {
        de: `/de/cases/${slug}`,
        en: `/en/cases/${slug}`,
      },
    },
  };
}

export default async function CaseDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const c = await getCaseStudyLocalized(slug, locale as Locale);
  if (!c) notFound();
  const t = await getTranslations("cases");

  const galleryItems = (c.images ?? [c.image]).map((src, i) => ({
    src,
    alt: `${c.title} ${i + 1}`,
  }));

  const hasPair = (c.images?.length ?? 0) >= 2;

  return (
    <>
      <PageHero
        eyebrow={`${c.objectType} · ${c.filmSeries}${c.draft ? " · DRAFT" : ""}`}
        title={c.title}
        lede={c.excerpt}
        imageSrc={c.image}
        secondaryCta={{ href: "/cases", label: `← ${t("title")}` }}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          <div>
            {hasPair ? (
              <Reveal className="mb-10">
                <BeforeAfterSlider
                  before={
                    <div className="relative h-full w-full">
                      <Image
                        src={c.images![0]}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="60vw"
                      />
                    </div>
                  }
                  after={
                    <div className="relative h-full w-full">
                      <Image
                        src={c.images![1]}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="60vw"
                      />
                    </div>
                  }
                  beforeLabel="A"
                  afterLabel="B"
                />
              </Reveal>
            ) : null}

            <Reveal>
              <article className="mx-auto max-w-2xl space-y-6 text-base leading-relaxed text-text-muted lg:mx-0">
                {c.body.map((p, i) =>
                  i === 1 ? (
                    <p
                      key={p}
                      className="border-l-4 border-teal pl-5 text-xl font-medium leading-snug text-ink"
                    >
                      {p}
                    </p>
                  ) : (
                    <p key={p}>{p}</p>
                  ),
                )}
              </article>
            </Reveal>

            {galleryItems.length > 1 ? (
              <Reveal className="mt-12">
                <h2 className="mb-6 text-xl font-semibold text-ink">
                  {t("galleryTitle")}
                </h2>
                <Gallery items={galleryItems} columns={2} />
              </Reveal>
            ) : null}
          </div>

          <Reveal delay={80}>
            <aside className="sticky top-28 rounded-3xl bg-bg-soft p-6 ring-1 ring-border">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
                {t("factsTitle")}
              </h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-text-muted">{t("factObject")}</dt>
                  <dd className="mt-1 font-semibold capitalize text-ink">
                    {c.objectType}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-muted">{t("factFilm")}</dt>
                  <dd className="mt-1 font-semibold text-ink">{c.filmSeries}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">{t("factArea")}</dt>
                  <dd className="mt-1 font-semibold text-ink">
                    {c.areaSqm != null ? `${c.areaSqm} m²` : t("areaPending")}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-muted">{t("factDuration")}</dt>
                  <dd className="mt-1 font-semibold text-ink">
                    {c.duration ?? t("durationPending")}
                  </dd>
                </div>
              </dl>
              <Link
                href="/contact"
                className="mt-8 inline-flex w-full justify-center rounded-full bg-teal px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-dark"
              >
                {locale === "de" ? "Ähnliches Projekt anfragen" : "Request a similar project"}
              </Link>
            </aside>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
