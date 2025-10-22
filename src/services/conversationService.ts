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
  // Reference previous context
  const message2 = state.context["message_2"];

  if (
    message2 &&
    typeof message2 === "string" &&
    message2.toLowerCase().includes("valorant")
  ) {
    if (currentQuestion.includes("graphics")) {
      return "For Valorant, you'll want high FPS. What's your target frame rate?";
    }
  }

  return currentQuestion;
}
