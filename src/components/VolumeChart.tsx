'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import type { HistoryData } from '@/types/api';

interface Props {
  data: HistoryData[];
}
export default function VolumeChart({ data }: Props) {
  if (!data.length) return null;
  const chartData = data.map((d) => ({
    time: format(new Date(d.timestamp), 'MM-dd HH:mm'),
    volume: d.volume,
  }));

  return (
    <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Volume Chart</h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis tickFormatter={(val) => `${(val / 1e6).toFixed(0)}M`} />
            <Tooltip
              labelFormatter={(label) => `Time: ${label}`}
              formatter={(val) => [val, 'Volume']}
            />
            <Bar dataKey="volume" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
