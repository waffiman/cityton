import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog & News",
  description: "Neuigkeiten, Tipps und Projektberichte von City-Ton Austria.",
};

// Rendered per request so newly published posts appear immediately.
export const dynamic = "force-dynamic";

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("de-AT", { dateStyle: "long" }).format(d);
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <section className={`section--1 ${styles.band}`}>
      <div className="container">
        <div className={styles.head}>
          <h1 className={styles.title}>Aktuelles rund um Folien</h1>
          <p className={styles.lead}>
            Neuigkeiten, Tipps und Projektberichte — sobald neue Beiträge erscheinen, finden Sie
            sie hier.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className={styles.cardExcerpt}>Es sind noch keine Beiträge veröffentlicht.</p>
        ) : (
          <div className={styles.grid}>
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className={styles.card}>
                {p.coverUrl && (
                  <div className={styles.cardMedia}>
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
                    <span className={styles.cardDate}>{formatDate(p.publishedAt)}</span>
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
