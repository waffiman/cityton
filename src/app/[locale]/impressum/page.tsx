import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Impressum", robots: { index: false } };

export default function Page() {
  return (
    <PlaceholderPage
      title="Impressum"
      note="Pflichtangaben nach § 5 ECG / § 25 MedienG — Firmenwortlaut, Sitz, Firmenbuchnummer, UID, Gewerbeaufsicht, Kammer. Text kommt vom Kunden."
    />
  );
}
