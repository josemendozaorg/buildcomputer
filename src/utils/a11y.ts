/**
 * Accessibility Utilities
 *
 * Helper functions for screen reader announcements and accessibility features.
 */

/**
 * Announce a message to screen readers via ARIA live region
 * @param message The message to announce
 */
export function announceToScreenReader(message: string): void {
  const liveRegion =
    document.getElementById('a11y-announcer') || createLiveRegion();

  liveRegion.textContent = message;

  // Clear after announcement
  setTimeout(() => {
    liveRegion.textContent = '';
  }, 1000);
}

/**
 * Create a visually hidden ARIA live region for screen reader announcements
 */
function createLiveRegion(): HTMLElement {
  const div = document.createElement('div');
  div.id = 'a11y-announcer';
  div.setAttribute('aria-live', 'polite');
  div.setAttribute('aria-atomic', 'true');
  div.className = 'sr-only absolute -left-[10000px] w-px h-px overflow-hidden';
  document.body.appendChild(div);
  return div;
}
