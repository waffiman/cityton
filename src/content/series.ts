/**
 * Film series — drives /produkte, /produkte/[slug] and the home overview list.
 *
 * AUFBAU DIESER DATEI
 * -------------------
 *   1. `films`  — Rohdaten: jede Folie aus den Musterbüchern, ein Eintrag je Produkt.
 *   2. Helfer   — Formatierung, Filter, Sortierung, Kennwert-Spannen.
 *   3. `series` — die Seiteninhalte. Alle Zahlen werden aus `films` abgeleitet;
 *                 in den Texten steht kein hartkodierter Kennwert mehr.
 *
 * Neue Zahl vom Hersteller?  Nur in `films` ändern — Karten, Tabellen und
 * Fließtexte ziehen automatisch nach.
 *
 * DATENQUELLE
 * -----------
 *   - Armolan-Musterbuch "Professional Window Films" (Innen- und Außenfolien)
 *   - LLumar-Musterordner (Interior / Exterior Helios) sowie LLumar DE,
 *     © 2014 Eastman Chemical Company, Version 4.02.0615
 *   - Prüfbericht 2022-08-5319-02 · DIN EN 12600:2003-04 · ARM Safety 8 mil
 *   - Test Report  2022-08-5319-04 · DIN EN 356        · ARM Safety clear 12 mil
 *
 * Messbasis: Einfachverglasung (`single`). Werte für Isolierglas (`dual`) liegen
 * nur für die LLumar-Folien vor. Vor jedem Angebot gegen das aktuelle
 * Herstellerdatenblatt prüfen.  Stand: 13.08.2026
 */

/* ------------------------------------------------------------------ *
 * 1. ROHDATEN
 * ------------------------------------------------------------------ */

export type FilmFamily =
  | "reflektierend"
  | "sputtered"
  | "dual-reflektierend"
  | "spektralselektiv"
  | "low-e"
  | "klar"
  | "sicherheit"
  | "sichtschutz";

export type FilmValues = {
  /** % Lichtdurchlässigkeit (Visible Light Transmission). */
  vlt: number;
  /** % Gesamtsonnenenergie abgewiesen (Total Solar Energy Rejected). */
  tser: number;
  /** % UV-Durchlässigkeit — Text, weil das Musterbuch "<1" bzw. ">5" druckt. */
  uv: string;
  /** % Blendschutz (Glare Reduction). */
  glare?: number;
  /** % Strahlungsdurchlässigkeit. */
  solarTransmission?: number;
  /** % Strahlungsreflexion nach außen. */
  solarReflection?: number;
  /** % Strahlungsabsorption. */
  solarAbsorption?: number;
  /** % Lichtreflexion gesamt — nur Armolan, dort nicht nach außen/innen getrennt. */
  visibleReflection?: number;
  /** % Lichtreflexion nach außen — nur LLumar. */
  visibleReflectionExt?: number;
  /** % Lichtreflexion nach innen — nur LLumar. */
  visibleReflectionInt?: number;
  /** Abschirmgrad (Shading Coefficient). */
  sc?: number;
  /** Gesamtenergiedurchlässigkeit (g-Wert). */
  g?: number;
  /** Emissivität — nur LLumar. */
  emissivity?: number;
  /** Ug-Wert EN 673 in W/m²K — nur LLumar. */
  uValue?: number;
  /** Farbwiedergabe (Colour Rendering) — nur LLumar. */
  colourRendering?: number;
};

export type Film = {
  code: string;
  name: string;
  brand: "Armolan" | "LLumar";
  family: FilmFamily;
  mount: "innen" | "außen" | "innen / außen";
  thicknessMil?: number;
  thicknessMicron?: number;
  /** Kurztext für die Spalte "Typische Anwendung". */
  application?: string;
  /** Prüfzeugnis, falls vorhanden. */
  certification?: string;
  /** Interner Hinweis — erscheint nicht auf der Website. */
  note?: string;
  single: FilmValues;
  dual?: FilmValues;
};

/** Armolan-Zeile in Musterbuch-Reihenfolge. */
const av = (
  vlt: number,
  visibleReflection: number,
  solarTransmission: number,
  solarReflection: number,
  solarAbsorption: number,
  sc: number | undefined,
  uv: string,
  tser: number,
  glare: number | undefined,
): FilmValues => ({
  vlt,
  visibleReflection,
  solarTransmission,
  solarReflection,
  solarAbsorption,
  sc,
  uv,
  tser,
  glare,
});

/** LLumar-Zeile in Musterordner-Reihenfolge (PERFORMANCE DATA, 14 Werte). */
const lv = (
  solarTransmission: number,
  solarReflection: number,
  solarAbsorption: number,
  vlt: number,
  visibleReflectionExt: number,
  visibleReflectionInt: number,
  uv: string,
  sc: number | undefined,
  emissivity: number | undefined,
  uValue: number | undefined,
  glare: number,
  g: number,
  tser: number,
  colourRendering: number | undefined,
): FilmValues => ({
  solarTransmission,
  solarReflection,
  solarAbsorption,
  vlt,
  visibleReflectionExt,
  visibleReflectionInt,
  uv,
  sc,
  emissivity,
  uValue,
  glare,
  g,
  tser,
  colourRendering,
});

