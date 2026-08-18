"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/app/admin/admin.module.css";
import { toSlug } from "@/lib/admin-schemas";

type Producer = {
  id: string;
  name: string;
  slug: string;
  visible: boolean;
  sortOrder: number;
  productCount: number;
};

export default function ProducersManager({ initial }: { initial: Producer[] }) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function call(url: string, method: string, body?: unknown): Promise<boolean> {
    setBusy(true);
    setError(null);
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    setBusy(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Aktion fehlgeschlagen.");
      return false;
    }
    router.refresh();
    return true;
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const ok = await call("/api/admin/producers", "POST", {
      name,
      slug: toSlug(name),
      visible: true,
      sortOrder: initial.length,
    });
    if (ok) setNewName("");
  }

  return (
    <div style={{ display: "grid", gap: "var(--space-6)" }}>
      <div className={styles.tableWrap}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Produkte</th>
              <th>Sichtbarkeit</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {initial.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td className={styles.muted}>{p.productCount}</td>
                <td>
                  <button
                    type="button"
                    className={`${styles.badge} ${p.visible ? styles.badgeOn : styles.badgeOff}`}
                    style={{ cursor: "pointer" }}
                    disabled={busy}
                    onClick={() => call(`/api/admin/producers/${p.id}`, "PATCH", { visible: !p.visible })}
                  >
                    {p.visible ? "Sichtbar" : "Verborgen"}
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    disabled={busy || p.productCount > 0}
                    title={p.productCount > 0 ? "Erst Produkte umordnen" : "Löschen"}
                    onClick={() => call(`/api/admin/producers/${p.id}`, "DELETE")}
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form className={styles.form} onSubmit={add} style={{ maxWidth: 420 }}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="newProducer">
            Neuer Hersteller
          </label>
          <input
            id="newProducer"
            className="input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name"
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button type="submit" className="btn btn-primary" disabled={busy || !newName.trim()}>
            Hinzufügen
          </button>
        </div>
      </form>
    </div>
  );
}
