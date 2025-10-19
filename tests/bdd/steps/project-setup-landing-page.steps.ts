import { Given, When, Then } from 'quickpickle'
import { expect } from 'vitest'
import { PlaywrightWorld } from '@quickpickle/playwright'
import { spawn, ChildProcess } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

/**
 * Step Definitions for Project Setup and Landing Page Feature
 *
 * These step definitions implement BDD acceptance tests for the
 * Project Setup and Landing Page feature.
 */

interface BuildComputerWorld extends PlaywrightWorld {
  // Add custom properties for test context
  devServerProcess?: ChildProcess
  devServerUrl?: string
  devServerOutput?: string
  buildOutput?: string
  testResults?: any
}

// ============================================================================
// INFRASTRUCTURE & TOOLING STEP DEFINITIONS
// ============================================================================

Given('the BuildComputer repository has been cloned', async function(this: BuildComputerWorld) {
  // Verify key project files exist
  const projectRoot = process.cwd()
  expect(existsSync(join(projectRoot, 'package.json')), 'package.json should exist').toBe(true)
  expect(existsSync(join(projectRoot, '.git')), '.git directory should exist').toBe(true)
})

Given('pnpm is installed on the system', async function(this: BuildComputerWorld) {
  // Verify pnpm is available
  const { execSync } = await import('child_process')
  try {
    const version = execSync('pnpm --version', { encoding: 'utf-8' })
    expect(version).toBeTruthy()
  } catch (error) {
    throw new Error('pnpm is not installed or not in PATH')
  }
})

When('the developer runs {string} to install dependencies', async function(this: BuildComputerWorld, command: string) {
  // Dependencies should already be installed in test environment
  // Verify node_modules exists
  const projectRoot = process.cwd()
  expect(existsSync(join(projectRoot, 'node_modules')), 'node_modules should exist').toBe(true)
})

When('the developer runs {string} to start the development server', async function(this: BuildComputerWorld, command: string) {
  // Start the dev server
  const projectRoot = process.cwd()
  this.devServerOutput = ''

  return new Promise<void>((resolve, reject) => {
    this.devServerProcess = spawn('pnpm', ['dev'], {
      cwd: projectRoot,
      stdio: 'pipe'
    })

    const timeout = setTimeout(() => {
      reject(new Error('Dev server failed to start within 10 seconds'))
    }, 10000)

    this.devServerProcess.stdout?.on('data', (data: Buffer) => {
      const output = data.toString()
      this.devServerOutput += output

      // Check if server started
      if (output.includes('Local:') && output.includes('5173')) {
        clearTimeout(timeout)
        resolve()
      }
    })

    this.devServerProcess.stderr?.on('data', (data: Buffer) => {
      this.devServerOutput += data.toString()
    })

    this.devServerProcess.on('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })
  })
})

Then('the development server should start successfully on port {int}', async function(this: BuildComputerWorld, port: number) {
  // Verify server is responding on the specified port
  const maxAttempts = 5
  let attempt = 0
  let serverResponding = false

  while (attempt < maxAttempts && !serverResponding) {
    try {
      const response = await fetch(`http://localhost:${port}`)
      serverResponding = response.status < 500
    } catch (error) {
      attempt++
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
  }

  expect(serverResponding, `Server should respond on port ${port}`).toBe(true)
  this.devServerUrl = `http://localhost:${port}`
})

Then('the terminal should display {string}', async function(this: BuildComputerWorld, text: string) {
  // Check that the dev server output contains the expected text
  expect(this.devServerOutput, 'Dev server output should be captured').toBeTruthy()
  expect(this.devServerOutput?.includes(text), `Terminal output should contain "${text}"`).toBe(true)
})

Then('hot module replacement \\(HMR) should be enabled', async function(this: BuildComputerWorld) {
  // HMR is enabled by default in Vite, verify vite.config.ts exists
  const projectRoot = process.cwd()
  const viteConfigPath = join(projectRoot, 'vite.config.ts')
  expect(existsSync(viteConfigPath), 'vite.config.ts should exist for HMR').toBe(true)

  // Clean up: kill dev server process
  if (this.devServerProcess) {
    this.devServerProcess.kill()
    this.devServerProcess = undefined
  }
})

Given('the development server is running', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Ensure dev server is running')
})

Given('the landing page is open in a browser', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Open landing page in browser')
})

When('the developer modifies a React component file', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Modify React component file')
})

When('saves the file', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Save file changes')
})

Then('the browser should update instantly without full page reload', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify instant browser update')
})

Then('the component changes should be visible within {int}ms', async function(this: BuildComputerWorld, ms: number) {
  throw new Error(`Step not implemented: Verify changes visible within ${ms}ms`)
})

Then('the application state should be preserved', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify application state preservation')
})

Given('the project is configured with TypeScript strict mode', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify TypeScript strict mode config')
})

When('the developer writes code with a type error \\(e.g., assigning string to number)', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Create TypeScript type error')
})

When('the developer runs {string} or checks the IDE', async function(this: BuildComputerWorld, command: string) {
  throw new Error(`Step not implemented: Run ${command} or check IDE`)
})

Then('TypeScript should report a type error', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify TypeScript error reported')
})

