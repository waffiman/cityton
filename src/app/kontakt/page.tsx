import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Kontakt" };

/**
 * Every CTA on the site points here. The form itself is the first piece of
 * open work — see HANDOVER.md ("Open work → Kontaktformular").
 */
export default function Page() {
  return (
    <PlaceholderPage
      title="Kontakt"
      note="Anfrageformular (Name, Objektart, Fläche, Ziel, Kontaktweg), Kontaktdaten und Karte. Formular-Endpunkt und Datenschutz-Hinweis stehen noch aus."
    />
  );
}
