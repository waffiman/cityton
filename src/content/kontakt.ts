/**
 * Kontakt page copy and form option lists.
 * Temporary map pin: Brandenburg Gate until a real AT address arrives.
 */

export const kontakt = {
  eyebrow: "Kontakt",
  title: "Kostenlose Beratung anfragen",
  lead:
    "Schildern Sie kurz Objekt und Ziel — wir melden uns mit Terminvorschlag und den nächsten Schritten. Musterstreifen und Messung vor Ort möglich.",
  hours: "Mo–Fr 9:00–17:00",
  mapLabel: "Standort (Platzhalter)",
  mapNote: "Adresse vorübergehend — Brandenburg Gate, Berlin.",
  /** OSM embed bbox around Brandenburg Gate (~52.5163, 13.3777). */
  mapEmbedSrc:
    "https://www.openstreetmap.org/export/embed.html?bbox=13.3707%2C52.5130%2C13.3847%2C52.5195&layer=mapnik&marker=52.516275%2C13.377704",
  mapLinkHref: "https://www.openstreetmap.org/?mlat=52.516275&mlon=13.377704#map=17/52.516275/13.377704",
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
