import type { Metadata } from "next";
import Link from "next/link";
import Corners from "@/components/Corners";
import PrincipleScroller from "@/components/PrincipleScroller";
import { principles } from "@/content/principles";
import { site } from "@/content/site";
import styles from "./principle.module.css";

export const metadata: Metadata = {
  title: "Funktionsprinzip",
  description:
    "Was eine Folie am Glas physikalisch tut: Reflexion im Sommer, Low-E im Winter, Kraftverteilung beim Einbruchsversuch.",
};

export default function PrinciplePage() {
  return (
    <>
      <section className="container" style={{ paddingTop: 56 }}>
        <h6 className="eyebrow">Funktionsprinzip</h6>
        <h1 className={styles.title}>Was eine Folie am Glas physikalisch tut</h1>
        <p className="lead" style={{ maxWidth: "60ch" }}>
          Scrollen Sie — die Zeichnung links bleibt stehen und wechselt mit dem Abschnitt.
        </p>
      </section>

      <section className="container" style={{ paddingTop: 48 }}>
        <PrincipleScroller principles={principles} />
      </section>

      <section className="container" style={{ paddingTop: 48 }}>
        <div className={`blueprint ${styles.cta}`}>
          <Corners />
          <p className={styles.ctaText}>
            Sie wollen die Werte an Ihrer eigenen Scheibe sehen? Wir bringen Musterstreifen und
            Messgerät mit.
          </p>
          <Link href="/kontakt" className="btn btn-primary blueprint">
            <Corners />
            {site.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
