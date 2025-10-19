# Task Breakdown: Persona-Based PC Builder MVP

**Generated:** 2025-10-19
**Total Scenarios:** 12
**Total TDD Tasks:** TBD (to be counted after breakdown)
**Implementation Strategy:** Outside-In (BDD → TDD)

---

## Scenario 1: User navigates to PC Builder from landing page

**Given-When-Then:**

- **Given:** the user is on the BuildComputer landing page
- **When:** the user clicks the "Get Started" button
- **Then:** the browser navigates to the "/build" route
- **And:** the persona selection interface is displayed
- **And:** 8 persona cards are visible

**Acceptance Test:** `tests/bdd/features/persona-based-builder.feature:11`
**Status:** ❌ FAILING (as expected - outer RED phase)

### Acceptance Criteria Satisfied by This Scenario:

- [ ] **Route exists:** `/build` route is accessible and renders BuilderPage component
- [ ] **Navigation:** Clicking "Get Started" on landing page navigates to `/build`

### Required Components (TDD Tasks):

#### Task 1.1: Setup React Router

- **Description:** Install and configure React Router for client-side routing
- **Type:** Integration Test
- **Dependencies:** None
- **Test Strategy:** Verify routing library installed, basic route configuration works
- **Status:** Pending
- **Linked Scenario:** Scenario 1

#### Task 1.2: Create BuilderPage component (minimal)

- **Description:** Create basic BuilderPage component that renders without errors
- **Type:** Unit Test
- **Dependencies:** None
- **Test Strategy:** Component renders without crashing, displays main heading
- **Status:** Pending
- **Linked Scenario:** Scenario 1

#### Task 1.3: Add /build route configuration

- **Description:** Configure /build route to render BuilderPage
- **Type:** Integration Test
- **Dependencies:** Task 1.1, Task 1.2
- **Test Strategy:** Navigating to /build renders BuilderPage component
- **Status:** Pending
- **Linked Scenario:** Scenario 1

#### Task 1.4: Update "Get Started" button navigation

- **Description:** Make landing page "Get Started" button navigate to /build
- **Type:** Integration Test
- **Dependencies:** Task 1.3
- **Test Strategy:** Clicking button changes route to /build
- **Status:** Pending
- **Linked Scenario:** Scenario 1

### Scenario Completion Criteria:

- [ ] All component unit tests pass
- [ ] All integration tests pass
- [ ] E2E test created and passing
- [ ] **Acceptance test for Scenario 1 passes** ← BDD validation

---

## Scenario 2: User selects a persona and sees budget slider

**Given-When-Then:**

- **Given:** the user is on the "/build" page
- **When:** the user clicks the "Competitive Gamer" persona card
- **Then:** the persona card is visually highlighted with an indigo border
- **And:** the budget slider appears below the persona cards
- **And:** the slider is set to a default value of $1500

**Acceptance Test:** `tests/bdd/features/persona-based-builder.feature:18`
**Status:** ❌ FAILING (as expected)

### Acceptance Criteria Satisfied by This Scenario:

- [ ] **Persona cards:** All 8 persona cards are displayed
- [ ] **Persona selection:** User can select exactly one persona at a time
- [ ] **Visual feedback:** Selected persona shows indigo border and highlighted background
- [ ] **Budget slider:** Slider appears after persona selection with default value $1500

### Required Components (TDD Tasks):

#### Task 2.1: Create PersonaCard component

- **Description:** Create PersonaCard component with props (id, title, tagline, examples, icon, selected, onSelect)
- **Type:** Unit Test
- **Dependencies:** None
- **Test Strategy:** Renders persona data, handles click, shows selected state
- **Status:** Pending
- **Linked Scenario:** Scenario 2

#### Task 2.2: Create PersonaSelector component

- **Description:** Container for 8 PersonaCards with selection state management
- **Type:** Unit Test
- **Dependencies:** Task 2.1
- **Test Strategy:** Renders 8 cards, manages single selection, calls onSelect callback
- **Status:** Pending
- **Linked Scenario:** Scenario 2

#### Task 2.3: Create BudgetSlider component (display only)

- **Description:** Budget slider component with value display (non-interactive initially)
- **Type:** Unit Test
- **Dependencies:** None
- **Test Strategy:** Renders with given value, displays formatted price
- **Status:** Pending
- **Linked Scenario:** Scenario 2

