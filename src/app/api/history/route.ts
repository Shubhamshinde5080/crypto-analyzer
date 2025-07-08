// src/app/api/history/route.ts

import { parseISO } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { cacheManager } from '@/lib/cache';
import {
  fetchWithRetry,
  APIError,
  coinGeckoRateLimiter,
  validateEnvVars,
} from '@/lib/error-handling';
import type { HistoryData } from '@/types/api';

type Bucket = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  pctChange: number | null;
};

type ErrorResponse = { error: string; details?: string };

type CoinGeckoResponse = {
  prices: [number, number][];
  total_volumes: [number, number][];
};

function parseInterval(interval: string): { value: number; unit: 'm' | 'h' | 'd' } {
  const match = /^(\d+)([mhd])$/.exec(interval);
  if (!match) {
    throw new Error('Invalid interval format. Use number + m/h/d, e.g. 1h, 15m, 1d.');
  }
  return { value: parseInt(match[1], 10), unit: match[2] as 'm' | 'h' | 'd' };
}

function intervalToMs({ value, unit }: { value: number; unit: 'm' | 'h' | 'd' }): number {
  switch (unit) {
    case 'm':
      return value * 60_000;
    case 'h':
      return value * 3_600_000;
    case 'd':
      return value * 86_400_000;
    default:
      throw new Error('Unsupported interval unit. Use m, h or d.');
  }
}

export async function GET(request: NextRequest) {
  try {
    // Validate environment variables
    validateEnvVars(['COINGECKO_API_URL']);

    const { searchParams } = new URL(request.url);
    const coin = searchParams.get('coin');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const interval = searchParams.get('interval');

    // 1. Validate required parameters
    if (!coin || !from || !to || !interval) {
      return NextResponse.json(
        { error: 'Missing required query params: coin, from, to, interval' } as ErrorResponse,
        { status: 400 }
      );
    }

    // 2. Check cache first
    try {
      const cachedData = await cacheManager.getCachedHistory(coin, from, to, interval);
      if (cachedData) {
        console.log('Cache hit for history request');
        return NextResponse.json(cachedData);
      }
    } catch (cacheError) {
      console.warn('Cache read error:', cacheError);
      // Continue without cache
    }

    // 3. Parse & validate dates
    const fromDate = parseISO(from);
    const toDate = parseISO(to);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return NextResponse.json(
        {
          error: 'Invalid "from" or "to" format. Use ISO strings (e.g. 2025-07-01T20:00:00Z).',
        } as ErrorResponse,
        { status: 400 }
      );
    }
    if (fromDate >= toDate) {
      return NextResponse.json({ error: '"from" must be before "to".' } as ErrorResponse, {
        status: 400,
      });
    }

    // 4. Parse interval and convert to milliseconds
    const intervalObj = parseInterval(interval);
    const bucketMs = intervalToMs(intervalObj);

    // 5. Apply rate limiting
    await coinGeckoRateLimiter.waitIfNeeded();

    // 6. Fetch raw data from CoinGecko with retry logic
    const base = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
    const fromTs = Math.floor(fromDate.getTime() / 1000);
    const toTs = Math.floor(toDate.getTime() / 1000);
    const url =
      `${base}/coins/${encodeURIComponent(coin)}/market_chart/range` +
      `?vs_currency=usd&from=${fromTs}&to=${toTs}`;

    const apiRes = await fetchWithRetry(url, {}, { maxRetries: 3, baseDelay: 1000 });
    const { prices = [], total_volumes: volumes = [] } = (await apiRes.json()) as CoinGeckoResponse;

    // 7. Build a map for volume lookups
    const volMap = new Map(volumes.map(([timestamp, volume]) => [timestamp, volume]));

    // 8. Bucket data by intervals
    const buckets: Record<string, { prices: number[]; vols: number[] }> = {};
    prices.forEach(([timestamp, price]) => {
      const bucketKey = String(Math.floor(timestamp / bucketMs) * bucketMs);
      if (!buckets[bucketKey]) {
        buckets[bucketKey] = { prices: [], vols: [] };
      }
      buckets[bucketKey].prices.push(price);
      buckets[bucketKey].vols.push(volMap.get(timestamp) ?? 0);
    });

    // 9. Transform into sorted array with OHLC + volume + % change
    const sortedKeys = Object.keys(buckets)
      .map((k) => parseInt(k, 10))
      .sort((a, b) => a - b);

    const result: Bucket[] = [];
    for (let i = 0; i < sortedKeys.length; i++) {
      const timestamp = sortedKeys[i];
      const { prices: ps, vols: vs } = buckets[String(timestamp)];

      const open = ps[0];
      const close = ps[ps.length - 1];
      const high = Math.max(...ps);
      const low = Math.min(...ps);
      const volume = vs.reduce((sum, x) => sum + x, 0);

      const prevClose = i > 0 ? result[i - 1].close : null;
      const pctChange = prevClose !== null ? ((close - prevClose) / prevClose) * 100 : null;

      result.push({ timestamp, open, high, low, close, volume, pctChange });
    }

    // 10. Convert to HistoryData format for caching
    const historyData: HistoryData[] = result.map((bucket) => ({
      ...bucket,
      timestamp: new Date(bucket.timestamp).toISOString(),
    }));

    // 11. Cache the result
    try {
      await cacheManager.setCachedHistory(coin, from, to, interval, historyData);
    } catch (cacheError) {
      console.warn('Cache write error:', cacheError);
      // Continue without caching
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('History API error:', err);

    if (err instanceof APIError) {
      return NextResponse.json(
        { error: err.message, details: err.originalError?.message } as ErrorResponse,
        { status: err.statusCode || 500 }
      );
    }

    const error = err as Error;
    return NextResponse.json(
      { error: 'Internal server error', details: error.message } as ErrorResponse,
      { status: 500 }
    );
  }
}
