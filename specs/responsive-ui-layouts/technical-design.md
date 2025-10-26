# Technical Design: Group 4 - Responsive UI Layouts

## Overview

**Feature:** Responsive UI Layouts for AI Conversational Builder
**Group:** 4 of 6 (Scenarios 18-21)
**Status:** Phase 3 - Technical Design
**Created:** 2025-10-26

### Purpose

This document provides the complete technical architecture for implementing responsive layouts across desktop, tablet, and mobile viewports with premium UX features including resizable panels, animated drawers, and comprehensive accessibility.

---

## Architecture Overview

### High-Level Component Diagram

```
BuilderPage (Parent - State Manager)
│
├─── Desktop Layout (≥1024px)
│    │
│    ├─── ResizablePanelGroup (react-resizable-panels)
│    │    │
│    │    ├─── Panel (Chat - 40% default)
│    │    │    └─── ChatInterface
│    │    │
│    │    ├─── PanelResizeHandle (Divider)
│    │    │
│    │    └─── Panel (Build - 60% default)
│    │         └─── BuildRecommendations
│    │
│    └─── PanelControls
│         └─── ResetButton
│
├─── Tablet Layout (768px-1023px)
│    │
│    ├─── Grid Container (50/50 vertical split)
│    │    │
│    │    ├─── ChatSection (top 50vh)
│    │    │    ├─── ChatHeader (with collapse button)
│    │    │    └─── ChatInterface
│    │    │
│    │    └─── BuildSection (bottom 50vh)
│    │         └─── BuildRecommendations
│    │
│    └─── CollapseControls
│
└─── Mobile Layout (<768px)
     │
     ├─── ChatDrawer (Framer Motion)
     │    │
     │    ├─── State: expanded (100vh)
     │    ├─── State: minimized (80px)
     │    │
     │    └─── ChatInterface
     │
     └─── BuildView
          ├─── Header (with "View Build" button)
          └─── BuildRecommendations

Shared Hooks:
├─── useViewport() → Breakpoint detection
├─── useHapticFeedback() → Vibration wrapper
└─── usePanelResize() → Panel state management
```

### Data Flow Diagram

```
User Interaction
      │
      ├─── Window Resize
      │    └─→ useViewport
      │         ├─→ Debounce (150ms)
      │         ├─→ Calculate breakpoint
      │         └─→ Update BuilderPage state
      │              └─→ Re-render with new layout
      │
      ├─── Panel Resize (Desktop)
      │    └─→ react-resizable-panels
      │         ├─→ usePanelResize hook
      │         ├─→ Update panel size state
      │         └─→ Save to localStorage
      │
      ├─── Drawer Toggle (Mobile)
      │    └─→ ChatDrawer
      │         ├─→ Framer Motion animation
      │         ├─→ useHapticFeedback (vibrate)
      │         ├─→ Update drawer state
      │         └─→ ARIA announcement
      │
      └─── Persona Selection (All Layouts)
           └─→ BuilderPage state update
                ├─→ Chat: onPersonaSuggestionAccept
                ├─→ Update selectedPersonaId
                └─→ BuildRecommendations re-renders
```

---

## Component Designs

### 1. ChatDrawer Component

**File:** `src/components/ChatDrawer.tsx`

#### Component API

```typescript
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

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
   * Animation duration in ms
   * @default 300
   */
  animationDuration?: number;

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
  animationDuration = 300,
  className,
}: ChatDrawerProps) {
  // Implementation
}
```

#### State Management

```typescript
// Internal state
const [isDragging, setIsDragging] = useState(false);
const [dragY, setDragY] = useState(0);

// Hooks
const { vibrate } = useHapticFeedback();
const prefersReducedMotion = usePrefersReducedMotion();
```

#### Framer Motion Configuration

```typescript
// Animation variants
const drawerVariants = {
  expanded: {
    y: 0,
    height: '100vh',
    transition: prefersReducedMotion
      ? { duration: 0 }
      : {
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 1,
          duration: animationDuration / 1000,
        },
  },
  minimized: {
    y: `calc(100vh - 80px)`,
    height: '80px',
    transition: prefersReducedMotion
      ? { duration: 0 }
      : {
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 1,
          duration: animationDuration / 1000,
        },
  },
  hidden: {
    y: '100vh',
    height: 0,
    transition: { duration: animationDuration / 1000, ease: 'easeOut' },
  },
};
```

