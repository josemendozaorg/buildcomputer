import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Button from "./components/Button";
import Footer from "./components/Footer";

function LandingPage() {
  return (
    <Layout>
      <Header />
      <Hero />
      <div className="container mx-auto px-4 text-center pb-20">
        <Button>Get Started</Button>
      </div>
      <Footer />
    </Layout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
