/** /ueber-uns content — people, trust, work. Not a Home duplicate. */

import { reviews } from "@/content/home";

type Partner = {
  kicker: string;
  title: string;
  body: string;
  link?: { href: string; label: string };
  highlight?: boolean;
};

type Media = { src: string; alt: string; label?: string };

export const about = {
  eyebrow: "Über uns",
  title: "Ein Team, das am Glas arbeitet.",
  body: "City-Ton Austria montiert Sonnenschutz-, UV-, Energiespar- und Sicherheitsfolien in Österreich und der Ukraine. Wir beraten, messen, montieren und betreuen selbst — ohne Zwischenstelle, die Verantwortung abschiebt.",
  image: {
    src: "/media/install-detail.jpg",
    alt: "Monteur bei der Folienmontage am Glas",
  },

  /**
   * Trust strip. Bracketed values are placeholders — replace with real figures.
   * Projekte (20+) and rating come from existing site content.
   */
  stats: [
    { value: "[15]+", label: "Jahre Erfahrung", placeholder: true },
    { value: "20+", label: "Projekte", placeholder: false },
    { value: "[XX.XXX]+", label: "m² verlegte Folie", placeholder: true },
    { value: `${reviews.rating}/5`, label: "Kundenbewertung", placeholder: false },
  ],

  quote:
    "„Wir verkaufen keine Folienrollen — wir liefern ein fertiges Ergebnis: Beratung, Material, Montage und Betreuung in einem Paket.“",
  quoteMeta: "Grundsatz · City-Ton Austria",

  team: {
    eyebrow: "Team",
    title: "Die Menschen hinter der Folie.",
    body: "Von der ersten Beratung und dem Aufmaß bis zur Montage und der Betreuung danach — bei City-Ton stecken dieselben Menschen hinter dem Ergebnis.",
    main: {
      src: "/media/install-team.jpg",
      alt: "Montageteam am Objekt",
      label: "Montage vor Ort",
    } satisfies Media,
    side: [
      {
        src: "/media/install-detail.jpg",
        alt: "Detailaufnahme der Folienverlegung",
        label: "Präzision am Glas",
      },
      {
        src: "/media/film-roll-1.jpg",
        alt: "Folienrolle und Material",
        label: "Material bereit",
      },
    ] satisfies Media[],
  },

  onsite: {
    eyebrow: "Praxis",
    title: "Vor Ort.",
    body: "Ein kurzer Einblick in die Realität der Montage — fertige Objekte und Arbeit am Glas.",
    images: [
      { src: "/media/install-shopfront.jpg", alt: "Schaufenster nach der Folierung" },
      { src: "/media/facade-wide.jpg", alt: "Fassade mit Sonnenschutzfolie" },
      { src: "/media/interior-2.jpg", alt: "Innenraum mit Folierung" },
    ] satisfies Media[],
    cta: { href: "/referenzen", label: "Alle Referenzen ansehen →" },
  },

  peopleSteps: {
    eyebrow: "Ablauf",
    title: "Vom ersten Gespräch bis zum fertigen Ergebnis.",
    body: "Kurz und persönlich — wir übernehmen Verantwortung in jedem Schritt.",
    items: [
      {
        num: "01",
        title: "Beratung & Aufmaß",
        body: "Wir kommen vor Ort, hören zu und messen selbst — damit die Empfehlung zum Objekt passt.",
        image: { src: "/media/install-detail.jpg", alt: "Aufmaß und Vorbereitung am Fenster" },
      },
      {
        num: "02",
        title: "Professionelle Montage",
        body: "Zertifizierte Verklebung im laufenden Betrieb möglich — staubarm und abschnittsweise.",
        image: { src: "/media/install-team.jpg", alt: "Montage am Schaufenster" },
      },
      {
        num: "03",
        title: "Übergabe & Betreuung",
        body: "Gemeinsame Abnahme, Pflegehinweise und ein Ansprechpartner auch danach.",
        image: { src: "/media/install-shopfront.jpg", alt: "Fertiges Ergebnis am Eingang" },
      },
    ],
  },

  partnersEyebrow: "Partnerschaft",
  partnersTitle: "Hersteller, denen wir vertrauen.",
  partners: [
    {
      kicker: "Hersteller",
      title: "LLumar",
      body: "Material, technische Daten und Garantie vom weltweiten Folienhersteller.",
      link: { href: "https://www.llumar.at", label: "llumar.at →" },
    },
    {
      kicker: "Hersteller",
      title: "Armolan Europe",
      body: "Serien, Schulung und Zertifizierung der Monteure.",
      link: { href: "https://armolan.eu", label: "armolan.eu →" },
    },
    {
      kicker: "City-Ton Austria",
      title: "Beratung, Aufmaß, Montage, Betreuung",
      body: "Serie wählen, zertifiziert montieren, Ansprechpartner bleiben.",
      highlight: true,
    },
  ] as Partner[],

  why: {
    eyebrow: "Vertrauen",
    title: "Warum Kunden mit uns arbeiten.",
    items: [
      {
        num: "01",
        title: "Persönlicher Ansprechpartner",
        body: "Von der ersten Messung bis zur Garantie dieselbe Person.",
      },
      {
        num: "02",
        title: "Professionelles Aufmaß",
        body: "Glasart, Ausrichtung und Ziel werden vor Ort erfasst.",
      },
      {
        num: "03",
        title: "Zertifizierte Montage",
        body: "Herstellerschulung und gültige Herstellergarantie.",
      },
      {
        num: "04",
        title: "Betreuung auch nach der Montage",
        body: "Pflegehinweise, Nachfragen und Garantieabwicklung.",
      },
    ],
  },

  rating: {
    eyebrow: "Kundenbewertung",
    value: reviews.rating,
    scale: "5",
    count: reviews.count,
    quote: "Von der Beratung bis zur Montage – professionell und zuverlässig.",
    cta: { href: "/#bewertungen", label: "Alle Bewertungen ansehen →" },
  },

  finalCta: {
    title: "Sie planen ein Projekt?",
    subtitle: "Wir beraten Sie gerne persönlich.",
    body: "Ob Sonnenschutz, UV-Schutz, Sicherheit oder Energieeffizienz — wir finden die passende Lösung für Ihr Objekt.",
    cta: { href: "/kontakt", label: "Beratung anfragen →" },
  },
};
