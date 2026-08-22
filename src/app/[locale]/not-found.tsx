import Link from "next/link";
import Corners from "@/components/Corners";

export default function NotFound() {
  return (
    <section className="container" style={{ paddingBlock: 100 }}>
      <div className="blueprint" style={{ padding: "64px 32px", maxWidth: 640 }}>
        <Corners />
        <h6 className="eyebrow">Fehler 404</h6>
        <h1 style={{ fontSize: 40, margin: "0 0 12px" }}>Diese Seite gibt es nicht</h1>
        <p className="muted" style={{ maxWidth: "48ch" }}>
          Der Link ist vermutlich veraltet. Über die Navigation oben finden Sie Produkte,
          Funktionsprinzip und Kontakt.
        </p>
        <Link href="/" className="btn btn-secondary" style={{ marginTop: 18 }}>
          Zurück zur Startseite
        </Link>
      </div>
    </section>
  );
}
