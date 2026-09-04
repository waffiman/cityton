"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "@/app/admin/admin.module.css";

/**
 * Uploads several images and reports the resulting public URLs as an ordered
 * list. Sibling of `ImageUpload`, which handles the single-value case.
 *
 * `/api/admin/upload` takes one file per request by design, so a multi-select
 * fans out into one POST per file. They run in parallel: upload keys embed a
 * timestamp plus a random suffix, so concurrent writes cannot collide.
 *
 * A file that fails does not discard the ones that succeeded — the successful
 * URLs are appended and the failures are reported by name.
 */
export default function MultiImageUpload({
  value,
  folder,
  onChange,
  max = 24,
}: {
  value: string[];
  folder: "products" | "categories" | "posts" | "gallery";
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = max - value.length;

  async function uploadOne(file: File): Promise<string | null> {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { ok: boolean; url?: string; error?: string };
      return res.ok && data.ok && data.url ? data.url : null;
    } catch {
      return null;
    }
  }

  async function uploadAll(files: File[]) {
    setBusy(true);
    setError(null);

    const accepted = files.slice(0, Math.max(remaining, 0));
    const skipped = files.length - accepted.length;

    const results = await Promise.all(accepted.map(uploadOne));
    const uploaded = results.filter((u): u is string => u !== null);
    const failed = accepted.filter((_, i) => results[i] === null).map((f) => f.name);

    if (uploaded.length) onChange([...value, ...uploaded]);

    const problems: string[] = [];
    if (failed.length) problems.push(`Fehlgeschlagen: ${failed.join(", ")}`);
    if (skipped > 0) problems.push(`${skipped} Bild(er) übersprungen — max. ${max}.`);
    setError(problems.join(" ") || null);

    setBusy(false);
  }

  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function move(i: number, delta: number) {
    const j = i + delta;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      {value.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-3)",
          }}
        >
          {value.map((url, i) => (
            <li key={url} style={{ display: "grid", gap: 4, width: 160 }}>
              <div style={{ position: "relative", width: 160, height: 120, background: "var(--s2)" }}>
                <Image
                  src={url}
                  alt={`Bild ${i + 1}`}
                  fill
                  sizes="160px"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: "2px 8px", fontSize: 12 }}
                  onClick={() => move(i, -1)}
                  disabled={busy || i === 0}
                  aria-label={`Bild ${i + 1} nach vorne`}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: "2px 8px", fontSize: 12 }}
                  onClick={() => move(i, 1)}
                  disabled={busy || i === value.length - 1}
                  aria-label={`Bild ${i + 1} nach hinten`}
                >
                  →
                </button>
                <button
                  type="button"
                  className={styles.dangerBtn}
                  style={{ padding: "2px 8px", fontSize: 12, marginLeft: "auto" }}
                  onClick={() => removeAt(i)}
                  disabled={busy}
                  aria-label={`Bild ${i + 1} entfernen`}
                >
                  Entfernen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.actions}>
        <label
          className="btn btn-secondary"
          style={{ cursor: remaining > 0 ? "pointer" : "not-allowed" }}
        >
          {busy ? "Lädt…" : value.length ? "Weitere hinzufügen" : "Bilder hochladen"}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={busy || remaining <= 0}
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              if (files.length) uploadAll(files);
              e.target.value = "";
            }}
          />
        </label>
        {value.length > 0 && (
          <span className={styles.muted}>
            {value.length} von {max}
          </span>
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
