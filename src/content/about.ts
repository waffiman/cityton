/** /ueber-uns content. */

type Partner = {
  kicker: string;
  title: string;
  body: string;
  link?: { href: string; label: string };
  highlight?: boolean;
};

export const about = {
  eyebrow: "Über uns",
  title: "Ein Team, das selbst am Glas steht",
  body: "City-Ton Austria montiert Sonnenschutz-, UV-, Energiespar- und Sicherheitsfolien in Österreich und der Ukraine. Über 20 abgeschlossene Objekte — vom Einfamilienhaus bis zum Schaufenster in der Wiener Innenstadt. Wir arbeiten mit den Folien der weltweit führenden Hersteller und montieren sie selbst; es gibt keine Zwischenstelle, die Verantwortung abschiebt.",
  image: { src: "/media/install-team.jpg", alt: "Montageteam am Schaufenster" },
  quote:
    "„Wir verkaufen keine Folienrollen — wir liefern ein fertiges Ergebnis: Beratung, Material, Montage und Betreuung in einem Paket.“",
  quoteMeta: "Grundsatz · City-Ton Austria",
  partners: [
    {
      kicker: "Hersteller",
      title: "LLumar",
      body: "Weltweiter Folienhersteller. Liefert Material, technische Datenblätter und Garantie.",
      link: { href: "https://www.llumar.at", label: "llumar.at →" },
    },
    {
      kicker: "Hersteller",
      title: "Armolan Europe",
      body: "Serien R, ARM Platinum/Spectrum, Safety und UV Clear. Schulung und Zertifizierung der Monteure.",
      link: { href: "https://armolan.eu", label: "armolan.eu →" },
    },
    {
      kicker: "City-Ton Austria",
      title: "Beratung, Aufmaß, Montage, Betreuung",
      body: "Wir wählen die Serie, montieren zertifiziert und bleiben nach der Abnahme Ihr Ansprechpartner.",
      highlight: true,
    },
  ] as Partner[],
  advantages: [
    {
      title: "Ein Ansprechpartner",
      body: "Von der ersten Messung bis zur Garantieabwicklung dieselbe Person.",
    },
    {
      title: "Messbare Zusagen",
      body: "Wir nennen TSER, VLT und die erwartete Temperaturdifferenz vor dem Auftrag.",
    },
    {
      title: "Zertifizierte Montage",
      body: "Herstellerschulung, definierte Verklebungsstandards, Herstellergarantie bleibt gültig.",
    },
    {
      title: "Im laufenden Betrieb",
      body: "Geschäfte und Büros bleiben offen — wir arbeiten staubarm und abschnittsweise.",
    },
    {
      title: "Material ab Lager",
      body: "Gängige Serien sind vorrätig — kurze Wege zwischen Zusage und Montagetermin.",
    },
    {
      title: "Objektpreise für Partner",
      body: "Montage ab 25 €/m² für Baufirmen, Glasereien und Facility-Management.",
    },
  ],
};
