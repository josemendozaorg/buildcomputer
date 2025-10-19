import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Button from '../../src/components/Button'

describe('Button Component', () => {
  it('should render a button element', () => {
    const { container } = render(<Button>Click me</Button>)

    const buttonElement = container.querySelector('button')
    expect(buttonElement).toBeTruthy()
  })

  it('should display the button text', () => {
    const { container } = render(<Button>Start Building</Button>)

    expect(container.textContent).toContain('Start Building')
  })

  it('should have proper styling classes', () => {
    const { container } = render(<Button>Click</Button>)

    const buttonElement = container.querySelector('button') as HTMLElement
    expect(buttonElement.className).toBeTruthy()
    expect(buttonElement.className.length).toBeGreaterThan(0)
  })
})
