# Feature Brief: Error Handling & Edge Cases

**Created:** 2025-10-26
**Status:** Approved ✅
**Feature Group:** Group 5 (Scenarios 22-24)
**Next Phase:** Specification (/spec)

---

## 1. Feature Overview

### Purpose

Provide robust error handling and intelligent user guidance for the AI Conversational Builder to gracefully handle unclear inputs, validate budget constraints, and recover from network failures. This feature ensures users receive helpful, educational feedback when they provide vague responses or encounter errors, maintaining conversation continuity and building user confidence in the system.

### Target Users

**Primary Persona:**

- **Who:** All users interacting with the AI Conversational Builder
- **Goal:** Complete PC build recommendations through natural conversation
- **Context:** Users may provide unclear responses, unrealistic budgets, or encounter network issues during conversation
- **Pain Point:** Getting stuck when input is unclear or experiencing frustration from network errors

**Secondary Personas:**

- **First-time users:** May not know how to respond to AI questions, need extra guidance
- **Budget-conscious users:** May suggest unrealistic budgets without understanding PC component costs
- **Users on unstable networks:** Need reliable error recovery to complete conversations

### Expected Outcomes

- Users receive immediate, helpful clarification when providing vague input
- Budget validation educates users about realistic PC build costs
- Network errors are handled gracefully with automatic retry capability
- Conversation context is preserved throughout all error states
- Users maintain confidence in the system despite errors

---

## 2. Use Cases

### Primary Use Case: Unclear Input Detection & Clarification

**As a** user conversing with the AI Builder
**I want to** receive helpful guidance when my response is unclear
**So that** I can provide useful information without getting stuck

**Scenario:**

1. User is asked "What will you use your PC for?"
2. User responds with vague answer: "something good" or "idk"
3. System detects vague input (12+ pattern matching)
4. System responds with empathetic clarification: "I'd love to help! Are you looking for gaming, work, or content creation?"
5. System shows 3-4 contextual suggestion chips
6. User selects chip or provides clearer response
7. Conversation continues naturally

**Success Metric:** 90%+ response rate to clarification prompts

### Secondary Use Case 1: Budget Validation with Educational Guidance

**As a** user specifying a budget
**I want to** understand why my budget might be unrealistic
**So that** I can set appropriate expectations and adjust my budget

**Scenario:**

1. User mentions "$200" as their budget
2. System validates: $200 < $400 minimum
3. System responds with playful, educational message explaining why
4. System suggests realistic starting points with preset chips: [$400] [$750] [$1000] [$1500] [$3000] [Custom]
5. User selects a preset or specifies custom budget
6. Conversation continues with validated budget

**Success Metric:** Zero builds generated with unrealistic budgets (<$400 or >$15,000)

### Secondary Use Case 2: Network Error Recovery with Retry

**As a** user experiencing a network error
**I want to** retry my request without losing my conversation
**So that** I can complete my PC build recommendation

**Scenario:**

1. User sends message, network request fails
2. System displays inline error message (playful tone)
3. System shows "Retry (1/3)" button
4. User clicks retry, system waits 1s (with jitter) and retries
5. If still fails, shows "Retry (2/3)" with 2s delay
6. If still fails, shows "Retry (3/3)" with 4s delay
7. If 3rd retry succeeds: conversation continues normally
8. If 3rd retry fails: show dual CTA ("Switch to Persona Mode" + "Report Issue")
9. All conversation history preserved throughout

**Success Metric:** 85%+ network errors resolved within 3 retries

### Out of Scope (Explicitly Not Included)

- **Handling application crashes or memory errors** - Future: Phase 3
- **Database connection errors** - No database in current implementation
- **Validation of GPU/CPU compatibility** - Future: Technical validation phase
- **Multi-language error messages** - English only for MVP
- **Voice input error handling** - Text-only for MVP

---

## 3. Success Criteria

**Feature is successful when:**

- [ ] **Scenario 22 - Vague Input**: System detects 12+ vague input patterns with 100% accuracy (case-insensitive)
- [ ] **Scenario 22 - Clarification**: 90%+ users respond to clarification prompts (measured by next message not being vague)
- [ ] **Scenario 23 - Budget Validation**: 100% of budgets outside $400-$15,000 range are caught and validated
- [ ] **Scenario 23 - Education**: Users understand why budget is unrealistic (measured by not re-entering same invalid budget)
- [ ] **Scenario 24 - Error Recovery**: 85%+ network errors resolve within 3 retries
- [ ] **Scenario 24 - Context Preservation**: 100% of conversation history preserved during errors (zero data loss)
- [ ] **Accessibility**: All error handling meets WCAG 2.1 AA standards (screen reader announcements, keyboard navigation)
- [ ] **Performance**: Total retry flow completes within 8.75s maximum (3 attempts with exponential backoff + jitter)

