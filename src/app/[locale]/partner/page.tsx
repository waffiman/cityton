import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";
import { pageAlternates } from "@/lib/seo";

// Hardcoded German content regardless of locale — see pageAlternates' doc comment.
// noindex: PlaceholderPage.tsx's own doc comment calls this "no designed
// content yet" — a one-line to-do note, not real page copy. It's still
// linked from the footer, so it's reachable and crawlable; just not something
// worth having Google index as a real page until it's actually built out.
// Rendered per request: the layout's footer reads the series list from the
// database, which isn't reachable while the Docker image is being built.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Für Partner",
  alternates: pageAlternates("/partner", "de", { hasEnglish: false }),
  robots: { index: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Für Partner (B2B)"
      note="Objektpreise, Ablauf für Baufirmen, Glasereien und Facility-Management, Downloadbereich für Datenblätter."
    />
  );
}
