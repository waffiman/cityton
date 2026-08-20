import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { sanitizeHtml } from "@/lib/sanitize-html";
import styles from "../blog.module.css";

// Rendered per request from the DB (no build-time database dependency).
export const dynamic = "force-dynamic";

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("de-AT", { dateStyle: "long" }).format(d);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || post.status !== "published") return { title: "Beitrag nicht gefunden" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || post.status !== "published") notFound();

  return (
    <section className={`section--1 ${styles.band}`}>
      <div className="container">
        <article className={styles.article}>
          <Link href="/blog" className={styles.back}>
            ← Alle Beiträge
          </Link>
          {post.publishedAt && (
            <p className={styles.articleDate}>{formatDate(post.publishedAt)}</p>
          )}
          <h1 className={styles.articleTitle}>{post.title}</h1>
          {post.coverUrl && (
            <div className={styles.cover}>
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
