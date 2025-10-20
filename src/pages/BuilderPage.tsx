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

export default function BuilderPage() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(
    null,
  );
  const [budget, setBudget] = useState<number>(1500);

  const handlePersonaSelect = (id: string) => {
    setSelectedPersonaId(id);
  };

  const handleBudgetChange = (newBudget: number) => {
    setBudget(newBudget);
  };

  return (
    <Layout>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <PersonaSelector
          selectedPersonaId={selectedPersonaId}
          onSelect={handlePersonaSelect}
        />

        {/* Show budget slider only when a persona is selected */}
        {selectedPersonaId && (
          <BudgetSlider value={budget} onChange={handleBudgetChange} />
        )}
      </main>
      <Footer />
    </Layout>
  );
}
