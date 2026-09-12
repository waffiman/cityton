/**
 * Central glossary for ⓘ info hints (`InfoHint`). Kept in its own module so
 * client components do not pull in the heavy `films` / `series` data graph.
 *
 * Keyed by the term **as displayed in that locale**, because the callers pass
 * the label they just rendered — a translated column header ("Thickness") or
 * stat label. Keeping only German keys would make every hint silently vanish
 * on /en, so the English keys below must match the catalog translations in
 * prisma/translations.en.json.
 */

const de: Record<string, string> = {
  TSER:
    "Total Solar Energy Rejected — Anteil der gesamten Sonnenenergie, der nicht in den Raum gelangt (Reflexion + Absorption, die wieder abgegeben wird).",
  VLT: "Visible Light Transmission — wie viel sichtbares Licht die Folie durchlässt. Höher = hellerer Raum.",
  "UV-Schutz":
    "Anteil der UV-Strahlung, der geblockt wird. Schützt Interieur und Haut vor UV-Belastung.",
  "UV-Durchlass":
    "Anteil der UV-Strahlung, der durch die Folie dringt — der Kehrwert des UV-Schutzes. Kleiner ist besser.",
  Blendschutz:
    "Glare Reduction — Anteil des blendenden Streulichts, den die Folie zusätzlich herausfiltert.",
  Stärke:
    "Materialstärke der Folie. 1 mil = 0,0254 mm (ein Tausendstel Zoll) — die in den US-Herstellerdatenblättern übliche Einheit; µ (Mikron) ist die metrische Angabe derselben Folie.",
  Montage:
    "Seite der Verglasung, auf die die Folie geklebt wird — innen, außen oder je nach Variante beides.",
  SC: "Shading Coefficient (Abschirmgrad) — Sonnenenergiedurchlass der Folie im Verhältnis zu unbeschichtetem 3-mm-Referenzglas. Kleinerer Wert = mehr Schatten.",
  "g-Wert":
    "Gesamtenergiedurchlassgrad — Anteil der Sonnenenergie, der tatsächlich in den Raum gelangt: direkte Transmission plus die Wärme, die die Folie sekundär wieder abgibt.",
  "Ug-Wert":
    "Wärmedurchgangskoeffizient der Verglasung nach EN 673, in W/m²K. Kleinerer Wert = bessere Wärmedämmung.",
  "EN 356":
    "DIN EN 356 — Prüfnorm für durchwurfhemmendes Glas. Klasse P1A steht für den geprüften Widerstand gegen wiederholten Kugelfall aus definierter Höhe.",
  "EN 12600":
    "DIN EN 12600 — Pendelschlagprüfung für die Stoßfestigkeit von Glas. Die Klasse (z. B. 2 (B) 2) beschreibt Fallhöhe und Bruchverhalten der Probekörper.",
  Emissivität:
    "Anteil der Wärmestrahlung, den die Folienoberfläche wieder abgibt. Niedrigere Werte halten mehr Wärme im Raum.",
};

const en: Record<string, string> = {
  TSER:
    "Total Solar Energy Rejected — the share of the total solar energy that never reaches the room (reflection plus the absorbed heat that is radiated back out).",
  VLT: "Visible Light Transmission — how much visible light the film lets through. Higher = brighter room.",
  "UV rejection":
    "The share of UV radiation that is blocked. Protects interiors and skin from UV exposure.",
  "UV transmission":
    "The share of UV radiation that passes through the film — the inverse of UV rejection. Lower is better.",
  "Glare reduction":
    "The share of dazzling scattered light the film filters out on top of its other effects.",
  Thickness:
    "Material thickness of the film. 1 mil = 0.0254 mm (one thousandth of an inch) — the unit used in US manufacturer data sheets; µ (micron) is the metric figure for the same film.",
  Mounting:
    "The side of the glazing the film is applied to — interior, exterior, or either, depending on the variant.",
  SC: "Shading Coefficient — the film's solar energy transmission relative to uncoated 3 mm reference glass. A lower value means more shading.",
  "g value":
    "Total solar energy transmittance — the share of solar energy that actually reaches the room: direct transmission plus the heat the film re-radiates inwards.",
  "Ug value":
    "Thermal transmittance of the glazing to EN 673, in W/m²K. A lower value means better insulation.",
  "EN 356":
    "DIN EN 356 — the test standard for glass resistant to manual attack. Class P1A denotes the tested resistance to repeated ball drops from a defined height.",
  "EN 12600":
    "DIN EN 12600 — the pendulum impact test for the impact resistance of glass. The class (2 (B) 2, for example) describes the drop height and the breakage behaviour of the specimens.",
  Emissivity:
    "The share of thermal radiation the film surface re-emits. Lower values keep more heat inside the room.",
  "Light transmission":
    "How much visible light passes through the glazing once the film is fitted. Higher = brighter room.",
};

/** German glossary — kept as the default export shape for existing callers. */
export const TERM_TOOLTIPS = de;

/** Look a term up in the glossary for `locale`, falling back to German. */
export function termTooltip(term: string, locale: string): string | undefined {
  const table = locale.startsWith("en") ? en : de;
  return table[term] ?? de[term];
}
