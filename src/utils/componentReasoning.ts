/**
 * Component Reasoning
 *
 * Explains why specific components were chosen for a build
 */

export interface ComponentReasoning {
  reason: string;
  performanceImpact: string;
  alternatives: string[];
}

export const componentReasoningData: Record<string, ComponentReasoning> = {
  "AMD Ryzen 7 7800X3D": {
    reason:
      "I chose Ryzen 7 7800X3D because you need high FPS for competitive gaming. The 3D V-Cache provides unmatched gaming performance.",
    performanceImpact:
      "Delivers 10-15% better gaming performance than alternatives at high refresh rates",
    alternatives: [
      "Core i7-14700K (better productivity)",
      "Ryzen 7 7700X (better value)",
    ],
  },
  "NVIDIA GeForce RTX 4070": {
    reason:
      "I chose RTX 4070 for excellent 1440p gaming performance with ray tracing capabilities, perfect for your gaming needs.",
    performanceImpact:
      "Provides 60+ FPS at 1440p ultra settings in modern games",
    alternatives: ["RTX 4060 Ti (budget option)", "RTX 4080 (4K gaming)"],
  },
  "NVIDIA GeForce RTX 4090": {
    reason:
      "I chose RTX 4090 for maximum performance in 4K gaming and content creation workloads.",
    performanceImpact: "Best-in-class performance, 50% faster than RTX 4080",
    alternatives: ["RTX 4080 (better value)", "RTX 4070 Ti (mid-range)"],
  },
};
