'use client';

import { PriceChart } from './PriceChart';
import { VolumeChart } from './VolumeChart';
import { format } from 'date-fns';

interface HistoryData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  pctChange: number | null;
}

interface PDFReportProps {
  coin: string;
  from: string;
  to: string;
  data: HistoryData[];
}

export default function PDFReport({ coin, from, to, data }: PDFReportProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // --- compute summary stats ---
  const openPrice = data[0]?.open ?? 0;
  const closePrice = data[data.length - 1]?.close ?? 0;
  const overallPct = openPrice ? ((closePrice - openPrice) / openPrice) * 100 : 0;

  const volumes = data.map((d) => d.volume);
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / Math.max(volumes.length, 1);
  const peakVolume = Math.max(...volumes, 0);

  const pctChanges = data
    .map((d) => ({ ts: d.timestamp, pct: d.pctChange }))
    .filter((d) => d.pct !== null);

  const maxRise = pctChanges.reduce((best, cur) => (cur.pct! > best.pct! ? cur : best), {
    pct: -Infinity,
    ts: '',
  });
  const maxFall = pctChanges.reduce((worst, cur) => (cur.pct! < worst.pct! ? cur : worst), {
    pct: Infinity,
    ts: '',
  });

  return (
    <div id="pdf-report" className="bg-white text-black">
      {/* Page 1: COVER */}
      <div style={{ pageBreakAfter: 'always' }} className="p-8">
        <h1 className="text-3xl font-bold mb-4">Crypto Analyzer Report</h1>
        <h2 className="text-2xl mb-2">{coin.toUpperCase()}</h2>
        <p className="mb-1">
          <strong>From:</strong> {format(new Date(from), 'yyyy-MM-dd HH:mm')}
        </p>
        <p className="mb-4">
          <strong>To:</strong> {format(new Date(to), 'yyyy-MM-dd HH:mm')}
        </p>
        <p className="text-sm text-gray-600">Generated: {format(new Date(), 'yyyy-MM-dd HH:mm')}</p>
      </div>

      {/* Page 2: SUMMARY */}
      <div style={{ pageBreakAfter: 'always' }} className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Summary</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Overall % change:</strong> {overallPct.toFixed(2)}%
          </li>
          <li>
            <strong>Average volume per interval:</strong>{' '}
            {avgVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </li>
          <li>
            <strong>Peak volume in an interval:</strong> {peakVolume.toLocaleString()}
          </li>
          <li>
            <strong>Max rise:</strong> {maxRise.pct?.toFixed(2)}% at{' '}
            {maxRise.ts ? format(new Date(maxRise.ts), 'yyyy-MM-dd HH:mm') : '—'}
          </li>
          <li>
            <strong>Max fall:</strong> {maxFall.pct?.toFixed(2)}% at{' '}
            {maxFall.ts ? format(new Date(maxFall.ts), 'yyyy-MM-dd HH:mm') : '—'}
          </li>
        </ul>
      </div>

      {/* Pages 3+: DATA & CHARTS */}
      <div className="p-4">
        {/* DATA TABLE */}
        <div style={{ pageBreakAfter: 'always' }}>
          <table className="w-full border-collapse">
            <thead style={{ display: 'table-header-group' }} className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Time</th>
                <th className="border px-2 py-1">Open</th>
                <th className="border px-2 py-1">High</th>
                <th className="border px-2 py-1">Low</th>
                <th className="border px-2 py-1">Close</th>
                <th className="border px-2 py-1">Volume</th>
                <th className="border px-2 py-1">% Change</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.timestamp}
                  style={{
                    pageBreakInside: 'avoid',
                    pageBreakAfter: 'auto',
                  }}
                >
                  <td className="border px-2 py-1 text-sm">
                    {format(new Date(row.timestamp), 'MM-dd HH:mm')}
                  </td>
                  <td className="border px-2 py-1 text-sm">{row.open.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-sm">{row.high.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-sm">{row.low.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-sm">{row.close.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-sm">
                    {row.volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="border px-2 py-1 text-sm">
                    {row.pctChange !== null ? `${row.pctChange.toFixed(2)}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CHARTS: two side-by-side, then break for page */}
        <div style={{ display: 'flex', justifyContent: 'space-between', pageBreakAfter: 'always' }}>
          <div className="w-1/2 pr-2">
            <h3 className="text-lg font-medium mb-2">Price (Close)</h3>
            <PriceChart data={data} />
          </div>
          <div className="w-1/2 pl-2">
            <h3 className="text-lg font-medium mb-2">Volume</h3>
            <VolumeChart data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
