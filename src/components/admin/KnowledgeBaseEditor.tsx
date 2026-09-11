"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/app/admin/admin.module.css";
import { type KnowledgeBaseInput } from "@/lib/admin-schemas";
import RichTextEditor from "./RichTextEditor";

export type KnowledgeBaseFormData = {
  id?: string;
  question: string;
  answer: string;
  category: string | null;
  keywords: string[];
  locale: string;
  visible: boolean;
  sortOrder: number;
};

export default function KnowledgeBaseEditor({ entry }: { entry?: KnowledgeBaseFormData }) {
  const router = useRouter();
  const isEdit = Boolean(entry?.id);

  const [question, setQuestion] = useState(entry?.question ?? "");
  const [answer, setAnswer] = useState(entry?.answer ?? "");
  const [category, setCategory] = useState(entry?.category ?? "");
  const [keywordsText, setKeywordsText] = useState(entry?.keywords?.join(", ") ?? "");
  const [locale, setLocale] = useState<"de" | "en">(
    (entry?.locale as "de" | "en") ?? "de",
  );
  const [visible, setVisible] = useState(entry?.visible ?? true);
  const [sortOrder, setSortOrder] = useState(entry?.sortOrder ?? 0);

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setError(null);
    if (!question.trim()) return setError("Frage ist erforderlich.");
    if (!answer.trim()) return setError("Antwort ist erforderlich.");

    const keywords = keywordsText
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const payload: KnowledgeBaseInput = {
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim() || null,
      keywords,
      locale,
      visible,
      sortOrder,
    };

    setBusy(true);
    const res = await fetch(
      isEdit ? `/api/admin/knowledge/${entry!.id}` : "/api/admin/knowledge",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    setBusy(false);
    if (!res.ok || !data.ok) return setError(data.error ?? "Speichern fehlgeschlagen.");
    router.push("/admin/knowledge");
    router.refresh();
  }

  async function remove() {
    if (!entry?.id) return;
    if (!confirm(`Eintrag „${entry.question}" löschen?`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/knowledge/${entry.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/knowledge");
      router.refresh();
    } else {
      setBusy(false);
      setError("Löschen fehlgeschlagen.");
    }
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="locale">
          Sprache *
        </label>
        <select
          id="locale"
          className="input"
          value={locale}
          onChange={(e) => setLocale(e.target.value as "de" | "en")}
        >
          <option value="de">Deutsch</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="question">
          Frage / Thema *
        </label>
        <input
          id="question"
          className="input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="z.B. Wie lange dauert die Installation?"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Antwort *</label>
        <RichTextEditor value={answer} onChange={setAnswer} />
        <p className={styles.hint}>
          Die Antwort unterstützt Formatierung (fett, Liste, etc.)
        </p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="category">
          Kategorie (optional)
        </label>
        <input
          id="category"
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="z.B. Preise, Services, Technisch"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="keywords">
          Stichwörter (optional)
        </label>
        <input
          id="keywords"
          className="input"
          value={keywordsText}
          onChange={(e) => setKeywordsText(e.target.value)}
          placeholder="Komma-getrennt: Montage, Dauer, Zeit"
        />
        <p className={styles.hint}>
          Zusätzliche Suchbegriffe, um die Antwort besser auffindbar zu machen
        </p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="sortOrder">
          Sortierung
        </label>
        <input
          id="sortOrder"
          type="number"
          className="input"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
        />
        <p className={styles.hint}>Kleinere Zahlen erscheinen zuerst</p>
      </div>

      <div className={styles.field}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
          />
          <span>Sichtbar (für Chatbot aktiviert)</span>
        </label>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="button" className="btn btn-primary" onClick={save} disabled={busy}>
          {busy ? "…" : "Speichern"}
        </button>
        {isEdit && (
          <button type="button" className={styles.dangerBtn} onClick={remove} disabled={busy}>
            Löschen
          </button>
        )}
      </div>
    </div>
  );
}
