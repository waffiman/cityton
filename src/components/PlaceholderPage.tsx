import Link from "next/link";
import Corners from "./Corners";
import styles from "./PlaceholderPage.module.css";

/**
 * Route that exists in the sitemap but has no designed content yet.
 * Delete the page file (or replace the body) as each one is built out —
 * see HANDOVER.md, "Open work".
 */
export default function PlaceholderPage({ title, note }: { title: string; note?: string }) {
  return (
    <section className="container" style={{ paddingBlock: "80px" }}>
      <div className={`blueprint ${styles.plate}`}>
        <Corners />
        <h6 className="eyebrow">Nächste Runde</h6>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.body}>
          {note ??
            "Diese Seite ist im Sitemap vorgesehen, aber noch nicht gestaltet. Inhalt und Layout folgen in der nächsten Runde."}
        </p>
        <Link href="/" className="btn btn-secondary" style={{ marginTop: 22 }}>
          Zurück zur Startseite
        </Link>
      </div>
    </section>
  );
}
