import Link from "next/link";
import VisibleToggle from "@/components/admin/VisibleToggle";
import { prisma } from "@/lib/db";
import styles from "../../admin.module.css";

export default async function ProductsListPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { producer: true, category: true },
  });

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Produkte</h1>
          <p className={styles.pageLead}>{products.length} Folien im Katalog.</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          Neues Produkt
        </Link>
      </div>

      {products.length === 0 ? (
        <div className={styles.emptyState}>
          Noch keine Produkte.{" "}
          <Link href="/admin/products/new" className={styles.rowLink}>
            Erstes anlegen
          </Link>
          .
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Hersteller</th>
                <th>Serie</th>
                <th>Sichtbarkeit</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/products/${p.id}`} className={styles.rowLink}>
                      {p.name}
                    </Link>
                  </td>
                  <td className={styles.muted}>{p.code}</td>
                  <td>{p.producer.name}</td>
                  <td className={styles.muted}>{p.category?.name ?? "—"}</td>
                  <td>
                    <VisibleToggle endpoint={`/api/admin/products/${p.id}`} initial={p.visible} />
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
