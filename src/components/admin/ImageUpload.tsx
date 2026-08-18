"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "@/app/admin/admin.module.css";

/**
 * Uploads an image to S3 via /api/admin/upload and reports the resulting
 * public URL. Shows a preview and lets the admin clear the value.
 */
export default function ImageUpload({
  value,
  folder,
  onChange,
}: {
  value: string | null;
  folder: "products" | "categories" | "posts";
  onChange: (url: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) {
        setError(data.error ?? "Upload fehlgeschlagen.");
      } else {
        onChange(data.url);
      }
    } catch {
      setError("Netzwerkfehler beim Upload.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      {value && (
        <div style={{ position: "relative", width: 160, height: 120, background: "var(--s2)" }}>
          <Image
            src={value}
            alt="Vorschau"
            fill
            sizes="160px"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>
      )}
      <div className={styles.actions}>
        <label className="btn btn-secondary" style={{ cursor: "pointer" }}>
          {busy ? "Lädt…" : value ? "Ersetzen" : "Bild hochladen"}
          <input
            type="file"
            accept="image/*"
            hidden
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </label>
        {value && (
          <button
            type="button"
            className={styles.dangerBtn}
            onClick={() => onChange(null)}
            disabled={busy}
          >
            Entfernen
          </button>
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
