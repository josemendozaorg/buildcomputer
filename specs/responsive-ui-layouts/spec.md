# BDD Specification: Group 4 - Responsive UI Layouts

## Overview

**Feature:** Responsive UI Layouts for AI Conversational Builder
**Group:** 4 of 6 (Scenarios 18-21)
**Status:** Phase 2 - Specification
**Created:** 2025-10-26

### Purpose

This specification formalizes the 4 BDD scenarios for responsive UI layouts with detailed acceptance criteria, test data, edge cases, and test strategy.

**Scenarios:**
1. **Scenario 18:** Desktop side-by-side layout (≥1024px)
2. **Scenario 19:** Mobile full-screen chat (<768px)
3. **Scenario 20:** Mobile transition to build view (drawer)
4. **Scenario 21:** Tablet responsive layout (768px-1023px)

---

## Scenario 18: Desktop Side-by-Side Layout

### BDD Scenario

```gherkin
@acceptance @ui @responsive @desktop
Scenario: Desktop side-by-side layout
  Given user is on desktop viewport (≥1024px width)
  When user starts AI conversation
  Then chat panel should occupy left 40% of screen
  And build preview should occupy right 60%
  And both panels should be visible simultaneously
  And build preview should update in real-time as conversation progresses
```

### Detailed Acceptance Criteria

#### AC 18.1: Chat Panel Dimensions
- **Given:** Desktop viewport ≥1024px width
- **When:** User opens AI chat
- **Then:**
  - Chat panel width = 40% of viewport (±5px tolerance)
  - Chat panel height = 100vh (full viewport height)
  - Chat panel position = left side of screen
  - Chat panel has vertical scrolling if content overflows

**Measurement:** `chatPanelElement.offsetWidth / window.innerWidth ≈ 0.40`

#### AC 18.2: Build Preview Dimensions
- **Given:** Desktop viewport ≥1024px width
- **When:** User opens AI chat
- **Then:**
  - Build preview width = 60% of viewport (±5px tolerance)
  - Build preview height = 100vh (full viewport height)
  - Build preview position = right side of screen
  - Build preview has vertical scrolling if content overflows

**Measurement:** `buildPreviewElement.offsetWidth / window.innerWidth ≈ 0.60`

#### AC 18.3: Simultaneous Visibility
- **Given:** Desktop viewport ≥1024px width
- **When:** User opens AI chat
- **Then:**
  - Both panels visible at the same time (no overlay/modal)
  - Both panels independently scrollable
  - No z-index stacking (side-by-side in document flow)
  - Both panels accessible via keyboard navigation

**Verification:** Both elements have `visibility: visible` and `display: block/flex/grid`

#### AC 18.4: Resizable Panels
- **Given:** Desktop viewport ≥1024px width
- **When:** User drags the resize divider
- **Then:**
  - Divider appears between panels (visual affordance)
  - Cursor changes to `col-resize` on hover
  - Chat panel width range: 30% - 70%
  - Build preview width range: 30% - 70%
  - Panels resize smoothly in real-time (60fps)
  - Resize preference saved to localStorage

**Test Data:**
- Initial: 40% / 60%
- After drag to 50%: 50% / 50%
- After drag to minimum: 30% / 70%
- After drag to maximum: 70% / 30%

#### AC 18.5: Reset Button
- **Given:** User has resized panels
- **When:** User clicks "Reset" button
- **Then:**
  - Panels return to 40% / 60% default
  - Animation duration ≤ 300ms
  - localStorage updated to default

#### AC 18.6: Real-Time Build Updates
- **Given:** Desktop viewport with chat and build visible
- **When:** AI suggests persona "competitive-gamer" in chat
- **And:** User accepts persona suggestion
- **Then:**
  - Build preview updates immediately (within 500ms)
  - Build cards display for "competitive-gamer" persona
  - No page reload required
  - No layout shift (CLS = 0)

**Test Flow:**
1. Open AI chat (desktop)
2. Type "I play Valorant competitively"
3. AI suggests "Competitive Gamer" persona
4. Click "Yes, show me builds"
5. Verify build preview shows competitive-gamer builds
6. Verify chat remains visible (40% panel)

#### AC 18.7: Persistence Across Navigation
- **Given:** User resizes panels to 55% / 45%
- **When:** User navigates away and returns
- **Then:**
  - Panels restore to 55% / 45%
  - localStorage `builderPanelSize` = 55

### Test Data

**Viewport Sizes:**
- Minimum desktop: 1024x768
- Standard desktop: 1440x900
- Large desktop: 1920x1080
- Ultra-wide: 2560x1440

**Panel Resize Values:**
- Default: 40% / 60%
- Minimum: 30% / 70%
- Maximum: 70% / 30%
- Mid-point: 50% / 50%
- Custom: 45% / 55%, 65% / 35%

**localStorage Keys:**
- `builderPanelSize`: number (30-70)

