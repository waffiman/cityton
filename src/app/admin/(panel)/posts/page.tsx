import Link from "next/link";
import { prisma } from "@/lib/db";
import styles from "../../admin.module.css";

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("de-AT", { dateStyle: "medium" }).format(d);
}

export default async function PostsListPage() {
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Blog</h1>
          <p className={styles.pageLead}>Beiträge erstellen und veröffentlichen.</p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-primary">
          Neuer Beitrag
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          Noch keine Beiträge.{" "}
          <Link href="/admin/posts/new" className={styles.rowLink}>
            Ersten schreiben
          </Link>
          .
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Titel</th>
                <th>Status</th>
                <th>Aktualisiert</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/posts/${p.id}`} className={styles.rowLink}>
                      {p.title}
                    </Link>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${p.status === "published" ? styles.badgeOn : styles.badgeOff}`}
                    >
                      {p.status === "published" ? "Veröffentlicht" : "Entwurf"}
                    </span>
                  </td>
                  <td className={styles.muted}>{formatDate(p.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
