/**
 * usePrefersReducedMotion Hook
 *
 * Detects if the user has enabled reduced motion in their system preferences.
 * Used for accessibility to disable or reduce animations for users with
 * vestibular disorders or motion sensitivity.
 */

import { useState, useEffect } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * @returns true if prefers-reduced-motion: reduce is set
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  return prefersReducedMotion;
}
