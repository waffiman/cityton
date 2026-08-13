/**
 * Central glossary for ⓘ info hints (`InfoHint`). Kept in its own module so
 * client components do not pull in the heavy `films` / `series` data graph.
 */

export const TERM_TOOLTIPS: Record<string, string> = {
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
