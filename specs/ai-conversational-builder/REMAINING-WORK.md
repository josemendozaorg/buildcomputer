# Remaining Work: AI Conversational Builder

## Current Status

- **Tests Passing**: 43/57 (75%)
- **Tests Failing**: 14/57 (25%)
  - AI Builder Tests: 10 failing
  - Landing Page Tests: 4 failing (unrelated)

## Progress Summary

Significant progress made through PR #14 and PR #15:

- Started: 15/57 passing (26%)
- Current: 43/57 passing (75%)
- **Improvement: +28 tests (+49 percentage points)**

## Remaining AI Builder Scenarios (10 tests)

### 1. Context Awareness (1 test)

**Scenario**: AI remembers context from previous messages
**File**: `tests/bdd/features/ai-conversational-builder.feature` (lines 82-93)
**Status**: ❌ Failing at step: "AI asks about graphics needs in message 4"

**Root Cause**:

- mockAIService doesn't maintain conversation history context
- No contextual question generation based on previous messages
- Missing logic to reference earlier mentions (e.g., "Valorant competitively" → graphics question)

**Required Changes**:

1. **src/services/mockAIService.ts**:
   - Add conversation history tracking
   - Implement contextual question generation
   - Add logic to detect keywords from previous messages
   - Generate follow-up questions based on detected context

2. **src/services/conversationService.ts**:
   - Pass full conversation history to mockAIService
   - Maintain context state between questions

**Implementation Estimate**: 2-3 hours

### 2. State Persistence (1 test)

**Scenario**: Conversation saves state on navigation
**File**: `tests/bdd/features/ai-conversational-builder.feature` (lines 99-114)
**Status**: ❌ Failing at step: "conversation state is preserved"

**Root Cause**:

- No localStorage/sessionStorage implementation for conversation state
- BuilderPage doesn't persist messages on navigation
- No restoration logic when returning to /build

**Required Changes**:

1. **src/pages/BuilderPage.tsx**:
   - Add useEffect to save conversation state to localStorage
   - Add useEffect to restore state on mount
   - Save: messages, personaSuggestion, selectedPersona, budget

2. **src/services/conversationService.ts**:
   - Add saveState() method
   - Add restoreState() method
   - Handle serialization/deserialization

**Implementation Estimate**: 1-2 hours

### 3. Mode Switching - Persona Cards Not Rendering (1 test)

**Scenario**: User switches from AI mode to persona selection
**File**: `tests/bdd/features/ai-conversational-builder.feature` (lines 40-45)
**Status**: ❌ Failing at step: "persona cards should be displayed"

**Root Cause**:

- handleQuickSelectPersona closes chat but persona cards don't render
- Possible React re-render issue or timing problem
- PersonaSelector component not visible after setShowAIChat(false)

**Required Changes**:

1. **src/pages/BuilderPage.tsx**:
   - Debug why PersonaSelector isn't rendered when showAIChat=false
   - Add console logging to verify render path
   - Ensure PersonaSelector is in the DOM when chat closes

2. **tests/bdd/steps/ai-conversational-builder.steps.ts**:
   - Add longer wait for DOM updates (currently 1000ms)
   - Try waitForLoadState('networkidle') or wait for specific selector

**Implementation Estimate**: 1 hour (debugging required)

### 4. Tablet Responsive Layout (1 test)

**Scenario**: Tablet responsive layout (768px-1023px)
**File**: `tests/bdd/features/ai-conversational-builder.feature` (lines 190-196)
**Status**: ❌ Failing at step: "layout should stack vertically"

**Root Cause**:

- No tablet-specific responsive layout implemented
- Currently only desktop (side-by-side) and mobile (drawer) layouts exist
- Missing CSS breakpoint for tablet viewport

**Required Changes**:

1. **src/components/ChatInterface.tsx** or **BuilderPage.tsx**:
   - Add tablet breakpoint detection (768-1023px)
   - Implement vertical stacking layout for tablet
   - Use Tailwind's md: breakpoint

2. **src/hooks/useResponsive.ts** (if exists, or create):
   - Add tablet detection hook
   - Return `{ isMobile, isTablet, isDesktop }`

**Implementation Estimate**: 2-3 hours

###5. Desktop Responsive Layout (1 test)
**Scenario**: Desktop side-by-side layout (≥1024px)
**File**: `tests/bdd/features/responsive-layouts.feature` (scenario 18)
**Status**: ❌ Likely failing due to missing desktop layout

**Root Cause**:

- No desktop side-by-side layout (40% chat | 60% build preview)
- Current implementation uses fullscreen chat overlay

**Required Changes**:

1. **src/pages/BuilderPage.responsive.tsx** or **BuilderPage.tsx**:
   - Detect desktop viewport (≥1024px)
   - Render side-by-side layout instead of fullscreen overlay
   - Chat panel: 40% width, left side
   - Build panel: 60% width, right side

**Implementation Estimate**: 3-4 hours

### 6-7. Accessibility Features (2 tests)

#### 6. Keyboard Navigation

**Scenario**: Keyboard navigation in chat
**File**: `tests/bdd/features/ai-conversational-builder.feature` (lines 223-231)
**Status**: ❌ Failing at step: "user can navigate with Tab and Enter keys"

**Root Cause**:

- Missing keyboard event handlers for chat interaction
- No Tab key navigation through quick-reply chips
- No Enter key submission for input field

**Required Changes**:

1. **src/components/ChatInterface.tsx**:
   - Add onKeyDown handlers for Tab navigation
   - Add Enter key handler for message input
   - Implement focus management for chip navigation
   - Add aria-live regions for screen reader announcements

