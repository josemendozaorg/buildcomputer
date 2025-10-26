/**
 * useHapticFeedback Hook
 *
 * Provides a wrapper around the Vibration API for haptic feedback on mobile devices.
 * Includes feature detection and graceful fallback for unsupported devices.
 */

import { useCallback, useRef } from 'react';

export interface HapticFeedbackOptions {
  /**
   * Enable haptic feedback (can be toggled at runtime)
   * @default true
   */
  enabled?: boolean;

  /**
   * Fallback if vibration not supported
   * @default () => {}
   */
  fallback?: () => void;
}

export function useHapticFeedback(options: HapticFeedbackOptions = {}) {
  const { enabled = true, fallback = () => {} } = options;

  // Feature detection (cached)
  const isSupported = useRef(
    typeof navigator !== 'undefined' && 'vibrate' in navigator
  );

  /**
   * Trigger haptic feedback
   * @param pattern Vibration pattern (number or array)
   *   - number: Single vibration duration in ms
   *   - array: [vibrate, pause, vibrate, pause, ...]
   * @example
   *   vibrate(10) // Single 10ms pulse
   *   vibrate([10, 50, 10]) // Double pulse: 10ms, pause 50ms, 10ms
   */
  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (!enabled) return;

      if (isSupported.current) {
        try {
          navigator.vibrate(pattern);
        } catch (error) {
          console.warn('Vibration failed:', error);
          fallback();
        }
      } else {
        fallback();
      }
    },
    [enabled, fallback]
  );

  /**
   * Stop ongoing vibration
   */
  const stop = useCallback(() => {
    if (isSupported.current) {
      navigator.vibrate(0);
    }
  }, []);

  return {
    vibrate,
    stop,
    isSupported: isSupported.current,
  };
}
