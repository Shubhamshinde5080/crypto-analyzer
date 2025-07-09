// components/CoinList.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LoadingState } from '@/components/LoadingState';
import Skeleton from '@/components/Skeleton';
import { fetchWithRetry, APIError } from '@/lib/error-handling';
import mockCoins from '@/lib/mockData';
import type { Coin } from '@/types/api';
import { fmtUSD } from '@/lib/format';

const PER_PAGE = 20;

export default function CoinList() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /* ───────── fetch coins ──────── */
  useEffect(() => {
    async function fetchCoins() {
      try {
        setLoading(true);
        setError(null);

        // use mock data in tests or when flag set
        if (process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          await new Promise((r) => setTimeout(r, 100));
          setCoins(mockCoins);
          return;
        }

        const base = process.env.NEXT_PUBLIC_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
        const url = `${base}/coins/markets`;
        const params = new URLSearchParams({
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: '250',
          page: '1',
          sparkline: 'false',
        });

        const res = await fetchWithRetry(`${url}?${params}`);
        if (!res.ok) throw new APIError('Failed to fetch coins', res.status);
        const data: Coin[] = await res.json();
        setCoins(data);
      } catch (error: unknown) {
        console.error('Error fetching coins:', error);

        // Fall back to mock data if API fails
        console.log('Falling back to mock data...');

      } catch (err: any) {
        console.error('Error fetching coins:', err);
        // fallback to mock data
        setCoins(mockCoins);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchCoins();
  }, []);

  /* ───────── filters & pagination ──────── */
  const filtered = coins.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.symbol.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* ───────── UI ──────── */
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Crypto Analyzer</h1>

      {/* search */}
      <div className="mb-6 max-w-md">
        <label htmlFor="coin-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search Cryptocurrencies
        </label>
        <input
          id="coin-search"
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="Search coins by name or symbol…"
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Filter the list by name or symbol</p>
      </div>

      <LoadingState loading={loading} error={error} loadingComponent={<Skeleton />}>
        <div className="overflow-auto">
          <table
            className="min-w-[720px] sm:min-w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg"
            role="table"
          >

          <table className="min-w-[720px] sm:min-w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg divide-y divide-gray-200 dark:divide-gray-700">

            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
              <tr>
                {['Rank','Name','Price (USD)','Volume (24h)',''].map((h) => (
                  <th key={h} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {h || 'Actions'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pageSlice.map((c: Coin, i: number) => (
                <tr
                  key={c.id}
                  className="hover:bg-white/70 dark:hover:bg-slate-700/60 transition-colors"
                >


            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {slice.map((c, i) => (
                <tr key={c.id} className="hover:bg-white/70 dark:hover:bg-slate-700/60 transition-colors">

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {(page - 1) * PER_PAGE + i + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <Image src={c.image} alt={`${c.name} logo`} width={32} height={32} className="rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{c.symbol}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-gray-900 dark:text-white">


                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">


                    {c.current_price !== undefined && c.current_price !== null
                      ? fmtUSD(c.current_price)
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-gray-900 dark:text-white">
                    ${c.total_volume?.toLocaleString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/coins/${c.id}/history`}
                      className="btn btn-primary"
                      aria-label={`View historical data for ${c.name}`}
                    >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono">
                    {c.current_price != null ? fmtUSD(c.current_price) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono">
                    {c.total_volume != null ? `$${c.total_volume.toLocaleString()}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link href={`/coins/${c.id}/history`} className="btn btn-primary" aria-label={`View historical data for ${c.name}`}>
                      View History
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <nav className="flex justify-center items-center gap-4 mt-6" aria-label="Pagination">
          <button
            className="btn btn-ghost disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Go to previous page"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300" aria-current="page">

          >Prev</button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-ghost disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Go to next page"
          >
            Next
          </button>

          >Next</button>
        </nav>
      </LoadingState>
    </div>
  );
}
