import { nav, site } from "@/content/site";
import { getVisibleSeries } from "@/lib/products";

// Reads the live series list, same as the pages it points at.
export const dynamic = "force-dynamic";

/**
 * /llms.txt — the emerging convention for handing assistants a clean map of a
 * site instead of making them infer one from rendered HTML.
 *
 * Generated rather than hand-written so it can't drift from the actual
 * routes: the link list comes from `nav` and the product series come from
 * the same database query the /produkte page uses.
 */
export async function GET() {
  const series = await getVisibleSeries();
  const pageLine = (path: string, label: string, note: string) =>
    `- [${label}](${site.url}${path === "/" ? "" : path}): ${note}`;

  // Labels are spelled out here rather than read from the message files:
  // this file has no locale (it's one document for the whole site), and
  // next-intl needs a request locale to resolve `nav.*`.
  const labels: Record<string, string> = {
    "/": "Startseite",
    "/ueber-uns": "Über uns",
    "/produkte": "Produkte",
    "/funktionsprinzip": "Funktionsprinzip",
    "/gallery": "Galerie",
    "/blog": "Blog",
    "/kontakt": "Kontakt",
  };
  const notes: Record<string, string> = {
    "/": "Überblick: Leistungen, Vorher/Nachher, Ablauf, FAQ",
    "/ueber-uns": "Das Unternehmen, das Team und die Arbeitsweise",
    "/produkte": "Alle Folienserien und der Katalog der einzelnen Folien",
    "/funktionsprinzip": "Wie Sonnenschutz- und Sicherheitsfolien technisch wirken",
    "/gallery": "Referenzobjekte und ausgeführte Montagen",
    "/blog": "Fachbeiträge rund um Fensterfolien",
    "/kontakt": "Kontaktformular für die kostenlose Erstberatung",
  };

  const body = `# ${site.name}

> Beratung, Planung und fachgerechte Montage von Architektur- und Fensterfolien
> (Sonnenschutz, UV-Schutz, Sichtschutz, Sicherheit) auf Glasflächen in Wien und
> ganz Österreich. Verarbeitet werden Folien von ${site.brands.join(" und ")}.

Standort: ${site.contact.address}, Österreich
Telefon: ${site.contact.phone}
E-Mail: ${site.contact.email}
Öffnungszeiten: Mo–Fr ${site.contact.openingHours.opens}–${site.contact.openingHours.closes}

Die Website ist zweisprachig: Deutsch ohne Prefix, Englisch unter /en.
Produkt-, Serien- und Blogseiten liegen nur auf Deutsch vor.

## Seiten

${nav.map((n) => pageLine(n.href, labels[n.href] ?? n.key, notes[n.href] ?? "")).join("\n")}

## Folienserien

${series.map((s) => `- [${s.name}](${site.url}/produkte/${s.slug})`).join("\n")}

## Hinweise

- Preise werden nicht online gelistet: jedes Objekt wird nach einem
  Vor-Ort-Termin individuell kalkuliert.
- Technische Kennwerte je Folie (VLT, TSER, UV-Durchlass, g-Wert u. a.) stehen
  auf der jeweiligen Folienseite unter /produkte/folie/<slug>.
- Vollständige URL-Liste: ${site.url}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
