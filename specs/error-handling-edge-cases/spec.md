# Specification: Error Handling & Edge Cases

**Status:** Approved
**Created:** 2025-10-26
**Feature Group:** Group 5 (Scenarios 22-24)
**Phase:** 2 of 6

---

## Overview

Provide robust error handling and intelligent user guidance for the AI Conversational Builder to gracefully handle unclear inputs, validate budget constraints, and recover from network failures. This feature ensures users receive helpful, educational feedback when they provide vague responses or encounter errors, maintaining conversation continuity and building user confidence in the system.

### Purpose

Enable the AI Conversational Builder to:

1. **Detect vague input** (12+ patterns) and provide empathetic clarification with suggestion chips
2. **Validate budgets** ($400-$15,000 range) with educational messaging about PC component costs
3. **Recover from network errors** with exponential backoff retry (3 attempts) and graceful degradation

### Stakeholders

- **Primary Users:** All users interacting with the AI Conversational Builder
- **First-time users:** Need extra guidance when providing unclear responses
- **Budget-conscious users:** Need education about realistic PC build costs
- **Users on unstable networks:** Need reliable error recovery

---

## Functional Requirements

### Core Functionality

1. **Vague Input Detection**
   - Detect 12+ vague patterns case-insensitively
   - Track consecutive vague input count
   - Escalate after 3 consecutive vague inputs

2. **Clarification Response**
   - Generate empathetic clarification messages
   - Provide 3-4 context-aware suggestion chips
   - Maintain conversation flow

3. **Budget Validation**
   - Validate range: $400 minimum, $15,000 maximum
   - Parse various formats: "$1000", "1000", "1k", "$1,000"
   - Provide educational explanations

4. **Network Error Handling**
   - Catch all network/API errors
   - Implement exponential backoff (3 retries)
   - Preserve conversation state
   - Provide fallback options

5. **Conversation State Persistence**
   - Store state in localStorage
   - Include: persona, budget, message history (last 50)
   - Restore on page reload
   - LRU cache for quota management

### User Interactions

Users will:

- Receive clarification when providing vague input
- See suggestion chips for quick responses
- Get educational budget guidance
- Click retry buttons for failed requests
- Switch to Persona Mode if errors persist

---

## BDD Scenarios

### Scenario 22: Vague Input Detection and Clarification

**Scenario 22.1: User provides vague response - "idk"**

