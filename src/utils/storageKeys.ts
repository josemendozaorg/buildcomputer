/**
 * localStorage Keys
 *
 * Centralized constants for localStorage keys used across the application.
 */

export const STORAGE_KEYS = {
  PANEL_SIZE: 'builderPanelSize',
  TUTORIAL_SEEN: 'hasSeenPanelTutorial',
  // Existing keys (for reference)
  CHAT_MESSAGES: 'chatMessages',
  CONVERSATION_STATE: 'conversationState',
  DYNAMIC_CHIPS: 'dynamicChips',
} as const;
