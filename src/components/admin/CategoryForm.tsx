"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import {
  type CategoryInput,
  GLYPH_FIELDS,
  GLYPHS,
  toSlug,
} from "@/lib/admin-schemas";

type Metric = { label: string; value: string; bar: string };

export type CategoryFormData = {
  id?: string;
  slug: string;
  name: string;
  family: string;
  tag: string;
  extraTag: string | null;
  summary: string;
  glyph: string;
  glyphField: string;
  useCases: string[];
  metrics: { label: string; value: string; bar: number }[] | null;
  nameEn: string | null;
  familyEn: string | null;
  tagEn: string | null;
  extraTagEn: string | null;
  summaryEn: string | null;
  useCasesEn: string[];
  metricsEn: { label: string; value: string; bar: number }[] | null;
  visible: boolean;
  sortOrder: number;
};

export default function CategoryForm({ category }: { category?: CategoryFormData }) {
  const router = useRouter();
  const isEdit = Boolean(category?.id);

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [family, setFamily] = useState(category?.family ?? "");
  const [tag, setTag] = useState(category?.tag ?? "");
  const [extraTag, setExtraTag] = useState(category?.extraTag ?? "");
  const [summary, setSummary] = useState(category?.summary ?? "");
  const [glyph, setGlyph] = useState(category?.glyph ?? GLYPHS[0]);
  const [glyphField, setGlyphField] = useState(category?.glyphField ?? GLYPH_FIELDS[0]);
  const [useCasesText, setUseCasesText] = useState((category?.useCases ?? []).join("\n"));
  const [metrics, setMetrics] = useState<Metric[]>(
    (category?.metrics ?? []).map((m) => ({ label: m.label, value: m.value, bar: String(m.bar) })),
  );
  const [nameEn, setNameEn] = useState(category?.nameEn ?? "");
  const [familyEn, setFamilyEn] = useState(category?.familyEn ?? "");
  const [tagEn, setTagEn] = useState(category?.tagEn ?? "");
  const [extraTagEn, setExtraTagEn] = useState(category?.extraTagEn ?? "");
  const [summaryEn, setSummaryEn] = useState(category?.summaryEn ?? "");
  const [useCasesEnText, setUseCasesEnText] = useState((category?.useCasesEn ?? []).join("\n"));
  // Metric values ("87 %") and bars are locale-independent; only the label is
  // translated, so the English metrics are rebuilt from the German rows.
  const [metricLabelsEn, setMetricLabelsEn] = useState<string[]>(
    (category?.metrics ?? []).map((m, i) => category?.metricsEn?.[i]?.label ?? ""),
  );
  const [visible, setVisible] = useState(category?.visible ?? true);
  const [sortOrder, setSortOrder] = useState(String(category?.sortOrder ?? 0));

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const effectiveSlug = useMemo(
    () => (slugTouched && slug ? slug : toSlug(name)),
    [slug, slugTouched, name],
  );

  function updateMetric(i: number, patch: Partial<Metric>) {
    setMetrics((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedMetrics: { label: string; value: string; bar: number }[] = [];
    for (const m of metrics) {
      if (!m.label.trim() && !m.value.trim()) continue;
      const bar = Number(m.bar.replace(",", "."));
      if (Number.isNaN(bar)) return setError("Metrik-Balken muss eine Zahl sein.");
      parsedMetrics.push({ label: m.label.trim(), value: m.value.trim(), bar });
    }

    const payload: CategoryInput = {
      slug: effectiveSlug,
      name: name.trim(),
      family: family.trim(),
      tag: tag.trim(),
      extraTag: extraTag.trim() || null,
      summary: summary.trim(),
      glyph: glyph as CategoryInput["glyph"],
      glyphField: glyphField as CategoryInput["glyphField"],
      useCases: useCasesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      metrics: parsedMetrics.length ? parsedMetrics : null,
      nameEn: nameEn.trim() || null,
      familyEn: familyEn.trim() || null,
      tagEn: tagEn.trim() || null,
      extraTagEn: extraTagEn.trim() || null,
      summaryEn: summaryEn.trim() || null,
      useCasesEn: useCasesEnText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      metricsEn: parsedMetrics.length
        ? parsedMetrics.map((m, i) => ({ ...m, label: metricLabelsEn[i]?.trim() || m.label }))
        : null,
      visible,
      sortOrder: parseInt(sortOrder, 10) || 0,
    };

    setBusy(true);
    const res = await fetch(
      isEdit ? `/api/admin/categories/${category!.id}` : "/api/admin/categories",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    setBusy(false);
    if (!res.ok || !data.ok) return setError(data.error ?? "Speichern fehlgeschlagen.");
    router.push("/admin/categories");
    router.refresh();
  }

  async function remove() {
    if (!category?.id) return;
    if (!confirm(`Serie „${category.name}" löschen? Produkte bleiben erhalten.`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/categories");
      router.refresh();
    } else {
      setBusy(false);
      setError("Löschen fehlgeschlagen.");
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">
            Name *
          </label>
          <input
            id="name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="slug">
            Slug (URL)
          </label>
          <input
            id="slug"
            className="input"
            value={slugTouched ? slug : effectiveSlug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
          />
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="family">
            Familie (Untertitel) *
          </label>
          <input
            id="family"
            className="input"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
            placeholder="z. B. Reflektierende Folien"
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="tag">
            Tag *
          </label>
          <input
            id="tag"
            className="input"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="z. B. Sonnenschutz"
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="extraTag">
          Zusätzlicher Tag (optional)
        </label>
        <input
          id="extraTag"
          className="input"
          value={extraTag}
          onChange={(e) => setExtraTag(e.target.value)}
          placeholder="z. B. Zertifiziert"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="summary">
          Kurzbeschreibung *
        </label>
        <textarea
          id="summary"
          className="input"
          rows={4}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="glyph">
            Diagramm
          </label>
          <select
            id="glyph"
            className="input"
            value={glyph}
            onChange={(e) => setGlyph(e.target.value)}
          >
            {GLYPHS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="glyphField">
            Diagramm-Hintergrund
          </label>
          <select
            id="glyphField"
            className="input"
            value={glyphField}
            onChange={(e) => setGlyphField(e.target.value)}
          >
            {GLYPH_FIELDS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="useCases">
          Einsatzgebiete (eines pro Zeile)
        </label>
        <textarea
          id="useCases"
          className="input"
          rows={4}
          value={useCasesText}
          onChange={(e) => setUseCasesText(e.target.value)}
          placeholder={"Südfassade\nSchaufenster\nHalle"}
        />
      </div>

      <fieldset style={{ border: "1px solid var(--color-divider)", padding: "var(--space-6)" }}>
        <legend className={styles.label}>English translation</legend>
        <p className={styles.muted} style={{ marginTop: 0 }}>
          Leer lassen heißt: /en zeigt den deutschen Text. Kennzahlen-Werte und Balken gelten für
          beide Sprachen — nur das Label wird übersetzt.
        </p>
        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="nameEn">
                Name (EN)
              </label>
              <input
                id="nameEn"
                className="input"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder={name}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="familyEn">
                Familie (EN)
              </label>
              <input
                id="familyEn"
                className="input"
                value={familyEn}
                onChange={(e) => setFamilyEn(e.target.value)}
                placeholder={family}
              />
            </div>
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="tagEn">
                Tag (EN)
              </label>
              <input
                id="tagEn"
                className="input"
                value={tagEn}
                onChange={(e) => setTagEn(e.target.value)}
                placeholder={tag}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="extraTagEn">
                Zusatz-Tag (EN)
              </label>
              <input
                id="extraTagEn"
                className="input"
                value={extraTagEn}
                onChange={(e) => setExtraTagEn(e.target.value)}
                placeholder={extraTag}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="summaryEn">
              Kurzbeschreibung (EN)
            </label>
            <textarea
              id="summaryEn"
              className="input"
              rows={3}
              value={summaryEn}
              onChange={(e) => setSummaryEn(e.target.value)}
              placeholder={summary}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="useCasesEn">
              Einsatzgebiete (EN, eines pro Zeile)
            </label>
            <textarea
              id="useCasesEn"
              className="input"
              rows={4}
              value={useCasesEnText}
              onChange={(e) => setUseCasesEnText(e.target.value)}
              placeholder={useCasesText}
            />
          </div>

          {metrics.length > 0 && (
            <div className={styles.field}>
              <label className={styles.label}>Kennzahlen-Labels (EN)</label>
              <div style={{ display: "grid", gap: "var(--space-3)" }}>
                {metrics.map((m, i) => (
                  <div key={i} className={styles.row2}>
                    <input className="input" value={m.label} readOnly aria-label={`Label ${i + 1} (DE)`} />
                    <input
                      className="input"
                      value={metricLabelsEn[i] ?? ""}
                      aria-label={`Label ${i + 1} (EN)`}
                      placeholder={m.label}
                      onChange={(e) => {
                        const next = [...metricLabelsEn];
                        next[i] = e.target.value;
                        setMetricLabelsEn(next);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </fieldset>

      <fieldset style={{ border: "1px solid var(--color-divider)", padding: "var(--space-6)" }}>
        <legend className={styles.label}>Kennzahlen (Übersichtskarte)</legend>
        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          {metrics.map((m, i) => (
            <div key={i} className={styles.row2} style={{ gridTemplateColumns: "1fr 1fr auto auto" }}>
              <input
                className="input"
                placeholder="Label (z. B. TSER)"
                value={m.label}
                onChange={(e) => updateMetric(i, { label: e.target.value })}
              />
              <input
                className="input"
                placeholder="Wert (z. B. bis 82 %)"
                value={m.value}
                onChange={(e) => updateMetric(i, { value: e.target.value })}
              />
              <input
                className="input"
                style={{ width: 90 }}
                placeholder="Balken 0–100"
                inputMode="numeric"
                value={m.bar}
                onChange={(e) => updateMetric(i, { bar: e.target.value })}
              />
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={() => setMetrics((rows) => rows.filter((_, idx) => idx !== i))}
              >
                ✕
              </button>
            </div>
          ))}
          {metrics.length < 6 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setMetrics((rows) => [...rows, { label: "", value: "", bar: "" }])}
            >
              Kennzahl hinzufügen
            </button>
          )}
        </div>
      </fieldset>

      <div className={styles.row2}>
        <div className={styles.checkRow}>
          <input
            id="visible"
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
          />
          <label htmlFor="visible" className={styles.label} style={{ margin: 0 }}>
            Auf der Website anzeigen
          </label>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sortOrder">
            Sortierung
          </label>
          <input
            id="sortOrder"
            className="input"
            inputMode="numeric"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Speichern…" : isEdit ? "Speichern" : "Anlegen"}
        </button>
        {isEdit && (
          <button type="button" className={styles.dangerBtn} onClick={remove} disabled={busy}>
            Löschen
          </button>
        )}
      </div>
    </form>
  );
}
