# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BuildComputer is a comprehensive website that guides users through building desktop computers part by part. The platform provides personalized recommendations based on user needs (Gaming, Content Creation, AI Workloads, Student needs), budget constraints, and component compatibility. Future features include real-time price comparison across online retailers and location-based store recommendations.

## Technology Stack

- **Frontend**: React 18 with TypeScript (strict mode)
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm (required)
- **Testing**: Vitest (unit), Playwright (E2E), QuickPickle (BDD)
- **Component Development**: Storybook 7
- **Code Quality**: ESLint, Prettier, Husky (pre-commit hooks)

## Development Commands

```bash
# Install dependencies (required before any other command)
pnpm install

# Start development server on http://localhost:5173
pnpm dev

# Build for production (compiles TypeScript + bundles with Vite)
pnpm build

# Preview production build locally
pnpm preview

# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run BDD acceptance tests (Gherkin .feature files)
pnpm test:bdd
pnpm test:bdd:watch    # Watch mode
pnpm test:bdd:ui       # Interactive UI

# Run E2E tests with Playwright (auto-starts dev server)
pnpm test:e2e

# Generate test coverage report
pnpm test:coverage

# Start Storybook component explorer
pnpm storybook

# Lint code
pnpm lint

# Format code
pnpm format            # Write formatted files
pnpm format:check      # Check only, don't write
```

## Testing Architecture

The project uses a comprehensive testing strategy with three layers:

1. **Unit Tests** (`tests/unit/`): Component and utility tests with @testing-library/react
2. **BDD Acceptance Tests** (`tests/bdd/features/`): Gherkin feature files with QuickPickle
   - Step definitions in `tests/bdd/steps/`
   - Runs in Vitest with browser automation
3. **E2E Tests** (`tests/e2e/`): Full browser testing with Playwright
   - Playwright auto-starts dev server on port 5173
   - Configured for Chromium in `playwright.config.ts`

### Running Individual Tests

```bash
# Run a single unit test file
pnpm test tests/unit/Button.test.tsx

# Run a single E2E test
pnpm test:e2e tests/e2e/project-initialization.spec.ts

# Run tests in watch mode
pnpm test:bdd:watch
```

## Project Structure

```
src/
  components/       # Reusable React components
    Layout.tsx      # Main layout wrapper
    Header.tsx      # Top navigation
    Hero.tsx        # Hero section
    Footer.tsx      # Footer
    Button.tsx      # Base button component
  App.tsx           # Root application component
  main.tsx          # Entry point
  index.css         # Global styles + Tailwind imports

tests/
  unit/             # Vitest component tests
  bdd/
    features/       # Gherkin .feature files
    steps/          # Step definitions for BDD tests
  e2e/              # Playwright browser tests
  setup.ts          # Test setup (extends matchers)

stories/            # Storybook component stories
```

## Code Quality Tools

- **Pre-commit hooks**: Automatically run ESLint + Prettier on staged files
- **TypeScript strict mode**: Catches type errors at build time
- **Accessibility**: Storybook a11y addon + axe-core Playwright integration
- All commits must pass linting/formatting before committing

## Key Configuration Files

- `vitest.config.ts`: Test configuration, includes QuickPickle plugin for BDD
- `playwright.config.ts`: E2E test configuration with webServer auto-start
- `vite.config.ts`: Vite build configuration
- `tailwind.config.js`: Tailwind CSS customization (if present)
- `.github/` or CI config: (Add when CI/CD is configured)

## Development Notes

- The dev server uses Vite's HMR (Hot Module Replacement) for instant updates
- Playwright tests automatically start/stop the dev server
- BDD tests use QuickPickle with worldConfig pointing to http://localhost:5173
- Test coverage excludes stories/, tests/, config files, and node_modules/
