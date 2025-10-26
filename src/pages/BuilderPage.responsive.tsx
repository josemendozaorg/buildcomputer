/**
 * Responsive BuilderPage Component
 *
 * Implements responsive layouts:
 * - Desktop (≥1024px): Side-by-side resizable panels
 * - Tablet (768-1023px): Vertical stack
 * - Mobile (<768px): Full-screen chat with drawer
 */

import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PersonaSelector from "../components/PersonaSelector";
import BudgetSlider from "../components/BudgetSlider";
import BuildRecommendations from "../components/BuildRecommendations";
import ChatInterface, { Message } from "../components/ChatInterface";
import ChatDrawer, { DrawerState } from "../components/ChatDrawer";
import { useViewport } from "../hooks/useViewport";
import { usePanelResize } from "../hooks/usePanelResize";

export default function BuilderPage() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [budget, setBudget] = useState<number>(1500);
  const [showAIChat, setShowAIChat] = useState(false);
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);
  const [drawerState, setDrawerState] = useState<DrawerState>('hidden');

  const viewport = useViewport();
  const { panelSize, setPanelSize, resetPanelSize } = usePanelResize();

  const handlePersonaSelect = (id: string) => {
    setSelectedPersonaId(id);
  };

  const handleBudgetChange = (newBudget: number) => {
    setBudget(newBudget);
  };

  const handleOpenAIChat = () => {
    if (viewport.isMobile) {
      setDrawerState('expanded');
    } else {
      setShowAIChat(true);
    }
  };

  const handleCloseAIChat = () => {
    if (viewport.isMobile) {
      setDrawerState('hidden');
    } else {
      setShowAIChat(false);
    }
  };

  const handlePersonaSuggestionAccept = (personaId: string) => {
    setSelectedPersonaId(personaId);
    if (viewport.isMobile) {
      setDrawerState('minimized');
    } else {
      setShowAIChat(false);
    }
  };

  // Desktop layout (≥1024px)
  if (viewport.isDesktop && showAIChat) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-semibold">PC Builder</h1>
          <button
            onClick={resetPanelSize}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
          >
            Reset Layout
          </button>
        </div>

        <PanelGroup direction="horizontal" className="flex-1">
          <Panel
            defaultSize={panelSize}
            minSize={30}
            maxSize={70}
            onResize={(size) => setPanelSize(size)}
            data-testid="chat-panel"
          >
            <ChatInterface
              onClose={handleCloseAIChat}
              onMessagesChange={setSavedMessages}
              savedMessages={savedMessages}
              onPersonaSuggestionAccept={handlePersonaSuggestionAccept}
              initialContext={{ persona: selectedPersonaId || undefined, budget }}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-blue-500 cursor-col-resize transition-colors" data-testid="resize-divider" />

          <Panel minSize={30} maxSize={70} data-testid="build-panel">
            <div className="h-full overflow-y-auto p-4">
              {selectedPersonaId ? (
                <BuildRecommendations personaId={selectedPersonaId} budget={budget} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a persona in chat to see builds
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    );
  }

  // Tablet/Mobile: Standard layout
  return (
    <Layout>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <button
            onClick={handleOpenAIChat}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Talk to AI Builder
          </button>
        </div>

        <PersonaSelector selectedPersonaId={selectedPersonaId} onSelect={handlePersonaSelect} />

        {selectedPersonaId && (
          <>
            <BudgetSlider value={budget} onChange={handleBudgetChange} />
            <BuildRecommendations personaId={selectedPersonaId} budget={budget} />
          </>
        )}
      </main>
      <Footer />

      {/* Mobile Drawer */}
      {viewport.isMobile && (
        <ChatDrawer
          state={drawerState}
          onStateChange={setDrawerState}
          lastMessage={savedMessages[savedMessages.length - 1]?.content}
        >
          <ChatInterface
            onClose={() => setDrawerState('hidden')}
            onMessagesChange={setSavedMessages}
            savedMessages={savedMessages}
            onPersonaSuggestionAccept={handlePersonaSuggestionAccept}
            initialContext={{ persona: selectedPersonaId || undefined, budget }}
          />
        </ChatDrawer>
      )}
    </Layout>
  );
}
