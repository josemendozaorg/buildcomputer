/**
 * BuilderPage Component
 *
 * Main page for the PC builder interface where users can:
 * - Select a persona (use case)
 * - Set their budget
 * - View build recommendations
 */

import { useState } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PersonaSelector from "../components/PersonaSelector";
import BudgetSlider from "../components/BudgetSlider";
import BuildRecommendations from "../components/BuildRecommendations";
import ChatInterface, { Message } from "../components/ChatInterface";

export default function BuilderPage() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(
    null,
  );
  const [budget, setBudget] = useState<number>(1500);
  const [showAIChat, setShowAIChat] = useState(false);
  const [hasSavedConversation, setHasSavedConversation] = useState(false);
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);

  const handlePersonaSelect = (id: string) => {
    setSelectedPersonaId(id);
  };

  const handleBudgetChange = (newBudget: number) => {
    setBudget(newBudget);
  };

  const handleOpenAIChat = () => {
    setShowAIChat(true);
    setHasSavedConversation(true);
  };

  const handleCloseAIChat = () => {
    setShowAIChat(false);
  };

  const handleQuickSelectPersona = () => {
    setShowAIChat(false);
  };

  const handleMessagesChange = (messages: Message[]) => {
    setSavedMessages(messages);
  };

  return (
    <Layout>
      <Header />
      <main className="container mx-auto px-4 py-12">
        {!showAIChat ? (
          <>
            {/* Talk to AI Builder or Return to Conversation Button */}
            <div className="mb-8 text-center">
              {hasSavedConversation ? (
                <button
                  onClick={handleOpenAIChat}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                  Return to Conversation
                </button>
              ) : (
                <button
                  onClick={handleOpenAIChat}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  Talk to AI Builder
                </button>
              )}
              <p className="mt-2 text-sm text-gray-600">
                {hasSavedConversation
                  ? "Continue your AI conversation"
                  : "Get personalized recommendations through conversation"}
              </p>
            </div>

            <div className="text-center my-8 text-gray-500 font-medium">or</div>

            {/* Persona Selection */}
            <PersonaSelector
              selectedPersonaId={selectedPersonaId}
              onSelect={handlePersonaSelect}
            />

            {/* Show budget slider only when a persona is selected */}
            {selectedPersonaId && (
              <>
                <BudgetSlider value={budget} onChange={handleBudgetChange} />

                {/* Show build recommendations when persona and budget are set */}
                <BuildRecommendations
                  personaId={selectedPersonaId}
                  budget={budget}
                />

                {/* Refine with AI Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={handleOpenAIChat}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Refine with AI
                  </button>
                  <p className="mt-2 text-sm text-gray-600">
                    Get AI help to optimize your build
                  </p>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="fixed inset-0 z-50 bg-white">
            <ChatInterface
              onClose={handleCloseAIChat}
              onQuickSelectPersona={handleQuickSelectPersona}
              onMessagesChange={handleMessagesChange}
              savedMessages={savedMessages}
              initialContext={{
                persona: selectedPersonaId || undefined,
                budget,
              }}
            />
          </div>
        )}
      </main>
      <Footer />
    </Layout>
  );
}