#### Touch Gesture Handling

```typescript
// Swipe gesture configuration
const swipeConfig = {
  onPanStart: () => {
    setIsDragging(true);
  },
  onPan: (event: any, info: PanInfo) => {
    const { offset } = info;
    setDragY(offset.y);
  },
  onPanEnd: (event: any, info: PanInfo) => {
    setIsDragging(false);
    const { velocity, offset } = info;

    // Determine next state based on velocity and offset
    const swipeVelocity = velocity.y;
    const swipeDistance = offset.y;

    if (state === 'minimized') {
      // Swipe up to expand
      if (swipeVelocity < -0.5 || swipeDistance < -50) {
        onStateChange('expanded');
        if (enableHaptics) vibrate(10);
      }
    } else if (state === 'expanded') {
      // Swipe down to minimize
      if (swipeVelocity > 0.5 || swipeDistance > 50) {
        onStateChange('minimized');
        if (enableHaptics) vibrate(10);
      }
    }

    setDragY(0);
  },
};
```

#### JSX Structure

```typescript
return (
  <motion.div
    className={cn(
      'fixed bottom-0 left-0 right-0 z-40',
      'bg-white shadow-2xl',
      'will-change-transform',
      className
    )}
    variants={drawerVariants}
    animate={state}
    drag={enableGestures ? 'y' : false}
    dragConstraints={{ top: 0, bottom: 0 }}
    dragElastic={0.1}
    {...(enableGestures && swipeConfig)}
    role="dialog"
    aria-label="AI Chat"
    aria-expanded={state === 'expanded'}
  >
    {/* Minimized Header (always visible) */}
    <button
      className="flex items-center justify-between w-full h-20 px-4 border-t-2 border-gray-200"
      onClick={() =>
        onStateChange(state === 'expanded' ? 'minimized' : 'expanded')
      }
      aria-label={state === 'expanded' ? 'Minimize chat' : 'Expand chat'}
    >
      {/* Icon, last message preview, expand/collapse indicator */}
    </button>

    {/* Full Chat Content (visible when expanded) */}
    {state === 'expanded' && (
      <div className="h-full overflow-hidden">
        {children}
      </div>
    )}
  </motion.div>
);
```

---

### 2. Responsive BuilderPage

**File:** `src/pages/BuilderPage.tsx` (modified)

#### Updated State

```typescript
// Existing state
const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
const [budget, setBudget] = useState<number>(1500);
const [showAIChat, setShowAIChat] = useState(false);
const [savedMessages, setSavedMessages] = useState<Message[]>([]);

// NEW: Responsive state
const viewport = useViewport();
const [drawerState, setDrawerState] = useState<DrawerState>('hidden');
const [chatCollapsed, setChatCollapsed] = useState(false); // Tablet only
const { panelSize, setPanelSize, resetPanelSize } = usePanelResize();
```

#### Layout Rendering Logic

```typescript
// Determine which layout to render
const renderLayout = () => {
  if (!showAIChat) {
    // No chat active - show traditional view
    return (
      <>
        <PersonaSelector />
        {selectedPersonaId && (
          <>
            <BudgetSlider />
            <BuildRecommendations />
          </>
        )}
      </>
    );
  }

  // Chat active - responsive layouts
  if (viewport.isDesktop) {
    return renderDesktopLayout();
  } else if (viewport.isTablet) {
    return renderTabletLayout();
  } else {
    return renderMobileLayout();
  }
};
```

#### Desktop Layout Implementation

