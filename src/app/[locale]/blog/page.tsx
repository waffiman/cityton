import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Corners from "@/components/Corners";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import styles from "./blog.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

// Rendered per request so newly published posts appear immediately.
export const dynamic = "force-dynamic";

function formatDate(d: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === "de" ? "de-AT" : "en-GB", { dateStyle: "long" }).format(d);
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [t, posts] = await Promise.all([
    getTranslations("blog"),
    prisma.post.findMany({
      where: { status: "published" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <section className={`section--1 ${styles.band}`}>
      <div className="container">
        <div className={styles.head}>
          <div className="rule-head">
            <span className="eyebrow">{t("eyebrow")}</span>
          </div>
          <h1 className={styles.title}>{t("title")}</h1>
        </div>

        {posts.length === 0 ? (
          <div className={`blueprint ${styles.empty}`}>
            <Corners />
            {t("empty")}
          </div>
        ) : (
          <div className={styles.grid}>
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className={`blueprint ${styles.card}`}>
                <Corners />
                {p.coverUrl && (
                  <div className={`${styles.cardMedia} duotone`}>
                    <Image
                      src={p.coverUrl}
                      alt={p.title}
                      fill
                      sizes="(max-width: 700px) 100vw, 380px"
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  </div>
                )}
                <div className={styles.cardBody}>
                  {p.publishedAt && (
                    <span className="card-kicker">{formatDate(p.publishedAt, locale)}</span>
                  )}
                  <h2 className={styles.cardTitle}>{p.title}</h2>
                  {p.excerpt && <p className={styles.cardExcerpt}>{p.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
