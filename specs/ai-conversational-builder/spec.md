# Specification: AI Conversational Builder

**Issue ID:** FEAT-003
**GitHub Issue:** #3
**Status:** Approved
**Created:** 2025-10-22
**Phase:** 3 - Implementation (In Progress)

## Overview

Transform BuildComputer from a static persona-based interface into an AI-driven conversational experience that educates users while guiding them through the PC building process in a natural, smooth, and dynamic way.

### Purpose

Enable users to build custom PCs through an AI-powered conversational interface that:

- Provides educational content about components
- Explains recommendations with reasoning
- Offers real-time compatibility guidance
- Supports both quick persona selection and detailed AI conversation
- Creates an accessible, modern, and smooth user experience

### Stakeholders

- **End Users:** People building PCs who want guidance and education
- **Existing Users:** Current persona-based workflow users (preserve their experience)
- **Future:** Integration with real product APIs and pricing data

---

## Functional Requirements

### Core Functionality

1. **Hybrid Interaction Model**
   - Preserve existing persona selection workflow
   - Add AI conversational mode as alternative entry point
   - Allow users to switch between modes seamlessly
   - Both modes lead to same outcome: 3 build recommendations

2. **Conversational Flow**
   - 6-10 message conversation to gather requirements
   - Quick-reply chips for common answers
   - Free-form text input for specific needs
   - Typing indicators and smooth animations
   - Context-aware responses from mock AI service

3. **Educational Features**
   - Component explanations via tooltips/popovers
   - "Why this choice?" reasoning for each component
   - Real-time guidance (compatibility, budget optimization)
   - Educational tooltips on technical terms
   - Progressive disclosure (basic → advanced)

4. **Enhanced Product Database**
   - Extend Component interface with AI context
   - Add: description, performance_tier, use_cases, pros, cons, compatibility_notes, alternatives
   - Ready for future API integration

5. **Responsive UI/UX**
   - Desktop: Side-by-side layout (chat 40% | build preview 60%)
   - Mobile: Full-screen chat → transition to build view
   - Smooth 60fps animations
   - WCAG 2.1 AA compliant

### User Interactions

- Click "Talk to AI Builder" button to start conversation
- Select quick-reply chips or type free-form responses
- Hover over components for educational tooltips
- Click "Why this choice?" to see reasoning
- Switch between AI mode and persona mode anytime
- View real-time build updates during conversation

---

## BDD Scenarios

### Group 1: Hybrid Interaction Model (5 scenarios)

#### Scenario 1: User starts with AI chat mode

**Given** user is on the builder page
**When** user clicks "Talk to AI Builder" button
**Then** chat interface should open with greeting message
**And** AI should ask first question about use case
**And** quick-reply chips should be visible

#### Scenario 2: User starts with persona selection (existing flow)

**Given** user is on the builder page
**When** user clicks a persona card
**Then** budget slider should appear
**And** build recommendations should generate
**And** "Talk to AI Builder" option should still be available

#### Scenario 3: User switches from persona to AI mode

**Given** user has selected a persona and sees build recommendations
**When** user clicks "Refine with AI" button
**Then** chat interface should open
**And** AI should acknowledge current selection
**And** AI should ask how to refine the build

#### Scenario 4: User switches from AI mode to persona selection

**Given** user is in the middle of AI conversation
**When** user clicks "Quick Select Persona" button
**Then** persona cards should be displayed
**And** conversation progress should be saved
**And** user can return to conversation if needed

#### Scenario 5: AI suggests persona during conversation

**Given** user is conversing with AI about requirements
**When** AI determines user matches "Competitive Gamer" persona
**Then** AI should suggest "You sound like a competitive gamer! Want to see optimized builds?"
**And** provide quick-reply chip to accept suggestion
**And** provide option to continue custom conversation

---

### Group 2: Conversational Flow with Quick-Reply Chips (6 scenarios)

#### Scenario 6: Complete conversation using only quick-reply chips

**Given** user starts AI conversation
**When** user selects quick-reply chips for all questions
**Then** conversation should complete in 6-10 messages
**And** AI should gather: use case, specific needs, budget range
**And** build recommendations should be generated
**And** conversation should feel natural and friendly

