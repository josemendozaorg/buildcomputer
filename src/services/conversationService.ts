/**
 * Conversation Service
 *
 * Manages multi-turn conversations with context awareness.
 * Guides users through PC building requirements using a structured flow.
 */

export interface ConversationState {
  step: number;
  useCase?: string;
  specificNeeds?: string;
  budgetRange?: number;
  context: Record<string, unknown>;
  completed: boolean;
  vagueInputCount: number;
  lastInputWasVague: boolean;
}

export interface ConversationResponse {
  message: string;
  chips?: string[];
  completed?: boolean;
  buildRecommendations?: boolean;
}

/**
 * Initialize new conversation state
 */
export function initConversationState(): ConversationState {
  return {
    step: 0,
    context: {},
    completed: false,
    vagueInputCount: 0,
    lastInputWasVague: false,
  };
}

/**
 * Get next conversation step response
 */
export function getNextConversationStep(
  state: ConversationState,
  userMessage?: string,
): ConversationResponse {
  // Store user message in context if provided
  if (userMessage) {
    state.context[`message_${state.step}`] = userMessage;
  }

  // Conversation flow based on step
  switch (state.step) {
    case 0:
      // Initial greeting (already shown)
      state.step = 1;
      return {
        message: "What will you mainly use it for?",
        chips: ["Gaming", "Work", "Content Creation", "Student", "AI/ML"],
      };

    case 1: {
      // Use case captured
      if (userMessage) {
        state.useCase = userMessage;
      }
      state.step = 2;

      // Context-aware follow-up based on use case
      const useCase = state.useCase || "";
      if (useCase.toLowerCase().includes("gaming")) {
        // Check for specific game mentions to provide context-aware response
        const lowerUseCase = useCase.toLowerCase();
        if (
          lowerUseCase.includes("valorant") ||
          lowerUseCase.includes("competitive")
        ) {
          const contextAwareMessage = generateContextAwareResponse(
            state,
            "What are your graphics needs?",
          );
          return {
            message: contextAwareMessage,
            chips: ["High FPS (240+)", "Medium FPS (144)", "60 FPS is fine"],
          };
        }
        return {
          message: "What type of gaming are you interested in?",
          chips: [
            "Competitive (High FPS)",
            "AAA Titles",
            "Casual",
            "VR Gaming",
          ],
        };
      } else if (useCase.toLowerCase().includes("work")) {
        return {
          message: "What kind of work will you be doing?",
          chips: ["Office Work", "Programming", "3D Modeling", "Video Editing"],
        };
      } else {
        return {
          message: "Tell me more about your specific needs.",
          chips: [
            "Performance",
            "Portability",
            "Budget-Friendly",
            "Future-Proof",
          ],
        };
      }
    }

    case 2:
      // Specific needs captured
      if (userMessage) {
        state.specificNeeds = userMessage;
      }
      state.step = 3;
      return {
        message: "What's your budget range?",
        chips: [
          "$500-$750",
          "$750-$1000",
          "$1000-$1500",
          "$1500-$2000",
          "$2000+",
        ],
      };

    case 3:
      // Budget captured
      if (userMessage) {
        const budgetMatch = userMessage.match(/\$?(\d+)/);
        if (budgetMatch && budgetMatch[1]) {
          state.budgetRange = parseInt(budgetMatch[1]);
        }
      }
      state.step = 4;
      state.completed = true;

      return {
        message: `Perfect! Based on your needs (${state.useCase} for ${state.specificNeeds}) with a budget around $${state.budgetRange || 1000}, I can recommend some great builds for you.`,
        completed: true,
        buildRecommendations: true,
      };

    default:
      return {
        message: "Thank you! Your build recommendations are ready.",
        completed: true,
        buildRecommendations: true,
      };
  }
}

/**
 * Parse user text input and extract relevant information
 */