export const films: Film[] = [
  /* ---------- ARMOLAN · Reflektierende Folien (metallisiert) ---------- */
  {
    code: "R GREY 10",
    name: "R Grey 10",
    brand: "Armolan",
    family: "reflektierend",
    mount: "außen",
    thicknessMil: 2,
    application: "Hallen, Dachverglasung",
    single: av(8, 18, 9, 57, 34, 0.26, "<1", 76, 91),
  },
  {
    code: "R BRONZE 10",
    name: "R Bronze 10",
    brand: "Armolan",
    family: "reflektierend",
    mount: "innen / außen",
    thicknessMil: 2,
    application: "Altbau, warme Fassadentöne",
    single: av(10, 25, 8, 39, 53, 0.24, "<1", 79, 89),
  },
  {
    code: "R GREEN 10",
    name: "R Green 10",
    brand: "Armolan",
    family: "reflektierend",
    mount: "innen",
    thicknessMil: 2,
    application: "Fassade mit Grünstich",
    single: av(13, 23, 12, 32, 56, 0.32, "<1", 73, 86),
  },
  {
    code: "R BLUE 15",
    name: "R Blue 15",
    brand: "Armolan",
    family: "reflektierend",
    mount: "innen / außen",
    thicknessMil: 2,
    application: "Fassade mit Blaustich",
    single: av(13, 31, 11, 37, 52, 0.29, "<1", 75, 86),
  },
  {
    code: "R SILVER 15",
    name: "R Silver 15",
    brand: "Armolan",
    family: "reflektierend",
    mount: "innen",
    thicknessMil: 2,
    application: "Halle, Wintergarten",
    single: av(15, 68, 12, 56, 32, 0.24, "<1", 79, 84),
  },
  {
    code: "R SILVER 20",
    name: "R Silver 20",
    brand: "Armolan",
    family: "reflektierend",
    mount: "innen",
    thicknessMil: 2,
    application: "Süd-/Westfassade, Schaufenster",
    single: av(17, 55, 12, 49, 38, 0.26, "<1", 78, 81),
  },
  {
    code: "NF SOLAR BRONZE 20",
    name: "NF Solar Bronze 20",
    brand: "Armolan",
    family: "reflektierend",
    mount: "innen",
    thicknessMil: 2,
    application: "Schaufenster, warmer Ton",
    single: av(18, 46, 11, 62, 27, 0.24, "<1", 79, 80),
  },
  {
    code: "RA CHARCOAL 22",
    name: "RA Charcoal 22",
    brand: "Armolan",
    family: "reflektierend",
    mount: "außen",
    thicknessMil: 2,
    application: "Fassadensanierung (ADS-Kleber)",
    single: av(22, 38, 21, 38, 41, 0.37, "<1", 68, 76),
  },
  {
    code: "R SILVER 35",
    name: "R Silver 35",
    brand: "Armolan",
    family: "reflektierend",
    mount: "innen / außen",
    thicknessMil: 2,
    application: "Büro mit Tageslichtbedarf",
    single: av(41, 29, 31, 27, 41, 0.49, "<1", 58, 55),
  },
  {
    code: "R SILVER 50",
    name: "R Silver 50",
    brand: "Armolan",
    family: "reflektierend",
    mount: "innen / außen",
    thicknessMil: 2,
    application: "Büro, heller Wohnraum",
    single: av(55, 24, 43, 24, 33, 0.6, "<1", 48, 39),
  },
  {
    code: "R SILVER 60",
    name: "R Silver 60",
    brand: "Armolan",
    family: "reflektierend",
    mount: "innen",
    thicknessMil: 2,
    application: "Nordfassade, leichter Filter",
    single: av(62, 15, 50, 14, 36, 0.7, "<1", 40, 32),
  },

  /* ---------- ARMOLAN · Sichtschutz- und Mattfolien ---------- */
  {
    code: "SILVER MATT",
    name: "Silver Matt",
    brand: "Armolan",
    family: "sichtschutz",
    mount: "innen",
    thicknessMil: 2,
    application: "Besonnte Trennwand, Fassade",
    single: av(13, 62, 14, 56, 30, 0.25, "<1", 75, 86),
  },
  {
    code: "WHITE OUT",
    name: "White Out",
    brand: "Armolan",
    family: "sichtschutz",
    mount: "innen",
    thicknessMil: 2,
    application: "Sanitärbereich, Lager, Beschriftung",
    note: "Abschirmgrad im Musterbuch nicht angegeben.",
    single: av(15, 89, 26, 69, 5, undefined, "<1", 65, 92),
  },
  {
    code: "WHITE MATT",
    name: "White Matt",
    brand: "Armolan",
    family: "sichtschutz",
    mount: "innen",
    thicknessMil: 2,
    application: "Besprechungsraum, Praxis, Büro",
    single: av(66, 22, 60, 18, 22, 0.76, "<1", 19, 28),
  },

  /* ---------- ARMOLAN · Sicherheits- und Klarfolien ---------- */
  {
    code: "ARM ANTI GRAFFITY 4 MIL",
    name: "ARM Anti Graffity 4 mil",
    brand: "Armolan",
    family: "sicherheit",
    mount: "innen",
    thicknessMil: 4,
    thicknessMicron: 100,
    application: "Opferschicht gegen Kratzer und Graffiti",
    note: "Blendschutz im Musterbuch nicht angegeben.",
    single: av(88, 10, 87, 10, 4, 0.97, "<1", 13, undefined),
  },
  {
    code: "SAFETY 7 MIL CLEAR",
    name: "Safety 7 mil Clear",
    brand: "Armolan",
    family: "sicherheit",
    mount: "innen",
    thicknessMil: 7,
    thicknessMicron: 175,
    application: "Verletzungsschutz, Splitterbindung",
    single: av(87, 10, 79, 8, 13, 0.95, "<1", 2, 1),
  },
  // {
  //   code: "ARM SAFETY 8 MIL",
  //   name: "ARM Safety 8 mil",
  //   brand: "Armolan",
  //   family: "sicherheit",
  //   mount: "innen",
  //   thicknessMil: 8,
  //   thicknessMicron: 200,
  //   application: "Verletzungsschutz nach EN 12600",
  //   certification: "DIN EN 12600 — Klasse 2 (B) 2",
  //   note:
  //     "Diese Stärke ist im Musterbuch nicht abgebildet; sie stammt aus dem Prüfbericht " +
  //     "2022-08-5319-02. Die optischen Werte sind vom Safety 7 mil übernommen (ANNAHME) — " +
  //     "vor Veröffentlichung beim Hersteller bestätigen lassen.",
  //   single: av(87, 10, 79, 8, 13, 0.95, "<1", 2, 1),
  // },
  {
    code: "SAFETY 12 MIL CLEAR",
    name: "Safety 12 mil Clear",
    brand: "Armolan",
    family: "sicherheit",
    mount: "innen",
    thicknessMil: 12,
    thicknessMicron: 300,
    application: "Einbruchhemmung nach EN 356",
    certification: "DIN EN 356 — Klasse P1A",
    single: av(87, 10, 78, 9, 13, 0.95, "<1", 4, 2),
  },
  {
    code: "UV PROTECTION CLEAR",
    name: "UV Protection Clear",
    brand: "Armolan",
    family: "klar",
    mount: "innen",
    thicknessMil: 2,
    application: "Museum, Juwelier, Showroom",
    single: av(89, 6, 81, 6, 13, 0.98, "<1", 15, 2),
  },

  /* ================================================================== *
   * LLUMAR — derzeit nicht auf der Website verwendet, aber vollständig
   * erfasst. Kommt LLumar nicht ins Vertriebsprogramm, diesen Block
   * löschen: Arrays werden nicht getreeshaked und immer mit ausgeliefert.
   * ================================================================== */

  /* ---------- LLumar Interior · Reflective ---------- */
  {
    code: "RN 07 GR SR HPR",
    name: "Reflective Dark Grey (One Way Mirror)",
    brand: "LLumar",
    family: "reflektierend",
    mount: "innen",
    single: lv(7, 57, 36, 6, 60, 13, "<1", 0.17, 0.61, 5.11, 94, 0.14, 86, 75),
    dual: lv(6, 53, 41, 5, 60, 13, "<1", 0.31, 0.61, 2.55, 94, 0.27, 73, 74),
  },
  {
    code: "R 15 BL SR HPR",
    name: "Reflective Dark Blue",
    brand: "LLumar",
    family: "reflektierend",
    mount: "innen",
    single: lv(9, 41, 50, 9, 27, 62, "<1", 0.23, 0.68, 5.32, 90, 0.2, 80, 60),
    dual: lv(8, 39, 53, 9, 30, 62, "<1", 0.42, 0.68, 2.6, 90, 0.37, 63, 59),
  },
  {
    code: "R 20 SR CDF",
    name: "Reflective Dark Silver",
    brand: "LLumar",
    family: "reflektierend",
    mount: "innen",
    single: lv(11, 57, 32, 14, 62, 62, "<1", 0.21, 0.58, 5.01, 84, 0.18, 82, 85),
    dual: lv(11, 53, 36, 14, 62, 62, "<1", 0.32, 0.58, 2.52, 83, 0.28, 72, 84),
  },
  {
    code: "R 35 SR HPR",
    name: "Reflective Medium Silver",
    brand: "LLumar",
    family: "reflektierend",
    mount: "innen",
    single: lv(23, 42, 35, 30, 44, 43, "<1", 0.35, 0.71, 5.4, 67, 0.31, 69, 88),
    dual: lv(21, 41, 38, 28, 46, 45, "<1", 0.47, 0.71, 2.62, 66, 0.41, 59, 87),
  },
  {
    code: "R 50 SR HPR",
    name: "Reflective Light Silver",
    brand: "LLumar",
    family: "reflektierend",
    mount: "innen",
    single: lv(39, 27, 34, 49, 24, 26, "<1", 0.54, 0.76, 5.53, 45, 0.47, 53, 92),
    dual: lv(34, 27, 39, 45, 29, 26, "<1", 0.62, 0.76, 2.67, 45, 0.54, 46, 92),
  },

  /* ---------- LLumar Interior · Sputtered ---------- */
  {
    code: "N 1020 B SR CDF",
    name: "Sputtered Dark Bronze",
    brand: "LLumar",
    family: "sputtered",
    mount: "innen",
    single: lv(14, 46, 40, 21, 36, 33, "<1", 0.25, 0.58, 5.0, 77, 0.22, 78, 93),
    dual: lv(13, 43, 44, 20, 38, 33, "<1", 0.4, 0.58, 2.52, 76, 0.35, 65, 94),
  },
  {
    code: "N 1020 SR CDF",
    name: "Sputtered Dark Neutral",
    brand: "LLumar",
    family: "sputtered",
    mount: "innen",
    single: lv(20, 26, 54, 23, 29, 26, "<1", 0.38, 0.82, 5.69, 75, 0.33, 67, 99),
    dual: lv(18, 28, 54, 21, 33, 27, "<1", 0.56, 0.82, 2.69, 75, 0.49, 51, 98),
  },
  {
    code: "N 1035 B SR CDF",
    name: "Sputtered Medium Bronze",
    brand: "LLumar",
    family: "sputtered",
    mount: "innen",
    single: lv(26, 36, 38, 37, 25, 22, "<1", 0.39, 0.68, 5.31, 59, 0.34, 66, 93),
    dual: lv(24, 35, 41, 34, 29, 24, "<1", 0.52, 0.68, 2.6, 59, 0.45, 55, 94),
  },
  {
    code: "N 1040 SR CDF",
    name: "Sputtered Medium Neutral",
    brand: "LLumar",
    family: "sputtered",
    mount: "innen",
    single: lv(35, 16, 49, 39, 18, 15, "<1", 0.54, 0.88, 5.88, 57, 0.47, 53, 99),
    dual: lv(31, 20, 49, 36, 23, 16, "<1", 0.68, 0.88, 2.73, 56, 0.6, 40, 98),
  },
  {
    code: "N 1050 SR CDF",
    name: "Sputtered Light Neutral",
    brand: "LLumar",
    family: "sputtered",
    mount: "innen",
    single: lv(45, 12, 43, 49, 13, 10, "<1", 0.63, 0.88, 5.87, 45, 0.55, 45, 99),
    dual: lv(40, 17, 43, 45, 19, 12, "<1", 0.74, 0.88, 2.73, 45, 0.65, 35, 99),
  },
  {
    code: "N 1065 SR CDF",
    name: "Sputtered Very Light Neutral",
    brand: "LLumar",
    family: "sputtered",
    mount: "innen",
    single: lv(63, 9, 28, 68, 9, 8, "<1", 0.8, 0.89, 5.91, 24, 0.7, 30, 99),
    dual: lv(55, 14, 31, 62, 16, 11, "<1", 0.83, 0.89, 2.74, 24, 0.72, 28, 99),
  },

  /* ---------- LLumar Interior · Dual Reflective ---------- */
  {
    code: "V 14 SR CDF",
    name: "Dual Reflective Dark Neutral",
    brand: "LLumar",
    family: "dual-reflektierend",
    mount: "innen",
    single: lv(8, 50, 42, 10, 54, 24, "<1", 0.2, 0.73, 5.48, 88, 0.17, 83, 85),
    dual: lv(7, 47, 46, 10, 55, 24, "<1", 0.36, 0.73, 2.63, 88, 0.32, 68, 85),
  },
  {
    code: "DR 15 SR CDF",
    name: "Dual Reflective 15",
    brand: "LLumar",
    family: "dual-reflektierend",
    mount: "innen",
    single: lv(18, 36, 46, 17, 36, 12, "<1", 0.32, 0.62, 5.15, 81, 0.28, 72, 90),
    dual: lv(16, 36, 48, 16, 38, 13, "<1", 0.48, 0.62, 2.56, 81, 0.42, 58, 89),
  },
  {
    code: "DRN 25 SR CDF",
    name: "Dual Reflective 25",
    brand: "LLumar",
    family: "dual-reflektierend",
    mount: "innen",
    single: lv(23, 29, 48, 23, 27, 11, "<1", 0.38, 0.65, 5.23, 75, 0.33, 67, 92),
    dual: lv(20, 30, 50, 21, 31, 12, "<1", 0.55, 0.65, 2.58, 74, 0.48, 52, 91),
  },
  {
    code: "V 28 SR CDF",
    name: "Dual Reflective Medium Neutral",
    brand: "LLumar",
    family: "dual-reflektierend",
    mount: "innen",
    single: lv(23, 32, 45, 29, 32, 20, "<1", 0.39, 0.77, 5.56, 67, 0.34, 66, 91),
    dual: lv(21, 32, 47, 27, 35, 21, "<1", 0.54, 0.77, 2.66, 67, 0.47, 53, 90),
  },
  {
    code: "DRN 35 SR CDF",
    name: "Dual Reflective 35",
    brand: "LLumar",
    family: "dual-reflektierend",
    mount: "innen",
    single: lv(33, 20, 47, 36, 18, 12, "<1", 0.5, 0.72, 5.41, 60, 0.44, 56, 95),
    dual: lv(30, 23, 47, 33, 23, 13, "<1", 0.65, 0.72, 2.62, 60, 0.56, 44, 95),
  },
  {
    code: "V 38 SR CDF",
    name: "Dual Reflective Light Neutral",
    brand: "LLumar",
    family: "dual-reflektierend",
    mount: "innen",
    single: lv(31, 25, 44, 38, 25, 16, "<1", 0.46, 0.73, 5.46, 58, 0.4, 60, 93),
    dual: lv(27, 27, 46, 35, 29, 18, "<1", 0.6, 0.73, 2.64, 57, 0.53, 47, 92),
  },

  /* ---------- LLumar Interior · Spectra Select ---------- */
  {
    code: "VS 20 SR CDF",
    name: "Spectra Select 20",
    brand: "LLumar",
    family: "spektralselektiv",
    mount: "innen",
    single: lv(13, 49, 38, 21, 47, 32, "<1", 0.24, 0.52, 4.96, 77, 0.21, 79, 93),
    dual: lv(12, 47, 41, 20, 48, 33, "<1", 0.38, 0.52, 2.52, 76, 0.33, 67, 93),
  },
  {
    code: "VS 30 SR CDF",
    name: "Spectra Select 30",
    brand: "LLumar",
    family: "spektralselektiv",
    mount: "innen",
    single: lv(16, 48, 36, 26, 44, 37, "<1", 0.27, 0.53, 4.91, 71, 0.24, 76, 93),
    dual: lv(15, 46, 39, 25, 45, 37, "<1", 0.4, 0.53, 2.5, 70, 0.35, 65, 92),
  },
  {
    code: "VS 50 SR CDF",
    name: "Spectra Select 50",
    brand: "LLumar",
    family: "spektralselektiv",
    mount: "innen",
    single: lv(32, 38, 30, 50, 28, 24, "<1", 0.44, 0.54, 4.88, 44, 0.38, 62, 95),
    dual: lv(29, 37, 34, 47, 32, 26, "<1", 0.53, 0.54, 2.5, 43, 0.46, 54, 94),
  },
  {
    code: "VS 61 SR CDF",
    name: "Spectra Select 61",
    brand: "LLumar",
    family: "spektralselektiv",
    mount: "innen",
    single: lv(46, 28, 26, 61, 22, 21, "<1", 0.59, 0.71, 5.39, 32, 0.51, 49, 95),
    dual: lv(41, 29, 30, 56, 26, 24, "<1", 0.64, 0.71, 2.62, 31, 0.56, 44, 94),
  },
  {
    code: "VS 60 SR CDF",
    name: "Spectra Select 60",
    brand: "LLumar",
    family: "spektralselektiv",
    mount: "innen",
    single: lv(38, 26, 36, 66, 9, 10, "<1", 0.52, 0.6, 5.06, 27, 0.45, 55, 96),
    dual: lv(34, 27, 39, 60, 16, 13, "<1", 0.62, 0.6, 2.54, 27, 0.54, 46, 95),
  },
  {
    code: "VS 70 SR CDF",
    name: "Spectra Select 70",
    brand: "LLumar",
    family: "spektralselektiv",
    mount: "innen",
    single: lv(40, 24, 36, 69, 8, 7, "<1", 0.55, 0.59, 5.05, 23, 0.48, 52, 97),
    dual: lv(36, 26, 38, 63, 14, 11, "<1", 0.64, 0.59, 2.54, 23, 0.56, 44, 96),
  },

  /* ---------- LLumar Interior · Low-E ---------- */
  {
    code: "VE 35 SR CDF",
    name: "Low-E Neutral",
    brand: "LLumar",
    family: "low-e",
    mount: "innen",
    single: lv(20, 41, 39, 28, 36, 38, "<1", 0.31, 0.32, 4.19, 69, 0.27, 73, 92),
    dual: lv(19, 39, 42, 26, 38, 39, "<1", 0.44, 0.32, 2.3, 68, 0.38, 62, 92),
  },
  {
    code: "VE 50 SR CDF",
    name: "Low-E Light Neutral",
    brand: "LLumar",
    family: "low-e",
    mount: "innen",
    single: lv(38, 29, 33, 51, 22, 24, "<1", 0.51, 0.4, 4.46, 43, 0.44, 56, 95),
    dual: lv(34, 29, 37, 47, 26, 26, "<1", 0.59, 0.4, 2.38, 42, 0.52, 48, 94),
  },

  /* ---------- LLumar Interior · AIR / UV ---------- */
  {
    code: "AIR 75 IR SR HPR",
    name: "Infrared Absorber",
    brand: "LLumar",
    family: "klar",
    mount: "innen",
    single: lv(56, 7, 37, 78, 8, 8, "<1", 0.74, 0.89, 5.91, 13, 0.64, 36, 97),
    dual: lv(49, 13, 38, 71, 15, 13, "<1", 0.81, 0.89, 2.73, 13, 0.71, 29, 96),
  },
  {
    code: "AIR 80 BL SR HPR",
    name: "Air Blue 80",
    brand: "LLumar",
    family: "klar",
    mount: "innen",
    single: lv(44, 6, 50, 78, 8, 8, "<1", 0.64, 0.9, 5.91, 14, 0.56, 44, 94),
    dual: lv(40, 12, 48, 71, 15, 13, "<1", 0.78, 0.9, 2.74, 14, 0.68, 32, 93),
  },
  {
    code: "AU 85 UV SR HPR",
    name: "UV Shield",
    brand: "LLumar",
    family: "klar",
    mount: "innen",
    single: lv(81, 8, 11, 89, 9, 9, "<1", 0.96, 0.89, 5.7, 1, 0.83, 17, 99),
    dual: lv(71, 14, 15, 81, 15, 16, "<1", 0.86, 0.89, 2.7, 1, 0.75, 25, 99),
  },

  /* ---------- LLumar Exterior · Helios ---------- */
  {
    code: "VHE 14 SI ER HPR",
    name: "Dual Reflective Helios Dark Neutral",
    brand: "LLumar",
    family: "dual-reflektierend",
    mount: "außen",
    single: lv(7, 56, 37, 9, 58, 24, "<1", 0.18, 0.76, 5.71, 90, 0.16, 84, 85),
    dual: lv(6, 57, 37, 9, 58, 28, "<1", 0.12, 0.76, 2.72, 89, 0.11, 89, 84),
  },
  {
    code: "RHE 20 SI ER HPR",
    name: "Reflective Helios Dark Silver",
    brand: "LLumar",
    family: "reflektierend",
    mount: "außen",
    single: lv(12, 60, 28, 16, 62, 60, "<1", 0.21, 0.74, 5.7, 83, 0.19, 81, 85),
    dual: lv(11, 60, 29, 15, 62, 59, "<1", 0.17, 0.74, 2.69, 82, 0.15, 85, 85),
  },
  {
    code: "NHE 1020 BR ER HPR",
    name: "Helios Dark Bronze",
    brand: "LLumar",
    family: "sputtered",
    mount: "außen",
    single: lv(13, 52, 35, 20, 37, 34, "<1", 0.24, 0.73, 5.7, 78, 0.21, 79, 93),
    dual: lv(12, 52, 36, 19, 37, 37, "<1", 0.19, 0.73, 2.7, 77, 0.16, 84, 93),
  },
  {
    code: "NHE 1020 ER HPR",
    name: "Sputtered Helios Dark Neutral",
    brand: "LLumar",
    family: "sputtered",
    mount: "außen",
    single: lv(20, 24, 56, 22, 26, 30, "<1", 0.39, 0.86, 5.71, 75, 0.34, 66, 99),
    dual: lv(18, 28, 54, 21, 30, 30, "<1", 0.28, 0.86, 2.69, 75, 0.24, 76, 98),
  },
  {
    code: "NHE 1035 BR ER HPR",
    name: "Helios Medium Bronze",
    brand: "LLumar",
    family: "sputtered",
    mount: "außen",
    note:
      "Vom Hersteller als DEVELOPMENTAL TECHNICAL DATA gekennzeichnet — vorläufige Werte. " +
      "Emissivität, Ug-Wert und Farbwiedergabe werden nicht veröffentlicht.",
    single: lv(17, 50, 33, 27, 32, 27, "<1", 0.31, undefined, undefined, 69, 0.27, 73, undefined),
    dual: lv(14, 51, 35, 24, 32, 30, "<1", 0.24, undefined, undefined, 70, 0.2, 80, undefined),
  },
  {
    code: "RHE 35 SI ER HPR",
    name: "Reflective Helios Medium Silver",
    brand: "LLumar",
    family: "reflektierend",
    mount: "außen",
    single: lv(22, 46, 32, 29, 46, 43, "<1", 0.34, 0.74, 5.71, 68, 0.3, 70, 88),
    dual: lv(20, 46, 34, 27, 47, 44, "<1", 0.28, 0.74, 2.72, 67, 0.24, 76, 87),
  },
  {
    code: "NHE 1035 ER HPR",
    name: "Sputtered Helios Medium Neutral",
    brand: "LLumar",
    family: "sputtered",
    mount: "außen",
    single: lv(33, 14, 53, 37, 16, 19, "<1", 0.51, 0.86, 5.71, 59, 0.45, 55, 99),
    dual: lv(29, 19, 52, 34, 20, 21, "<1", 0.41, 0.86, 2.69, 59, 0.36, 64, 98),
  },
  {
    code: "RHE 50 SI ER HPR",
    name: "Reflective Helios Light Silver",
    brand: "LLumar",
    family: "reflektierend",
    mount: "außen",
    single: lv(39, 28, 33, 49, 26, 24, "<1", 0.54, 0.81, 5.71, 45, 0.47, 53, 93),
    dual: lv(34, 29, 37, 45, 28, 28, "<1", 0.45, 0.81, 2.72, 45, 0.39, 61, 92),
  },
  {
    code: "XHE 70 SS ER HPR",
    name: "Helios Spectrally Selective",
    brand: "LLumar",
    family: "spektralselektiv",
    mount: "außen",
    single: lv(37, 32, 31, 68, 9, 9, "<1", 0.51, 0.79, 5.65, 24, 0.44, 56, 96),
    dual: lv(33, 34, 33, 62, 13, 15, "<1", 0.43, 0.79, 2.7, 24, 0.37, 63, 95),
  },
  {
    code: "THE 80 BL ER HPR",
    name: "Helios 80",
    brand: "LLumar",
    family: "klar",
    mount: "außen",
    single: lv(44, 6, 50, 78, 8, 8, "<1", 0.64, 0.9, 5.71, 14, 0.56, 44, 94),
    dual: lv(39, 8, 53, 70, 13, 15, "<1", 0.53, 0.9, 2.72, 14, 0.46, 54, 93),
  },

  /* ---------- LLumar DE 2014 · Safety / Farbig-Matte ---------- */
  {
    code: "SCL SR PS 8",
    name: "Safety Clear 200µ",
    brand: "LLumar",
    family: "sicherheit",
    mount: "innen",
    thicknessMil: 8,
    thicknessMicron: 224,
    single: lv(78, 8, 14, 87, 9, 10, "<1", 0.92, 0.84, 5.6, 1, 0.8, 20, undefined),
  },
  {
    code: "N1040 SR PS 8",
    name: "Sputtered Medium Neutral 200µ",
    brand: "LLumar",
    family: "sputtered",
    mount: "innen",
    thicknessMil: 8,
    thicknessMicron: 230,
    single: lv(36, 16, 48, 41, 19, 15, "<1", 0.54, 0.84, 5.6, 54, 0.47, 53, undefined),
  },
  {
    code: "N1050 SR PS 8",
    name: "Sputtered Light Neutral 200µ",
    brand: "LLumar",
    family: "sputtered",
    mount: "innen",
    thicknessMil: 8,
    thicknessMicron: 230,
    single: lv(43, 13, 44, 49, 15, 12, "<1", 0.61, 0.84, 5.6, 44, 0.53, 47, undefined),
  },
  {
    code: "NRM PS 6",
    name: "Privacy White Matte 300µ",
    brand: "LLumar",
    family: "sichtschutz",
    mount: "innen",
    thicknessMicron: 168,
    note:
      "Einzige Folie im gesamten Bestand mit UV-Durchlässigkeit über 5 % — sie bietet " +
      "KEINEN 99-%-UV-Schutz. Nicht als UV-Schutz verkaufen.",
    single: lv(68, 18, 14, 75, 22, 23, ">5", 0.82, 0.84, 5.6, 15, 0.71, 29, undefined),
  },
];

