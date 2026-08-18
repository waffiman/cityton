import Link from "next/link";
import PostEditor from "@/components/admin/PostEditor";
import styles from "../../../admin.module.css";

export default function NewPostPage() {
  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Neuer Beitrag</h1>
          <p className={styles.pageLead}>
            <Link href="/admin/posts" className={styles.rowLink}>
              ← Alle Beiträge
            </Link>
          </p>
        </div>
      </div>
      <PostEditor />
    </>
  );
}
