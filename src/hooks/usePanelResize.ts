/**
 * usePanelResize Hook
 *
 * Manages resizable panel state with localStorage persistence.
 * Used for desktop layout panel size (30-70% range).
 */

import { useState, useCallback, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/storageKeys';

const DEFAULT_SIZE = 40; // 40% chat, 60% build
const MIN_SIZE = 30;
const MAX_SIZE = 70;

export interface PanelResizeState {
  /**
   * Current panel size (30-70)
   */
  panelSize: number;

  /**
   * Update panel size
   */
  setPanelSize: (size: number) => void;

  /**
   * Reset to default (40%)
   */
  resetPanelSize: () => void;

  /**
   * Whether panel size is at default
   */
  isDefault: boolean;
}

export function usePanelResize(): PanelResizeState {
  // Load from localStorage or use default
  const [panelSize, setPanelSizeState] = useState<number>(() => {
    if (typeof window === 'undefined') return DEFAULT_SIZE;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PANEL_SIZE);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (parsed >= MIN_SIZE && parsed <= MAX_SIZE) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load panel size from localStorage:', error);
    }

    return DEFAULT_SIZE;
  });

  // Persist to localStorage whenever size changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PANEL_SIZE, panelSize.toString());
    } catch (error) {
      console.warn('Failed to save panel size to localStorage:', error);
    }
  }, [panelSize]);

  // Update with validation
  const setPanelSize = useCallback((size: number) => {
    const clamped = Math.max(MIN_SIZE, Math.min(MAX_SIZE, size));
    setPanelSizeState(clamped);
  }, []);

  // Reset to default
  const resetPanelSize = useCallback(() => {
    setPanelSizeState(DEFAULT_SIZE);
  }, []);

  return {
    panelSize,
    setPanelSize,
    resetPanelSize,
    isDefault: panelSize === DEFAULT_SIZE,
  };
}