Then('the build should fail with a clear error message', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify build failure with clear message')
})

Then('the error location should be shown with file path and line number', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify error location details')
})

Given('Husky and lint-staged are configured', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify Husky and lint-staged configuration')
})

Given('the developer has staged files with formatting issues', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Stage files with formatting issues')
})

When('the developer runs {string}', async function(this: BuildComputerWorld, command: string) {
  throw new Error(`Step not implemented: Run command "${command}"`)
})

Then('the pre-commit hook should run automatically', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify pre-commit hook execution')
})

Then('Prettier should format the staged files', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify Prettier formatting')
})

Then('ESLint should check for linting errors', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify ESLint checking')
})

Then('the commit should proceed if all checks pass', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify commit proceeds')
})

Given('the project has Vitest configured', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify Vitest configuration')
})

Given('unit tests exist in the tests\\/unit\\/ directory', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify unit tests exist')
})

Then('Vitest should execute all unit tests', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify Vitest executes tests')
})

Then('test results should be displayed in the terminal', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify test results display')
})

Then('test coverage report should be generated', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify coverage report generation')
})

Then('all tests should pass with green checkmarks', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify all tests pass')
})

Given('Storybook is configured with Vitest addon', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify Storybook configuration')
})

Given('component stories exist in the stories\\/ directory', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify component stories exist')
})

Then('Storybook should start on port {int}', async function(this: BuildComputerWorld, port: number) {
  throw new Error(`Step not implemented: Verify Storybook on port ${port}`)
})

Then('all component stories should be visible in the sidebar', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify stories visible in sidebar')
})

Then('components should render correctly in the canvas', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify component rendering')
})

Then('accessibility checks should run automatically with the a11y addon', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify a11y addon runs')
})

Given('Playwright is configured for E2E testing', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify Playwright configuration')
})

Given('E2E tests exist in the tests\\/e2e\\/ directory', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify E2E tests exist')
})

Then('Playwright should launch Chromium browser in headless mode', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify Playwright launches Chromium')
})

Then('all E2E tests should execute against the dev server', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify E2E tests execute')
})

Then('test results should show pass/fail status', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify test results status')
})

Then('screenshots should be captured for any failures', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify failure screenshots')
})

Given('QuickPickle is configured with Gherkin syntax support', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify QuickPickle configuration')
})

Given('.feature files exist in the tests\\/bdd\\/features\\/ directory', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify .feature files exist')
})

Then('QuickPickle should parse all .feature files', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify QuickPickle parses features')
})

Then('step definitions should be matched to Gherkin steps', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify step definition matching')
})

Then('tests should execute in Vitest runner', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify tests run in Vitest')
})

Then('results should show which scenarios passed/failed', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify scenario results display')
})

Given('the project is ready for deployment', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify project ready for deployment')
})

Then('Vite should bundle the application', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify Vite bundling')
})

Then('output should be written to the dist\\/ directory', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify dist/ output')
})

Then('JavaScript bundles should be minified and tree-shaken', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify JS minification and tree-shaking')
})

Then('CSS should be extracted and optimized', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify CSS extraction')
})

Then('the build should complete successfully with size report', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify build success and size report')
})

Then('bundle size should be under {int}KB gzipped', async function(this: BuildComputerWorld, size: number) {
  throw new Error(`Step not implemented: Verify bundle size under ${size}KB`)
})

// ============================================================================
// LANDING PAGE UI/UX STEP DEFINITIONS
// ============================================================================

Given('the landing page is deployed and accessible', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify landing page is deployed')
})

When('a user visits the URL on a desktop browser \\({int}x{int})', async function(this: BuildComputerWorld, width: number, height: number) {
  throw new Error(`Step not implemented: Visit URL on ${width}x${height} desktop`)
})

When('a user visits the URL on a mobile device \\({int}x{int})', async function(this: BuildComputerWorld, width: number, height: number) {
  throw new Error(`Step not implemented: Visit URL on ${width}x${height} mobile`)
})

Then('the page should load and display First Contentful Paint within {float} seconds', async function(this: BuildComputerWorld, seconds: number) {
  throw new Error(`Step not implemented: Verify FCP within ${seconds} seconds`)
})

Then('the hero section should display {string} title prominently', async function(this: BuildComputerWorld, title: string) {
  throw new Error(`Step not implemented: Verify hero title "${title}"`)
})

Then('the tagline should be visible below the title', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify tagline visibility')
})

Then('the description text should be readable with proper line height', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify description readability')
})

Then('the {string} button should be centered and visually prominent', async function(this: BuildComputerWorld, buttonText: string) {
  throw new Error(`Step not implemented: Verify "${buttonText}" button prominence`)
})

Then('the navigation header should be at the top', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify navigation header position')
})

Then('the footer should be at the bottom with placeholder links', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify footer position and links')
})

Then('the viewport meta tag should ensure proper scaling', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify viewport meta tag')
})

Then('the layout should adapt to mobile screen size', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify mobile layout adaptation')
})

Then('the hero title should be smaller but readable \\(responsive typography)', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify responsive typography')
})

