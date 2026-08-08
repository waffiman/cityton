/** Film series — drives /produkte, /produkte/[slug] and the home overview list. */

export type SeriesMetric = {
  label: string;
  value: string;
  /** 0–100, bar fill on the overview card. */
  bar: number;
};

export type Series = {
  slug: string;
  name: string;
  family: string;
  tag: string;
  extraTag?: string;
  /** Diagram drawn on the overview card. */
  glyph: "reflexion" | "absorption" | "kraft" | "uv";
  /** Overview-card glyph plate: dark field or paper. */
  glyphField: "dark" | "paper";
  summary: string;
  useCases: string[];
  metrics: SeriesMetric[];
  /** Detail page — only Serie R is fully written; see HANDOVER.md "Open work". */
  detail?: {
    kicker: string;
    intro: string;
    stats: { label: string; value: string; note: string }[];
    statsFootnote: string;
    facts: { kicker: string; title: string; body: string }[];
    variants?: {
      columns: string[];
      rows: string[][];
    };
    figures: { src: string; alt: string; caption: string }[];
    hero: { src: string; alt: string };
  };
};

export const series: Series[] = [
  {
    slug: "serie-r",
    name: "Serie R",
    family: "Reflektierende Folien",
    tag: "Sonnenschutz",
    glyph: "reflexion",
    glyphField: "dark",
    summary:
      "Metallisierte Aluminiumschicht — wirkt wie ein Spiegel gegen Sonnenwärme. Die wirtschaftlichste Wahl, wo Hitze das Hauptproblem ist.",
    useCases: ["Südfassade", "Schaufenster", "Halle", "Wintergarten"],
    metrics: [
      { label: "TSER", value: "bis 79 %", bar: 79 },
      { label: "VLT", value: "18 %", bar: 18 },
      { label: "UV-Schutz", value: "99 %", bar: 99 },
    ],
    detail: {
      kicker: "Sonnenschutzfolie · Außen & innen",
      intro:
        "Die metallisierte Reflexionsfolie für stark besonnte Flächen. Wo Hitze das Hauptproblem ist — Südfassaden, Schaufenster, Dachverglasungen — arbeitet die Serie R am wirtschaftlichsten.",
      stats: [
        { label: "TSER", value: "79 %", note: "Gesamtenergie abgewiesen" },
        { label: "VLT", value: "18 %", note: "Lichtdurchlass" },
        { label: "UV-Schutz", value: "99 %", note: "UV-Strahlung gefiltert" },
      ],
      statsFootnote:
        "Werte für R Silver 20, gemessen an 3 mm Klarglas. Bitte gegen das aktuelle Herstellerdatenblatt prüfen.",
      facts: [
        {
          kicker: "Technologie",
          title: "Metallisierte Reflexionsschicht",
          body: "Eine hauchdünne Aluminium-Legierung reflektiert die Infrarot-Anteile des Sonnenlichts, bevor sie ins Glas gelangen. Kratzfeste Hardcoat-Oberfläche.",
        },
        {
          kicker: "Einsatz",
          title: "Wo sie am besten wirkt",
          body: "Süd- und Westfassaden, Schaufenster, Wintergärten, Dachverglasungen, Produktions- und Lagerhallen.",
        },
        {
          kicker: "Nebeneffekt",
          title: "Sichtschutz am Tag",
          body: "Die Spiegelwirkung schützt tagsüber vor Einblick — von innen bleibt die Sicht nach draußen erhalten.",
        },
      ],
      variants: {
        columns: ["Variante", "VLT", "TSER", "UV", "Reflexion außen", "Typische Anwendung"],
        rows: [
          ["R Silver 05", "5 %", "82 %", "99 %", "hoch", "Hallen, Dachverglasung"],
          ["R Silver 20", "18 %", "79 %", "99 %", "hoch", "Süd-/Westfassade, Schaufenster"],
          ["R Silver 35", "33 %", "68 %", "99 %", "mittel", "Büro mit Tageslichtbedarf"],
          ["R Bronze 20", "19 %", "72 %", "99 %", "mittel", "Altbau, warme Fassadentöne"],
        ],
      },
      figures: [
        {
          src: "/media/modern-home.jpg",
          alt: "Wohnhaus mit Spiegelfolie",
          caption: "Einfamilienhaus, Niederösterreich — R Silver 20, außen verklebt",
        },
        {
          src: "/media/install-shopfront.jpg",
          alt: "Schaufenster-Montage",
          caption: "Schaufenster Wien 1. Bezirk — Montage im laufenden Betrieb",
        },
      ],
      hero: { src: "/media/reflective-facade.jpg", alt: "Fassade mit Reflexionsfolie" },
    },
  },
  {
    slug: "arm-platinum-spectrum",
    name: "ARM Platinum / Spectrum",
    family: "Nano-keramische Folien",
    tag: "Premium · Sputter",
    glyph: "absorption",
    glyphField: "paper",
    summary:
      "Feine, dicht aufgetragene Partikel blockieren die Sonnenenergie statt sie zu reflektieren — dadurch heller, neutraler und ohne Spiegeleffekt.",
    useCases: ["Büro", "Architektur", "Wohnraum"],
    metrics: [
      { label: "TSER", value: "bis 82 %", bar: 82 },
      { label: "VLT", value: "35 %", bar: 35 },
      { label: "UV-Schutz", value: "99 %", bar: 99 },
    ],
  },
  {
    slug: "safety",
    name: "Safety Serie",
    family: "Splitterschutzfolien",
    tag: "Sicherheit",
    extraTag: "Zertifiziert",
    glyph: "kraft",
    glyphField: "dark",
    summary:
      "Mehrschichtige, transparente Sicherheitsfolie von 100 bis 300 Mikron: das Glas splittert, bleibt aber im Rahmen — die Schlagkraft verteilt sich über die Fläche.",
    useCases: ["Geschäft", "Schule", "Erdgeschoss", "Bank"],
    metrics: [
      { label: "Stärke", value: "100–300 µ", bar: 85 },
      { label: "VLT", value: "87 %", bar: 87 },
      { label: "UV-Schutz", value: "99 %", bar: 99 },
    ],
  },
  {
    slug: "uv-protection-clear",
    name: "UV Protection Clear",
    family: "UV-Schutzfolien",
    tag: "Unsichtbar",
    glyph: "uv",
    glyphField: "paper",
    summary:
      "Hochtransparente UV-Sperrschicht — klar wie Glas. Für empfindliche Oberflächen, die ihre Farbe behalten müssen.",
    useCases: ["Museum", "Showroom", "Wohnraum"],
    metrics: [
      { label: "TSER", value: "bis 20 %", bar: 20 },
      { label: "VLT", value: "90 %", bar: 90 },
      { label: "UV-Schutz", value: "99,9 %", bar: 100 },
    ],
  },
];

export const getSeries = (slug: string) => series.find((s) => s.slug === slug);
