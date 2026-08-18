import Link from "next/link";
import VisibleToggle from "@/components/admin/VisibleToggle";
import { prisma } from "@/lib/db";
import styles from "../../admin.module.css";

export default async function CategoriesListPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Serien</h1>
          <p className={styles.pageLead}>Produktkategorien für Startseite und /produkte.</p>
        </div>
        <Link href="/admin/categories/new" className="btn btn-primary">
          Neue Serie
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className={styles.emptyState}>Noch keine Serien.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Tag</th>
                <th>Produkte</th>
                <th>Sichtbarkeit</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/admin/categories/${c.id}`} className={styles.rowLink}>
                      {c.name}
                    </Link>
                  </td>
                  <td className={styles.muted}>{c.tag}</td>
                  <td className={styles.muted}>{c._count.products}</td>
                  <td>
                    <VisibleToggle endpoint={`/api/admin/categories/${c.id}`} initial={c.visible} />
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
