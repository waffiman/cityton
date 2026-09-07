import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import styles from "../../../admin.module.css";
import KnowledgeBaseEditor, {
  type KnowledgeBaseFormData,
} from "@/components/admin/KnowledgeBaseEditor";

export default async function EditKnowledgeBasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await prisma.knowledgeBase.findUnique({ where: { id } });
  if (!entry) notFound();

  const data: KnowledgeBaseFormData = {
    id: entry.id,
    question: entry.question,
    answer: entry.answer,
    category: entry.category,
    keywords: entry.keywords,
    locale: entry.locale,
    visible: entry.visible,
    sortOrder: entry.sortOrder,
  };

  return (
    <>
      <h1 className={styles.pageTitle}>Wissenseintrag bearbeiten</h1>
      <KnowledgeBaseEditor entry={data} />
    </>
  );
}
