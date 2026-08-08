import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Blog & News" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Blog & News"
      note="Artikelliste und Detailseite. Sobald die Redaktion feststeht, wird hier eine MDX- oder CMS-Quelle angebunden."
    />
  );
}
