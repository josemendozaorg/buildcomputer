/**
 * Technical Terms Glossary
 *
 * Educational tooltips and explanations for technical PC building terms
 */

export interface TechnicalTerm {
  tooltip: string;
  fullExplanation?: string;
  learnMoreUrl?: string;
}

export const technicalTerms: Record<string, TechnicalTerm> = {
  // Graphics & Display
  "PCIe 4.0": {
    tooltip: "PCI Express 4.0 - High-speed connection standard",
    fullExplanation:
      "PCI Express (PCIe) 4.0 is the fourth generation of the PCIe interface standard. It provides double the bandwidth of PCIe 3.0, enabling faster data transfer between components like GPUs and SSDs.",
  },
  "PCIe 5.0": {
    tooltip: "PCI Express 5.0 - Latest high-speed connection standard",
    fullExplanation:
      "PCIe 5.0 doubles the bandwidth of PCIe 4.0, offering up to 32 GT/s per lane. Essential for next-gen GPUs and ultra-fast NVMe SSDs.",
  },
  "Ray Tracing": {
    tooltip: "Advanced lighting technique for realistic graphics",
    fullExplanation:
      "Ray tracing simulates realistic light behavior in 3D environments. Creates accurate reflections, shadows, and global illumination in games and rendering applications.",
  },
  DLSS: {
    tooltip: "Deep Learning Super Sampling - AI upscaling technology",
    fullExplanation:
      "NVIDIA's AI-powered upscaling technology that renders games at lower resolution then uses machine learning to upscale to higher resolution, boosting FPS while maintaining visual quality.",
  },

  // Memory
  DDR5: {
    tooltip: "5th generation Double Data Rate memory",
    fullExplanation:
      "DDR5 RAM offers higher bandwidth and lower power consumption than DDR4. Provides faster data transfer speeds, starting at 4800 MT/s compared to DDR4's 3200 MT/s.",
  },
  DDR4: {
    tooltip: "4th generation Double Data Rate memory",
    fullExplanation:
      "DDR4 RAM is the previous generation memory standard. More mature and affordable than DDR5, with speeds typically ranging from 2400-3600 MT/s.",
  },
  "16GB": {
    tooltip: "16 Gigabytes of memory capacity",
    fullExplanation:
      "16GB of RAM is the sweet spot for gaming and general productivity. Sufficient for most games and multitasking. Consider 32GB for heavy content creation or professional workloads.",
  },
  "32GB": {
    tooltip: "32 Gigabytes of memory capacity",
    fullExplanation:
      "32GB of RAM is ideal for content creation, video editing, 3D rendering, and heavy multitasking. Provides headroom for running multiple demanding applications simultaneously.",
  },

  // Storage
  NVMe: {
    tooltip: "Non-Volatile Memory Express - Fastest SSD interface",
    fullExplanation:
      "NVMe is a storage protocol designed for modern SSDs. Offers significantly faster speeds than SATA SSDs, with read/write speeds up to 7000+ MB/s on PCIe 4.0 drives.",
  },
  "1TB": {
    tooltip: "1 Terabyte storage capacity",
    fullExplanation:
      "1TB (1000GB) provides enough space for the operating system, applications, and several large games. Consider 2TB+ if you have a large game library or work with video files.",
  },
  "2TB": {
    tooltip: "2 Terabyte storage capacity",
    fullExplanation:
      "2TB offers ample storage for extensive game libraries, media files, and applications. Ideal for gamers and content creators who need extra space.",
  },

  // Power
  "850W": {
    tooltip: "850 Watt power supply capacity",
    fullExplanation:
      "850W PSU provides enough power for high-end gaming builds with powerful GPUs. Includes headroom for system stability and future upgrades.",
  },
  "750W": {
    tooltip: "750 Watt power supply capacity",
    fullExplanation:
      "750W PSU is suitable for mid to high-end gaming systems. Provides adequate power for most single-GPU configurations with modern CPUs.",
  },
  "650W": {
    tooltip: "650 Watt power supply capacity",
    fullExplanation:
      "650W PSU is ideal for mid-range gaming builds. Sufficient for mainstream GPUs like RTX 4060 Ti or RTX 4070 paired with modern CPUs.",
  },
  "80+ Gold": {
    tooltip: "80 PLUS Gold efficiency certification",
    fullExplanation:
      "80 PLUS Gold certified PSUs are at least 87% efficient at 20% load, 90% at 50% load, and 87% at 100% load. Better efficiency means less wasted electricity and heat.",
  },
  "80+ Platinum": {
    tooltip: "80 PLUS Platinum efficiency certification",
    fullExplanation:
      "80 PLUS Platinum certified PSUs achieve 90% efficiency at 20% load, 92% at 50% load, and 89% at 100% load. Premium efficiency for reduced power bills and heat output.",
  },

  // Processor
  "8-Core": {
    tooltip: "8 processing cores",
    fullExplanation:
      "8 cores provide excellent gaming and productivity performance. Handles multitasking, streaming while gaming, and content creation workloads efficiently.",
  },
  "16-Core": {
    tooltip: "16 processing cores",
    fullExplanation:
      "16 cores excel at heavily multithreaded workloads like video rendering, 3D modeling, and professional applications. Overkill for gaming alone.",
  },
  AM5: {
    tooltip: "AMD socket for Ryzen 7000+ series CPUs",
    fullExplanation:
      "AM5 is AMD's latest CPU socket supporting Ryzen 7000 and 9000 series processors. Features DDR5 and PCIe 5.0 support with upgrade path to future CPUs.",
  },
  "LGA 1700": {
    tooltip: "Intel socket for 12th, 13th, and 14th gen CPUs",
    fullExplanation:
      "LGA 1700 is Intel's current CPU socket for 12th gen (Alder Lake), 13th gen (Raptor Lake), and 14th gen (Raptor Lake Refresh) processors.",
  },

  // Cooling
  AIO: {
    tooltip: "All-In-One liquid cooler",
    fullExplanation:
      "AIO liquid coolers are pre-filled, sealed cooling systems with a radiator and pump. Provide better cooling than most air coolers, especially for high-end CPUs.",
  },
  "240mm": {
    tooltip: "240mm radiator size",
    fullExplanation:
      "240mm radiators accommodate two 120mm fans. Suitable for mid-range CPUs and compact builds. Larger radiators (280mm, 360mm) provide better cooling.",
  },
  "360mm": {
    tooltip: "360mm radiator size",
    fullExplanation:
      "360mm radiators accommodate three 120mm fans. Excellent cooling performance for high-end CPUs. Requires case support for top or front mounting.",
  },

  // Motherboard
  ATX: {
    tooltip: "Standard full-size motherboard form factor",
    fullExplanation:
      "ATX motherboards measure 12 x 9.6 inches. Offer the most expansion slots and features. Require mid-tower or full-tower cases.",
  },
  "Micro-ATX": {
    tooltip: "Compact motherboard form factor",
    fullExplanation:
      "Micro-ATX (mATX) motherboards are smaller than ATX at 9.6 x 9.6 inches. Fewer expansion slots but more compact. Fit in smaller cases.",
  },
  "WiFi 6": {
    tooltip: "Latest wireless networking standard",
    fullExplanation:
      "WiFi 6 (802.11ax) offers faster speeds, better performance in crowded areas, and improved battery efficiency compared to WiFi 5. Backward compatible with older devices.",
  },
  "WiFi 6E": {
    tooltip: "WiFi 6 Extended with 6GHz band support",
    fullExplanation:
      "WiFi 6E extends WiFi 6 into the 6GHz frequency band, providing additional channels for less congestion and higher speeds. Requires compatible router.",
  },
};

/**
 * Detect if a string contains a technical term
 */
export function detectTechnicalTerm(text: string): string | null {
  const normalizedText = text.trim();

  // Check for exact matches
  if (technicalTerms[normalizedText]) {
    return normalizedText;
  }

  // Check for terms contained in the text
  for (const term of Object.keys(technicalTerms)) {
    if (normalizedText.includes(term)) {
      return term;
    }
  }

  return null;
}
