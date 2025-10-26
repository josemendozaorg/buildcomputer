/**
 * Animation Configuration
 *
 * Centralized animation constants for Framer Motion and CSS transitions.
 */

import type { Transition } from 'framer-motion';

/**
 * Spring physics configuration for drawer animations
 */
export const SPRING_CONFIG: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 1,
};

/**
 * Hidden state transition (non-spring)
 */
export const HIDDEN_TRANSITION: Transition = {
  duration: 0.3,
  ease: 'easeOut',
};

/**
 * Drawer animation transitions
 */
export const DRAWER_TRANSITIONS: {
  expanded: Transition;
  minimized: Transition;
  hidden: Transition;
} = {
  expanded: SPRING_CONFIG,
  minimized: SPRING_CONFIG,
  hidden: HIDDEN_TRANSITION,
};

/**
 * Fade in transition
 */
export const FADE_IN: Transition = {
  duration: 0.2,
  ease: 'easeOut',
};

/**
 * Standard animation duration in milliseconds
 */
export const ANIMATION_DURATION = 300;
