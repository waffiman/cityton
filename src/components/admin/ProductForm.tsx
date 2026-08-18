"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import {
  FAMILIES,
  FILM_VALUE_FIELDS,
  MOUNTS,
  type ProductInput,
  toSlug,
} from "@/lib/admin-schemas";
import ImageUpload from "./ImageUpload";

type Option = { id: string; name: string };

export type ProductFormData = {
  id?: string;
  code: string;
  name: string;
  slug: string;
  family: string;
  mount: string;
  producerId: string;
  categoryId: string | null;
  thicknessMil: number | null;
  thicknessMicron: number | null;
  application: string | null;
  certification: string | null;
  note: string | null;
  single: Record<string, number | string>;
  dual: Record<string, number | string> | null;
  imageUrl: string | null;
  visible: boolean;
  sortOrder: number;
};

type ValueMap = Record<string, string>;

function toValueMap(v: Record<string, number | string> | null): ValueMap {
  const out: ValueMap = {};
  if (!v) return out;
  for (const [k, val] of Object.entries(v)) out[k] = String(val);
  return out;
}

function buildFilmValues(map: ValueMap): Record<string, number | string> | { __error: string } {
  const out: Record<string, number | string> = {};
  for (const f of FILM_VALUE_FIELDS) {
    const raw = (map[f.key] ?? "").trim();
    if (f.kind === "string") {
      if (raw) out[f.key] = raw;
      continue;
    }
    if (raw === "") continue;
    const n = Number(raw.replace(",", "."));
    if (Number.isNaN(n)) return { __error: `Ungültige Zahl bei „${f.label}".` };
    out[f.key] = n;
  }
  if (typeof out.vlt !== "number") return { __error: "VLT ist erforderlich." };
  if (typeof out.tser !== "number") return { __error: "TSER ist erforderlich." };
  if (typeof out.uv !== "string") return { __error: "UV-Durchlass ist erforderlich." };
  return out;
}

