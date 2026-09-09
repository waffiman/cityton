"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import {
  extractImportEntries,
  KNOWLEDGE_IMPORT_MAX_ENTRIES,
  knowledgeBaseImportEntrySchema,
  type KnowledgeBaseInput,
} from "@/lib/admin-schemas";

/** Guards against someone dropping a huge unrelated file into the picker. */
const MAX_FILE_BYTES = 2 * 1024 * 1024;

const TEMPLATE = [
  {
    question: "Wie lange dauert die Montage einer Sonnenschutzfolie?",
    answer:
      "In der Regel ist eine Wohnung an einem Tag fertig. Größere Objekte planen wir nach Fläche.",
    category: "Services",
    keywords: ["Montage", "Dauer"],
    locale: "de",
    visible: true,
    sortOrder: 0,
  },
  {
    question: "Was kostet eine Beratung?",
    answer: "Die Erstberatung vor Ort ist kostenlos und unverbindlich.",
    category: "Preise",
    keywords: ["Beratung", "Kosten"],
    locale: "de",
  },
];

type Parsed = {
  fileName: string;
  entries: KnowledgeBaseInput[];
  issues: string[];
};

type Result = { created: number; updated: number; skipped: number; total: number };

export default function KnowledgeBaseImport() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [mode, setMode] = useState<"skip" | "update">("skip");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function readFile(file: File) {
    setError(null);
    setResult(null);
    setParsed(null);

    if (file.size > MAX_FILE_BYTES) {
      return setError("Die Datei ist größer als 2 MB.");
    }

    let raw: unknown;
    try {
      raw = JSON.parse(await file.text());
    } catch {
      return setError("Die Datei ist kein gültiges JSON.");
    }

    const list = extractImportEntries(raw);
    if (!list) {
      return setError(
        "Erwartet wird eine Liste von Einträgen oder ein Objekt mit dem Feld „entries“.",
      );
    }
    if (list.length === 0) return setError("Die Datei enthält keine Einträge.");
    if (list.length > KNOWLEDGE_IMPORT_MAX_ENTRIES) {
      return setError(
        `Maximal ${KNOWLEDGE_IMPORT_MAX_ENTRIES} Einträge pro Datei (gefunden: ${list.length}).`,
      );
    }

    // Validate per entry so one bad object doesn't hide the rest.
    const entries: KnowledgeBaseInput[] = [];
    const issues: string[] = [];
    list.forEach((item, i) => {
      const check = knowledgeBaseImportEntrySchema.safeParse(item);
      if (check.success) {
        entries.push(check.data);
      } else {
        const message = check.error.issues[0]?.message ?? "Ungültiger Eintrag.";
        issues.push(`Eintrag ${i + 1}: ${message}`);
      }
    });

    setParsed({ fileName: file.name, entries, issues });
  }

  async function submit() {
    if (!parsed?.entries.length) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/knowledge/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: parsed.entries, mode }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        created?: number;
        updated?: number;
        skipped?: number;
        total?: number;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Import fehlgeschlagen.");
        return;
      }
      setResult({
        created: data.created ?? 0,
        updated: data.updated ?? 0,
        skipped: data.skipped ?? 0,
        total: data.total ?? parsed.entries.length,
      });
      setParsed(null);
      router.refresh();
    } catch {
      setError("Netzwerkfehler beim Import.");
    } finally {
      setBusy(false);
    }
  }

  function downloadTemplate() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(TEMPLATE, null, 2)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "wissensdatenbank-vorlage.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>JSON-Datei</label>
        <div
          className={`${styles.dropZone} ${dragging ? styles.dropZoneActive : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) readFile(file);
          }}
        >
          <strong>{parsed ? parsed.fileName : "Datei auswählen oder hierher ziehen"}</strong>
          <span className={styles.hint}>
            .json — bis {KNOWLEDGE_IMPORT_MAX_ENTRIES} Q&amp;A-Einträge, max. 2 MB
          </span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) readFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {parsed && (
        <>
          <div className={styles.field}>
            <label className={styles.label}>Vorschau</label>
            <p className={styles.hint}>
              {parsed.entries.length} gültige{" "}
              {parsed.entries.length === 1 ? "Eintrag" : "Einträge"}
              {parsed.issues.length > 0 && ` · ${parsed.issues.length} fehlerhaft (übersprungen)`}
            </p>
            <ul className={styles.previewList}>
              {parsed.entries.slice(0, 5).map((entry, i) => (
                <li key={i}>
                  [{entry.locale.toUpperCase()}] {entry.question}
                </li>
              ))}
            </ul>
            {parsed.entries.length > 5 && (
              <p className={styles.hint}>… und {parsed.entries.length - 5} weitere</p>
            )}
          </div>

          {parsed.issues.length > 0 && (
            <div className={styles.field}>
              <label className={styles.label}>Fehlerhafte Einträge</label>
              <ul className={styles.issueList}>
                {parsed.issues.slice(0, 10).map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
              {parsed.issues.length > 10 && (
                <p className={styles.hint}>… und {parsed.issues.length - 10} weitere</p>
              )}
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={mode === "update"}
                onChange={(e) => setMode(e.target.checked ? "update" : "skip")}
              />
              <span>Bestehende Einträge mit gleicher Frage überschreiben</span>
            </label>
            <p className={styles.hint}>
              Ohne Haken bleiben vorhandene Einträge unverändert und werden übersprungen.
            </p>
          </div>
        </>
      )}

      {error && <p className={styles.error}>{error}</p>}
      {result && (
        <p className={styles.ok}>
          Import abgeschlossen: {result.created} neu, {result.updated} aktualisiert,{" "}
          {result.skipped} übersprungen (von {result.total}).
        </p>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={submit}
          disabled={busy || !parsed?.entries.length}
        >
          {busy ? "Importiert…" : "Importieren"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={downloadTemplate}>
          Vorlage herunterladen
        </button>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Format</label>
        <p className={styles.hint}>
          Nur <code>question</code> und <code>answer</code> sind Pflicht. <code>category</code>,{" "}
          <code>keywords</code>, <code>locale</code> (de/en), <code>visible</code> und{" "}
          <code>sortOrder</code> sind optional und werden sonst wie bei einem neuen Eintrag
          gesetzt. <code>keywords</code> darf eine Liste oder ein Komma-Text sein.
        </p>
        <pre className={styles.codeBlock}>{`[
  {
    "question": "Wie lange dauert die Montage?",
    "answer": "In der Regel ein Tag pro Wohnung.",
    "category": "Services",
    "keywords": ["Montage", "Dauer"],
    "locale": "de"
  }
]`}</pre>
      </div>
    </div>
  );
}
