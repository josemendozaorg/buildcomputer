/**
 * Component Database
 *
 * Real PC components organized by budget tier and persona
 * Prices are approximate retail prices as of 2024-2025
 */

import { Component } from "../types/components";

/**
 * Select components for a specific build tier and persona
 */
export function selectComponents(
  persona: string,
  budgetTier: "optimized" | "performance" | "featured",
  _totalBudget: number,
): Component[] {
  // Budget allocation percentages - reserved for future dynamic component selection
  // For gaming: prioritize GPU (40% budget)
  // For creation: balance CPU/GPU (30% each)
  // For AI: prioritize GPU (45% budget)

  if (budgetTier === "optimized") {
    return getOptimizedComponents(persona);
  } else if (budgetTier === "performance") {
    return getPerformanceComponents(persona);
  } else {
    return getFeaturedComponents(persona);
  }
}

function getOptimizedComponents(persona: string): Component[] {
  // Budget-conscious builds (~$1500-$1800 range)
  const isGaming = ["competitive-gamer", "casual-gamer", "streamer"].includes(
    persona,
  );

  if (isGaming) {
    return [
      {
        type: "CPU",
        name: "AMD Ryzen 5 7600X",
        brand: "AMD",
        price: 229,
        specs: {
          cores: "6",
          threads: "12",
          "base clock": "4.7 GHz",
          "boost clock": "5.3 GHz",
        },
      },
      {
        type: "GPU",
        name: "NVIDIA GeForce RTX 4060 Ti",
        brand: "NVIDIA",
        price: 449,
        specs: {
          vram: "8GB GDDR6",
          "boost clock": "2.54 GHz",
          "ray tracing": "Yes",
        },
      },
      {
        type: "RAM",
        name: "G.Skill Ripjaws S5 32GB DDR5-6000",
        brand: "G.Skill",
        price: 109,
        specs: {
          capacity: "32GB",
          speed: "DDR5-6000",
          latency: "CL30",
        },
      },
      {
        type: "Storage",
        name: "Samsung 980 Pro 1TB NVMe SSD",
        brand: "Samsung",
        price: 89,
        specs: {
          capacity: "1TB",
          interface: "PCIe 4.0 NVMe",
          "read speed": "7,000 MB/s",
        },
      },
    ];
  } else if (persona === "creator") {
    return [
      {
        type: "CPU",
        name: "AMD Ryzen 7 7700X",
        brand: "AMD",
        price: 329,
        specs: {
          cores: "8",
          threads: "16",
          "base clock": "4.5 GHz",
          "boost clock": "5.4 GHz",
        },
      },
      {
        type: "GPU",
        name: "NVIDIA GeForce RTX 4060",
        brand: "NVIDIA",
        price: 299,
        specs: {
          vram: "8GB GDDR6",
          "cuda cores": "3,072",
          "rt cores": "24",
        },
      },
      {
        type: "RAM",
        name: "Corsair Vengeance 32GB DDR5-5600",
        brand: "Corsair",
        price: 119,
        specs: {
          capacity: "32GB",
          speed: "DDR5-5600",
          latency: "CL36",
        },
      },
      {
        type: "Storage",
        name: "WD Black SN850X 1TB NVMe SSD",
        brand: "Western Digital",
        price: 99,
        specs: {
          capacity: "1TB",
          interface: "PCIe 4.0 NVMe",
          "read speed": "7,300 MB/s",
        },
      },
    ];
  } else {
    // Default: student, home-office, etc.
    return [
      {
        type: "CPU",
        name: "AMD Ryzen 5 7600",
        brand: "AMD",
        price: 199,
        specs: {
          cores: "6",
          threads: "12",
          "base clock": "3.8 GHz",
          "boost clock": "5.1 GHz",
        },
      },
      {
        type: "GPU",
        name: "AMD Radeon RX 7600",
        brand: "AMD",
        price: 269,
        specs: {
          vram: "8GB GDDR6",
          "stream processors": "2,048",
        },
      },
      {
        type: "RAM",
        name: "TEAMGROUP T-Force 32GB DDR5-5200",
        brand: "TEAMGROUP",
        price: 89,
        specs: {
          capacity: "32GB",
          speed: "DDR5-5200",
          latency: "CL38",
        },
      },
      {
        type: "Storage",
        name: "Kingston NV2 1TB NVMe SSD",
        brand: "Kingston",
        price: 69,
        specs: {
          capacity: "1TB",
          interface: "PCIe 4.0 NVMe",
          "read speed": "3,500 MB/s",
        },
      },
    ];
  }
}

