import React from 'react';

const GlassImpactInfographic = () => {
  return (
    <div
      className="w-full mx-auto grid gap-6"
      style={{ maxWidth: '1100px', gridTemplateColumns: '1fr 1fr' }}
    >
      {/* WITHOUT SECURITY FILM */}
      <div className="p-6" style={{ backgroundColor: '#eef4f5', borderRadius: '1.5rem' }}>
        <div
          className="flex items-center justify-center text-white font-bold text-xl mb-8"
          style={{ backgroundColor: '#1e4a54', borderRadius: '0.75rem', padding: '16px 24px' }}
        >
          Glas ohne Sicherheitsfolie
        </div>

        <div className="relative" style={{ height: 420 }}>
          <svg viewBox="0 0 400 420" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="arrow-red" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
                <polygon points="0 0, 10 4, 0 8" fill="#e2472b" />
              </marker>
            </defs>

            {/* Glass pane */}
            <rect x="40" y="20" width="320" height="280" fill="#cddadd" stroke="#9fb3b8" strokeWidth="2" />

            {/* Impact point */}
            <circle cx="200" cy="70" r="9" fill="#e2472b" />

            {/* Jagged crack lines fanning from impact point */}
            <polyline points="200,70 130,90 175,130 60,160" fill="none" stroke="#4a575b" strokeWidth="3" />
            <polyline points="200,70 300,90 260,130 340,155" fill="none" stroke="#4a575b" strokeWidth="3" />
            <polyline points="200,70 145,230 105,280" fill="none" stroke="#4a575b" strokeWidth="3" />
            <polyline points="200,70 200,300" fill="none" stroke="#4a575b" strokeWidth="3" />
            <polyline points="200,70 255,230 300,280" fill="none" stroke="#4a575b" strokeWidth="3" />

            {/* Falling glass shards (triangles) */}
            <polygon points="90,300 130,300 110,335" fill="#9fb3b8" />
            <polygon points="180,300 220,300 200,335" fill="#9fb3b8" />
            <polygon points="270,300 310,300 290,335" fill="#9fb3b8" />

            {/* Red arrows for falling shards */}
            <line x1="110" y1="335" x2="80" y2="380" stroke="#e2472b" strokeWidth="4" markerEnd="url(#arrow-red)" />
            <line x1="200" y1="335" x2="200" y2="385" stroke="#e2472b" strokeWidth="4" markerEnd="url(#arrow-red)" />
            <line x1="290" y1="335" x2="320" y2="380" stroke="#e2472b" strokeWidth="4" markerEnd="url(#arrow-red)" />
          </svg>
        </div>

        <div className="text-center font-bold text-lg" style={{ color: '#e2472b' }}>
          Scherben lösen sich und fallen heraus
        </div>
      </div>

      {/* WITH SECURITY FILM */}
      <div className="p-6" style={{ backgroundColor: '#eef4f5', borderRadius: '1.5rem' }}>
        <div
          className="flex items-center justify-center text-white font-bold text-xl mb-8"
          style={{ backgroundColor: '#358a9a', borderRadius: '0.75rem', padding: '16px 24px' }}
        >
          Glas mit Sicherheitsfolie
        </div>

        <div className="relative" style={{ height: 420 }}>
          <svg viewBox="0 0 400 420" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="arrow-teal2" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
                <polygon points="0 0, 10 4, 0 8" fill="#1c7a8c" />
              </marker>
            </defs>

            {/* Glass pane */}
            <rect x="40" y="20" width="320" height="280" fill="#cddadd" stroke="#9fb3b8" strokeWidth="2" />

            {/* Faint original crack lines (ghost) */}
            <polyline points="200,70 130,90 175,130 60,160" fill="none" stroke="#c4ccce" strokeWidth="2" />
            <polyline points="200,70 300,90 260,130 340,155" fill="none" stroke="#c4ccce" strokeWidth="2" />

            {/* Impact point (dark, no red — force absorbed) */}
            <circle cx="200" cy="70" r="9" fill="#1a2b30" />

            {/* Force-distribution arrows radiating outward and reaching frame edges */}
            <line x1="200" y1="70" x2="70" y2="45" stroke="#1c7a8c" strokeWidth="5" markerEnd="url(#arrow-teal2)" />
            <line x1="200" y1="70" x2="330" y2="45" stroke="#1c7a8c" strokeWidth="5" markerEnd="url(#arrow-teal2)" />
            <line x1="200" y1="70" x2="70" y2="180" stroke="#1c7a8c" strokeWidth="5" markerEnd="url(#arrow-teal2)" />
            <line x1="200" y1="70" x2="330" y2="180" stroke="#1c7a8c" strokeWidth="5" markerEnd="url(#arrow-teal2)" />
            <line x1="200" y1="70" x2="120" y2="290" stroke="#1c7a8c" strokeWidth="5" markerEnd="url(#arrow-teal2)" />
            <line x1="200" y1="70" x2="200" y2="290" stroke="#1c7a8c" strokeWidth="5" markerEnd="url(#arrow-teal2)" />
            <line x1="200" y1="70" x2="280" y2="290" stroke="#1c7a8c" strokeWidth="5" markerEnd="url(#arrow-teal2)" />

            {/* Reinforced bottom edge (film holds the frame) */}
            <rect x="40" y="296" width="320" height="8" fill="#1c7a8c" />
          </svg>
        </div>

        <div className="text-center font-bold text-lg" style={{ color: '#1e4a54' }}>
          Kraft verteilt sich — Splitter bleiben zusammen
        </div>
      </div>
    </div>
  );
};

export default GlassImpactInfographic;
