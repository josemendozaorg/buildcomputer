/**
 * BuilderPage Component
 *
 * Main page for the PC builder interface where users can:
 * - Select a persona (use case)
 * - Set their budget
 * - View build recommendations
 *
 * This is a minimal placeholder implementation.
 */

import Layout from "../components/Layout";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function BuilderPage() {
  return (
    <Layout>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          PC Builder
        </h1>
        <div className="text-center text-gray-600">
          <p>Builder interface coming soon...</p>
        </div>
      </main>
      <Footer />
    </Layout>
  );
}
