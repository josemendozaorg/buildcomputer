# BDD Migration from quickpickle to playwright-bdd

## Key Changes

### Import Changes

```typescript
// OLD (quickpickle)
import { Given, When, Then, Before } from "quickpickle";
import { PlaywrightWorld } from "@quickpickle/playwright";
import "@quickpickle/playwright/world";

// NEW (playwright-bdd)
import { Given, When, Then, Before } from "@cucumber/cucumber";
import { test, expect } from "./fixtures";
// No need to import Playwright fixtures - they're auto-injected
```

### Step Function Signatures

```typescript
// OLD (quickpickle with World)
Given("step text", async function (world: PersonaBuilderWorld) {
  await world.page.goto("url");
});

// NEW (playwright-bdd with fixtures)
Given("step text", async function ({ page }) {
  await page.goto("url");
});
```

### Fixtures Available

- `page` - Playwright Page object
- `context` - Browser context
- `request` - API request context
- `browser` - Browser instance

### World Interface

Custom World interfaces are not needed - use Playwright fixtures directly.

## Migration Status

- ✅ Dependencies updated (playwright-bdd installed, quickpickle removed)
- ✅ Configuration updated (playwright.config.ts, vitest.config.ts)
- ⏳ Step definitions being migrated
