/**
 * Tooltip Component
 *
 * Accessible tooltip that appears on hover
 * WCAG 2.1 AA compliant with proper ARIA attributes
 */

import { ReactNode, useState } from "react";

export interface TooltipProps {
  content: string;
  children: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className="relative inline-block">
      <span
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-describedby={isVisible ? "tooltip" : undefined}
        className="cursor-help"
        tabIndex={0}
      >
        {children}
      </span>
      {isVisible && (
        <span
          id="tooltip"
          role="tooltip"
          className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap animate-fade-in"
          data-testid="component-tooltip"
        >
          {content}
          <span className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2" />
        </span>
      )}
    </span>
  );
}