### Edge Cases

#### Edge 18.1: Viewport at Exact Breakpoint (1024px)
- **Scenario:** Window width = exactly 1024px
- **Expected:** Desktop layout active (inclusive boundary)
- **Verification:** `lg:` Tailwind class applied

#### Edge 18.2: Ultra-Wide Displays (>1920px)
- **Scenario:** Window width = 2560px
- **Expected:** Panels use max-width container, centered
- **Verification:** Container max-width = 1536px (2xl)

#### Edge 18.3: localStorage Full/Disabled
- **Scenario:** localStorage quota exceeded or disabled
- **Expected:** Default to 40/60, no error thrown
- **Verification:** Graceful fallback, console warning only

#### Edge 18.4: Rapid Resize
- **Scenario:** User drags resize divider rapidly (<100ms between movements)
- **Expected:** Debounced updates, no jank, 60fps maintained
- **Verification:** Performance profiling shows 60fps

#### Edge 18.5: Keyboard-Only Resize
- **Scenario:** User navigates to resize handle with Tab, resizes with arrow keys
- **Expected:** Arrow keys resize panels (5% increments)
- **Verification:** Keyboard event handlers functional

### User Flow

```
Desktop User Journey
│
├─ 1. Navigate to /build on desktop (1440x900)
│   └─ Persona selector visible (full width)
│
├─ 2. Click "Talk to AI Builder"
│   ├─ Layout switches to side-by-side
│   ├─ Chat panel appears (left 40%)
│   ├─ Build preview visible (right 60%)
│   └─ Resize divider visible between panels
│
├─ 3. Have conversation in chat
│   ├─ Type "gaming PC"
│   ├─ AI responds in left panel
│   ├─ Build preview remains visible (right panel)
│   └─ Typing indicator shows in chat
│
├─ 4. AI suggests "Competitive Gamer" persona
│   ├─ Accept suggestion
│   ├─ Build preview updates immediately
│   ├─ Shows competitive-gamer builds (right panel)
│   └─ Chat still visible (left panel)
│
├─ 5. Resize panels
│   ├─ Hover over divider (cursor: col-resize)
│   ├─ Drag to 50/50 split
│   ├─ Panels resize smoothly (60fps)
│   └─ Preference saved to localStorage
│
└─ 6. Navigate away and return
    ├─ Return to /build
    ├─ Click "Return to Conversation"
    ├─ Panels restore to 50/50 (saved preference)
    └─ Conversation history preserved
```

---

## Scenario 19: Mobile Full-Screen Chat

### BDD Scenario

```gherkin
@acceptance @ui @responsive @mobile
Scenario: Mobile full-screen chat
  Given user is on mobile viewport (<768px width)
  When user starts AI conversation
  Then chat should fill entire screen
  And build preview should be hidden
  And navigation should show "View Build" button
  And chat input should be fixed at bottom
```

### Detailed Acceptance Criteria

#### AC 19.1: Full-Screen Chat
- **Given:** Mobile viewport <768px width
- **When:** User opens AI chat
- **Then:**
  - Chat interface fills 100vw x 100vh
  - No side margins or padding
  - Header at top, messages in middle, input at bottom
  - Background color = white (covers everything)

**Measurement:** `chatElement.offsetWidth === window.innerWidth && chatElement.offsetHeight === window.innerHeight`

#### AC 19.2: Build Preview Hidden
- **Given:** Mobile viewport <768px width
- **When:** User opens AI chat
- **Then:**
  - Build preview element not visible (`display: none` or removed from DOM)
  - Persona selector not visible
  - Budget slider not visible
  - Only chat interface visible

**Verification:** `buildPreviewElement.offsetParent === null` (not rendered)

#### AC 19.3: "View Build" Button
- **Given:** Mobile viewport <768px width
- **And:** User has selected persona or received build recommendations
- **When:** User is in chat
- **Then:**
  - "View Build" button visible in header or navigation
  - Button has clear label and icon
  - Minimum touch target = 44x44px (WCAG AA)
  - Button accessibility: `role="button"`, `aria-label="View build recommendations"`

**Test Data:**
- Button text: "View Build" or "See Builds"
- Icon: List or grid icon
- Position: Top-right header or bottom navigation

#### AC 19.4: Fixed Bottom Input
- **Given:** Mobile viewport <768px width
- **When:** User scrolls chat messages
- **Then:**
  - Input area remains fixed at bottom
  - Input doesn't scroll with messages
  - Input always visible above keyboard (when focused)
  - Input z-index > messages

**CSS Verification:** `position: fixed; bottom: 0;` or `position: sticky; bottom: 0;`

#### AC 19.5: Keyboard Handling
- **Given:** Mobile device with virtual keyboard
- **When:** User focuses input field
- **Then:**
  - Keyboard appears
  - Input area moves above keyboard (viewport resize or scroll)
  - Messages remain scrollable above input
  - No content hidden behind keyboard

