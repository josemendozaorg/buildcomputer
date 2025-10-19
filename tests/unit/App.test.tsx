import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../../src/App'

describe('App Component', () => {
  it('should render landing page with brand name and headline', () => {
    // Render the App component
    render(<App />)

    // Verify BuildComputer brand is present (appears in header and hero)
    const brandElements = screen.getAllByText(/BuildComputer/i)
    expect(brandElements.length).toBeGreaterThan(0)

    // Verify Get Started button is present
    const buttonElement = screen.getByText(/Get Started/i)
    expect(buttonElement).toBeInTheDocument()
  })
})