```typescript
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const renderDesktopLayout = () => (
  <div className="h-screen flex flex-col">
    {/* Header with reset button */}
    <div className="flex items-center justify-between p-4 border-b">
      <h1>PC Builder</h1>
      <button
        onClick={() => {
          resetPanelSize();
          announceToScreenReader('Panel layout reset to default');
        }}
        className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
        aria-label="Reset panel layout to 40/60 split"
      >
        Reset Layout
      </button>
    </div>

    {/* Resizable Panels */}
    <PanelGroup direction="horizontal" className="flex-1">
      {/* Chat Panel (Left) */}
      <Panel
        defaultSize={panelSize}
        minSize={30}
        maxSize={70}
        onResize={(size) => setPanelSize(size)}
        className="relative"
        id="chat-panel"
      >
        <ChatInterface
          onClose={handleCloseAIChat}
          onQuickSelectPersona={handleQuickSelectPersona}
          onMessagesChange={handleMessagesChange}
          savedMessages={savedMessages}
          onPersonaSuggestionAccept={handlePersonaSuggestionAccept}
          initialContext={{ persona: selectedPersonaId || undefined, budget }}
        />
      </Panel>

      {/* Resize Handle (Divider) */}
      <PanelResizeHandle
        className="w-2 bg-gray-200 hover:bg-blue-500 cursor-col-resize transition-colors"
        data-testid="resize-divider"
      />

      {/* Build Preview Panel (Right) */}
      <Panel minSize={30} maxSize={70} id="build-panel">
        <div className="h-full overflow-y-auto p-4">
          {selectedPersonaId ? (
            <BuildRecommendations
              personaId={selectedPersonaId}
              budget={budget}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a persona in the chat to see build recommendations</p>
            </div>
          )}
        </div>
      </Panel>
    </PanelGroup>
  </div>
);
```

#### Tablet Layout Implementation

```typescript
const renderTabletLayout = () => (
  <div className="h-screen flex flex-col">
    {/* Chat Section (Top) */}
    <div
      className={cn(
        'border-b transition-all duration-300',
        chatCollapsed ? 'h-[60px]' : 'h-1/2'
      )}
      data-testid="chat-section"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
        <h2 className="font-semibold">AI Chat</h2>
        <button
          onClick={() => {
            setChatCollapsed(!chatCollapsed);
            announceToScreenReader(
              chatCollapsed ? 'Chat expanded' : 'Chat collapsed'
            );
          }}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
          aria-label={chatCollapsed ? 'Expand chat' : 'Collapse chat'}
          aria-expanded={!chatCollapsed}
        >
          {chatCollapsed ? '↓ Expand' : '↑ Collapse'}
        </button>
      </div>

      {!chatCollapsed && (
        <div className="h-[calc(100%-40px)] overflow-hidden">
          <ChatInterface
            onClose={handleCloseAIChat}
            onQuickSelectPersona={handleQuickSelectPersona}
            onMessagesChange={handleMessagesChange}
            savedMessages={savedMessages}
            onPersonaSuggestionAccept={handlePersonaSuggestionAccept}
            initialContext={{ persona: selectedPersonaId || undefined, budget }}
          />
        </div>
      )}
    </div>

    {/* Build Section (Bottom) */}
    <div
      className={cn(
        'overflow-y-auto transition-all duration-300',
        chatCollapsed ? 'h-[calc(100vh-60px)]' : 'h-1/2'
      )}
      data-testid="build-section"
    >
      {selectedPersonaId ? (
        <BuildRecommendations personaId={selectedPersonaId} budget={budget} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Select a persona in the chat to see build recommendations</p>
        </div>
      )}
    </div>
  </div>
);
```

#### Mobile Layout Implementation

```typescript
const renderMobileLayout = () => (
  <div className="h-screen relative">
    {/* Build View (Always rendered, may be hidden by drawer) */}
    <div className="h-full overflow-y-auto">
      {/* Header with "View Build" button */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b">
        <h1 className="text-lg font-semibold">PC Builder</h1>
        {selectedPersonaId && (
          <button
            onClick={() => setDrawerState('minimized')}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            aria-label="View build recommendations"
          >
            View Build
          </button>
        )}
      </div>

      {/* Build Recommendations */}
      {selectedPersonaId ? (
        <BuildRecommendations personaId={selectedPersonaId} budget={budget} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Start a chat to get build recommendations</p>
        </div>
      )}
    </div>

    {/* Chat Drawer (Overlays build view when expanded/minimized) */}
    <ChatDrawer
      state={drawerState}
      onStateChange={setDrawerState}
      lastMessage={savedMessages[savedMessages.length - 1]?.content}
      enableHaptics={true}
      enableGestures={true}
    >
      <ChatInterface
        onClose={() => setDrawerState('hidden')}
        onQuickSelectPersona={handleQuickSelectPersona}
        onMessagesChange={handleMessagesChange}
        savedMessages={savedMessages}
        onPersonaSuggestionAccept={handlePersonaSuggestionAccept}
        initialContext={{ persona: selectedPersonaId || undefined, budget }}
      />
    </ChatDrawer>
  </div>
);
```