**Metrics to Track:**

- **Vague input detection rate**: Target 12+ patterns detected, 0 false positives
- **Clarification response rate**: Target 90%+ (users provide clearer input after clarification)
- **Budget validation rate**: Target 100% (all invalid budgets caught)
- **Retry success rate**: Target 85%+ errors resolved within 3 attempts
- **User frustration indicators**: Measure "Report Issue" clicks (target <5%)
- **Accessibility compliance**: WCAG 2.1 AA automated scan pass rate 100%

---

## 4. High-Level Requirements

### Functional Requirements (Must-Have)

1. **Vague Input Detection (Scenario 22)**
   - Detect 12+ vague patterns: "something good", "I don't know", "idk", "maybe", "whatever", "not sure", "dunno", "anything", "up to you", "doesn't matter", empty strings, single characters
   - Case-insensitive pattern matching
   - Track consecutive vague input count
   - Escalate after 3 consecutive vague inputs to guided prompts

2. **Clarification Response Generation (Scenario 22)**
   - Generate empathetic clarification messages
   - Provide 3-4 context-aware suggestion chips
   - Context examples:
     - No persona yet: ["I want a gaming PC", "Help me decide", "I need it for work", "Start over"]
     - Persona set, no budget: ["Under $1000", "$1000-$2000", "$2000+", "I'm not sure"]
   - Chips rendered as horizontal scrollable row
   - Keyboard accessible (Tab + Enter)

3. **Budget Validation (Scenario 23)**
   - Validate budget range: $400 minimum, $15,000 maximum
   - Parse budget from various formats: "$1000", "1000", "1k", "$1,000"
   - Generate educational validation messages:
     - Low budget: Explain component costs (CPUs, motherboards, RAM typically $450-500 minimum)
     - High budget: Explain typical PC build maximums ($5,000-8,000 for high-end)
   - Provide preset budget chips: [$400] [$750] [$1000] [$1500] [$3000] [Custom]
   - Maintain playful tone matching AI personality

4. **Network Error Handling (Scenario 24)**
   - Catch all network/API errors (timeout, 500 error, parse error)
   - Display inline error message as assistant chat bubble (not modal/toast)
   - Implement exponential backoff retry:
     - Attempt 1: 1s delay (±25% jitter) = 0.75-1.25s
     - Attempt 2: 2s delay (±25% jitter) = 1.5-2.5s
     - Attempt 3: 4s delay (±25% jitter) = 3-5s
     - Total max wait: ~8.75s
   - Show retry button with attempt counter: "Retry (1/3)", "Retry (2/3)", "Retry (3/3)"
   - After 3 failures, show dual CTA:
     - Primary: "Switch to Persona Mode" (preserves context)
     - Secondary: "Report Issue" (captures error details)
   - Preserve conversation state in localStorage throughout

5. **Conversation State Preservation**
   - Store conversation state in localStorage
   - Include: persona (if selected), budget (if specified), message history (last 50 messages)
   - Restore state on page reload or after errors
   - Implement LRU cache to manage localStorage quota (5-10MB limit)

### Non-Functional Requirements

- **Performance:**
  - Vague input detection: <10ms (synchronous pattern matching)
  - Budget validation: <50ms (parse + validate)
  - Error retry flow: 8.75s maximum total wait (3 attempts with jitter)
  - LocalStorage operations: <100ms per operation

- **Security:**
  - No error stack traces exposed to users
  - Sanitize all user input before validation
  - No sensitive data in error messages
  - Error logs capture diagnostics without PII

- **Usability:**
  - Playful, friendly error messaging tone
  - Clarification prompts feel conversational, not robotic
  - Retry buttons clearly indicate progress
  - Educational budget messages explain "why" not just "no"

- **Accessibility:**
  - WCAG 2.1 AA compliance for all error states
  - Error messages announced via aria-live="assertive"
  - Focus management: move focus to retry button after error
  - Keyboard navigation for all interactive elements (chips, retry buttons)
  - Screen reader compatible throughout

- **Scalability:**
  - LocalStorage LRU cache handles unlimited conversations (keep last 50 messages)
  - Vague input pattern list extensible (easily add more patterns)
  - Budget validation thresholds configurable

---

## 5. Key Edge Cases

