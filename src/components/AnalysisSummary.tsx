'use client';

import type { HistoryData } from '@/types/api';

// Create inline SVGs for the icons
const ArrowUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
);

const ArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const ArrowTrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
    />
  </svg>
);

const ArrowTrendingDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181"
    />
  </svg>
);

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

  const pctChanges = data.map((d) => d.pctChange).filter((c): c is number => c !== null);
  const bestGain = pctChanges.length ? Math.max(...pctChanges) : 0;
  const worstLoss = pctChanges.length ? Math.min(...pctChanges) : 0;

  const fmt = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
  const fmtVol = (v: number) =>
    v >= 1e9
      ? `${(v / 1e9).toFixed(1)}B`
      : v >= 1e6
        ? `${(v / 1e6).toFixed(1)}M`
        : `${(v / 1e3).toFixed(1)}K`;

  return (
    <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
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
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {fmt.format(openPrice)}
                <span className="mx-1">→</span>
                {fmt.format(closePrice)}
              </p>
            </div>
            <div className={`${positive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              {positive ? (
                <ArrowTrendingUpIcon className="h-6 w-6" />
              ) : (
                <ArrowTrendingDownIcon className="h-6 w-6" />
              )}
              <span className="ml-2 font-semibold">{fmtPct(overallChange)}</span>
            </div>
          </div>
        </div>
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Stat label="High Price" value={fmt.format(high)} />
          <Stat label="Low Price" value={fmt.format(low)} />
          <Stat label="Avg Price" value={fmt.format(avgPrice)} />
          <Stat label="Price Range" value={fmt.format(high - low)} />
          <Stat label="Avg Volume" value={fmtVol(avgVolume)} />
          <Stat label="Peak Volume" value={fmtVol(peakVolume)} />
          <Stat
            label="Best Gain"
            value={fmtPct(bestGain)}
            icon={<ArrowUpIcon className="h-5 w-5 text-green-600" />}
          />
          <Stat
            label="Worst Loss"
            value={fmtPct(worstLoss)}
            icon={<ArrowDownIcon className="h-5 w-5 text-red-600" />}
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
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