**iOS-specific:** `viewport-fit=cover`, safe-area-inset-bottom

#### AC 19.6: Safe Area Handling
- **Given:** iPhone with notch or home indicator
- **When:** Chat is full-screen
- **Then:**
  - Input respects safe-area-inset-bottom
  - Header respects safe-area-inset-top
  - Content not obscured by notch or home indicator

**CSS:** `padding-bottom: env(safe-area-inset-bottom);`

### Test Data

**Viewport Sizes:**
- Small mobile: 320x568 (iPhone SE)
- Standard mobile: 375x667 (iPhone 8)
- Large mobile: 414x896 (iPhone 11)
- Android: 360x640 (common)

**Safe Area Insets:**
- Top: 44px (status bar + notch)
- Bottom: 34px (home indicator)

### Edge Cases

#### Edge 19.1: Viewport at Exact Breakpoint (768px)
- **Scenario:** Window width = exactly 768px
- **Expected:** Tablet layout (not mobile)
- **Verification:** Tablet 50/50 split active

#### Edge 19.2: Landscape Orientation
- **Scenario:** User rotates phone to landscape (667x375)
- **Expected:** May trigger tablet layout (width ≥768px on some devices)
- **Verification:** useViewport re-evaluates breakpoint

#### Edge 19.3: Keyboard Obscuring Input
- **Scenario:** Virtual keyboard appears, viewport height changes
- **Expected:** Input scrolls into view, remains above keyboard
- **Verification:** `window.visualViewport.height` handling

#### Edge 19.4: "View Build" Without Persona
- **Scenario:** User clicks "View Build" before selecting persona
- **Expected:** Navigate to persona selector, not empty build view
- **Verification:** Conditional routing logic

### User Flow

```
Mobile User Journey
│
├─ 1. Navigate to /build on mobile (375x667)
│   └─ Persona selector visible (vertical scroll)
│
├─ 2. Tap "Talk to AI Builder"
│   ├─ Chat fills entire screen (100vw x 100vh)
│   ├─ Build preview hidden
│   ├─ "View Build" button appears in header
│   └─ Input field fixed at bottom
│
├─ 3. Have conversation
│   ├─ Tap input field
│   ├─ Keyboard appears
│   ├─ Input remains visible above keyboard
│   ├─ Messages scroll in viewport
│   └─ Type "gaming PC"
│
├─ 4. Scroll through conversation
│   ├─ Swipe up to see previous messages
│   ├─ Input remains fixed at bottom
│   ├─ Messages scroll smoothly (60fps)
│   └─ "View Build" button remains in header
│
├─ 5. AI suggests persona
│   ├─ Tap "Yes, show me builds"
│   ├─ Chat updates selectedPersona state
│   ├─ "View Build" button now active
│   └─ Remains in chat view
│
└─ 6. Tap "View Build"
    ├─ Transition to build view (Scenario 20)
    └─ Drawer appears at bottom
```

---

## Scenario 20: Mobile Transition to Build View

### BDD Scenario

```gherkin
@acceptance @ui @responsive @mobile @transitions
Scenario: Mobile transition to build view
  Given user completes AI conversation on mobile
  When AI shows build recommendations
  Then screen should smoothly transition to build view
  And chat should minimize to bottom drawer
  And user can tap drawer to expand chat again
  And transition should be 60fps smooth
```

### Detailed Acceptance Criteria

#### AC 20.1: Smooth Transition Initiation
- **Given:** User completes conversation or taps "View Build"
- **When:** Transition to build view begins
- **Then:**
  - Framer Motion animation starts (300ms duration)
  - Chat panel animates from full-screen to 80px drawer
  - Build preview fades in simultaneously
  - Spring physics applied (natural, bouncy feel)
  - `transform: translateY()` used (GPU-accelerated)

**Animation Timeline:**
```
0ms:   Chat at 100vh, Build invisible
150ms: Chat at 50vh, Build 50% opacity
300ms: Chat at 80px (drawer), Build 100% opacity
```

#### AC 20.2: Drawer Minimized State
- **Given:** Transition complete
- **When:** Drawer is minimized
- **Then:**
  - Drawer height = 80px
  - Drawer shows: AI icon + "Tap to expand chat" hint + last message preview
  - Drawer positioned at bottom of screen
  - Drawer above build preview (z-index higher)
  - Drawer has visible tap affordance (shadow, border)

**Measurements:**
- Height: 80px (±2px)
- Position: `bottom: 0; position: fixed;`
- z-index: 40 (above content, below modals)

#### AC 20.3: Drawer Expansion
- **Given:** Drawer minimized (80px)
- **When:** User taps drawer header
- **Then:**
  - Drawer animates to full-screen (100vh)
  - Animation duration = 300ms
  - Spring physics (bouncy, natural)
  - Build preview fades out
  - Focus moves to chat input