---

## Custom Hooks

### 1. useViewport Hook

**File:** `src/hooks/useViewport.ts`

```typescript
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
```

#### Usage Example

```typescript
function MyComponent() {
  const { isMobile, isTablet, isDesktop, breakpoint } = useViewport();

  return (
    <div>
      <p>Current breakpoint: {breakpoint}</p>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
}
```

---

### 2. useHapticFeedback Hook

**File:** `src/hooks/useHapticFeedback.ts`

```typescript
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
```

#### Usage Example

```typescript
function DrawerButton() {
  const { vibrate, isSupported } = useHapticFeedback();

  const handleClick = () => {
    vibrate(10); // 10ms pulse
    // ... other click logic
  };

  return (
    <button onClick={handleClick}>
      Toggle Drawer
      {isSupported && <span className="text-xs">(haptic enabled)</span>}
    </button>
  );
}
```

---

### 3. usePanelResize Hook

**File:** `src/hooks/usePanelResize.ts`

```typescript
import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'builderPanelSize';
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
      const stored = localStorage.getItem(STORAGE_KEY);
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
      localStorage.setItem(STORAGE_KEY, panelSize.toString());
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
```

#### Usage Example

```typescript
function DesktopLayout() {
  const { panelSize, setPanelSize, resetPanelSize, isDefault } =
    usePanelResize();

  return (
    <div>
      <button onClick={resetPanelSize} disabled={isDefault}>
        Reset Layout
      </button>
      <PanelGroup direction="horizontal">
        <Panel
          defaultSize={panelSize}
          onResize={setPanelSize}
          minSize={30}
          maxSize={70}
        >
          Chat
        </Panel>
        <Panel>Build</Panel>
      </PanelGroup>
    </div>
  );
}
```

---

### 4. usePrefersReducedMotion Hook

**File:** `src/hooks/usePrefersReducedMotion.ts`

```typescript
import { useState, useEffect } from 'react';

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
```

---

## State Management Architecture

### Parent State (BuilderPage)

**Why Parent State:**
- BuilderPage already manages core state (persona, budget, chat visibility)
- Responsive state is tightly coupled with existing state
- Avoid unnecessary complexity of Context API
- Predictable prop drilling (2 levels max)

**State Structure:**

```typescript
interface BuilderPageState {
  // Existing state
  selectedPersonaId: string | null;
  budget: number;
  showAIChat: boolean;
  savedMessages: Message[];

  // NEW: Responsive state
  drawerState: DrawerState; // 'expanded' | 'minimized' | 'hidden'
  chatCollapsed: boolean; // Tablet only
  // panelSize managed by usePanelResize hook
}
```

### localStorage Persistence

**Keys:**

```typescript
export const STORAGE_KEYS = {
  PANEL_SIZE: 'builderPanelSize', // number (30-70)
  TUTORIAL_SEEN: 'hasSeenPanelTutorial', // boolean
  CHAT_MESSAGES: 'chatMessages', // Message[] (existing)
  CONVERSATION_STATE: 'conversationState', // ConversationState (existing)
  DYNAMIC_CHIPS: 'dynamicChips', // string[] (existing)
} as const;
```

**Sync Strategy:**

```typescript
// usePanelResize handles its own sync
// BuilderPage syncs chat messages (existing)
// No global localStorage manager needed (keep it simple)
```

### URL Parameters (Optional Enhancement)

**Purpose:** Deep linking, testing, sharing specific layouts

**Implementation:**

```typescript
import { useSearchParams } from 'react-router-dom';

function BuilderPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read layout param
  const layoutParam = searchParams.get('layout');

  // Override breakpoint for testing
  const forcedBreakpoint = layoutParam as 'mobile' | 'tablet' | 'desktop' | null;

  // Use forced breakpoint if present, otherwise use useViewport
  const viewport = useViewport();
  const effectiveBreakpoint = forcedBreakpoint || viewport.breakpoint;

  // ... render based on effectiveBreakpoint
}
```

