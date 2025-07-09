'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
import type { HistoryData } from '@/types/api';
import { fmtUSD } from '@/lib/format';

interface Props {
  data: HistoryData[];
}
export default function PriceChart({ data }: Props) {
  if (!data.length) return null;
  const chartData = data.map((d) => ({
    time: format(new Date(d.timestamp), 'MM-dd HH:mm'),
    close: d.close,
  }));

  return (
    <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Chart</h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(val) => (typeof val === 'number' ? fmtUSD(val) : String(val))}
            />
            <Tooltip
              labelFormatter={(label) => `Time: ${label}`}
              formatter={(val) => [typeof val === 'number' ? fmtUSD(val) : String(val), 'Close']}
            />
            <Line type="monotone" dataKey="close" stroke="#3B82F6" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