**Interaction Methods:**
- Tap/click drawer header
- Swipe up gesture (touch)
- Keyboard: Cmd+D or Escape

#### AC 20.4: Drawer Collapse
- **Given:** Drawer expanded (100vh)
- **When:** User taps "View Build" or swipes down
- **Then:**
  - Drawer animates to 80px
  - Animation duration = 300ms
  - Spring physics
  - Build preview fades in
  - Focus returns to last build card

#### AC 20.5: 60fps Performance
- **Given:** Any drawer transition (expand/collapse)
- **When:** Animation is running
- **Then:**
  - Frame rate ≥ 60fps (16.67ms per frame)
  - No dropped frames (jank)
  - CPU usage reasonable (<30%)
  - GPU-accelerated (Layer created for drawer)

**Verification:** Chrome DevTools Performance tab, FPS meter

#### AC 20.6: Touch Gestures
- **Given:** User touches drawer
- **When:** User performs swipe gesture
- **Then:**
  - Swipe up: Expand drawer (if minimized)
  - Swipe down: Collapse drawer (if expanded)
  - Gesture follows finger (real-time tracking)
  - Rubber banding at edges
  - Release triggers animation to nearest state

**Gesture Thresholds:**
- Swipe velocity > 0.5px/ms = intentional swipe
- Swipe distance > 50px = expand/collapse
- Else = snap back to current state

#### AC 20.7: Haptic Feedback
- **Given:** Mobile device supports vibration
- **When:** Drawer opens or closes
- **Then:**
  - Vibrate 10ms pulse
  - Feature detection: `if ('vibrate' in navigator)`
  - No error if unsupported

### Test Data

**Animation Timings:**
- Duration: 300ms
- Spring stiffness: 300
- Spring damping: 30
- Spring mass: 1

**Drawer States:**
- Expanded: 100vh (full-screen)
- Minimized: 80px
- Hidden: 0px (not used in this scenario)

**Touch Events:**
- touchstart: Record initial Y position
- touchmove: Track delta Y
- touchend: Calculate velocity, trigger transition

### Edge Cases

#### Edge 20.1: Rapid Tap/Swipe
- **Scenario:** User taps drawer multiple times rapidly (<300ms between)
- **Expected:** Animation completes before reversing, no jank
- **Verification:** Animation state machine prevents overlapping animations

#### Edge 20.2: Interrupted Animation
- **Scenario:** User swipes down while expansion animation in progress
- **Expected:** Animation reverses smoothly from current position
- **Verification:** Framer Motion `whileTap` and `drag` props handle interruption

#### Edge 20.3: Orientation Change During Animation
- **Scenario:** User rotates device while drawer animating
- **Expected:** Animation continues, drawer re-calculates heights
- **Verification:** useViewport re-triggers layout, animation adapts

#### Edge 20.4: Low-End Device Performance
- **Scenario:** Old Android device (2019 or older)
- **Expected:** Animation may drop frames, but completes correctly
- **Mitigation:** Reduced motion fallback (instant transition)

#### Edge 20.5: Reduced Motion Preference
- **Scenario:** User has `prefers-reduced-motion: reduce` enabled
- **Expected:** Instant transition (no spring animation)
- **Verification:** CSS media query or JS `window.matchMedia`

### User Flow

```
Mobile Drawer Transition
│
├─ 1. Chat is full-screen (Scenario 19)
│   └─ User typing in AI chat
│
├─ 2. Trigger transition
│   ├─ Option A: AI suggests persona → User accepts
│   ├─ Option B: User taps "View Build" button
│   └─ Transition begins (300ms animation)
│
├─ 3. Animation phase (0-300ms)
│   ├─ Chat panel slides down (translateY)
│   ├─ Build preview fades in (opacity)
│   ├─ Spring physics applied (natural bounce)
│   ├─ 60fps maintained
│   └─ Haptic feedback pulse (10ms)
│
├─ 4. Drawer minimized (post-transition)
│   ├─ Drawer height = 80px at bottom
│   ├─ Build preview visible (full screen minus drawer)
│   ├─ Drawer shows: icon + hint + last message
│   └─ User can scroll build cards
│
├─ 5. User taps drawer to expand
│   ├─ Drawer animates to full-screen (300ms)
│   ├─ Build preview fades out
│   ├─ Spring physics (bouncy)
│   ├─ Focus moves to chat input
│   └─ Haptic feedback pulse
│
├─ 6. User swipes down on drawer
│   ├─ Drawer follows finger in real-time
│   ├─ Release at >50px down → collapse
│   ├─ Animation completes to 80px
│   ├─ Build preview fades back in
│   └─ Haptic feedback pulse
│
└─ 7. User continues
    ├─ Can expand/collapse drawer repeatedly
    ├─ Can switch between chat and build view
    └─ State preserved across transitions
```

---