**URLs:**
- `/build?layout=mobile` - Force mobile layout
- `/build?layout=tablet` - Force tablet layout
- `/build?layout=desktop` - Force desktop layout

---

## Animation Implementation

### Framer Motion Configuration

**Installation:**

```bash
pnpm add framer-motion@^11.0.0
```

**Global Animation Settings:**

```typescript
// src/utils/animations.ts
import { Transition } from 'framer-motion';

export const SPRING_CONFIG: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 1,
};

export const DRAWER_TRANSITIONS = {
  expanded: SPRING_CONFIG,
  minimized: SPRING_CONFIG,
  hidden: { duration: 0.3, ease: 'easeOut' },
};

export const FADE_IN: Transition = {
  duration: 0.2,
  ease: 'easeOut',
};
```

### GPU Acceleration

**CSS for Drawer:**

```css
/* src/components/ChatDrawer.module.css */
.drawer {
  /* Force GPU layer */
  will-change: transform;
  transform: translateZ(0);

  /* Use transform and opacity only (GPU-accelerated) */
  /* NEVER animate: width, height, top, left, margin, padding */
}

/* During animation */
.drawer[data-animating='true'] {
  will-change: transform;
}

/* After animation */
.drawer[data-animating='false'] {
  will-change: auto; /* Remove will-change to save resources */
}
```

### Reduced Motion Fallback

```typescript
// In ChatDrawer component
const prefersReducedMotion = usePrefersReducedMotion();

const drawerVariants = {
  expanded: {
    y: 0,
    transition: prefersReducedMotion
      ? { duration: 0 } // Instant
      : SPRING_CONFIG, // Spring animation
  },
  minimized: {
    y: 'calc(100vh - 80px)',
    transition: prefersReducedMotion
      ? { duration: 0 }
      : SPRING_CONFIG,
  },
};
```

### Performance Monitoring

```typescript
// src/utils/performanceMonitor.ts
export function measureAnimationFPS(
  animationName: string,
  duration: number
): Promise<number> {
  return new Promise((resolve) => {
    const frames: number[] = [];
    let lastTime = performance.now();

    function measureFrame() {
      const now = performance.now();
      const delta = now - lastTime;
      const fps = 1000 / delta;
      frames.push(fps);
      lastTime = now;

      if (now - lastTime < duration) {
        requestAnimationFrame(measureFrame);
      } else {
        const avgFPS = frames.reduce((a, b) => a + b, 0) / frames.length;
        console.log(`${animationName} avg FPS:`, avgFPS);
        resolve(avgFPS);
      }
    }

    requestAnimationFrame(measureFrame);
  });
}
```

---

## File Structure

### New Files to Create

```
src/
├── components/
│   └── ChatDrawer.tsx                    # NEW - Mobile drawer component
│
├── hooks/
│   ├── useViewport.ts                    # NEW - Breakpoint detection
│   ├── useHapticFeedback.ts              # NEW - Vibration wrapper
│   ├── usePanelResize.ts                 # NEW - Panel state management
│   └── usePrefersReducedMotion.ts        # NEW - Accessibility hook
│
├── utils/
│   ├── animations.ts                     # NEW - Animation constants
│   ├── performanceMonitor.ts             # NEW - FPS measurement
│   └── storageKeys.ts                    # NEW - localStorage constants
│
└── styles/
    └── responsive.css                    # NEW - Responsive utility classes

tests/
├── unit/
│   ├── hooks/
│   │   ├── useViewport.test.ts           # NEW
│   │   ├── useHapticFeedback.test.ts     # NEW
│   │   ├── usePanelResize.test.ts        # NEW
│   │   └── usePrefersReducedMotion.test.ts # NEW
│   │
│   └── components/
│       └── ChatDrawer.test.tsx           # NEW
│
├── integration/
│   └── responsive-layouts.test.tsx       # NEW
│
├── bdd/
│   └── steps/
│       └── responsive-layouts.steps.ts   # NEW
│
└── e2e/
    └── responsive-layouts.spec.ts        # NEW
```

