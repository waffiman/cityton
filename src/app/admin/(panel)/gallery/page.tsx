import GalleryManager from "@/components/admin/GalleryManager";
import { prisma } from "@/lib/db";
import styles from "../../admin.module.css";

export default async function GalleryAdminPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Galerie</h1>
          <p className={styles.pageLead}>
            Die Projektbilder auf /gallery — in genau dieser Reihenfolge.
          </p>
        </div>
      </div>

      <GalleryManager initial={items} />
    </>
  );
}
