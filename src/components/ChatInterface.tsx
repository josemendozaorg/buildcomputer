/**
 * ChatInterface Component
 *
 * Main AI chat interface that guides users through PC building process
 * with conversational interaction and quick-reply chips.
 */

import { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { List } from "react-window";
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
import ChatMessage from "./ChatMessage";

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

    const handleChipKeyDown = (e: React.KeyboardEvent, handler: () => void) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handler();
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
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              aria-label="Start over conversation and clear chat history"
            >
              Start Over
            </button>
            {onQuickSelectPersona && (
              <button
                onClick={onQuickSelectPersona}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white text-sm font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Switch to persona selection mode"
              >
                Quick Select Persona
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
                aria-label="Close chat"
              >
                <span className="sr-only">Close</span>✕
              </button>
            )}
          </div>
        </div>

        {/* Message History */}
        {messages.length >= 50 ? (
          // Virtual scrolling for large conversations (50+ messages)
          <List
            defaultHeight={600}
            rowCount={messages.length}
            rowHeight={120}
            className="flex-1"
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
            aria-atomic="false"
            aria-label="AI conversation messages"
            rowProps={{}}
            rowComponent={({ index, style }) => {
              const message = messages[index];
              if (!message) return <div style={style} />;
              return (
                <div style={style} className="px-4">
                  <ChatMessage message={message} />
                </div>
              );
            }}
          />
        ) : (
          // Standard rendering for conversations <50 messages
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            data-testid="message-history"
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
            aria-atomic="false"
            aria-label="AI conversation messages"
          >
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}

        {/* Visual typing indicator */}
        {isProcessing && (
          <div className="px-4 py-2 flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-1">
              <span
                className="typing-indicator w-2 h-2 bg-gray-400 rounded-full"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="typing-indicator w-2 h-2 bg-gray-400 rounded-full"
                style={{ animationDelay: "200ms" }}
              />
              <span
                className="typing-indicator w-2 h-2 bg-gray-400 rounded-full"
                style={{ animationDelay: "400ms" }}
              />
            </div>
          </div>
        )}

        {/* Hidden aria-live region for typing indicator */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {isProcessing ? "AI is typing" : ""}
        </div>

        {/* Quick Reply Chips - Three-level priority */}
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {personaSuggestion ? (
              // LEVEL 1: Persona suggestion chips (highest priority - interrupts everything)
              <>
                <button
                  onClick={handleAcceptPersona}
                  onKeyDown={(e) => handleChipKeyDown(e, handleAcceptPersona)}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full text-sm font-semibold hover:from-green-700 hover:to-teal-700 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  aria-label={`Accept persona suggestion: ${personaSuggestion.acceptLabel}`}
                  data-testid="accept-persona-suggestion"
                >
                  {personaSuggestion.acceptLabel}
                </button>
                <button
                  onClick={handleDeclinePersona}
                  onKeyDown={(e) => handleChipKeyDown(e, handleDeclinePersona)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Decline persona suggestion: ${personaSuggestion.declineLabel}`}
                  data-testid="decline-persona-suggestion"
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
                  onKeyDown={(e) =>
                    handleChipKeyDown(e, () => void handleChipClick(chip))
                  }
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Quick reply: ${chip}`}
                >
                  {chip}
                </button>
              ))
            ) : (
              // LEVEL 3: Default chips (fallback)
              <>
                <button
                  onClick={() => void handleChipClick("Gaming")}
                  onKeyDown={(e) =>
                    handleChipKeyDown(e, () => void handleChipClick("Gaming"))
                  }
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Quick reply: Gaming"
                >
                  Gaming
                </button>
                <button
                  onClick={() => void handleChipClick("Work")}
                  onKeyDown={(e) =>
                    handleChipKeyDown(e, () => void handleChipClick("Work"))
                  }
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Quick reply: Work"
                >
                  Work
                </button>
                <button
                  onClick={() => void handleChipClick("Content Creation")}
                  onKeyDown={(e) =>
                    handleChipKeyDown(
                      e,
                      () => void handleChipClick("Content Creation"),
                    )
                  }
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Quick reply: Content Creation"
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              disabled={!inputValue.trim() || isProcessing}
              aria-label="Send message"
              aria-disabled={!inputValue.trim() || isProcessing}
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
