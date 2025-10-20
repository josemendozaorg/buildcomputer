/**
 * Persona Type Definitions
 *
 * Defines the data structure for PC builder personas
 */

export interface Persona {
  id: string;
  title: string;
  tagline: string;
  examples: string;
  icon: string;
}

export const PERSONAS: Persona[] = [
  {
    id: "competitive-gamer",
    title: "Competitive Gamer",
    tagline: "Win every fight",
    examples: "Valorant, CS2, Apex at 144+ FPS",
    icon: "🎮",
  },
  {
    id: "cinematic-gamer",
    title: "Cinematic Gamer",
    tagline: "Live the story",
    examples: "Cyberpunk, RDR2 with ray tracing",
    icon: "🎬",
  },
  {
    id: "creator",
    title: "Creator",
    tagline: "Bring ideas to life",
    examples: "4K video editing, 3D rendering",
    icon: "🎨",
  },
  {
    id: "ai-enthusiast",
    title: "AI Enthusiast",
    tagline: "Train the future",
    examples: "Local LLM, ML model training",
    icon: "🤖",
  },
  {
    id: "student",
    title: "Student",
    tagline: "Study smarter",
    examples: "Academic work, research, multi-tasking",
    icon: "📚",
  },
  {
    id: "professional",
    title: "Professional",
    tagline: "Work without limits",
    examples: "CAD, simulations, complex workflows",
    icon: "💼",
  },
  {
    id: "casual-user",
    title: "Casual User",
    tagline: "Daily essentials",
    examples: "Browse, stream, light gaming",
    icon: "🏠",
  },
  {
    id: "custom-build",
    title: "Custom Build",
    tagline: "I know what I need",
    examples: "Component-by-component customization",
    icon: "🔧",
  },
];
