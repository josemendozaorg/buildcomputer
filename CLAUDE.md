# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BuildComputer is a persona-based PC builder that helps users get personalized computer build recommendations. Users select their use case (Gaming, Content Creation, AI, etc.), set a budget, and receive three build tiers with real PC components.

**Current Implementation Status:** MVP complete with 8 personas, real component database, and full accessibility support.

## Technology Stack

- **Frontend**: React 18 with TypeScript (strict mode)
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS (responsive: mobile < 640px, tablet 640-1024px, desktop > 1024px)
- **Routing**: React Router DOM v7
- **Package Manager**: pnpm (required)
- **Testing**: Vitest (unit), Playwright (E2E), QuickPickle (BDD)
- **Code Quality**: ESLint, Prettier, Husky (pre-commit hooks with lint-staged)

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

# Run all tests with type-check
pnpm test

# Run unit tests only
pnpm test:unit

# Run BDD acceptance tests (Gherkin .feature files)
pnpm test:bdd
pnpm test:bdd:watch    # Watch mode
pnpm test:bdd:ui       # Interactive UI

# Run E2E tests with Playwright (auto-starts dev server)
pnpm test:e2e

# Run all test types sequentially
pnpm test:all

# Type-check only (no tests)
pnpm type-check

# Generate test coverage report
pnpm test:coverage

# Start Storybook component explorer
pnpm storybook

# Lint and format
pnpm lint
pnpm format            # Write formatted files
pnpm format:check      # Check only, don't write
```

### Running Individual Tests

```bash
# Run a single unit test file
pnpm test tests/unit/Button.test.tsx

# Run a single BDD feature
pnpm test:bdd tests/bdd/features/persona-based-builder.feature

# Run a single E2E test
pnpm test:e2e tests/e2e/component-expansion.spec.ts

# Run tests in watch mode
pnpm test:bdd:watch
```

## Architecture Overview

### Application Flow

1. **Landing Page** (`/`) → "Get Started" button navigates to builder
2. **Builder Page** (`/build`) → Main application flow:
   - User selects persona (8 options)
   - Budget slider appears (range: $500-$5000)
   - 3 build tiers generated: Optimized (~90%), Performance (~100%), Featured (~125%)
   - User can expand cards to see component details

### Key Data Flow

```
PersonaSelector → BuilderPage (state) → BuildRecommendations
                                ↓
                    generateBuildRecommendations()
                                ↓
                    selectComponents(persona, tier, budget)
                                ↓
                    componentDatabase (538 lines of real hardware)
```

### Component Database Structure

`src/data/componentDatabase.ts` contains real PC components organized by:

- **Persona**: `competitive-gamer`, `creator`, `ai-enthusiast`, `casual-gamer`, `student`, `home-office`, `streamer`, `custom-build`
- **Budget Tier**: `optimized`, `performance`, `featured`
- **Component Types**: CPU, GPU, RAM, Storage (4 required per build)

Each component has: `type`, `name`, `brand`, `price`, `specs` (key-value pairs like "cores: 6", "vram: 8GB GDDR6")

### State Management

State is managed at the **BuilderPage** level and passed down:

- `selectedPersonaId` → PersonaSelector (selected state)
- `budget` → BudgetSlider (slider value)
- Both → BuildRecommendations (triggers re-render of builds)

No global state management - React component state is sufficient for current scope.

## Project Structure

```
src/
  components/
    PersonaSelector.tsx      # 8 persona cards with selection
    BudgetSlider.tsx         # Budget input ($500-$5000)
    BuildRecommendations.tsx # Generates 3 build tiers
    BuildCard.tsx            # Expandable card showing components
    PersonaCard.tsx          # Individual persona button
    Layout.tsx, Header.tsx, Footer.tsx, Hero.tsx, Button.tsx

  pages/
    BuilderPage.tsx          # Main builder interface with state

  utils/
    buildRecommendations.ts  # generateBuildRecommendations() logic

  data/
    componentDatabase.ts     # 538 lines of real PC components

  types/
    components.ts            # Component, Build interfaces

tests/
  unit/                      # Component tests with @testing-library/react
  bdd/
    features/                # Gherkin .feature files
    steps/                   # Step definitions (Playwright-based)
  e2e/                       # Full E2E flows with Playwright
