import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Corners from "@/components/Corners";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { sanitizeHtml } from "@/lib/sanitize-html";
import styles from "../blog.module.css";

// Rendered per request from the DB (no build-time database dependency).
export const dynamic = "force-dynamic";

function formatDate(d: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === "de" ? "de-AT" : "en-GB", { dateStyle: "long" }).format(d);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || post.status !== "published") {
    const t = await getTranslations({ locale, namespace: "blog" });
    return { title: t("notFoundTitle") };
  }
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const [post, t] = await Promise.all([
    prisma.post.findUnique({ where: { slug } }),
    getTranslations("blog"),
  ]);
  if (!post || post.status !== "published") notFound();

  return (
    <section className={`section--1 ${styles.band}`}>
      <div className="container">
        <article className={styles.article}>
          <Link href="/blog" className={styles.back}>
            {t("back")}
          </Link>
          {post.publishedAt && (
            <div className={styles.meta}>
              <span className="eyebrow">{formatDate(post.publishedAt, locale)}</span>
            </div>
          )}
          <h1 className={styles.articleTitle}>{post.title}</h1>
          {post.coverUrl && (
            <div className={`blueprint duotone ${styles.coverFrame}`}>
              <Corners />
              <Image
                src={post.coverUrl}
                alt={post.title}
                fill
                sizes="(max-width: 800px) 100vw, 760px"
                style={{ objectFit: "cover" }}
                priority
                unoptimized
              />
            </div>
          )}
          <div
            className={styles.prose}
            // Content is admin-authored and sanitized server-side.
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.contentHtml) }}
          />
        </article>
      </div>
    </section>
  );
}
