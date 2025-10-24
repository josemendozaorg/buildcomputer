/**
 * Detailed Component Information
 *
 * Provides in-depth educational content about specific PC components
 */

export interface ComponentDetails {
  description: string;
  whenToChoose: string;
  performanceTier: string;
}

export const componentDetailsData: Record<string, ComponentDetails> = {
  // GPUs
  "RTX 4090": {
    description:
      "NVIDIA's flagship gaming GPU with 24GB GDDR6X memory. Exceptional for 4K gaming, ray tracing, and professional workloads.",
    whenToChoose:
      "Choose this GPU when you need the absolute best performance for 4K gaming at maximum settings, content creation, or AI/ML workloads.",
    performanceTier: "Ultra-High End",
  },
  "RTX 4080": {
    description:
      "High-end GPU with 16GB GDDR6X memory. Excellent 4K performance with ray tracing capabilities.",
    whenToChoose:
      "Ideal for 4K gaming and high-refresh 1440p gaming. Great balance of power and value for enthusiasts.",
    performanceTier: "High End",
  },
  "RTX 4070": {
    description:
      "Upper mid-range GPU with 12GB GDDR6X memory. Strong 1440p performance and capable 4K gaming.",
    whenToChoose:
      "Perfect for 1440p gaming at high refresh rates or 4K gaming at 60fps. Excellent value for performance.",
    performanceTier: "Upper Mid-Range",
  },
  "RTX 4060": {
    description:
      "Mid-range GPU with 8GB GDDR6 memory. Solid 1080p and entry-level 1440p gaming.",
    whenToChoose:
      "Great for 1080p gaming at high settings or competitive gaming at high frame rates.",
    performanceTier: "Mid-Range",
  },

  // CPUs
  "Ryzen 9 7950X": {
    description:
      "AMD's flagship 16-core processor. Outstanding for gaming, content creation, and multitasking.",
    whenToChoose:
      "Choose this when you need top-tier gaming performance combined with excellent productivity capabilities.",
    performanceTier: "Flagship",
  },
  "Ryzen 7 7800X3D": {
    description:
      "8-core gaming-focused CPU with 3D V-Cache technology. Best gaming performance available.",
    whenToChoose:
      "The ultimate choice for competitive gaming and high-FPS gaming. Unmatched gaming performance.",
    performanceTier: "Gaming Flagship",
  },
  "Core i7-14700K": {
    description:
      "Intel's high-end 20-core processor. Excellent all-around performance for gaming and productivity.",
    whenToChoose:
      "Great for users who want strong gaming performance with solid multi-threaded productivity.",
    performanceTier: "High End",
  },
  "Ryzen 5 7600X": {
    description:
      "6-core mainstream CPU. Strong gaming performance with good value.",
    whenToChoose:
      "Perfect for gaming-focused builds on a budget. Excellent 1080p and 1440p gaming performance.",
    performanceTier: "Mid-Range",
  },
};