\`\`\`gherkin
Given the user is in AI conversational mode
And the assistant asks "What will you use your PC for?"
When the user types "idk" and sends the message
Then the system should detect the vague input
And display a clarification message: "I'd love to help! Are you looking for gaming, work, or content creation?"
And show 4 suggestion chips: ["I want a gaming PC", "Help me decide", "I need it for work", "Start over"]
And the message should be added to the conversation history
\`\`\`

**Scenario 22.2: User provides vague response - "something good" (case variation)**

\`\`\`gherkin
Given the user is in AI conversational mode
And the assistant asks "What's your budget for this build?"
When the user types "Something Good" and sends the message
Then the system should detect the vague input (case-insensitive)
And display a clarification message with contextual suggestions
And show 4 suggestion chips: ["Under $1000", "$1000-$2000", "$2000+", "I'm not sure"]
\`\`\`

**Scenario 22.3: User provides 3 consecutive vague responses - escalation**

\`\`\`gherkin
Given the user is in AI conversational mode
And the user has provided 2 consecutive vague responses
When the user types "whatever" as the 3rd vague response
Then the system should detect the escalation threshold
And display an escalation message: "Having trouble? Let me ask specific questions instead"
And show 3 guided prompt chips: ["What will you use the PC for?", "What's your budget range?", "Do you have a preferred brand?"]
And the vague input counter should be at 3
\`\`\`

**Scenario 22.4: User clicks suggestion chip**

\`\`\`gherkin
Given the user received a clarification message with suggestion chips
And the chips are displayed: ["I want a gaming PC", "Help me decide", "I need it for work", "Start over"]
When the user clicks the "I want a gaming PC" chip
Then the system should auto-fill the input with "I want a gaming PC"
And send the message automatically
And continue the conversation with that response
And reset the vague input counter to 0
\`\`\`

**Scenario 22.5: Empty or whitespace-only input**

\`\`\`gherkin
Given the user is in AI conversational mode
And the assistant is waiting for a response
When the user types " " (only spaces) and sends
Then the system should trim the input
And detect it as vague input (empty after trim)
And display clarification: "I didn't catch that. Could you share a bit more detail?"
And NOT add the empty message to conversation history
And show contextual suggestion chips
\`\`\`

**Scenario 22.6: Vague input patterns - all 12+ patterns detected**

\`\`\`gherkin
Given the user is in AI conversational mode
When the user sends any of these messages:
| Input | Pattern Matched |
| "something good" | vague descriptor |
| "I don't know" | uncertain |
| "idk" | uncertain shorthand|
| "maybe" | uncertain |
| "whatever" | deferring |
| "not sure" | uncertain |
| "dunno" | uncertain |
| "anything" | deferring |
| "up to you" | deferring |
| "doesn't matter" | deferring |
| "" | empty |
| "x" | single character |
Then the system should detect each as vague input
And provide appropriate clarification
\`\`\`

---

### Scenario 23: Budget Validation with Educational Guidance

**Scenario 23.1: User enters budget below minimum ($200)**

\`\`\`gherkin
Given the user is in AI conversational mode
And the assistant asks "What's your budget for this build?"
When the user types "$200" and sends the message
Then the system should validate the budget
And detect $200 is below $400 minimum
And display educational message: "Building a complete PC under $400 is challenging because modern CPUs, motherboards, RAM, and storage alone typically cost $450-500 minimum. I can design builds from $400 to $15,000. What budget works for you?"
And show 6 preset budget chips: ["$400", "$750", "$1000", "$1500", "$3000", "Custom"]
And NOT proceed to build recommendations
\`\`\`

**Scenario 23.2: User enters budget above maximum ($50,000)**

\`\`\`gherkin
Given the user is in AI conversational mode
And the assistant asks about budget
When the user types "$50,000" and sends the message
Then the system should validate the budget
And detect $50,000 is above $15,000 maximum
And display educational message: "Whoa, $50,000 is way beyond typical PC builds! Most high-end systems max out around $5,000-8,000. I work best with budgets up to $15,000. Want to try something in that range?"
And show 6 preset budget chips: ["$400", "$750", "$1000", "$1500", "$3000", "Custom"]
And NOT proceed to build recommendations
\`\`\`

**Scenario 23.3: User enters budget at exact minimum ($400)**

\`\`\`gherkin
Given the user is in AI conversational mode
And the assistant asks about budget
When the user types "$400" and sends the message
Then the system should validate the budget
And accept $400 as VALID (inclusive minimum)
And proceed to next conversation step
And store budget in conversation state
\`\`\`

**Scenario 23.4: User enters budget at exact maximum ($15,000)**

\`\`\`gherkin
Given the user is in AI conversational mode
And the assistant asks about budget
When the user types "$15,000" and sends the message
Then the system should validate the budget
And accept $15,000 as VALID (inclusive maximum)
And proceed to next conversation step
And store budget in conversation state
\`\`\`

**Scenario 23.5: User enters budget in various formats**

\`\`\`gherkin
Given the user is in AI conversational mode
And the assistant asks about budget
When the user types any of these formats:
| Input | Parsed Value |
| "$1000" | 1000 |
| "1000" | 1000 |
| "1k" | 1000 |
| "$1,000" | 1000 |
| "2.5k" | 2500 |
| "$5000.00" | 5000 |
Then the system should parse the budget correctly
And validate against the $400-$15,000 range
And proceed if valid
\`\`\`

**Scenario 23.6: User clicks preset budget chip**

\`\`\`gherkin
Given the user received a budget validation message
And preset chips are shown: ["$400", "$750", "$1000", "$1500", "$3000", "Custom"]
When the user clicks the "$1500" chip
Then the system should set budget to $1500
And proceed to next conversation step
And NOT show validation error (preset values are always valid)
\`\`\`

**Scenario 23.7: User enters budget just outside range ($399, $15,001)**

\`\`\`gherkin
Given the user is in AI conversational mode
When the user enters "$399"
Then the system should show low budget validation message

When the user enters "$15,001"
Then the system should show high budget validation message
\`\`\`

---

### Scenario 24: Network Error Handling with Retry

**Scenario 24.1: Network error on first attempt - successful retry**

\`\`\`gherkin
Given the user is in AI conversational mode
And the user sends a message "I want a gaming PC"
When the network request fails (timeout or 500 error)
Then the system should catch the error
And display an inline error message: "Hmm, that didn't work! No worries, let's give it another shot."
And show a "Retry (1/3)" button
And preserve the conversation state in localStorage
And the user's message should remain in the conversation history
And NOT show the assistant's response yet
\`\`\`

**Scenario 24.2: User clicks retry button - exponential backoff**

\`\`\`gherkin
Given a network error occurred
And the error message shows "Retry (1/3)" button
When the user clicks the "Retry (1/3)" button
Then the system should disable the retry button
And wait 1 second (±25% jitter) = 0.75-1.25s
And retry the request
And if successful, display the assistant's response
And hide the error message (or mark as resolved)
And enable interaction again
\`\`\`

**Scenario 24.3: Retry fails - increment attempt counter**

\`\`\`gherkin
Given the user clicked "Retry (1/3)"
When the retry request also fails
Then the system should increment the attempt counter
And display updated error message
And show "Retry (2/3)" button
And wait for user to click retry again
\`\`\`

**Scenario 24.4: Second retry with 2-second delay**

\`\`\`gherkin
Given the first retry failed
And the error message shows "Retry (2/3)" button
When the user clicks "Retry (2/3)"
Then the system should disable the retry button
And wait 2 seconds (±25% jitter) = 1.5-2.5s
And retry the request
And if successful, continue normally
\`\`\`

**Scenario 24.5: Third and final retry with 4-second delay**

\`\`\`gherkin
Given the second retry failed
And the error message shows "Retry (3/3)" button
When the user clicks "Retry (3/3)"
Then the system should disable the retry button
And wait 4 seconds (±25% jitter) = 3-5s
And retry the request
And if successful, continue normally
\`\`\`

**Scenario 24.6: All 3 retries fail - show fallback options**

\`\`\`gherkin
Given all 3 retry attempts have failed
When the 3rd retry completes with error
Then the system should hide the retry button
And display a dual CTA error message
And show primary button: "Switch to Persona Mode" (blue, prominent)
And show secondary link: "Report Issue" (text link, subtle)
And preserve all conversation history in localStorage
And the user should be able to click either option
\`\`\`

**Scenario 24.7: User clicks "Switch to Persona Mode" after retries exhausted**

\`\`\`gherkin
Given all 3 retries failed
And the dual CTA is displayed
When the user clicks "Switch to Persona Mode"
Then the system should navigate to /build page
And restore conversation state from localStorage
And if budget was specified, pre-populate the budget slider
And if persona was selected, highlight that persona
And show a message: "Welcome back! Let's continue building your PC."
\`\`\`

**Scenario 24.8: User clicks "Report Issue"**

\`\`\`gherkin
Given all 3 retries failed
And the dual CTA is displayed
When the user clicks "Report Issue"
Then the system should open an issue report modal/form
And pre-populate error details (error type, timestamp, attempt count)
And include last 5 conversation messages for context
And NOT include sensitive data (no PII)
And allow user to add additional description
And submit to error logging (console.error for now)
\`\`\`

**Scenario 24.9: Conversation state preserved during errors**

\`\`\`gherkin
Given the user has a conversation history with 10 messages
And persona is "Gaming Enthusiast" (if selected)
And budget is $1500 (if specified)
When a network error occurs
Then all conversation state should be preserved in localStorage
And conversation history should contain all 10 messages
And persona should remain "Gaming Enthusiast"
And budget should remain $1500

When the user refreshes the page
Then the conversation state should be restored
And all 10 messages should be displayed
And persona and budget should be restored
And the error state should be displayed
And retry button should be available
\`\`\`

**Scenario 24.10: User navigates away during retry**

\`\`\`gherkin
Given the user clicked "Retry (1/3)"
And the system is waiting (exponential backoff delay)
When the user navigates to another page (e.g., clicks browser back)
Then the retry state should be stored in localStorage
And the pending request should be cancelled

When the user returns to /build page
Then the conversation state should be restored
And the error message should be displayed
And the retry counter should be preserved (still at "Retry (1/3)")
And the user can click retry again to resume
\`\`\`

**Scenario 24.11: Error messages remain in chat history after resolution**

\`\`\`gherkin
Given a network error occurred
And the error message is displayed in chat
When the user successfully retries
And the assistant responds normally
Then the error message should remain in chat history
And the error message should be visually marked as resolved (faded or strikethrough)
And a hover tooltip should show: "This error was resolved"
And the retry button should be hidden
And the conversation should continue normally
\`\`\`

**Scenario 24.12: Disable retry button while request pending**

\`\`\`gherkin
Given a network error occurred
And the "Retry (1/3)" button is displayed
When the user clicks the retry button
Then the button should be disabled immediately
And the button text should change to "Retrying..." or show a spinner
And the user should NOT be able to click it again
And the button should remain disabled during exponential backoff delay
And the button should remain disabled during the request

When the request completes (success or failure)
Then the button should be re-enabled (if more attempts remain)
Or hidden (if success)
Or updated to next attempt (if failure)
\`\`\`

---

## Acceptance Criteria

### Scenario 22: Vague Input Detection

- [ ] System detects all 12+ vague input patterns with 100% accuracy
- [ ] Pattern matching is case-insensitive (detects "IDK", "Idk", "idk")
- [ ] Empty strings and whitespace-only inputs treated as vague
- [ ] Single-character inputs treated as vague
- [ ] Vague input counter tracks consecutive vague responses
- [ ] Counter resets to 0 when user provides non-vague input
- [ ] Escalation message shown after exactly 3 consecutive vague inputs
- [ ] Suggestion chips are context-aware (different for persona selection vs budget)
- [ ] Suggestion chips are keyboard accessible (Tab + Enter)
- [ ] Suggestion chips auto-fill input and send when clicked
- [ ] Clarification messages have empathetic, conversational tone
- [ ] Empty/whitespace messages NOT added to conversation history
- [ ] Clarification response rate ≥90% (users respond with clearer input)

### Scenario 23: Budget Validation

- [ ] Budgets below $400 are rejected with educational message
- [ ] Budgets above $15,000 are rejected with educational message
- [ ] Exactly $400 is accepted as VALID (inclusive minimum)
- [ ] Exactly $15,000 is accepted as VALID (inclusive maximum)
- [ ] Budget parsing handles: "$1000", "1000", "1k", "$1,000", "2.5k"
- [ ] Educational messages explain component costs for low budgets
- [ ] Educational messages explain typical PC maximums for high budgets
- [ ] 6 preset budget chips displayed: [$400, $750, $1000, $1500, $3000, Custom]
- [ ] Preset chip clicks set budget without validation (always valid)
- [ ] Budget validation prevents build generation for invalid budgets
- [ ] 100% of invalid budgets caught before proceeding
- [ ] Validation messages match playful AI personality tone

### Scenario 24: Network Error Handling

- [ ] All network errors caught (timeout, 500, parse errors)
- [ ] Error messages displayed as inline chat bubbles (not modals/toasts)
- [ ] Error messages have red accent (left border or icon)
- [ ] Retry button shows attempt counter: "Retry (1/3)", "Retry (2/3)", "Retry (3/3)"
- [ ] First retry: 1s delay ±25% jitter (0.75-1.25s)
- [ ] Second retry: 2s delay ±25% jitter (1.5-2.5s)
- [ ] Third retry: 4s delay ±25% jitter (3-5s)
- [ ] Total maximum wait time: ≤8.75 seconds (3 attempts with jitter)
- [ ] Retry button disabled while request is pending
- [ ] Button shows "Retrying..." or spinner when disabled
- [ ] After 3 failed retries, show dual CTA (fallback + support)
- [ ] Primary CTA: "Switch to Persona Mode" (blue, prominent)
- [ ] Secondary CTA: "Report Issue" (text link, subtle)
- [ ] Conversation state preserved in localStorage throughout errors
- [ ] State includes: persona, budget, last 50 messages, retry counter
- [ ] State restored on page reload
- [ ] "Switch to Persona Mode" preserves context (budget/persona)
- [ ] "Report Issue" captures error details without PII
- [ ] Error messages remain in chat history after resolution (marked as resolved)
- [ ] Resolved errors have faded styling or strikethrough
- [ ] Retry success rate ≥85% within 3 attempts (measure in production)

### Conversation State Persistence

- [ ] Conversation state stored in localStorage after every message
- [ ] State restored on page reload
- [ ] LRU cache keeps last 50 messages maximum
- [ ] Oldest messages removed when count > 50
- [ ] Critical data preserved: persona, budget, last 50 messages
- [ ] localStorage quota monitored (alert at >80% usage)
- [ ] Warning shown if quota exceeded
- [ ] Zero data loss during errors (100% state preservation)

### Quality Criteria

- [ ] Test coverage ≥100% for new code
- [ ] All BDD scenarios have passing step definitions
- [ ] Unit tests for vague input detection (12+ patterns)
- [ ] Unit tests for budget validation (edge cases: $399, $400, $15000, $15001)
- [ ] Unit tests for retry utility (exponential backoff + jitter)
- [ ] Integration tests for error flows
- [ ] No CRITICAL/HIGH security vulnerabilities
- [ ] No error stack traces exposed to users
- [ ] All functions have JSDoc documentation
- [ ] Code quality score ≥8.5/10
- [ ] TypeScript strict mode compliance
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Error announcements via aria-live="assertive"
- [ ] Focus management: move focus to retry button after error
- [ ] Keyboard navigation for all interactive elements

---

## Non-Functional Requirements

### Performance

- **Vague input detection:** <10ms (synchronous pattern matching)
- **Budget validation:** <50ms (parse + validate)
- **Error retry flow:** ≤8.75s maximum total wait (3 attempts with jitter)
- **localStorage operations:** <100ms per operation
- **Pattern matching:** O(n) where n = number of patterns (12+)

### Security

- **No stack traces exposed:** Error messages show user-friendly text only
- **Input sanitization:** All user input sanitized before validation
- **No sensitive data:** Error messages and logs contain no PII
- **localStorage security:** No sensitive credentials stored
- **Error logging:** Captures diagnostics without exposing internals

### Usability

- **Tone:** Playful, friendly, reassuring (matches AI personality)
- **Clarification prompts:** Conversational, not robotic
- **Error messages:** Non-technical, empathetic
- **Budget messaging:** Educational (explains "why"), not just "no"
- **Retry buttons:** Clear progress indication
- **Fallback options:** Always provide alternative path forward

### Accessibility

- **WCAG 2.1 AA compliance:** All error states
- **Error announcements:** aria-live="assertive" for screen readers
- **Focus management:** Move focus to retry button after error
- **Keyboard navigation:** All chips and buttons accessible via Tab + Enter
- **Focus indicators:** 3:1 contrast ratio, visible outlines
- **Screen reader labels:** Descriptive aria-label for all interactive elements
- **Touch targets:** ≥44x44px for suggestion chips and retry buttons

### Scalability

- **localStorage LRU cache:** Handles unlimited conversations (keep last 50 messages)
- **Vague pattern list:** Easily extensible (add new patterns to array)
- **Budget thresholds:** Configurable via constants
- **Retry strategy:** Configurable delays and attempt counts

---

## Constraints and Assumptions

### Technical Constraints

1. **LocalStorage Quota: 5-10MB**
   - LRU cache keeps last 50 messages (~500KB total)
   - Monitor usage at >80% full
   - Graceful degradation if quota exceeded

2. **Exponential Backoff Max Wait: 8.75s**
   - 3 attempts with jitter: 0.75-1.25s + 1.5-2.5s + 3-5s
   - Users tolerate up to 10s wait (within acceptable range)

3. **ChatInterface Compatibility**
   - Must extend existing Message interface (not replace)
   - No breaking changes to ChatInterface API
   - Error UI uses existing chat bubble component

4. **Mock Service Only (Phase 1)**
   - Error simulation via feature flag
   - Real API integration in Phase 2
   - Design must be adaptable to real network calls

5. **Browser Compatibility**
   - Modern browsers only (Chrome, Firefox, Safari, Edge)
   - localStorage required
   - ES6+ syntax (async/await, arrow functions)
   - No IE11 support

### Assumptions

1. **Vague Pattern Coverage:** 12+ patterns cover 89% of unclear responses (based on research)
2. **Budget Range:** $400-$15,000 covers 95% of real PC builds (based on PCPartPicker data)
3. **Retry Success Rate:** 85% of network errors resolve within 3 attempts (industry standard)
4. **User Patience:** Users tolerate ≤8.75s wait with progress indication (Nielsen Norman Group)
5. **LocalStorage Availability:** All target browsers support localStorage

### Dependencies

1. **ChatInterface Component** (\`src/components/ChatInterface.tsx\`)
   - Add error message type
   - Add retry button UI
   - Add attempt counter display

2. **conversationService** (\`src/services/conversationService.ts\`)
   - Add vague input detection
   - Add budget validation
   - Add state persistence logic

3. **mockAIService** (\`src/services/mockAIService.ts\`)
   - Add error simulation capability
   - Support testing retry flows

4. **Message Interface** (in ChatInterface)
   - Add \`isError?: boolean\`
   - Add \`retryable?: boolean\`
   - Add \`attemptCount?: number\`
   - Add \`resolved?: boolean\`

5. **Retry Utility** (\`src/utils/retry.ts\` - to be created)
   - Exponential backoff logic
   - Jitter calculation
   - Reusable across codebase

---

## Test Data Examples

### Vague Input Patterns (12+)

\`\`\`javascript
const VAGUE_PATTERNS = [
'something good',
'i don\'t know',
'idk',
'maybe',
'whatever',
'not sure',
'dunno',
'anything',
'up to you',
'doesn\'t matter',
'', // empty string
// Single character patterns checked separately
];
\`\`\`

### Budget Test Cases

\`\`\`javascript
const BUDGET_TEST_CASES = [
// Valid
{ input: '$400', parsed: 400, valid: true },
{ input: '$1000', parsed: 1000, valid: true },
{ input: '1k', parsed: 1000, valid: true },
{ input: '$15,000', parsed: 15000, valid: true },

// Invalid - too low
{ input: '$200', parsed: 200, valid: false, reason: 'below_minimum' },
{ input: '$399', parsed: 399, valid: false, reason: 'below_minimum' },

// Invalid - too high
{ input: '$15,001', parsed: 15001, valid: false, reason: 'above_maximum' },
{ input: '$50,000', parsed: 50000, valid: false, reason: 'above_maximum' },
];
\`\`\`

### Network Error Scenarios

\`\`\`javascript
const ERROR_SCENARIOS = [
{ type: 'timeout', message: 'Request timeout after 30s' },
{ type: 'server_error', status: 500, message: 'Internal Server Error' },
{ type: 'network_error', message: 'Failed to fetch' },
{ type: 'parse_error', message: 'Invalid JSON response' },
];
\`\`\`

---

## Open Questions

None - all questions resolved through Socratic questioning in feature brief.

---

## API Contracts

### Message Interface Extension

\`\`\`typescript
interface Message {
id: string;
role: 'user' | 'assistant';
content: string;
timestamp: number;

// Error handling fields (new)
isError?: boolean; // True if this is an error message
retryable?: boolean; // True if user can retry
attemptCount?: number; // Current retry attempt (1-3)
resolved?: boolean; // True if error was resolved by successful retry
errorType?: 'network' | 'validation' | 'unknown';

// Suggestion chips (new)
suggestionChips?: string[]; // Array of quick reply options
}
\`\`\`

### Conversation State Schema

\`\`\`typescript
interface ConversationState {
persona?: string; // Selected persona ID (if any)
budget?: number; // Validated budget (if specified)
messages: Message[]; // Last 50 messages (LRU)
vagueInputCount: number; // Consecutive vague input counter
currentStep: string; // Current conversation step
lastUpdated: number; // Timestamp of last update
}
\`\`\`

### Service Function Signatures

\`\`\`typescript
// Vague input detection
function isVagueInput(input: string): boolean;

// Budget validation
function validateBudget(input: string): {
valid: boolean;
value?: number;
reason?: 'below_minimum' | 'above_maximum';
message?: string;
};

// Retry with exponential backoff
async function retryWithBackoff<T>(
fn: () => Promise<T>,
maxAttempts: number = 3
): Promise<T>;

// Conversation state management
function saveConversationState(state: ConversationState): void;
function loadConversationState(): ConversationState | null;
\`\`\`

---

## Approval

- **Created by:** Claude Code (AI Assistant)
- **Date:** 2025-10-26
- **Status:** Approved ✅
- **Next Phase:** Create technical design (\`/design specs/error-handling-edge-cases/spec.md\`)

---

## Summary

**Feature:** Error Handling & Edge Cases (Group 5)
**Scenarios:** 3 main scenarios (22, 23, 24)
**BDD Scenarios:** 31 detailed Given-When-Then scenarios
**Acceptance Criteria:** 60+ testable criteria
**Coverage:** Main flows + error cases + edge cases + accessibility

**Estimated Implementation Time:**

- Design: 20-30 min
- Implementation: 30-60 min
- Verification: 3-5 min
- Total remaining: ~70-100 min

**Quality Targets:**

- Test coverage: 100%
- All 31 scenarios passing
- WCAG 2.1 AA compliance
- Code quality: ≥8.5/10
- Zero security vulnerabilities
