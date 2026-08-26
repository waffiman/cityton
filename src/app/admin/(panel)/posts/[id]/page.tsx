import Link from "next/link";
import { notFound } from "next/navigation";
import PostEditor, { type PostFormData } from "@/components/admin/PostEditor";
import { prisma } from "@/lib/db";
import styles from "../../../admin.module.css";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  const data: PostFormData = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverUrl: post.coverUrl,
    galleryUrls: post.galleryUrls,
    contentHtml: post.contentHtml,
    status: post.status,
  };

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>{post.title}</h1>
          <p className={styles.pageLead}>
            <Link href="/admin/posts" className={styles.rowLink}>
              ← Alle Beiträge
            </Link>
            {post.status === "published" && (
              <>
                {" · "}
                <Link href={`/blog/${post.slug}`} className={styles.rowLink} target="_blank">
                  Ansehen ↗
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
      <PostEditor post={data} />
    </>
  );
}
