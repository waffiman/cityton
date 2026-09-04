"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/app/admin/admin.module.css";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import ReorderButtons from "@/components/admin/ReorderButtons";

export type GalleryRow = {
  id: string;
  url: string;
  kind: string;
  posterUrl: string | null;
  projectDe: string;
  filmDe: string;
  projectEn: string;
  filmEn: string;
  visible: boolean;
  sortOrder: number;
};

type Captions = {
  projectDe: string;
  filmDe: string;
  projectEn: string;
  filmEn: string;
};

const EMPTY: Captions = { projectDe: "", filmDe: "", projectEn: "", filmEn: "" };

const LABELS: [keyof Captions, string, string][] = [
  ["projectDe", "Projekt (DE)", "Fassade · Tageslicht"],
  ["filmDe", "Folie (DE)", "Sonnenschutzfolie"],
  ["projectEn", "Projekt (EN)", "Façade · Daylight"],
  ["filmEn", "Folie (EN)", "Solar control film"],
];

/**
 * The /gallery tiles, in the order the public page renders them.
 *
 * One page rather than a list plus a form: a tile is a picture and four short
 * captions, and a new project is usually several photos that share all four.
 * So the top form uploads a batch and applies one set of captions to it, and
 * existing rows are edited in place.
 */
export default function GalleryManager({ initial }: { initial: GalleryRow[] }) {
  const router = useRouter();

  const [urls, setUrls] = useState<string[]>([]);
  const [fresh, setFresh] = useState<Captions>(EMPTY);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Captions>(EMPTY);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function call(url: string, method: string, body?: unknown): Promise<boolean> {
    setError(null);
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Aktion fehlgeschlagen.");
      return false;
    }
    return true;
  }

  const freshComplete = urls.length > 0 && LABELS.every(([key]) => fresh[key].trim().length > 0);

  async function addBatch(e: React.FormEvent) {
    e.preventDefault();
    if (!freshComplete || busy) return;
    setBusy(true);

    // Sequential, not parallel: sortOrder is positional, and one failure part
    // way through should leave the tiles before it added rather than roll back.
    let added = 0;
    for (const url of urls) {
      const ok = await call("/api/admin/gallery", "POST", {
        url,
        kind: "image",
        posterUrl: null,
        projectDe: fresh.projectDe.trim(),
        filmDe: fresh.filmDe.trim(),
        projectEn: fresh.projectEn.trim(),
        filmEn: fresh.filmEn.trim(),
        visible: true,
        sortOrder: initial.length + added,
      });
      if (!ok) break;
      added += 1;
    }

    setBusy(false);
    if (added > 0) {
      setUrls(urls.slice(added));
      if (added === urls.length) setFresh(EMPTY);
      router.refresh();
    }
  }

  function startEdit(row: GalleryRow) {
    setEditingId(row.id);
    setError(null);
    setDraft({
      projectDe: row.projectDe,
      filmDe: row.filmDe,
      projectEn: row.projectEn,
      filmEn: row.filmEn,
    });
  }

  async function saveEdit(id: string) {
    if (busy) return;
    setBusy(true);
    const ok = await call(`/api/admin/gallery/${id}`, "PATCH", {
      projectDe: draft.projectDe.trim(),
      filmDe: draft.filmDe.trim(),
      projectEn: draft.projectEn.trim(),
      filmEn: draft.filmEn.trim(),
    });
    setBusy(false);
    if (ok) {
      setEditingId(null);
      router.refresh();
    }
  }

  async function mutate(id: string, body: unknown) {
    if (busy) return;
    setBusy(true);
    const ok = await call(`/api/admin/gallery/${id}`, "PATCH", body);
    setBusy(false);
    if (ok) router.refresh();
  }

  async function remove(row: GalleryRow) {
    if (busy) return;
    setBusy(true);
    const ok = await call(`/api/admin/gallery/${row.id}`, "DELETE");
    setBusy(false);
    if (ok) router.refresh();
  }

  return (
    <div style={{ display: "grid", gap: "var(--space-6)" }}>
      <form className={styles.form} onSubmit={addBatch}>
        <div className={styles.field}>
          <label className={styles.label}>Fotos</label>
          <MultiImageUpload value={urls} folder="gallery" onChange={setUrls} max={24} />
        </div>

        <div className={styles.row2}>
          {LABELS.map(([key, label, placeholder]) => (
            <div key={key} className={styles.field}>
              <label className={styles.label} htmlFor={`new-${key}`}>
                {label}
              </label>
              <input
                id={`new-${key}`}
                className="input"
                value={fresh[key]}
                placeholder={placeholder}
                onChange={(e) => setFresh({ ...fresh, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        <p className={styles.muted}>
          Die Angaben gelten für alle hochgeladenen Fotos — ein Projekt pro Durchgang. Videos werden
          derzeit nicht über das Panel hochgeladen.
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="submit" className="btn btn-primary" disabled={busy || !freshComplete}>
            {urls.length > 1 ? `${urls.length} Fotos hinzufügen` : "Hinzufügen"}
          </button>
        </div>
      </form>

      {initial.length === 0 ? (
        <div className={styles.emptyState}>Noch keine Bilder in der Galerie.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: 96 }}>Bild</th>
                <th>Deutsch</th>
                <th>English</th>
                <th>Sichtbarkeit</th>
                <th>Reihenfolge</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {initial.map((row, i) => {
                const editing = editingId === row.id;
                const thumb = row.kind === "video" ? row.posterUrl : row.url;

                return (
                  <tr key={row.id}>
                    <td>
                      <div
                        style={{
                          position: "relative",
                          width: 80,
                          height: 60,
                          background: "var(--s2)",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt=""
                            fill
                            sizes="80px"
                            style={{ objectFit: "cover" }}
                            unoptimized
                          />
                        ) : (
                          <span className={styles.muted} style={{ fontSize: 11 }}>
                            Video
                          </span>
                        )}
                        {row.kind === "video" && (
                          <span
                            aria-hidden="true"
                            style={{
                              position: "relative",
                              color: "#fff",
                              textShadow: "0 1px 3px rgba(0,0,0,.6)",
                              fontSize: 18,
                              lineHeight: 1,
                            }}
                          >
                            ▶
                          </span>
                        )}
                      </div>
                    </td>

                    {editing ? (
                      <>
                        <td>
                          <div style={{ display: "grid", gap: 4 }}>
                            <input
                              className="input"
                              value={draft.projectDe}
                              aria-label="Projekt (DE)"
                              onChange={(e) => setDraft({ ...draft, projectDe: e.target.value })}
                            />
                            <input
                              className="input"
                              value={draft.filmDe}
                              aria-label="Folie (DE)"
                              onChange={(e) => setDraft({ ...draft, filmDe: e.target.value })}
                            />
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "grid", gap: 4 }}>
                            <input
                              className="input"
                              value={draft.projectEn}
                              aria-label="Projekt (EN)"
                              onChange={(e) => setDraft({ ...draft, projectEn: e.target.value })}
                            />
                            <input
                              className="input"
                              value={draft.filmEn}
                              aria-label="Folie (EN)"
                              onChange={(e) => setDraft({ ...draft, filmEn: e.target.value })}
                            />
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          {row.projectDe}
                          <br />
                          <span className={styles.muted}>{row.filmDe}</span>
                        </td>
                        <td>
                          {row.projectEn}
                          <br />
                          <span className={styles.muted}>{row.filmEn}</span>
                        </td>
                      </>
                    )}

                    <td>
                      <button
                        type="button"
                        className={`${styles.badge} ${row.visible ? styles.badgeOn : styles.badgeOff}`}
                        style={{ cursor: "pointer" }}
                        disabled={busy}
                        onClick={() => mutate(row.id, { visible: !row.visible })}
                      >
                        {row.visible ? "Sichtbar" : "Verborgen"}
                      </button>
                    </td>

                    <td>
                      <ReorderButtons
                        id={row.id}
                        sortOrder={row.sortOrder}
                        prev={i > 0 ? initial[i - 1] : null}
                        next={i < initial.length - 1 ? initial[i + 1] : null}
                        endpoint="/api/admin/gallery"
                      />
                    </td>

                    <td>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        {editing ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ padding: "2px 10px", fontSize: 12 }}
                              disabled={busy}
                              onClick={() => saveEdit(row.id)}
                            >
                              Speichern
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: "2px 10px", fontSize: 12 }}
                              disabled={busy}
                              onClick={() => setEditingId(null)}
                            >
                              Abbrechen
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: "2px 10px", fontSize: 12 }}
                              disabled={busy}
                              onClick={() => startEdit(row)}
                            >
                              Bearbeiten
                            </button>
                            <button
                              type="button"
                              className={styles.dangerBtn}
                              disabled={busy}
                              onClick={() => remove(row)}
                            >
                              Löschen
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
