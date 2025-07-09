import { useEffect, useState } from 'react';
import { makeTradeSocket } from '@/lib/binanceWS';
import { toBinanceSymbol } from '@/lib/symbolMap';

export function useLivePrice(coin: string) {
  const [price, setPrice] = useState<number | null>(null);
  useEffect(() => {
    const symbol = toBinanceSymbol[coin];
    if (!symbol) return;
    const sock = makeTradeSocket(symbol);
    sock.onTick((p) => setPrice(p));
    return () => sock.close();
  }, [coin]);
  return price;
}