#### Task 2.4: Integrate PersonaSelector into BuilderPage

- **Description:** Add PersonaSelector to BuilderPage with state management
- **Type:** Integration Test
- **Dependencies:** Task 2.2, Task 1.2
- **Test Strategy:** Page renders persona selector, selection updates state
- **Status:** Pending
- **Linked Scenario:** Scenario 2

#### Task 2.5: Show/hide BudgetSlider based on persona selection

- **Description:** Display BudgetSlider when persona is selected
- **Type:** Integration Test
- **Dependencies:** Task 2.3, Task 2.4
- **Test Strategy:** Slider hidden initially, appears after persona selection
- **Status:** Pending
- **Linked Scenario:** Scenario 2

### Scenario Completion Criteria:

- [ ] All component tests pass
- [ ] E2E test created and passing
- [ ] **Acceptance test for Scenario 2 passes**

---

## Scenario 3: User adjusts budget and sees build recommendations

**Given-When-Then:**

- **Given:** the user has selected the "Competitive Gamer" persona
- **And:** the budget slider is visible
- **When:** the user drags the slider to $2000
- **Then:** the budget value display updates to show "$2000"
- **And:** 3 build recommendation cards appear instantly (< 200ms)
- **And:** the cards show "Optimized Build", "Performance Build", and "Featured Build"
- **And:** each card displays a total price and capability description

**Acceptance Test:** `tests/bdd/features/persona-based-builder.feature:26`
**Status:** ❌ FAILING (as expected)

### Acceptance Criteria Satisfied by This Scenario:

- [ ] **Budget range:** Slider allows values from $500 to $5000
- [ ] **Budget display:** Current budget value is displayed and updates in real-time
- [ ] **Build recommendations:** 3 build cards appear instantly (< 200ms) after budget is set
- [ ] **Build variants:** Three builds show "Optimized", "Performance", and "Featured" options
- [ ] **Build data:** Each build displays total price, capability description, and component summary
- [ ] **Mock data loads:** Static build data loads successfully for all personas and budget tiers

### Required Components (TDD Tasks):

#### Task 3.1: Create mock builds data structure

- **Description:** Create mockBuilds.ts with static build data for all personas and budget tiers
- **Type:** Unit Test
- **Dependencies:** None
- **Test Strategy:** Data structure is valid, contains all personas, has budget tiers
- **Status:** Pending
- **Linked Scenario:** Scenario 3

#### Task 3.2: Make BudgetSlider interactive

- **Description:** Add onChange handler, slider input functionality
- **Type:** Unit Test
- **Dependencies:** Task 2.3
- **Test Strategy:** Slider value changes on drag, calls onChange callback
- **Status:** Pending
- **Linked Scenario:** Scenario 3

#### Task 3.3: Create BuildCard component

- **Description:** Build recommendation card showing price, capability, components
- **Type:** Unit Test
- **Dependencies:** None
- **Test Strategy:** Renders build data, shows title/price/capability
- **Status:** Pending
- **Linked Scenario:** Scenario 3

#### Task 3.4: Create BuildRecommendations component

- **Description:** Container showing 3 BuildCards based on persona and budget
- **Type:** Unit Test
- **Dependencies:** Task 3.1, Task 3.3
- **Test Strategy:** Renders 3 builds, selects correct builds from mock data
- **Status:** Pending
- **Linked Scenario:** Scenario 3

#### Task 3.5: Integrate BuildRecommendations into BuilderPage

- **Description:** Add BuildRecommendations that updates when persona/budget changes
- **Type:** Integration Test
- **Dependencies:** Task 3.4, Task 2.4, Task 3.2
- **Test Strategy:** Builds appear when persona+budget set, update instantly
- **Status:** Pending
- **Linked Scenario:** Scenario 3

### Scenario Completion Criteria:

- [ ] All tests pass
- [ ] E2E test created and passing
- [ ] **Acceptance test for Scenario 3 passes**

---

## Scenario 4: User expands build details to view components

**Given-When-Then:**

- **Given:** the user is viewing 3 build recommendation cards
- **When:** the user clicks "View Details" on the "Optimized Build" card
- **Then:** the card expands with a smooth transition (300ms)
- **And:** a component list is revealed showing CPU, GPU, RAM, Storage
- **And:** each component shows name, type, and key specs

