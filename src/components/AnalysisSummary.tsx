'use client';

import type { HistoryData } from '@/types/api';
import { fmtUSD } from '@/lib/format';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeSlide = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

interface AnalysisSummaryProps {
  data: HistoryData[];
  coin: string;
}

export default function AnalysisSummary({ data, coin }: AnalysisSummaryProps) {
  if (!data.length) return null;

  const openPrice = data[0].open;
  const closePrice = data[data.length - 1].close;
  const overallChange = openPrice ? ((closePrice - openPrice) / openPrice) * 100 : 0;
  const positive = overallChange >= 0;

  const prices = data.map((d) => d.close);
  const volumes = data.map((d) => d.volume);

  const high = Math.max(...prices);
  const low = Math.min(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  const peakVolume = Math.max(...volumes);

  const pctChanges = data
    .map((d) => d.pctChange)
    .filter((c): c is number => c !== null && c !== undefined);

  const bestGain = pctChanges.length ? Math.max(...pctChanges) : 0;
  const worstLoss = pctChanges.length ? Math.min(...pctChanges) : 0;

  const fmt = fmtUSD;
  const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
  const fmtVol = (v: number) =>
    v >= 1e9
      ? `${(v / 1e9).toFixed(1)}B`
      : v >= 1e6
        ? `${(v / 1e6).toFixed(1)}M`
        : `${(v / 1e3).toFixed(1)}K`;

  return (
    <motion.section
      className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8"
      variants={fadeSlide}
      initial="hidden"
      animate="show"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {coin.toUpperCase()} Analysis Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Overall Performance
          </h3>

          <div className="flex items-center justify-between mt-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {fmt(openPrice)}
              <span className="mx-1">→</span>
              {fmt(closePrice)}
            </p>

            <div className={`${positive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              {positive ? (
                <TrendingUp className="h-6 w-6" />
              ) : (
                <TrendingDown className="h-6 w-6" />
              )}
              <span className="ml-2 font-semibold" aria-live="polite">
                {fmtPct(overallChange)}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Stat label="High Price" value={fmt(high)} />
          <Stat label="Low Price" value={fmt(low)} />
          <Stat label="Avg Price" value={fmt(avgPrice)} />
          <Stat label="Price Range" value={fmt(high - low)} />
          <Stat label="Avg Volume" value={fmtVol(avgVolume)} />
          <Stat label="Peak Volume" value={fmtVol(peakVolume)} />
          <Stat
            label="Best Gain"
            value={fmtPct(bestGain)}
            icon={<ArrowUp className="h-5 w-5 text-green-600" />}
          />
          <Stat
            label="Worst Loss"
            value={fmtPct(worstLoss)}
            icon={<ArrowDown className="h-5 w-5 text-red-600" />}
          />
        </div>
      </div>
    </motion.section>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      {icon && <span className="mr-2">{icon}</span>}
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
