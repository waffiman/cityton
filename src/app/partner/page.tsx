import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Für Partner" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Für Partner (B2B)"
      note="Objektpreise, Ablauf für Baufirmen, Glasereien und Facility-Management, Downloadbereich für Datenblätter."
    />
  );
}
