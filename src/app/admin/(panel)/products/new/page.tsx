import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/db";
import styles from "../../../admin.module.css";

export default async function NewProductPage() {
  const [producers, categories] = await Promise.all([
    prisma.producer.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Neues Produkt</h1>
          <p className={styles.pageLead}>
            <Link href="/admin/products" className={styles.rowLink}>
              ← Alle Produkte
            </Link>
          </p>
        </div>
      </div>
      <ProductForm producers={producers} categories={categories} />
    </>
  );
}