## Scenario 21: Tablet Responsive Layout

### BDD Scenario

```gherkin
@acceptance @ui @responsive @tablet
Scenario: Tablet responsive layout
  Given user is on tablet viewport (768px-1023px width)
  When user starts AI conversation
  Then layout should stack vertically: chat on top, build preview below
  And both sections should be scrollable
  And user can collapse chat to see more of build preview
```

### Detailed Acceptance Criteria

#### AC 21.1: Vertical Stack Layout
- **Given:** Tablet viewport 768px-1023px width
- **When:** User opens AI chat
- **Then:**
  - Layout uses CSS Grid or Flexbox column
  - Chat section at top (50% height)
  - Build preview at bottom (50% height)
  - No horizontal split (not side-by-side)
  - Both sections visible simultaneously

**CSS Verification:** `grid-template-rows: 50% 50%` or `flex-direction: column`

#### AC 21.2: 50/50 Height Split
- **Given:** Tablet viewport with vertical stack
- **When:** Layout is rendered
- **Then:**
  - Chat height ≈ 50vh (±10px tolerance)
  - Build preview height ≈ 50vh (±10px tolerance)
  - Total height = 100vh
  - No gap between sections (or minimal <5px)

**Measurement:** `chatHeight / window.innerHeight ≈ 0.50`

#### AC 21.3: Independent Scrolling
- **Given:** Vertical stack layout
- **When:** Content overflows in either section
- **Then:**
  - Chat section has vertical scroll (overflow-y: auto)
  - Build preview section has vertical scroll (overflow-y: auto)
  - Scrolling one section doesn't affect the other
  - Both sections independently scrollable with touch

**Test:** Add 20 messages to chat, 10 build cards to preview → both scroll

#### AC 21.4: Collapsible Chat
- **Given:** Vertical stack layout
- **When:** User clicks "Collapse Chat" button
- **Then:**
  - Chat section collapses to header only (~60px)
  - Build preview expands to use freed space (~94vh)
  - Animation smooth (300ms ease-out)
  - "Expand Chat" button visible in collapsed header

**States:**
- Expanded: Chat 50vh, Build 50vh
- Collapsed: Chat 60px, Build ~94vh

#### AC 21.5: Expand Chat
- **Given:** Chat is collapsed (60px)
- **When:** User clicks "Expand Chat" button
- **Then:**
  - Chat section expands to 50vh
  - Build preview shrinks to 50vh
  - Animation smooth (300ms ease-out)
  - Last chat scroll position restored

#### AC 21.6: Touch Scrolling
- **Given:** Tablet with touch screen
- **When:** User swipes in either section
- **Then:**
  - Section scrolls smoothly (momentum scrolling)
  - `-webkit-overflow-scrolling: touch` applied
  - No accidental horizontal scrolling
  - Overscroll behavior: contain (no whole-page bounce)

### Test Data

**Viewport Sizes:**
- Minimum tablet: 768x1024 (iPad portrait)
- Standard tablet: 834x1112 (iPad Air portrait)
- Large tablet: 1024x1366 (iPad Pro portrait)
- Landscape: 1024x768 (iPad landscape)

**Section Heights:**
- Expanded chat: 50vh (384px on 768px tall viewport)
- Expanded build: 50vh (384px on 768px tall viewport)
- Collapsed chat: 60px
- Collapsed build: Remaining space (~940px on 768px tall viewport)

**Collapse Button:**
- Label: "Collapse Chat" / "Expand Chat"
- Position: Chat header right side
- Size: 44x44px minimum (touch target)

### Edge Cases

#### Edge 21.1: Viewport at Exact Breakpoint (768px)
- **Scenario:** Window width = exactly 768px
- **Expected:** Tablet layout active (inclusive lower bound)
- **Verification:** md: Tailwind class applied

#### Edge 21.2: Viewport at Exact Breakpoint (1023px)
- **Scenario:** Window width = exactly 1023px
- **Expected:** Tablet layout active (exclusive upper bound)
- **Verification:** Not lg: class, still md:

#### Edge 21.3: Landscape Orientation (1024x768)
- **Scenario:** Tablet rotated to landscape, width ≥1024px
- **Expected:** Desktop layout (side-by-side)
- **Verification:** useViewport detects desktop breakpoint

#### Edge 21.4: Very Tall Tablet (768x1366)
- **Scenario:** iPad Pro portrait
- **Expected:** 50/50 split still applied (683px each)
- **Verification:** No max-height constraints

#### Edge 21.5: Collapse While Scrolled
- **Scenario:** Chat scrolled to bottom, user collapses
- **Expected:** Scroll position saved, restored on expand
- **Verification:** `useEffect` saves scrollTop to state

#### Edge 21.6: Split-Screen on Tablet
- **Scenario:** iPad split-screen, viewport width <768px
- **Expected:** Mobile layout (drawer) instead of tablet
- **Verification:** useViewport re-evaluates correctly

