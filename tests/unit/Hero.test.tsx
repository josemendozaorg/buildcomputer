import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Hero from '../../src/components/Hero'

describe('Hero Component', () => {
  it('should render a section element', () => {
    const { container } = render(<Hero />)

    // Verify section element exists
    const sectionElement = container.querySelector('section')
    expect(sectionElement).toBeTruthy()
  })

  it('should display headline text', () => {
    const { container } = render(<Hero />)

    // Verify headline content exists
    const content = container.textContent
    expect(content).toBeTruthy()
    expect(content?.length).toBeGreaterThan(0)
  })

  it('should have proper styling classes for hero layout', () => {
    const { container } = render(<Hero />)

    const sectionElement = container.querySelector('section') as HTMLElement

    // Verify section has styling classes
    expect(sectionElement.className).toBeTruthy()
    expect(sectionElement.className.length).toBeGreaterThan(0)
  })

  it('should contain heading elements for SEO', () => {
    const { container } = render(<Hero />)

    // Verify h1 exists for main headline
    const h1Element = container.querySelector('h1')
    expect(h1Element).toBeTruthy()
  })
})
