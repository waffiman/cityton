import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Datenschutz", robots: { index: false } };

export default function Page() {
  return (
    <PlaceholderPage
      title="Datenschutz"
      note="DSGVO-Hinweise zu Formulardaten, Hosting und eingebundenen Diensten. Text kommt vom Kunden bzw. dessen Rechtsberatung."
    />
  );
}