**Implementation Estimate**: 2 hours

#### 7. Screen Reader Announcements

**Scenario**: Screen reader announcements
**File**: `tests/bdd/features/ai-conversational-builder.feature` (lines 234-240)
**Status**: ❌ Failing at step: "new messages are announced to screen readers"

**Root Cause**:

- Missing aria-live regions for dynamic content
- No announcements when new AI messages appear
- Missing aria-labels for interactive elements

**Required Changes**:

1. **src/components/ChatInterface.tsx**:
   - Add aria-live="polite" region for new messages
   - Add aria-atomic="true" for message updates
   - Add aria-labels to all buttons and inputs
   - Test with actual screen reader (NVDA, JAWS, VoiceOver)

**Implementation Estimate**: 2 hours

### 8. Real-time Compatibility Guidance (1 test)

**Scenario**: Real-time compatibility guidance
**File**: `tests/bdd/features/ai-conversational-builder.feature` (lines 153-178)
**Status**: ❌ Failing early (step not implemented)

**Root Cause**:

- Feature not implemented at all
- Requires real-time validation of component compatibility
- Needs warning messages for incompatible selections

**Required Changes**:

1. **src/services/compatibilityService.ts** (create new):
   - Add compatibility rules (CPU + Motherboard socket, PSU wattage, etc.)
   - Validate component combinations
   - Generate warning messages

2. **src/components/ChatMessage.tsx**:
   - Already has isWarning support ✓
   - Add compatibility warning rendering

3. **src/services/mockAIService.ts**:
   - Integrate compatibility checks into AI responses
   - Return warnings with specific suggestions

**Implementation Estimate**: 4-5 hours

### 9. Budget Validation and Guidance (1 test)

**Scenario**: Budget validation and guidance
**File**: `tests/bdd/features/ai-conversational-builder.feature` (lines 206-213)
**Status**: ❌ Failing at step: "AI should provide budget guidance"

**Root Cause**:

- No budget validation in mockAIService
- Missing logic to detect unrealistic budgets
- No guidance messages for budget adjustments

**Required Changes**:

1. **src/services/mockAIService.ts**:
   - Add budget range validation ($500-$5000 reasonable range)
   - Detect too-low budgets (< $500) → suggest minimum
   - Detect too-high budgets (> $5000) → suggest alternatives
   - Return guidance messages with isWarning flag

2. **tests/bdd/steps/ai-conversational-builder.steps.ts**:
   - Implement step: "user mentions unrealistic budget"
   - Implement step: "AI should provide budget guidance"

**Implementation Estimate**: 1-2 hours

### 10. Network Error Handling (1 test)

**Scenario**: Network error handling (for future API)
**File**: `tests/bdd/features/ai-conversational-builder.feature` (lines 214-222)
**Status**: ❌ Failing at step: "should show retry button"

**Root Cause**:

- mockAIService has error simulation but UI doesn't handle it
- No retry button in ChatMessage for errors
- Missing error recovery UX

**Required Changes**:

1. **src/components/ChatMessage.tsx**:
   - Add retry button for retryable errors
   - Add attemptCount display (currently props exist but not used)
   - Implement retry callback

2. **src/components/ChatInterface.tsx**:
   - Implement retry logic (resend last message)
   - Handle retry button clicks
   - Update attemptCount on retry

3. **src/services/mockAIService.ts**:
   - Ensure error simulation works correctly
   - Add retryable flag to errors

**Implementation Estimate**: 2-3 hours

## Unrelated Landing Page Tests (4 tests)

These are NOT part of the AI Conversational Builder feature but are failing in the test suite:

1. **Project Initialization and Development Server Startup** - Parameter missing (env variable issue)
2. **Hot Module Replacement Works During Development** - ReferenceError: ms is not defined
3. **Desktop User Views Landing Page** - ReferenceError: width/height not defined
4. **Mobile User Views Landing Page** - ReferenceError: width/height not defined

**These should be fixed in a separate PR** focused on the landing page feature.

## Total Remaining Effort Estimate

- **Context Awareness**: 2-3 hours
- **State Persistence**: 1-2 hours
- **Mode Switching Debug**: 1 hour
- **Responsive Layouts (Tablet + Desktop)**: 5-7 hours
- **Accessibility (Keyboard + Screen Reader)**: 4 hours
- **Real-time Compatibility**: 4-5 hours
- **Budget Validation**: 1-2 hours
- **Network Error Handling**: 2-3 hours

**Total**: 20-27 hours of implementation work remaining

## Recommended Approach

1. **Phase 1 (Quick Wins)**: State Persistence, Budget Validation, Network Errors (4-7 hours)
2. **Phase 2 (Core Features)**: Context Awareness, Mode Switching Debug (3-4 hours)
3. **Phase 3 (UX Polish)**: Responsive Layouts, Accessibility (9-11 hours)
4. **Phase 4 (Advanced)**: Real-time Compatibility (4-5 hours)

## Success Criteria

- ✅ 53/53 AI builder tests passing (100%)
- ✅ All 10 remaining scenarios implemented
- ✅ Full accessibility support (WCAG 2.1 AA)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Production-ready AI conversational interface

## Next Steps

1. Prioritize by business value and complexity
2. Implement Phase 1 quick wins first
3. User testing and feedback after each phase
4. Final integration testing with all 53 scenarios

---

_Generated: 2025-10-29_
_Status: Ready for Phase 1 implementation_