/* ------------------------------------------------------------------ *
 * 2. HELFER
 * ------------------------------------------------------------------ */

const byCode = new Map(films.map((f) => [f.code, f]));

if (byCode.size !== films.length) {
  throw new Error("series.ts: doppelter Foliencode in `films`.");
}

/** Folie über den Katalogcode holen. Wirft beim Build, wenn der Code nicht existiert. */
export const getFilm = (code: string): Film => {
  const f = byCode.get(code);
  if (!f) throw new Error(`series.ts: unbekannter Foliencode "${code}".`);
  return f;
};

/** Folien einer Familie, aufsteigend nach Lichtdurchlässigkeit sortiert. */
export const filmsOf = (
  family: FilmFamily,
  brand: Film["brand"] = "Armolan",
): Film[] =>
  films
    .filter((f) => f.brand === brand && f.family === family)
    .sort((a, b) => a.single.vlt - b.single.vlt);

/**
 * True if a code's leading token equals `prefix` — "R GREY 10" matches "R",
 * "N1040 SR PS 8" matches "N" (no space before the model number), but
 * "RA CHARCOAL 22" and "RHE 20 SI ER HPR" do NOT match "R": the character
 * after the prefix has to be a space, a digit, or the end of the string, so
 * a bare token never swallows a longer one (R vs. RA/RHE/RN, DR vs. DRN).
 */
