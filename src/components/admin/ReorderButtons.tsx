"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/app/admin/admin.module.css";

type Neighbor = { id: string; sortOrder: number } | null;

/**
 * Up/down row reordering. Swaps this row's `sortOrder` with the given
 * neighbor's via two PATCHes against `endpoint` — the neighbor comes from the
 * server-rendered (already sortOrder-ordered) list, so there's no ambiguity
 * about who's "next" even if values collide.
 */
export default function ReorderButtons({
  id,
  sortOrder,
  prev,
  next,
  endpoint = "/api/admin/products",
}: {
  id: string;
  sortOrder: number;
  prev: Neighbor;
  next: Neighbor;
  /** Collection route the two PATCHes go to, without a trailing slash. */
  endpoint?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function swap(other: Neighbor) {
    if (!other || busy) return;
    setBusy(true);
    const [a, b] = await Promise.all([
      fetch(`${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: other.sortOrder }),
      }),
      fetch(`${endpoint}/${other.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder }),
      }),
    ]);
    setBusy(false);
    if (a.ok && b.ok) router.refresh();
  }

  return (
    <div className={styles.sortBtns}>
      <button
        type="button"
        className={styles.sortBtn}
        onClick={() => swap(prev)}
        disabled={busy || !prev}
        aria-label="Nach oben"
        title="Nach oben"
      >
        ↑
      </button>
      <button
        type="button"
        className={styles.sortBtn}
        onClick={() => swap(next)}
        disabled={busy || !next}
        aria-label="Nach unten"
        title="Nach unten"
      >
        ↓
      </button>
    </div>
  );
}
