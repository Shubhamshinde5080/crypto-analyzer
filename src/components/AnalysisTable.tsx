'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import type { HistoryData } from '@/types/api';
import { fmtUSD } from '@/lib/format';

// Import the arrow icons from the proper path
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

interface Props {
  data: HistoryData[];
}
export default function AnalysisTable({ data }: Props) {
  const [page, setPage] = useState(1);
  const per = 20;
  const total = Math.ceil(data.length / per);
  const slice = data.slice((page - 1) * per, page * per);

  return (
    <section className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['Time', 'Open', 'High', 'Low', 'Close', 'Volume', '% Change'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {slice.map((row) => (
              <tr key={row.timestamp} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                  {format(new Date(row.timestamp), 'MMM dd, HH:mm')}
                </td>
                <td className="px-4 py-2 text-sm text-right font-mono">{fmtUSD(row.open)}</td>
                <td className="px-4 py-2 text-sm text-right font-mono">{fmtUSD(row.high)}</td>
                <td className="px-4 py-2 text-sm text-right font-mono">{fmtUSD(row.low)}</td>
                <td className="px-4 py-2 text-sm text-right font-mono">{fmtUSD(row.close)}</td>
                <td className="px-4 py-2 text-sm text-right font-mono">
                  {row.volume.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm text-center flex justify-center items-center">
                  {row.pctChange !== null ? (
                    row.pctChange >= 0 ? (
                      <ArrowUpIcon className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-red-600" />
                    )
                  ) : (
                    '—'
                  )}
                  <span className="ml-1">
                    {row.pctChange !== null ? `${Math.abs(row.pctChange).toFixed(2)}%` : ''}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {page} of {total}
        </span>
        <button
          disabled={page === total}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}
