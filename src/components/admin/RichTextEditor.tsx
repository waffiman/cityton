"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import styles from "@/app/admin/admin.module.css";
import editorStyles from "./rich-text.module.css";

/**
 * Minimal rich-text editor (Tiptap StarterKit). Emits HTML on every change.
 */
export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: editorStyles.content },
    },
  });

  // Keep external resets (e.g. loading a post) in sync.
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) return <div className={editorStyles.shell} />;

  const btn = (active: boolean) =>
    `${styles.badge} ${active ? styles.badgeOn : ""}`.trim();

  return (
    <div className={editorStyles.shell}>
      <div className={editorStyles.toolbar}>
        <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </button>
        <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
          I
        </button>
        <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>
        <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • Liste
        </button>
        <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. Liste
        </button>
        <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Zitat
        </button>
        <button type="button" className={styles.badge} onClick={() => editor.chain().focus().undo().run()}>
          ↶
        </button>
        <button type="button" className={styles.badge} onClick={() => editor.chain().focus().redo().run()}>
          ↷
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
