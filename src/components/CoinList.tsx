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

  useEffect(() => {
    async function fetchCoins() {
      try {
        setLoading(true);
        setError(null);

        // Use mock data for testing or when API is unavailable
        if (process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 100));
          setCoins(mockCoins);
          return;
        }

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

        // Fall back to mock data if API fails
        console.log('Falling back to mock data...');
        setCoins(mockCoins);
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

      <LoadingState loading={loading} error={error} loadingComponent={<Skeleton />}>
        <div className="overflow-auto">
          <table
            className="min-w-[720px] sm:min-w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg"
            role="table"
          >
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
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
                <tr
                  key={c.id}
                  className="hover:bg-gray-50/75 dark:hover:bg-gray-700/75 transition-colors"
                >
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
                    {c.current_price !== undefined && c.current_price !== null
                      ? fmtUSD(c.current_price)
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${c.total_volume?.toLocaleString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/coins/${c.id}/history`}
                      className="btn btn-primary"
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
            className="btn btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="btn btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Go to next page"
          >
            Next
          </button>
        </nav>
      </LoadingState>
    </div>
  );
}
