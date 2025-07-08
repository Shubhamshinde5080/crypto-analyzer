/**
 * Error handling and retry utilities for API calls
 */

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Sleep utility for delays
 */
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 */
function calculateDelay(attempt: number, options: RetryOptions): number {
  const { baseDelay = 1000, maxDelay = 30000, backoffFactor = 2 } = options;
  const delay = baseDelay * Math.pow(backoffFactor, attempt);
  return Math.min(delay, maxDelay);
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof APIError) {
    // Retry on server errors (5xx) and rate limiting (429)
    return !error.statusCode || error.statusCode >= 500 || error.statusCode === 429;
  }

  if (error instanceof Error) {
    // Retry on network errors
    return (
      error.message.includes('ECONNRESET') ||
      error.message.includes('ETIMEDOUT') ||
      error.message.includes('ENOTFOUND')
    );
  }

  return true; // Default to retryable for unknown errors
}

/**
 * Retry wrapper with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3 } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry on last attempt or non-retryable errors
      if (attempt === maxRetries || !isRetryableError(error)) {
        break;
      }

      const delay = calculateDelay(attempt, options);
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error);
      await sleep(delay);
    }
  }

  // Throw the last error if all retries failed
  throw lastError;
}

/**
 * Enhanced fetch with retry logic
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  return withRetry(async () => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new APIError(`HTTP ${response.status}: ${response.statusText}`, response.status);
    }

    return response;
  }, retryOptions);
}

/**
 * Safe JSON parsing with error handling
 */
export function safeJsonParse<T>(data: string): T | null {
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('JSON parse error:', error);
    return null;
  }
}

/**
 * Validate required environment variables
 */
export function validateEnvVars(requiredVars: string[]): void {
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private requests: number[] = [];

  constructor(
    private maxRequests: number,
    private timeWindow: number // in milliseconds
  ) {}

  async waitIfNeeded(): Promise<void> {
    const now = Date.now();

    // Remove old requests outside the time window
    this.requests = this.requests.filter((time) => now - time < this.timeWindow);

    // If we're at the limit, wait
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);

      if (waitTime > 0) {
        await sleep(waitTime);
        return this.waitIfNeeded(); // Recursive call to check again
      }
    }

    // Record this request
    this.requests.push(now);
  }
}

// Global rate limiter for CoinGecko API (30 requests per minute)
export const coinGeckoRateLimiter = new RateLimiter(30, 60 * 1000);