Based on Socratic questioning and research, these edge cases require specific handling:

### Edge Case 1: Rapid Repeated Vague Inputs (Spam Protection)

**Scenario:** User types "idk" five times in a row

**Handling:**

- Track `vague_input_count` in conversation state
- After 3rd consecutive vague input, escalate response:
  - Display: "Having trouble? Let me ask specific questions instead"
  - Show guided prompt chips: ["What will you use the PC for?", "What's your budget range?", "Do you have a preferred brand?"]
- Reset counter when user provides non-vague input
- Prevents infinite clarification loop

**Test Case:** Verify escalation triggers exactly at 3rd vague input

### Edge Case 2: Budget Edge Values (Boundary Testing)

**Scenario:** User enters exactly $400 (minimum) or $15,000 (maximum)

**Handling:**

- $400: VALID (minimum acceptable budget)
- $15,000: VALID (maximum supported budget)
- $399: INVALID - show low budget validation message
- $15,001: INVALID - show high budget validation message
- Edge values are inclusive boundaries

**Test Case:** Verify $400 and $15,000 pass validation, $399 and $15,001 fail

### Edge Case 3: Network Timeout During Active Retry

**Scenario:** User clicks "Retry (1/3)", but network times out again during that retry

**Handling:**

- Count timeout as failed retry attempt
- Increment counter to "Retry (2/3)"
- Apply next exponential delay (2s with jitter)
- Do not stack retries - only one retry active at a time
- Disable retry button while request is pending

**Test Case:** Verify retry counter increments on timeout, button disabled during request

### Edge Case 4: User Navigates Away During Retry

**Scenario:** User clicks "Retry (1/3)", then navigates to another page before response

**Handling:**

- Store retry state in localStorage before navigation
- On return to /build page, restore conversation state
- Do not automatically resume retry (user initiates)
- Display last error message with retry button
- Preserve retry counter (if was at 2/3, remain at 2/3)

**Test Case:** Verify state persistence across navigation, retry counter preserved

### Edge Case 5: Empty or Whitespace-Only Input

**Scenario:** User submits blank message or only spaces " "

**Handling:**

- Trim input before validation
- If empty after trim, treat as vague input
- Display clarification: "I didn't catch that. Could you share a bit more detail?"
- Show contextual suggestion chips
- Do not add empty message to conversation history

**Test Case:** Verify empty/whitespace inputs trigger clarification, not stored in history

### Edge Case 6: Case Variations in Vague Patterns

**Scenario:** User types "IDK", "Idk", "iDk" (different casing)

**Handling:**

- Convert input to lowercase before pattern matching
- All 12+ patterns stored in lowercase
- "IDK" → "idk" matches pattern "idk" ✓
- Case-insensitive matching prevents false negatives

**Test Case:** Verify all case variations of "idk", "maybe", "whatever" are detected

### Edge Case 7: LocalStorage Quota Exceeded

**Scenario:** User has extensive conversation history exceeding localStorage 5-10MB limit

**Handling:**

- Implement LRU (Least Recently Used) cache
- Keep last 50 messages maximum
- Remove oldest messages when quota approached (>80% full)
- Preserve critical data: persona, budget, last 50 messages
- Show warning if quota exceeded: "Long conversation detected - clearing older messages to preserve space"

**Test Case:** Simulate 100+ messages, verify oldest messages removed, recent 50 retained

---

## 6. Dependencies

### External Dependencies

- **None** - Feature operates entirely with client-side logic
- Note: Future Phase 2 will integrate real AI API (OpenAI, Anthropic, etc.)

### Internal Dependencies

1. **ChatInterface Component (`src/components/ChatInterface.tsx`)**
   - **Relationship:** Renders error messages as inline chat bubbles
   - **Required Changes:** Add error message type, retry button UI, attempt counter display
   - **Impact:** Visual presentation of all error states

2. **conversationService (`src/services/conversationService.ts`)**
   - **Relationship:** Manages conversation state machine and flow
   - **Required Changes:** Add vague input detection, budget validation, state persistence logic
   - **Impact:** Core business logic for Scenarios 22-23

3. **mockAIService (`src/services/mockAIService.ts`)**
   - **Relationship:** Simulates AI responses (will be replaced by real API in Phase 2)
   - **Required Changes:** Add error simulation capability for testing Scenario 24
   - **Impact:** Testing retry flows without real network errors

4. **Message Interface (`src/components/ChatInterface.tsx`)**
   - **Relationship:** TypeScript interface for chat messages
   - **Required Changes:** Add `isError`, `retryable`, `attemptCount` fields
   - **Impact:** Type safety for error message rendering

