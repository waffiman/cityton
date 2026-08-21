import Link from "next/link";
import ReorderButtons from "@/components/admin/ReorderButtons";
import VisibleToggle from "@/components/admin/VisibleToggle";
import { prisma } from "@/lib/db";
import styles from "../../admin.module.css";

type Search = { category?: string; producer?: string };

export default async function ProductsListPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;

  const [categories, producers] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { slug: true, name: true },
    }),
    prisma.producer.findMany({
      orderBy: { sortOrder: "asc" },
      select: { slug: true, name: true },
    }),
  ]);
  const categorySlugs = new Set(categories.map((c) => c.slug));
  const producerSlugs = new Set(producers.map((p) => p.slug));

  const NO_CATEGORY = "__none__";
  const activeCategory =
    sp.category && (sp.category === NO_CATEGORY || categorySlugs.has(sp.category))
      ? sp.category
      : undefined;
  const activeProducer = sp.producer && producerSlugs.has(sp.producer) ? sp.producer : undefined;

  const products = await prisma.product.findMany({
    where: {
      category:
        activeCategory === NO_CATEGORY ? null : activeCategory ? { slug: activeCategory } : undefined,
      producer: activeProducer ? { slug: activeProducer } : undefined,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { producer: true, category: true },
  });

  // Filtering narrows which row counts as "the neighbor" for ↑/↓: reordering
  // within a filtered view only ever swaps sortOrder with the next visible
  // row, so a filter (e.g. one Serie) is what makes reordering that group
  // practical instead of hunting through the full flat list.
  function filterHref(next: { category?: string; producer?: string }): string {
    const p = new URLSearchParams();
    const category = "category" in next ? next.category : activeCategory;
    const producer = "producer" in next ? next.producer : activeProducer;
    if (category) p.set("category", category);
    if (producer) p.set("producer", producer);
    const q = p.toString();
    return q ? `/admin/products?${q}` : "/admin/products";
  }

  const totalCount = await prisma.product.count();
  const isFiltered = Boolean(activeCategory || activeProducer);

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Produkte</h1>
          <p className={styles.pageLead}>
            {isFiltered ? `${products.length} von ${totalCount}` : `${products.length}`} Folien im
            Katalog. Reihenfolge (↑/↓) steuert die Anzeige auf /produkte.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          Neues Produkt
        </Link>
      </div>

      <div className={styles.toolbar}>
        <span className={styles.muted}>Serie:</span>
        <Link
          href={filterHref({ category: undefined })}
          className={`${styles.badge} ${!activeCategory ? styles.badgeOn : ""}`}
        >
          Alle
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={filterHref({ category: c.slug })}
            className={`${styles.badge} ${activeCategory === c.slug ? styles.badgeOn : ""}`}
          >
            {c.name}
          </Link>
        ))}
        <Link
          href={filterHref({ category: NO_CATEGORY })}
          className={`${styles.badge} ${activeCategory === NO_CATEGORY ? styles.badgeOn : ""}`}
        >
          Ohne Serie
        </Link>
      </div>

      <div className={styles.toolbar}>
        <span className={styles.muted}>Hersteller:</span>
        <Link
          href={filterHref({ producer: undefined })}
          className={`${styles.badge} ${!activeProducer ? styles.badgeOn : ""}`}
        >
          Alle
        </Link>
        {producers.map((p) => (
          <Link
            key={p.slug}
            href={filterHref({ producer: p.slug })}
            className={`${styles.badge} ${activeProducer === p.slug ? styles.badgeOn : ""}`}
          >
            {p.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className={styles.emptyState}>
          {isFiltered ? (
            <>
              Keine Produkte für diese Filter.{" "}
              <Link href="/admin/products" className={styles.rowLink}>
                Filter zurücksetzen
              </Link>
              .
            </>
          ) : (
            <>
              Noch keine Produkte.{" "}
              <Link href="/admin/products/new" className={styles.rowLink}>
                Erstes anlegen
              </Link>
              .
            </>
          )}
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th aria-label="Reihenfolge" />
                <th>Name</th>
                <th>Code</th>
                <th>Hersteller</th>
                <th>Serie</th>
                <th>Sichtbarkeit</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const prev = i > 0 ? products[i - 1] : null;
                const next = i < products.length - 1 ? products[i + 1] : null;
                return (
                  <tr key={p.id}>
                    <td>
                      <ReorderButtons
                        id={p.id}
                        sortOrder={p.sortOrder}
                        prev={prev ? { id: prev.id, sortOrder: prev.sortOrder } : null}
                        next={next ? { id: next.id, sortOrder: next.sortOrder } : null}
                      />
                    </td>
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
