import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import PrincipleScroller from "@/components/PrincipleScroller";
import { principles } from "@/content/principles";
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
        <h1 className={styles.title}>Was eine Folie am Glas physikalisch tut</h1>
        <p className="lead" style={{ maxWidth: "60ch" }}>
          Scrollen Sie — die Zeichnung links bleibt stehen und wechselt mit dem Abschnitt.
        </p>
      </section>

      <section className="container" style={{ paddingTop: 48 }}>
        <PrincipleScroller principles={principles} />
      </section>

      <CtaBand
        title="Unsicher, welche Folie passt?"
        body="Wir bringen Musterstreifen und Messgerät mit und halten die Werte an Ihrer eigenen Scheibe fest."
      />
    </>
  );
}
