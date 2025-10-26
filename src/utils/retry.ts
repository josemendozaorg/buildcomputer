/**
 * Retry Utility
 *
 * Implements exponential backoff with jitter for network retry.
 * Based on AWS/Google Cloud best practices.
 */

export interface RetryOptions {
  maxAttempts?: number; // Default: 3
  baseDelay?: number; // Base delay in ms (default: 1000)
  jitterPercent?: number; // Jitter as decimal (default: 0.25 = ±25%)
  onRetry?: (attempt: number, delay: number) => void; // Callback before each retry
}

/**
 * Calculate retry delay with exponential backoff and jitter
 *
 * Formula: delay = baseDelay * (2 ^ (attempt - 1)) * (1 ± jitter)
 *
 * @param attempt - Current attempt number (1-based)
 * @param baseDelay - Base delay in milliseconds
 * @param jitterPercent - Jitter percentage as decimal (0.25 = ±25%)
 * @returns Delay in milliseconds
 *
 * @example
 * calculateDelay(1, 1000, 0.25) // 750-1250ms (1s ± 25%)
 * calculateDelay(2, 1000, 0.25) // 1500-2500ms (2s ± 25%)
 * calculateDelay(3, 1000, 0.25) // 3000-5000ms (4s ± 25%)
 */
export function calculateDelay(
  attempt: number,
  baseDelay: number,
  jitterPercent: number,
): number {
  // Exponential backoff: 2^(attempt-1)
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);

  // Apply jitter: delay * (1 ± jitter)
  // Formula: 1 + (random between -1 and 1) * jitterPercent
  const jitter = 1 + (Math.random() * 2 - 1) * jitterPercent;
  return Math.round(exponentialDelay * jitter);
}

/**
 * Retry a function with exponential backoff
 *
 * @param fn - Async function to retry
 * @param options - Retry configuration
 * @returns Result of successful function call
 * @throws Error from last attempt if all retries fail
 *
 * @example
 * const result = await retryWithBackoff(
 *   () => fetch('/api/chat'),
 *   { maxAttempts: 3, baseDelay: 1000, jitterPercent: 0.25 }
 * );
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    jitterPercent = 0.25,
    onRetry,
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on last attempt
      if (attempt === maxAttempts) {
        break;
      }

      // Calculate delay with exponential backoff + jitter
      const delay = calculateDelay(attempt, baseDelay, jitterPercent);

      // Notify callback
      onRetry?.(attempt, delay);

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // All retries failed
  throw lastError || new Error("Retry failed");
}
