import Link from "next/link";
import { prisma } from "@/lib/db";
import styles from "../../admin.module.css";

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

export default async function KnowledgeBaseListPage() {
  const entries = await prisma.knowledgeBase.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Wissensdatenbank</h1>
          <p className={styles.pageLead}>
            Interne Q&A für den Chatbot, die nicht auf der Website veröffentlicht werden.
          </p>
        </div>
        <Link href="/admin/knowledge/new" className="btn btn-primary">
          Neuer Eintrag
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className={styles.emptyState}>
          Noch keine Einträge.{" "}
          <Link href="/admin/knowledge/new" className={styles.rowLink}>
            Ersten erstellen
          </Link>
          .
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Frage</th>
                <th>Kategorie</th>
                <th>Sprache</th>
                <th>Status</th>
                <th>Sortierung</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td>
                    <Link href={`/admin/knowledge/${e.id}`} className={styles.rowLink}>
                      {truncate(e.question, 80)}
                    </Link>
                  </td>
                  <td className={styles.muted}>{e.category || "—"}</td>
                  <td>
                    <span className={styles.badge}>{e.locale.toUpperCase()}</span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${e.visible ? styles.badgeOn : styles.badgeOff}`}
                    >
                      {e.visible ? "Aktiv" : "Deaktiviert"}
                    </span>
                  </td>
                  <td className={styles.muted}>{e.sortOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
