import { useState } from "react";
import { Build } from "../types/components";
import Tooltip from "./Tooltip";
import Popover from "./Popover";
import { componentTooltips } from "../utils/componentTooltips";
import { componentDetailsData } from "../utils/componentDetails";
import { componentReasoningData } from "../utils/componentReasoning";

export interface BuildCardProps {
  build: Build;
}

export default function BuildCard({ build }: BuildCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null,
  );
  const [showReasoning, setShowReasoning] = useState(false);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      data-testid="build-card"
      className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
    >
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">{build.title}</h3>

      {/* Price */}
      <div
        data-testid="build-price"
        className="text-3xl font-bold text-indigo-600 mb-4"
      >
        {formatCurrency(build.price)}
      </div>

      {/* Description */}
      <p data-testid="build-description" className="text-sm text-gray-600 mb-4">
        {build.description}
      </p>

      {/* View Details Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors duration-200"
      >
        {isExpanded ? "Hide Details" : "View Details"}
      </button>

      {/* Component List */}
      {isExpanded && (
        <div
          data-testid="component-list"
          className="mt-4 pt-4 border-t border-gray-200 space-y-3 animate-fade-in"
        >
          {build.components.map((component) => (
            <div
              key={component.type}
              className="bg-gray-50 rounded-md p-3 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <Tooltip content={componentTooltips[component.type]}>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {component.type}
                  </span>
                </Tooltip>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(component.price)}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {component.name}
              </p>
              <p className="text-xs text-gray-600">{component.brand}</p>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {Object.entries(component.specs).map(([key, value]) => (
                  <span key={key} className="text-xs text-gray-700">
                    <span className="font-medium">{value}</span>{" "}
                    {key !== value && (
                      <span className="text-gray-500">{key}</span>
                    )}
                  </span>
                ))}
              </div>
              {/* Learn More and Why This Choice buttons */}
              <div className="mt-2 flex gap-3">
                {componentDetailsData[component.name] && (
                  <button
                    onClick={() => {
                      setSelectedComponent(component.name);
                      setShowReasoning(false);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    data-testid={`learn-more-${component.type.toLowerCase()}`}
                  >
                    Learn More →
                  </button>
                )}
                {componentReasoningData[component.name] && (
                  <button
                    onClick={() => {
                      setSelectedComponent(component.name);
                      setShowReasoning(true);
                    }}
                    className="text-xs text-green-600 hover:text-green-800 font-medium"
                    data-testid={`why-this-choice-${component.type.toLowerCase()}`}
                  >
                    Why this choice?
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Component Details/Reasoning Popover */}
      {selectedComponent && (
        <Popover
          isOpen={!!selectedComponent}
          onClose={() => setSelectedComponent(null)}
          title={selectedComponent}
        >
          {showReasoning && componentReasoningData[selectedComponent] ? (
            <div className="space-y-4" data-testid="reasoning-content">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Why I chose this
                </h4>
                <p className="text-sm text-gray-600">
                  {componentReasoningData[selectedComponent].reason}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Performance Impact
                </h4>
                <p className="text-sm text-gray-600">
                  {componentReasoningData[selectedComponent].performanceImpact}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Alternatives
                </h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  {componentReasoningData[selectedComponent].alternatives.map(
                    (alt, idx) => (
                      <li key={idx}>{alt}</li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          ) : componentDetailsData[selectedComponent] ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Description
                </h4>
                <p className="text-sm text-gray-600">
                  {componentDetailsData[selectedComponent].description}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  When to Choose
                </h4>
                <p className="text-sm text-gray-600">
                  {componentDetailsData[selectedComponent].whenToChoose}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Performance Tier
                </h4>
                <span className="inline-block px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
                  {componentDetailsData[selectedComponent].performanceTier}
                </span>
              </div>
            </div>
          ) : null}
        </Popover>
      )}
    </div>
  );
}
