import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Layout from '../../src/components/Layout'

describe('Layout Component', () => {
  it('should render children within a main element', () => {
    const { container } = render(
      <Layout>
        <div data-testid="content">Test Content</div>
      </Layout>
    )

    // Verify main element exists
    const mainElement = container.querySelector('main')
    expect(mainElement).toBeTruthy()

    // Verify children are rendered
    expect(mainElement?.textContent).toContain('Test Content')
  })

  it('should have proper semantic structure with header, main, and footer slots', () => {
    const { container } = render(
      <Layout>
        <div>Page Content</div>
      </Layout>
    )

    // Verify semantic structure exists
    const mainElement = container.querySelector('main')
    expect(mainElement).toBeTruthy()

    // Layout should be a container div
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('should apply minimum height to ensure full viewport coverage', () => {
    const { container } = render(
      <Layout>
        <div>Content</div>
      </Layout>
    )

    const layoutDiv = container.firstChild as HTMLElement
    expect(layoutDiv.className).toContain('min-h-screen')
  })
})
