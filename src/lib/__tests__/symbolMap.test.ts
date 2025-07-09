import { toBinanceSymbol } from '../symbolMap';

describe('symbolMap', () => {
  it('maps bitcoin to BTCUSDT', () => {
    expect(toBinanceSymbol.bitcoin).toBe('BTCUSDT');
  });
});
