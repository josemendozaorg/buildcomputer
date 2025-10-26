/**
 * ChatInterface Component
 *
 * Main AI chat interface that guides users through PC building process
 * with conversational interaction and quick-reply chips.
 */

import { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import {
  generateAIResponse,
  PersonaSuggestion,
} from "../services/mockAIService";
import {
  initConversationState,
  getNextConversationStep,
  ConversationState,
  isVagueInput,
  validateBudget,
  generateClarificationMessage,
  getBudgetGuidanceResponse,
} from "../services/conversationService";
import { retryWithBackoff } from "../utils/retry";

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

export interface ChatInterfaceRef {
  addWarning: (message: string, suggestions?: string[]) => void;
  addMessage: (message: string) => void;
}

interface ChatInterfaceProps {
  onMessage?: (message: string) => void;
  onClose?: () => void;
  onQuickSelectPersona?: () => void;
  onMessagesChange?: (messages: Message[]) => void;
  savedMessages?: Message[];
  onPersonaSuggestionAccept?: (personaId: string) => void;
  initialContext?: {
    persona?: string;
    budget?: number;
  };
}

const ChatInterface = forwardRef<ChatInterfaceRef, ChatInterfaceProps>(
  function ChatInterface(
    {
      onMessage,
      onClose,
      onQuickSelectPersona,
      onMessagesChange,
      savedMessages,
      onPersonaSuggestionAccept,
      initialContext = {},
    },
    ref,
  ) {
    // Generate initial messages based on context
    const getInitialMessages = (): Message[] => {
      // Priority 1: Parent-controlled state (mode switching)
      if (savedMessages && savedMessages.length > 0) {
        return savedMessages;
      }

      // Priority 2: localStorage (conversation persistence)
      try {
        const stored = localStorage.getItem("chatMessages");
        if (stored) {
          const parsed = JSON.parse(stored) as Message[];
          if (parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Parse error - fall through to next priority
      }

      // Priority 3: Initial context (persona refinement)
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

    // Load persisted conversation state (only if no savedMessages from parent)
    const loadPersistedConversationState = (): {
      conversationState: ConversationState;
      dynamicChips: string[];
    } => {
      // If parent is controlling state, don't use localStorage for conversation
      if (savedMessages && savedMessages.length > 0) {
        return {
          conversationState: initConversationState(),
          dynamicChips: ["Gaming", "Work", "Content Creation"],
        };
      }

      try {
        const savedConversation = localStorage.getItem("conversationState");
        const savedChips = localStorage.getItem("dynamicChips");

        return {
          conversationState: savedConversation
            ? (JSON.parse(savedConversation) as ConversationState)
            : initConversationState(),
          dynamicChips: savedChips
            ? (JSON.parse(savedChips) as string[])
            : ["Gaming", "Work", "Content Creation"],
        };
      } catch {
        return {
          conversationState: initConversationState(),
          dynamicChips: ["Gaming", "Work", "Content Creation"],
        };
      }
    };

    const persistedConvState = loadPersistedConversationState();

    const [messages, setMessages] = useState<Message[]>(getInitialMessages());
    const [inputValue, setInputValue] = useState("");
    const [personaSuggestion, setPersonaSuggestion] =
      useState<PersonaSuggestion | null>(null);
    const [conversationState, setConversationState] =
      useState<ConversationState>(persistedConvState.conversationState);
    const [dynamicChips, setDynamicChips] = useState<string[]>(
      persistedConvState.dynamicChips,
    );
    const [isProcessing, setIsProcessing] = useState(false);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      addWarning: (message: string, suggestions?: string[]) => {
        const warningMessage: Message = {
          id: Date.now().toString(),
          role: "ai",
          content: message,
          timestamp: new Date(),
          isWarning: true,
          suggestions,
        };
        setMessages((prev) => {
          const newMessages = [...prev, warningMessage];
          if (onMessagesChange) {
            onMessagesChange(newMessages);
          }
          return newMessages;
        });
      },
      addMessage: (message: string) => {
        const aiMessage: Message = {
          id: Date.now().toString(),
          role: "ai",
          content: message,
          timestamp: new Date(),
        };
        setMessages((prev) => {
          const newMessages = [...prev, aiMessage];
          if (onMessagesChange) {
            onMessagesChange(newMessages);
          }
          return newMessages;
        });
      },
    }));

    // Persist state to localStorage whenever it changes
    useEffect(() => {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
      localStorage.setItem(
        "conversationState",
        JSON.stringify(conversationState),
      );
    }, [conversationState]);

    useEffect(() => {
      localStorage.setItem("dynamicChips", JSON.stringify(dynamicChips));
    }, [dynamicChips]);

    const handleSend = async () => {
      if (!inputValue.trim() || isProcessing) return;

      const messageContent = inputValue;

      // VALIDATION 1: Check for vague input
      if (isVagueInput(messageContent)) {
        const newState = {
          ...conversationState,
          vagueInputCount: conversationState.lastInputWasVague
            ? conversationState.vagueInputCount + 1
            : 1,
          lastInputWasVague: true,
        };
        setConversationState(newState);

        const clarification = generateClarificationMessage(
          newState,
          newState.vagueInputCount,
        );

        const clarificationMessage: Message = {
          id: Date.now().toString(),
          role: "ai",
          content: clarification.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, clarificationMessage]);
        if (clarification.chips) {
          setDynamicChips(clarification.chips);
        }
        setInputValue("");
        return;
      }

      // VALIDATION 2: Budget validation at step 3
      if (conversationState.step === 3) {
        const budgetValidation = validateBudget(messageContent);
        if (!budgetValidation.valid && budgetValidation.error) {
          const errorMessage: Message = {
            id: Date.now().toString(),
            role: "ai",
            content: budgetValidation.message || "",
            timestamp: new Date(),
            isWarning: true,
          };

          setMessages((prev) => [...prev, errorMessage]);

          // Only get guidance for too_low or too_high errors
          if (
            budgetValidation.error === "too_low" ||
            budgetValidation.error === "too_high"
          ) {
            const guidance = getBudgetGuidanceResponse(budgetValidation.error);
            if (guidance.chips) {
              setDynamicChips(guidance.chips);
            }
          }

          setInputValue("");
          return;
        }
      }

      // Reset vague input tracking on valid input
      setConversationState({
        ...conversationState,
        vagueInputCount: 0,
        lastInputWasVague: false,
      });

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: messageContent,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const newMessages = [...prev, userMessage];
        if (onMessagesChange) {
          onMessagesChange(newMessages);
        }
        return newMessages;
      });

      // Clear input and set processing state
      setInputValue("");
      setIsProcessing(true);

      // Generate AI response with retry logic
      try {
        const aiResponse = await retryWithBackoff(() =>
          generateAIResponse(messageContent),
        );

        if (aiResponse.suggestions) {
          // PERSONA DETECTED - Pause conversation flow
          const aiMessage: Message = {
            id: Date.now().toString(),
            role: "ai",
            content: aiResponse.content,
            timestamp: new Date(),
          };

          setMessages((prev) => {
            const newMessages = [...prev, aiMessage];
            if (onMessagesChange) {
              onMessagesChange(newMessages);
            }
            return newMessages;
          });

          setPersonaSuggestion(aiResponse.suggestions);
        } else {
          // NO PERSONA DETECTED - Advance conversation flow
          const convResponse = getNextConversationStep(
            conversationState,
            messageContent,
          );

          const aiMessage: Message = {
            id: Date.now().toString(),
            role: "ai",
            content: convResponse.message,
            timestamp: new Date(),
          };

          setMessages((prev) => {
            const newMessages = [...prev, aiMessage];
            if (onMessagesChange) {
              onMessagesChange(newMessages);
            }
            return newMessages;
          });

          if (convResponse.chips) {
            setDynamicChips(convResponse.chips);
          }

          setConversationState({ ...conversationState });
        }
      } catch (_error) {
        // Network error after all retries exhausted
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: "ai",
          content:
            "Hmm, that didn't work! No worries, let's give it another shot. 🔄",
          timestamp: new Date(),
          isError: true,
          retryable: true,
          attemptCount: 3,
        };

        setMessages((prev) => {
          const newMessages = [...prev, errorMessage];
          if (onMessagesChange) {
            onMessagesChange(newMessages);
          }
          return newMessages;
        });

        // Provide escape path chips
        setDynamicChips([
          "Switch to Persona Mode",
          "Report Issue",
          "Start Over",
        ]);
      } finally {
        setIsProcessing(false);
      }

      // Call callback if provided
      if (onMessage) {
        onMessage(messageContent);
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void handleSend();
      }
    };

    const handleChipClick = async (value: string) => {
      if (isProcessing) return;

      // Auto-send when chip is clicked
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: value,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const newMessages = [...prev, userMessage];
        if (onMessagesChange) {
          onMessagesChange(newMessages);
        }
        return newMessages;
      });

      setIsProcessing(true);

      // Generate AI response with retry logic
      try {
        const aiResponse = await retryWithBackoff(() =>
          generateAIResponse(value),
        );

        if (aiResponse.suggestions) {
          // PERSONA DETECTED - Pause conversation flow
          const aiMessage: Message = {
            id: Date.now().toString(),
            role: "ai",
            content: aiResponse.content,
            timestamp: new Date(),
          };

          setMessages((prev) => {
            const newMessages = [...prev, aiMessage];
            if (onMessagesChange) {
              onMessagesChange(newMessages);
            }
            return newMessages;
          });

          setPersonaSuggestion(aiResponse.suggestions);
        } else {
          // NO PERSONA - Advance conversation flow
          const convResponse = getNextConversationStep(
            conversationState,
            value,
          );

          const aiMessage: Message = {
            id: Date.now().toString(),
            role: "ai",
            content: convResponse.message,
            timestamp: new Date(),
          };

          setMessages((prev) => {
            const newMessages = [...prev, aiMessage];
            if (onMessagesChange) {
              onMessagesChange(newMessages);
            }
            return newMessages;
          });

          if (convResponse.chips) {
            setDynamicChips(convResponse.chips);
          }

          setConversationState({ ...conversationState });
        }
      } catch (_error) {
        // Network error after all retries exhausted
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: "ai",
          content:
            "Hmm, that didn't work! No worries, let's give it another shot. 🔄",
          timestamp: new Date(),
          isError: true,
          retryable: true,
          attemptCount: 3,
        };

        setMessages((prev) => {
          const newMessages = [...prev, errorMessage];
          if (onMessagesChange) {
            onMessagesChange(newMessages);
          }
          return newMessages;
        });

        setDynamicChips([
          "Switch to Persona Mode",
          "Report Issue",
          "Start Over",
        ]);
      } finally {
        setIsProcessing(false);
      }

      if (onMessage) {
        onMessage(value);
      }
    };

    const handleAcceptPersona = () => {
      if (!personaSuggestion) return;

      // Clear the suggestion
      setPersonaSuggestion(null);

      // Call the callback to switch to persona mode
      if (onPersonaSuggestionAccept) {
        onPersonaSuggestionAccept(personaSuggestion.personaId);
      }
    };

    const handleDeclinePersona = () => {
      if (!personaSuggestion) return;

      // Clear the suggestion
      setPersonaSuggestion(null);

      // Add AI message confirming custom conversation
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "ai",
        content:
          "No problem! Let's continue building your custom PC. Tell me more about your needs.",
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const newMessages = [...prev, aiMessage];
        if (onMessagesChange) {
          onMessagesChange(newMessages);
        }
        return newMessages;
      });
    };

    const handleStartOver = () => {
      const initialMessages: Message[] = [
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

      // Reset all state
      setMessages(initialMessages);
      setInputValue("");
      setConversationState(initConversationState());
      setDynamicChips(["Gaming", "Work", "Content Creation"]);
      setPersonaSuggestion(null);

      // Clear localStorage
      localStorage.removeItem("chatMessages");
      localStorage.removeItem("conversationState");
      localStorage.removeItem("dynamicChips");

      // Update parent
      if (onMessagesChange) {
        onMessagesChange(initialMessages);
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
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartOver}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              aria-label="Start over conversation"
            >
              Start Over
            </button>
            {onQuickSelectPersona && (
              <button
                onClick={onQuickSelectPersona}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white text-sm font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transition-all"
              >
                Quick Select Persona
              </button>
            )}
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
        </div>

        {/* Message History */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          data-testid="message-history"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
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
          ))}
        </div>

        {/* Quick Reply Chips - Three-level priority */}
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {personaSuggestion ? (
              // LEVEL 1: Persona suggestion chips (highest priority - interrupts everything)
              <>
                <button
                  onClick={handleAcceptPersona}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full text-sm font-semibold hover:from-green-700 hover:to-teal-700 transition-all shadow-md"
                >
                  {personaSuggestion.acceptLabel}
                </button>
                <button
                  onClick={handleDeclinePersona}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors"
                >
                  {personaSuggestion.declineLabel}
                </button>
              </>
            ) : dynamicChips.length > 0 ? (
              // LEVEL 2: Conversation flow chips (from conversationService)
              dynamicChips.map((chip, index) => (
                <button
                  key={index}
                  onClick={() => void handleChipClick(chip)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors"
                >
                  {chip}
                </button>
              ))
            ) : (
              // LEVEL 3: Default chips (fallback)
              <>
                <button
                  onClick={() => void handleChipClick("Gaming")}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors"
                >
                  Gaming
                </button>
                <button
                  onClick={() => void handleChipClick("Work")}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors"
                >
                  Work
                </button>
                <button
                  onClick={() => void handleChipClick("Content Creation")}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors"
                >
                  Content Creation
                </button>
              </>
            )}
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
              onClick={() => void handleSend()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!inputValue.trim() || isProcessing}
            >
              {isProcessing ? "Processing..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    );
  },
);

export default ChatInterface;
