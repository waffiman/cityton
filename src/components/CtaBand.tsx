import Link from "next/link";
import { site } from "@/content/site";
import styles from "./CtaBand.module.css";

/**
 * Full-bleed closing call to action. Lifted out of the Produkte page so
 * Funktionsprinzip and Galerie close on the same note.
 */
export default function CtaBand({
  title,
  body,
  href = "/kontakt",
  cta = site.cta,
}: {
  title: string;
  body: string;
  href?: string;
  cta?: string;
}) {
  return (
    <section className={`section--5 on-dark ${styles.band}`}>
      <div className={styles.fx} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.body}>{body}</p>
        <Link href={href} className="btn btn-primary btn-lg">
          {cta}
        </Link>
      </div>
    </section>
  );
}
