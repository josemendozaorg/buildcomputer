@acceptance
Feature: Project Setup and Landing Page
  As a developer setting up the BuildComputer project
  I want a complete development environment with testing infrastructure
  So that I can build features with confidence using TDD/BDD practices

  And as a user visiting the landing page
  I want a responsive, accessible introduction to BuildComputer
  So that I understand the platform and can get started

  # ============================================================================
  # INFRASTRUCTURE & TOOLING SCENARIOS
  # ============================================================================

  Scenario: Project Initialization and Development Server Startup
    Given the BuildComputer repository has been cloned
    And pnpm is installed on the system
    When the developer runs "pnpm install" to install dependencies
    And the developer runs "pnpm dev" to start the development server
    Then the development server should start successfully on port 5173
    And the terminal should display "Local: http://localhost:5173"
    And hot module replacement (HMR) should be enabled

  Scenario: Hot Module Replacement Works During Development
    Given the development server is running
    And the landing page is open in a browser
    When the developer modifies a React component file
    And saves the file
    Then the browser should update instantly without full page reload
    And the component changes should be visible within 100ms
    And the application state should be preserved

  Scenario: TypeScript Strict Mode Catches Type Errors
    Given the project is configured with TypeScript strict mode
    When the developer writes code with a type error (e.g., assigning string to number)
    And the developer runs "pnpm build" or checks the IDE
    Then TypeScript should report a type error
    And the build should fail with a clear error message
    And the error location should be shown with file path and line number

  Scenario: Pre-commit Hooks Enforce Code Quality
    Given Husky and lint-staged are configured
    And the developer has staged files with formatting issues
    When the developer runs "git commit -m test commit"
    Then the pre-commit hook should run automatically
    And Prettier should format the staged files
    And ESLint should check for linting errors
    And the commit should proceed if all checks pass

  @unit
  Scenario: Running Unit Tests with Vitest
    Given the project has Vitest configured
    And unit tests exist in the unit test directory
    When the developer runs "pnpm test:unit"
    Then Vitest should execute all unit tests
    And test results should be displayed in the terminal
    And test coverage report should be generated
    And all tests should pass with green checkmarks

  @component
  Scenario: Component Testing in Storybook
    Given Storybook is configured with Vitest addon
    And component stories exist in the stories directory
    When the developer runs "pnpm storybook"
    Then Storybook should start on port 6006
    And all component stories should be visible in the sidebar
    And components should render correctly in the canvas
    And accessibility checks should run automatically with the a11y addon

  @e2e
  Scenario: End-to-End Tests with Playwright
    Given Playwright is configured for E2E testing
    And E2E tests exist in the E2E test directory
    When the developer runs "pnpm test:e2e"
    Then Playwright should launch Chromium browser in headless mode
    And all E2E tests should execute against the dev server
    And test results should show pass or fail status
    And screenshots should be captured for any failures

  @bdd
  Scenario: BDD Acceptance Tests with QuickPickle
    Given QuickPickle is configured with Gherkin syntax support
    And .feature files exist in the BDD features directory
    When the developer runs "pnpm test:bdd"
    Then QuickPickle should parse all .feature files
    And step definitions should be matched to Gherkin steps
    And tests should execute in Vitest runner
    And results should show which scenarios passed or failed

  Scenario: Production Build Generates Optimized Output
    Given the project is ready for deployment
    When the developer runs "pnpm build"
    Then Vite should bundle the application
    And output should be written to the dist directory
    And JavaScript bundles should be minified and tree-shaken
    And CSS should be extracted and optimized
    And the build should complete successfully with size report
    And bundle size should be under 200KB gzipped

  # ============================================================================
  # LANDING PAGE UI/UX SCENARIOS
  # ============================================================================

  @ui @desktop
  Scenario: Desktop User Views Landing Page
    Given the landing page is deployed and accessible
    When a user visits the URL on a desktop browser at 1920x1080
    Then the page should load and display First Contentful Paint within 1.5 seconds
    And the hero section should display "BuildComputer" title prominently
    And the tagline should be visible below the title
    And the description text should be readable with proper line height
    And the "Get Started" button should be centered and visually prominent
    And the navigation header should be at the top
    And the footer should be at the bottom with placeholder links

  @ui @mobile
  Scenario: Mobile User Views Landing Page
    Given the landing page is deployed and accessible
    When a user visits the URL on a mobile device at 375x667
    Then the viewport meta tag should ensure proper scaling
    And the layout should adapt to mobile screen size
    And the hero title should be smaller but readable with responsive typography
    And the "Get Started" button should be at least 44x44px for touch
    And all content should fit within the viewport without horizontal scrolling
    And the navigation should collapse or adapt for mobile

  @ui @interaction
  Scenario: User Interacts with Call-to-Action Button
    Given the user is viewing the landing page
    When the user hovers over the "Get Started" button
    Then the button should display a hover state (color change, slight scale)
    And the cursor should change to pointer
    When the user clicks the button
    Then the button should display an active/pressed state
    And the button should provide visual feedback (currently no navigation)

  @accessibility @keyboard
  Scenario: Keyboard Navigation on Landing Page
    Given the user is viewing the landing page
    When the user presses the Tab key
    Then the focus should move to the first focusable element
    And a visible focus indicator should appear (outline or ring)
    When the user continues pressing Tab
    Then focus should move through all interactive elements in logical order
    And the "Get Started" button should be reachable
    When the user presses Enter on the focused button
    Then the button should activate (same as clicking)

  @accessibility @screenreader
  Scenario: Screen Reader Announces Landing Page Content
    Given the user is using a screen reader (NVDA, JAWS, or VoiceOver)
    When the user navigates to the landing page
    Then the page title should be announced
    And the semantic structure should be clear (header, main, footer)
    And the hero heading should be announced as "heading level 1"
    And the "Get Started" button should be announced as "button, Get Started"
    And all images (if any) should have descriptive alt text
    And the page should be fully navigable with screen reader shortcuts

  @accessibility @automated
  Scenario: Accessibility Scan Passes WCAG 2.1 AA
    Given the landing page is rendered in a browser
    When an automated accessibility scan runs (axe-core via Storybook or Playwright)
    Then no critical accessibility violations should be detected
    And color contrast ratio should be at least 4.5:1 for normal text
    And all interactive elements should have accessible names
    And heading hierarchy should be logical (no skipped levels)
    And ARIA attributes should be used correctly where needed

  # ============================================================================
  # EDGE CASES & ERROR SCENARIOS
  # ============================================================================

  @error
  Scenario: Build Fails Due to TypeScript Errors (Edge Case)
    Given the developer has written code with TypeScript errors
    When the developer runs "pnpm build"
    Then the build should fail immediately
    And TypeScript compiler should output error details
    And the terminal should show file paths and line numbers
    And the dist/ directory should not be created or updated
    And the exit code should be non-zero

  @error
  Scenario: Tests Fail and Block Deployment (Edge Case)
    Given the developer has written failing tests
    When the developer runs "pnpm test" before deployment
    Then the test suite should execute and report failures
    And failing test output should show expected vs actual values
    And the command should exit with non-zero status
    And CI/CD pipeline (if configured) should block deployment

  @error @accessibility
  Scenario: Accessibility Violations Detected in Storybook (Edge Case)
    Given a component story is open in Storybook
    And the component has accessibility issues (e.g., poor contrast)
    When the a11y addon scans the component
    Then violations should be displayed in the "Accessibility" panel
    And each violation should show severity level (critical, serious, moderate)
    And each violation should link to WCAG guidelines
    And the developer should be able to fix the issues before committing