#### Scenario 7: Mixed input - chips and text

**Given** user is in AI conversation
**When** user selects a chip for question 1
**And** types free-form text for question 2
**And** selects chip for question 3
**Then** AI should handle both input types seamlessly
**And** responses should acknowledge user's specific text input
**And** conversation flow should remain coherent

#### Scenario 8: Text-only conversation

**Given** user starts AI conversation
**When** user types free-form responses to all questions
**Then** AI should parse responses intelligently
**And** extract use case, budget, and preferences
**And** ask clarifying questions when needed
**And** complete conversation in 6-10 messages

#### Scenario 9: AI remembers context from previous messages

**Given** user mentions "I play Valorant competitively" in message 2
**When** AI asks about graphics needs in message 4
**Then** AI should reference Valorant context
**And** response should be like "For Valorant, you'll want high FPS. What's your target?"
**And** build recommendations should prioritize high refresh rate

#### Scenario 10: User can restart conversation

**Given** user is halfway through AI conversation
**When** user clicks "Start Over" button
**Then** conversation should reset
**And** chat history should clear
**And** AI should greet user again
**And** build preview should reset to empty state

#### Scenario 11: Conversation saves state on navigation

**Given** user is in the middle of AI conversation (message 4 of 8)
**When** user navigates to home page
**And** returns to builder page
**Then** conversation should resume from message 4
**And** AI context should be preserved
**And** build preview should show current state

---

### Group 3: Educational Features (6 scenarios)

#### Scenario 12: Component explanation tooltip on hover

**Given** user sees build recommendations
**When** user hovers over "GPU" component name
**Then** tooltip should appear within 100ms
**And** show simple explanation: "Graphics card that renders images and games"
**And** tooltip should be WCAG 2.1 AA compliant

#### Scenario 13: Detailed component explanation on click

**Given** user sees build recommendation with RTX 4070
**When** user clicks "Learn More" on GPU component
**Then** popover should open with detailed explanation
**And** show: description, when to choose this GPU, performance tier
**And** popover should be dismissable and accessible

#### Scenario 14: "Why this choice?" shows reasoning

**Given** user sees build recommendation
**When** user clicks "Why this choice?" button on CPU component
**Then** AI reasoning should display
**And** explain: "I chose Ryzen 7 7800X3D because you need high FPS for competitive gaming"
**And** show performance impact and alternatives
**And** reasoning should reference user's stated needs

#### Scenario 15: Educational tooltip on technical term

**Given** user sees component specs with "PCIe 4.0"
**When** user hovers over "PCIe 4.0" term
**Then** educational tooltip should appear
**And** show simple definition: "PCIe 4.0 = Latest motherboard slot standard for fast data transfer"
**And** provide "Learn more" link for deeper explanation

#### Scenario 16: Progressive disclosure - basic to advanced

**Given** user views component explanation
**When** user clicks "Show advanced details"
**Then** additional technical specs should expand
**And** show: clock speeds, TDP, architecture details
**And** maintain readability with proper formatting

#### Scenario 17: Real-time compatibility guidance

**Given** user is building a PC via conversation
**When** AI adds RTX 4090 to build with 550W PSU
**Then** AI should show warning: "This GPU needs at least 850W PSU"
**And** suggest PSU upgrade options
**And** warning should be visually distinct (icon + color)

---

### Group 4: UI Layouts - Responsive (4 scenarios)

#### Scenario 18: Desktop side-by-side layout

**Given** user is on desktop viewport (≥1024px width)
**When** user starts AI conversation
**Then** chat panel should occupy left 40% of screen
**And** build preview should occupy right 60%
**And** both panels should be visible simultaneously
**And** build preview should update in real-time as conversation progresses

#### Scenario 19: Mobile full-screen chat

**Given** user is on mobile viewport (<768px width)
**When** user starts AI conversation
**Then** chat should fill entire screen
**And** build preview should be hidden
**And** navigation should show "View Build" button
**And** chat input should be fixed at bottom

#### Scenario 20: Mobile transition to build view

**Given** user completes AI conversation on mobile
**When** AI shows build recommendations
**Then** screen should smoothly transition to build view
**And** chat should minimize to bottom drawer
**And** user can tap drawer to expand chat again
**And** transition should be 60fps smooth

