import React from 'react';

const GlassInfographic = () => {
  return (
    <div
      className="relative w-full mx-auto p-8 font-sans overflow-hidden shadow-sm"
      style={{ maxWidth: '56rem', backgroundColor: '#f4f7f8', borderRadius: '2rem' }}
    >
      {/* Header Banner */}
      <div
        className="relative z-10 text-white text-center py-5 px-6 mb-8"
        style={{ backgroundColor: '#1e4a54', borderRadius: '1rem' }}
      >
        <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
          3 mm Klarglas ohne Armolan Fensterfolie
        </h2>
      </div>

      {/* Diagram Container */}
      <div className="relative w-full" style={{ aspectRatio: '2 / 1', minHeight: 400 }}>
        {/* Background SVG for Lines and Glass Pane */}
        <svg
          viewBox="0 0 1000 500"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#dca042" />
            </marker>
          </defs>

          {/* Vertical Glass Pane */}
          <rect x="490" y="50" width="20" height="400" fill="#bac7cd" />

          {/* Incoming Solar Rays (Left Side) */}
          <line x1="120" y1="120" x2="490" y2="160" stroke="#dca042" strokeWidth="4" />
          <line x1="120" y1="190" x2="490" y2="230" stroke="#dca042" strokeWidth="4" />
          <line x1="120" y1="260" x2="490" y2="300" stroke="#dca042" strokeWidth="4" />
          <line x1="120" y1="330" x2="490" y2="370" stroke="#dca042" strokeWidth="4" />

          {/* Splitting Bottom Ray */}
          <line x1="120" y1="400" x2="490" y2="440" stroke="#dca042" strokeWidth="4" />

          {/* Transmitted Rays (Right Side) */}
          <line x1="510" y1="162" x2="880" y2="202" stroke="#dca042" strokeWidth="4" markerEnd="url(#arrowhead)" />
          <line x1="510" y1="232" x2="880" y2="272" stroke="#dca042" strokeWidth="4" markerEnd="url(#arrowhead)" />
          <line x1="510" y1="302" x2="880" y2="342" stroke="#dca042" strokeWidth="4" markerEnd="url(#arrowhead)" />
          <line x1="510" y1="372" x2="880" y2="412" stroke="#dca042" strokeWidth="4" markerEnd="url(#arrowhead)" />

          {/* Reflected Ray (Bottom Left) */}
          <line x1="490" y1="440" x2="220" y2="490" stroke="#dca042" strokeWidth="4" markerEnd="url(#arrowhead)" />
        </svg>

        {/* --- HTML Text Overlays --- */}

        {/* 100% Sonnenenergie (Top Left) */}
        <div
          className="absolute bg-white shadow-md border border-gray-100 py-3 px-8 text-center"
          style={{ top: '8%', left: '10%', borderRadius: '0.5rem', minWidth: 200 }}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: '#1e4a54' }}>100 %</div>
          <div className="text-gray-500 text-sm">Sonnenenergie</div>
        </div>

        {/* 85% Transmission (Top Right) */}
        <div
          className="absolute bg-white shadow-md border border-gray-100 py-3 px-8 text-center"
          style={{ top: '16%', right: '10%', borderRadius: '0.5rem', minWidth: 200 }}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: '#1e4a54' }}>85 %</div>
          <div className="text-gray-500 text-sm">Transmission</div>
        </div>

        {/* 8% Reflektion (Bottom Left) */}
        <div
          className="absolute bg-white shadow-md border border-gray-100 py-3 px-8 text-center"
          style={{ bottom: '10%', left: '12%', borderRadius: '0.5rem', minWidth: 160 }}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: '#1e4a54' }}>8 %</div>
          <div className="text-gray-500 text-sm">Reflektion</div>
        </div>

        {/* 7% Absorption (Bottom Center) */}
        <div
          className="absolute bg-white shadow-md border border-gray-100 py-3 px-8 text-center"
          style={{
            bottom: '2%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '0.5rem',
            minWidth: 180
          }}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: '#1e4a54' }}>7 %</div>
          <div className="text-gray-500 text-sm">Absorption</div>
        </div>
      </div>
    </div>
  );
};

export default GlassInfographic;
