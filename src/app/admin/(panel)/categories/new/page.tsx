import Link from "next/link";
import CategoryForm from "@/components/admin/CategoryForm";
import styles from "../../../admin.module.css";

export default function NewCategoryPage() {
  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Neue Serie</h1>
          <p className={styles.pageLead}>
            <Link href="/admin/categories" className={styles.rowLink}>
              ← Alle Serien
            </Link>
          </p>
        </div>
      </div>
      <CategoryForm />
    </>
  );
}
