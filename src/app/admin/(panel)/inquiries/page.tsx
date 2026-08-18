import Link from "next/link";
import { prisma } from "@/lib/db";
import styles from "../../admin.module.css";

const STATUS_LABEL: Record<string, string> = {
  new: "Neu",
  in_progress: "In Bearbeitung",
  done: "Erledigt",
  archived: "Archiviert",
};

const SOURCE_LABEL: Record<string, string> = {
  kontakt: "Kontaktformular",
  beratung: "Schnellanfrage",
  chatbot: "Chatbot",
};

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("de-AT", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

type Search = { status?: string; source?: string };

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const where: { status?: string; source?: string } = {};
  if (sp.status && STATUS_LABEL[sp.status]) where.status = sp.status;
  if (sp.source && SOURCE_LABEL[sp.source]) where.source = sp.source;

  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const statusFilters = ["", "new", "in_progress", "done", "archived"];

  function filterHref(status: string): string {
    const p = new URLSearchParams();
    if (status) p.set("status", status);
    if (sp.source) p.set("source", sp.source);
    const q = p.toString();
    return q ? `/admin/inquiries?${q}` : "/admin/inquiries";
  }

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Anfragen</h1>
          <p className={styles.pageLead}>
            Alle Anfragen aus Kontaktformular, Schnellanfrage und Chatbot.
          </p>
        </div>
      </div>

      <div className={styles.toolbar}>
        {statusFilters.map((s) => (
          <Link
            key={s || "all"}
            href={filterHref(s)}
            className={`${styles.badge} ${(sp.status ?? "") === s ? styles.badgeOn : ""}`}
          >
            {s ? STATUS_LABEL[s] : "Alle"}
          </Link>
        ))}
      </div>

      {inquiries.length === 0 ? (
        <div className={styles.emptyState}>Keine Anfragen gefunden.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Quelle</th>
                <th>Name</th>
                <th>Kontakt</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((q) => (
                <tr key={q.id}>
                  <td className={styles.muted}>{formatDate(q.createdAt)}</td>
                  <td>{SOURCE_LABEL[q.source] ?? q.source}</td>
                  <td>
                    <Link href={`/admin/inquiries/${q.id}`} className={styles.rowLink}>
                      {q.name || "—"}
                    </Link>
                  </td>
                  <td className={styles.muted}>{q.email || q.phone || "—"}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${q.status === "new" ? styles.badgeNew : ""}`}
                    >
                      {STATUS_LABEL[q.status] ?? q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