export function parseUserInput(input: string): {
  useCase?: string;
  budget?: number;
  needs?: string;
} {
  const lowerInput = input.toLowerCase();
  const result: {
    useCase?: string;
    budget?: number;
    needs?: string;
  } = {};

  // Detect use case
  if (
    lowerInput.includes("game") ||
    lowerInput.includes("gaming") ||
    lowerInput.includes("play")
  ) {
    result.useCase = "Gaming";
  } else if (
    lowerInput.includes("work") ||
    lowerInput.includes("office") ||
    lowerInput.includes("productivity")
  ) {
    result.useCase = "Work";
  } else if (
    lowerInput.includes("video") ||
    lowerInput.includes("streaming") ||
    lowerInput.includes("content")
  ) {
    result.useCase = "Content Creation";
  } else if (
    lowerInput.includes("student") ||
    lowerInput.includes("school") ||
    lowerInput.includes("homework")
  ) {
    result.useCase = "Student";
  } else if (
    lowerInput.includes("ai") ||
    lowerInput.includes("machine learning") ||
    lowerInput.includes("data science")
  ) {
    result.useCase = "AI/ML";
  }

  // Extract budget
  const budgetMatch = input.match(/\$?(\d{3,5})/);
  if (budgetMatch && budgetMatch[1]) {
    result.budget = parseInt(budgetMatch[1]);
  }

  // Extract specific needs keywords
  if (
    lowerInput.includes("competitive") ||
    lowerInput.includes("esports") ||
    lowerInput.includes("fps")
  ) {
    result.needs = "Competitive Gaming";
  } else if (
    lowerInput.includes("editing") ||
    lowerInput.includes("rendering")
  ) {
    result.needs = "Video/3D Work";
  } else if (lowerInput.includes("budget") || lowerInput.includes("cheap")) {
    result.needs = "Budget-Friendly";
  }

  return result;
}

/**
 * Generate context-aware follow-up based on previous messages
 */
export function generateContextAwareResponse(
  state: ConversationState,
  currentQuestion: string,
): string {
  // Reference previous context from different steps
  const message1 = state.context["message_1"];
  const message2 = state.context["message_2"];

  // Check for Valorant mentions in earlier messages
  const valorantMentioned =
    (message1 &&
      typeof message1 === "string" &&
      message1.toLowerCase().includes("valorant")) ||
    (message2 &&
      typeof message2 === "string" &&
      message2.toLowerCase().includes("valorant"));

  if (valorantMentioned) {
    if (currentQuestion.includes("graphics")) {
      return "For Valorant, you'll want high FPS. What's your target frame rate?";
    }
  }

  return currentQuestion;
}

/**
 * Vague input patterns for detection (case-insensitive)
 * Expanded set of 12+ patterns as per user decision
 */
const VAGUE_PATTERNS = [
  "something good",
  "i don't know",
  "idk",
  "maybe",
  "whatever",
  "not sure",
  "dunno",
  "anything",
  "up to you",
  "doesn't matter",
  "i guess",
  "any",
];

/**
 * Check if user input is vague or unclear
 * Uses expanded pattern set (12+) with case-insensitive matching
 *
 * @param input - User's message input
 * @returns true if input is vague, false otherwise
 */
export function isVagueInput(input: string): boolean {
  const trimmed = input ? input.trim() : "";

  // Empty or very short input (single character)
  if (trimmed.length === 0 || trimmed.length === 1) {
    return true;
  }

  // Check against vague patterns (case-insensitive)
  const normalized = trimmed.toLowerCase();
  return VAGUE_PATTERNS.some((pattern) => normalized.includes(pattern));
}

/**
 * Budget validation result
 */
export interface BudgetValidationResult {
  valid: boolean;
  amount?: number;
  error?: "too_low" | "too_high" | "invalid_format";
  message?: string;
}

/**
 * Validate budget input and provide educational feedback
 * Range: $400 minimum, $15,000 maximum
 *
 * @param input - User's budget input (e.g., "$1000", "1k", "2500")
 * @returns Validation result with amount and error message if invalid
 */