### Existing Files to Modify

```
src/
├── pages/
│   └── BuilderPage.tsx                   # MODIFY - Add responsive rendering
│
└── components/
    └── ChatInterface.tsx                 # MODIFY - Accept layout mode prop (optional)
```

---

## Integration Strategy

### Phase 1: Create Hooks (No Breaking Changes)

1. Create `useViewport.ts` - Standalone, no dependencies
2. Create `useHapticFeedback.ts` - Standalone
3. Create `usePanelResize.ts` - Standalone
4. Create `usePrefersReducedMotion.ts` - Standalone

**Verification:** Unit tests pass, no impact on existing code

### Phase 2: Create ChatDrawer (Isolated Component)

1. Create `ChatDrawer.tsx` - Accepts children, no BuilderPage integration yet
2. Write unit tests for ChatDrawer
3. Create Storybook stories for visual testing

**Verification:** Component renders, animations work, no integration yet

### Phase 3: Modify BuilderPage (Additive Changes)

1. Add `useViewport()` hook to BuilderPage
2. Add responsive rendering functions (desktop/tablet/mobile)
3. Keep existing non-responsive view as fallback
4. Feature flag for gradual rollout (optional)

**Verification:** Existing tests pass, new layouts render correctly

### Phase 4: Dependencies

1. Install `react-resizable-panels`
2. Install `framer-motion` (already installed)
3. Update `package.json` and run `pnpm install`

**Verification:** `pnpm install` succeeds, types resolve

### Phase 5: Testing

1. Write unit tests (hooks, components)
2. Write integration tests (BuilderPage layouts)
3. Write E2E tests (all 4 scenarios)
4. Write BDD step definitions

**Verification:** All tests pass (new + existing)

---

## Performance Optimizations

### 1. React.memo for Heavy Components

```typescript
// src/components/BuildRecommendations.tsx (existing, modify)
import { memo } from 'react';

const BuildRecommendations = memo(
  ({ personaId, budget }: BuildRecommendationsProps) => {
    // Expensive rendering logic
  },
  (prevProps, nextProps) => {
    // Custom comparison
    return (
      prevProps.personaId === nextProps.personaId &&
      prevProps.budget === nextProps.budget
    );
  }
);

export default BuildRecommendations;
```

### 2. useCallback for Stable References

```typescript
// In BuilderPage
const handlePersonaSuggestionAccept = useCallback((personaId: string) => {
  setShowAIChat(false);
  setSelectedPersonaId(personaId);
}, []);

const handleMessagesChange = useCallback((messages: Message[]) => {
  setSavedMessages(messages);
}, []);
```

### 3. Debounced Resize Handler

```typescript
// Already implemented in useViewport with 150ms debounce
// Prevents excessive re-renders during window resize
```

### 4. Code Splitting (Optional)

```typescript
// Lazy load ChatDrawer on mobile only
const ChatDrawer = lazy(() => import('../components/ChatDrawer'));

// In BuilderPage
{
  viewport.isMobile && (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatDrawer />
    </Suspense>
  );
}
```

### 5. Bundle Analysis

```bash
# Add to package.json scripts
"analyze": "vite-bundle-visualizer"

# Run analysis
pnpm analyze
```

**Target:** Keep Group 4 bundle impact < 100KB (should be ~65KB)

---

## Accessibility Implementation

### ARIA Live Regions

```typescript
// src/utils/a11y.ts
export function announceToScreenReader(message: string) {
  const liveRegion =
    document.getElementById('a11y-announcer') ||
    createLiveRegion();

  liveRegion.textContent = message;

  // Clear after announcement
  setTimeout(() => {
    liveRegion.textContent = '';
  }, 1000);
}

function createLiveRegion(): HTMLElement {
  const div = document.createElement('div');
  div.id = 'a11y-announcer';
  div.setAttribute('aria-live', 'polite');
  div.setAttribute('aria-atomic', 'true');
  div.className = 'sr-only'; // Visually hidden
  document.body.appendChild(div);
  return div;
}
```

### Keyboard Shortcuts

