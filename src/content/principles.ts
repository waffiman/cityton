/** /funktionsprinzip — scroll-linked explainer. Each entry pairs copy with a diagram. */

export type Principle = {
  id: "sommer" | "winter" | "einbruchschutz";
  kicker: string;
  title: string;
  body: string;
};

export const principles: Principle[] = [
  {
    id: "sommer",
    kicker: "Sommer",
    title: "Die Hitze wird abgewiesen, bevor sie im Raum ist",
    body: "Sonnenlicht ist zu etwa der Hälfte Infrarotstrahlung. Die metallisierte Schicht reflektiert diesen Anteil an der Glasoberfläche zurück nach außen — bis zu 79 % der Gesamtenergie erreichen den Raum nie. Die Klimaanlage läuft kürzer, an Südfassaden messen wir typisch 3–7,6 °C weniger.",
  },
  {
    id: "winter",
    kicker: "Winter",
    title: "Im Winter arbeitet dieselbe Schicht umgekehrt",
    body: "Bei tiefem Sonnenstand passiert das Tageslicht die Folie fast ungehindert. Die Wärme, die im Raum entsteht, wird von der Low-E-Beschichtung nach innen zurückgeworfen statt durch das Glas zu entweichen — der Heizbedarf sinkt.",
  },
  {
    id: "einbruchschutz",
    kicker: "Einbruchschutz",
    title: "Die Scheibe bricht — aber sie bleibt im Rahmen",
    body: "Die 100–300 Mikron starke Sicherheitsfolie ist mit einem druckempfindlichen Kleber vollflächig verbunden. Ein Schlag wird nicht punktuell aufgenommen, sondern über die gesamte Folienfläche verteilt. Das Glas splittert, hält aber zusammen — der Einbruchsversuch dauert länger und ist laut.",
  },
];
