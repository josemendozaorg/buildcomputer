import Layout from './components/Layout'
import Header from './components/Header'
import Hero from './components/Hero'
import Button from './components/Button'
import Footer from './components/Footer'

function App() {
  return (
    <Layout>
      <Header />
      <Hero />
      <div className="container mx-auto px-4 text-center pb-20">
        <Button>Get Started</Button>
      </div>
      <Footer />
    </Layout>
  )
}

export default App
