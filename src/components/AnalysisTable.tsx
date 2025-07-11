'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { HistoryData } from '@/types/api';
import { fmtUSD } from '@/lib/format';
import Badge from './Badge';

const fadeSlide = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

interface Props {
  data: HistoryData[];
}

export default function AnalysisTable({ data }: Props) {
  const [page, setPage] = useState(1);
  const per = 20;
  const total = Math.ceil(data.length / per);
  const slice = data.slice((page - 1) * per, page * per);

  if (!data.length) return null;

  return (
    <motion.section
      className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8"
      variants={fadeSlide}
      initial="hidden"
      animate="show"
    >
      <div className="overflow-auto">
        <table className="min-w-[720px] sm:min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 shadow-sm">
            <tr className="divide-x divide-gray-200 dark:divide-gray-700">
              {['Time', 'Open', 'High', 'Low', 'Close', 'Volume', '% Change'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {slice.map((row) => (
              <tr
                key={row.timestamp}
                className="hover:bg-gray-50/75 dark:hover:bg-gray-700/75 transition-colors divide-x divide-gray-200 dark:divide-gray-700"
              >
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                  {format(new Date(row.timestamp), 'MMM dd, HH:mm')}
                </td>
                <td className="px-4 py-2 text-sm text-right font-mono whitespace-nowrap">
                  {fmtUSD(row.open)}
                </td>
                <td className="px-4 py-2 text-sm text-right font-mono whitespace-nowrap">
                  {fmtUSD(row.high)}
                </td>
                <td className="px-4 py-2 text-sm text-right font-mono whitespace-nowrap">
                  {fmtUSD(row.low)}
                </td>
                <td className="px-4 py-2 text-sm text-right font-mono whitespace-nowrap">
                  {fmtUSD(row.close)}
                </td>
                <td className="px-4 py-2 text-sm text-right font-mono whitespace-nowrap">
                  {row.volume.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm text-center whitespace-nowrap">
                  {row.pctChange !== null ? (
                    <Badge tone={row.pctChange >= 0 ? 'success' : 'error'}>
                      <span className="flex items-center gap-1">
                        {row.pctChange >= 0 ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                        {Math.abs(row.pctChange).toFixed(2)}%
                      </span>
                    </Badge>
                  ) : (
                    <Badge tone="neutral">—</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700">
        <button
          className="btn btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {page} of {total}
        </span>
        <button
          className="btn btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage((p) => Math.min(total, p + 1))}
          disabled={page === total}
        >
          Next
        </button>
      </div>
    </motion.section>
  );
}