**Acceptance Test:** `tests/bdd/features/persona-based-builder.feature:36`
**Status:** ❌ FAILING (as expected)

### Acceptance Criteria Satisfied by This Scenario:

- [ ] **Component details:** User can expand build cards to view full component list

### Required Components (TDD Tasks):

#### Task 4.1: Create ComponentList component

- **Description:** Expandable list of PC components with details
- **Type:** Unit Test
- **Dependencies:** None
- **Test Strategy:** Renders component array, shows name/type/specs
- **Status:** Pending
- **Linked Scenario:** Scenario 4

#### Task 4.2: Add expand/collapse to BuildCard

- **Description:** Add expand state, "View Details" button, transition animation
- **Type:** Unit Test
- **Dependencies:** Task 3.3, Task 4.1
- **Test Strategy:** Toggles expanded state, shows ComponentList when expanded
- **Status:** Pending
- **Linked Scenario:** Scenario 4

### Scenario Completion Criteria:

- [ ] All tests pass
- [ ] E2E test created and passing
- [ ] **Acceptance test for Scenario 4 passes**

---

## Scenario 5: User changes persona and sees updated builds

**Given-When-Then:**

- **Given:** the user has selected "Competitive Gamer" with budget $2000
- **And:** build recommendations are displayed
- **When:** the user clicks the "Creator" persona card
- **Then:** the "Competitive Gamer" card is deselected
- **And:** the "Creator" card is highlighted
- **And:** the build recommendations update instantly to show creator-optimized builds
- **And:** the capability descriptions change to reflect content creation use cases

**Acceptance Test:** `tests/bdd/features/persona-based-builder.feature:44`
**Status:** ❌ FAILING (as expected)

### Acceptance Criteria Satisfied by This Scenario:

- [ ] **Persona switching:** Changing persona updates build recommendations immediately

### Required Components (TDD Tasks):

#### Task 5.1: Test persona switching logic in BuilderPage

- **Description:** Verify changing persona updates builds correctly
- **Type:** Integration Test
- **Dependencies:** Task 2.4, Task 3.5
- **Test Strategy:** Selecting different persona updates displayed builds
- **Status:** Pending
- **Linked Scenario:** Scenario 5

### Scenario Completion Criteria:

- [ ] Integration test passes
- [ ] E2E test created and passing
- [ ] **Acceptance test for Scenario 5 passes**

---

## Scenario 6: User sets budget too low for selected persona

**Given-When-Then:**

- **Given:** the user has selected the "AI Enthusiast" persona
- **When:** the user sets the budget slider to $600
- **Then:** a yellow warning banner appears
- **And:** the warning states "This persona works best with a budget of at least $1200"
- **And:** build cards show disabled state or adjusted recommendations

**Acceptance Test:** `tests/bdd/features/persona-based-builder.feature:51`
**Status:** ❌ FAILING (as expected)

### Acceptance Criteria Satisfied by This Scenario:

- [ ] **Low budget warning:** Warning appears if budget is below persona's minimum

### Required Components (TDD Tasks):

#### Task 6.1: Create BudgetWarning component

- **Description:** Yellow warning banner for low budget scenarios
- **Type:** Unit Test
- **Dependencies:** None
- **Test Strategy:** Renders warning message, shows/hides based on prop
- **Status:** Pending
- **Linked Scenario:** Scenario 6

#### Task 6.2: Add budget validation logic

- **Description:** Define minimum budgets per persona, check budget vs minimum
- **Type:** Unit Test
- **Dependencies:** None
- **Test Strategy:** Returns true/false if budget is too low for persona
- **Status:** Pending
- **Linked Scenario:** Scenario 6

#### Task 6.3: Integrate BudgetWarning into BuilderPage

- **Description:** Show warning when budget is below persona minimum
- **Type:** Integration Test
- **Dependencies:** Task 6.1, Task 6.2
- **Test Strategy:** Warning appears/disappears based on persona and budget
- **Status:** Pending
- **Linked Scenario:** Scenario 6

### Scenario Completion Criteria:

- [ ] All tests pass
- [ ] E2E test created and passing
- [ ] **Acceptance test for Scenario 6 passes**

---

## Scenario 7: User navigates with keyboard only

