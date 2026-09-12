import styles from "../../../admin.module.css";
import KnowledgeBaseEditor from "@/components/admin/KnowledgeBaseEditor";

export default function NewKnowledgeBasePage() {
  return (
    <>
      <h1 className={styles.pageTitle}>Neuer Wissenseintrag</h1>
      <KnowledgeBaseEditor />
    </>
  );
}
