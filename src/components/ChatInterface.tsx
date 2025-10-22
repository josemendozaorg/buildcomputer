/**
 * ChatInterface Component
 *
 * Main AI chat interface that guides users through PC building process
 * with conversational interaction and quick-reply chips.
 */

import { useState } from "react";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onMessage?: (message: string) => void;
  onClose?: () => void;
  initialContext?: {
    persona?: string;
    budget?: number;
  };
}

export default function ChatInterface({
  onMessage,
  onClose,
  initialContext,
}: ChatInterfaceProps = {}) {
  // Generate initial messages based on context
  const getInitialMessages = (): Message[] => {
    if (initialContext?.persona) {
      // User is refining an existing build
      const personaName = initialContext.persona
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return [
        {
          id: "1",
          role: "ai",
          content: `I see you've selected the ${personaName} persona with a $${initialContext.budget} budget. Great choice!`,
          timestamp: new Date(),
        },
        {
          id: "2",
          role: "ai",
          content: "How would you like to refine your build?",
          timestamp: new Date(),
        },
      ];
    }

    // Default: new conversation
    return [
      {
        id: "1",
        role: "ai",
        content: "Hi! I'm here to help you build the perfect PC.",
        timestamp: new Date(),
      },
      {
        id: "2",
        role: "ai",
        content: "What will you mainly use it for?",
        timestamp: new Date(),
      },
    ];
  };

  const [messages, setMessages] = useState<Message[]>(getInitialMessages());
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Call callback if provided
    if (onMessage) {
      onMessage(inputValue);
    }

    // Clear input
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (value: string) => {
    setInputValue(value);
    // Auto-send when chip is clicked
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: value,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    if (onMessage) {
      onMessage(value);
    }
  };

  return (
    <div
      className="flex flex-col h-full bg-white"
      role="region"
      aria-label="AI Chat"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">AI PC Builder</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close chat"
          >
            <span className="sr-only">Close</span>✕
          </button>
        )}
      </div>

      {/* Message History */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        data-testid="message-history"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Reply Chips */}
      <div className="px-4 py-2 border-t bg-gray-50">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleChipClick("Gaming")}
            className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors"
          >
            Gaming
          </button>
          <button
            onClick={() => handleChipClick("Work")}
            className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors"
          >
            Work
          </button>
          <button
            onClick={() => handleChipClick("Content Creation")}
            className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors"
          >
            Content Creation
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Message input"
          />
          <button
            onClick={handleSend}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!inputValue.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
