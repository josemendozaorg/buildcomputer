/**
 * Mock AI Service
 *
 * Simulates AI responses for the conversational builder.
 * Uses keyword matching to detect user intent and suggest personas.
 * Supports network error simulation for testing.
 */

export interface AIMessage {
  content: string;
  suggestions?: PersonaSuggestion;
}

/**
 * Error simulation flag (for testing)
 */
let shouldSimulateError = false;

/**
 * Enable or disable network error simulation
 * @param enabled - Whether to simulate network errors
 */
export function simulateNetworkError(enabled: boolean): void {
  shouldSimulateError = enabled;
}

export interface PersonaSuggestion {
  personaId: string;
  personaName: string;
  message: string;
  acceptLabel: string;
  declineLabel: string;
}

/**
 * Persona detection keywords
 */
const PERSONA_KEYWORDS = {
  "competitive-gamer": [
    "competitive",
    "esports",
    "valorant",
    "cs:go",
    "league",
    "fps",
    "high fps",
    "144hz",
    "240hz",
    "low latency",
  ],
  "casual-gamer": ["gaming", "games", "play", "casual", "fun"],
  "content-creator": [
    "youtube",
    "streaming",
    "video editing",
    "content",
    "creator",
    "obs",
    "premiere",
  ],
  workstation: [
    "work",
    "office",
    "productivity",
    "business",
    "excel",
    "coding",
    "programming",
  ],
  student: [
    "student",
    "school",
    "homework",
    "study",
    "research",
    "budget",
    "cheap",
  ],
  "ai-ml": [
    "ai",
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "data science",
  ],
};

/**
 * Detect persona from user message
 */
export function detectPersona(message: string): string | null {
  const lowerMessage = message.toLowerCase();

  // Check each persona's keywords
  for (const [personaId, keywords] of Object.entries(PERSONA_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        return personaId;
      }
    }
  }

  return null;
}

/**
 * Get persona display name
 */
function getPersonaName(personaId: string): string {
  const names: Record<string, string> = {
    "competitive-gamer": "Competitive Gamer",
    "casual-gamer": "Casual Gamer",
    "content-creator": "Content Creator",
    workstation: "Workstation",
    student: "Student / Budget Build",
    "ai-ml": "AI/ML Workstation",
  };
  return names[personaId] || personaId;
}

/**
 * Generate AI response with optional persona suggestion
 * @throws Error if network error simulation is enabled
 */
export async function generateAIResponse(
  userMessage: string,
): Promise<AIMessage> {
  // Simulate network error if enabled
  if (shouldSimulateError) {
    throw new Error("Network error: Failed to connect to AI service");
  }

  // Simulate network delay (100-300ms)
  const delay = 100 + Math.random() * 200;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const detectedPersona = detectPersona(userMessage);

  if (detectedPersona) {
    const personaName = getPersonaName(detectedPersona);
    return {
      content: `You sound like a ${personaName.toLowerCase()}! Want to see optimized builds?`,
      suggestions: {
        personaId: detectedPersona,
        personaName,
        message: `I've detected you might be interested in ${personaName} builds. Would you like to see optimized recommendations?`,
        acceptLabel: "Yes, show me builds",
        declineLabel: "No, continue chatting",
      },
    };
  }

  // Default response for messages without persona detection
  return {
    content:
      "Tell me more about what you'll use the PC for. This helps me recommend the best components!",
  };
}
