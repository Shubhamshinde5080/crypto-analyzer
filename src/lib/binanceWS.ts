export function makeTradeSocket(symbol: string) {
  const url = `wss://stream.binance.com/ws/${symbol.toLowerCase()}@trade`;
  let ws: WebSocket;
  const listeners: ((p: number, ts: number) => void)[] = [];

  function connect() {
    ws = new WebSocket(url);
    ws.onmessage = (ev) => {
      const { p, T } = JSON.parse(ev.data);
      listeners.forEach((fn) => fn(+p, T));
    };
    ws.onclose = () => setTimeout(connect, 1000);
  }
  connect();

  return {
    onTick(fn: (price: number, ts: number) => void) {
      listeners.push(fn);
    },
    close() {
      ws.close();
    },
  };
}
