import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../../src/App'

describe('App Component', () => {
  it('should render hello world message', () => {
    // Render the App component
    render(<App />)

    // Verify "Hello World" text is present
    const helloWorldElement = screen.getByText(/hello world/i)
    expect(helloWorldElement).toBeInTheDocument()
  })
})
