import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import styles from "./CtaBand.module.css";

/**
 * Full-bleed closing call to action. Lifted out of the Produkte page so
 * Funktionsprinzip and Galerie close on the same note.
 */
export default async function CtaBand({
  title,
  body,
  href = "/kontakt",
  cta,
}: {
  title: string;
  body: string;
  href?: string;
  cta?: string;
}) {
  const resolvedCta = cta ?? (await getTranslations("site"))("cta");

  return (
    <section className={`section--5 on-dark ${styles.band}`}>
      <div className={styles.fx} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.body}>{body}</p>
        <Link href={href} className="btn btn-primary btn-lg">
          {resolvedCta}
        </Link>
      </div>
    </section>
  );
}
