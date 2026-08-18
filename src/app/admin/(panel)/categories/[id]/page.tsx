import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryForm, { type CategoryFormData } from "@/components/admin/CategoryForm";
import { prisma } from "@/lib/db";
import styles from "../../../admin.module.css";

type Metric = { label: string; value: string; bar: number };

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  const data: CategoryFormData = {
    id: category.id,
    slug: category.slug,
    name: category.name,
    family: category.family,
    tag: category.tag,
    extraTag: category.extraTag,
    summary: category.summary,
    glyph: category.glyph,
    glyphField: category.glyphField,
    useCases: category.useCases,
    metrics: (category.metrics ?? null) as Metric[] | null,
    visible: category.visible,
    sortOrder: category.sortOrder,
  };

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>{category.name}</h1>
          <p className={styles.pageLead}>
            <Link href="/admin/categories" className={styles.rowLink}>
              ← Alle Serien
            </Link>
          </p>
        </div>
      </div>
      <CategoryForm category={data} />
    </>
  );
}