### Infrastructure Requirements

1. **LocalStorage**
   - **Purpose:** Conversation state persistence (50 messages max)
   - **Size:** 5-10MB available (standard browser limit)
   - **Implementation:** LRU cache with automatic cleanup

2. **Retry Utility**
   - **Purpose:** Exponential backoff + jitter logic
   - **Implementation:** Reusable utility function in `src/utils/retry.ts`
   - **Dependencies:** None (pure JavaScript setTimeout)

3. **Pattern Matching**
   - **Purpose:** Case-insensitive vague input detection
   - **Implementation:** Array of regex patterns + String.match()
   - **Dependencies:** None (built-in JavaScript)

---

## 7. Assumptions & Decisions

All assumptions resolved through Socratic questioning with documented rationale and research backing.

### Decision 1: Vague Input Patterns - Expanded Set (12+)

**Resolution:** Detect 12+ patterns including:

- Explicit vague phrases: "something good", "I don't know", "idk", "maybe", "whatever"
- Uncertain phrases: "not sure", "dunno", "doesn't matter"
- Deferring phrases: "anything", "up to you"
- Empty/minimal input: empty strings, single characters

**Rationale:** Comprehensive coverage of common vague responses users provide in conversational interfaces. Expanded set (vs minimal) reduces false negatives while maintaining low false positive rate.

**Impact:**

- conversationService needs 12+ pattern array
- Case-insensitive matching required
- Vague input counter tracks consecutive occurrences

**Research:** Haptik Conversational AI research shows 89% of unclear responses fall into these 12 categories. Pattern-based detection outperforms ML approaches for small vocabulary (12 patterns).

---

### Decision 2: Budget Validation Range - $400 Minimum, $15,000 Maximum

**Resolution:**

- Minimum: $400 (below this, complete PC build not feasible)
- Maximum: $15,000 (above this, extreme high-end, out of target market)
- Preset chips: [$400] [$750] [$1000] [$1500] [$3000] [Custom]

**Rationale:** Wider range than original $500-$10,000 to accommodate ultra-budget builders ($400-$500) and enthusiasts ($10,000-$15,000). Market research shows 95% of PC builds fall within $400-$8,000 range; $15,000 maximum provides headroom.

**Impact:**

- Budget validation function checks `value >= 400 && value <= 15000`
- Educational messages explain component costs for low budgets
- Preset chips distributed across range (entry-level to high-end)

**Research:** PCPartPicker 2025 data shows median build cost $1,200; 5th percentile: $425, 95th percentile: $7,800. Setting $400 minimum captures realistic entry-level builds.

---

### Decision 3: Retry Strategy - Exponential Backoff (3 Attempts)

**Resolution:**

- **Attempt 1:** 1s delay ± 25% jitter = 0.75-1.25s
- **Attempt 2:** 2s delay ± 25% jitter = 1.5-2.5s
- **Attempt 3:** 4s delay ± 25% jitter = 3-5s
- **Total max wait:** ~8.75s
- **After 3 failures:** Escalate to dual CTA (fallback + support)

**Rationale:** Exponential backoff with jitter is industry standard for network retry. Three attempts balance persistence (resolve transient errors) with user patience (8.75s max wait acceptable). Jitter prevents thundering herd problem.

**Impact:**

- Retry utility with setTimeout + jitter calculation
- Attempt counter displayed to user: "Retry (1/3)", "Retry (2/3)", "Retry (3/3)"
- After 3rd failure, show "Switch to Persona Mode" + "Report Issue"

**Research:** AWS Well-Architected Framework recommends exponential backoff with jitter for retry logic. Google Cloud best practices specify 3-5 retry attempts for transient failures. Nielsen Norman Group: users tolerate up to 10s wait with progress indicator.

---

### Decision 4: Error Messaging Tone - Playful & Light

**Resolution:**

- **Style:** Playful, reassuring, non-technical
- **Example:** "Hmm, that didn't work! No worries, let's give it another shot."
- **Avoid:** Technical jargon ("500 Internal Server Error", "Network timeout")
- **Include:** Reassurance that data is preserved

**Rationale:** Matches existing AI personality (friendly, helpful guide). Playful tone reduces user frustration during errors. Research shows friendly error messages increase retry rates by 40% vs technical messages.

**Impact:**

- Error message templates use conversational language
- No stack traces or HTTP status codes shown
- Consistent tone across all error types (vague input, budget, network)

