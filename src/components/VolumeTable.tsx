'use client';

import { format } from 'date-fns';
import type { HistoryData } from '@/types/api';
import { fmtUSD } from '@/lib/format';

interface Props {
  data: HistoryData[];
}
export default function VolumeTable({ data }: Props) {
  if (!data.length) return null;

  // Get the latest 10 entries for volume analysis
  const recentData = data.slice(-10);

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(2)}K`;
    }
    return volume.toLocaleString();
  };

  return (
    <div className="space-y-4">
      {/* Volume Summary */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg Volume</p>
          <p className="text-sm font-medium">
            {formatVolume(data.reduce((a, b) => a + b.volume, 0) / data.length)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Peak Volume</p>
          <p className="text-sm font-medium">
            {formatVolume(Math.max(...data.map((d) => d.volume)))}
          </p>
        </div>
      </div>

      {/* Recent Volume Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <th className="text-left py-2 text-gray-500 dark:text-gray-400">Time</th>
              <th className="text-right py-2 text-gray-500 dark:text-gray-400">Volume</th>
              <th className="text-right py-2 text-gray-500 dark:text-gray-400">Price</th>
            </tr>
          </thead>
          <tbody>
            {recentData.map((row) => (
              <tr key={row.timestamp} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-2 text-gray-900 dark:text-white">
                  {format(new Date(row.timestamp), 'MM-dd HH:mm')}
                </td>
                <td className="py-2 text-right font-mono text-gray-900 dark:text-white">
                  {formatVolume(row.volume)}
                </td>
                <td className="py-2 text-right font-mono text-gray-900 dark:text-white">
                  {fmtUSD(row.close)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
