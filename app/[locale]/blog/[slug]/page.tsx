import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { DrawIn } from "@/components/motion/DrawIn";
import { TemperatureComparison } from "@/components/diagrams/TemperatureComparison";
import { UvFlowDiagram } from "@/components/diagrams/UvFlowDiagram";
import { GlassImpactDiagram } from "@/components/diagrams/GlassImpactDiagram";
import { blogPosts } from "@/content/cases-blog";
import { getBlogPostLocalized, type Locale } from "@/lib/content";
import { TEMP_MEASUREMENT } from "@/content/products";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return blogPosts.flatMap((p) => [
    { locale: "de", slug: p.slug },
    { locale: "en", slug: p.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = await getBlogPostLocalized(slug, locale as Locale);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    alternates: {
      languages: { de: `/de/blog/${slug}`, en: `/en/blog/${slug}` },
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = await getBlogPostLocalized(slug, locale as Locale);
  if (!p) notFound();
  const t = await getTranslations("blog");
  const tc = await getTranslations("common");
  const th = await getTranslations("howItWorks");

  return (
    <>
      <PageHero
        eyebrow={`${p.category} · ${p.publishedAt}${p.draft ? " · DRAFT" : ""}`}
        title={p.title}
        lede={p.excerpt}
        imageSrc={p.image}
        secondaryCta={{ href: "/blog", label: `← ${t("title")}` }}
      />

      <Section>
        <article className="mx-auto max-w-2xl">
          <Reveal>
            <div className="space-y-6 text-base leading-relaxed text-text-muted">
              {p.body.map((para, i) => (
                <div key={para}>
                  <p>{para}</p>
                  {i === 0 && p.pullQuote ? (
                    <blockquote className="my-8 border-l-4 border-teal pl-5 text-2xl font-medium leading-snug text-ink">
                      {p.pullQuote}
                    </blockquote>
                  ) : null}
                  {i === 0 && p.diagram === "temperature" ? (
                    <div className="my-10">
                      <DrawIn>
                        <TemperatureComparison
                          withoutValue={TEMP_MEASUREMENT.without}
                          withValue={TEMP_MEASUREMENT.with}
                          withoutLabel={tc("withoutFilm")}
                          withLabel={tc("withFilm")}
                        />
                      </DrawIn>
                    </div>
                  ) : null}
                  {i === 0 && p.diagram === "uv-flow" ? (
                    <div className="my-10">
                      <DrawIn>
                        <UvFlowDiagram
                          title={th("uvTitle")}
                          steps={[
                            th("uvStep1"),
                            th("uvStep2"),
                            th("uvStep3"),
                          ]}
                        />
                      </DrawIn>
                    </div>
                  ) : null}
                  {i === 0 && p.diagram === "glass-impact" ? (
                    <div className="my-10">
                      <DrawIn>
                        <GlassImpactDiagram
                          withoutTitle={th("impactWithoutTitle")}
                          withTitle={th("impactWithTitle")}
                          withoutCaption={th("impactWithoutCaption")}
                          withCaption={th("impactWithCaption")}
                        />
                      </DrawIn>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Reveal>

          {p.tags?.length ? (
            <ul className="mt-10 flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-bg-soft px-3 py-1 text-xs font-medium text-ink ring-1 ring-border"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-12">
            <Link
              href="/blog"
              className="text-sm font-semibold text-teal hover:text-teal-dark"
            >
              ← {t("title")}
            </Link>
          </div>
        </article>
      </Section>
    </>
  );
}
