import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Referenzen" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Kejsy / Referenzen"
      note="Objektgalerie mit Vorher/Nachher, Serie, Fläche und Messwerten pro Projekt. Fotos und Objektdaten stehen noch aus."
    />
  );
}