const hasCodePrefix = (code: string, prefix: string): boolean => {
  if (!code.startsWith(prefix)) return false;
  const rest = code.slice(prefix.length);
  return rest === "" || rest.startsWith(" ") || /^[0-9]/.test(rest);
};

/**
 * Folien über alle Marken, deren Codepräfix in `prefixes` liegt — aufsteigend
 * nach Lichtdurchlässigkeit sortiert. Grundlage für Serien, die per Codepräfix
 * statt per `family` gruppiert sind (Serie R, Spektralselektive).
 */
const filmsWithCodePrefix = (prefixes: string[]): Film[] =>
  films
    .filter((f) => prefixes.some((p) => hasCodePrefix(f.code, p)))
    .sort((a, b) => a.single.vlt - b.single.vlt);

/** Prozentwert für die Anzeige: 17 → "17 %". */
const pct = (n: number): string => `${n} %`;

/** Dezimalzahl in deutscher Schreibweise: 0.24 → "0,24". */
const dec = (n: number): string => String(n).replace(".", ",");

/**
 * UV-Schutz aus der gedruckten UV-Durchlässigkeit ableiten.
 * "<1" → "> 99 %"; alles andere wird bewusst konservativ ausgewiesen.
 */
const uvLabel = (v: FilmValues): string => (v.uv === "<1" ? "> 99 %" : "< 95 %");