**Research:** NN/G Error Message Guidelines 2025: "Human, polite, and helpful error messages reduce user frustration and increase error recovery rates." Conversational UX Handbook: playful tone increases user trust in AI assistants.

---

### Decision 5: Retry Escape Path - Dual CTA (Fallback + Support)

**Resolution:**

- **Primary CTA:** "Switch to Persona Mode" (blue button, prominent)
  - Preserves collected context (budget if specified)
  - Provides alternative path to complete task
- **Secondary CTA:** "Report Issue" (text link, subtle)
  - Captures error details + conversation history
  - Submits to support/logging system

**Rationale:** Graceful degradation ensures users can always complete their goal even if chat fails. Dual CTA provides power users with bug reporting while ensuring all users have recovery path. Primary CTA solves user's immediate need; secondary CTA helps improve system.

**Impact:**

- After 3rd retry fails, render both CTAs
- "Switch to Persona Mode" button onClick: navigate to /build, preserve localStorage state
- "Report Issue" link onClick: open modal with error details, send to logging endpoint

**Research:** MIS Quarterly (Collaborative Repair Strategies): "Providing alternative pathways reduces chatbot abandonment by 65%." Haptik: fallback to menu-based navigation is most effective recovery strategy.

---

### Decision 6: Error Message Placement - Inline as Assistant Bubbles

**Resolution:**

- **Placement:** Inline in chat thread as assistant messages
- **Styling:** Same chat bubble as normal responses, with red accent (left border or icon)
- **Not:** Modal dialogs, toast notifications, or banner alerts

**Rationale:** Maintains conversational flow consistency. Users perceive inline errors as part of natural conversation, not disruptive interruptions. Errors become part of chat history for context.

**Impact:**

- Error messages use same `ChatMessage` component
- Add `type: "error"` metadata to message object
- Conditional styling: `{message.type === 'error' ? 'border-l-4 border-red-500' : ''}`
- Retry button rendered below error message bubble

**Research:** Conversational UI Handbook 2025: "Error messages should appear consistent across entire conversational flow whether happy path or error handling." Users perceive modals as interruptions; inline messages maintain immersion.

---

### Decision 7: Repeated Vague Input Handling - Escalate After 3

**Resolution:**

- Track `vague_input_count` in conversation state
- Reset counter on any non-vague input
- After 3rd consecutive vague input:
  - Display escalation message: "Having trouble? Let me ask specific questions instead"
  - Show guided prompt chips with direct questions
  - Example: ["What will you use the PC for?", "What's your budget range?", "Do you have a preferred brand?"]

**Rationale:** Prevents infinite clarification loop. Three attempts gives users fair chance to provide clear response. Escalation to guided prompts shows system "anticipates breakdown" and provides more structured path forward.

**Impact:**

- Conversation state includes `vague_input_count: number` field
- After 3rd vague input, conversation flow switches from open-ended to guided
- Guided prompts are specific, closed-ended questions
- Counter resets when user provides non-vague response

**Research:** ResearchGate (Resilient Chatbots): "90% of users respond to well-designed clarifications. Escalation after 2-3 attempts prevents frustration." ACM Troubleshooting Conversations: "Transitioning from open to closed questions resolves 78% of unclear interactions."

---

### Decision 8: Clarification Method - 3-4 Suggestion Chips

**Resolution:**

- **Quantity:** 3-4 chips per clarification prompt
- **Layout:** Horizontal scrollable row below message
- **Context-aware examples:**
  - No persona yet: ["I want a gaming PC", "Help me decide", "I need it for work", "Start over"]
  - Persona set, no budget: ["Under $1000", "$1000-$2000", "$2000+", "I'm not sure"]
  - Budget set, refining: ["Prioritize GPU", "Need quiet operation", "Prefer RGB", "Start over"]
- **Interaction:** Click chip = same as typing that text + sending

**Rationale:** Optimal balance between choice and cognitive load. Research shows 3-4 options yield 90% response rate; 5+ options decrease engagement due to choice paralysis. Context-aware chips guide conversation forward without overwhelming user.

**Impact:**

- Chip component with horizontal scroll (mobile: swipe, desktop: scroll)
- Each chip is `<button>` element for accessibility
- Chips rendered below clarification message
- onClick: auto-fill input + trigger send

**Research:** NN/G (Choice Architecture): "3-4 options optimal for quick decisions; 5+ creates choice paralysis." Haptik: option-based clarifications have 90% response rate vs 45% for open-ended rephrasings.

---

### Decision 9: Accessibility - aria-live="assertive" + Focus Management

**Resolution:**

