/**
 * Compatibility Checker
 *
 * Validates PC component compatibility and provides warnings/suggestions
 */

export interface CompatibilityRule {
  component: string; // Component name or pattern
  requires: {
    type: string; // Component type (e.g., "PSU")
    minValue?: number; // Minimum value (e.g., wattage)
    values?: string[]; // Specific values required
    message: string; // Warning message
  }[];
  suggestions?: string[]; // Suggested alternatives/upgrades
}

export interface CompatibilityWarning {
  component: string;
  issue: string;
  severity: "error" | "warning" | "info";
  suggestions: string[];
}

// Compatibility rules database
export const compatibilityRules: CompatibilityRule[] = [
  // RTX 4090 PSU Requirements
  {
    component: "RTX 4090",
    requires: [
      {
        type: "PSU",
        minValue: 850,
        message: "This GPU needs at least 850W PSU",
      },
    ],
    suggestions: [
      "Upgrade to Corsair RM850x 850W",
      "Upgrade to EVGA SuperNOVA 1000W",
      "Upgrade to Seasonic FOCUS GX-850",
    ],
  },

  // RTX 4080 PSU Requirements
  {
    component: "RTX 4080",
    requires: [
      {
        type: "PSU",
        minValue: 750,
        message: "This GPU needs at least 750W PSU",
      },
    ],
    suggestions: [
      "Upgrade to Corsair RM750x 750W",
      "Upgrade to EVGA SuperNOVA 850W",
    ],
  },

  // RTX 4070 PSU Requirements
  {
    component: "RTX 4070",
    requires: [
      {
        type: "PSU",
        minValue: 650,
        message: "This GPU needs at least 650W PSU",
      },
    ],
    suggestions: ["Upgrade to Corsair RM650x 650W", "Upgrade to EVGA 650 GQ"],
  },

  // Ryzen 7000 series memory requirements
  {
    component: "Ryzen 7 7800X3D",
    requires: [
      {
        type: "RAM",
        values: ["DDR5"],
        message: "Ryzen 7000 series requires DDR5 memory",
      },
    ],
    suggestions: [
      "Use G.Skill Trident Z5 DDR5-6000 32GB",
      "Use Corsair Vengeance DDR5-5600 32GB",
    ],
  },

  {
    component: "Ryzen 9 7950X",
    requires: [
      {
        type: "RAM",
        values: ["DDR5"],
        message: "Ryzen 7000 series requires DDR5 memory",
      },
    ],
    suggestions: [
      "Use G.Skill Trident Z5 DDR5-6000 32GB",
      "Use Corsair Vengeance DDR5-5600 32GB",
    ],
  },
];

/**
 * Extract wattage from PSU component name
 */
function extractWattage(componentName: string): number | null {
  const match = componentName.match(/(\d+)W/);
  return match && match[1] ? parseInt(match[1], 10) : null;
}

/**
 * Check if component name matches a pattern
 */
function componentMatches(componentName: string, pattern: string): boolean {
  // Simple exact match for now
  // Could be extended to support wildcards
  return componentName.includes(pattern);
}

/**
 * Check compatibility between components in a build
 */
export function checkCompatibility(
  components: {
    type: string;
    name: string;
  }[],
): CompatibilityWarning[] {
  const warnings: CompatibilityWarning[] = [];

  // Create a map of components by type for easy lookup
  const componentsByType = new Map<string, { type: string; name: string }>();
  components.forEach((comp) => {
    componentsByType.set(comp.type, comp);
  });

  // Check each component against compatibility rules
  components.forEach((component) => {
    // Find applicable rules
    const applicableRules = compatibilityRules.filter((rule) =>
      componentMatches(component.name, rule.component),
    );

    applicableRules.forEach((rule) => {
      rule.requires.forEach((requirement) => {
        const requiredComponent = componentsByType.get(requirement.type);

        if (!requiredComponent) {
          // Required component type not present
          warnings.push({
            component: component.name,
            issue: `Missing ${requirement.type}`,
            severity: "error",
            suggestions: rule.suggestions || [],
          });
          return;
        }

        // Check minimum value requirements (e.g., PSU wattage)
        if (requirement.minValue !== undefined) {
          if (requirement.type === "PSU") {
            const wattage = extractWattage(requiredComponent.name);
            if (wattage && wattage < requirement.minValue) {
              warnings.push({
                component: component.name,
                issue: requirement.message,
                severity: "warning",
                suggestions: rule.suggestions || [],
              });
            }
          }
        }

        // Check specific value requirements (e.g., DDR5 vs DDR4)
        if (requirement.values && requirement.values.length > 0) {
          const hasRequiredValue = requirement.values.some((value) =>
            requiredComponent.name.includes(value),
          );

          if (!hasRequiredValue) {
            warnings.push({
              component: component.name,
              issue: requirement.message,
              severity: "warning",
              suggestions: rule.suggestions || [],
            });
          }
        }
      });
    });
  });

  return warnings;
}

/**
 * Format a compatibility warning as a user-friendly message
 */
export function formatWarningMessage(warning: CompatibilityWarning): string {
  let message = `⚠️ ${warning.issue}`;

  if (warning.suggestions.length > 0) {
    message += `\n\nSuggested upgrades:`;
    warning.suggestions.forEach((suggestion) => {
      message += `\n• ${suggestion}`;
    });
  }

  return message;
}