```typescript
// In BuilderPage
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Cmd/Ctrl + D: Toggle drawer (mobile)
    if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
      e.preventDefault();
      if (viewport.isMobile) {
        setDrawerState((state) =>
          state === 'expanded' ? 'minimized' : 'expanded'
        );
      }
    }

    // Cmd/Ctrl + R: Reset panels (desktop)
    if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
      e.preventDefault();
      if (viewport.isDesktop) {
        resetPanelSize();
        announceToScreenReader('Panel layout reset to default');
      }
    }

    // Escape: Minimize drawer (mobile)
    if (e.key === 'Escape' && viewport.isMobile) {
      setDrawerState('minimized');
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [viewport, resetPanelSize]);
```

### Focus Management

```typescript
// In ChatDrawer
import { useRef, useEffect } from 'react';

function ChatDrawer({ state, ... }: ChatDrawerProps) {
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (state === 'expanded') {
      // Store last focused element
      lastFocusedElement.current = document.activeElement as HTMLElement;

      // Focus chat input
      const chatInput = document.querySelector('[aria-label="Message input"]');
      if (chatInput instanceof HTMLElement) {
        chatInput.focus();
      }
    } else if (state === 'minimized' || state === 'hidden') {
      // Restore focus to last element
      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
    }
  }, [state]);

  // ...
}
```

---

## TypeScript Interfaces

### Complete Type Definitions

```typescript
// src/types/responsive.ts

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export type DrawerState = 'expanded' | 'minimized' | 'hidden';

export interface ViewportState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: Breakpoint;
}

export interface PanelResizeState {
  panelSize: number;
  setPanelSize: (size: number) => void;
  resetPanelSize: () => void;
  isDefault: boolean;
}

export interface HapticFeedbackOptions {
  enabled?: boolean;
  fallback?: () => void;
}

export interface HapticFeedback {
  vibrate: (pattern: number | number[]) => void;
  stop: () => void;
  isSupported: boolean;
}

export interface ChatDrawerProps {
  state: DrawerState;
  onStateChange: (newState: DrawerState) => void;
  children: ReactNode;
  lastMessage?: string;
  enableHaptics?: boolean;
  enableGestures?: boolean;
  animationDuration?: number;
  className?: string;
}
```

---

## Testing Strategy

### Unit Tests

**Coverage Target:** 100% for new code

**Test Files:**
1. `tests/unit/hooks/useViewport.test.ts`
2. `tests/unit/hooks/useHapticFeedback.test.ts`
3. `tests/unit/hooks/usePanelResize.test.ts`
4. `tests/unit/hooks/usePrefersReducedMotion.test.ts`
5. `tests/unit/components/ChatDrawer.test.tsx`

**Example Test:**

```typescript
// tests/unit/hooks/useViewport.test.ts
import { renderHook, act } from '@testing-library/react';
import { useViewport } from '@/hooks/useViewport';

describe('useViewport', () => {
  it('should return mobile breakpoint for width < 768px', () => {
    // Mock window size
    global.innerWidth = 375;
    global.innerHeight = 667;

    const { result } = renderHook(() => useViewport());

    expect(result.current.breakpoint).toBe('mobile');
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('should update on window resize', async () => {
    const { result } = renderHook(() => useViewport());

    // Resize to tablet
    act(() => {
      global.innerWidth = 768;
      window.dispatchEvent(new Event('resize'));
    });

    // Wait for debounce (150ms)
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(result.current.breakpoint).toBe('tablet');
    expect(result.current.isTablet).toBe(true);
  });
});
```

### Integration Tests

**Test File:** `tests/integration/responsive-layouts.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import BuilderPage from '@/pages/BuilderPage';

describe('Responsive Layouts Integration', () => {
  it('should render desktop layout when viewport ≥1024px', () => {
    // Mock viewport
    global.innerWidth = 1280;

    render(<BuilderPage />);

    // Open chat
    const chatButton = screen.getByText('Talk to AI Builder');
    chatButton.click();

    // Verify side-by-side layout
    expect(screen.getByTestId('chat-panel')).toBeInTheDocument();
    expect(screen.getByTestId('build-panel')).toBeInTheDocument();
    expect(screen.getByTestId('resize-divider')).toBeInTheDocument();
  });

  // More tests for tablet and mobile...
});
```

### E2E Tests

**Test File:** `tests/e2e/responsive-layouts.spec.ts`

