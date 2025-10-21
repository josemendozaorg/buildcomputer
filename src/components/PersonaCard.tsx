/**
 * PersonaCard Component
 *
 * Displays a single persona option with:
 * - Icon/illustration
 * - Title and tagline
 * - Example use cases
 * - Selection state visualization
 * - Click handling
 */

import { Persona } from "../types/persona";

interface PersonaCardProps {
  persona: Persona;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function PersonaCard({
  persona,
  selected,
  onSelect,
}: PersonaCardProps) {
  const isComingSoon = persona.id === "custom-build";

  return (
    <button
      type="button"
      onClick={() => onSelect(persona.id)}
      className={`
        w-full text-left p-6 rounded-lg border-2 transition-all duration-200 relative
        ${
          selected
            ? "border-indigo-600 bg-indigo-50 shadow-md"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow"
        }
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
      `}
    >
      {/* Coming Soon Badge */}
      {isComingSoon && (
        <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded">
          Coming Soon
        </div>
      )}

      {/* Icon */}
      <div className="text-4xl mb-3">{persona.icon}</div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{persona.title}</h3>

      {/* Tagline */}
      <p className="text-sm font-medium text-indigo-600 mb-3">
        {persona.tagline}
      </p>

      {/* Examples */}
      <p className="text-sm text-gray-600">{persona.examples}</p>
    </button>
  );
}
