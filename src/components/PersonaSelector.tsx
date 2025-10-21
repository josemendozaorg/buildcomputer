/**
 * PersonaSelector Component
 *
 * Container for all persona cards:
 * - Renders 8 PersonaCard components in a responsive grid
 * - Manages single-selection behavior
 * - Triggers onSelect callback when a persona is clicked
 */

import PersonaCard from "./PersonaCard";
import { PERSONAS } from "../types/persona";

interface PersonaSelectorProps {
  selectedPersonaId: string | null;
  onSelect: (id: string) => void;
}

export default function PersonaSelector({
  selectedPersonaId,
  onSelect,
}: PersonaSelectorProps) {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Choose Your Story
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PERSONAS.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            selected={selectedPersonaId === persona.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
