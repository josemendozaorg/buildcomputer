# Feature Brief: Group 4 - Responsive UI Layouts

## Overview

**Feature Name:** Responsive UI Layouts for AI Conversational Builder
**Group:** 4 of 6 (Scenarios 18-21)
**Status:** Phase 1 - Define (Complete)
**Created:** 2025-10-26

### Problem Statement

The current AI chat interface uses a fixed full-screen overlay (`fixed inset-0 z-50`) that obscures the build preview completely. Users cannot see build recommendations update in real-time during conversations, and the experience is not optimized for different device sizes.

### Solution

Transform the interface into a responsive multi-layout system that adapts to device capabilities:

- **Desktop (≥1024px):** Side-by-side panels with resizable divider
- **Tablet (768-1023px):** Vertical stack with 50/50 split
- **Mobile (<768px):** Full-screen chat with collapsible drawer

---

## User Experience Goals

### Desktop Experience
- **Simultaneous Visibility:** Chat and build preview visible side-by-side
- **Real-Time Updates:** Build recommendations update as conversation progresses
- **User Control:** Resizable panels to customize split ratio
- **Persistence:** Remember user's preferred panel size

### Tablet Experience
- **Balanced View:** 50/50 vertical split for chat and build
- **Independent Scrolling:** Each section scrollable
- **Space Efficiency:** Maximize usable screen real estate

### Mobile Experience
- **Focused Interaction:** Full-screen chat for conversation
- **Smooth Transitions:** Professional drawer animations (60fps)
- **Quick Access:** Easy toggle between chat and build view
- **Context Preservation:** Minimized drawer shows conversation context

---

## Technical Decisions

### 1. Responsive Breakpoint Strategy

**Breakpoints:** Tailwind CSS defaults
- Mobile: `< 768px` (default styles)
- Tablet: `md:` (768px - 1023px)
- Desktop: `lg:` (≥ 1024px)

**Rationale:** Industry standard, zero configuration, aligns perfectly with BDD scenario requirements.

### 2. Desktop Implementation (≥1024px)

**Layout Technique:** `react-resizable-panels`

**Default Split:**
- Chat panel: 40%
- Build preview: 60%

**Panel Constraints:**
- Minimum: 30% (either panel)
- Maximum: 70% (either panel)
- Prevents unusable extreme ratios

**User Controls:**
- Drag divider to resize
- Reset button to restore 40/60 default
- Preference saved to localStorage

**Rationale:** Premium UX, professional feel, user empowerment. Modern drag-and-drop interaction matches user expectations for professional tools.

### 3. Tablet Implementation (768px-1023px)

**Layout Technique:** Vertical stack with CSS Grid

**Split Ratio:**
- Chat: 50% height (top)
- Build preview: 50% height (bottom)

**Behavior:**
- Both sections independently scrollable
- Fixed heights based on viewport
- No collapse/expand (both always visible)

**Rationale:** Balanced visibility on medium screens. Avoids complexity of collapsible sections while maximizing information density.

### 4. Mobile Implementation (<768px)

**Layout Technique:** Framer Motion bottom sheet / drawer

**Drawer States:**
- **Expanded:** Full screen chat (100vh)
- **Minimized:** 80px collapsed (shows header + expand hint)
- **Hidden:** 0px (only when showing build view)

**Animation:**
- Duration: 300ms
- Physics: Spring animation
- Easing: Natural, bouncy feel
- Performance: GPU-accelerated transforms

**Interaction Methods:**
- Tap/click drawer header to toggle
- Swipe up/down gestures (touch)
- "View Build" button navigation

**Rationale:** Professional mobile UX with native app feel. Spring physics create delightful, premium interaction. 80px minimized height provides context without obscuring content.

### 5. State Management Architecture

**useViewport Hook:**
```typescript
{
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  breakpoint: 'mobile' | 'tablet' | 'desktop'
}
```

**BuilderPage State:**
- `drawerExpanded: boolean` - Mobile drawer state
- `panelSizePercent: number` - Desktop panel split (30-70%)
- Managed at parent level, passed as props

**Persistence:**
- Panel split ratio → localStorage (`builderPanelSize`)
- Drawer state → session only (reset on navigation)
- Layout mode → URL query params (`?layout=mobile|tablet|desktop`)

**Rationale:**
- useViewport: Single source of truth for responsive logic
- Parent state: React best practices, predictable data flow
- localStorage: Persist user preferences across sessions
- URL params: Deep linking, testing, sharing specific layouts