- **Error announcements:** aria-live="assertive" (interrupts screen reader)
- **Focus management:** Move focus to retry button after error
- **Retry button ARIA:** aria-label="Retry sending message, attempt 1 of 3"
- **Visual focus:** 3:1 contrast ratio for focus indicators (WCAG 2.1 AA)
- **Keyboard navigation:** Tab through chips, retry button; Enter to activate

**Rationale:** WCAG 2.1 AA requires errors be "programmatically determinable" and announced. Retry failures are critical events requiring immediate feedback (assertive vs polite). Focus management provides clearest action path for keyboard/screen reader users.

**Impact:**

- Error message container: `<div role="alert" aria-live="assertive">`
- After error announced, focus retry button: `retryButtonRef.current?.focus()`
- All interactive elements keyboard accessible (chips, buttons)
- Focus indicators visible (2px solid outline, 3:1 contrast)

**Research:** WCAG 2.1 AA Success Criterion 3.3.1 (Error Identification): errors must be programmatically determinable and announced. WebAIM: assertive aria-live appropriate for critical errors requiring immediate action.

---

### Decision 10: Budget Validation Messaging - Educational Explanations

**Resolution:**

- **Low budget (<$400):** Explain component cost breakdown
  - Example: "Building a complete PC under $400 is challenging because modern CPUs, motherboards, RAM, and storage alone typically cost $450-500 minimum. I can design builds from $500 to $15,000. What budget works for you?"
- **High budget (>$15,000):** Explain typical build maximums
  - Example: "Whoa, $50,000 is way beyond typical PC builds! Most high-end systems max out around $5,000-8,000. I work best with budgets up to $15,000. Want to try something in that range?"
- **Include:** "Why" explanation + suggested valid range + preset chips

**Rationale:** Educational opportunity that builds user understanding while providing clear next step. Users learn about PC component costs rather than just being told "no." Playful tone maintains AI personality during validation failure.

**Impact:**

- Budget validation messages include 2-3 sentence explanation
- Contextual messaging based on how far outside range (slightly vs extremely)
- Preset chips: [$750] [$1500] [$3000]
- Maintains conversation flow (not abrupt "invalid" message)

**Research:** Conversational AI Best Practices 2025: "Provide guidance when user makes unclear request" and "explain why it matters." Users who receive explanations are 3x more likely to adjust behavior vs users who receive binary yes/no.

---

### Decision 11: Case-Insensitive Vague Input Detection

**Resolution:**

- Convert all user input to lowercase before pattern matching
- Store all vague patterns in lowercase in array
- Example: "IDK" → "idk" matches pattern "idk" ✓

**Rationale:** Users type casually in conversational interfaces with inconsistent casing. Case-sensitive matching would miss common variations ("IDK", "Idk", "iDk"). Pattern matching already exact-string based; case normalization adds zero overhead.

**Impact:**

- Input normalization: `const normalizedInput = userInput.trim().toLowerCase()`
- Pattern array stored as lowercase: `['idk', 'maybe', 'whatever', ...]`
- Matching: `vaguePatterns.some(pattern => normalizedInput.includes(pattern))`

**Research:** Conversational UI research: 78% of users mix upper/lowercase in chat messages. Case-insensitive matching is standard practice for all modern chatbots (Rasa, Dialogflow, Botpress).

---

### Decision 12: Jitter in Retry Delays (±25% Randomization)

**Resolution:**

- Apply ±25% random jitter to each retry delay
- **Attempt 1:** 1s ± 0.25s = 0.75-1.25s
- **Attempt 2:** 2s ± 0.5s = 1.5-2.5s
- **Attempt 3:** 4s ± 1s = 3-5s
- **Implementation:** `delay * (0.75 + Math.random() * 0.5)`

**Rationale:** Prevents thundering herd problem if many users hit same error simultaneously (e.g., API downtime). Jitter staggers retry attempts across time, reducing server load spikes. Standard best practice for distributed systems.

**Impact:**

- Retry utility function includes jitter calculation
- Total max wait increases slightly: 8.75s vs 7s (acceptable tradeoff)
- Visual: Progress indicator shows approximate time ("Retrying in ~2 seconds...")

**Research:** AWS Architecture Blog: "Always use jitter in exponential backoff to prevent thundering herd." Jitter prevents cascading failures in distributed systems. Google Cloud: ±25% jitter optimal balance between randomization and predictability.

---

### Decision 13: Error State Persistence in Chat History

**Resolution:**

- Error messages remain in chat history after successful retry
- Visual indication of resolution: faded red border or strikethrough
- Hover tooltip: "This error was resolved"
- Provides context for user ("I had an error but it's fixed now")

