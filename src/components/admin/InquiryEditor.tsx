"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/app/admin/admin.module.css";

const STATUSES: { value: string; label: string }[] = [
  { value: "new", label: "Neu" },
  { value: "in_progress", label: "In Bearbeitung" },
  { value: "done", label: "Erledigt" },
  { value: "archived", label: "Archiviert" },
];

export default function InquiryEditor({
  id,
  initialStatus,
  initialNotes,
}: {
  id: string;
  initialStatus: string;
  initialNotes: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save() {
    setBusy(true);
    setMsg(null);
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    setBusy(false);
    if (res.ok) {
      setMsg({ ok: true, text: "Gespeichert." });
      router.refresh();
    } else {
      setMsg({ ok: false, text: "Speichern fehlgeschlagen." });
    }
  }

  async function remove() {
    if (!confirm("Diese Anfrage endgültig löschen?")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/inquiries");
      router.refresh();
    } else {
      setBusy(false);
      setMsg({ ok: false, text: "Löschen fehlgeschlagen." });
    }
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="status">
          Status
        </label>
        <select
          id="status"
          className="input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="notes">
          Interne Notizen
        </label>
        <textarea
          id="notes"
          className="input"
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Nur intern sichtbar…"
        />
      </div>

      <div className={styles.actions}>
        <button type="button" className="btn btn-primary" onClick={save} disabled={busy}>
          {busy ? "Speichern…" : "Speichern"}
        </button>
        <button type="button" className={styles.dangerBtn} onClick={remove} disabled={busy}>
          Löschen
        </button>
        {msg && <span className={msg.ok ? styles.ok : styles.error}>{msg.text}</span>}
      </div>
    </div>
  );
}
