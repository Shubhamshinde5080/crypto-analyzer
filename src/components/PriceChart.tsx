// components/PriceChart.tsx
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
import { motion } from 'framer-motion';
import type { HistoryData } from '@/types/api';
import { fmtUSD } from '@/lib/format';
import { motion } from 'framer-motion';

interface Props {
  data: HistoryData[];
}


const fadeSlide = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function PriceChart({ data }: Props) {
  if (!data.length) return null;

  const chartData = data.map((d) => ({
    time: format(new Date(d.timestamp), 'MM-dd HH:mm'),
    close: d.close,
  }));

  return (
    <motion.section
      className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8"
      variants={fadeSlide}
      initial="hidden"
      animate="show"
      variants={fadeSlide}
      initial="hidden"
      animate="show"
      className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Chart</h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(val: number) => fmtUSD(val)}
            />
            <Tooltip
              labelFormatter={(label) => `Time: ${label}`}
              formatter={(val) => [fmtUSD(val as number), 'Close']}
            />
            <Line type="monotone" dataKey="close" stroke="#3B82F6" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}