import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getBlogPosts, type Locale } from "@/lib/content";
import { media } from "@/content/media";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: { languages: { de: "/de/blog", en: "/en/blog" } },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const posts = await getBlogPosts(locale as Locale);

  return (
    <>
      <PageHero
        eyebrow={t("subtitle")}
        title={t("title")}
        lede={t("intro")}
        imageSrc={media.photos.interior2}
      />

      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-border transition hover:shadow-lg"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                  {p.draft ? (
                    <span className="absolute top-3 left-3 rounded-full bg-amber px-2.5 py-1 text-[10px] font-bold uppercase text-ink">
                      Draft
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider text-teal uppercase">
                    <span>{p.category}</span>
                    <span className="text-border">·</span>
                    <time dateTime={p.publishedAt}>{p.publishedAt}</time>
                  </div>
                  <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink transition group-hover:text-teal-dark">
                    {p.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm text-text-muted line-clamp-3">
                    {p.excerpt}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-teal">
                    {t("readMore")} →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
