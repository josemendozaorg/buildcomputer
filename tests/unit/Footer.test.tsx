import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Footer from '../../src/components/Footer'

describe('Footer Component', () => {
  it('should render a footer element', () => {
    const { container } = render(<Footer />)

    const footerElement = container.querySelector('footer')
    expect(footerElement).toBeTruthy()
  })

  it('should display copyright text', () => {
    const { container } = render(<Footer />)

    expect(container.textContent).toMatch(/©|Copyright|BuildComputer/)
  })

  it('should have proper styling classes', () => {
    const { container } = render(<Footer />)

    const footerElement = container.querySelector('footer') as HTMLElement
    expect(footerElement.className).toBeTruthy()
    expect(footerElement.className.length).toBeGreaterThan(0)
  })
})
