/**
 * Component Tooltips
 *
 * Provides educational tooltips for PC components
 */

import { ComponentType } from "../types/components";

export const componentTooltips: Record<ComponentType, string> = {
  CPU: "Central processor that executes instructions and handles calculations",
  GPU: "Graphics card that renders images and games",
  RAM: "Temporary memory for running applications and multitasking",
  Storage: "Hard drive or SSD that stores your files and operating system",
  Motherboard: "Main circuit board that connects all components together",
  PSU: "Power supply that provides electricity to all components",
  Case: "Enclosure that houses and protects all components",
  Cooling: "Fans and heatsinks that keep components at safe temperatures",
};
