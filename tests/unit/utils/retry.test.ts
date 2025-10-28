/**
 * Unit Tests: Retry Utility
 *
 * Tests exponential backoff with jitter for network retry logic.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { calculateDelay, retryWithBackoff } from "../../../src/utils/retry";

describe("retry utility", () => {
  describe("calculateDelay", () => {
    it("should calculate delay for attempt 1 within expected range", () => {
      // Attempt 1: 1s ± 25% = 750-1250ms
      const delays = Array.from({ length: 100 }, () =>
        calculateDelay(1, 1000, 0.25),
      );

      delays.forEach((delay) => {
        expect(delay).toBeGreaterThanOrEqual(750);
        expect(delay).toBeLessThanOrEqual(1250);
      });
    });

    it("should calculate delay for attempt 2 within expected range", () => {
      // Attempt 2: 2s ± 25% = 1500-2500ms
      const delays = Array.from({ length: 100 }, () =>
        calculateDelay(2, 1000, 0.25),
      );

      delays.forEach((delay) => {
        expect(delay).toBeGreaterThanOrEqual(1500);
        expect(delay).toBeLessThanOrEqual(2500);
      });
    });

    it("should calculate delay for attempt 3 within expected range", () => {
      // Attempt 3: 4s ± 25% = 3000-5000ms
      const delays = Array.from({ length: 100 }, () =>
        calculateDelay(3, 1000, 0.25),
      );

      delays.forEach((delay) => {
        expect(delay).toBeGreaterThanOrEqual(3000);
        expect(delay).toBeLessThanOrEqual(5000);
      });
    });

    it("should apply exponential backoff (doubling)", () => {
      const attempt1Avg =
        Array.from({ length: 100 }, () => calculateDelay(1, 1000, 0)).reduce(
          (sum, val) => sum + val,
          0,
        ) / 100;
      const attempt2Avg =
        Array.from({ length: 100 }, () => calculateDelay(2, 1000, 0)).reduce(
          (sum, val) => sum + val,
          0,
        ) / 100;

      expect(attempt2Avg).toBeCloseTo(attempt1Avg * 2, 0);
    });

    it("should return consistent delay when jitter is 0", () => {
      const delay1 = calculateDelay(1, 1000, 0);
      const delay2 = calculateDelay(1, 1000, 0);
      expect(delay1).toBe(delay2);
      expect(delay1).toBe(1000);
    });
  });

  describe("retryWithBackoff", () => {
    beforeEach(() => {
      vi.clearAllTimers();
      vi.useFakeTimers();
    });

    it("should succeed on first attempt", async () => {
      const fn = vi.fn().mockResolvedValue("success");

      const promise = retryWithBackoff(fn);
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should retry once and succeed on second attempt", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("Attempt 1 failed"))
        .mockResolvedValue("success");

      const onRetry = vi.fn();

      const promise = retryWithBackoff(fn, { onRetry });
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Number));
    });

    it("should retry twice and succeed on third attempt", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("Attempt 1 failed"))
        .mockRejectedValueOnce(new Error("Attempt 2 failed"))
        .mockResolvedValue("success");

      const onRetry = vi.fn();

      const promise = retryWithBackoff(fn, { onRetry });
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(3);
      expect(onRetry).toHaveBeenCalledTimes(2);
    });

    it("should throw error after all retries fail", async () => {
      const error = new Error("All attempts failed");
      const fn = vi.fn().mockRejectedValue(error);

      const promise = retryWithBackoff(fn, { maxAttempts: 3 });

      // Add catch handler immediately to prevent unhandled rejection warnings
      const catchHandler = promise.catch((err) => err);

      await vi.runAllTimersAsync();

      await expect(promise).rejects.toThrow("All attempts failed");
      expect(fn).toHaveBeenCalledTimes(3);

      // Ensure catch handler is resolved
      await catchHandler;
    });

    it("should respect maxAttempts option", async () => {
      const fn = vi.fn().mockRejectedValue(new Error("Failed"));

      const promise = retryWithBackoff(fn, { maxAttempts: 2 });

      // Add catch handler immediately to prevent unhandled rejection warnings
      const catchHandler = promise.catch((err) => err);

      await vi.runAllTimersAsync();

      await expect(promise).rejects.toThrow();
      expect(fn).toHaveBeenCalledTimes(2);

      // Ensure catch handler is resolved
      await catchHandler;
    });

    it("should use baseDelay option", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("Failed"))
        .mockResolvedValue("success");

      const onRetry = vi.fn();

      const promise = retryWithBackoff(fn, {
        baseDelay: 500,
        jitterPercent: 0,
        onRetry,
      });
      await vi.runAllTimersAsync();
      await promise;

      // With 0 jitter, delay should be exactly baseDelay * 2^0 = 500ms
      expect(onRetry).toHaveBeenCalledWith(1, 500);
    });

    it("should invoke onRetry callback before each retry", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("Failed"))
        .mockRejectedValueOnce(new Error("Failed"))
        .mockResolvedValue("success");

      const onRetry = vi.fn();

      const promise = retryWithBackoff(fn, { onRetry });
      await vi.runAllTimersAsync();
      await promise;

      expect(onRetry).toHaveBeenCalledTimes(2);
      expect(onRetry).toHaveBeenNthCalledWith(1, 1, expect.any(Number));
      expect(onRetry).toHaveBeenNthCalledWith(2, 2, expect.any(Number));
    });
  });
});
