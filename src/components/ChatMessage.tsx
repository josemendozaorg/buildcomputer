/**
 * ChatMessage Component
 *
 * Renders a single chat message bubble with role-based styling.
 * Wrapped in React.memo for performance optimization to prevent
 * unnecessary re-renders when new messages are added to the conversation.
 */

import { memo } from "react";

export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  isWarning?: boolean;
  suggestions?: string[];
  isError?: boolean;
  retryable?: boolean;
  attemptCount?: number;
  resolved?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = memo(({ message }: ChatMessageProps) => {
  return (
    <div
      className={`flex message-fade-in ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          message.isError
            ? "bg-red-50 border-2 border-red-400 text-gray-900"
            : message.isWarning
              ? "bg-amber-50 border-2 border-amber-400 text-gray-900"
              : message.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900"
        }`}
        data-testid={
          message.isError
            ? "error-message"
            : message.isWarning
              ? "compatibility-warning"
              : undefined
        }
      >
        {message.isError && (
          <div className="flex items-start gap-2 mb-2">
            <svg
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              data-testid="error-icon"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">
                Connection Error
                {message.attemptCount &&
                  ` (${message.attemptCount}/3 attempts)`}
              </p>
            </div>
          </div>
        )}
        {message.isWarning && (
          <div className="flex items-start gap-2 mb-2">
            <svg
              className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              data-testid="warning-icon"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">
                Compatibility Warning
              </p>
            </div>
          </div>
        )}
        <p className="text-sm whitespace-pre-line">{message.content}</p>
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-amber-200">
            <p className="text-xs font-semibold text-amber-900 mb-2">
              Suggested upgrades:
            </p>
            <ul className="text-sm space-y-1">
              {message.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
