import { toBinanceSymbol } from './symbolMap';

type BinanceKline = [number, string, string, string, string, string, ...unknown[]];

export async function getKlines(coin: string, from: number, to: number, interval: string) {
  const symbol = toBinanceSymbol[coin];
  if (!symbol) throw new Error('Symbol map missing');

  let start = from;
  const all: BinanceKline[] = [];
  while (start < to) {
    const url = new URL('https://api.binance.com/api/v3/klines');
    url.searchParams.set('symbol', symbol);
    url.searchParams.set('interval', interval);
    url.searchParams.set('startTime', String(start));
    url.searchParams.set('endTime', String(to));
    url.searchParams.set('limit', '1000');

    const res = await fetch(url);
    if (!res.ok) throw new Error('Binance REST error ' + res.status);
    const batch = (await res.json()) as BinanceKline[];

    if (!batch.length) break;
    all.push(...batch);
    start = batch[batch.length - 1][0] + 1;
  }
  return all.map((k: BinanceKline) => ({
    timestamp: k[0],
    open: +k[1],
    high: +k[2],
    low: +k[3],
    close: +k[4],
    volume: +k[5],
  }));
}
