'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import type { HistoryData } from '@/types/api';
import { motion } from 'framer-motion';

interface Props {
  data: HistoryData[];
}
const fadeSlide = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function VolumeChart({ data }: Props) {
  if (!data.length) return null;
  const chartData = data.map((d) => ({
    time: format(new Date(d.timestamp), 'MM-dd HH:mm'),
    volume: d.volume,
  }));

  return (
    <motion.section
      className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8"
      variants={fadeSlide}
      initial="hidden"
      animate="show"
    >
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
    </motion.section>
  );
}
