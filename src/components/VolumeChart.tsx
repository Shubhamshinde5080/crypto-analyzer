'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import type { HistoryData } from '@/types/api';

interface VolumeChartProps {
  data: HistoryData[];
  title?: string;
}

export function VolumeChart({ data, title = 'Volume Chart' }: VolumeChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500 text-center">No volume data available for chart</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    time: format(new Date(d.timestamp), 'MM-dd HH:mm'),
    volume: d.volume,
    timestamp: d.timestamp,
  }));

  const maxVolume = Math.max(...data.map((d) => d.volume));
  const volumeRange = maxVolume;
  const padding = volumeRange * 0.1; // 10% padding

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`Time: ${label}`}</p>
          <p className="text-purple-600">
            {`Volume: $${payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div
        className="w-full h-80"
        role="img"
        aria-label={`Volume chart showing ${data.length} data points`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            aria-label="Volume over time bar chart"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => value.split(' ')[1]} // Show only time
              aria-label="Time axis"
            />
            <YAxis
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
              domain={[0, maxVolume + padding]}
              aria-label="Volume axis"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="volume" fill="#8B5CF6" radius={[2, 2, 0, 0]} aria-label="Volume bars" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