function getPerformanceComponents(persona: string): Component[] {
  // Mid-range builds (~$2000-$2500 range)
  const isGaming = ["competitive-gamer", "casual-gamer", "streamer"].includes(
    persona,
  );

  if (isGaming) {
    return [
      {
        type: "CPU",
        name: "AMD Ryzen 7 7800X3D",
        brand: "AMD",
        price: 449,
        specs: {
          cores: "8",
          threads: "16",
          "base clock": "4.2 GHz",
          "boost clock": "5.0 GHz",
          "3D V-Cache": "96MB",
        },
      },
      {
        type: "GPU",
        name: "NVIDIA GeForce RTX 4070",
        brand: "NVIDIA",
        price: 599,
        specs: {
          vram: "12GB GDDR6X",
          "cuda cores": "5,888",
          "boost clock": "2.48 GHz",
        },
      },
      {
        type: "RAM",
        name: "G.Skill Trident Z5 32GB DDR5-6400",
        brand: "G.Skill",
        price: 139,
        specs: {
          capacity: "32GB",
          speed: "DDR5-6400",
          latency: "CL32",
        },
      },
      {
        type: "Storage",
        name: "Samsung 990 Pro 2TB NVMe SSD",
        brand: "Samsung",
        price: 179,
        specs: {
          capacity: "2TB",
          interface: "PCIe 4.0 NVMe",
          "read speed": "7,450 MB/s",
        },
      },
    ];
  } else if (persona === "creator") {
    return [
      {
        type: "CPU",
        name: "AMD Ryzen 9 7900X",
        brand: "AMD",
        price: 429,
        specs: {
          cores: "12",
          threads: "24",
          "base clock": "4.7 GHz",
          "boost clock": "5.4 GHz",
        },
      },
      {
        type: "GPU",
        name: "NVIDIA GeForce RTX 4070 Ti",
        brand: "NVIDIA",
        price: 799,
        specs: {
          vram: "12GB GDDR6X",
          "cuda cores": "7,680",
          "tensor cores": "240",
        },
      },
      {
        type: "RAM",
        name: "Corsair Dominator 64GB DDR5-6000",
        brand: "Corsair",
        price: 249,
        specs: {
          capacity: "64GB",
          speed: "DDR5-6000",
          latency: "CL30",
        },
      },
      {
        type: "Storage",
        name: "WD Black SN850X 2TB NVMe SSD",
        brand: "Western Digital",
        price: 189,
        specs: {
          capacity: "2TB",
          interface: "PCIe 4.0 NVMe",
          "read speed": "7,300 MB/s",
        },
      },
    ];
  } else {
    return [
      {
        type: "CPU",
        name: "AMD Ryzen 7 7700",
        brand: "AMD",
        price: 299,
        specs: {
          cores: "8",
          threads: "16",
          "base clock": "3.8 GHz",
          "boost clock": "5.3 GHz",
        },
      },
      {
        type: "GPU",
        name: "AMD Radeon RX 7700 XT",
        brand: "AMD",
        price: 449,
        specs: {
          vram: "12GB GDDR6",
          "stream processors": "3,456",
        },
      },
      {
        type: "RAM",
        name: "Corsair Vengeance 32GB DDR5-6000",
        brand: "Corsair",
        price: 129,
        specs: {
          capacity: "32GB",
          speed: "DDR5-6000",
          latency: "CL30",
        },
      },
      {
        type: "Storage",
        name: "Crucial P5 Plus 1TB NVMe SSD",
        brand: "Crucial",
        price: 99,
        specs: {
          capacity: "1TB",
          interface: "PCIe 4.0 NVMe",
          "read speed": "6,600 MB/s",
        },
      },
    ];
  }
}

