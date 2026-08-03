import React from 'react';

const SummerWinterInfographic = () => {
  return (
    <div
      className="w-full mx-auto grid gap-6"
      style={{ maxWidth: '1100px', gridTemplateColumns: '1fr 1fr' }}
    >
      {/* SOMMER PANEL */}
      <div className="p-6" style={{ backgroundColor: '#eef4f5', borderRadius: '1.5rem' }}>
        <div
          className="flex items-center justify-center text-white font-bold text-xl mb-8"
          style={{ backgroundColor: '#1e4a54', borderRadius: '0.75rem', padding: '16px 24px' }}
        >
          ☀ <span style={{ marginLeft: 8 }}>Sommer</span>
        </div>

        <div className="relative" style={{ height: 380 }}>
          <svg viewBox="0 0 400 380" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="arrow-amber" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
                <polygon points="0 0, 10 4, 0 8" fill="#dca042" />
              </marker>
              <marker id="arrow-dark" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
                <polygon points="0 0, 10 4, 0 8" fill="#1e4a54" />
              </marker>
            </defs>

            {/* Glass pane */}
            <rect x="185" y="40" width="30" height="300" fill="#b7c6cc" />
            {/* Film line (red) */}
            <line x1="200" y1="40" x2="200" y2="340" stroke="#c0392b" strokeWidth="3" />

            {/* Reflektierte Wärme (curved arrow, top-left) */}
            <path
              d="M 195 55 C 140 60, 90 75, 50 95"
              fill="none"
              stroke="#dca042"
              strokeWidth="4"
              markerEnd="url(#arrow-amber)"
            />
            <text x="45" y="60" fill="#1e4a54" fontWeight="700" fontSize="14">Reflektierte</text>
            <text x="45" y="78" fill="#1e4a54" fontWeight="700" fontSize="14">Wärme</text>

            {/* Wärmeabsorption (arrow into pane from top-right) */}
            <line x1="330" y1="70" x2="215" y2="120" stroke="#1e4a54" strokeWidth="4" markerEnd="url(#arrow-dark)" />
            <text x="300" y="55" fill="#1e4a54" fontWeight="700" fontSize="14">Wärme-</text>
            <text x="300" y="73" fill="#1e4a54" fontWeight="700" fontSize="14">absorption</text>

            {/* Wärmedurchlässigkeit (arrow out from pane, bottom-right) */}
            <line x1="205" y1="250" x2="330" y2="300" stroke="#dca042" strokeWidth="4" markerEnd="url(#arrow-amber)" />
            <text x="290" y="325" fill="#1e4a54" fontWeight="700" fontSize="14">Wärme-</text>
            <text x="290" y="343" fill="#1e4a54" fontWeight="700" fontSize="14">durchlässigkeit</text>

            {/* 99% UV-Schutz label (bottom-left) */}
            <text x="30" y="290" fill="#1e4a54" fontWeight="700" fontSize="14">99 % UV-Schutz</text>
          </svg>
        </div>

        <div className="text-center font-bold text-lg" style={{ color: '#1e4a54' }}>
          Blendreduzierung bis 85 %
        </div>
      </div>

      {/* WINTER PANEL */}
      <div className="p-6" style={{ backgroundColor: '#eef4f5', borderRadius: '1.5rem' }}>
        <div
          className="flex items-center justify-center text-white font-bold text-xl mb-8"
          style={{ backgroundColor: '#358a9a', borderRadius: '0.75rem', padding: '16px 24px' }}
        >
          ❄ <span style={{ marginLeft: 8 }}>Winter</span>
        </div>

        <div className="relative" style={{ height: 380 }}>
          <svg viewBox="0 0 400 380" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="arrow-teal" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
                <polygon points="0 0, 10 4, 0 8" fill="#358a9a" />
              </marker>
            </defs>

            {/* Two glass panes (double glazing look) */}
            <rect x="175" y="40" width="18" height="300" fill="#b7c6cc" />
            <rect x="205" y="40" width="18" height="300" fill="#b7c6cc" />

            {/* Verbessert die CO2-Bilanz (top label) */}
            <text x="200" y="25" textAnchor="middle" fill="#1e4a54" fontWeight="700" fontSize="13">
              Verbessert die CO₂-Bilanz
            </text>

            {/* Kältereduktion (left arrow into pane) */}
            <line x1="30" y1="190" x2="170" y2="190" stroke="#358a9a" strokeWidth="4" markerEnd="url(#arrow-teal)" />
            <text x="30" y="165" fill="#1e4a54" fontWeight="700" fontSize="14">Kälte-</text>
            <text x="30" y="183" fill="#1e4a54" fontWeight="700" fontSize="14">reduktion</text>

            {/* Schutz gegen Wärmeverlust (right arrow out of pane) */}
            <line x1="228" y1="190" x2="368" y2="190" stroke="#358a9a" strokeWidth="4" markerEnd="url(#arrow-teal)" />
            <text x="255" y="165" fill="#1e4a54" fontWeight="700" fontSize="14">Schutz gegen</text>
            <text x="255" y="183" fill="#1e4a54" fontWeight="700" fontSize="14">Wärmeverlust</text>

            {/* Einsparung von Energiekosten (bottom-right label) */}
            <text x="255" y="330" fill="#1e4a54" fontWeight="700" fontSize="14">Einsparung von</text>
            <text x="255" y="348" fill="#1e4a54" fontWeight="700" fontSize="14">Energiekosten</text>
          </svg>
        </div>

        <div className="text-center font-bold text-lg" style={{ color: '#1e4a54' }}>
          Weniger Heizkosten im Winter
        </div>
      </div>
    </div>
  );
};

export default SummerWinterInfographic;
