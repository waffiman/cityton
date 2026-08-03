import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Data from the City-Ton brochure (Live-Messung section)
const temperatureData = [
  {
    name: 'Ohne Schutzfolie',
    temperatur: 33.3,
    fill: '#ff4d4f' // Red to signify heat
  },
  {
    name: 'Mit Schutzfolie',
    temperatur: 25.7,
    fill: '#73d13d' // Green to signify cooling
  }
];

const TemperatureComparisonChart = () => {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={temperatureData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis unit="°C" />
          <Tooltip cursor={{ fill: 'transparent' }} />
          <Legend />

          <Bar
            dataKey="temperatur"
            name="Oberflächentemperatur (°C)"
            barSize={60}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureComparisonChart;
