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
    src: "/media/owner.jpg",
    alt: "Inhaber und Ansprechpartner von City-Ton Austria",
  },

  /**
   * Trust strip. Bracketed values are placeholders — replace with real figures.
   * Projekte (20+) and rating come from existing site content.
   */
  stats: [
    { value: "[15]+", label: "Jahre Erfahrung", placeholder: true },
    { value: "20+", label: "Projekte", placeholder: false },
    { value: "[1000]+", label: "m² verlegte Folie", placeholder: true },
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
      src: "/media/women-applying-window-tint.jpg",
      alt: "Inhaber bei der Arbeit am Glas",
      label: "Arbeit am Glas",
    } satisfies Media,
    side: [
      {
        src: "/media/Architect-1.jpg",
        alt: "Material wird vor Ort ausgepackt und vorbereitet",
        label: "Material bereit",
      },
      {
        src: "/media/facade-wide-crop.jpg",
        alt: "Folienmontage an einem Schaufenster",
        label: "Montage vor Ort",
      },
    ] satisfies Media[],
  },

  onsite: {
    eyebrow: "Praxis",
    title: "Vor Ort.",
    body: "Ein kurzer Einblick in die Realität der Montage — fertige Objekte und Arbeit am Glas.",
    images: [
      { src: "/media/referenzen/gallery_4.png", alt: "Wohnobjekt mit dual-reflektierender Folie" },
      { src: "/media/reflective-facade-upscaled.jpg", alt: "Fassade mit reflektierender Sonnenschutzfolie" },
      { src: "/media/referenzen/gallery_1.png", alt: "Referenzobjekt nach der Folierung" },
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
        image: { src: "/media/consult-2.jpg", alt: "Vorbereitung und Material vor dem Aufmaß" },
      },
      {
        num: "02",
        title: "Professionelle Montage",
        body: "Zertifizierte Verklebung im laufenden Betrieb möglich — staubarm und abschnittsweise.",
        image: { src: "/media/install-work-1.jpg", alt: "Professionelle Folienmontage am Fenster" },
      },
      {
        num: "03",
        title: "Übergabe & Betreuung",
        body: "Gemeinsame Abnahme, Pflegehinweise und ein Ansprechpartner auch danach.",
        image: { src: "/media/install-together-small.jpg", alt: "Montageabschluss am Objekt" },
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