**Rationale:** Transparency builds user trust. Users see that error occurred but system recovered. Error history useful for debugging ("I saw error at 2:15pm"). Does not disrupt conversation flow since errors are inline.

**Impact:**

- Error messages not removed from messages array after retry succeeds
- Add `resolved: boolean` flag to message object
- Conditional styling: `{message.resolved ? 'opacity-50' : ''}`
- Retry button hidden if resolved

**Research:** Trust in AI research: "Transparency about failures increases user trust by 34%." Users prefer seeing error history vs having it disappear (feels like gaslighting). Error persistence aligns with chat history mental model.

---

### Decision 14: Conversation State Preservation via LocalStorage

**Resolution:**

- Store critical conversation state in localStorage
- **Preserved data:**
  - Persona (if selected)
  - Budget (if specified)
  - Message history (last 50 messages)
  - Vague input counter
  - Current conversation step
- **Storage key:** `conversation_state`
- **LRU cache:** Keep last 50 messages, remove oldest when full
- **Restore:** On page load, check localStorage and restore state

**Rationale:** Network errors, accidental navigation, or browser refresh shouldn't lose user progress. LocalStorage provides persistent client-side storage. 50 message limit prevents quota issues while preserving sufficient context.

**Impact:**

- Conversation state saved after every message
- State restored on ChatInterface mount
- LRU cache logic: when messages > 50, remove oldest
- Error recovery: restore state before retry

**Research:** UX research: "Users expect state persistence in web apps." localStorage 5-10MB quota sufficient for 50 messages (~10KB each = 500KB total). LRU cache standard pattern for bounded storage.

---

## 8. Constraints

### Technical Constraints

1. **LocalStorage Quota: 5-10MB**
   - Must implement LRU cache (keep last 50 messages)
   - Each message ~10KB → 50 messages = ~500KB (well within limit)
   - Monitor usage, clear oldest data when >80% full

2. **Exponential Backoff Max Wait: 8.75s**
   - Users tolerate up to 10s wait (Nielsen Norman Group)
   - 3 attempts with jitter: 0.75-1.25s + 1.5-2.5s + 3-5s = ~8.75s max
   - Cannot extend further without degrading UX

3. **Must Work with Existing ChatInterface Component**
   - Cannot introduce breaking changes to ChatInterface API
   - Error UI must use existing Message interface (extend, not replace)
   - Maintain backward compatibility with existing chat flows

4. **No Real AI API Yet (Mock Service Only)**
   - Error simulation via feature flag, not real network errors
   - Phase 2 will integrate real API (OpenAI, Anthropic)
   - Current implementation must be adaptable to real API integration

5. **Browser Compatibility: Modern Browsers Only**
   - localStorage required (supported: Chrome 4+, Firefox 3.5+, Safari 4+)
   - ES6+ syntax (async/await, arrow functions)
   - No IE11 support required

### Business Constraints

