/**
 * Tests for useHapticFeedback hook
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useHapticFeedback } from '../../../src/hooks/useHapticFeedback';

describe('useHapticFeedback', () => {
  let mockVibrate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockVibrate = vi.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: mockVibrate,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should detect vibration support', () => {
    const { result } = renderHook(() => useHapticFeedback());

    expect(result.current.isSupported).toBe(true);
  });

  it('should vibrate with single duration', () => {
    const { result } = renderHook(() => useHapticFeedback());

    act(() => {
      result.current.vibrate(10);
    });

    expect(mockVibrate).toHaveBeenCalledWith(10);
  });

  it('should vibrate with pattern array', () => {
    const { result } = renderHook(() => useHapticFeedback());

    act(() => {
      result.current.vibrate([10, 50, 10]);
    });

    expect(mockVibrate).toHaveBeenCalledWith([10, 50, 10]);
  });

  it('should stop vibration', () => {
    const { result } = renderHook(() => useHapticFeedback());

    act(() => {
      result.current.stop();
    });

    expect(mockVibrate).toHaveBeenCalledWith(0);
  });

  it('should not vibrate when disabled', () => {
    const { result } = renderHook(() =>
      useHapticFeedback({ enabled: false })
    );

    act(() => {
      result.current.vibrate(10);
    });

    expect(mockVibrate).not.toHaveBeenCalled();
  });

  it('should call fallback when vibration not supported', () => {
    // Remove vibrate API
    delete (navigator as { vibrate?: unknown }).vibrate;

    const fallback = vi.fn();
    const { result } = renderHook(() =>
      useHapticFeedback({ fallback })
    );

    expect(result.current.isSupported).toBe(false);

    act(() => {
      result.current.vibrate(10);
    });

    expect(fallback).toHaveBeenCalled();
  });
});
