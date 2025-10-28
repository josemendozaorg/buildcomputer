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
  // CPUs
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
  "AMD Ryzen 7 7700X": {
    reason:
      "I chose Ryzen 7 7700X for excellent gaming performance with great value. It offers 8 cores and high clock speeds perfect for competitive gaming.",
    performanceImpact:
      "Delivers smooth high-FPS gaming and excellent multi-threaded performance for streaming",
    alternatives: [
      "Ryzen 7 7800X3D (better gaming)",
      "Intel Core i5-14600K (budget option)",
    ],
  },
  "Intel Core i7-14700K": {
    reason:
      "I chose Core i7-14700K for balanced gaming and productivity performance with 20 cores for multitasking.",
    performanceImpact:
      "Excellent for gaming while streaming or content creation workloads",
    alternatives: [
      "Ryzen 7 7800X3D (better gaming)",
      "Core i5-14600K (better value)",
    ],
  },
  "AMD Ryzen 5 7600X": {
    reason:
      "I chose Ryzen 5 7600X for great gaming performance at a competitive price point.",
    performanceImpact:
      "Delivers 1080p and 1440p gaming performance close to higher-end CPUs",
    alternatives: [
      "Intel Core i5-14600K (more cores)",
      "Ryzen 7 7700X (higher tier)",
    ],
  },

  // GPUs
  "NVIDIA GeForce RTX 4070": {
    reason:
      "I chose RTX 4070 for excellent 1440p gaming performance with ray tracing capabilities, perfect for your gaming needs.",
    performanceImpact:
      "Provides 60+ FPS at 1440p ultra settings in modern games",
    alternatives: ["RTX 4060 Ti (budget option)", "RTX 4080 (4K gaming)"],
  },
  "NVIDIA GeForce RTX 4070 SUPER": {
    reason:
      "I chose RTX 4070 SUPER for enhanced 1440p and capable 4K gaming with excellent ray tracing performance.",
    performanceImpact:
      "15% faster than RTX 4070, handles 1440p ultra at 90+ FPS in most titles",
    alternatives: [
      "RTX 4070 (budget option)",
      "RTX 4080 SUPER (4K enthusiast)",
    ],
  },
  "NVIDIA GeForce RTX 4090": {
    reason:
      "I chose RTX 4090 for maximum performance in 4K gaming and content creation workloads.",
    performanceImpact: "Best-in-class performance, 50% faster than RTX 4080",
    alternatives: ["RTX 4080 (better value)", "RTX 4070 Ti (mid-range)"],
  },
  "NVIDIA GeForce RTX 4060 Ti": {
    reason:
      "I chose RTX 4060 Ti for solid 1080p gaming and entry-level 1440p performance at a great price.",
    performanceImpact:
      "Handles 1080p ultra settings at 100+ FPS in esports titles",
    alternatives: [
      "RTX 4070 (better 1440p)",
      "RTX 3060 Ti (budget alternative)",
    ],
  },

  // RAM
  "G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5-6000": {
    reason:
      "I chose this RAM for high-speed DDR5 that perfectly matches your CPU and provides excellent gaming performance.",
    performanceImpact:
      "DDR5-6000 provides optimal performance for AMD Ryzen 7000 series CPUs",
    alternatives: [
      "Corsair Vengeance DDR5-5600 (budget)",
      "Kingston Fury DDR5-6400 (higher speed)",
    ],
  },
  "Corsair Vengeance RGB 32GB (2x16GB) DDR5-5600": {
    reason:
      "I chose this RAM for reliable DDR5 performance at a great value with good RGB aesthetics.",
    performanceImpact:
      "DDR5-5600 provides excellent gaming performance with room for overclocking",
    alternatives: [
      "G.Skill Trident Z5 DDR5-6000 (higher speed)",
      "Kingston Fury DDR5-5200 (budget)",
    ],
  },

  // Storage
  "Samsung 980 Pro 1TB NVMe SSD": {
    reason:
      "I chose the Samsung 980 Pro for blazing-fast game load times and reliable performance with PCIe 4.0 speeds.",
    performanceImpact:
      "7,000 MB/s read speeds mean instant game loading and smooth gameplay",
    alternatives: [
      "WD Black SN850X (alternative flagship)",
      "Samsung 970 EVO Plus (budget PCIe 3.0)",
    ],
  },
  "WD Black SN850X 1TB NVMe SSD": {
    reason:
      "I chose the WD Black SN850X for top-tier gaming performance with excellent sustained speeds.",
    performanceImpact:
      "Optimized for gaming with consistent performance even during long sessions",
    alternatives: [
      "Samsung 980 Pro (alternative flagship)",
      "Kingston KC3000 (budget option)",
    ],
  },
};
