function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-300">
          © {currentYear} BuildComputer. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
