import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { quickpickle } from 'quickpickle'

export default defineConfig({
  plugins: [
    react(),
    quickpickle({
      worldConfig: {
        host: 'http://localhost:5173',
        headless: true,
        defaultBrowser: 'chromium',
        defaultBrowserSize: 'desktop',
        stepTimeout: 10000
      }
    })
  ],
  test: {
    // Vitest configuration
    globals: true,
    environment: 'jsdom',
    // Include feature files as test files
    include: [
      'tests/bdd/features/**/*.feature',
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    // Setup files with step definitions and test utilities
    setupFiles: [
      './tests/setup.ts',
      './tests/bdd/steps/project-setup-landing-page.steps.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'tests/',
        'stories/',
        '**/*.d.ts',
        '**/*.config.{ts,js}',
        '**/dist/**'
      ],
    },
  },
})
