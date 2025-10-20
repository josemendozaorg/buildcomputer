import { Build } from "../components/BuildCard";

interface PersonaBuildProfile {
  optimizedDescription: string;
  performanceDescription: string;
  featuredDescription: string;
}

const personaProfiles: Record<string, PersonaBuildProfile> = {
  "competitive-gamer": {
    optimizedDescription:
      "Best balance of performance and value for competitive gaming with high FPS",
    performanceDescription:
      "Maximum FPS and lowest latency for competitive advantage",
    featuredDescription:
      "Top-tier gaming experience with streaming capabilities",
  },
  creator: {
    optimizedDescription:
      "Balanced performance for video editing and content creation workflows",
    performanceDescription:
      "High-end rendering and multi-tasking for professional creators",
    featuredDescription:
      "Studio-grade performance for 4K video editing and 3D rendering",
  },
  "ai-enthusiast": {
    optimizedDescription:
      "Entry-level machine learning and AI experimentation setup",
    performanceDescription:
      "Serious AI training with high-performance GPU compute",
    featuredDescription: "Professional AI workstation with multi-GPU support",
  },
  "casual-gamer": {
    optimizedDescription: "Smooth 1080p gaming experience for popular titles",
    performanceDescription: "Excellent 1440p gaming with high settings",
    featuredDescription: "Premium 4K gaming and future-proof performance",
  },
  student: {
    optimizedDescription:
      "Reliable performance for schoolwork, coding, and light gaming",
    performanceDescription:
      "Enhanced productivity with faster compilation and multitasking",
    featuredDescription:
      "Professional-grade setup for advanced projects and internships",
  },
  "home-office": {
    optimizedDescription:
      "Efficient multitasking for productivity and video conferencing",
    performanceDescription:
      "Premium performance for demanding business applications",
    featuredDescription:
      "Executive-grade workstation with enterprise reliability",
  },
  streamer: {
    optimizedDescription:
      "Smooth streaming and gaming with dual PC-like performance",
    performanceDescription:
      "Professional streaming setup with encoding hardware",
    featuredDescription:
      "Top-tier streaming studio with zero compromise on quality",
  },
  "custom-build": {
    optimizedDescription: "Component-by-component customization (coming soon)",
    performanceDescription:
      "Advanced custom configuration options (coming soon)",
    featuredDescription: "Expert-level build customization (coming soon)",
  },
};

export function generateBuildRecommendations(
  personaId: string,
  budget: number,
): Build[] {
  const profile =
    personaProfiles[personaId] || personaProfiles["competitive-gamer"];

  // Calculate prices based on budget
  // Optimized: ~90% of budget
  // Performance: ~100% of budget
  // Featured: ~125% of budget (aspirational)
  const optimizedPrice = Math.round(budget * 0.9);
  const performancePrice = budget;
  const featuredPrice = Math.round(budget * 1.25);

  return [
    {
      id: "optimized",
      title: "Optimized Build",
      price: optimizedPrice,
      description: profile.optimizedDescription,
    },
    {
      id: "performance",
      title: "Performance Build",
      price: performancePrice,
      description: profile.performanceDescription,
    },
    {
      id: "featured",
      title: "Featured Build",
      price: featuredPrice,
      description: profile.featuredDescription,
    },
  ];
}
