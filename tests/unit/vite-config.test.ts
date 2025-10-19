import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

describe('Vite Configuration', () => {
  it('should have vite config file with react plugin configured', () => {
    // Verify vite.config.ts exists at project root
    const viteConfigPath = join(process.cwd(), 'vite.config.ts')
    expect(existsSync(viteConfigPath)).toBe(true)

    // Verify the config file contains React plugin
    const configContent = readFileSync(viteConfigPath, 'utf-8')
    expect(configContent).toContain('@vitejs/plugin-react')
    expect(configContent).toContain('react()')
  })
})
