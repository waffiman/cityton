import ProducersManager from "@/components/admin/ProducersManager";
import { prisma } from "@/lib/db";
import styles from "../../admin.module.css";

export default async function ProducersPage() {
  const producers = await prisma.producer.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  const initial = producers.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    visible: p.visible,
    sortOrder: p.sortOrder,
    productCount: p._count.products,
  }));

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Hersteller</h1>
          <p className={styles.pageLead}>Marken, denen Produkte zugeordnet werden.</p>
        </div>
      </div>
      <ProducersManager initial={initial} />
    </>
  );
}