/** Kleinster und größter Wert einer Kennzahl innerhalb einer Folienliste. */
const span = (list: Film[], pick: (v: FilmValues) => number) => {
  const values = list.map((f) => pick(f.single));
  return { min: Math.min(...values), max: Math.max(...values) };
};

/** Stärke als Text: "12 mil (300 µ)". */
const thickness = (f: Film): string => {
  if (f.thicknessMil && f.thicknessMicron) return `${f.thicknessMil} mil (${f.thicknessMicron} µ)`;
  if (f.thicknessMil) return `${f.thicknessMil} mil`;
  if (f.thicknessMicron) return `${f.thicknessMicron} µ`;
  return "—";
};

/* --- Vorgefilterte Listen für die Serien --- */

/**
 * Serie R: alles mit Codepräfix R, RHE, DR oder NF — markenübergreifend
 * (Armolan + LLumar). Ersetzt die frühere Beschränkung auf Armolans
 * `family: "reflektierend"`.
 */
const reflektierend = filmsWithCodePrefix(["R", "RHE", "DR", "NF"]);
/**
 * Spektralselektive Folien: alles mit Codepräfix N, DRN, V, VS, VE, AIR, NHE,
 * XHE oder THE — markenübergreifend. Ersetzt die vormals leere Kategorie
 * "ARM Platinum / Spectrum" (Nano-keramische Folien), für die nie ein
 * Musterbuch-Eintrag vorlag.
 */
const spektralselektiv = filmsWithCodePrefix([
  "N",
  "DRN",
  "V",
  "VS",
  "VE",
  "AIR",
  "NHE",
  "XHE",
  "THE",
]);
const sichtschutz = filmsOf("sichtschutz");
/** Sicherheitsfolien, nach Materialstärke aufsteigend. */
const sicherheit = filmsOf("sicherheit").sort(
  (a, b) => (a.thicknessMil ?? 0) - (b.thicknessMil ?? 0),
);

const rVlt = span(reflektierend, (v) => v.vlt);
const rTser = span(reflektierend, (v) => v.tser);
const xVlt = span(spektralselektiv, (v) => v.vlt);
const xTser = span(spektralselektiv, (v) => v.tser);
const sVlt = span(sichtschutz, (v) => v.vlt);
const sTser = span(sichtschutz, (v) => v.tser);
const safetyTser = span(sicherheit, (v) => v.tser);
const safetyMicron = {
  min: Math.min(...sicherheit.map((f) => f.thicknessMicron ?? 0)),
  max: Math.max(...sicherheit.map((f) => f.thicknessMicron ?? 0)),
};

/* --- Referenzfolien, auf die sich die Detailtexte beziehen --- */

const rLead = getFilm("R SILVER 20"); // Leitprodukt der Serie R
const rLightest = reflektierend[reflektierend.length - 1]!;
const rBestTser = reflektierend.reduce((a, b) => (b.single.tser > a.single.tser ? b : a));
const rAussen = reflektierend.filter((f) => f.mount !== "innen").length;
const rArmolan = reflektierend.filter((f) => f.brand === "Armolan").length;
const rLLumar = reflektierend.filter((f) => f.brand === "LLumar").length;

const xLead = getFilm("XHE 70 SS ER HPR"); // Leitprodukt der spektralselektiven Serie
const xAussen = spektralselektiv.filter((f) => f.mount !== "innen").length;

