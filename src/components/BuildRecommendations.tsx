import BuildCard from "./BuildCard";
import { generateBuildRecommendations } from "../utils/buildRecommendations";

export interface BuildRecommendationsProps {
  personaId: string;
  budget: number;
}

export default function BuildRecommendations({
  personaId,
  budget,
}: BuildRecommendationsProps) {
  const builds = generateBuildRecommendations(personaId, budget);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Recommended Builds
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {builds.map((build) => (
          <BuildCard key={build.id} build={build} />
        ))}
      </div>
    </div>
  );
}