**Given-When-Then:**

- **Given:** the user is on the "/build" page
- **When:** the user presses the Tab key repeatedly
- **Then:** focus moves through persona cards in logical order
- **And:** each focused element shows a visible focus ring (indigo-500)
- **When:** the user presses Enter on a focused persona card
- **Then:** the persona is selected
- **When:** the user tabs to the budget slider and uses arrow keys
- **Then:** the slider value increases/decreases accordingly

**Acceptance Test:** `tests/bdd/features/persona-based-builder.feature:58`
**Status:** ❌ FAILING (as expected)

### Acceptance Criteria Satisfied by This Scenario:

- [ ] **Keyboard Navigation:** All interactions work with keyboard only

### Required Components (TDD Tasks):

#### Task 7.1: Add keyboard support to PersonaCard

- **Description:** Handle Enter/Space key for selection, proper tabIndex
- **Type:** Unit Test
- **Dependencies:** Task 2.1
- **Test Strategy:** Enter key selects card, Tab navigates, focus ring visible
- **Status:** Pending
- **Linked Scenario:** Scenario 7

#### Task 7.2: Add keyboard support to BudgetSlider

- **Description:** Arrow keys adjust slider value
- **Type:** Unit Test
- **Dependencies:** Task 3.2
- **Test Strategy:** Left/Right or Up/Down arrows change value
- **Status:** Pending
- **Linked Scenario:** Scenario 7

### Scenario Completion Criteria:

- [ ] All tests pass
- [ ] E2E test created and passing
- [ ] **Acceptance test for Scenario 7 passes**

---

## Scenario 8: Mobile user interacts with touch

**Given-When-Then:**

- **Given:** the user is on a mobile device (viewport width < 640px)
- **And:** the user is on the "/build" page
- **When:** the user taps a persona card
- **Then:** the card is selected (no hover state)
- **When:** the user drags the budget slider with touch
- **Then:** the slider thumb responds smoothly to touch input
- **And:** the touch target is at least 44x44px

**Acceptance Test:** `tests/bdd/features/persona-based-builder.feature:68`
**Status:** ❌ FAILING (as expected)

### Acceptance Criteria Satisfied by This Scenario:

- [ ] **Responsive Design:** Works correctly on mobile, tablet, and desktop

### Required Components (TDD Tasks):

#### Task 8.1: Ensure PersonaCard touch targets are 44x44px minimum

- **Description:** Verify touch target size meets mobile requirements
- **Type:** Unit Test
- **Dependencies:** Task 2.1
- **Test Strategy:** Check element dimensions meet 44x44px minimum
- **Status:** Pending
- **Linked Scenario:** Scenario 8

#### Task 8.2: Ensure BudgetSlider touch-friendly

- **Description:** Slider thumb is large enough for touch, responds to touch events
- **Type:** Unit Test
- **Dependencies:** Task 3.2
- **Test Strategy:** Check thumb size, verify touch event handling
- **Status:** Pending
- **Linked Scenario:** Scenario 8

### Scenario Completion Criteria:

- [ ] All tests pass
- [ ] E2E test created and passing (mobile viewport)
- [ ] **Acceptance test for Scenario 8 passes**

---

## Scenario 9: Desktop user sees hover effects

**Given-When-Then:**

- **Given:** the user is on a desktop device with a mouse
- **And:** the user is viewing the persona cards
- **When:** the user moves the mouse over a persona card
- **Then:** the card scales slightly (scale-105) with 150ms transition
- **And:** the card shadow increases
- **And:** the cursor changes to pointer

**Acceptance Test:** `tests/bdd/features/persona-based-builder.feature:76`
**Status:** ❌ FAILING (as expected)

### Acceptance Criteria Satisfied by This Scenario:

- [ ] **Interactive States:** All states implemented (hover, focus, active, disabled, error, loading)

### Required Components (TDD Tasks):

#### Task 9.1: Add hover styles to PersonaCard

- **Description:** CSS hover state with scale, shadow, cursor
- **Type:** Unit Test
- **Dependencies:** Task 2.1
- **Test Strategy:** Verify hover classes are applied, styles are correct
- **Status:** Pending
- **Linked Scenario:** Scenario 9

### Scenario Completion Criteria:

