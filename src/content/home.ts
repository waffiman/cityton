/** Home-page content blocks. */

export type Benefit = {
  icon: "sun" | "shield" | "bolt" | "impact";
  title: string;
  body: string;
  meta: string;
};

export const benefits: Benefit[] = [
  {
    icon: "sun",
    title: "Sonnenschutz",
    body: "Bis zu 82 % der Sonnenenergie werden abgewiesen — messbar kühlere Räume ohne Klimaanlage.",
    meta: "TSER BIS 82 %",
  },
  {
    icon: "shield",
    title: "UV-Schutz",
    body: "99 % der UV (A und B)-Strahlung bleiben draußen. Böden, Möbel und Ware verlieren ihre Farbe nicht.",
    meta: "UV BIS 99 %",
  },
  {
    icon: "bolt",
    title: "Energieeffizienz",
    body: "Im Sommer weniger Kühllast, im Winter weniger Wärmeverlust durch das Glas.",
    meta: "GANZJÄHRIG",
  },
  {
    icon: "impact",
    title: "Sicherheit",
    body: "Die Sicherheitsfolie hält Splitter zusammen und verteilt die Schlagkraft über die Fläche.",
    meta: "100–300 MIKRON",
  },
];

/** Before/after comparison table on the dark field. */
export const comparisonRows: [without: string, applied: string][] = [
  ["Möbel bleichen aus", "99 % UV blockiert"],
  ["Raum heizt sich auf", "bis 80 % Hitze reflektiert"],
  ["Splitter fliegen", "Splitter bleiben gebunden"],
  ["Blendung am Monitor", "Licht sanft gestreut"],
  ["Alltag einsehbar", "Einwegspiegel am Tag"],
];

export type ProcessStep = {
  title: string;
  body: string;
  video: string;
  poster: string;
  /** Seconds into the clip where the loop should start. */
  startAt?: number;
  /** Loop length in seconds from startAt. */
  clipLength?: number;
};

export const processSteps: ProcessStep[] = [
  {
    title: "Beratung & Messung",
    body: "Vor Ort: Glasart, Ausrichtung, Temperatur und Ziel werden aufgenommen.",
    video: "/media/ablauf-messung.mp4",
    poster: "/media/install-detail.jpg",
    startAt: 3,
  },
  {
    title: "Muster & Auswahl",
    body: "Musterstreifen direkt am eigenen Fenster — Sie sehen die Wirkung vorher.",
    video: "/media/ablauf-beratung.mp4",
    poster: "/media/film-roll-1.jpg",
    clipLength: 5,
  },
  {
    title: "Montage",
    body: "Staubarm, im laufenden Betrieb möglich. Meist an einem Arbeitstag fertig.",
    video: "/media/ablauf-montage.mp4",
    poster: "/media/facade-wide.jpg",
    clipLength: 5,
  },
  {
    title: "Abnahme & Garantie",
    body: "Gemeinsame Kontrolle, Pflegehinweise, Herstellergarantie schriftlich.",
    video: "/media/ablauf-abnahme.mp4",
    poster: "/media/install-team.jpg",
    clipLength: 5,
  },
];

export const reviews = {
  rating: "4,9",
  count: 18,
  /** TODO(client): replace with real Google reviews (see HANDOVER.md). */
  quotes: [
    {
      body: "[Google-Rezension einfügen — 2 bis 3 Sätze über Beratung, Termin und Ergebnis.]",
      meta: "Name · Objekt · Monat 2026",
    },
    {
      body: "[Google-Rezension einfügen — idealerweise eine, die eine konkrete Zahl oder Wirkung nennt.]",
      meta: "Name · Objekt · Monat 2026",
    },
    {
      body: "[Google-Rezension einfügen — gerne eine B2B-Stimme, Büro oder Geschäft.]",
      meta: "Name · Objekt · Monat 2026",
    },
  ],
};

export const faq: { q: string; a: string }[] = [
  {
    q: "Wie lange hält eine Fensterfolie?",
    a: "Innen verklebte Folien halten in der Regel 10–15 Jahre, außen verklebte 7–10 Jahre. Auf Material und Ausführung gibt es Herstellergarantie.",
  },
  {
    q: "Wird der Raum dunkel?",
    a: "Nicht zwangsläufig. Der Lichtdurchlass (VLT) reicht je Serie von 18 % bis 90 % — moderne Sputterfolien halten die Hitze zurück und lassen das Licht durch.",
  },
  {
    q: "Kann die Folie das Glas beschädigen?",
    a: "Bei richtiger Auswahl nein. Entscheidend sind Glasaufbau, Ausrichtung und Randverbund — deshalb prüfen wir jede Scheibe vor der Empfehlung.",
  },
  {
    q: "Wie lange dauert die Montage?",
    a: "Eine Wohnung oder ein Schaufenster meist an einem Arbeitstag, im laufenden Betrieb. Große Fassaden planen wir in Abschnitten.",
  },
  {
    q: "Was kostet das?",
    a: "Der Preis hängt von Fläche, Serie und Zugänglichkeit ab. Die Beratung und das Angebot sind kostenlos.",
  },
];

export const consultation = {
  eyebrow: "Für Privatkunden",
  title: ["Erst messen.", "Dann entscheiden."],
  body: "Wir kommen mit Messgerät und Musterstreifen zu Ihnen, halten die Werte an Ihrer eigenen Scheibe fest und rechnen aus, was die Folie bringt.",
  specs: [
    { label: "TERMIN", value: "innerhalb von 48 Stunden" },
    { label: "DAUER", value: "rund 30 Minuten vor Ort" },
    { label: "KOSTEN", value: "keine — auch ohne Auftrag" },
  ],
  image: { src: "/media/interior-2.jpg", alt: "Wohnraum mit getönter Verglasung" },
};