---

## Accessibility Requirements (WCAG AAA)

### ARIA Announcements

**Implementation:** Live regions for layout changes

```html
<div aria-live="polite" aria-atomic="true">
  "Switched to mobile view"
  "Switched to desktop view"
  "Chat drawer minimized"
</div>
```

**Rationale:** Screen reader users need context when layout changes automatically.

### Keyboard Shortcuts

**Commands:**
- `Cmd/Ctrl + D`: Toggle drawer (mobile)
- `Cmd/Ctrl + R`: Reset panels to 40/60 (desktop)
- `Escape`: Minimize drawer (mobile)

**Rationale:** Power users and keyboard-only users need efficient navigation.

### Focus Management

**Behavior:**
- Drawer closes → Focus returns to last active element
- Layout changes → Focus preserved if possible
- Panel resize → Focus stays on resize handle

**Rationale:** Prevent focus loss, maintain user context.

### Reduced Motion Support

**Implementation:** `prefers-reduced-motion: reduce`

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable Framer Motion springs */
  /* Use instant or fade transitions */
  /* Respect user system preferences */
}
```

**Rationale:** Users with vestibular disorders need reduced animation. WCAG AAA compliance.

---

## Performance Requirements

### 60fps Animation Guarantee

**Techniques:**

1. **GPU Acceleration:**
   - Use `transform` and `opacity` only (not width/height/position)
   - Trigger hardware acceleration with `translateZ(0)`

2. **will-change Hints:**
   ```css
   .drawer {
     will-change: transform;
   }
   ```
   - Browser optimizes layer composition
   - Applied during active interactions only

3. **React Optimization:**
   - `React.memo()` on BuildRecommendations
   - Prevent re-renders during panel resize
   - Stable callback references with useCallback

4. **Performance Monitoring:**
   - Track Web Vitals (CLS, FID, LCP)
   - Verify 60fps in E2E tests
   - Use Chrome DevTools Performance tab

**Rationale:** Modern web apps must feel instant. 60fps is the baseline for smooth, professional UX.

### Bundle Size Management

**New Dependencies:**
- `react-resizable-panels`: ~15KB gzipped
- `framer-motion`: ~50KB gzipped (already in project)

**Total Impact:** ~65KB additional

**Mitigation:**
- Code splitting for mobile-only features
- Tree-shaking for unused Framer Motion features
- Lazy load drawer component on mobile

---

## Edge Cases & Error Handling

### 1. Orientation Change (Mobile)

**Scenario:** User rotates device landscape ↔ portrait

**Behavior:**
- Re-evaluate breakpoint on `orientationchange` event
- May trigger tablet ↔ mobile layout switch
- Preserve drawer state across orientation changes

**Implementation:** useViewport hook listens to orientationchange

### 2. Window Resize (Desktop/Tablet)

**Scenario:** User resizes browser window

**Behavior:**
- Debounce resize events (150ms)
- Update breakpoint after 150ms idle
- Prevent excessive re-renders

**Implementation:** useViewport uses lodash debounce or custom hook

### 3. Split-Screen / Multitasking (Mobile)

**Scenario:** User enables split-screen on mobile

**Behavior:**
- Narrow viewport may trigger tablet layout unexpectedly
- useViewport handles gracefully
- No special handling needed (viewport is viewport)

### 4. SSR / Progressive Enhancement

**Scenario:** JavaScript disabled or slow network

**Behavior:**
- Default to mobile layout in HTML
- JavaScript enhances to responsive
- Not critical for SPA (React requires JS)

---

## UX Enhancements

### 1. Smooth Scroll Transitions

**Behavior:** When layout changes (e.g., mobile → tablet), smooth scroll to top

**Implementation:**
```javascript
window.scrollTo({ top: 0, behavior: 'smooth' })
```

**Rationale:** Prevent jarring jumps when viewport triggers layout change.

### 2. Skeleton Loaders

**Behavior:** Show placeholder content during panel resize or layout transitions

**Components:**
- ChatInterface skeleton (loading bubbles)
- BuildRecommendations skeleton (card placeholders)

**Rationale:** Prevent flash of empty panels, maintain visual continuity.

### 3. Haptic Feedback (Mobile)

**Behavior:** Vibrate on drawer open/close interactions

**Implementation:**
```javascript
if ('vibrate' in navigator) {
  navigator.vibrate(10) // 10ms pulse
}
```

**Rationale:** Native app feel, tactile confirmation of action.

### 4. Tutorial Tooltip

**Behavior:** First-time desktop users see tooltip: "Drag the divider to resize panels"

**Trigger:** Show once on first desktop visit

**Dismissal:**
- Click "Got it" button
- Click outside tooltip
- Resize panel (inferred understanding)

**Storage:** `localStorage.setItem('hasSeenPanelTutorial', 'true')`

**Rationale:** Discoverability of resizable panels feature.

---

## Dependencies

### New Dependencies

**Production:**
```json
{
  "react-resizable-panels": "^2.0.0",
  "framer-motion": "^11.0.0" // Already in project
}
```

**DevDependencies:** None (use existing testing tools)

### Dependency Rationale

- **react-resizable-panels:** Best-in-class resizable panel library. Accessible, performant, TypeScript-first. Active maintenance.
- **framer-motion:** Industry standard for React animations. Powerful declarative API, excellent TypeScript support, optimized for performance.

---

## Success Criteria

### Functional Requirements

- ✅ Desktop: Side-by-side 40/60 split with resizable divider
- ✅ Desktop: Panel constraints (30-70%), localStorage persistence, reset button
- ✅ Tablet: 50/50 vertical stack, both sections scrollable
- ✅ Mobile: Full-screen chat with Framer Motion drawer
- ✅ Mobile: Drawer states (expanded/minimized/hidden), 80px collapsed height
- ✅ All: Real-time build updates visible during conversation

### Test Coverage

- ✅ 4 BDD scenarios passing (Scenarios 18-21)
- ✅ Unit tests: useViewport hook, ChatDrawer component
- ✅ Integration tests: BuilderPage responsive logic
- ✅ E2E tests: Full flows on mobile/tablet/desktop viewports
- ✅ Accessibility tests: Keyboard navigation, ARIA, reduced motion

### Performance

- ✅ 60fps animations verified (Chrome DevTools Performance)
- ✅ Web Vitals monitored (CLS, FID, LCP)
- ✅ Bundle size < 100KB additional (target: ~65KB)

### Accessibility

- ✅ WCAG AAA compliance
- ✅ ARIA live regions for layout changes
- ✅ Keyboard shortcuts functional (Cmd+D, Cmd+R, Escape)
- ✅ Focus management during transitions
- ✅ Reduced motion support (`prefers-reduced-motion`)

### Quality

- ✅ TypeScript strict mode passing
- ✅ ESLint + Prettier passing
- ✅ No regressions (17 existing scenarios still pass)
- ✅ Code review ready

---

## Implementation Scope

### New Components

1. **ChatDrawer.tsx**
   - Framer Motion bottom sheet
   - Expanded/minimized states
   - Swipe gesture support
   - Haptic feedback integration

### New Hooks

1. **useViewport.ts**
   - Window size tracking
   - Breakpoint detection
   - Debounced resize handling
   - Orientation change support

2. **useHapticFeedback.ts**
   - Navigator.vibrate wrapper
   - Feature detection
   - Configurable patterns

3. **usePanelResize.ts**
   - Panel size state management
   - localStorage persistence
   - Reset functionality

### Modified Components

1. **BuilderPage.tsx**
   - Responsive layout rendering
   - Desktop: react-resizable-panels wrapper
   - Tablet: CSS Grid vertical stack
   - Mobile: ChatDrawer integration
   - State management for all layout modes

2. **ChatInterface.tsx**
   - Accept layout mode prop
   - Adjust header/footer for different layouts
   - Fixed input positioning for mobile

### New Utilities

1. **scrollToTop.ts**
   - Smooth scroll helper
   - Layout transition support

2. **storageKeys.ts**
   - Centralized localStorage key constants
   - `PANEL_SIZE_KEY`, `TUTORIAL_SEEN_KEY`

---

## Testing Strategy

### Unit Tests

**Coverage:**
- useViewport: Breakpoint detection, resize handling
- useHapticFeedback: Feature detection, vibration
- usePanelResize: State management, localStorage sync
- ChatDrawer: Render states, event handlers

**Tools:** Vitest + @testing-library/react

### Integration Tests

**Coverage:**
- BuilderPage responsive layout rendering
- Panel resize interactions
- Drawer expand/collapse interactions
- State synchronization (props, localStorage, URL)

**Tools:** Vitest + @testing-library/react

### E2E Tests

**Coverage:**
- Scenario 18: Desktop side-by-side (Playwright viewport 1280x720)
- Scenario 19: Mobile full-screen (Playwright viewport 375x667)
- Scenario 20: Mobile drawer transitions (touch simulation)
- Scenario 21: Tablet vertical stack (Playwright viewport 768x1024)

**Tools:** Playwright with device emulation

### BDD Acceptance Tests

**Coverage:**
- All 4 scenarios from `tests/bdd/features/ai-conversational-builder.feature` (lines 170-203)

**Tools:** QuickPickle (Gherkin) + Playwright

### Performance Tests

**Coverage:**
- 60fps verification during drawer animations
- Web Vitals tracking (CLS, FID, LCP)
- Bundle size monitoring

**Tools:** Playwright Performance API, Lighthouse CI

---

## Risks & Mitigations

### Risk 1: Bundle Size Impact

**Impact:** +65KB could slow initial load

**Mitigation:**
- Code splitting for mobile-only features
- Lazy load ChatDrawer component
- Monitor bundle with webpack-bundle-analyzer

### Risk 2: Framer Motion Performance

**Impact:** Spring animations may lag on low-end devices

**Mitigation:**
- GPU acceleration (transform only)
- Reduced motion fallback
- Performance testing on target devices

### Risk 3: localStorage Sync Issues

**Impact:** Panel size not persisting correctly

**Mitigation:**
- Centralized storage utilities
- Error handling for localStorage quota
- Default fallbacks if localStorage unavailable

### Risk 4: Viewport Detection Edge Cases

**Impact:** Incorrect breakpoint on unusual viewports

**Mitigation:**
- Comprehensive testing (100+ viewport combinations)
- Debounced resize handling
- URL param override for testing

---

## Timeline

**Phase 1: Define** - ✅ Complete (30 minutes)
**Phase 2: Spec** - Estimated 15-20 minutes
**Phase 3: Design** - Estimated 20-30 minutes
**Phase 4: Implement** - Estimated 40-60 minutes
**Phase 5: Verify** - Estimated 3-5 minutes
**Phase 6: PR** - Estimated 2-3 minutes

**Total:** 70-120 minutes (TDD workflow)

---

## Next Steps

1. **Phase 2: Create Specification**
   - Formalize 4 BDD scenarios with acceptance criteria
   - Define test data and edge cases
   - Document user flows
   - Get user approval

2. **Phase 3: Technical Design**
   - Design component APIs
   - Document state management
   - Plan implementation architecture
   - Get user approval

3. **Phase 4: Implementation**
   - Generate tests (RED phase)
   - Implement code (GREEN phase)
   - Refactor for quality (REFACTOR phase)
   - All tests passing

4. **Phase 5: Verification**
   - Run quality checks
   - Fix any issues
   - Final approval

5. **Phase 6: Pull Request**
   - Create comprehensive PR
   - Merge to master

---

## Approval

**Feature Brief Status:** ✅ Complete - Awaiting User Approval

**Approver:** [Awaiting approval to proceed to Phase 2]

**Approval Date:** [Pending]

---

## Appendix: BDD Scenarios Reference

From `tests/bdd/features/ai-conversational-builder.feature` (lines 170-203):

```gherkin
@acceptance @ui @responsive @desktop
Scenario: Desktop side-by-side layout
  Given user is on desktop viewport (≥1024px width)
  When user starts AI conversation
  Then chat panel should occupy left 40% of screen
  And build preview should occupy right 60%
  And both panels should be visible simultaneously
  And build preview should update in real-time as conversation progresses

@acceptance @ui @responsive @mobile
Scenario: Mobile full-screen chat
  Given user is on mobile viewport (<768px width)
  When user starts AI conversation
  Then chat should fill entire screen
  And build preview should be hidden
  And navigation should show "View Build" button
  And chat input should be fixed at bottom

@acceptance @ui @responsive @mobile @transitions
Scenario: Mobile transition to build view
  Given user completes AI conversation on mobile
  When AI shows build recommendations
  Then screen should smoothly transition to build view
  And chat should minimize to bottom drawer
  And user can tap drawer to expand chat again
  And transition should be 60fps smooth

@acceptance @ui @responsive @tablet
Scenario: Tablet responsive layout
  Given user is on tablet viewport (768px-1023px width)
  When user starts AI conversation
  Then layout should stack vertically: chat on top, build preview below
  And both sections should be scrollable
  And user can collapse chat to see more of build preview
```

---

**Document Version:** 1.0
**Last Updated:** 2025-10-26
**Author:** Feature Development Workflow (TDD)
