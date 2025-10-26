/**
 * useViewport Hook
 *
 * Detects viewport size and current breakpoint for responsive layouts.
 * Debounces resize events and handles orientation changes.
 */

import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

export interface ViewportState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
}

// Tailwind breakpoints
const BREAKPOINTS = {
  mobile: 0,
  tablet: 768, // md
  desktop: 1024, // lg
};

function getViewportState(width: number, height: number): ViewportState {
  const isMobile = width < BREAKPOINTS.tablet;
  const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
  const isDesktop = width >= BREAKPOINTS.desktop;

  let breakpoint: 'mobile' | 'tablet' | 'desktop';
  if (isDesktop) breakpoint = 'desktop';
  else if (isTablet) breakpoint = 'tablet';
  else breakpoint = 'mobile';

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
  };
}

export function useViewport(): ViewportState {
  // Initialize with current window size (SSR-safe)
  const [viewport, setViewport] = useState<ViewportState>(() =>
    typeof window !== 'undefined'
      ? getViewportState(window.innerWidth, window.innerHeight)
      : {
          width: 1024,
          height: 768,
          isMobile: false,
          isTablet: false,
          isDesktop: true,
          breakpoint: 'desktop' as const,
        }
  );

  useEffect(() => {
    // Update viewport state
    const handleResize = debounce(() => {
      setViewport(getViewportState(window.innerWidth, window.innerHeight));
    }, 150); // 150ms debounce

    // Initial call
    handleResize();

    // Listen to resize and orientation change
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      handleResize.cancel(); // Cancel pending debounced calls
    };
  }, []);

  return viewport;
}
