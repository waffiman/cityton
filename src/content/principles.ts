/** /funktionsprinzip — scroll-linked explainer. Each entry pairs copy with a diagram. */

export type Principle = {
  id: "reflexion" | "absorption" | "uv" | "einbruchschutz" | "sichtschutz";
  kicker: string;
  title: string;
  body: string;
};

export const principles: Principle[] = [
  {
    id: "reflexion",
    kicker: "Reflexion",
    title: "Die Hitze wird abgewiesen, bevor sie im Raum ist",
    body: "Sonnenlicht ist zu etwa der Hälfte Infrarotstrahlung. Die metallisierte Schicht reflektiert diesen Anteil an der Glasoberfläche zurück nach außen — bis zu 79 % der Gesamtenergie erreichen den Raum nie. Die Klimaanlage läuft kürzer, an Südfassaden messen wir typisch 3–7,6 °C weniger.",
  },
  {
    id: "absorption",
    kicker: "Absorption",
    title: "Dieselbe Wirkung, ohne Spiegeleffekt",
    body: "Nano-keramische Partikel nehmen die Sonnenenergie auf, statt sie zurückzuwerfen. Die Scheibe bleibt von außen nahezu neutral — kein Spiegelbild an der Fassade —, während der Wärmeeintrag deutlich sinkt. Die Wahl, wenn Tageslicht und freier Blick nach außen erhalten bleiben sollen.",
  },
  {
    id: "uv",
    kicker: "UV-Schutz",
    title: "Über 99 % der UV-Strahlung endet an der Folie",
    body: "Die UV-Sperrschicht ist hochtransparent — klar wie Glas. Sichtbares Licht passiert nahezu ungehindert, der UV-Anteil wird zurückgehalten. Böden, Möbel, Textilien und ausgestellte Ware behalten ihre Farbe deutlich länger, ohne dass der Raum dunkler wird.",
  },
  {
    id: "einbruchschutz",
    kicker: "Einbruchschutz",
    title: "Die Scheibe bricht — aber sie bleibt im Rahmen",
    body: "Die 100–300 Mikron starke Sicherheitsfolie ist mit einem druckempfindlichen Kleber vollflächig verbunden. Ein Schlag wird nicht punktuell aufgenommen, sondern über die gesamte Folienfläche verteilt. Das Glas splittert, hält aber zusammen — der Einbruchsversuch dauert länger und ist laut.",
  },
  {
    id: "sichtschutz",
    kicker: "Sichtschutz",
    title: "Das Licht passiert, der Blick nicht",
    body: "Die mattierte Oberfläche streut das durchtretende Licht in alle Richtungen. Der Raum bleibt hell, das Bild dahinter löst sich auf — Milchglas-Optik, ohne die Scheibe zu tauschen. Für Trennwände, Besprechungsräume, Ordinationen und Sanitärbereiche.",
  },
];
