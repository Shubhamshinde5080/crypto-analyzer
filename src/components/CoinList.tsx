'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LoadingState } from '@/components/LoadingState';
import { fetchWithRetry, APIError } from '@/lib/error-handling';
import type { Coin } from '@/types/api';

const PER_PAGE = 20;

export default function CoinList() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCoins() {
      try {
        setLoading(true);
        setError(null);

        const url = `${process.env.NEXT_PUBLIC_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3'}/coins/markets`;
        const params = new URLSearchParams({
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: '250',
          page: '1',
          sparkline: 'false',
        });

        const response = await fetchWithRetry(`${url}?${params}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new APIError('Failed to fetch coins', response.status);
        }

        const data: Coin[] = await response.json();
        setCoins(data);
      } catch (error) {
        console.error('Error fetching coins:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch coins'));
      } finally {
        setLoading(false);
      }
    }
    fetchCoins();
  }, []);

  const filtered = coins.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.symbol.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageSlice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Crypto Analyzer</h1>
      <div className="mb-6">
        <label
          htmlFor="coin-search"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Search Cryptocurrencies
        </label>
        <input
          id="coin-search"
          type="text"
          placeholder="Search coins by name or symbol..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full max-w-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          aria-describedby="search-help"
        />
        <p id="search-help" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Filter the cryptocurrency list by name or symbol
        </p>
      </div>

      <LoadingState loading={loading} error={error}>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg" role="table">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  scope="col"
                >
                  Rank
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  scope="col"
                >
                  Name
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  scope="col"
                >
                  Price (USD)
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  scope="col"
                >
                  Volume (24h)
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  scope="col"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pageSlice.map((c: Coin, i: number) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {(page - 1) * PER_PAGE + i + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Image
                        src={c.image}
                        alt={`${c.name} logo`}
                        width={32}
                        height={32}
                        className="mr-3 rounded-full"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {c.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {c.symbol.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${c.current_price?.toLocaleString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${c.total_volume?.toLocaleString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/coins/${c.id}/history`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                      aria-label={`View historical data for ${c.name}`}
                    >
                      View History
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <nav className="flex justify-center items-center space-x-4 mt-6" aria-label="Pagination">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go to previous page"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300" aria-current="page">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go to next page"
          >
            Next
          </button>
        </nav>
      </LoadingState>
    </div>
  );
}