### User Flow

```
Tablet User Journey
│
├─ 1. Navigate to /build on tablet (768x1024)
│   └─ Persona selector visible (full width)
│
├─ 2. Tap "Talk to AI Builder"
│   ├─ Layout switches to vertical stack
│   ├─ Chat at top (50vh ≈ 512px)
│   ├─ Build preview at bottom (50vh ≈ 512px)
│   └─ Divider line between sections
│
├─ 3. Have conversation in chat (top section)
│   ├─ Type messages in chat input
│   ├─ Chat messages scroll in top section
│   ├─ Build preview visible below
│   └─ Can see both simultaneously
│
├─ 4. Scroll build preview (bottom section)
│   ├─ Swipe up in build preview area
│   ├─ Build cards scroll independently
│   ├─ Chat section remains fixed (not scrolling)
│   └─ Both sections have independent scroll position
│
├─ 5. Collapse chat to see more builds
│   ├─ Tap "Collapse Chat" button in chat header
│   ├─ Chat section animates to 60px (300ms)
│   ├─ Build preview expands to ~940px
│   ├─ Can now see 3-4 build cards without scrolling
│   └─ "Expand Chat" button visible in collapsed header
│
├─ 6. Expand chat again
│   ├─ Tap "Expand Chat" button
│   ├─ Chat animates back to 50vh (300ms)
│   ├─ Build preview shrinks to 50vh
│   ├─ Chat scroll position restored
│   └─ Back to balanced 50/50 view
│
└─ 7. Rotate to landscape (1024x768)
    ├─ Viewport width now ≥1024px
    ├─ Layout switches to desktop side-by-side
    ├─ Chat left (40%), Build right (60%)
    └─ Scenario 18 now active
```

---

## Test Strategy

### Unit Tests (Vitest + @testing-library/react)

**Components:**
- `ChatDrawer.tsx`
  - Renders in expanded state
  - Renders in minimized state (80px)
  - Handles tap events
  - Triggers expand/collapse callbacks
  - Displays last message preview

**Hooks:**
- `useViewport.ts`
  - Returns correct breakpoint for window sizes
  - Updates on window resize
  - Debounces resize events (150ms)
  - Handles orientation change
  - Returns isMobile, isTablet, isDesktop booleans

- `useHapticFeedback.ts`
  - Detects vibration support
  - Calls navigator.vibrate() when supported
  - No-op when unsupported
  - Configurable vibration patterns

- `usePanelResize.ts`
  - Manages panel size state (30-70%)
  - Saves to localStorage on change
  - Loads from localStorage on mount
  - Reset function returns to 40%

**Coverage Target:** 100% for new code

### Integration Tests (Vitest + @testing-library/react)

**BuilderPage.tsx Responsive Rendering:**
- Desktop viewport (1440x900): Renders side-by-side layout
- Tablet viewport (768x1024): Renders vertical stack
- Mobile viewport (375x667): Renders full-screen chat

**State Synchronization:**
- Desktop: Panel resize updates localStorage
- Mobile: Drawer state managed in parent
- All: Build preview updates when persona changes

**Coverage Target:** All responsive branches tested

### E2E Tests (Playwright)

**Scenario 18: Desktop (1280x720 viewport)**
```typescript
test('Desktop side-by-side layout', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/build');

  // Open AI chat
  await page.click('button:has-text("Talk to AI Builder")');

  // Verify side-by-side layout
  const chat = page.locator('[data-testid="chat-panel"]');
  const build = page.locator('[data-testid="build-preview"]');

  expect(await chat.isVisible()).toBe(true);
  expect(await build.isVisible()).toBe(true);

  // Verify dimensions (40% / 60% ±10px)
  const chatWidth = await chat.boundingBox().then(b => b?.width || 0);
  const buildWidth = await build.boundingBox().then(b => b?.width || 0);

  expect(chatWidth).toBeCloseTo(1280 * 0.40, -1); // ±10px
  expect(buildWidth).toBeCloseTo(1280 * 0.60, -1);

  // Test resize
  const divider = page.locator('[data-testid="resize-divider"]');
  await divider.dragTo(page.locator('body'), {
    targetPosition: { x: 640, y: 360 } // 50% position
  });

  // Verify 50/50 split
  const newChatWidth = await chat.boundingBox().then(b => b?.width || 0);
  expect(newChatWidth).toBeCloseTo(1280 * 0.50, -1);
});
```

**Scenario 19: Mobile (375x667 viewport)**
```typescript
test('Mobile full-screen chat', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/build');

  await page.click('button:has-text("Talk to AI Builder")');

  // Verify full-screen
  const chat = page.locator('[data-testid="chat-interface"]');
  const chatBox = await chat.boundingBox();

  expect(chatBox?.width).toBeCloseTo(375, 0);
  expect(chatBox?.height).toBeCloseTo(667, 0);

  // Verify build preview hidden
  const build = page.locator('[data-testid="build-preview"]');
  expect(await build.isVisible()).toBe(false);

  // Verify "View Build" button
  const viewBuildBtn = page.locator('button:has-text("View Build")');
  expect(await viewBuildBtn.isVisible()).toBe(true);
});
```