function getFeaturedComponents(persona: string): Component[] {
  // High-end builds (~$2500-$3000+ range)
  const isGaming = ["competitive-gamer", "casual-gamer", "streamer"].includes(
    persona,
  );

  if (isGaming) {
    return [
      {
        type: "CPU",
        name: "AMD Ryzen 9 7950X3D",
        brand: "AMD",
        price: 699,
        specs: {
          cores: "16",
          threads: "32",
          "base clock": "4.2 GHz",
          "boost clock": "5.7 GHz",
          "3D V-Cache": "128MB",
        },
      },
      {
        type: "GPU",
        name: "NVIDIA GeForce RTX 4080",
        brand: "NVIDIA",
        price: 1199,
        specs: {
          vram: "16GB GDDR6X",
          "cuda cores": "9,728",
          "boost clock": "2.51 GHz",
        },
      },
      {
        type: "RAM",
        name: "G.Skill Trident Z5 RGB 64GB DDR5-6400",
        brand: "G.Skill",
        price: 279,
        specs: {
          capacity: "64GB",
          speed: "DDR5-6400",
          latency: "CL32",
        },
      },
      {
        type: "Storage",
        name: "Samsung 990 Pro 4TB NVMe SSD",
        brand: "Samsung",
        price: 349,
        specs: {
          capacity: "4TB",
          interface: "PCIe 4.0 NVMe",
          "read speed": "7,450 MB/s",
        },
      },
    ];
  } else if (persona === "creator") {
    return [
      {
        type: "CPU",
        name: "AMD Ryzen 9 7950X",
        brand: "AMD",
        price: 649,
        specs: {
          cores: "16",
          threads: "32",
          "base clock": "4.5 GHz",
          "boost clock": "5.7 GHz",
        },
      },
      {
        type: "GPU",
        name: "NVIDIA GeForce RTX 4090",
        brand: "NVIDIA",
        price: 1599,
        specs: {
          vram: "24GB GDDR6X",
          "cuda cores": "16,384",
          "tensor cores": "512",
        },
      },
      {
        type: "RAM",
        name: "Corsair Dominator Platinum 128GB DDR5-6000",
        brand: "Corsair",
        price: 549,
        specs: {
          capacity: "128GB",
          speed: "DDR5-6000",
          latency: "CL30",
        },
      },
      {
        type: "Storage",
        name: "Samsung 990 Pro 4TB NVMe SSD",
        brand: "Samsung",
        price: 349,
        specs: {
          capacity: "4TB",
          interface: "PCIe 4.0 NVMe",
          "read speed": "7,450 MB/s",
        },
      },
    ];
  } else if (persona === "ai-enthusiast") {
    return [
      {
        type: "CPU",
        name: "AMD Ryzen 9 7950X",
        brand: "AMD",
        price: 649,
        specs: {
          cores: "16",
          threads: "32",
          "base clock": "4.5 GHz",
          "boost clock": "5.7 GHz",
        },
      },
      {
        type: "GPU",
        name: "NVIDIA GeForce RTX 4090",
        brand: "NVIDIA",
        price: 1599,
        specs: {
          vram: "24GB GDDR6X",
          "cuda cores": "16,384",
          "tensor cores": "512",
          "fp16 performance": "165 TFLOPS",
        },
      },
      {
        type: "RAM",
        name: "G.Skill Trident Z5 96GB DDR5-6000",
        brand: "G.Skill",
        price: 399,
        specs: {
          capacity: "96GB",
          speed: "DDR5-6000",
          latency: "CL30",
        },
      },
      {
        type: "Storage",
        name: "Samsung 990 Pro 2TB NVMe SSD",
        brand: "Samsung",
        price: 179,
        specs: {
          capacity: "2TB",
          interface: "PCIe 4.0 NVMe",
          "read speed": "7,450 MB/s",
        },
      },
    ];
  } else {
    return [
      {
        type: "CPU",
        name: "AMD Ryzen 9 7900",
        brand: "AMD",
        price: 429,
        specs: {
          cores: "12",
          threads: "24",
          "base clock": "3.7 GHz",
          "boost clock": "5.4 GHz",
        },
      },
      {
        type: "GPU",
        name: "AMD Radeon RX 7900 XT",
        brand: "AMD",
        price: 899,
        specs: {
          vram: "20GB GDDR6",
          "stream processors": "5,376",
        },
      },
      {
        type: "RAM",
        name: "Corsair Vengeance 64GB DDR5-6000",
        brand: "Corsair",
        price: 249,
        specs: {
          capacity: "64GB",
          speed: "DDR5-6000",
          latency: "CL30",
        },
      },
      {
        type: "Storage",
        name: "WD Black SN850X 2TB NVMe SSD",
        brand: "Western Digital",
        price: 189,
        specs: {
          capacity: "2TB",
          interface: "PCIe 4.0 NVMe",
          "read speed": "7,300 MB/s",
        },
      },
    ];
  }
}
