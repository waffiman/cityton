/**
 * Kontakt page copy and form option lists.
 */

export const kontakt = {
  title: "Kostenlose Beratung anfragen",
  lead:
    "Schildern Sie kurz Objekt und Ziel — wir melden uns mit Terminvorschlag und den nächsten Schritten. Musterstreifen und Messung vor Ort möglich.",
  hours: "Mo–Fr 9:00–17:00",
  mapLabel: "Standort",
  /** Google Maps embed centered on Wien. */
  mapEmbedSrc: "https://www.google.com/maps?q=Adelheid-Popp-Gasse+24%2C+1220+Wien%2C+%C3%96sterreich&hl=de&z=16&output=embed",
  mapLinkHref: "https://www.google.com/maps?q=Adelheid-Popp-Gasse+24%2C+1220+Wien%2C+%C3%96sterreich&hl=de&z=16",
  mapTitle: "Karte — Adelheid-Popp-Gasse 24, 1220 Wien",
  success:
    "Danke — Ihre Anfrage ist eingegangen. Wir melden uns in Kürze bei Ihnen.",
  messageLabel: "Nachricht",
  messagePlaceholder:
    "Worum geht es? Glasart, Himmelsrichtung oder was Sie stört — alles hilft bei der Einschätzung.",
  submit: "Anfrage senden",
  submitting: "Wird gesendet…",
  privacyPrefix: "Ich habe die",
  privacyLink: "Datenschutzerklärung",
  privacySuffix:
    "gelesen und willige in die Verarbeitung meiner Angaben zur Bearbeitung der Anfrage ein.",
  objectTypes: [
    { value: "wohnung", label: "Wohnung" },
    { value: "haus", label: "Haus" },
    { value: "buero", label: "Büro" },
    { value: "gewerbe", label: "Gewerbe" },
    { value: "sonstiges", label: "Sonstiges" },
  ] as const,
  goals: [
    { value: "sonnenschutz", label: "Sonnenschutz" },
    { value: "uv", label: "UV-Schutz" },
    { value: "energie", label: "Energieeffizienz" },
    { value: "einbruchschutz", label: "Einbruchschutz" },
    { value: "privatsphaere", label: "Privatsphäre" },
  ] as const,
};

export type ObjektartValue = (typeof kontakt.objectTypes)[number]["value"];
export type GoalValue = (typeof kontakt.goals)[number]["value"];