**Scenario 20: Mobile Drawer (375x667 viewport)**
```typescript
test('Mobile transition to build view with drawer', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/build');

  await page.click('button:has-text("Talk to AI Builder")');

  // Complete conversation
  await page.fill('input[placeholder="Type your message..."]', 'gaming');
  await page.click('button:has-text("Send")');
  await page.waitForSelector('text=Competitive Gamer');
  await page.click('button:has-text("Yes, show me builds")');

  // Transition should occur
  await page.waitForTimeout(400); // 300ms animation + buffer

  // Verify drawer minimized
  const drawer = page.locator('[data-testid="chat-drawer"]');
  const drawerBox = await drawer.boundingBox();

  expect(drawerBox?.height).toBeCloseTo(80, 2); // ±2px
  expect(drawerBox?.y).toBeGreaterThan(500); // Near bottom

  // Verify build preview visible
  const build = page.locator('[data-testid="build-preview"]');
  expect(await build.isVisible()).toBe(true);

  // Test drawer expand
  await drawer.click();
  await page.waitForTimeout(400);

  const expandedBox = await drawer.boundingBox();
  expect(expandedBox?.height).toBeCloseTo(667, 5);
});
```

**Scenario 21: Tablet (768x1024 viewport)**
```typescript
test('Tablet vertical stack layout', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/build');

  await page.click('button:has-text("Talk to AI Builder")');

  // Verify vertical stack
  const chat = page.locator('[data-testid="chat-section"]');
  const build = page.locator('[data-testid="build-section"]');

  const chatBox = await chat.boundingBox();
  const buildBox = await build.boundingBox();

  // Verify 50/50 height split
  expect(chatBox?.height).toBeCloseTo(1024 * 0.50, 10);
  expect(buildBox?.height).toBeCloseTo(1024 * 0.50, 10);

  // Verify vertical stacking (build below chat)
  expect(buildBox?.y).toBeGreaterThan(chatBox?.y + chatBox?.height - 5);

  // Test collapse
  await page.click('button:has-text("Collapse Chat")');
  await page.waitForTimeout(400);

  const collapsedBox = await chat.boundingBox();
  expect(collapsedBox?.height).toBeCloseTo(60, 5);

  const expandedBuildBox = await build.boundingBox();
  expect(expandedBuildBox?.height).toBeGreaterThan(900);
});
```

**Coverage Target:** All 4 scenarios, all acceptance criteria

### BDD Acceptance Tests (QuickPickle + Playwright)

**Step Definitions:**

File: `tests/bdd/steps/responsive-layouts.steps.ts`

```typescript
Given('user is on desktop viewport (≥1024px width)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
});

Given('user is on mobile viewport (<768px width)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
});

Given('user is on tablet viewport (768px-1023px width)', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
});

When('user starts AI conversation', async ({ page }) => {
  await page.goto('/build');
  await page.click('button:has-text("Talk to AI Builder")');
});

Then('chat panel should occupy left 40% of screen', async ({ page }) => {
  const chat = page.locator('[data-testid="chat-panel"]');
  const box = await chat.boundingBox();
  expect(box?.width).toBeCloseTo(1280 * 0.40, -1);
  expect(box?.x).toBe(0); // Left side
});

// ... more step definitions
```

**Coverage Target:** 4 scenarios from feature file (lines 170-203)

### Performance Tests

**60fps Verification:**

```typescript
test('Drawer animation maintains 60fps', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/build');

  // Start performance monitoring
  await page.evaluate(() => {
    (window as any).fps = [];
    let lastTime = performance.now();

    function measureFPS() {
      const now = performance.now();
      const delta = now - lastTime;
      const fps = 1000 / delta;
      (window as any).fps.push(fps);
      lastTime = now;
      requestAnimationFrame(measureFPS);
    }

    requestAnimationFrame(measureFPS);
  });

  // Trigger drawer transition
  await page.click('button:has-text("View Build")');
  await page.waitForTimeout(400);

  // Get FPS measurements
  const fps = await page.evaluate(() => (window as any).fps);
  const avgFPS = fps.reduce((a, b) => a + b, 0) / fps.length;

  expect(avgFPS).toBeGreaterThan(55); // Allow some variance

  // Verify no dropped frames
  const droppedFrames = fps.filter(f => f < 50).length;
  expect(droppedFrames).toBeLessThan(fps.length * 0.05); // <5% dropped
});
```

**Web Vitals:**

