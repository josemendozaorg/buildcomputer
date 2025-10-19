# Specification: Persona-Based PC Builder MVP

## Overview

### Purpose

This feature addresses the core problem that most people who want to build a PC **don't know what components they need** - but they DO know what they want to accomplish (play specific games, edit videos, run AI models, etc.). Traditional PC configurators require technical knowledge about CPUs, GPUs, RAM speeds, etc., which creates a barrier to entry and leads to decision paralysis.

The Persona-Based PC Builder MVP solves this by:

- **Eliminating technical jargon**: Users select their "story" (persona) instead of specs
- **Providing instant value**: Within seconds, users see 3 tailored PC build recommendations
- **Reducing friction**: No lengthy questionnaires or complex forms
- **Building confidence**: Each build shows what it can DO (e.g., "Run Cyberpunk at 60+ FPS with ray tracing") rather than just listing specs

This is the foundation of BuildComputer's value proposition and serves as the entry point for the entire build journey. Currently, the landing page has a "Get Started" button that goes nowhere - this feature makes that button functional and valuable.

### Stakeholders

- **End Users**:
  - Non-technical users who want to build a PC but feel overwhelmed by component choices
  - Gamers who know what games they want to play but not what hardware they need
  - Content creators, AI enthusiasts, students, professionals with specific use cases
- **Development Team**: Engineers maintaining and extending the builder interface
- **Product/Design Team**: UX designers ensuring the persona-based approach is intuitive and converts
- **Future Integrations** (not in MVP scope):
  - Price comparison API providers
  - Component manufacturers/retailers
  - Affiliate partners

## Functional Requirements

### Core Functionality

1. **Routing and Navigation**
   - Create a new route `/build` for the PC builder interface
   - "Get Started" button on landing page navigates to `/build`
   - Browser back button returns to landing page
   - Route is shareable via URL

2. **Persona Selection Interface**
   - Display 8 persona cards in a responsive grid layout:
     1. **Competitive Gamer** - "Win every fight" (Valorant, CS2, Apex at 144+ FPS)
     2. **Cinematic Gamer** - "Live the story" (Cyberpunk, RDR2 with ray tracing)
     3. **Creator** - "Bring ideas to life" (4K video editing, 3D rendering)
     4. **AI Enthusiast** - "Train the future" (Local LLM, ML model training)
     5. **Student** - "Study smarter" (Academic work, research, multi-tasking)
     6. **Professional** - "Work without limits" (CAD, simulations, complex workflows)
     7. **Casual User** - "Daily essentials" (Browse, stream, light gaming)
     8. **Custom Build** - "I know what I need" (indicates future advanced mode)
   - Each card shows: icon/illustration, title, tagline, example use cases
   - User can select exactly one persona (single-select behavior)
   - Selected persona is visually highlighted
   - Cards are keyboard accessible (Tab, Enter/Space to select)

3. **Budget Slider Interface**
   - Interactive slider with min ($500) and max ($5000) budget range
   - Current budget value displayed prominently in real-time
   - Slider has visual markers at key price points ($500, $1000, $1500, $2000, $3000, $5000)
   - As slider moves, visual feedback shows component tier changes (e.g., GPU/CPU icons fade in/out)
   - Slider is keyboard accessible (arrow keys adjust value)
   - Touch-friendly for mobile devices (minimum 44x44px touch target)

4. **Build Recommendation Display**
   - Show 3 build options based on selected persona and budget:
     - **Optimized Build** (best value for the use case at current budget)
     - **Performance Build** (~15% more expensive, prioritizes GPU/CPU)
     - **Featured Build** (~15% less expensive, balanced with more storage/extras)
   - Each build card displays:
     - Total price (prominent)
     - "What it can do" description (e.g., "Run Cyberpunk 2077 at 4K 60FPS with ray tracing")
     - Component summary (CPU, GPU, RAM, Storage - simplified names)
     - Expandable component details (full component list with specs)
   - Builds update instantly (< 200ms) when persona or budget changes
   - If budget is too low for persona, show helpful message suggesting minimum budget

5. **Mock Data System**
   - Static JSON/TypeScript data structure with pre-defined builds for each persona
   - Each persona has builds at multiple budget tiers (low: $500-$1000, mid: $1000-$2000, high: $2000+)
   - System selects appropriate build tier based on slider value
   - Component data includes: name, type, price, key specs, capability descriptions

