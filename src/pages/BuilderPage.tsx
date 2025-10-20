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

export default function BuilderPage() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(
    null,
  );

  const handlePersonaSelect = (id: string) => {
    setSelectedPersonaId(id);
  };

  return (
    <Layout>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <PersonaSelector
          selectedPersonaId={selectedPersonaId}
          onSelect={handlePersonaSelect}
        />
      </main>
      <Footer />
    </Layout>
  );
}
