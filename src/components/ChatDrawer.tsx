/**
 * ChatDrawer Component
 *
 * Mobile bottom sheet drawer with Framer Motion animations.
 * Supports expanded, minimized, and hidden states with swipe gestures.
 */

import { ReactNode } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { SPRING_CONFIG, HIDDEN_TRANSITION } from '../utils/animations';

export type DrawerState = 'expanded' | 'minimized' | 'hidden';

export interface ChatDrawerProps {
  /**
   * Current drawer state
   */
  state: DrawerState;

  /**
   * Callback when drawer state should change
   */
  onStateChange: (newState: DrawerState) => void;

  /**
   * Chat interface content (ChatInterface component)
   */
  children: ReactNode;

  /**
   * Last message for preview in minimized state
   */
  lastMessage?: string;

  /**
   * Enable haptic feedback on interactions
   * @default true
   */
  enableHaptics?: boolean;

  /**
   * Enable swipe gestures
   * @default true
   */
  enableGestures?: boolean;

  /**
   * Class name for custom styling
   */
  className?: string;
}

export default function ChatDrawer({
  state,
  onStateChange,
  children,
  lastMessage,
  enableHaptics = true,
  enableGestures = true,
  className = '',
}: ChatDrawerProps) {
  const { vibrate } = useHapticFeedback({ enabled: enableHaptics });
  const prefersReducedMotion = usePrefersReducedMotion();

  // Animation variants
  const drawerVariants = {
    expanded: {
      y: 0,
      height: '100vh',
      transition: prefersReducedMotion ? { duration: 0 } : SPRING_CONFIG,
    },
    minimized: {
      y: 'calc(100vh - 80px)',
      height: '80px',
      transition: prefersReducedMotion ? { duration: 0 } : SPRING_CONFIG,
    },
    hidden: {
      y: '100vh',
      height: 0,
      transition: prefersReducedMotion ? { duration: 0 } : HIDDEN_TRANSITION,
    },
  };

  // Swipe gesture handlers
  const handlePanEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!enableGestures) return;

    const { velocity, offset } = info;
    const swipeVelocity = velocity.y;
    const swipeDistance = offset.y;

    if (state === 'minimized') {
      // Swipe up to expand
      if (swipeVelocity < -0.5 || swipeDistance < -50) {
        onStateChange('expanded');
        vibrate(10);
      }
    } else if (state === 'expanded') {
      // Swipe down to minimize
      if (swipeVelocity > 0.5 || swipeDistance > 50) {
        onStateChange('minimized');
        vibrate(10);
      }
    }
  };

  const handleHeaderClick = () => {
    if (state === 'minimized') {
      onStateChange('expanded');
      vibrate(10);
    } else if (state === 'expanded') {
      onStateChange('minimized');
      vibrate(10);
    }
  };

  if (state === 'hidden') {
    return null;
  }

  return (
    <motion.div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white shadow-2xl will-change-transform ${className}`}
      variants={drawerVariants}
      animate={state}
      drag={enableGestures ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.1}
      onPanEnd={handlePanEnd}
      role="dialog"
      aria-label="AI Chat"
      aria-expanded={state === 'expanded'}
      data-testid="chat-drawer"
    >
      {/* Minimized Header (always visible) */}
      <button
        className="flex items-center justify-between w-full h-20 px-4 border-t-2 border-gray-200 hover:bg-gray-50 transition-colors"
        onClick={handleHeaderClick}
        aria-label={state === 'expanded' ? 'Minimize chat' : 'Expand chat'}
        data-testid="drawer-header"
      >
        <div className="flex items-center gap-3">
          {/* AI Icon */}
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>

          {/* Last message preview (only when minimized) */}
          {state === 'minimized' && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">AI PC Builder</p>
              {lastMessage && (
                <p className="text-xs text-gray-500 truncate">{lastMessage}</p>
              )}
            </div>
          )}

          {state === 'expanded' && (
            <p className="text-sm font-medium text-gray-900">Tap to minimize</p>
          )}
        </div>

        {/* Expand/Collapse Indicator */}
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${state === 'expanded' ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Full Chat Content (visible when expanded) */}
      {state === 'expanded' && (
        <div className="h-[calc(100vh-80px)] overflow-hidden">
          {children}
        </div>
      )}
    </motion.div>
  );
}