const en356 = getFilm("SAFETY 12 MIL CLEAR");
// const en12600 = getFilm("ARM SAFETY 8 MIL");

const uvClear = getFilm("UV PROTECTION CLEAR");

const silverMatt = getFilm("SILVER MATT");
const whiteOut = getFilm("WHITE OUT");
const whiteMatt = getFilm("WHITE MATT");

/* ------------------------------------------------------------------ *
 * 3. SEITENINHALTE
 * ------------------------------------------------------------------ */

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
  glyph: "reflexion" | "absorption" | "kraft" | "uv" | "dekor";
  /** Overview-card glyph plate: dark field or paper. */
  glyphField: "dark" | "paper";
  summary: string;
  useCases: string[];
  metrics: SeriesMetric[];
  /** Detail page — see HANDOVER.md "Open work". */
  detail?: {
    kicker: string;
    intro: string;
    stats: { label: string; value: string; note: string }[];
    statsFootnote: string;
    facts: { kicker: string; title: string; body: string }[];
    /** Optional caption/colour overrides for this series' layer schema. */
    structure?: {
      layers: { n: number; caption: string; color?: string }[];
    };
    variants?: {
      columns: string[];
      rows: string[][];
      /**
       * The exact films behind `rows`, same order — drives the product-card
       * grid shown under the comparison table on the series page. Always the
       * same array reference used to build `rows`, never a re-typed copy.
       */
      films: Film[];
    };
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
      "Reflektierende Schichten reduzieren Wärmeeintrag und Blendungen. " +
      "Besonders geeignet für Büros, Glasfassaden, Gewerbeobjekte.",
    useCases: ["Südfassade", "Schaufenster", "Halle", "Wintergarten"],
    metrics: [
      { label: "TSER", value: `bis ${pct(rTser.max)}`, bar: rTser.max },
      { label: "VLT", value: `${rVlt.min}–${pct(rVlt.max)}`, bar: rVlt.max },
      { label: "UV-Schutz", value: uvLabel(rLead.single), bar: 99 },
    ],
    detail: {
      kicker: "Sonnenschutzfolie · Außen & innen",
      intro:
        `Die metallisierte Reflexionsfolie für stark besonnte Flächen. Wo Hitze das ` +
        `Hauptproblem ist — Südfassaden, Schaufenster, Dachverglasungen — arbeitet die ` +
        `Serie R am wirtschaftlichsten. ${reflektierend.length} Varianten von Armolan ` +
        `(${rArmolan}) und LLumar (${rLLumar}) decken alles ab, von der fast blickdichten ` +
        `Hallenfolie bis zum hellen Bürofilter.`,
      stats: [
        { label: "TSER", value: pct(rLead.single.tser), note: "Gesamtenergie abgewiesen" },
        { label: "VLT", value: pct(rLead.single.vlt), note: "Lichtdurchlass" },
        { label: "Blendschutz", value: pct(rLead.single.glare ?? 0), note: "Blendung reduziert" },
      ],
      statsFootnote:
        `Werte für ${rLead.name} (Armolan) an Einfachverglasung. Andere Varianten — auch ` +
        `LLumar — siehe Tabelle. Bitte gegen das aktuelle Herstellerdatenblatt prüfen.`,
      facts: [
        {
          kicker: "Technologie",
          title: "Metallisierte Reflexionsschicht",
          body:
            `Eine hauchdünne Aluminium-Legierung reflektiert die Infrarot-Anteile des ` +
            `Sonnenlichts, bevor sie ins Glas gelangen. Kratzfeste Hardcoat-Oberfläche, ` +
            `Materialstärke ${thickness(rLead)}.`,
        },
        {
          kicker: "Einsatz",
          title: "Wo sie am besten wirkt",
          body:
            `Süd- und Westfassaden, Schaufenster, Wintergärten, Dachverglasungen, ` +
            `Produktions- und Lagerhallen. ${rAussen} der ${reflektierend.length} Varianten ` +
            `sind auch als Außenfolie erhältlich — für Objekte ohne Zugang von innen.`,
        },
        {
          kicker: "Nebeneffekt",
          title: "Sichtschutz am Tag",
          body:
            "Die Spiegelwirkung schützt tagsüber vor Einblick — von innen bleibt die Sicht " +
            "nach draußen erhalten. Nachts kehrt sich der Effekt um: bei Licht im Raum ist " +
            "von außen wieder alles sichtbar.",
        },
        {
          kicker: "Auswahl",
          title: "Dunkler heißt kühler",
          body:
            `Zwischen ${rLightest.name} (${pct(rLightest.single.vlt)} VLT, ` +
            `${pct(rLightest.single.tser)} TSER) und ${rBestTser.name} ` +
            `(${pct(rBestTser.single.vlt)} VLT, ${pct(rBestTser.single.tser)} TSER) liegen ` +
            `${rBestTser.single.tser - rLightest.single.tser} Punkte Wärmeabweisung. Je ` +
            `heller die Folie, desto weniger Hitzeschutz — dieser Zielkonflikt lässt sich ` +
            `in der Serie R nicht auflösen.`,
        },
      ],
      variants: {
        columns: [
          "Variante",
          "VLT",
          "TSER",
          "UV-Schutz",
          "Blendschutz",
          "Montage",
          "Typische Anwendung",
        ],
        rows: reflektierend.map((f) => [
          f.name,
          pct(f.single.vlt),
          pct(f.single.tser),
          uvLabel(f.single),
          f.single.glare !== undefined ? pct(f.single.glare) : "—",
          f.mount,
          f.application ?? "—",
        ]),
        films: reflektierend,
      },
    },
  },
  {
    // Ersetzt die vormals leere Kategorie "ARM Platinum / Spectrum" (Nano-
    // keramische Folien) — dafür lag nie ein Musterbuch-Eintrag vor. Diese
    // Serie fasst stattdessen alles zusammen, was tatsächlich im Programm
    // steht und spektralselektiv arbeitet: LLumars gesputterte Metalloxid-
    // Beschichtungen (Codepräfix N, DRN, V, VS, VE, AIR, NHE, XHE, THE).
    slug: "spektralselektive",
    name: "Spektralselektive Folien",
    family: "Spektralselektive & Sputter-Folien",
    tag: "Premium · Spektralselektiv",
    glyph: "absorption",
    glyphField: "paper",
    summary:
      "Reduzieren die Infrarotstrahlung über einen breiten Wellenlängenbereich und " +
      "lassen gleichzeitig viel sichtbares Licht durch. Besonders geeignet für " +
      "Wohn- und Einzelhandelsobjekte mit dezenter Glasoptik.",
    useCases: ["Büro", "Architektur", "Wohnraum", "Fassade ohne Spiegeleffekt"],
    metrics: [
      { label: "TSER", value: `bis ${pct(xTser.max)}`, bar: xTser.max },
      { label: "VLT", value: `${xVlt.min}–${pct(xVlt.max)}`, bar: xVlt.max },
      { label: "UV-Schutz", value: uvLabel(xLead.single), bar: 99 },
    ],
    detail: {
      kicker: "Sonnenschutzfolie · Spektralselektiv · LLumar",
      intro:
        `Statt Sonnenwärme wie ein Spiegel zurückzuwerfen, filtert diese Beschichtung ` +
        `gezielt die Wellenlängen heraus, die Hitze bringen, und lässt sichtbares Licht ` +
        `vergleichsweise ungehindert durch. Das Ergebnis: eine neutrale, kaum reflektierende ` +
        `Optik bei spürbarer Kühlwirkung. ${spektralselektiv.length} Varianten decken die ` +
        `Spanne von dezent getönt bis nahezu unsichtbar ab.`,
      stats: [
        { label: "TSER", value: pct(xLead.single.tser), note: "Gesamtenergie abgewiesen" },
        { label: "VLT", value: pct(xLead.single.vlt), note: "Lichtdurchlass" },
        { label: "UV-Schutz", value: uvLabel(xLead.single), note: "UV-Durchlässigkeit" },
      ],
      statsFootnote:
        `Werte für ${xLead.name} (LLumar) an Einfachverglasung. Andere Varianten siehe ` +
        `Tabelle. Bitte gegen das aktuelle Herstellerdatenblatt prüfen.`,
      facts: [
        {
          kicker: "Technologie",
          title: "Gesputterte Metalloxidschicht",
          body:
            "Eine hauchdünne, im Vakuum aufgesputterte Metalloxidschicht wirkt als " +
            "spektralselektiver Filter: Sie blockiert Infrarot- und UV-Strahlung gezielt, " +
            "statt das gesamte Sonnenlicht zu spiegeln — dadurch bleibt die Optik neutral " +
            "und heller als bei einer klassischen Reflexionsfolie gleicher Hitzeschutzklasse.",
        },
        {
          kicker: "Einsatz",
          title: "Wo der Spiegeleffekt stört",
          body:
            `Bürofassaden, Architekturglas, Wohnräume mit Blick nach außen — überall dort, ` +
            `wo Hitzeschutz gefragt ist, ein Spiegelbild an der Fassade aber nicht. ` +
            `${xAussen} der ${spektralselektiv.length} Varianten (die Helios-Linie) sind ` +
            `auch als Außenfolie erhältlich.`,
        },
        {
          kicker: "Unterschied zur Serie R",
          title: "Filtern statt spiegeln",
          body:
            "Wo die Serie R mit einer reflektierenden Aluminiumschicht arbeitet, filtert " +
            "diese Serie die Sonnenenergie spektralselektiv heraus. Das kostet bei " +
            "gleichem VLT etwas TSER — dafür bleibt die Scheibe von außen unauffälliger " +
            "und wirkt tagsüber nicht wie ein Spiegel.",
        },
        {
          kicker: "Auswahl",
          title: "Von dezent bis nahezu unsichtbar",
          body:
            `Zwischen ${xVlt.min} % und ${pct(xVlt.max)} Lichtdurchlass liegen alle Stufen ` +
            `zwischen deutlich sichtbarer Tönung und einer Folie, die im eingebauten ` +
            `Zustand kaum auffällt. Je heller die Variante, desto geringer die ` +
            `Wärmeabweisung — auch hier gilt der Zielkonflikt aus der Serie R.`,
        },
      ],
      variants: {
        columns: [
          "Variante",
          "VLT",
          "TSER",
          "UV-Schutz",
          "Blendschutz",
          "Montage",
          "Typische Anwendung",
        ],
        rows: spektralselektiv.map((f) => [
          f.name,
          pct(f.single.vlt),
          pct(f.single.tser),
          uvLabel(f.single),
          f.single.glare !== undefined ? pct(f.single.glare) : "—",
          f.mount,
          f.application ?? "—",
        ]),
        films: spektralselektiv,
      },
    },
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
      "Halten Glassplitter zusammen und erschweren schnelles Eindringen. " +
      "Besonders geeignet für Banken, Schulen, Kindergärten, öffentliche " +
      "Einrichtungen und Terrassenverglasungen.",
    useCases: ["Geschäft", "Schule", "Erdgeschoss", "Bank"],
    metrics: [
      { label: "Stärke", value: `${safetyMicron.min}–${safetyMicron.max} µ`, bar: 85 },
      { label: "VLT", value: pct(en356.single.vlt), bar: en356.single.vlt },
      { label: "UV-Schutz", value: uvLabel(en356.single), bar: 99 },
    ],
    detail: {
      kicker: "Sicherheitsfolie · Geprüft nach DIN EN 356 & EN 12600",
      intro:
        "Klar wie Glas, aber mit Rückhaltewirkung: Bei einem Stoß verteilt die Folie die " +
        "Aufprallkraft über die gesamte Scheibe. Das Glas bricht — die Splitter bleiben an " +
        "der Folie und im Rahmen. Zwei unabhängige Prüfungen belegen die Wirkung.",
      stats: [
        { label: "EN 356", value: "P1A", note: `Durchwurfhemmung, ${en356.thicknessMil} mil` },
        // { label: "EN 12600", value: "2 (B) 2", note: `Stoßsicherheit, ${en12600.thicknessMil} mil` },
        { label: "VLT", value: pct(en356.single.vlt), note: "Lichtdurchlass — nahezu unsichtbar" },
      ],
      statsFootnote:
        `Prüfberichte 2022-08-5319-04 (EN 356, ARM Safety clear ${en356.thicknessMil} mil ` +
        // `auf 6 mm Float) und 2022-08-5319-02 (EN 12600, ARM Safety ${en12600.thicknessMil} ` +
        `mil auf 4 mm Float). Klassifizierung gilt für den geprüften Glasaufbau.`,
      facts: [
        {
          kicker: "Prüfung EN 356",
          title: "Kugelfallversuch ohne Durchdringung",
          body:
            `Drei Probekörper 1100 × 900 mm, 6 mm Floatglas mit ARM Safety clear ` +
            `${thickness(en356)}. Je drei Stöße aus 1500 mm Fallhöhe. Ergebnis: Glasbruch ` +
            `ja, Durchdringung in keinem Fall — Klasse P1A.`,
        },
        {
          kicker: "Prüfung EN 12600",
          title: "Pendelschlag mit Doppelreifenstoßkörper",
          body:
            `Fünf Probekörper 876 × 1938 mm, 4 mm Floatglas mit ARM Safety ` +
            // `${thickness(en12600)}. Fallhöhen 190, 450 und 1200 mm. Bruchverhalten Typ B: ` +
            `die Splitter werden von der Folie zusammengehalten — Klasse 2 (B) 2.`,
        },
        {
          kicker: "Zwei Aufgaben",
          title: "Einbruchhemmung ist nicht Verletzungsschutz",
          body:
            `${en356.thicknessMil} mil verzögert das Eindringen — das ist die Aufgabe der ` +
            // `EN 356. ${en12600.thicknessMil} mil schützt Menschen vor herausfallenden ` +
            `Scherben — das prüft die EN 12600. Welche Stärke richtig ist, entscheidet die ` +
            `Nutzung, nicht der Preis.`,
        },
        {
          kicker: "Wichtig",
          title: "Kein Sonnenschutz",
          body:
            `Die klaren Safety-Folien weisen nur ${safetyTser.min} bis ` +
            `${pct(safetyTser.max)} der Sonnenenergie ab. Wer Hitzeschutz und Splitterschutz ` +
            `zugleich braucht, kombiniert die Safety-Serie mit einer Sonnenschutzfolie oder ` +
            `wählt eine getönte Sicherheitsvariante.`,
        },
      ],
      variants: {
        columns: ["Variante", "Stärke", "VLT", "TSER", "UV-Schutz", "Funktion"],
        rows: sicherheit.map((f) => [
          f.name,
          thickness(f),
          pct(f.single.vlt),
          pct(f.single.tser),
          uvLabel(f.single),
          f.certification ? `Geprüft: ${f.certification}` : (f.application ?? "—"),
        ]),
        films: sicherheit,
      },
    },
  },
  {
    slug: "uv-protection-clear",
    name: "UV Protection Clear",
    family: "UV-Schutzfolien",
    tag: "Unsichtbar",
    glyph: "uv",
    glyphField: "paper",
    summary:
      "Reduzieren UV-Strahlung bei weitgehend natürlicher Glasoptik. " +
      "Besonders geeignet für Museen, Schaufenster, Galerien.",
    useCases: ["Museum", "Showroom", "Wohnraum"],
    metrics: [
      { label: "TSER", value: pct(uvClear.single.tser), bar: uvClear.single.tser },
      { label: "VLT", value: pct(uvClear.single.vlt), bar: uvClear.single.vlt },
      { label: "UV-Schutz", value: uvLabel(uvClear.single), bar: 99 },
    ],
    detail: {
      kicker: "UV-Schutzfolie · Nahezu unsichtbar",
      intro:
        `Mit ${pct(uvClear.single.vlt)} Lichtdurchlass ist diese Folie im eingebauten ` +
        `Zustand praktisch nicht zu erkennen — die Auslage bleibt so hell und farbecht wie ` +
        `ohne Folie. Ihre Aufgabe ist eine einzige: die Strahlung wegnehmen, die Farben ` +
        `ausbleichen lässt.`,
      stats: [
        {
          label: "VLT",
          value: pct(uvClear.single.vlt),
          note: "Lichtdurchlass — höchster Wert im Sortiment",
        },
        {
          label: "UV-Schutz",
          value: uvLabel(uvClear.single),
          note: `UV-Durchlässigkeit ${uvClear.single.uv} %`,
        },
        {
          label: "Blendschutz",
          value: pct(uvClear.single.glare ?? 0),
          note: "Kein Blendschutz — bewusst so",
        },
      ],
      statsFootnote:
        `Werte für ${uvClear.name} ${thickness(uvClear)} an Einfachverglasung, Quelle: ` +
        `Armolan-Musterbuch. TSER ${pct(uvClear.single.tser)}, Abschirmgrad ` +
        `${dec(uvClear.single.sc ?? 0)}.`,
      facts: [
        {
          kicker: "Technologie",
          title: "Klare UV-Sperrschicht",
          body:
            `Kein Metall, keine Tönung — ein UV-Absorber im Polyester filtert ` +
            `${uvLabel(uvClear.single)} der Strahlung unterhalb von 380 nm. Materialstärke ` +
            `${thickness(uvClear)}.`,
        },
        {
          kicker: "Einsatz",
          title: "Wo Farbe Geld wert ist",
          body:
            "Museen, Galerien, Juweliere, Modegeschäfte, Apotheken, Showrooms — überall " +
            "dort, wo ausgestellte Ware in der Auslage steht und trotzdem gut sichtbar " +
            "bleiben muss.",
        },
        {
          kicker: "Grenzen",
          title: "Kein Hitzeschutz",
          body:
            `Mit ${pct(uvClear.single.tser)} TSER senkt diese Folie die Raumtemperatur kaum ` +
            `spürbar, und mit ${pct(uvClear.single.glare ?? 0)} Blendschutz reduziert sie ` +
            `die Blendung praktisch nicht. Wer beides braucht, greift zur Serie R oder ` +
            `kombiniert beide Folien auf verschiedenen Fassadenseiten.`,
        },
        {
          kicker: "Hinweis",
          title: "UV ist nicht die einzige Ursache",
          body:
            `Ausbleichen entsteht zu einem Teil auch durch sichtbares Licht und Wärme. ` +
            `${uvLabel(uvClear.single)} UV-Schutz verlangsamt den Prozess deutlich, hält ` +
            `ihn aber nicht vollständig auf — diese Erwartung sollte im Beratungsgespräch ` +
            `offen angesprochen werden.`,
        },
      ],
    },
  },
  {
    // NEU: Diese Serie stand bisher nicht auf der Website, ist im Armolan-
    // Musterbuch aber vollständig vorhanden. Falls nicht im Vertriebs-
    // programm, Eintrag ersatzlos löschen.
    // Glyph "absorption" ist hier nur geborgt — ggf. eigenes Diagramm ergänzen.
    slug: "sichtschutz-dekor",
    name: "Sichtschutz & Dekor",
    family: "Matt- und Blickschutzfolien",
    tag: "Privatsphäre",
    glyph: "dekor",
    glyphField: "paper",
    summary:
      "Mehr Privatsphäre und weniger störende Reflexionen auf Bildschirmen " +
      "in Büros und Arbeitsräumen.",
    useCases: ["Besprechungsraum", "Trennwand", "Praxis", "Sanitärbereich"],
    metrics: [
      { label: "VLT", value: `${sVlt.min}–${pct(sVlt.max)}`, bar: sVlt.max },
      { label: "TSER", value: `${sTser.min}–${pct(sTser.max)}`, bar: sTser.max },
      { label: "UV-Schutz", value: uvLabel(whiteMatt.single), bar: 99 },
    ],
    detail: {
      kicker: "Sichtschutzfolie · Innenanwendung",
      intro:
        `${sichtschutz.length} Folien für dieselbe Aufgabe in drei Abstufungen: Licht ins ` +
        `Innere lassen, Blicke draußen halten. Der Austausch der Verglasung entfällt — die ` +
        `Folie wird auf das bestehende Glas verklebt und ist bei Bedarf rückstandsfrei ` +
        `entfernbar.`,
      stats: [
        {
          label: "WHITE MATT",
          value: pct(whiteMatt.single.vlt),
          note: `${whiteMatt.name} — Milchglas-Optik`,
        },
        {
          label: "WHITE OUT",
          value: pct(whiteOut.single.vlt),
          note: `${whiteOut.name} — nahezu blickdicht`,
        },
        { label: "UV-Schutz", value: uvLabel(whiteMatt.single), note: "alle Varianten" },
      ],
      statsFootnote:
        `Werte an Einfachverglasung, Quelle: Armolan-Musterbuch. ${silverMatt.name} wirkt ` +
        `zusätzlich als Sonnenschutz (${pct(silverMatt.single.tser)} TSER), ` +
        `${whiteMatt.name} praktisch nicht (${pct(whiteMatt.single.tser)} TSER).`,
      facts: [
        {
          kicker: whiteMatt.name,
          title: "Milchglas ohne Glastausch",
          body:
            `${pct(whiteMatt.single.vlt)} Lichtdurchlass bei vollständig gestreutem Bild: ` +
            `Der Raum bleibt hell, Silhouetten verschwinden. Die übliche Wahl für ` +
            `Besprechungsräume und Trennwände im Büro.`,
        },
        {
          kicker: silverMatt.name,
          title: "Sichtschutz und Hitzeschutz zugleich",
          body:
            `Mattierte Oberfläche mit metallisierter Schicht: ${pct(silverMatt.single.vlt)} ` +
            `VLT, ${pct(silverMatt.single.tser)} TSER, ${pct(silverMatt.single.glare ?? 0)} ` +
            `Blendschutz. Sinnvoll, wo die Scheibe gleichzeitig stark besonnt ist.`,
        },
        {
          kicker: whiteOut.name,
          title: "Nahezu blickdicht",
          body:
            `${pct(whiteOut.single.vlt)} VLT bei ` +
            `${pct(whiteOut.single.visibleReflection ?? 0)} Lichtreflexion — für ` +
            `Sanitärbereiche, Lagerflächen und Flächen, die als weiße Fläche wirken sollen. ` +
            `Auch als Träger für geplotteten Firmenschriftzug geeignet.`,
        },
        {
          kicker: "Hinweis",
          title: "Sichtschutz wirkt in beide Richtungen",
          body:
            "Anders als eine Spiegelfolie arbeitet eine Mattfolie unabhängig vom " +
            "Lichtverhältnis — auch nachts. Dafür geht die Sicht nach draußen verloren; das " +
            "ist bei Fensterflächen gegenüber Wohnräumen vorab zu klären.",
        },
      ],
      variants: {
        columns: ["Variante", "VLT", "TSER", "Blendschutz", "UV-Schutz", "Typische Anwendung"],
        rows: sichtschutz.map((f) => [
          f.name,
          pct(f.single.vlt),
          pct(f.single.tser),
          f.single.glare !== undefined ? pct(f.single.glare) : "—",
          uvLabel(f.single),
          f.application ?? "—",
        ]),
        films: sichtschutz,
      },
    },
  },
];

export const getSeries = (slug: string) => series.find((s) => s.slug === slug);