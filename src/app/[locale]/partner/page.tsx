import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";
import { pageAlternates } from "@/lib/seo";

// Hardcoded German content regardless of locale — see pageAlternates' doc comment.
export const metadata: Metadata = {
  title: "Für Partner",
  alternates: pageAlternates("/partner", "de", { hasEnglish: false }),
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Für Partner (B2B)"
      note="Objektpreise, Ablauf für Baufirmen, Glasereien und Facility-Management, Downloadbereich für Datenblätter."
    />
  );
}
