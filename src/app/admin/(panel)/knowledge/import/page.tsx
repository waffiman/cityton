import Link from "next/link";
import styles from "../../../admin.module.css";
import KnowledgeBaseImport from "@/components/admin/KnowledgeBaseImport";

export default function ImportKnowledgeBasePage() {
  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Q&amp;A importieren</h1>
          <p className={styles.pageLead}>
            Mehrere Wissenseinträge in einem Schritt aus einer JSON-Datei anlegen.
          </p>
        </div>
        <Link href="/admin/knowledge" className="btn btn-secondary">
          Zurück
        </Link>
      </div>
      <KnowledgeBaseImport />
    </>
  );
}