#### Scenario 21: Tablet responsive layout

**Given** user is on tablet viewport (768px-1023px width)
**When** user starts AI conversation
**Then** layout should stack vertically: chat on top, build preview below
**And** both sections should be scrollable
**And** user can collapse chat to see more of build preview

---

### Group 5: Error Handling & Edge Cases (3 scenarios)

#### Scenario 22: Unclear input triggers clarification

**Given** user is in AI conversation
**When** user types vague response: "something good"
**Then** AI should ask for clarification
**And** show helpful examples: "Are you looking for gaming, work, or content creation?"
**And** provide quick-reply chips with options

#### Scenario 23: Budget validation and guidance

**Given** user specifies budget of "$200" in conversation
**When** AI processes the budget
**Then** AI should explain: "For a complete build, $200 is below minimum. Consider starting at $500 for basic builds."
**And** ask if user wants to adjust budget
**And** provide chip options: [$500] [$750] [$1000] [Custom]

#### Scenario 24: Network error handling (for future API)

**Given** user is in AI conversation
**When** mock AI service simulates error
**Then** error message should display: "Oops! Something went wrong. Let's try that again."
**And** user should see "Retry" button
**And** conversation context should be preserved
**And** previous messages should remain visible

---

### Group 6: Accessibility & Performance (3 scenarios)

#### Scenario 25: Keyboard navigation in chat

**Given** user navigates with keyboard only
**When** user tabs through chat interface
**Then** focus should move through: quick-reply chips, text input, send button
**And** Enter key should select focused chip
**And** Escape key should close popovers/tooltips
**And** focus indicators should be clearly visible (WCAG 2.1 AA)

#### Scenario 26: Screen reader announcements

**Given** screen reader user is in AI conversation
**When** AI sends new message
**Then** message should be announced via aria-live region
**And** announcement should include: "AI says: [message text]"
**And** typing indicator should announce: "AI is typing"
**And** all interactive elements should have proper labels

#### Scenario 27: Smooth animations and performance

**Given** user is interacting with AI chat
**When** AI typing indicator appears
**Then** animation should run at 60fps
**And** message transitions should be smooth (no jank)
**And** educational tooltips should appear within 100ms
**And** quick-reply chip hover states should be instant (<16ms)

---

## Acceptance Criteria

### Functional Requirements

- [ ] User can start AI conversation from builder page
- [ ] User can complete PC build using only AI conversation (no persona selection)
- [ ] User can start with persona and refine with AI
- [ ] User can switch between AI mode and persona mode seamlessly
- [ ] AI conversation completes in 6-10 messages for typical flow
- [ ] Quick-reply chips provided for all common questions
- [ ] Free-form text input accepted and parsed correctly
- [ ] AI remembers context throughout conversation
- [ ] Component explanations available via hover tooltips
- [ ] "Why this choice?" reasoning shown for each component
- [ ] Real-time compatibility warnings displayed
- [ ] Educational tooltips on all technical terms
- [ ] Progressive disclosure (basic → advanced) implemented
- [ ] Conversation state saved if user navigates away
- [ ] User can restart conversation anytime

### UI/UX Requirements

- [ ] Desktop: Side-by-side layout (chat 40% | build 60%)
- [ ] Mobile: Full-screen chat → transition to build view
- [ ] Tablet: Vertical stack with collapsible sections
- [ ] Typing indicators animate smoothly
- [ ] All transitions run at 60fps (no jank)
- [ ] Educational tooltips appear within 100ms
- [ ] AI tone is friendly and casual throughout
- [ ] Build preview updates in real-time during conversation

### Data & Integration Requirements

- [ ] Component interface extended with AI context fields
- [ ] All components have: description, performance_tier, use_cases
- [ ] All components have: pros, cons, compatibility_notes, alternatives
- [ ] Mock AI service provides deterministic responses
- [ ] Mock AI service handles conversation flow logically
- [ ] Database structure ready for future API integration

### Accessibility Requirements (WCAG 2.1 AA)

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators clearly visible
- [ ] Screen reader announcements for AI messages
- [ ] aria-live regions for dynamic content
- [ ] All buttons/chips have proper labels
- [ ] Color contrast ratios meet AA standards
- [ ] Tooltips dismissable with Escape key