```

## Testing Architecture

Three-layer testing strategy with **100% coverage** (65 unit, 30 BDD, 8 E2E):

### 1. Unit Tests (`tests/unit/`)

- Component rendering and interactions with @testing-library/react
- Utility function logic
- Run with Vitest + happy-dom

### 2. BDD Acceptance Tests (`tests/bdd/`)

- **12 scenarios** covering:
  - Core user journey (1-5): Persona selection, budget, recommendations, expansion, switching
  - Accessibility (6-9): Budget validation, keyboard nav, touch, hover
  - Advanced (10-12): Direct URL access, responsive layout, custom build badge
- Uses QuickPickle (Gherkin) with Playwright for browser automation
- Step definitions in `tests/bdd/steps/persona-based-builder.steps.ts` and `project-setup-landing-page.steps.ts`
- Run in Vitest with `pnpm test:bdd`

### 3. E2E Tests (`tests/e2e/`)

- Full user flows with Playwright
- Auto-starts dev server on port 5173 (configured in `playwright.config.ts`)
- Tests component expansion, build recommendations, persona switching

**Important:** Vitest uses esbuild (no type-check). The `test` script runs `pnpm type-check` first to catch TypeScript errors.

## Code Quality & Conventions

### Pre-commit Hooks

Husky + lint-staged automatically run on `git commit`:

- ESLint with `--fix` for TS/TSX files
- Prettier for all files
- **All commits must pass** linting/formatting

### TypeScript Strict Mode

- Enabled in `tsconfig.app.json` and `tsconfig.json`
- Use `void` operator for async functions in event handlers (e.g., `void navigate("/build")`)
- Interface definitions in `src/types/`

### Accessibility Requirements

- Use semantic HTML (`<button>`, not styled `<div>`)
- Minimum touch target: 44x44px (WCAG 2.1 AA)
- Keyboard navigation: Tab, Enter, Arrow keys
- Screen reader compatible with proper ARIA labels
- Tested with axe-core in Playwright E2E tests

### Tailwind CSS Patterns

- Responsive breakpoints: `sm:`, `md:`, `lg:` (mobile-first)
- Hover states: `hover:bg-blue-700`, `hover:scale-105`
- Focus rings: `focus:ring-2 focus:ring-indigo-500`
- Transitions: `transition-colors duration-200`

## Configuration Files

- `vitest.config.ts` - Vitest + QuickPickle configuration, test environment setup
- `playwright.config.ts` - E2E configuration with webServer auto-start
- `vite.config.ts` - Vite build configuration with React plugin
- `tailwind.config.js` - Tailwind CSS customization
- `tsconfig.json` / `tsconfig.app.json` - TypeScript strict mode configuration
- `.eslintrc.cjs` - ESLint rules with TypeScript, React, accessibility plugins

## Important Implementation Details

### Navigation Pattern

Use button + `useNavigate()` hook for accessibility, not `<Link>`:

```tsx
const navigate = useNavigate();
const handleClick = () => {
  void navigate("/build"); // void operator to satisfy ESLint
};
return <button onClick={handleClick}>Get Started</button>;
```

### Component Expansion Pattern

`BuildCard` uses local `useState` for expand/collapse:

```tsx
const [isExpanded, setIsExpanded] = useState(false);
// Renders component list when isExpanded is true
```

### Budget Calculation

Build tiers calculated as percentages of user's budget:

- Optimized: `budget * 0.9` (~90%)
- Performance: `budget * 1.0` (~100%)
- Featured: `budget * 1.25` (~125%)

### Persona IDs

Use kebab-case: `competitive-gamer`, `ai-enthusiast`, `home-office`, `custom-build`

## Development Notes

- **HMR**: Vite's Hot Module Replacement works automatically, no page reload needed
- **Port 5173**: Dev server and test servers use this port (configured in Playwright)
- **Vitest worldConfig**: BDD tests point to `http://localhost:5173`
- **Test data-testid attributes**: Use for reliable E2E/BDD selectors (e.g., `data-testid="build-card"`)
- **QuickPickle**: BDD tests run in Vitest with Playwright browser automation (not Cucumber)