export default function ProductForm({
  producers,
  categories,
  product,
}: {
  producers: Option[];
  categories: Option[];
  product?: ProductFormData;
}) {
  const router = useRouter();
  const isEdit = Boolean(product?.id);

  const [name, setName] = useState(product?.name ?? "");
  const [code, setCode] = useState(product?.code ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [family, setFamily] = useState(product?.family ?? FAMILIES[0]);
  const [mount, setMount] = useState(product?.mount ?? MOUNTS[0]);
  const [producerId, setProducerId] = useState(product?.producerId ?? producers[0]?.id ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [thicknessMil, setThicknessMil] = useState(
    product?.thicknessMil != null ? String(product.thicknessMil) : "",
  );
  const [thicknessMicron, setThicknessMicron] = useState(
    product?.thicknessMicron != null ? String(product.thicknessMicron) : "",
  );
  const [application, setApplication] = useState(product?.application ?? "");
  const [certification, setCertification] = useState(product?.certification ?? "");
  const [note, setNote] = useState(product?.note ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(product?.imageUrl ?? null);
  const [visible, setVisible] = useState(product?.visible ?? true);
  const [sortOrder, setSortOrder] = useState(String(product?.sortOrder ?? 0));

  const [single, setSingle] = useState<ValueMap>(toValueMap(product?.single ?? null));
  const [hasDual, setHasDual] = useState(Boolean(product?.dual));
  const [dual, setDual] = useState<ValueMap>(toValueMap(product?.dual ?? null));

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const effectiveSlug = useMemo(() => {
    if (slugTouched && slug) return slug;
    return toSlug(code || name);
  }, [slug, slugTouched, code, name]);

  function intOrNull(s: string): number | null {
    const t = s.trim();
    if (t === "") return null;
    const n = parseInt(t, 10);
    return Number.isNaN(n) ? null : n;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const singleValues = buildFilmValues(single);
    if ("__error" in singleValues) return setError(`Einfachverglasung: ${singleValues.__error}`);

    let dualValues: Record<string, number | string> | null = null;
    if (hasDual) {
      const dv = buildFilmValues(dual);
      if ("__error" in dv) return setError(`Isolierglas: ${dv.__error}`);
      dualValues = dv;
    }

    const payload: ProductInput = {
      code: code.trim(),
      name: name.trim(),
      slug: effectiveSlug,
      family: family as ProductInput["family"],
      mount: mount as ProductInput["mount"],
      producerId,
      categoryId: categoryId || null,
      thicknessMil: intOrNull(thicknessMil),
      thicknessMicron: intOrNull(thicknessMicron),
      application: application.trim() || null,
      certification: certification.trim() || null,
      note: note.trim() || null,
      single: singleValues as ProductInput["single"],
      dual: dualValues as ProductInput["dual"],
      imageUrl: imageUrl || null,
      visible,
      sortOrder: intOrNull(sortOrder) ?? 0,
    };

    setBusy(true);
    const res = await fetch(
      isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    setBusy(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Speichern fehlgeschlagen.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  async function remove() {
    if (!product?.id) return;
    if (!confirm(`Produkt „${product.name}" löschen?`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setBusy(false);
      setError("Löschen fehlgeschlagen.");
    }
  }

  function renderValueGrid(map: ValueMap, set: (m: ValueMap) => void) {
    return (
      <div className={styles.statGrid}>
        {FILM_VALUE_FIELDS.map((f) => (
          <div className={styles.field} key={f.key}>
            <label className={styles.label} htmlFor={`v-${f.key}`}>
              {f.label}
            </label>
            <input
              id={`v-${f.key}`}
              className="input"
              inputMode={f.kind === "number" ? "decimal" : "text"}
              value={map[f.key] ?? ""}
              onChange={(e) => set({ ...map, [f.key]: e.target.value })}
            />
          </div>
        ))}
      </div>
    );
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
          <label className={styles.label} htmlFor="code">
            Code *
          </label>
          <input
            id="code"
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
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

      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="producer">
            Hersteller *
          </label>
          <select
            id="producer"
            className="input"
            value={producerId}
            onChange={(e) => setProducerId(e.target.value)}
            required
          >
            {producers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="category">
            Serie
          </label>
          <select
            id="category"
            className="input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">— keine —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="family">
            Familie
          </label>
          <select
            id="family"
            className="input"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
          >
            {FAMILIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mount">
            Montage
          </label>
          <select
            id="mount"
            className="input"
            value={mount}
            onChange={(e) => setMount(e.target.value)}
          >
            {MOUNTS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mil">
            Stärke (mil)
          </label>
          <input
            id="mil"
            className="input"
            inputMode="numeric"
            value={thicknessMil}
            onChange={(e) => setThicknessMil(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="micron">
            Stärke (µ)
          </label>
          <input
            id="micron"
            className="input"
            inputMode="numeric"
            value={thicknessMicron}
            onChange={(e) => setThicknessMicron(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="application">
          Typische Anwendung
        </label>
        <input
          id="application"
          className="input"
          value={application}
          onChange={(e) => setApplication(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="certification">
          Zertifizierung
        </label>
        <input
          id="certification"
          className="input"
          value={certification}
          onChange={(e) => setCertification(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="note">
          Interner Hinweis (nicht öffentlich)
        </label>
        <textarea
          id="note"
          className="input"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Produktbild</label>
        <ImageUpload value={imageUrl} folder="products" onChange={setImageUrl} />
      </div>

      <fieldset style={{ border: "1px solid var(--color-divider)", padding: "var(--space-6)" }}>
        <legend className={styles.label}>Kennwerte — Einfachverglasung</legend>
        {renderValueGrid(single, setSingle)}
      </fieldset>

      <div className={styles.checkRow}>
        <input
          id="hasDual"
          type="checkbox"
          checked={hasDual}
          onChange={(e) => setHasDual(e.target.checked)}
        />
        <label htmlFor="hasDual" className={styles.label} style={{ margin: 0 }}>
          Kennwerte für Isolierglas erfassen
        </label>
      </div>
      {hasDual && (
        <fieldset style={{ border: "1px solid var(--color-divider)", padding: "var(--space-6)" }}>
          <legend className={styles.label}>Kennwerte — Isolierglas</legend>
          {renderValueGrid(dual, setDual)}
        </fieldset>
      )}

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
