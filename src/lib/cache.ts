import { Redis } from '@upstash/redis';
import type { Coin, HistoryData } from '@/types/api';

// Cache data types
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

type CacheValue = Coin[] | HistoryData[] | Record<string, unknown>;

// Cache utility for API responses
class CacheManager {
  private redis: Redis | null = null;
  private memoryCache = new Map<string, CacheEntry<CacheValue>>();
  private readonly DEFAULT_TTL = 300; // 5 minutes in seconds

  constructor() {
    // Initialize Redis if environment variables are available
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      this.redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
    }
  }

  /**
   * Generate cache key from parameters
   */
  private generateKey(prefix: string, params: Record<string, string | number>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join('|');
    return `${prefix}:${sortedParams}`;
  }

  /**
   * Get data from cache (Redis first, then memory fallback)
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      // Try Redis first
      if (this.redis) {
        const redisData = await this.redis.get(key);
        if (redisData) {
          return redisData as T;
        }
      }

      // Fallback to memory cache
      const memoryData = this.memoryCache.get(key);
      if (memoryData && Date.now() < memoryData.expiry) {
        return memoryData.data as T;
      }

      // Remove expired memory cache entry
      if (memoryData) {
        this.memoryCache.delete(key);
      }

      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set data in cache with TTL
   */
  async set(key: string, data: CacheValue, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      // Set in Redis
      if (this.redis) {
        await this.redis.set(key, data, { ex: ttl });
      }

      // Set in memory cache as fallback
      this.memoryCache.set(key, {
        data,
        expiry: Date.now() + ttl * 1000,
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete data from cache
   */
  async delete(key: string): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.del(key);
      }
      this.memoryCache.delete(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Get cached historical data
   */
  async getCachedHistory(coin: string, from: string, to: string, interval: string) {
    const key = this.generateKey('history', { coin, from, to, interval });
    return this.get(key);
  }

  /**
   * Cache historical data
   */
  async setCachedHistory(
    coin: string,
    from: string,
    to: string,
    interval: string,
    data: HistoryData[]
  ) {
    const key = this.generateKey('history', { coin, from, to, interval });
    // Cache for 5 minutes for recent data, longer for older data
    const isRecent = new Date(to).getTime() > Date.now() - 24 * 60 * 60 * 1000; // Last 24 hours
    const ttl = isRecent ? 300 : 3600; // 5 minutes for recent, 1 hour for older
    await this.set(key, data, ttl);
  }

  /**
   * Get cached coin list
   */
  async getCachedCoins() {
    return this.get<Coin[]>('coins:market');
  }

  /**
   * Cache coin list
   */
  async setCachedCoins(data: Coin[]) {
    // Cache coin market data for 2 minutes
    await this.set('coins:market', data, 120);
  }
}

export const cacheManager = new CacheManager();
