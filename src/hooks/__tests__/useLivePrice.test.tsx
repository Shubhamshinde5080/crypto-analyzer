import { renderHook, act } from '@testing-library/react';
import WS from 'jest-websocket-mock';
import { useLivePrice } from '../useLivePrice';

test('receives live price updates', async () => {
  const server = new WS('wss://stream.binance.com/ws/btcusdt@trade');

  const { result } = renderHook(() => useLivePrice('bitcoin'));
  await server.connected;

  act(() => {
    server.send(JSON.stringify({ p: '50000', T: Date.now() }));
  });

  await new Promise((r) => setTimeout(r, 0));

  expect(result.current).toBe(50000);
  server.close();
  WS.clean();
});