See "BDD Specification" document for complete E2E test examples.

---

## Deployment Considerations

### Feature Flags (Optional)

```typescript
// src/config/features.ts
export const FEATURES = {
  RESPONSIVE_LAYOUTS: import.meta.env.VITE_ENABLE_RESPONSIVE ?? true,
};

// In BuilderPage
import { FEATURES } from '@/config/features';

if (FEATURES.RESPONSIVE_LAYOUTS) {
  // New responsive rendering
  return renderLayout();
} else {
  // Legacy fixed layout
  return renderLegacyLayout();
}
```

### Environment Variables

```bash
# .env.production
VITE_ENABLE_RESPONSIVE=true
```

### Gradual Rollout

1. **Week 1:** Deploy with feature flag disabled (no impact)
2. **Week 2:** Enable for 10% of users (A/B test)
3. **Week 3:** Enable for 50% of users (monitor metrics)
4. **Week 4:** Enable for 100% of users (full rollout)

---

## Risks and Mitigations

### Risk 1: Bundle Size Exceeds 100KB

**Impact:** Slower initial load on mobile

**Mitigation:**
- Code splitting (lazy load ChatDrawer)
- Tree shaking unused Framer Motion features
- Bundle analysis before deployment
- Monitor with Lighthouse CI

### Risk 2: Performance Issues on Low-End Devices

**Impact:** Laggy animations, poor UX

**Mitigation:**
- Reduced motion fallback (instant transitions)
- GPU acceleration (transform/opacity only)
- Performance testing on target devices (2019 Android)
- Disable gestures on slow devices

### Risk 3: localStorage Quota Exceeded

**Impact:** Panel size not persisting

**Mitigation:**
- Graceful fallback to default (40%)
- Error handling with try/catch
- Console warning only (no user-facing error)

### Risk 4: Breakpoint Detection Edge Cases

**Impact:** Wrong layout on unusual viewports

**Mitigation:**
- Comprehensive E2E tests (100+ viewport combinations)
- URL parameter override for testing
- User feedback mechanism

---

## Success Criteria

**Technical:**
- [ ] All 4 hooks implemented and tested (100% coverage)
- [ ] ChatDrawer component complete with animations
- [ ] BuilderPage responsive rendering working
- [ ] react-resizable-panels integrated for desktop
- [ ] Framer Motion integrated for mobile
- [ ] All TypeScript strict mode passing
- [ ] ESLint + Prettier passing

**Functional:**
- [ ] Desktop: Side-by-side 40/60 with resize
- [ ] Desktop: Reset button functional
- [ ] Desktop: localStorage persistence working
- [ ] Tablet: 50/50 vertical stack
- [ ] Tablet: Collapse/expand working
- [ ] Mobile: Full-screen chat
- [ ] Mobile: Drawer transitions smooth (60fps)
- [ ] Mobile: Haptic feedback working

**Testing:**
- [ ] Unit tests: 100% coverage (new code)
- [ ] Integration tests: All layouts tested
- [ ] E2E tests: All 4 scenarios passing
- [ ] BDD tests: All acceptance criteria passing
- [ ] Performance tests: 60fps verified

**Quality:**
- [ ] Bundle size < 100KB additional
- [ ] No regressions (17 existing scenarios pass)
- [ ] Accessibility: WCAG AAA compliant
- [ ] Code review approved

---

## Next Steps

**Phase 4: Implementation**

1. Create hooks (useViewport, useHapticFeedback, usePanelResize, usePrefersReducedMotion)
2. Create ChatDrawer component
3. Install dependencies (react-resizable-panels)
4. Modify BuilderPage for responsive rendering
5. Write unit tests (TDD RED-GREEN-REFACTOR)
6. Write integration tests
7. Write E2E tests
8. Write BDD step definitions
9. All tests passing

**Estimated Time:** 40-60 minutes (TDD workflow)

---

## Approval

**Technical Design Status:** ✅ Complete - Awaiting User Approval

**Approver:** [Awaiting approval to proceed to Phase 4: Implementation]

**Approval Date:** [Pending]

---

**Document Version:** 1.0
**Last Updated:** 2025-10-26
**Author:** Feature Development Workflow (TDD)
