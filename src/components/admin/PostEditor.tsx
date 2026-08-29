"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import { type PostInput, toSlug } from "@/lib/admin-schemas";
import ImageUpload from "./ImageUpload";
import MultiImageUpload from "./MultiImageUpload";
import RichTextEditor from "./RichTextEditor";

export type PostFormData = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverUrl: string | null;
  galleryUrls: string[];
  contentHtml: string;
  status: string;
};

export default function PostEditor({ post }: { post?: PostFormData }) {
  const router = useRouter();
  const isEdit = Boolean(post?.id);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverUrl, setCoverUrl] = useState<string | null>(post?.coverUrl ?? null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>(post?.galleryUrls ?? []);
  const [contentHtml, setContentHtml] = useState(post?.contentHtml ?? "");
  const [status] = useState(post?.status ?? "draft");

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const effectiveSlug = useMemo(
    () => (slugTouched && slug ? slug : toSlug(title)),
    [slug, slugTouched, title],
  );

  async function save(nextStatus?: "draft" | "published") {
    setError(null);
    if (!title.trim()) return setError("Titel ist erforderlich.");
    const finalStatus = (nextStatus ?? status) as "draft" | "published";

    const payload: PostInput = {
      slug: effectiveSlug,
      title: title.trim(),
      excerpt: excerpt.trim() || null,
      coverUrl: coverUrl || null,
      galleryUrls,
      contentHtml,
      status: finalStatus,
    };

    setBusy(true);
    const res = await fetch(isEdit ? `/api/admin/posts/${post!.id}` : "/api/admin/posts", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    setBusy(false);
    if (!res.ok || !data.ok) return setError(data.error ?? "Speichern fehlgeschlagen.");
    router.push("/admin/posts");
    router.refresh();
  }

  async function remove() {
    if (!post?.id) return;
    if (!confirm(`Beitrag „${post.title}" löschen?`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/posts/${post.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
    } else {
      setBusy(false);
      setError("Löschen fehlgeschlagen.");
    }
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">
          Titel *
        </label>
        <input
          id="title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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

      <div className={styles.field}>
        <label className={styles.label} htmlFor="excerpt">
          Kurztext (Vorschau)
        </label>
        <textarea
          id="excerpt"
          className="input"
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Titelbild</label>
        <ImageUpload value={coverUrl} folder="posts" onChange={setCoverUrl} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Weitere Bilder (Galerie)</label>
        <MultiImageUpload value={galleryUrls} folder="posts" onChange={setGalleryUrls} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Inhalt</label>
        <RichTextEditor value={contentHtml} onChange={setContentHtml} />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="button" className="btn btn-secondary" onClick={() => save("draft")} disabled={busy}>
          Als Entwurf speichern
        </button>
        <button type="button" className="btn btn-primary" onClick={() => save("published")} disabled={busy}>
          {busy ? "…" : "Veröffentlichen"}
        </button>
        {isEdit && (
          <button type="button" className={styles.dangerBtn} onClick={remove} disabled={busy}>
            Löschen
          </button>
        )}
      </div>
      <p className={styles.muted}>
        Aktueller Status: {status === "published" ? "Veröffentlicht" : "Entwurf"}
      </p>
    </div>
  );
}
