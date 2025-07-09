'use client';

import PriceChart from './PriceChart';
import VolumeTable from './VolumeTable';
import { format } from 'date-fns';
import type { HistoryData } from '@/types/api';
import '@/styles/pdf.css';

interface PDFReportProps {
  coin: string;
  from: string;
  to: string;
  data: HistoryData[];
}

export default function PDFReport({ coin, from, to, data }: PDFReportProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">No Data Available</h1>
        <p>Unable to generate report for {coin.toUpperCase()}</p>
      </div>
    );
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

  // Split data into chunks for better PDF pagination
  const ROWS_PER_PAGE = 25; // Reduced to ensure tables fit on pages
  const dataChunks = [];
  for (let i = 0; i < data.length; i += ROWS_PER_PAGE) {
    dataChunks.push(data.slice(i, i + ROWS_PER_PAGE));
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 0;
          }

          #pdf-report {
            background: white !important;
            color: black !important;
          }

          .page-break {
            page-break-after: always;
          }

          .avoid-break {
            page-break-inside: avoid;
          }

          table {
            border-collapse: collapse;
            width: 100%;
            font-size: 10px;
            page-break-inside: avoid;
          }

          th,
          td {
            border: 1px solid #000;
            padding: 2px 4px;
            text-align: left;
          }

          th {
            background-color: #f0f0f0 !important;
            font-weight: bold;
          }

          .chart-container {
            height: 250px !important;
            width: 100% !important;
            display: block !important;
            page-break-inside: avoid;
          }

          .data-table-container {
            page-break-inside: avoid;
            margin-bottom: 20px;
          }

          .data-table-container h3 {
            margin-top: 0;
            margin-bottom: 10px;
          }
        }
      `}</style>
      <div id="pdf-report" className="bg-white text-black print:text-black print:bg-white">
        {/* Page 1: COVER */}
        <div className="pdf-page page-break p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6 text-blue-600">📈 Crypto Analyzer</h1>
            <h2 className="text-3xl mb-4 text-gray-800">Professional Cryptocurrency Analysis</h2>
            <div className="border-t border-b border-gray-300 py-4 my-6">
              <h3 className="text-2xl font-semibold mb-2">{coin.toUpperCase()}</h3>
              <p className="text-lg mb-1">
                <strong>From:</strong> {format(new Date(from), 'yyyy-MM-dd HH:mm')}
              </p>
              <p className="text-lg mb-4">
                <strong>To:</strong> {format(new Date(to), 'yyyy-MM-dd HH:mm')}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-8">
              Generated: {format(new Date(), 'yyyy-MM-dd HH:mm')}
            </p>
          </div>
        </div>

        {/* Page 2: SUMMARY */}
        <div className="pdf-page page-break p-8">
          <h2 className="text-2xl font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-50 p-4 rounded border">
              <h3 className="font-semibold mb-2">Performance Overview</h3>
              <ul className="space-y-2">
                <li>
                  <strong>Overall % change:</strong>{' '}
                  <span className={overallPct >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {overallPct.toFixed(2)}%
                  </span>
                </li>
                <li>
                  <strong>Total data points:</strong> {data.length.toLocaleString()}
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded border">
              <h3 className="font-semibold mb-2">Volume Analysis</h3>
              <ul className="space-y-2">
                <li>
                  <strong>Average volume per interval:</strong>{' '}
                  {avgVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </li>
                <li>
                  <strong>Peak volume in an interval:</strong> {peakVolume.toLocaleString()}
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded border">
              <h3 className="font-semibold mb-2">Price Extremes</h3>
              <ul className="space-y-2">
                <li>
                  <strong>Max rise:</strong>{' '}
                  <span className="text-green-600">{maxRise.pct?.toFixed(2)}%</span> at{' '}
                  {maxRise.ts ? format(new Date(maxRise.ts), 'yyyy-MM-dd HH:mm') : '—'}
                </li>
                <li>
                  <strong>Max fall:</strong>{' '}
                  <span className="text-red-600">{maxFall.pct?.toFixed(2)}%</span> at{' '}
                  {maxFall.ts ? format(new Date(maxFall.ts), 'yyyy-MM-dd HH:mm') : '—'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pages 3+: DATA & CHARTS */}
        <div className="p-4">
          {/* CHARTS: Full width, then break for data tables */}
          <div className="pdf-page page-break mb-8">
            <h2 className="text-xl font-semibold mb-4">Price Analysis</h2>
            <div className="mb-6 avoid-break">
              <h3 className="text-lg font-medium mb-2">Price Trend (Close)</h3>
              <div className="chart-container" style={{ height: '300px', width: '100%' }}>
                <PriceChart data={data} />
              </div>
            </div>
            <div className="avoid-break">
              <h3 className="text-lg font-medium mb-2">Volume Analysis</h3>
              <div className="chart-container" style={{ height: '300px', width: '100%' }}>
                <VolumeTable data={data} />
              </div>
            </div>
          </div>

          {/* DATA TABLES - Split into chunks for better pagination */}
          {dataChunks.map((chunk, chunkIndex) => (
            <div key={chunkIndex} className="data-table-container page-break">
              <h3 className="text-lg font-semibold mb-2">
                Historical Data - Page {chunkIndex + 1} of {dataChunks.length}
              </h3>
              <div className="avoid-break">
                <table className="w-full border-collapse text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-1 py-1 text-left">Time</th>
                      <th className="border border-gray-300 px-1 py-1 text-right">Open</th>
                      <th className="border border-gray-300 px-1 py-1 text-right">High</th>
                      <th className="border border-gray-300 px-1 py-1 text-right">Low</th>
                      <th className="border border-gray-300 px-1 py-1 text-right">Close</th>
                      <th className="border border-gray-300 px-1 py-1 text-right">Volume</th>
                      <th className="border border-gray-300 px-1 py-1 text-right">% Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chunk.map((row, rowIndex) => (
                      <tr key={`${chunkIndex}-${rowIndex}`} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-1 py-1">
                          {format(new Date(row.timestamp), 'MM-dd HH:mm')}
                        </td>
                        <td className="border border-gray-300 px-1 py-1 text-right">
                          {row.open.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="border border-gray-300 px-1 py-1 text-right">
                          {row.high.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="border border-gray-300 px-1 py-1 text-right">
                          {row.low.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="border border-gray-300 px-1 py-1 text-right">
                          {row.close.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="border border-gray-300 px-1 py-1 text-right">
                          {row.volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                        <td className="border border-gray-300 px-1 py-1 text-right">
                          {row.pctChange !== null ? `${row.pctChange.toFixed(2)}%` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
