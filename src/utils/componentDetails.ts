/**
 * Detailed Component Information
 *
 * Provides in-depth educational content about specific PC components
 */

export interface AdvancedSpecs {
  clockSpeed?: string;
  boostClock?: string;
  tdp?: string;
  architecture?: string;
  cores?: string;
  threads?: string;
  cache?: string;
  memoryType?: string;
  memorySpeed?: string;
  other?: Record<string, string>;
}

export interface ComponentDetails {
  description: string;
  whenToChoose: string;
  performanceTier: string;
  advancedSpecs?: AdvancedSpecs;
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
    advancedSpecs: {
      clockSpeed: "1920 MHz",
      boostClock: "2475 MHz",
      tdp: "200W",
      architecture: "Ada Lovelace (TSMC 4N)",
      cores: "5888 CUDA cores",
      memoryType: "12GB GDDR6X",
      memorySpeed: "21 Gbps",
      other: {
        "Memory Bus": "192-bit",
        "RT Cores": "46 (3rd gen)",
        "Tensor Cores": "184 (4th gen)",
      },
    },
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
    advancedSpecs: {
      clockSpeed: "4.2 GHz base",
      boostClock: "5.0 GHz max",
      tdp: "120W",
      architecture: "Zen 4 (TSMC 5nm)",
      cores: "8 cores",
      threads: "16 threads",
      cache: "96MB total (32MB L3 + 64MB 3D V-Cache)",
      other: {
        Socket: "AM5",
        "PCIe Support": "PCIe 5.0",
        "Memory Support": "DDR5-5200",
      },
    },
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
