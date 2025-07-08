// src/app/api/history/route.ts

import { parseISO } from 'date-fns';
import { NextRequest } from 'next/server';

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
    const { searchParams } = new URL(request.url);
    const coin = searchParams.get('coin');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const interval = searchParams.get('interval');

    // 1. Validate required parameters
    if (!coin || !from || !to || !interval) {
      return Response.json(
        { error: 'Missing required query params: coin, from, to, interval' } as ErrorResponse,
        { status: 400 }
      );
    }

    // 2. Parse & validate dates
    const fromDate = parseISO(from);
    const toDate = parseISO(to);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return Response.json(
        {
          error: 'Invalid "from" or "to" format. Use ISO strings (e.g. 2025-07-01T20:00:00Z).',
        } as ErrorResponse,
        { status: 400 }
      );
    }
    if (fromDate >= toDate) {
      return Response.json({ error: '"from" must be before "to".' } as ErrorResponse, {
        status: 400,
      });
    }

    // 3. Parse interval and convert to milliseconds
    const intervalObj = parseInterval(interval);
    const bucketMs = intervalToMs(intervalObj);

    // 4. Fetch raw data from CoinGecko
    const base = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
    const fromTs = Math.floor(fromDate.getTime() / 1000);
    const toTs = Math.floor(toDate.getTime() / 1000);
    const url =
      `${base}/coins/${encodeURIComponent(coin)}/market_chart/range` +
      `?vs_currency=usd&from=${fromTs}&to=${toTs}`;

    const apiRes = await fetch(url);
    if (!apiRes.ok) {
      return Response.json(
        { error: `CoinGecko API error: ${apiRes.statusText}` } as ErrorResponse,
        { status: apiRes.status }
      );
    }

    const { prices = [], total_volumes: volumes = [] } = (await apiRes.json()) as CoinGeckoResponse;

    // 5. Build a map for volume lookups
    const volMap = new Map(volumes.map(([timestamp, volume]) => [timestamp, volume]));

    // 6. Bucket data by intervals
    const buckets: Record<string, { prices: number[]; vols: number[] }> = {};
    prices.forEach(([timestamp, price]) => {
      const bucketKey = String(Math.floor(timestamp / bucketMs) * bucketMs);
      if (!buckets[bucketKey]) {
        buckets[bucketKey] = { prices: [], vols: [] };
      }
      buckets[bucketKey].prices.push(price);
      buckets[bucketKey].vols.push(volMap.get(timestamp) ?? 0);
    });

    // 7. Transform into sorted array with OHLC + volume + % change
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

    return Response.json(result);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('History API error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message } as ErrorResponse,
      { status: 500 }
    );
  }
}
