import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm, { type ProductFormData } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/db";
import styles from "../../../admin.module.css";

type ValueMap = Record<string, number | string>;

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, producers, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.producer.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!product) notFound();

  const data: ProductFormData = {
    id: product.id,
    code: product.code,
    name: product.name,
    slug: product.slug,
    family: product.family,
    mount: product.mount,
    producerId: product.producerId,
    categoryId: product.categoryId,
    thicknessMil: product.thicknessMil,
    thicknessMicron: product.thicknessMicron,
    application: product.application,
    certification: product.certification,
    note: product.note,
    single: (product.single ?? {}) as ValueMap,
    dual: (product.dual ?? null) as ValueMap | null,
    imageUrl: product.imageUrl,
    visible: product.visible,
    sortOrder: product.sortOrder,
  };

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>{product.name}</h1>
          <p className={styles.pageLead}>
            <Link href="/admin/products" className={styles.rowLink}>
              ← Alle Produkte
            </Link>
          </p>
        </div>
      </div>
      <ProductForm producers={producers} categories={categories} product={data} />
    </>
  );
}
