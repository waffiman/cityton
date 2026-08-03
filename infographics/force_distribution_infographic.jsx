import React from 'react';

const ForceDistributionInfographic = () => {
  return (
    <div
      className="w-full mx-auto p-6 md:p-10 font-sans flex flex-col items-center shadow-sm border border-gray-100"
      style={{ maxWidth: '64rem', backgroundColor: '#f3f7f8', borderRadius: '2rem' }}
    >
      {/* Header Banner */}
      <div
        className="w-full text-white text-center py-4 px-6 mb-10 shadow-sm"
        style={{ backgroundColor: '#358a9a', borderRadius: '0.75rem' }}
      >
        <h2 className="text-xl md:text-2xl font-bold tracking-wide">
          Die Kraft verteilt sich über die gesamte Fensterfläche
        </h2>
      </div>

      {/* SVG Diagram Container */}
      <div className="w-full relative mb-6" style={{ aspectRatio: '2 / 1', minHeight: 300 }}>
        <svg
          viewBox="0 0 1000 500"
          className="absolute inset-0 w-full h-full drop-shadow-sm"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Teal Arrowhead Definition */}
            <marker
              id="force-arrow"
              markerWidth="12"
              markerHeight="9"
              refX="10"
              refY="4.5"
              orient="auto"
            >
              <polygon points="0 0, 12 4.5, 0 9" fill="#358a9a" />
            </marker>
          </defs>

          {/* 1. Glass Pane Background */}
          <rect x="150" y="50" width="700" height="400" fill="#cfdfe2" />

          {/* 2. Faint Diagonal Guide Lines (Underneath) */}
          <line x1="380" y1="150" x2="620" y2="350" stroke="#aababc" strokeWidth="2" />
          <line x1="620" y1="150" x2="380" y2="350" stroke="#aababc" strokeWidth="2" />

          {/* 3. Window Frame (Outer Border and Inner Cross) */}
          <rect x="150" y="50" width="700" height="400" stroke="#444f52" strokeWidth="14" fill="none" />
          <line x1="500" y1="50" x2="500" y2="450" stroke="#444f52" strokeWidth="14" />
          <line x1="150" y1="250" x2="850" y2="250" stroke="#444f52" strokeWidth="14" />

          {/* 4. Force Distribution Arrows (Radiating from center 500,250) */}
          {/* North / South */}
          <line x1="500" y1="250" x2="500" y2="100" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />
          <line x1="500" y1="250" x2="500" y2="400" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />

          {/* East / West */}
          <line x1="500" y1="250" x2="800" y2="250" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />
          <line x1="500" y1="250" x2="200" y2="250" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />

          {/* Diagonals */}
          <line x1="500" y1="250" x2="720" y2="120" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />
          <line x1="500" y1="250" x2="280" y2="120" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />
          <line x1="500" y1="250" x2="720" y2="380" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />
          <line x1="500" y1="250" x2="280" y2="380" stroke="#358a9a" strokeWidth="4" markerEnd="url(#force-arrow)" />

          {/* 5. Center Impact Point */}
          <circle cx="500" cy="250" r="10" fill="#2d3b3e" />
        </svg>
      </div>

      {/* Footer Text */}
      <div className="w-full text-center px-4">
        <p className="font-bold text-base md:text-lg" style={{ color: '#1a3840' }}>
          Das Glas bleibt auch bei starkem Stoß in der Rahmenkonstruktion — die Folie macht das Fenster widerstandsfähiger
        </p>
      </div>
    </div>
  );
};

export default ForceDistributionInfographic;
