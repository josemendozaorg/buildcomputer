import { useState } from "react";
import { Build } from "../types/components";
import Tooltip from "./Tooltip";
import { componentTooltips } from "../utils/componentTooltips";

export interface BuildCardProps {
  build: Build;
}

export default function BuildCard({ build }: BuildCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
