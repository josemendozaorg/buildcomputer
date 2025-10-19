import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

describe('Tailwind CSS Configuration', () => {
  it('should have tailwind and postcss config files for utility class processing', () => {
    const projectRoot = process.cwd()

    // Verify tailwind.config.js exists
    const tailwindConfigPath = join(projectRoot, 'tailwind.config.js')
    expect(existsSync(tailwindConfigPath), 'tailwind.config.js should exist').toBe(true)

    // Verify tailwind config has content paths
    const tailwindConfig = readFileSync(tailwindConfigPath, 'utf-8')
    expect(tailwindConfig).toContain('content')
    expect(tailwindConfig).toContain('./src/**/*.{js,ts,jsx,tsx}')

    // Verify postcss.config.js exists
    const postcssConfigPath = join(projectRoot, 'postcss.config.js')
    expect(existsSync(postcssConfigPath), 'postcss.config.js should exist').toBe(true)

    // Verify postcss config has tailwindcss plugin
    const postcssConfig = readFileSync(postcssConfigPath, 'utf-8')
    expect(postcssConfig).toContain('tailwindcss')
    expect(postcssConfig).toContain('autoprefixer')

    // Verify src/index.css exists with Tailwind directives
    const indexCssPath = join(projectRoot, 'src', 'index.css')
    expect(existsSync(indexCssPath), 'src/index.css should exist').toBe(true)

    const indexCss = readFileSync(indexCssPath, 'utf-8')
    expect(indexCss).toContain('@tailwind base')
    expect(indexCss).toContain('@tailwind components')
    expect(indexCss).toContain('@tailwind utilities')
  })
})
