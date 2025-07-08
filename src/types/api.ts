/**
 * Type definitions for the Crypto Analyzer application
 */

/**
 * Represents a cryptocurrency from the CoinGecko API
 */
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h?: number;
  low_24h?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  market_cap_change_24h?: number;
  market_cap_change_percentage_24h?: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
  ath?: number;
  ath_change_percentage?: number;
  ath_date?: string;
  atl?: number;
  atl_change_percentage?: number;
  atl_date?: string;
  last_updated?: string;
}

/**
 * Represents a data point in historical price/volume data
 */
export interface HistoryBucket {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  pctChange: number | null;
}

/**
 * Processed historical data with ISO string timestamp
 */
export interface HistoryData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  pctChange: number | null;
}

/**
 * Valid time intervals for historical data
 */
export type Interval = '15m' | '30m' | '1h' | '4h' | '12h' | '1d';

/**
 * Request parameters for historical data
 */
export interface HistoryRequestParams {
  coin: string;
  from: string;
  to: string;
  interval: Interval;
}

/**
 * Configuration for PDF generation
 */
export interface PDFGenerationOptions {
  coin: string;
  from: string;
  to: string;
  data: HistoryData[];
}
