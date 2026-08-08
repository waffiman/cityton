/**
 * The three explainer diagrams for /funktionsprinzip.
 * Line drawings on the blueprint plate — colours come from the tokens.
 */

const stroke = { fill: "none", strokeWidth: 1.6, strokeLinecap: "round" } as const;

export function SummerDiagram() {
  return (
    <svg viewBox="0 0 340 300" role="img" aria-label="Sommer: Infrarotstrahlung wird an der Folie nach außen reflektiert">
      <rect x="150" y="20" width="14" height="260" fill="none" stroke="var(--color-text)" strokeWidth="1.2" />
      <rect x="164" y="20" width="5" height="260" fill="var(--color-accent)" opacity=".55" />
      <g stroke="var(--color-signal)" {...stroke}>
        <path d="M20 40 L146 96" />
        <path d="M20 90 L146 146" />
        <path d="M20 140 L146 196" />
      </g>
      <g stroke="var(--color-signal)" opacity=".85" {...stroke}>
        <path d="M146 96 L24 130" />
        <path d="M146 146 L24 180" />
        <path d="M146 196 L24 230" />
      </g>
      <g stroke="var(--color-accent)" {...stroke}>
        <path d="M169 146 L318 168" />
      </g>
      <rect x="150" y="20" width="14" height="260" fill="var(--color-accent)" opacity=".08" />
      <text x="20" y="272" fontSize="12" fill="var(--color-text)">AUSSEN · 34 °C</text>
      <text x="240" y="272" fontSize="12" fill="var(--color-text)">INNEN · 25,7 °C</text>
      <text x="196" y="160" fontSize="11" fill="var(--color-accent-700)">Restwärme</text>
      <text x="30" y="122" fontSize="11" fill="var(--color-signal-700)">79 % reflektiert</text>
    </svg>
  );
}

export function WinterDiagram() {
  return (
    <svg viewBox="0 0 340 300" role="img" aria-label="Winter: Tageslicht passiert, Raumwärme wird nach innen zurückgeworfen">
      <rect x="150" y="20" width="14" height="260" fill="none" stroke="var(--color-text)" strokeWidth="1.2" />
      <rect x="164" y="20" width="5" height="260" fill="var(--color-accent)" opacity=".55" />
      <g stroke="var(--color-signal)" {...stroke}>
        <path d="M20 60 L318 130" />
        <path d="M20 110 L318 180" />
      </g>
      <g stroke="var(--color-accent)" {...stroke}>
        <path d="M300 210 L172 226" />
        <path d="M172 226 L300 242" />
      </g>
      <text x="20" y="272" fontSize="12" fill="var(--color-text)">AUSSEN · −2 °C</text>
      <text x="240" y="272" fontSize="12" fill="var(--color-text)">INNEN · 21 °C</text>
      <text x="196" y="212" fontSize="11" fill="var(--color-accent-700)">Wärme bleibt im Raum</text>
      <text x="30" y="46" fontSize="11" fill="var(--color-signal-700)">Tageslicht passiert</text>
    </svg>
  );
}

export function ImpactDiagram() {
  return (
    <svg viewBox="0 0 340 300" role="img" aria-label="Einbruchschutz: die Schlagkraft verteilt sich über die Folienfläche">
      <rect x="150" y="20" width="14" height="260" fill="none" stroke="var(--color-text)" strokeWidth="1.2" />
      <rect x="164" y="20" width="6" height="260" fill="var(--color-accent)" opacity=".55" />
      <circle cx="140" cy="150" r="16" fill="var(--color-text)" />
      <path d="M60 150 L120 150" stroke="var(--color-text)" strokeWidth="2" />
      <g stroke="var(--color-accent)" fill="none" strokeWidth="1.3" strokeLinecap="round">
        <path d="M164 150 L200 96" />
        <path d="M164 150 L206 132" />
        <path d="M164 150 L206 168" />
        <path d="M164 150 L200 204" />
        <path d="M164 150 L182 60" />
        <path d="M164 150 L182 240" />
      </g>
      <rect x="150" y="20" width="14" height="260" fill="var(--color-text)" opacity=".06" />
      <text x="30" y="140" fontSize="11" fill="var(--color-text)">Schlag</text>
      <text x="196" y="272" fontSize="11" fill="var(--color-accent-700)">Kraft über die Fläche verteilt</text>
      <text x="150" y="292" fontSize="12" fill="var(--color-text)">SICHERHEITSFOLIE 300 µ</text>
    </svg>
  );
}

export const principleDiagrams = {
  sommer: SummerDiagram,
  winter: WinterDiagram,
  einbruchschutz: ImpactDiagram,
} as const;