export function validateBudget(input: string): BudgetValidationResult {
  if (!input) {
    return {
      valid: false,
      error: "invalid_format",
      message:
        "I didn't catch a budget amount. Could you share your budget range?",
    };
  }

  // Parse budget from various formats: $1000, 1k, 2.5k, $1,000
  let amount = 0;
  const normalized = input.replace(/,/g, "").toLowerCase();

  // Handle "k" suffix (e.g., "1k" = 1000)
  const kMatch = normalized.match(/(\d+(?:\.\d+)?)\s*k/);
  if (kMatch && kMatch[1]) {
    amount = Math.floor(parseFloat(kMatch[1]) * 1000);
  } else {
    // Handle regular numbers (e.g., "$1000", "1500")
    const numberMatch = normalized.match(/\$?(\d+)/);
    if (numberMatch && numberMatch[1]) {
      amount = parseInt(numberMatch[1]);
    }
  }

  // If no valid number found
  if (amount === 0 || isNaN(amount)) {
    return {
      valid: false,
      error: "invalid_format",
      message:
        "Hmm, I couldn't parse that budget. Could you try something like '$1000' or '1500'?",
    };
  }

  // Check minimum threshold
  if (amount < 400) {
    return {
      valid: false,
      amount,
      error: "too_low",
      message: `Building a complete PC under $400 is super challenging because modern CPUs, motherboards, RAM, and storage alone typically cost $450-500 minimum. I can design awesome builds from $400 to $15,000. What budget works for you?`,
    };
  }

  // Check maximum threshold
  if (amount > 15000) {
    return {
      valid: false,
      amount,
      error: "too_high",
      message: `Whoa, $${amount.toLocaleString()} is way beyond typical PC builds! Most high-end systems max out around $5,000-8,000. I work best with budgets up to $15,000. Want to try something in that range?`,
    };
  }

  // Valid budget
  return {
    valid: true,
    amount,
  };
}

/**
 * Generate clarification message when vague input is detected
 * Provides context-aware suggestion chips based on conversation step
 *
 * @param state - Current conversation state
 * @param vagueCount - Number of consecutive vague inputs
 * @returns ConversationResponse with clarification and chips
 */
export function generateClarificationMessage(
  state: ConversationState,
  vagueCount: number,
): ConversationResponse {
  // After 3 consecutive vague inputs, escalate to guided prompts
  if (vagueCount >= 3) {
    return {
      message:
        "Having trouble? Let me ask specific questions instead to help you out!",
      chips: [
        "What will you use the PC for?",
        "What's your budget range?",
        "Do you have a preferred brand?",
        "Start over",
      ],
    };
  }

  // Context-aware clarification based on current step
  switch (state.step) {
    case 0:
    case 1:
      // Asking about use case
      return {
        message:
          "I'd love to help! Are you looking for gaming, work, or content creation?",
        chips: [
          "I want a gaming PC",
          "Help me decide",
          "I need it for work",
          "Content creation",
        ],
      };

    case 2:
      // Asking about specific needs
      return {
        message:
          "Could you share a bit more detail about what you're looking for?",
        chips: [
          "Performance",
          "Budget-friendly",
          "Quiet operation",
          "RGB lighting",
        ],
      };

    case 3:
      // Asking about budget
      return {
        message:
          "What's your budget range? This helps me recommend the right builds.",
        chips: ["Under $1000", "$1000-$2000", "$2000+", "I'm not sure"],
      };

    default:
      // Generic clarification
      return {
        message:
          "I didn't quite catch that. Could you share a bit more detail?",
        chips: ["Start over", "Help me decide", "Show me options"],
      };
  }
}

/**
 * Get budget guidance response with preset chip options
 * Called when budget validation fails
 *
 * @param error - Budget validation error type
 * @returns ConversationResponse with guidance and preset chips
 */
export function getBudgetGuidanceResponse(
  error: "too_low" | "too_high",
): ConversationResponse {
  if (error === "too_low") {
    return {
      message:
        "For a complete build, budgets under $400 are tough. I'd recommend starting at $400 for a solid entry-level system!",
      chips: ["$400", "$750", "$1000", "$1500", "Custom"],
    };
  } else {
    // too_high
    return {
      message:
        "That's quite a budget! Most builds top out around $8,000. I can help with budgets up to $15,000.",
      chips: ["$1500", "$3000", "$5000", "$8000", "Custom"],
    };
  }
}