```typescript
test('Layout shift during transition (CLS)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });

  // Inject web-vitals library
  await page.addInitScript(() => {
    (window as any).cls = 0;
  });

  await page.goto('/build');
  await page.click('button:has-text("Talk to AI Builder")');

  // Trigger transition
  await page.click('button:has-text("View Build")');
  await page.waitForTimeout(500);

  // Measure CLS
  const cls = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            (window as any).cls += (entry as any).value;
          }
        }
        resolve((window as any).cls);
      }).observe({ entryTypes: ['layout-shift'] });
    });
  });

  expect(cls).toBeLessThan(0.1); // Good CLS < 0.1
});
```

---

## Acceptance Checklist

### Scenario 18: Desktop Side-by-Side

- [ ] Chat panel 40% width (±5px)
- [ ] Build preview 60% width (±5px)
- [ ] Both panels visible simultaneously
- [ ] Resize divider functional
- [ ] Resize range: 30-70%
- [ ] Reset button restores 40/60
- [ ] localStorage persistence working
- [ ] Real-time build updates visible
- [ ] 60fps resize performance
- [ ] Keyboard resize (arrow keys)
- [ ] ARIA announcements on layout change
- [ ] Ultra-wide display handled (max-width)

### Scenario 19: Mobile Full-Screen

- [ ] Chat fills 100vw x 100vh
- [ ] Build preview hidden
- [ ] "View Build" button visible
- [ ] Input fixed at bottom
- [ ] Keyboard doesn't obscure input
- [ ] Safe area insets respected (iOS)
- [ ] Touch scrolling smooth
- [ ] Orientation change handled
- [ ] ARIA announces full-screen mode

### Scenario 20: Mobile Drawer

- [ ] Smooth transition to build view (300ms)
- [ ] Drawer minimizes to 80px
- [ ] Last message preview visible
- [ ] Tap expands drawer
- [ ] Swipe gestures functional
- [ ] 60fps animations verified
- [ ] Spring physics applied
- [ ] Haptic feedback works
- [ ] Reduced motion fallback
- [ ] Gesture interruption handled
- [ ] Focus management correct

### Scenario 21: Tablet Vertical Stack

- [ ] 50/50 height split (±10px)
- [ ] Both sections visible
- [ ] Independent scrolling works
- [ ] Collapse button functional
- [ ] Chat collapses to 60px
- [ ] Build expands to remaining space
- [ ] Expand button restores 50/50
- [ ] Scroll position preserved
- [ ] Touch scrolling smooth
- [ ] Landscape triggers desktop layout

### Cross-Cutting

- [ ] All 4 BDD scenarios passing
- [ ] Unit tests 100% coverage (new code)
- [ ] Integration tests passing
- [ ] E2E tests passing (all viewports)
- [ ] Performance tests passing (60fps)
- [ ] TypeScript strict mode passing
- [ ] ESLint + Prettier passing
- [ ] No regressions (17 existing scenarios pass)
- [ ] Accessibility tests passing
- [ ] Bundle size < 100KB additional

---

## Appendix: Test Data Reference

### Viewport Breakpoints

```typescript
export const VIEWPORTS = {
  mobile: {
    small: { width: 320, height: 568 },   // iPhone SE
    medium: { width: 375, height: 667 },  // iPhone 8
    large: { width: 414, height: 896 },   // iPhone 11
  },
  tablet: {
    min: { width: 768, height: 1024 },    // iPad
    mid: { width: 834, height: 1112 },    // iPad Air
    max: { width: 1023, height: 1366 },   // iPad Pro (just below desktop)
  },
  desktop: {
    min: { width: 1024, height: 768 },    // Small desktop
    standard: { width: 1440, height: 900 }, // Standard
    large: { width: 1920, height: 1080 },  // Full HD
    ultrawide: { width: 2560, height: 1440 }, // 2K
  },
};
```

### Animation Constants

```typescript
export const ANIMATIONS = {
  drawerExpand: {
    duration: 300,
    spring: { stiffness: 300, damping: 30, mass: 1 },
  },
  drawerCollapse: {
    duration: 300,
    spring: { stiffness: 300, damping: 30, mass: 1 },
  },
  panelResize: {
    duration: 300,
    easing: 'ease-out',
  },
  chatCollapse: {
    duration: 300,
    easing: 'ease-out',
  },
};
```

### localStorage Keys

```typescript
export const STORAGE_KEYS = {
  panelSize: 'builderPanelSize',        // number (30-70)
  tutorialSeen: 'hasSeenPanelTutorial',  // boolean
  drawerState: 'chatDrawerState',       // 'expanded' | 'minimized'
};
```

---

## Approval

**Specification Status:** ✅ Complete - Awaiting User Approval

**Approver:** [Awaiting approval to proceed to Phase 3: Design]

**Approval Date:** [Pending]

---

**Document Version:** 1.0
**Last Updated:** 2025-10-26
**Author:** Feature Development Workflow (TDD)
