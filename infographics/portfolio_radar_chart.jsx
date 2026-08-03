import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

// Data aggregated from the "Unser Produktportfolio" table
const portfolioData = [
  {
    metric: 'TSER (%)', // Total Energy Rejection
    'Serie R': 80,
    'ARM Platinum': 60,
    'UV Protection Clear': 20,
    fullMark: 100
  },
  {
    metric: 'VLT (%)', // Visible Light Transmittance
    'Serie R': 15, // Approx value for highly reflective film
    'ARM Platinum': 80,
    'UV Protection Clear': 89,
    fullMark: 100
  },
  {
    metric: 'UV-Schutz (%)',
    'Serie R': 99,
    'ARM Platinum': 99,
    'UV Protection Clear': 99.9,
    fullMark: 100
  }
];

const PortfolioRadarChart = () => {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="80%"
          data={portfolioData}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Tooltip />
          <Legend />

          {/* Each Radar component represents a specific product series */}
          <Radar
            name="Serie R"
            dataKey="Serie R"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Radar
            name="ARM Platinum"
            dataKey="ARM Platinum"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.6}
          />
          <Radar
            name="UV Protection Clear"
            dataKey="UV Protection Clear"
            stroke="#ffc658"
            fill="#ffc658"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioRadarChart;
