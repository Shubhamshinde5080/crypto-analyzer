// Mock CoinGecko API response
const mockCoins = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 43500.25,
    market_cap: 850000000000,
    market_cap_rank: 1,
    total_volume: 25000000000,
    price_change_percentage_24h: 2.5,
    last_updated: '2025-07-08T18:00:00.000Z',
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 2650.75,
    market_cap: 320000000000,
    market_cap_rank: 2,
    total_volume: 15000000000,
    price_change_percentage_24h: -1.2,
    last_updated: '2025-07-08T18:00:00.000Z',
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    current_price: 0.45,
    market_cap: 16000000000,
    market_cap_rank: 3,
    total_volume: 800000000,
    price_change_percentage_24h: 3.8,
    last_updated: '2025-07-08T18:00:00.000Z',
  },
];

export default mockCoins;
