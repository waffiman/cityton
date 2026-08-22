import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Corners from "@/components/Corners";
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
          <div className="rule-head">
            <span className="eyebrow">Blog</span>
          </div>
          <h1 className={styles.title}>Aktuelles rund um Folien</h1>
          <p className="lead">
            Neuigkeiten, Tipps und Projektberichte — sobald neue Beiträge erscheinen, finden Sie
            sie hier.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className={`blueprint ${styles.empty}`}>
            <Corners />
            Es sind noch keine Beiträge veröffentlicht.
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
                    <span className="card-kicker">{formatDate(p.publishedAt)}</span>
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