### Quality Criteria

- [ ] All existing 12 BDD scenarios still pass (100%)
- [ ] 27 new BDD scenarios for AI features (all pass)
- [ ] Test coverage ≥ 80% maintained
- [ ] TypeScript strict mode with no errors
- [ ] ESLint passes with no warnings
- [ ] No console errors in browser
- [ ] Performance: No layout shifts (CLS = 0)

### Error Handling

- [ ] Unclear input triggers clarification request
- [ ] Invalid budget shows validation message with guidance
- [ ] Empty input shows helpful prompt
- [ ] Network errors (future) show retry option
- [ ] Error messages are user-friendly and actionable

---

## Non-Functional Requirements

### Performance

- **Animation**: All animations must run at 60fps (16.67ms frame time)
- **Tooltip Response**: Educational tooltips appear within 100ms of hover
- **Conversation Flow**: No blocking operations during chat interaction
- **Build Preview Updates**: Real-time updates (<200ms latency)
- **Page Load**: Initial page load under 2 seconds on 3G connection

### Security

- **Input Sanitization**: All user text input sanitized before display (XSS prevention)
- **Mock AI Responses**: No sensitive data in mock responses
- **Future API Ready**: Structure supports secure API integration

### Usability

- **Mobile-First**: Touch targets minimum 44x44px
- **Responsive**: Breakpoints at 768px (mobile/tablet) and 1024px (tablet/desktop)
- **Feedback**: Immediate visual feedback for all interactions
- **Error Recovery**: Users can easily recover from errors
- **Learnability**: Interface intuitive without documentation

### Accessibility

- **WCAG 2.1 AA**: Full compliance across all features
- **Keyboard Navigation**: Complete functionality via keyboard
- **Screen Readers**: Full screen reader support (tested with NVDA/JAWS)
- **Focus Management**: Logical focus order, visible indicators
- **Alternative Text**: All images and icons have alt text

### Maintainability

- **Type Safety**: Full TypeScript coverage with strict mode
- **Component Reusability**: Chat components reusable for future features
- **Test Coverage**: ≥80% coverage maintained
- **Documentation**: Inline comments for complex logic
- **Code Quality**: ESLint + Prettier enforced

---

## Technical Constraints

### Technology Stack

- React 18 + TypeScript (strict mode)
- Tailwind CSS for styling
- Vitest + Playwright + QuickPickle for testing
- Vite build system
- pnpm package manager

### Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile: iOS Safari, Chrome Android

### Dependencies

- No new external dependencies for mock AI (use existing stack)
- Future: Real AI API will be separate service integration

---

## Assumptions

1. **Mock AI Service**: Phase 1 uses deterministic scripted responses (no real LLM)
2. **Product Database**: Enhanced mock data (real API integration in Phase 2)
3. **Conversation State**: Stored in React state (no backend persistence yet)
4. **User Authentication**: Not required for Phase 1 (future feature)
5. **Multi-language**: English only for Phase 1
6. **Existing Features**: All 12 existing BDD scenarios must continue passing

---

## Dependencies

### Internal

- Existing persona system (must remain functional)
- Existing component database (extend, don't replace)
- Existing build recommendation logic (reuse where possible)

### External

- None for Phase 1 (fully self-contained)
- Future: Real AI API (OpenAI/Claude/other)
- Future: Product pricing APIs from online stores

---

## Open Questions

- [ ] Should conversation history persist across browser sessions (localStorage)?
- [ ] Should we add "export conversation" feature for user reference?
- [ ] How many quick-reply chip options per question (2-4)?
- [ ] Should AI proactively suggest upgrades during conversation?

---

## Approval

- **Created by:** Claude (AI Assistant)
- **Date:** 2025-10-22
- **Status:** Approved ✅
- **Approved by:** User
- **Approval Date:** 2025-10-22
- **Next Phase:** Technical Design (Phase 3)

---

## Change Log

| Date       | Change                        | Author |
| ---------- | ----------------------------- | ------ |
| 2025-10-22 | Initial specification created | Claude |
| TBD        | User approval                 | User   |
| TBD        | Status updated to "Approved"  | Claude |