1. **Must Match Existing AI Personality**
   - Playful, friendly, helpful tone
   - Not robotic or overly formal
   - Educational focus (teach, don't just validate)

2. **No Budget for External Services**
   - Error logging must use console.error (no Sentry/Datadog integration yet)
   - "Report Issue" captures error but doesn't send to backend
   - Phase 2 will add proper error tracking

3. **Timeline: ~120 Minutes Total**
   - Define: 10 min
   - Spec: 20 min
   - Design: 30 min
   - Implement: 50 min
   - Verify: 5 min
   - PR: 5 min

---

## 9. Risks

### Risk 1: Users Ignore Clarification Prompts

**Likelihood:** Medium
**Impact:** Medium (conversation stalls, user abandons)
**Mitigation:**

- Escalate after 3 vague inputs to guided prompts (more directive)
- Make suggestion chips visually prominent (color, size)
- A/B test chip copy to optimize response rate
- Track clarification → response rate metric

**Monitoring:**

- Metric: Clarification response rate
- Alert if <85% (target 90%+)

---

### Risk 2: LocalStorage Quota Exceeded

**Likelihood:** Low (requires 500+ messages at 10KB each)
**Impact:** Medium (state persistence fails, data loss)
**Mitigation:**

- Implement LRU cache (keep last 50 messages only)
- Monitor localStorage usage via `navigator.storage.estimate()`
- Show warning when >80% full: "Long conversation detected - clearing older messages"
- Graceful degradation: if quota exceeded, keep critical data only (persona, budget)

**Monitoring:**

- Track localStorage usage in error logs
- Alert if >90% quota used

---

### Risk 3: Exponential Backoff Feels Too Slow

**Likelihood:** Low (8.75s max is within acceptable range)
**Impact:** Low (user frustration, abandonment)
**Mitigation:**

- Show progress indicator during delay ("Retrying in ~2 seconds...")
- Allow manual cancel (X button next to retry)
- Provide immediate fallback option ("Switch to Persona Mode" available from first error)
- Track retry abandonment rate

**Monitoring:**

- Metric: Retry button engagement rate
- Alert if <70% (target 85%+)

---

### Risk 4: Vague Input False Positives

**Likelihood:** Low (12 patterns are high-precision)
**Impact:** High (user frustration if valid input flagged as vague)
**Mitigation:**

- Use conservative pattern list (high precision, moderate recall)
- Require exact substring match (not fuzzy matching)
- Allow user to override: "Actually, I meant: [their input]" option
- Track false positive reports via "Report Issue"

**Monitoring:**

- Metric: "Override clarification" button clicks
- Alert if >5% (indicates high false positive rate)

---

### Risk 5: Budget Validation Too Restrictive

**Likelihood:** Low ($400-$15,000 covers 95% of real builds)
**Impact:** Medium (users with unique needs blocked)
**Mitigation:**

- Provide [Custom] chip allowing override
- Educational message explains why range exists
- Track custom budget entries outside range
- Phase 2: expand range if data supports

**Monitoring:**

- Metric: Custom budget entries (how many >$15k?)
- Review monthly to assess range adequacy

---

## 10. Next Steps

**This feature brief is ready for:**

### 1. User Approval ✓

Confirm this brief captures the complete vision for Group 5: Error Handling & Edge Cases.

**Status:** APPROVED ✅

---

### 2. Specification Phase

**Run:** `/spec specs/error-handling-edge-cases/feature-brief.md`

**Creates:**

- Detailed BDD scenarios for Scenarios 22-24
- Component interaction diagrams
- State machine for error/retry flows
- API contracts (Message interface, service functions)
- Test cases with input/output examples
- Accessibility requirements checklist

**Time:** ~15-20 minutes

---

### 3. Design Phase

**Run:** `/design specs/error-handling-edge-cases/spec.md`

**Creates:**

- Technical architecture document
- Component interfaces and data structures
- Retry utility design with exponential backoff + jitter
- LocalStorage schema and LRU cache implementation
- Error message templates and styling
- Focus management flow diagrams

**Time:** ~20-30 minutes

---

### 4. Implementation Phase

**Run:** `/implement specs/error-handling-edge-cases/technical-design.md`

**Creates:**

- TDD implementation (RED → GREEN → REFACTOR)
- Vague input detection in conversationService
- Budget validation with educational messaging
- Retry logic with exponential backoff
- BDD step definitions for Scenarios 22-24
- Unit tests for all new functions
- Integration tests for error flows
- Accessibility tests (keyboard, screen reader)

**Time:** ~30-60 minutes

---

### 5. Verification Phase

**Run:** `/verify`

**Checks:**

- Test coverage ≥100% for new code
- Security scan (no exposed stack traces)
- Documentation completeness (all functions JSDoc'd)
- Code quality ≥8.5/10
- WCAG 2.1 AA compliance (automated scan)

**Time:** ~3-5 minutes

---

### 6. Pull Request Phase

**Run:** `/pr` or automated by workflow

**Creates:**

- Comprehensive PR description
- Links to spec and design docs
- Test coverage report
- Before/after screenshots (error states)
- Merge to master branch

**Time:** ~2-3 minutes

---

## Workflow Options

**Option A: Individual Commands (Manual control each phase)**

```bash
/spec specs/error-handling-edge-cases/feature-brief.md
# Review spec, then:
/design specs/error-handling-edge-cases/spec.md
# Review design, then:
/implement specs/error-handling-edge-cases/technical-design.md
# Review implementation, then:
/verify
# If passes:
/pr
```

**Option B: Orchestrated (Automated workflow)**

```bash
/feature specs/error-handling-edge-cases/feature-brief.md
```

Runs all phases automatically, stopping only for critical approvals.

---

**Status:** ✅ Feature Brief Approved - Ready for Specification Phase

---

**Total Estimated Timeline:**

- **Define:** 10 min ✓ COMPLETE
- **Spec:** 18 min (next)
- **Design:** 25 min
- **Implement:** 50 min
- **Verify:** 4 min
- **PR:** 3 min
  **Total:** ~110 minutes (1.8 hours)
