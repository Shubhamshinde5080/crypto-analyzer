'use client';

import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';
import type { HistoryData } from '@/types/api';
import { fmtUSD } from '@/lib/format';
import { useLivePrice } from '@/hooks/useLivePrice';

const fadeSlide = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

interface AnalysisSummaryProps {
  data: HistoryData[];
  coin: string;
}

export default function AnalysisSummary({ data, coin }: AnalysisSummaryProps) {
  const live = useLivePrice(coin);
  if (!data.length) return null;

  const open = data[0].open;
  const close = data[data.length - 1].close;
  const pctChange = ((close - open) / open) * 100;
  const positive = pctChange >= 0;

  const prices = data.map((d) => d.close);
  const volumes = data.map((d) => d.volume);

  const high = Math.max(...prices);
  const low = Math.min(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  const peakVolume = Math.max(...volumes);

  const pctChanges = data.map((d) => d.pctChange).filter((c): c is number => c !== null);
  const bestGain = pctChanges.length ? Math.max(...pctChanges) : 0;
  const worstLoss = pctChanges.length ? Math.min(...pctChanges) : 0;

  const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
  const vol = (v: number) =>
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
        <span className="ml-2 text-xs text-blue-500">{live ? `(Live: ${fmtUSD(live)})` : ''}</span>
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Overall performance */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Overall Performance
          </h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {fmtUSD(open)} <span className="mx-1">→</span> {fmtUSD(close)}
            </p>
            <div
              className={`flex items-center ${positive ? 'text-green-600' : 'text-red-600'}`}
              aria-live="polite"
            >
              {positive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              <span className="ml-1 font-bold">{pct(pctChange)}</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <Stat label="High" value={fmtUSD(high)} />
          <Stat label="Low" value={fmtUSD(low)} />
          <Stat label="Avg Price" value={fmtUSD(avgPrice)} />
          <Stat label="Range" value={fmtUSD(high - low)} />
          <Stat label="Avg Volume" value={vol(avgVolume)} />
          <Stat label="Peak Volume" value={vol(peakVolume)} />
          <Stat
            label="Best Gain"
            value={pct(bestGain)}
            icon={<ArrowUp className="h-4 w-4 text-green-600" />}
          />
          <Stat
            label="Worst Loss"
            value={pct(worstLoss)}
            icon={<ArrowDown className="h-4 w-4 text-red-600" />}
          />
        </div>
      </div>
    </motion.section>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      {icon && <span className="mr-1">{icon}</span>}
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
