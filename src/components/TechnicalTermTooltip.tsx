/**
 * Technical Term Tooltip Component
 *
 * Wraps technical terms with educational tooltips and optional Learn More
 */

import { useState } from "react";
import Tooltip from "./Tooltip";
import Popover from "./Popover";
import { technicalTerms, detectTechnicalTerm } from "../utils/technicalTerms";

export interface TechnicalTermTooltipProps {
  text: string;
  className?: string;
}

export default function TechnicalTermTooltip({
  text,
  className = "",
}: TechnicalTermTooltipProps) {
  const [showPopover, setShowPopover] = useState(false);
  const term = detectTechnicalTerm(text);

  // If no technical term detected, render plain text
  if (!term || !technicalTerms[term]) {
    return <span className={className}>{text}</span>;
  }

  const termData = technicalTerms[term];

  // If there's a full explanation, make it clickable
  if (termData.fullExplanation) {
    return (
      <>
        <Tooltip content={termData.tooltip}>
          <button
            onClick={() => setShowPopover(true)}
            className={`${className} cursor-help border-b border-dotted border-indigo-400 hover:border-indigo-600 text-indigo-600 hover:text-indigo-800 transition-colors`}
            data-testid={`tech-term-${term.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {text}
          </button>
        </Tooltip>

        {showPopover && (
          <Popover
            isOpen={showPopover}
            onClose={() => setShowPopover(false)}
            title={term}
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  What is {term}?
                </h4>
                <p className="text-sm text-gray-600">
                  {termData.fullExplanation}
                </p>
              </div>
              {termData.learnMoreUrl && (
                <div>
                  <a
                    href={termData.learnMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Learn more →
                  </a>
                </div>
              )}
            </div>
          </Popover>
        )}
      </>
    );
  }

  // If no full explanation, just show tooltip
  return (
    <Tooltip content={termData.tooltip}>
      <span
        className={`${className} cursor-help border-b border-dotted border-gray-400`}
      >
        {text}
      </span>
    </Tooltip>
  );
}
