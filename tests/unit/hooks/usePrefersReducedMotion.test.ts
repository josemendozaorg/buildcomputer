/**
 * Tests for usePrefersReducedMotion hook
 */

import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePrefersReducedMotion } from '../../../src/hooks/usePrefersReducedMotion';

describe('usePrefersReducedMotion', () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock window.matchMedia
    mockMatchMedia = vi.fn();
    window.matchMedia = mockMatchMedia;
  });

  it('should return false when prefers-reduced-motion is not set', () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);
  });

  it('should return true when prefers-reduced-motion: reduce is set', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(true);
  });

  it('should add and remove event listener on mount/unmount', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    });

    const { unmount } = renderHook(() => usePrefersReducedMotion());

    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });
});