### User Interactions

**Primary User Flow:**

1. User lands on BuildComputer homepage
2. User clicks "Get Started" button
3. Browser navigates to `/build` route
4. User sees persona selection screen with 8 cards
5. User clicks a persona card (e.g., "Competitive Gamer")
6. Selected persona is highlighted, budget slider appears below
7. User adjusts budget slider to their price range (e.g., $1500)
8. Three build recommendations appear instantly
9. User reviews build cards, sees prices and capabilities
10. User clicks "View Details" to expand component list
11. User can go back and select different persona or adjust budget to see new recommendations

**Secondary Interactions:**

- User can use keyboard to navigate (Tab through personas, arrow keys on slider, Enter to select)
- User can share the URL (future: URL includes persona and budget as query params for deep linking)
- Mobile users can swipe/tap through personas and use touch slider
- User sees loading state only on initial page load (no loading states for build updates since data is static/instant)

## UI/UX Requirements

### Visual Design

- **Design Mockups:** TBD (to be created in design phase)
- **Design System:** Tailwind CSS (already in use in the project)
- **Color Palette:**
  - Primary: Tailwind indigo-600 (#4F46E5) for CTAs and selected states
  - Secondary: Tailwind slate-700 (#334155) for text
  - Accent: Tailwind purple-500 (#A855F7) for highlights
  - Background: Tailwind gray-50 (#F9FAFB) for page background
  - Cards: White (#FFFFFF) with subtle shadow
  - Success/Info states use Tailwind's semantic colors
- **Typography:**
  - Headings: font-bold, text-3xl (persona titles), text-2xl (section headings)
  - Body text: font-normal, text-base
  - Price displays: font-bold, text-2xl
  - Small text/labels: text-sm, text-gray-600
- **Spacing:** Tailwind's spacing scale (4px increments: p-4, p-6, p-8, etc.)
- **Iconography:** TBD - options include Heroicons (Tailwind UI), Lucide React, or custom illustrations for personas

### Component Architecture

- **Component Breakdown:**
  - `BuilderPage`: Top-level page component for /build route
  - `PersonaSelector`: Grid of 8 persona cards with selection logic
  - `PersonaCard`: Individual persona card (reusable)
  - `BudgetSlider`: Interactive slider with value display and visual feedback
  - `BuildRecommendations`: Container for 3 build option cards
  - `BuildCard`: Individual build recommendation card with expand/collapse
  - `ComponentList`: Expandable list of PC components
  - `mockBuilds.ts`: TypeScript data file with pre-defined builds
- **Component Hierarchy:**
  ```
  BuilderPage
  ├── PersonaSelector
  │   └── PersonaCard (x8)
  ├── BudgetSlider
  └── BuildRecommendations
      └── BuildCard (x3)
          └── ComponentList
  ```
- **State Management:**
  - React `useState` for local state (selectedPersona, budget, selectedBuild)
  - No global state needed for MVP
  - React Router for route management
- **Props Interface:**
  - `PersonaCard`: `{ id, title, tagline, examples, icon, selected, onSelect }`
  - `BudgetSlider`: `{ value, min, max, onChange }`
  - `BuildCard`: `{ title, price, capability, components, expanded, onToggle }`

### Accessibility Requirements (WCAG 2.1)

- [ ] **Keyboard Navigation:** All interactive elements accessible via keyboard
- [ ] **Screen Reader Support:** Semantic HTML, ARIA labels, roles
- [ ] **Color Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text
- [ ] **Focus Indicators:** Visible focus states for all interactive elements
- [ ] **Alt Text:** Descriptive alt text for all images
- [ ] **Form Labels:** Proper labels and error messages for all form fields
- [ ] **Heading Structure:** Logical heading hierarchy (H1 → H2 → H3...)
- [ ] **Target Size:** Minimum 44x44px touch targets for mobile

### Responsive Design

- **Breakpoints:**
  - Mobile: < 640px (sm)
  - Tablet: 640px - 1024px (md)
  - Desktop: > 1024px (lg)
- **Mobile-First:** Yes - using Tailwind's mobile-first approach
- **Touch Interactions:**
  - Tap to select persona cards
  - Touch-friendly slider (44x44px min touch target)
  - Tap to expand/collapse build details
- **Orientation:** Both portrait and landscape supported
- **Responsive Behavior:**
  - Mobile: Persona cards stack vertically (1 column), full width
  - Tablet: Persona cards in 2 columns
  - Desktop: Persona cards in 4 columns (2 rows of 4)
  - Build cards stack vertically on mobile, side-by-side on desktop

### Interactive States

- **Default State:**
  - Persona cards: White background, subtle border, normal cursor
  - Slider: Default thumb position, track visible
  - Build cards: Collapsed (details hidden)
- **Hover State:**
  - Persona cards: Slight scale (scale-105), shadow increase, cursor pointer
  - Slider thumb: Scale increase, shadow
  - Build cards: Shadow increase
- **Active/Pressed State:**
  - Persona cards (selected): Indigo-600 border, indigo-50 background, checkmark icon
  - Slider thumb: Active drag state
  - Build card expand button: Pressed appearance
- **Focus State:**
  - All interactive elements: Visible focus ring (ring-2 ring-offset-2 ring-indigo-500)
  - Keyboard navigation clearly visible
- **Disabled State:**
  - "Custom Build" persona card shows "Coming Soon" badge (future feature indicator)
  - Budget too low: Disabled state on build cards with explanation message
- **Loading State:**
  - Initial page load: Loading spinner on page
  - No loading states for build updates (instant with mock data)
- **Error State:**
  - If budget is below minimum for persona: Yellow warning banner "This persona works best with a budget of at least $X. Try increasing your budget or selecting a different persona."
- **Empty State:**
  - Before persona selection: "Choose your story above to see build recommendations"

### Animations and Transitions

- **Micro-interactions:**
  - Persona card hover: 150ms scale transform
  - Persona card selection: 200ms border and background color transition
  - Slider drag: Smooth 100ms thumb movement
  - Build card expand/collapse: 300ms height transition with ease-in-out
- **Page Transitions:**
  - Route change (/ → /build): Simple fade-in 200ms
  - No complex page transitions for MVP
- **Loading Animations:**
  - Initial page load: Simple spinner (Tailwind animate-spin)
  - No skeleton screens for MVP
- **Duration:**
  - Quick interactions: 150ms (hover, focus)
  - Standard transitions: 200-300ms (expand/collapse, color changes)
  - No animations longer than 400ms
- **Easing:**
  - Tailwind defaults (ease-in-out for most transitions)
  - Slider: linear easing for precise control

### Storybook Requirements

- [ ] **Component Stories:** Each component has a .stories file
- [ ] **Variants:** All component states and variants documented
- [ ] **Props Controls:** Interactive controls for all props
- [ ] **Documentation:** Component usage docs in MDX
- [ ] **Accessibility Addon:** a11y validation in Storybook
- [ ] **Visual Regression:** Chromatic or Percy integration

## Behavior-Driven Development Scenarios

### Scenario 1: User navigates to PC Builder from landing page

**Given** the user is on the BuildComputer landing page
**When** the user clicks the "Get Started" button
**Then** the browser navigates to the "/build" route
**And** the persona selection interface is displayed
**And** 8 persona cards are visible

### Scenario 2: User selects a persona and sees budget slider

**Given** the user is on the "/build" page
**When** the user clicks the "Competitive Gamer" persona card
**Then** the persona card is visually highlighted with an indigo border
**And** the budget slider appears below the persona cards
**And** the slider is set to a default value of $1500

### Scenario 3: User adjusts budget and sees build recommendations

**Given** the user has selected the "Competitive Gamer" persona
**And** the budget slider is visible
**When** the user drags the slider to $2000
**Then** the budget value display updates to show "$2000"
**And** 3 build recommendation cards appear instantly (< 200ms)
**And** the cards show "Optimized Build", "Performance Build", and "Featured Build"
**And** each card displays a total price and capability description

### Scenario 4: User expands build details to view components

**Given** the user is viewing 3 build recommendation cards
**When** the user clicks "View Details" on the "Optimized Build" card
**Then** the card expands with a smooth transition (300ms)
**And** a component list is revealed showing CPU, GPU, RAM, Storage, etc.
**And** each component shows name, type, and key specs

### Scenario 5: User changes persona and sees updated builds

**Given** the user has selected "Competitive Gamer" with budget $2000
**And** build recommendations are displayed
**When** the user clicks the "Creator" persona card
**Then** the "Competitive Gamer" card is deselected
**And** the "Creator" card is highlighted
**And** the build recommendations update instantly to show creator-optimized builds
**And** the capability descriptions change to reflect content creation use cases

### Scenario 6: User sets budget too low for selected persona

**Given** the user has selected the "AI Enthusiast" persona
**When** the user sets the budget slider to $600
**Then** a yellow warning banner appears
**And** the warning states "This persona works best with a budget of at least $1200. Try increasing your budget or selecting a different persona."
**And** build cards show disabled state or adjusted recommendations

### Scenario 7: User navigates with keyboard only

**Given** the user is on the "/build" page
**When** the user presses the Tab key repeatedly
**Then** focus moves through persona cards in logical order
**And** each focused element shows a visible focus ring (indigo-500)
**When** the user presses Enter on a focused persona card
**Then** the persona is selected
**When** the user tabs to the budget slider and uses arrow keys
**Then** the slider value increases/decreases accordingly

### Scenario 8: Mobile user interacts with touch

**Given** the user is on a mobile device (viewport width < 640px)
**And** the user is on the "/build" page
**When** the user taps a persona card
**Then** the card is selected (no hover state)
**When** the user drags the budget slider with touch
**Then** the slider thumb responds smoothly to touch input
**And** the touch target is at least 44x44px

### Scenario 9: Desktop user sees hover effects

**Given** the user is on a desktop device with a mouse
**And** the user is viewing the persona cards
**When** the user moves the mouse over a persona card
**Then** the card scales slightly (scale-105) with 150ms transition
**And** the card shadow increases
**And** the cursor changes to pointer

### Scenario 10: User accesses /build directly via URL

**Given** the user types "buildcomputer.com/build" in the browser
**When** the page loads
**Then** the builder interface is displayed
**And** no persona is pre-selected
**And** the budget slider is not visible yet
**And** an empty state message says "Choose your story above to see build recommendations"

### Scenario 11: Responsive layout adapts to screen size

**Given** the user is on the "/build" page
**When** the viewport width is less than 640px (mobile)
**Then** persona cards are displayed in 1 column, full width
**And** build cards stack vertically
**When** the viewport width is between 640px and 1024px (tablet)
**Then** persona cards are displayed in 2 columns
**When** the viewport width is greater than 1024px (desktop)
**Then** persona cards are displayed in 4 columns (2 rows of 4)
**And** build cards can be displayed side-by-side

### Scenario 12: "Custom Build" persona indicates future feature

**Given** the user is viewing the 8 persona cards
**When** the user looks at the "Custom Build" card
**Then** the card displays a "Coming Soon" badge
**And** clicking it shows a tooltip: "Component-by-component customization coming soon"

## Acceptance Criteria

### Core Functionality

- [ ] **Route exists:** `/build` route is accessible and renders BuilderPage component
- [ ] **Navigation:** Clicking "Get Started" on landing page navigates to `/build`
- [ ] **Persona cards:** All 8 persona cards are displayed (Competitive Gamer, Cinematic Gamer, Creator, AI Enthusiast, Student, Professional, Casual User, Custom Build)
- [ ] **Persona selection:** User can select exactly one persona at a time
- [ ] **Visual feedback:** Selected persona shows indigo border and highlighted background
- [ ] **Budget slider:** Slider appears after persona selection with default value $1500
- [ ] **Budget range:** Slider allows values from $500 to $5000
- [ ] **Budget display:** Current budget value is displayed and updates in real-time
- [ ] **Build recommendations:** 3 build cards appear instantly (< 200ms) after budget is set
- [ ] **Build variants:** Three builds show "Optimized", "Performance", and "Featured" options
- [ ] **Build data:** Each build displays total price, capability description, and component summary
- [ ] **Component details:** User can expand build cards to view full component list
- [ ] **Persona switching:** Changing persona updates build recommendations immediately
- [ ] **Budget adjustment:** Changing budget updates build recommendations immediately
- [ ] **Low budget warning:** Warning appears if budget is below persona's minimum ($600 for AI Enthusiast shows warning)
- [ ] **Empty state:** Before persona selection, appropriate empty state message is shown
- [ ] **"Custom Build" badge:** Custom Build card shows "Coming Soon" badge
- [ ] **Mock data loads:** Static build data loads successfully for all personas and budget tiers

### UI/UX Acceptance Criteria

- [ ] **Visual Design:** Matches approved mockups/design system
- [ ] **Accessibility:** Passes WCAG 2.1 Level AA compliance (axe-core scan)
- [ ] **Responsive Design:** Works correctly on mobile, tablet, and desktop
- [ ] **Cross-Browser:** Tested on Chrome, Firefox, Safari, Edge
- [ ] **Component Stories:** All components documented in Storybook
- [ ] **Visual Regression:** No unintended visual changes (Chromatic/Percy)
- [ ] **Keyboard Navigation:** All interactions work with keyboard only
- [ ] **Screen Reader:** Compatible with NVDA, JAWS, VoiceOver
- [ ] **Performance:** First Contentful Paint < 1.5s, Time to Interactive < 3.5s
- [ ] **Interactive States:** All states implemented (hover, focus, active, disabled, error, loading)

## Non-Functional Requirements

### Performance

[Performance expectations, if applicable]

**UI/UX Performance Targets:**

- **First Contentful Paint (FCP):** < 1.5 seconds
- **Largest Contentful Paint (LCP):** < 2.5 seconds
- **Time to Interactive (TTI):** < 3.5 seconds
- **Cumulative Layout Shift (CLS):** < 0.1
- **First Input Delay (FID):** < 100ms
- **Bundle Size:** < 200KB (gzipped) for critical path
- **Image Optimization:** WebP format, lazy loading, responsive images

### Security

[Security requirements, if applicable]

**UI/UX Security Considerations:**

- **XSS Protection:** Sanitize user inputs, use Content Security Policy
- **CSRF Protection:** CSRF tokens for state-changing operations
- **Sensitive Data:** Mask passwords, credit cards; secure form submission
- **Third-Party Scripts:** Subresource Integrity (SRI) for CDN resources

### Usability

[Usability considerations, if applicable]

**UI/UX Usability Standards:**

- **Nielsen's Heuristics:** Follows 10 usability heuristics
- **Fitts's Law:** Important actions have larger, easier-to-click targets
- **Miller's Law:** Chunked information into groups of 5-9 items
- **Error Prevention:** Confirmation dialogs for destructive actions
- **Error Recovery:** Clear error messages with actionable solutions
- **Consistency:** Consistent patterns, terminology, and visual design
- **Feedback:** Immediate visual feedback for all user actions
- **Help & Documentation:** Contextual help, tooltips, onboarding

## Constraints and Assumptions

### Technical Constraints

- Must use existing Tailwind CSS design system
- Must use React Router for routing (add dependency if not present)
- Must work with existing project structure (src/components/, src/pages/ or src/routes/)
- Bundle size increase must be minimal (< 50KB gzipped for new components)
- Must use TypeScript strict mode (existing project standard)
- Cannot use external state management libraries (Redux, Zustand) for MVP - React useState only

### Assumptions

- Users have JavaScript enabled in their browser
- The landing page already has a "Get Started" button that can be updated to link to `/build`
- Mock data is acceptable for MVP - real component prices and AI recommendations come in future phases
- Users accessing `/build` directly (not from landing page) is an expected use case
- The existing test infrastructure (Vitest, Playwright, QuickPickle) is sufficient
- No backend API is needed for MVP - all data is client-side static
- Browser compatibility: Modern evergreen browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Mobile devices: iOS Safari 14+, Chrome on Android 10+

### Dependencies

- **React Router** (or similar routing solution) - may need to be added if not present
- **Existing dependencies:** React 18, TypeScript, Tailwind CSS, Vite (already in project)
- **No new runtime dependencies** expected beyond routing
- **Icons/Illustrations:** Need to decide on icon library (Heroicons, Lucide React, or custom SVGs)
- **Future:** Build data will eventually come from a backend API or database (out of MVP scope)

## Open Questions

- [ ] Which icon library should we use for persona illustrations? (Heroicons, Lucide React, custom SVGs, or AI-generated illustrations)
- [ ] Should we add React Router as a dependency, or is there already a routing solution in place?
- [ ] What should be the exact minimum budget thresholds for each persona to show warnings?
- [ ] Should build recommendations be saved to localStorage for persistence across sessions?
- [ ] Do we need analytics tracking for persona selection and budget adjustments?
- [ ] Should the URL include query parameters for deep linking (e.g., `/build?persona=gamer&budget=2000`)?

## Approval

- **Created by:** Claude Code (AI Assistant)
- **Date:** 2025-10-19
- **Status:** Draft - Ready for Review
- **Approved by:** Pending - Awaiting user/stakeholder review