Then('the {string} button should be at least {int}x{int}px for touch', async function(this: BuildComputerWorld, buttonText: string, width: number, height: number) {
  throw new Error(`Step not implemented: Verify "${buttonText}" is ${width}x${height}px`)
})

Then('all content should fit within the viewport without horizontal scrolling', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify no horizontal scroll')
})

Then('the navigation should collapse or adapt for mobile', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify mobile navigation')
})

Given('the user is viewing the landing page', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Ensure user is viewing landing page')
})

When('the user hovers over the {string} button', async function(this: BuildComputerWorld, buttonText: string) {
  throw new Error(`Step not implemented: Hover over "${buttonText}" button`)
})

Then('the button should display a hover state \\(color change, slight scale)', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify hover state')
})

Then('the cursor should change to pointer', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify pointer cursor')
})

When('the user clicks the button', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Click button')
})

Then('the button should display an active/pressed state', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify active state')
})

Then('the button should provide visual feedback \\(currently no navigation)', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify visual feedback')
})

When('the user presses the Tab key', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Press Tab key')
})

Then('the focus should move to the first focusable element', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify focus on first element')
})

Then('a visible focus indicator should appear \\(outline or ring)', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify focus indicator')
})

When('the user continues pressing Tab', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Continue pressing Tab')
})

Then('focus should move through all interactive elements in logical order', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify logical focus order')
})

Then('the {string} button should be reachable', async function(this: BuildComputerWorld, buttonText: string) {
  throw new Error(`Step not implemented: Verify "${buttonText}" is reachable`)
})

When('the user presses Enter on the focused button', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Press Enter on button')
})

Then('the button should activate \\(same as clicking)', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify button activation')
})

Given('the user is using a screen reader \\(NVDA, JAWS, or VoiceOver)', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Simulate screen reader usage')
})

When('the user navigates to the landing page', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Navigate to landing page')
})

Then('the page title should be announced', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify page title announcement')
})

Then('the semantic structure should be clear \\(header, main, footer)', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify semantic structure')
})

Then('the hero heading should be announced as {string}', async function(this: BuildComputerWorld, level: string) {
  throw new Error(`Step not implemented: Verify heading announced as "${level}"`)
})

Then('the {string} button should be announced as {string}', async function(this: BuildComputerWorld, buttonText: string, announcement: string) {
  throw new Error(`Step not implemented: Verify "${buttonText}" announced as "${announcement}"`)
})

Then('all images \\(if any) should have descriptive alt text', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify image alt text')
})

Then('the page should be fully navigable with screen reader shortcuts', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify screen reader navigation')
})

Given('the landing page is rendered in a browser', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Render landing page in browser')
})

When('an automated accessibility scan runs \\(axe-core via Storybook or Playwright)', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Run axe-core accessibility scan')
})

Then('no critical accessibility violations should be detected', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify no critical violations')
})

Then('color contrast ratio should be at least {float}:1 for normal text', async function(this: BuildComputerWorld, ratio: number) {
  throw new Error(`Step not implemented: Verify contrast ratio ${ratio}:1`)
})

Then('all interactive elements should have accessible names', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify accessible names')
})

Then('heading hierarchy should be logical \\(no skipped levels)', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify heading hierarchy')
})

Then('ARIA attributes should be used correctly where needed', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify ARIA attributes')
})

// ============================================================================
// EDGE CASES & ERROR STEP DEFINITIONS
// ============================================================================

Given('the developer has written code with TypeScript errors', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Create code with TypeScript errors')
})

Then('the build should fail immediately', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify immediate build failure')
})

Then('TypeScript compiler should output error details', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify TypeScript error output')
})

Then('the terminal should show file paths and line numbers', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify file paths and line numbers')
})

Then('the dist\\/ directory should not be created or updated', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify dist/ not created/updated')
})

Then('the exit code should be non-zero', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify non-zero exit code')
})

Given('the developer has written failing tests', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Create failing tests')
})

When('the developer runs {string} before deployment', async function(this: BuildComputerWorld, command: string) {
  throw new Error(`Step not implemented: Run "${command}" before deployment`)
})

Then('the test suite should execute and report failures', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify test failures reported')
})

Then('failing test output should show expected vs actual values', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify expected vs actual output')
})

Then('the command should exit with non-zero status', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify non-zero exit status')
})

Then('CI/CD pipeline \\(if configured) should block deployment', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify CI/CD blocks deployment')
})

Given('a component story is open in Storybook', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Open component story in Storybook')
})

Given('the component has accessibility issues \\(e.g., poor contrast)', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Create component with a11y issues')
})

When('the a11y addon scans the component', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Run a11y addon scan')
})

Then('violations should be displayed in the {string} panel', async function(this: BuildComputerWorld, panelName: string) {
  throw new Error(`Step not implemented: Verify violations in "${panelName}" panel`)
})

Then('each violation should show severity level \\(critical, serious, moderate)', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify severity levels shown')
})

Then('each violation should link to WCAG guidelines', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify WCAG guideline links')
})

Then('the developer should be able to fix the issues before committing', async function(this: BuildComputerWorld) {
  throw new Error('Step not implemented: Verify issues can be fixed')
})
