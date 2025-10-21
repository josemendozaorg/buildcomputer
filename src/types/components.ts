/**
 * Component Types and Interfaces
 *
 * Defines the structure for PC components used in build recommendations
 */

export type ComponentType =
  | "CPU"
  | "GPU"
  | "RAM"
  | "Storage"
  | "Motherboard"
  | "PSU"
  | "Case"
  | "Cooling";

export interface Component {
  type: ComponentType;
  name: string;
  brand: string;
  price: number;
  specs: Record<string, string>;
}

export interface Build {
  id: string;
  title: string;
  price: number;
  description: string;
  components: Component[];
}
