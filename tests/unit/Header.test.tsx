import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Header from '../../src/components/Header'

describe('Header Component', () => {
  it('should render a header element with navigation', () => {
    const { container } = render(<Header />)

    // Verify header element exists
    const headerElement = container.querySelector('header')
    expect(headerElement).toBeTruthy()

    // Verify navigation element exists within header
    const navElement = headerElement?.querySelector('nav')
    expect(navElement).toBeTruthy()
  })

  it('should display the BuildComputer brand name', () => {
    const { container } = render(<Header />)

    // Verify brand name is present
    expect(container.textContent).toContain('BuildComputer')
  })

  it('should have proper styling classes for layout', () => {
    const { container } = render(<Header />)

    const headerElement = container.querySelector('header') as HTMLElement

    // Verify header has styling classes
    expect(headerElement.className).toBeTruthy()
    expect(headerElement.className.length).toBeGreaterThan(0)
  })
})
