/**
 * Kontakt page copy and form option lists.
 * Temporary map pin: Wien until a real street address arrives.
 */

export const kontakt = {
  eyebrow: "Kontakt",
  title: "Kostenlose Beratung anfragen",
  lead:
    "Schildern Sie kurz Objekt und Ziel — wir melden uns mit Terminvorschlag und den nächsten Schritten. Musterstreifen und Messung vor Ort möglich.",
  hours: "Mo–Fr 9:00–17:00",
  mapLabel: "Standort (Platzhalter)",
  mapNote: "Adresse vorübergehend — Wien, Österreich.",
  /** Google Maps embed centered on Wien. */
  mapEmbedSrc: "https://www.google.com/maps?q=Wien,+Austria&hl=de&z=12&output=embed",
  mapLinkHref: "https://www.google.com/maps?q=Wien,+Austria&hl=de&z=12",
  mapTitle: "Karte — Wien, Österreich (Platzhalter)",
  success:
    "Danke — Ihre Anfrage ist eingegangen. Wir melden uns in Kürze bei Ihnen.",
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
