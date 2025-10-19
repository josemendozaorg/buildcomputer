import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

describe('index.html Template', () => {
  it('should have HTML template with required structure for React app', () => {
    // Verify index.html exists at project root
    const indexHtmlPath = join(process.cwd(), 'index.html')
    expect(existsSync(indexHtmlPath), 'index.html should exist at project root').toBe(true)

    // Read and parse HTML content
    const htmlContent = readFileSync(indexHtmlPath, 'utf-8')

    // Verify viewport meta tag exists
    expect(htmlContent).toContain('<meta name="viewport"')
    expect(htmlContent).toContain('width=device-width')

    // Verify root div exists
    expect(htmlContent).toContain('id="root"')

    // Verify script tag for main.tsx exists
    expect(htmlContent).toContain('type="module"')
    expect(htmlContent).toContain('src="/src/main.tsx"')

    // Verify page has a title
    expect(htmlContent).toContain('<title>')
  })
})