- [ ] Test passes
- [ ] E2E test created and passing
- [ ] **Acceptance test for Scenario 9 passes**

---

## Scenario 10: User accesses /build directly via URL

**Given-When-Then:**

- **Given:** the user types "buildcomputer.com/build" in the browser
- **When:** the page loads
- **Then:** the builder interface is displayed
- **And:** no persona is pre-selected
- **And:** the budget slider is not visible yet
- **And:** an empty state message says "Choose your story above to see build recommendations"

**Acceptance Test:** `tests/bdd/features/persona-based-builder.feature:84`
**Status:** ❌ FAILING (as expected)

### Acceptance Criteria Satisfied by This Scenario:

- [ ] **Empty state:** Before persona selection, appropriate empty state message is shown

### Required Components (TDD Tasks):

#### Task 10.1: Add empty state to BuilderPage

- **Description:** Show message when no persona selected
- **Type:** Unit Test
- **Dependencies:** Task 1.2
- **Test Strategy:** Empty state message appears when selectedPersona is null
- **Status:** Pending
- **Linked Scenario:** Scenario 10

### Scenario Completion Criteria:

- [ ] Test passes
- [ ] E2E test created and passing
- [ ] **Acceptance test for Scenario 10 passes**

---

## Scenario 11: Responsive layout adapts to screen size

**Given-When-Then:**

- **Given:** the user is on the "/build" page
- **When:** the viewport width is less than 640px (mobile)
- **Then:** persona cards are displayed in 1 column, full width
- **And:** build cards stack vertically
- **When:** the viewport width is between 640px and 1024px (tablet)
- **Then:** persona cards are displayed in 2 columns
- **When:** the viewport width is greater than 1024px (desktop)
- **Then:** persona cards are displayed in 4 columns (2 rows of 4)
- **And:** build cards can be displayed side-by-side

**Acceptance Test:** `tests/bdd/features/persona-based-builder.feature:91`
**Status:** ❌ FAILING (as expected)

### Acceptance Criteria Satisfied by This Scenario:

- [ ] **Responsive Design:** Works correctly on mobile, tablet, and desktop

### Required Components (TDD Tasks):

#### Task 11.1: Add responsive grid to PersonaSelector

- **Description:** Tailwind responsive classes for 1/2/4 column layout
- **Type:** Unit Test
- **Dependencies:** Task 2.2
- **Test Strategy:** Verify correct grid classes at different breakpoints
- **Status:** Pending
- **Linked Scenario:** Scenario 11

#### Task 11.2: Add responsive layout to BuildRecommendations

- **Description:** Stack vertically on mobile, side-by-side on desktop
- **Type:** Unit Test
- **Dependencies:** Task 3.4
- **Test Strategy:** Verify correct layout classes at different breakpoints
- **Status:** Pending
- **Linked Scenario:** Scenario 11

### Scenario Completion Criteria:

- [ ] All tests pass
- [ ] E2E test created and passing (multiple viewports)
- [ ] **Acceptance test for Scenario 11 passes**

---

## Scenario 12: "Custom Build" persona indicates future feature

**Given-When-Then:**

- **Given:** the user is viewing the 8 persona cards
- **When:** the user looks at the "Custom Build" card
- **Then:** the card displays a "Coming Soon" badge
- **And:** clicking it shows a tooltip: "Component-by-component customization coming soon"

**Acceptance Test:** `tests/bdd/features/persona-based-builder.feature:105`
**Status:** ❌ FAILING (as expected)

### Acceptance Criteria Satisfied by This Scenario:

- [ ] **"Custom Build" badge:** Custom Build card shows "Coming Soon" badge

### Required Components (TDD Tasks):

#### Task 12.1: Add "Coming Soon" badge to PersonaCard

- **Description:** Conditional badge display for disabled/future personas
- **Type:** Unit Test
- **Dependencies:** Task 2.1
- **Test Strategy:** Badge appears when `comingSoon` prop is true
- **Status:** Pending
- **Linked Scenario:** Scenario 12

### Scenario Completion Criteria:

- [ ] Test passes
- [ ] E2E test created and passing
- [ ] **Acceptance test for Scenario 12 passes**

---

## Implementation Order

**Outside-In Approach:**

