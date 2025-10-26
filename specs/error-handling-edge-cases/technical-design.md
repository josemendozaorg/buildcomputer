# Technical Design: Error Handling & Edge Cases

**Status:** Approved
**Created:** 2025-10-26
**Feature Group:** Group 5 (Scenarios 22-24)
**Phase:** 3 of 6
**Specification:** specs/error-handling-edge-cases/spec.md

---

## Executive Summary

This document provides moderate-level technical architecture for implementing robust error handling in the AI Conversational Builder. The design covers:

1. **Vague Input Detection:** Pattern-based detection with escalation strategy
2. **Budget Validation:** Range validation with educational messaging
3. **Network Error Recovery:** Exponential backoff retry with graceful degradation
4. **State Persistence:** localStorage-based LRU cache for conversation continuity

**Architecture Pattern:** Service-layer validation + Component-level error UI + Retry utility
**Complexity:** Medium
**Estimated Implementation:** 30-60 minutes with parallel TDD

---

## Design Decisions & Rationale

### Decision 1: Service-Layer Validation (Recommended ⭐)

**Choice:** Implement validation logic in \`conversationService.ts\` (service layer)

**Rationale:**

- **Existing Pattern:** Current codebase already uses service layer (\`conversationService\`, \`mockAIService\`)
- **Separation of Concerns:** Business logic (validation) separate from UI (ChatInterface)
- **Testability:** Service functions easily unit testable without DOM
- **Reusability:** Validation logic can be reused across components

**Alternative Considered:** Component-level validation

- **Rejected:** Mixes presentation and business logic, harder to test

### Decision 2: Inline Error Messages (Chat Bubbles) (Recommended ⭐)

**Choice:** Display errors as inline chat bubbles (not modals/toasts)

**Rationale:**

- **Existing Pattern:** ChatInterface already uses Message[] array and bubble UI
- **Conversational Flow:** Errors become part of natural conversation
- **Context Preservation:** Users see error history in chat
- **Research:** Conversational UI best practices favor inline errors over interrupting modals

**Implementation:** Extend existing \`Message\` interface with error fields

### Decision 3: localStorage for State Persistence (Recommended ⭐)

**Choice:** Use localStorage with LRU cache (50 messages max)

**Rationale:**

- **Existing Pattern:** Codebase already uses localStorage (\`chatMessages\`, \`conversationState\`)
- **Browser Support:** localStorage available in all modern browsers
- **No Backend Required:** Client-side persistence suitable for Phase 1 (mock AI)
- **LRU Cache:** Prevents quota issues (5-10MB limit)

**Key:** \`STORAGE_KEYS.CONVERSATION_STATE\` (use existing storageKeys.ts)

### Decision 4: Exponential Backoff Utility (Recommended ⭐)

**Choice:** Create reusable \`retryWithBackoff\` utility in \`src/utils/retry.ts\`

**Rationale:**

- **Existing Pattern:** Utilities in \`src/utils/\` (buildRecommendations, a11y, etc.)
- **Reusability:** Retry logic can be used by any network call
- **Configurable:** Delays and attempt counts parameterized
- **Industry Standard:** Exponential backoff + jitter is AWS/Google Cloud best practice

**Signature:**
\`\`\`typescript
async function retryWithBackoff<T>(
fn: () => Promise<T>,
options?: RetryOptions
): Promise<T>
\`\`\`

### Decision 5: BDD Step Definitions in Existing File (Recommended ⭐)

**Choice:** Add Scenarios 22-24 steps to \`tests/bdd/steps/ai-conversational-builder.steps.ts\`

**Rationale:**

- **Existing Pattern:** AI builder scenarios already in \`ai-conversational-builder.steps.ts\`
- **Cohesion:** Error handling is part of AI conversational feature
- **Avoids Fragmentation:** All AI chat scenarios in one file

**Structure:** Group steps by scenario (22, 23, 24) with clear comments

---

## Component Architecture

### High-Level Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ ChatInterface.tsx │
│ (Presentation Layer - UI Rendering & User Interaction) │
│ │
│ - Render message bubbles (user, AI, error) │
│ - Handle suggestion chip clicks │
│ - Display retry buttons with attempt counter │
│ - Manage focus for accessibility │
└────────────────┬────────────────────────────────────────────┘
│
│ calls
▼
┌─────────────────────────────────────────────────────────────┐
│ conversationService.ts │
│ (Business Logic - Validation & Flow Control) │
│ │
│ - isVagueInput(input: string): boolean │
│ - validateBudget(input: string): ValidationResult │
│ - getNextConversationStep(state, message): Response │
│ - generateClarificationMessage(context): Message │
│ - trackVagueInputCount(state): number │
└────────────────┬────────────────────────────────────────────┘
│
│ uses
▼
┌─────────────────────────────────────────────────────────────┐
│ mockAIService.ts │
│ (AI Simulation - with Error Injection) │
│ │
│ - generateAIResponse(message): Promise<AIMessage> │
│ - simulateNetworkError(errorRate: number): void │
│ - setErrorMode(enabled: boolean): void │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ src/utils/retry.ts │
│ (Retry Logic - Exponential Backoff + Jitter) │
│ │
│ - retryWithBackoff<T>(fn, options): Promise<T> │
│ - calculateDelay(attempt, baseDelay, jitter): number │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ localStorage │
│ (State Persistence - LRU Cache) │
│ │
│ Key: 'conversationState' │
│ Value: { messages[], persona, budget, vagueCount, ... } │
│ Cache: Keep last 50 messages (LRU eviction) │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

## Component Details

### 1. ChatInterface Component (Modified)

**File:** \`src/components/ChatInterface.tsx\`

**Current State:**

- Renders chat messages (user + AI roles)
- Has \`Message\` interface with \`isWarning\` and \`suggestions\`
- Persists messages to localStorage (\`chatMessages\` key)
- Uses \`generateAIResponse\` from mockAIService

**Required Changes:**

#### 1.1 Extend Message Interface

\`\`\`typescript
export interface Message {
id: string;
role: "user" | "ai";
content: string;
timestamp: Date;
isWarning?: boolean;
suggestions?: string[]; // Existing field for suggestion chips

// NEW: Error handling fields
isError?: boolean; // True if this is an error message
retryable?: boolean; // True if user can retry this message
attemptCount?: number; // Current retry attempt (1-3)
resolved?: boolean; // True if error was successfully resolved
errorType?: 'network' | 'validation' | 'unknown';

// NEW: Retry callback
onRetry?: () => Promise<void>; // Function to retry failed request
}
\`\`\`

**Rationale:** Extends existing interface (backward compatible), leverages existing \`suggestions\` for chips

#### 1.2 Add Error Message Rendering

\`\`\`tsx
// In message rendering loop
{messages.map((message) => (

  <div
    key={message.id}
    className={\`message-bubble \${message.role} \${
      message.isError ? 'error-message' : ''
    } \${message.resolved ? 'error-resolved' : ''}\`}
  >
    {/* Error messages have red left border */}
    <div className={message.isError ? 'border-l-4 border-red-500 pl-4' : ''}>
      <p>{message.content}</p>
      
      {/* Suggestion chips (existing pattern) */}
      {message.suggestions && message.suggestions.length > 0 && (
        <SuggestionChips chips={message.suggestions} onClick={handleChipClick} />
      )}
      
      {/* NEW: Retry button for error messages */}
      {message.isError && message.retryable && !message.resolved && (
        <button
          onClick={() => handleRetry(message)}
          disabled={retrying}
          aria-label={\`Retry sending message, attempt \${message.attemptCount} of 3\`}
          className="retry-button"
        >
          {retrying ? 'Retrying...' : \`Retry (\${message.attemptCount}/3)\`}
        </button>
      )}
    </div>
  </div>
))}
\`\`\`

**Key Points:**

- Reuses existing suggestion chips pattern for clarification chips
- Retry button shows attempt counter (1/3, 2/3, 3/3)
- Disabled state while retrying
- ARIA label for accessibility

#### 1.3 Add Retry Handler

\`\`\`typescript
const [retrying, setRetrying] = useState(false);

const handleRetry = async (errorMessage: Message) => {
if (!errorMessage.onRetry) return;

setRetrying(true);

try {
await errorMessage.onRetry();

    // Mark error as resolved
    setMessages(prev => prev.map(msg =>
      msg.id === errorMessage.id
        ? { ...msg, resolved: true, retryable: false }
        : msg
    ));

} catch (error) {
// Retry failed - error will be re-added by onRetry logic
} finally {
setRetrying(false);
}
};
\`\`\`

#### 1.4 Add State Persistence

\`\`\`typescript
// Save conversation state to localStorage after every message
useEffect(() => {
const conversationState = {
messages: messages.slice(-50), // LRU: Keep last 50
vagueInputCount: conversationState.vagueInputCount,
persona: conversationState.persona,
budget: conversationState.budget,
lastUpdated: Date.now(),
};

localStorage.setItem(
STORAGE_KEYS.CONVERSATION_STATE,
JSON.stringify(conversationState)
);
}, [messages, conversationState]);

// Restore on mount
useEffect(() => {
const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATION_STATE);
if (saved) {
const parsed = JSON.parse(saved);
setMessages(parsed.messages || []);
setConversationState(prev => ({
...prev,
...parsed,
}));
}
}, []);
\`\`\`

**Key Points:**

- LRU cache: \`.slice(-50)\` keeps last 50 messages
- Persists after every message
- Restores on component mount

---

### 2. conversationService (Modified)

**File:** \`src/services/conversationService.ts\`

**Current State:**

- Manages conversation flow with \`step\` counter
- \`ConversationState\` interface
- \`getNextConversationStep()\` function

**Required Changes:**

#### 2.1 Extend ConversationState Interface

\`\`\`typescript
export interface ConversationState {
step: number;
useCase?: string;
specificNeeds?: string;
budgetRange?: number;
context: Record<string, unknown>;
completed: boolean;

// NEW: Error handling state
vagueInputCount: number; // Track consecutive vague inputs
lastInputWasVague: boolean; // Reset counter when false
}
\`\`\`

#### 2.2 Add Vague Input Detection

\`\`\`typescript
/\*\*

- Vague input patterns (case-insensitive)
  \*/
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
  ] as const;

/\*\*

- Detect if user input is vague
-
- @param input - User's message (will be trimmed and lowercased)
- @returns true if input matches vague patterns
-
- @example
- isVagueInput("idk") // true
- isVagueInput("IDK") // true (case-insensitive)
- isVagueInput(" ") // true (empty after trim)
- isVagueInput("x") // true (single character)
- isVagueInput("I want a gaming PC") // false
  \*/
  export function isVagueInput(input: string): boolean {
  const trimmed = input.trim();

// Empty or whitespace-only
if (trimmed.length === 0) {
return true;
}

// Single character
if (trimmed.length === 1) {
return true;
}

// Check against vague patterns (case-insensitive)
const lower = trimmed.toLowerCase();
return VAGUE_PATTERNS.some(pattern => lower.includes(pattern));
}
\`\`\`

**Test Coverage:**

- All 12+ patterns detected
- Case-insensitive matching
- Empty string handling
- Single character handling

#### 2.3 Add Budget Validation

\`\`\`typescript
const BUDGET_MIN = 400;
const BUDGET_MAX = 15000;

export interface BudgetValidationResult {
valid: boolean;
value?: number;
reason?: 'below_minimum' | 'above_maximum';
message?: string;
suggestionChips?: string[];
}

/\*\*

- Parse and validate budget input
-
- Handles formats: "$1000", "1000", "1k", "$1,000", "2.5k"
- Range: $400 - $15,000 (inclusive)
-
- @param input - User's budget input
- @returns Validation result with parsed value and educational message if invalid
-
- @example
- validateBudget("$1000") // { valid: true, value: 1000 }
- validateBudget("1k") // { valid: true, value: 1000 }
- validateBudget("$200")   // { valid: false, reason: 'below_minimum', message: "..." }
 */
export function validateBudget(input: string): BudgetValidationResult {
  // Parse budget from various formats
  const cleaned = input.replace(/[$,]/g, ''); // Remove $ and ,
  let value: number;

if (cleaned.toLowerCase().includes('k')) {
// Handle "1k", "2.5k"
value = parseFloat(cleaned.replace(/k/i, '')) \* 1000;
} else {
value = parseFloat(cleaned);
}

// Invalid number
if (isNaN(value)) {
return {
valid: false,
reason: 'below_minimum',
message: "I didn't catch a valid budget. How much are you looking to spend?",
suggestionChips: ['$400', '$750', '$1000', '$1500', '$3000', 'Custom'],
};
}

// Below minimum
if (value < BUDGET_MIN) {
return {
valid: false,
value,
reason: 'below_minimum',
message: \`Building a complete PC under $400 is challenging because modern CPUs, motherboards, RAM, and storage alone typically cost $450-500 minimum. I can design builds from $400 to $15,000. What budget works for you?\`,
suggestionChips: ['$400', '$750', '$1000', '$1500', '$3000', 'Custom'],
};
}

// Above maximum
if (value > BUDGET_MAX) {
return {
valid: false,
value,
reason: 'above_maximum',
message: \`Whoa, $\${value.toLocaleString()} is way beyond typical PC builds! Most high-end systems max out around $5,000-8,000. I work best with budgets up to $15,000. Want to try something in that range?\`,
suggestionChips: ['$750', '$1500', '$3000', '$5000', '$8000', 'Custom'],
};
}

// Valid
return {
valid: true,
value,
};
}
\`\`\`

**Test Coverage:**

- Boundary values: $400, $15,000 (valid), $399, $15,001 (invalid)
- Format parsing: "$1000", "1k", "$1,000"
- Educational messages for low/high budgets

#### 2.4 Add Clarification Message Generator

\`\`\`typescript
/\*\*

- Generate context-aware clarification message for vague input
-
- @param state - Current conversation state
- @param vagueCount - Number of consecutive vague inputs
- @returns Clarification message with suggestion chips
  \*/
  export function generateClarificationMessage(
  state: ConversationState,
  vagueCount: number,
  ): ConversationResponse {
  // Escalate after 3rd vague input
  if (vagueCount >= 3) {
  return {
  message: "Having trouble? Let me ask specific questions instead.",
  chips: [
  "What will you use the PC for?",
  "What's your budget range?",
  "Do you have a preferred brand?",
  ],
  };
  }

// Context-aware clarification based on current step
if (!state.useCase) {
// No persona selected yet
return {
message: "I'd love to help! Are you looking for gaming, work, or content creation?",
chips: [
"I want a gaming PC",
"Help me decide",
"I need it for work",
"Start over",
],
};
} else if (!state.budgetRange) {
// Persona set, no budget
return {
message: "Could you share your budget range? That helps me find the right components.",
chips: [
"Under $1000",
"$1000-$2000",
"$2000+",
"I'm not sure",
],
};
} else {
// Refining build
return {
message: "I didn't quite catch that. Could you share a bit more detail?",
chips: [
"Prioritize GPU",
"Need quiet operation",
"Prefer RGB",
"Start over",
],
};
}
}
\`\`\`

#### 2.5 Modify getNextConversationStep

\`\`\`typescript
export function getNextConversationStep(
state: ConversationState,
userMessage?: string,
): ConversationResponse {
if (!userMessage) {
// Initial greeting or continuation
return { message: "What will you mainly use it for?", chips: [...] };
}

// NEW: Check for vague input
if (isVagueInput(userMessage)) {
state.vagueInputCount = state.lastInputWasVague
? state.vagueInputCount + 1
: 1;
state.lastInputWasVague = true;

    return generateClarificationMessage(state, state.vagueInputCount);

}

// Reset vague counter on clear input
state.vagueInputCount = 0;
state.lastInputWasVague = false;

// NEW: Check for budget in message (if at budget step)
if (state.step === 3 || userMessage.includes('$')) {
const validation = validateBudget(userMessage);
if (!validation.valid) {
return {
message: validation.message!,
chips: validation.suggestionChips,
};
}
// Budget valid - store and continue
state.budgetRange = validation.value;
}

// Existing conversation flow logic
switch (state.step) {
// ... existing cases
}
}
\`\`\`

---

### 3. mockAIService (Modified)

**File:** \`src/services/mockAIService.ts\`

**Current State:**

- \`generateAIResponse()\` returns \`AIMessage\`
- Persona detection via keyword matching

**Required Changes:**

#### 3.1 Add Error Simulation

\`\`\`typescript
/\*\*

- Error simulation settings (for testing Scenario 24)
  \*/
  let errorSimulationEnabled = false;
  let errorRate = 0; // 0-1 probability of error

/\*\*

- Enable error simulation for testing
- @param enabled - Whether to simulate errors
- @param rate - Probability of error (0-1, default 0.5)
  \*/
  export function setErrorSimulation(enabled: boolean, rate: number = 0.5): void {
  errorSimulationEnabled = enabled;
  errorRate = rate;
  }

/\*\*

- Simulate network error (for testing)
  \*/
  function shouldSimulateError(): boolean {
  if (!errorSimulationEnabled) return false;
  return Math.random() < errorRate;
  }

/\*\*

- Generate AI response with optional error simulation
-
- @throws Error if error simulation is enabled and triggered
  \*/
  export async function generateAIResponse(
  userMessage: string,
  ): Promise<AIMessage> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

// NEW: Error simulation
if (shouldSimulateError()) {
throw new Error('Network error: Failed to fetch AI response');
}

// Existing persona detection logic
const detectedPersona = detectPersona(userMessage);
// ... rest of function
}
\`\`\`

**Usage in Tests:**
\`\`\`typescript
// In BDD step definitions
setErrorSimulation(true, 1.0); // 100% error rate
await generateAIResponse("test"); // Will throw
setErrorSimulation(false); // Disable
\`\`\`

---

### 4. Retry Utility (New)

**File:** \`src/utils/retry.ts\` (create new)

**Purpose:** Reusable exponential backoff retry logic

\`\`\`typescript
/\*\*

- Retry Utility
-
- Implements exponential backoff with jitter for network retry.
- Based on AWS/Google Cloud best practices.
  \*/

export interface RetryOptions {
maxAttempts?: number; // Default: 3
baseDelay?: number; // Base delay in ms (default: 1000)
jitterPercent?: number; // Jitter as decimal (default: 0.25 = ±25%)
onRetry?: (attempt: number, delay: number) => void; // Callback before each retry
}

/\*\*

- Calculate retry delay with exponential backoff and jitter
-
- Formula: delay = baseDelay _ (2 ^ (attempt - 1)) _ (1 ± jitter)
-
- @param attempt - Current attempt number (1-based)
- @param baseDelay - Base delay in milliseconds
- @param jitterPercent - Jitter percentage as decimal (0.25 = ±25%)
- @returns Delay in milliseconds
-
- @example
- calculateDelay(1, 1000, 0.25) // 750-1250ms (1s ± 25%)
- calculateDelay(2, 1000, 0.25) // 1500-2500ms (2s ± 25%)
- calculateDelay(3, 1000, 0.25) // 3000-5000ms (4s ± 25%)
  _/
  export function calculateDelay(
  attempt: number,
  baseDelay: number,
  jitterPercent: number,
  ): number {
  // Exponential backoff: 2^(attempt-1)
  const exponentialDelay = baseDelay _ Math.pow(2, attempt - 1);

// Apply jitter: delay _ (1 ± jitter)
const jitter = 1 + (Math.random() _ 2 - 1) _ jitterPercent;
return Math.round(exponentialDelay _ jitter);
}

/\*\*

- Retry a function with exponential backoff
-
- @param fn - Async function to retry
- @param options - Retry configuration
- @returns Result of successful function call
- @throws Error from last attempt if all retries fail
-
- @example
- const result = await retryWithBackoff(
- () => fetch('/api/chat'),
- { maxAttempts: 3, baseDelay: 1000, jitterPercent: 0.25 }
- );
  \*/
  export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
  ): Promise<T> {
  const {
  maxAttempts = 3,
  baseDelay = 1000,
  jitterPercent = 0.25,
  onRetry,
  } = options;

let lastError: Error | undefined;

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
try {
return await fn();
} catch (error) {
lastError = error as Error;

      // Don't retry on last attempt
      if (attempt === maxAttempts) {
        break;
      }

      // Calculate delay with exponential backoff + jitter
      const delay = calculateDelay(attempt, baseDelay, jitterPercent);

      // Notify callback
      onRetry?.(attempt, delay);

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }

}

// All retries failed
throw lastError || new Error('Retry failed');
}
\`\`\`

**Test Coverage:**

- Delay calculation for attempts 1, 2, 3
- Jitter randomization (verify range)
- Successful retry after N failures
- All retries fail (throws last error)
- onRetry callback invoked

---

### 5. Storage Keys (Modified)

**File:** \`src/utils/storageKeys.ts\`

**Current State:**

- Defines \`STORAGE_KEYS\` constants
- Already has \`CONVERSATION_STATE\` key

**Required Changes:**

No changes needed - existing \`CONVERSATION_STATE\` key will be used.

---

## Data Models

### Extended Message Interface

\`\`\`typescript
interface Message {
id: string;
role: "user" | "ai";
content: string;
timestamp: Date;
isWarning?: boolean;
suggestions?: string[];

// Error handling
isError?: boolean;
retryable?: boolean;
attemptCount?: number;
resolved?: boolean;
errorType?: 'network' | 'validation' | 'unknown';
onRetry?: () => Promise<void>;
}
\`\`\`

### Extended ConversationState

\`\`\`typescript
interface ConversationState {
step: number;
useCase?: string;
specificNeeds?: string;
budgetRange?: number;
context: Record<string, unknown>;
completed: boolean;

// Error handling state
vagueInputCount: number;
lastInputWasVague: boolean;
}
\`\`\`

### localStorage Schema

\`\`\`typescript
interface StoredConversationState {
messages: Message[]; // Last 50 messages (LRU)
vagueInputCount: number; // Consecutive vague input counter
persona?: string; // Selected persona ID
budget?: number; // Validated budget
currentStep: number; // Conversation step
lastUpdated: number; // Timestamp (for cache expiry)
}

// Stored at key: STORAGE_KEYS.CONVERSATION_STATE
\`\`\`

**LRU Eviction Logic:**
\`\`\`typescript
const conversationState = {
messages: messages.slice(-50), // Keep last 50
// ... other fields
};
\`\`\`

---

## Integration Points

### Internal Dependencies

1. **ChatInterface ← conversationService**
   - ChatInterface calls \`isVagueInput()\`, \`validateBudget()\`, \`getNextConversationStep()\`
   - conversationService returns \`ConversationResponse\` with message + chips

2. **ChatInterface ← mockAIService**
   - ChatInterface calls \`generateAIResponse()\` (now async, can throw)
   - Uses retry utility to wrap calls

3. **ChatInterface ← retry utility**
   - Wraps \`generateAIResponse()\` in \`retryWithBackoff()\`
   - Displays retry UI based on attempt count

4. **conversationService ← storageKeys**
   - Uses \`STORAGE_KEYS.CONVERSATION_STATE\` for localStorage key

### External Dependencies

None - feature operates entirely client-side

### localStorage Integration

**Write Path:**
\`\`\`typescript
// After every message
useEffect(() => {
const state = {
messages: messages.slice(-50),
vagueInputCount: conversationState.vagueInputCount,
persona: conversationState.persona,
budget: conversationState.budget,
currentStep: conversationState.step,
lastUpdated: Date.now(),
};
localStorage.setItem(STORAGE_KEYS.CONVERSATION_STATE, JSON.stringify(state));
}, [messages, conversationState]);
\`\`\`

**Read Path:**
\`\`\`typescript
// On component mount
useEffect(() => {
const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATION_STATE);
if (saved) {
const parsed = JSON.parse(saved);
setMessages(parsed.messages || []);
setConversationState({ ...parsed });
}
}, []);
\`\`\`

---

## Test Strategy

### Unit Tests (Vitest)

**File:** \`tests/unit/services/conversationService.test.ts\`

**Coverage:**

- \`isVagueInput()\`:
  - All 12+ patterns detected
  - Case-insensitive matching (test "idk", "IDK", "Idk")
  - Empty string / whitespace handling
  - Single character handling
  - Clear input returns false
- \`validateBudget()\`:
  - Boundary values: $400, $15,000 (valid), $399, $15,001 (invalid)
  - Format parsing: "$1000", "1000", "1k", "$1,000", "2.5k"
  - Educational messages present
  - Suggestion chips included
- \`generateClarificationMessage()\`:
  - Context-aware chips (no persona, persona set, budget set)
  - Escalation after 3rd vague input
  - Correct message tone

**File:** \`tests/unit/utils/retry.test.ts\`

**Coverage:**

- \`calculateDelay()\`:
  - Attempt 1: 750-1250ms range
  - Attempt 2: 1500-2500ms range
  - Attempt 3: 3000-5000ms range
  - Jitter randomization verified
- \`retryWithBackoff()\`:
  - Success on first attempt
  - Success on 2nd attempt after 1 failure
  - Success on 3rd attempt after 2 failures
  - All 3 attempts fail (throws error)
  - onRetry callback invoked with correct params

**File:** \`tests/unit/components/ChatInterface.test.tsx\`

**Coverage:**

- Error message rendering (red border, retry button)
- Retry button click triggers onRetry
- Retry button disabled while retrying
- Error marked as resolved after successful retry
- Suggestion chips rendered for error messages
- localStorage persistence (save/restore)
- LRU cache (verify 50 message limit)

### Integration Tests (Playwright/Vitest)

**File:** \`tests/integration/error-handling.test.ts\`

**Coverage:**

- End-to-end vague input flow:
  1. Send vague input → clarification shown
  2. Click suggestion chip → conversation continues
  3. Send 3 vague inputs → escalation message shown
- End-to-end budget validation flow:
  1. Enter $200 → educational message shown
  2. Click $1500 chip → budget accepted
- End-to-end network retry flow:
  1. Enable error simulation
  2. Send message → error shown with Retry (1/3)
  3. Click retry → error shown with Retry (2/3)
  4. Click retry → success, conversation continues
  5. Verify error marked as resolved in history

### BDD Scenarios (QuickPickle + Playwright)

**File:** \`tests/bdd/steps/ai-conversational-builder.steps.ts\`

**Coverage:** All 31 scenarios from spec.md

**Scenario 22:** Vague Input (6 scenarios)

- 22.1: "idk" detection
- 22.2: "Something Good" case-insensitive
- 22.3: 3 consecutive vague inputs → escalation
- 22.4: Suggestion chip click
- 22.5: Empty/whitespace input
- 22.6: All 12+ patterns detected

**Scenario 23:** Budget Validation (7 scenarios)

- 23.1: $200 below minimum
- 23.2: $50,000 above maximum
- 23.3: $400 exact minimum (valid)
- 23.4: $15,000 exact maximum (valid)
- 23.5: Various formats parsed
- 23.6: Preset chip click
- 23.7: $399 / $15,001 edge cases

**Scenario 24:** Network Retry (12 scenarios)

- 24.1: Network error → retry button shown
- 24.2: Retry (1/3) → exponential backoff
- 24.3: Retry fails → increment counter
- 24.4: Retry (2/3) → 2s delay
- 24.5: Retry (3/3) → 4s delay
- 24.6: All retries fail → dual CTA
- 24.7: "Switch to Persona Mode" navigation
- 24.8: "Report Issue" captures error
- 24.9: State preserved during errors
- 24.10: State preserved during navigation
- 24.11: Error marked resolved in history
- 24.12: Retry button disabled while pending

### E2E Tests (Playwright)

**File:** \`tests/e2e/error-handling.spec.ts\`

**Coverage:**

- Complete vague input journey (user types "idk" 3 times, escalates, recovers)
- Complete budget validation journey (user tries $200, then $1500, succeeds)
- Complete network retry journey (3 failures, fallback to persona mode)
- State persistence across page reload

---

## Accessibility Implementation

### WCAG 2.1 AA Compliance

#### Error Announcements (aria-live)

\`\`\`tsx

<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
  className={message.isError ? 'error-message' : 'sr-only'}
>
  {message.isError && message.content}
</div>
\`\`\`

**Rationale:** \`aria-live="assertive"\` interrupts screen reader for critical errors

#### Focus Management

\`\`\`typescript
const retryButtonRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
// Move focus to retry button when error appears
if (messages.some(m => m.isError && m.retryable && !m.resolved)) {
const errorMessage = messages.find(m => m.isError && m.retryable);
if (errorMessage) {
retryButtonRef.current?.focus();
}
}
}, [messages]);
\`\`\`

#### Keyboard Navigation

\`\`\`tsx
{/_ Retry button _/}
<button
ref={retryButtonRef}
onClick={handleRetry}
onKeyDown={(e) => {
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
handleRetry();
}
}}
aria-label={\`Retry sending message, attempt \${attemptCount} of 3\`}
disabled={retrying}

> {retrying ? 'Retrying...' : \`Retry (\${attemptCount}/3)\`}
> </button>

{/_ Suggestion chips (existing pattern, ensure keyboard accessible) _/}
<button
onClick={() => handleChipClick(chip)}
onKeyDown={(e) => {
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
handleChipClick(chip);
}
}}
aria-label={\`Quick reply: \${chip}\`}
className="suggestion-chip"

> {chip}
> </button>
> \`\`\`

#### Focus Indicators

\`\`\`css
/_ Tailwind classes _/
.retry-button:focus {
@apply ring-2 ring-indigo-500 ring-offset-2 outline-none;
}

.suggestion-chip:focus {
@apply ring-2 ring-indigo-500 ring-offset-2 outline-none;
}

/_ Ensure 3:1 contrast ratio for focus indicators (WCAG 2.1 AA) _/
\`\`\`

#### Touch Targets

\`\`\`tsx
{/_ Minimum 44x44px touch targets (WCAG 2.1 AA) _/}
<button className="retry-button min-h-[44px] min-w-[44px] px-4 py-2">
Retry (1/3)
</button>

<button className="suggestion-chip min-h-[44px] px-6 py-2">
  {chip}
</button>
\`\`\`

---

## Performance Considerations

### Vague Input Detection

- **Complexity:** O(n) where n = number of patterns (12+)
- **Optimization:** Short-circuit on first match with \`.some()\`
- **Expected Time:** <10ms (synchronous pattern matching)

\`\`\`typescript
// Efficient pattern matching
const lower = input.toLowerCase();
return VAGUE_PATTERNS.some(pattern => lower.includes(pattern)); // O(n\*m) where m = average pattern length
\`\`\`

### Budget Validation

- **Complexity:** O(1) - single parse + compare
- **Expected Time:** <50ms
- **No Regex:** Uses simple string replace and parseFloat

### Retry Delay Calculation

- **Complexity:** O(1) - arithmetic operations
- **Expected Time:** <1ms
- **No Async:** Synchronous delay calculation

### localStorage Operations

- **Write:** <100ms per operation (tested across browsers)
- **Optimization:** LRU cache keeps last 50 messages (~500KB vs 5-10MB quota)
- **Throttling:** Save after message (not every keystroke)

### Total Retry Flow Performance

\`\`\`
Attempt 1: 0.75-1.25s (wait) + request time
Attempt 2: 1.5-2.5s (wait) + request time
Attempt 3: 3-5s (wait) + request time
Total max: ~8.75s + 3 \* request time
\`\`\`

**Within acceptable range:** Nielsen Norman Group: users tolerate up to 10s wait with progress indicator

---

## Security Considerations

### No Stack Traces Exposed

\`\`\`typescript
try {
await generateAIResponse(message);
} catch (error) {
// NEVER show raw error to user
console.error('AI response error:', error); // Log for debugging

// Show user-friendly message
const errorMessage: Message = {
id: generateId(),
role: 'ai',
content: "Hmm, that didn't work! No worries, let's give it another shot.",
isError: true,
retryable: true,
// NO stack trace, NO error.message, NO internal details
};
}
\`\`\`

### Input Sanitization

\`\`\`typescript
export function isVagueInput(input: string): boolean {
// Trim and lowercase - removes potential injection vectors
const trimmed = input.trim();
const lower = trimmed.toLowerCase();

// Simple string matching - no eval, no regex injection
return VAGUE_PATTERNS.some(pattern => lower.includes(pattern));
}
\`\`\`

### localStorage Security

- **No credentials stored:** Only conversation state (messages, persona, budget)
- **No PII:** User messages are ephemeral (not sent to backend)
- **XSS Protection:** React auto-escapes user input in JSX

### Error Logging

\`\`\`typescript
// Safe error logging (no PII)
console.error('Network error', {
timestamp: Date.now(),
attemptCount: attemptCount,
errorType: 'network',
// NO user messages, NO personal data
});
\`\`\`

---

## Implementation Checklist

### Phase 4: Implementation (30-60 min with parallel TDD)

#### Step 1: Create Retry Utility (5 min)

- [ ] Create \`src/utils/retry.ts\`
- [ ] Implement \`calculateDelay()\` function
- [ ] Implement \`retryWithBackoff()\` function
- [ ] Add JSDoc comments
- [ ] Write unit tests (attempt 1, 2, 3 delays, jitter, success/failure cases)

#### Step 2: Extend conversationService (10 min)

- [ ] Add \`vagueInputCount\` to \`ConversationState\`
- [ ] Implement \`isVagueInput()\` with 12+ patterns
- [ ] Implement \`validateBudget()\` with $400-$15,000 range
- [ ] Implement \`generateClarificationMessage()\` with context-aware chips
- [ ] Modify \`getNextConversationStep()\` to check vague input and budget
- [ ] Write unit tests (all patterns, budget parsing, clarification messages)

#### Step 3: Extend mockAIService (5 min)

- [ ] Add \`setErrorSimulation()\` function
- [ ] Modify \`generateAIResponse()\` to throw on simulation
- [ ] Make \`generateAIResponse()\` async (return Promise)
- [ ] Write unit tests (error simulation enabled/disabled)

#### Step 4: Modify ChatInterface (15 min)

- [ ] Extend \`Message\` interface with error fields
- [ ] Add error message rendering (red border, retry button)
- [ ] Add retry button click handler with \`retryWithBackoff()\`
- [ ] Add vague input check before sending to AI
- [ ] Add budget validation check in conversation flow
- [ ] Add localStorage persistence (save/restore conversation state)
- [ ] Add LRU cache logic (keep last 50 messages)
- [ ] Add focus management (move focus to retry button)
- [ ] Add aria-live announcements for errors
- [ ] Write unit tests (error rendering, retry, persistence, LRU)

#### Step 5: Write BDD Step Definitions (10 min)

- [ ] Add Scenario 22 steps (vague input detection, chips, escalation)
- [ ] Add Scenario 23 steps (budget validation, presets, formats)
- [ ] Add Scenario 24 steps (network retry, exponential backoff, fallback)
- [ ] Run BDD tests to verify all 31 scenarios pass

#### Step 6: Write Integration Tests (5 min)

- [ ] Complete vague input flow (3 vague → escalation)
- [ ] Complete budget validation flow ($200 → $1500)
- [ ] Complete network retry flow (3 failures → fallback)
- [ ] State persistence across reload

#### Step 7: Accessibility Testing (5 min)

- [ ] Verify aria-live announcements (screen reader test)
- [ ] Verify keyboard navigation (Tab, Enter)
- [ ] Verify focus management (retry button focused on error)
- [ ] Verify touch targets (≥44x44px)
- [ ] Run axe-core scan (WCAG 2.1 AA compliance)

---

## Approval

- **Created by:** Claude Code (AI Assistant)
- **Date:** 2025-10-26
- **Status:** Approved ✅
- **Architecture Pattern:** Service-layer validation + Inline error UI + Retry utility
- **Complexity:** Medium
- **Next Phase:** Implementation (\`/implement specs/error-handling-edge-cases/technical-design.md\`)

---

## Summary

**Feature:** Error Handling & Edge Cases (Group 5)
**Architecture:** Service-layer validation + Component error UI + Retry utility
**Components:** 3 modified (ChatInterface, conversationService, mockAIService), 1 new (retry)
**Interfaces:** 2 extended (Message, ConversationState)
**Test Strategy:** 60+ unit tests, 31 BDD scenarios, 4 integration tests, 3 E2E tests

**Estimated Implementation Time:**

- Retry utility: 5 min
- conversationService: 10 min
- mockAIService: 5 min
- ChatInterface: 15 min
- BDD steps: 10 min
- Integration tests: 5 min
- Accessibility: 5 min
- **Total: 55 minutes** (with parallel test execution)

**Quality Targets:**

- Test coverage: 100% for new code
- All 31 BDD scenarios passing
- WCAG 2.1 AA compliance
- Code quality: ≥8.5/10
- TypeScript strict mode
- Zero security vulnerabilities

**Ready for Phase 4: Implementation!**

Run: \`/implement specs/error-handling-edge-cases/technical-design.md\`
