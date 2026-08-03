import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, Eyebrow } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { LoopVideo } from "@/components/LoopVideo";
import { Reveal } from "@/components/motion/Reveal";
import { getCaseStudies } from "@/lib/content";
import type { Locale } from "@/lib/content";
import { media } from "@/content/media";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cases" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: { languages: { de: "/de/cases", en: "/en/cases" } },
  };
}

export default async function CasesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cases");
  const cases = await getCaseStudies(locale as Locale);

  return (
    <>
      <PageHero
        eyebrow={t("subtitle")}
        title={t("title")}
        lede={t("intro")}
        imageSrc={media.photos.installShopfront}
      />

      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          {cases.map((c, i) => (
            <Reveal key={c.slug} delay={i * 80}>
              <Link
                href={`/cases/${c.slug}`}
                className="group overflow-hidden rounded-3xl bg-white ring-1 ring-border transition hover:shadow-lg"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {c.draft ? (
                    <span className="absolute top-3 left-3 rounded-full bg-amber px-2.5 py-1 text-[10px] font-bold tracking-wide text-ink uppercase">
                      Draft
                    </span>
                  ) : null}
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold tracking-wider text-teal uppercase">
                    {c.objectType} · {c.filmSeries}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
                    {c.title}
                  </h2>
                  <p className="mt-2 text-sm text-text-muted">{c.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section soft>
        <Reveal>
          <Eyebrow>{t("videoStripTitle")}</Eyebrow>
          <h2 className="mb-6 text-display-sm text-ink">{t("videoStripTitle")}</h2>
          <div className="overflow-hidden rounded-3xl ring-1 ring-border">
            <div className="relative aspect-video md:aspect-[21/9]">
              <LoopVideo loop="cases" title={t("videoStripTitle")} />
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