1. **Scenario 1** (Priority: High - foundation)
   - Tasks: 1.1 → 1.2 → 1.3 → 1.4
   - Rationale: Sets up routing infrastructure needed by all other scenarios
   - Creates BuilderPage foundation

2. **Scenario 2** (Priority: High - core functionality)
   - Tasks: 2.1 → 2.2 → 2.3 → 2.4 → 2.5
   - Rationale: Core persona selection and UI components
   - Depends on Scenario 1 completion

3. **Scenario 3** (Priority: High - core functionality)
   - Tasks: 3.1 → 3.2 → 3.3 → 3.4 → 3.5
   - Rationale: Build recommendations are the core value prop
   - Depends on Scenarios 1-2

4. **Scenario 4** (Priority: Medium - details view)
   - Tasks: 4.1 → 4.2
   - Rationale: Extends build cards with expand/collapse
   - Depends on Scenario 3

5. **Scenario 10** (Priority: Medium - empty state)
   - Tasks: 10.1
   - Rationale: Simple addition to BuilderPage
   - Can be done after Scenario 1

6. **Scenario 11** (Priority: Medium - responsive design)
   - Tasks: 11.1 → 11.2
   - Rationale: Makes UI work on all devices
   - Depends on Scenarios 2-3

7. **Scenario 5** (Priority: Medium - integration)
   - Tasks: 5.1
   - Rationale: Tests full integration of existing components
   - Depends on Scenarios 1-3

8. **Scenario 6** (Priority: Medium - edge case)
   - Tasks: 6.1 → 6.2 → 6.3
   - Rationale: Adds budget validation and warnings
   - Depends on Scenarios 2-3

9. **Scenario 7** (Priority: Medium - accessibility)
   - Tasks: 7.1 → 7.2
   - Rationale: Keyboard navigation for accessibility
   - Enhances existing components

10. **Scenario 8** (Priority: Medium - touch)
    - Tasks: 8.1 → 8.2
    - Rationale: Mobile touch optimization
    - Enhances existing components

11. **Scenario 9** (Priority: Low - polish)
    - Tasks: 9.1
    - Rationale: Desktop hover effects for polish
    - Simple CSS enhancement

12. **Scenario 12** (Priority: Low - future indicator)
    - Tasks: 12.1
    - Rationale: "Coming Soon" badge for Custom Build
    - Simple addition to PersonaCard

**Key Dependencies:**

- Scenarios 2-12 all depend on Scenario 1 (routing)
- Scenarios 3-6 depend on Scenario 2 (persona selection)
- Scenarios 4-5 depend on Scenario 3 (build recommendations)
- Scenarios 7-9, 11-12 can be done in parallel after core functionality

---

## Progress Tracking

### Overall Progress:

- **Scenarios:** 0/12 complete
- **TDD Tasks:** 0/39 complete
- **Acceptance Tests Passing:** 0/12

### Scenario Status:

- ⏳ Scenario 1: Not started (acceptance test FAILING)
- ⏳ Scenario 2: Not started (acceptance test FAILING)
- ⏳ Scenario 3: Not started (acceptance test FAILING)
- ⏳ Scenario 4: Not started (acceptance test FAILING)
- ⏳ Scenario 5: Not started (acceptance test FAILING)
- ⏳ Scenario 6: Not started (acceptance test FAILING)
- ⏳ Scenario 7: Not started (acceptance test FAILING)
- ⏳ Scenario 8: Not started (acceptance test FAILING)
- ⏳ Scenario 9: Not started (acceptance test FAILING)
- ⏳ Scenario 10: Not started (acceptance test FAILING)
- ⏳ Scenario 11: Not started (acceptance test FAILING)
- ⏳ Scenario 12: Not started (acceptance test FAILING)

---

## Notes

### Outside-In Workflow:

For each scenario:

1. Run acceptance test → FAILS (outer RED ❌)
2. Implement component tasks via /tdd (inner RED-GREEN cycles)
3. Re-run acceptance test → PASSES (outer GREEN ✓)
4. Mark scenario complete
5. Move to next scenario

### Implementation Strategy:

- Start with routing and page structure (Scenario 1)
- Build core UI components (Scenarios 2-3)
- Add details and polish (Scenarios 4, 6, 9, 12)
- Ensure responsiveness and accessibility (Scenarios 7-8, 11)
- Validate integrations (Scenario 5, 10)
