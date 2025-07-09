// src/app/api/history/route.ts

import { parseISO } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { cacheManager } from '@/lib/cache';
import { APIError } from '@/lib/error-handling';
import { getKlines } from '@/lib/binanceREST';
import mockHistory from '@/lib/mockHistory';
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

    // Use mock data in test or when explicitly enabled
    if (process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      return NextResponse.json(mockHistory);
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

    console.log(`Requested interval: ${interval}, parsed as:`, intervalObj);
    console.log(`Bucket size in ms: ${bucketMs} (${bucketMs / 1000} seconds)`);

    // 5. Fetch raw data from Binance REST
    let klines;
    try {
      klines = await getKlines(coin, fromDate.getTime(), toDate.getTime(), interval);
    } catch (err) {
      console.error('Binance fetch failed:', err);
      return NextResponse.json({ error: 'Failed to fetch data from Binance' } as ErrorResponse, {
        status: 502,
      });
    }

    // 6. Bucket raw klines by the requested interval
    const buckets: Record<string, typeof klines> = {};
    klines.forEach((k) => {
      const bucketKey = String(Math.floor(k.timestamp / bucketMs) * bucketMs);
      if (!buckets[bucketKey]) buckets[bucketKey] = [];
      buckets[bucketKey].push(k);
    });

    console.log(`Created ${Object.keys(buckets).length} buckets for ${interval} interval`);

    // 9. Transform into sorted array with OHLC + volume + % change
    const sortedKeys = Object.keys(buckets)
      .map((k) => parseInt(k, 10))
      .sort((a, b) => a - b);

    const result: Bucket[] = [];
    for (let i = 0; i < sortedKeys.length; i++) {
      const timestamp = sortedKeys[i];
      const rows = buckets[String(timestamp)];
      rows.sort((a, b) => a.timestamp - b.timestamp);

      const open = rows[0].open;
      const close = rows[rows.length - 1].close;
      const high = Math.max(...rows.map((r) => r.high));
      const low = Math.min(...rows.map((r) => r.low));
      const volume = rows.reduce((sum, r) => sum + r.volume, 0);

      const prevClose = i > 0 ? result[i - 1].close : null;
      const pctChange = prevClose !== null ? ((close - prevClose) / prevClose) * 100 : null;

      result.push({ timestamp, open, high, low, close, volume, pctChange });
    }

    // 10. Convert to HistoryData format for caching
    const historyData: HistoryData[] = result.map((bucket) => ({
      ...bucket,
      timestamp: new Date(bucket.timestamp).toISOString(),
    }));

    // Debug: Log the intervals between data points
    if (result.length > 1) {
      const intervalDiffs = [];
      for (let i = 1; i < result.length; i++) {
        const diff = result[i].timestamp - result[i - 1].timestamp;
        intervalDiffs.push(diff);
      }
      const avgInterval = intervalDiffs.reduce((a, b) => a + b, 0) / intervalDiffs.length;
      console.log(
        `Average interval between buckets: ${avgInterval}ms (${avgInterval / 1000} seconds)`
      );
      console.log(`Expected interval: ${bucketMs}ms (${bucketMs / 1000} seconds)`);
    }

    console.log(`Returning ${result.length} data points`);

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
