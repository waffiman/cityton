import Link from "next/link";
import { prisma } from "@/lib/db";
import styles from "../admin.module.css";

export default async function DashboardPage() {
  const [products, visibleProducts, categories, openInquiries, totalInquiries, posts, drafts] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { visible: true } }),
      prisma.category.count(),
      prisma.inquiry.count({ where: { status: "new" } }),
      prisma.inquiry.count(),
      prisma.post.count(),
      prisma.post.count({ where: { status: "draft" } }),
    ]);

  const stats: { href: string; label: string; value: string }[] = [
    { href: "/admin/products", label: "Produkte", value: `${visibleProducts}/${products}` },
    { href: "/admin/categories", label: "Serien", value: String(categories) },
    { href: "/admin/inquiries", label: "Neue Anfragen", value: String(openInquiries) },
    { href: "/admin/inquiries", label: "Anfragen gesamt", value: String(totalInquiries) },
    { href: "/admin/posts", label: "Blog-Beiträge", value: `${posts}` },
    { href: "/admin/posts", label: "Entwürfe", value: String(drafts) },
  ];

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageLead}>Überblick über Katalog, Anfragen und Blog.</p>
        </div>
      </div>

      <div className={styles.statGrid}>
        {stats.map((s, i) => (
          <Link key={i} href={s.href} className={styles.stat}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
