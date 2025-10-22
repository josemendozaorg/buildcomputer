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
import ChatInterface from "../components/ChatInterface";

export default function BuilderPage() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(
    null,
  );
  const [budget, setBudget] = useState<number>(1500);
  const [showAIChat, setShowAIChat] = useState(false);

  const handlePersonaSelect = (id: string) => {
    setSelectedPersonaId(id);
  };

  const handleBudgetChange = (newBudget: number) => {
    setBudget(newBudget);
  };

  const handleOpenAIChat = () => {
    setShowAIChat(true);
  };

  const handleCloseAIChat = () => {
    setShowAIChat(false);
  };

  return (
    <Layout>
      <Header />
      <main className="container mx-auto px-4 py-12">
        {!showAIChat ? (
          <>
            {/* Talk to AI Builder Button */}
            <div className="mb-8 text-center">
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
              <p className="mt-2 text-sm text-gray-600">
                Get personalized recommendations through conversation
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
              </>
            )}
          </>
        ) : (
          <div className="fixed inset-0 z-50 bg-white">
            <ChatInterface onClose={handleCloseAIChat} />
          </div>
        )}
      </main>
      <Footer />
    </Layout>
  );
}
