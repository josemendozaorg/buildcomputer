import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import BuilderPage from "./pages/BuilderPage";

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    void navigate("/build");
  };

  return (
    <Layout>
      <Header />
      <Hero />
      <div className="container mx-auto px-4 text-center pb-20">
        <button
          onClick={handleGetStarted}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 min-h-[44px] cursor-pointer"
        >
          Get Started
        </button>
      </div>
      <Footer />
    </Layout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/build" element={<BuilderPage />} />
    </Routes>
  );
}

export default App;
