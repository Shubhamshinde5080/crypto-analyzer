'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type HistoryFormProps = {
  coin: string;
};

type IntervalType = '15m' | '30m' | '1h' | '4h' | '6h' | '1d';

export default function HistoryForm({ coin }: HistoryFormProps) {
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [interval, setInterval] = useState<IntervalType>('1h');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coin || !from || !to) return;

    const fromISO = new Date(from).toISOString();
    const toISO = new Date(to).toISOString();
    router.push(`/coins/${coin}/history/results?from=${fromISO}&to=${toISO}&interval=${interval}`);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Historical Data Analysis</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Date & Time:</label>
          <input
            type="datetime-local"
            required
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full max-w-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To Date & Time:</label>
          <input
            type="datetime-local"
            required
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full max-w-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Interval:</label>
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value as IntervalType)}
            className="border border-gray-300 p-3 rounded-lg w-full max-w-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="15m">15 minutes</option>
            <option value="30m">30 minutes</option>
            <option value="1h">1 hour</option>
            <option value="4h">4 hours</option>
            <option value="6h">6 hours</option>
            <option value="1d">1 day</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Analyze Historical Data
        </button>
      </form>
    </div>
  );
}
