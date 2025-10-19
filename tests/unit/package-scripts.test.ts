import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Package Scripts', () => {
  it('should have required vite scripts for development workflow', () => {
    // Read package.json
    const packageJsonPath = join(process.cwd(), 'package.json')
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8')
    const packageJson = JSON.parse(packageJsonContent)

    // Verify scripts section exists
    expect(packageJson.scripts).toBeDefined()

    // Verify required scripts exist with correct values
    expect(packageJson.scripts.dev).toBe('vite')
    expect(packageJson.scripts.build).toBe('tsc && vite build')
    expect(packageJson.scripts.preview).toBe('vite preview')
  })
})
