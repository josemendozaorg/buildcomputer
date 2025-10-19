/**
 * Step Definitions for Persona-Based PC Builder MVP
 *
 * These step definitions map Gherkin steps from persona-based-builder.feature
 * to executable test code. Currently all steps throw NotImplementedError
 * to ensure tests FAIL (RED phase) until the feature is implemented.
 */

import { Given, When, Then } from "quickpickle";
import { expect } from "vitest";

class NotImplementedError extends Error {
  constructor(step: string) {
    super(`Step not yet implemented: ${step}`);
    this.name = "NotImplementedError";
  }
}

// ============================================================================
// Background Steps
// ============================================================================

Given("the BuildComputer application is running", async function () {
  // Navigate to the application base URL
  throw new NotImplementedError("the BuildComputer application is running");
});

// ============================================================================
// Navigation Steps
// ============================================================================

Given("the user is on the BuildComputer landing page", async function () {
  throw new NotImplementedError(
    "the user is on the BuildComputer landing page",
  );
});

Given("the user is on the {string} page", async function (route: string) {
  throw new NotImplementedError(`the user is on the "${route}" page`);
});

When(
  "the user clicks the {string} button",
  async function (buttonText: string) {
    throw new NotImplementedError(`the user clicks the "${buttonText}" button`);
  },
);

Then(
  "the browser navigates to the {string} route",
  async function (route: string) {
    throw new NotImplementedError(
      `the browser navigates to the "${route}" route`,
    );
  },
);

When(
  "the user types {string} in the browser address bar",
  async function (url: string) {
    throw new NotImplementedError(
      `the user types "${url}" in the browser address bar`,
    );
  },
);

When("the page loads", async function () {
  throw new NotImplementedError("the page loads");
});

// ============================================================================
// Persona Selection Steps
// ============================================================================

Then("the persona selection interface is displayed", async function () {
  throw new NotImplementedError("the persona selection interface is displayed");
});

Then("{int} persona cards are visible", async function (count: number) {
  throw new NotImplementedError(`${count} persona cards are visible`);
});

When(
  "the user clicks the {string} persona card",
  async function (personaName: string) {
    throw new NotImplementedError(
      `the user clicks the "${personaName}" persona card`,
    );
  },
);

Then(
  "the persona card is visually highlighted with an indigo border",
  async function () {
    throw new NotImplementedError(
      "the persona card is visually highlighted with an indigo border",
    );
  },
);

Given(
  "the user has selected the {string} persona",
  async function (personaName: string) {
    throw new NotImplementedError(
      `the user has selected the "${personaName}" persona`,
    );
  },
);

Given(
  "the user has selected {string} with budget ${int}",
  async function (personaName: string, budget: number) {
    throw new NotImplementedError(
      `the user has selected "${personaName}" with budget $${budget}`,
    );
  },
);

Then("the {string} card is deselected", async function (personaName: string) {
  throw new NotImplementedError(`the "${personaName}" card is deselected`);
});

Then("the {string} card is highlighted", async function (personaName: string) {
  throw new NotImplementedError(`the "${personaName}" card is highlighted`);
});

Given(
  "the user is viewing the {int} persona cards",
  async function (count: number) {
    throw new NotImplementedError(
      `the user is viewing the ${count} persona cards`,
    );
  },
);

When("the user looks at the {string} card", async function (cardName: string) {
  throw new NotImplementedError(`the user looks at the "${cardName}" card`);
});

Then("the card displays a {string} badge", async function (badgeText: string) {
  throw new NotImplementedError(`the card displays a "${badgeText}" badge`);
});

Then(
  "clicking it shows a tooltip saying {string}",
  async function (tooltipText: string) {
    throw new NotImplementedError(
      `clicking it shows a tooltip saying "${tooltipText}"`,
    );
  },
);

// ============================================================================
// Budget Slider Steps
// ============================================================================

Then("the budget slider appears below the persona cards", async function () {
  throw new NotImplementedError(
    "the budget slider appears below the persona cards",
  );
});

Then(
  "the slider is set to a default value of ${int}",
  async function (defaultValue: number) {
    throw new NotImplementedError(
      `the slider is set to a default value of $${defaultValue}`,
    );
  },
);

Given("the budget slider is visible", async function () {
  throw new NotImplementedError("the budget slider is visible");
});

When("the user drags the slider to ${int}", async function (value: number) {
  throw new NotImplementedError(`the user drags the slider to $${value}`);
});

When(
  "the user sets the budget slider to ${int}",
  async function (value: number) {
    throw new NotImplementedError(
      `the user sets the budget slider to $${value}`,
    );
  },
);

Then(
  "the budget value display updates to show {string}",
  async function (displayValue: string) {
    throw new NotImplementedError(
      `the budget value display updates to show "${displayValue}"`,
    );
  },
);

When("the user drags the budget slider with touch", async function () {
  throw new NotImplementedError("the user drags the budget slider with touch");
});

Then("the slider thumb responds smoothly to touch input", async function () {
  throw new NotImplementedError(
    "the slider thumb responds smoothly to touch input",
  );
});

When(
  "the user tabs to the budget slider and uses arrow keys",
  async function () {
    throw new NotImplementedError(
      "the user tabs to the budget slider and uses arrow keys",
    );
  },
);

Then("the slider value increases and decreases accordingly", async function () {
  throw new NotImplementedError(
    "the slider value increases and decreases accordingly",
  );
});

// ============================================================================
// Build Recommendations Steps
// ============================================================================

Then(
  "{int} build recommendation cards appear instantly within {int}ms",
  async function (cardCount: number, timeMs: number) {
    throw new NotImplementedError(
      `${cardCount} build recommendation cards appear instantly within ${timeMs}ms`,
    );
  },
);

Then(
  "the cards show {string}, {string}, and {string}",
  async function (card1: string, card2: string, card3: string) {
    throw new NotImplementedError(
      `the cards show "${card1}", "${card2}", and "${card3}"`,
    );
  },
);

Then(
  "each card displays a total price and capability description",
  async function () {
    throw new NotImplementedError(
      "each card displays a total price and capability description",
    );
  },
);

Given("build recommendations are displayed", async function () {
  throw new NotImplementedError("build recommendations are displayed");
});

Then(
  "the build recommendations update instantly to show creator-optimized builds",
  async function () {
    throw new NotImplementedError(
      "the build recommendations update instantly to show creator-optimized builds",
    );
  },
);

Then(
  "the capability descriptions change to reflect content creation use cases",
  async function () {
    throw new NotImplementedError(
      "the capability descriptions change to reflect content creation use cases",
    );
  },
);

Then(
  "build cards show disabled state or adjusted recommendations",
  async function () {
    throw new NotImplementedError(
      "build cards show disabled state or adjusted recommendations",
    );
  },
);

Then("no persona is pre-selected", async function () {
  throw new NotImplementedError("no persona is pre-selected");
});

Then("the budget slider is not visible yet", async function () {
  throw new NotImplementedError("the budget slider is not visible yet");
});

Then("an empty state message says {string}", async function (message: string) {
  throw new NotImplementedError(`an empty state message says "${message}"`);
});

// ============================================================================
// Build Details Steps
// ============================================================================

Given(
  "the user is viewing {int} build recommendation cards",
  async function (count: number) {
    throw new NotImplementedError(
      `the user is viewing ${count} build recommendation cards`,
    );
  },
);

When(
  "the user clicks {string} on the {string} card",
  async function (buttonText: string, cardName: string) {
    throw new NotImplementedError(
      `the user clicks "${buttonText}" on the "${cardName}" card`,
    );
  },
);

Then(
  "the card expands with a smooth transition of {int}ms",
  async function (durationMs: number) {
    throw new NotImplementedError(
      `the card expands with a smooth transition of ${durationMs}ms`,
    );
  },
);

Then(
  "a component list is revealed showing CPU, GPU, RAM, Storage",
  async function () {
    throw new NotImplementedError(
      "a component list is revealed showing CPU, GPU, RAM, Storage",
    );
  },
);

Then("each component shows name, type, and key specs", async function () {
  throw new NotImplementedError(
    "each component shows name, type, and key specs",
  );
});

// ============================================================================
// Warning/Error Steps
// ============================================================================

Then("a yellow warning banner appears", async function () {
  throw new NotImplementedError("a yellow warning banner appears");
});

Then("the warning states {string}", async function (warningText: string) {
  throw new NotImplementedError(`the warning states "${warningText}"`);
});

// ============================================================================
// Keyboard Navigation Steps
// ============================================================================

When("the user presses the Tab key repeatedly", async function () {
  throw new NotImplementedError("the user presses the Tab key repeatedly");
});

Then("focus moves through persona cards in logical order", async function () {
  throw new NotImplementedError(
    "focus moves through persona cards in logical order",
  );
});

Then(
  "each focused element shows a visible focus ring in indigo-500",
  async function () {
    throw new NotImplementedError(
      "each focused element shows a visible focus ring in indigo-500",
    );
  },
);

When("the user presses Enter on a focused persona card", async function () {
  throw new NotImplementedError(
    "the user presses Enter on a focused persona card",
  );
});

Then("the persona is selected", async function () {
  throw new NotImplementedError("the persona is selected");
});

// ============================================================================
// Mobile/Touch Steps
// ============================================================================

Given(
  "the user is on a mobile device with viewport width less than {int}px",
  async function (width: number) {
    throw new NotImplementedError(
      `the user is on a mobile device with viewport width less than ${width}px`,
    );
  },
);

When("the user taps a persona card", async function () {
  throw new NotImplementedError("the user taps a persona card");
});

Then("the card is selected without hover state", async function () {
  throw new NotImplementedError("the card is selected without hover state");
});

Then(
  "the touch target is at least {int}x{int} pixels",
  async function (width: number, height: number) {
    throw new NotImplementedError(
      `the touch target is at least ${width}x${height} pixels`,
    );
  },
);

// ============================================================================
// Desktop/Hover Steps
// ============================================================================

Given("the user is on a desktop device with a mouse", async function () {
  throw new NotImplementedError("the user is on a desktop device with a mouse");
});

Given("the user is viewing the persona cards", async function () {
  throw new NotImplementedError("the user is viewing the persona cards");
});

When("the user moves the mouse over a persona card", async function () {
  throw new NotImplementedError("the user moves the mouse over a persona card");
});

Then(
  "the card scales to {int}% with {int}ms transition",
  async function (scalePercent: number, durationMs: number) {
    throw new NotImplementedError(
      `the card scales to ${scalePercent}% with ${durationMs}ms transition`,
    );
  },
);

Then("the card shadow increases", async function () {
  throw new NotImplementedError("the card shadow increases");
});

Then("the cursor changes to pointer", async function () {
  throw new NotImplementedError("the cursor changes to pointer");
});

// ============================================================================
// Responsive Layout Steps
// ============================================================================

When("the viewport width is less than {int}px", async function (width: number) {
  throw new NotImplementedError(`the viewport width is less than ${width}px`);
});

When(
  "the viewport width is between {int}px and {int}px",
  async function (minWidth: number, maxWidth: number) {
    throw new NotImplementedError(
      `the viewport width is between ${minWidth}px and ${maxWidth}px`,
    );
  },
);

When(
  "the viewport width is greater than {int}px",
  async function (width: number) {
    throw new NotImplementedError(
      `the viewport width is greater than ${width}px`,
    );
  },
);

Then(
  "persona cards are displayed in {int} column at full width",
  async function (columns: number) {
    throw new NotImplementedError(
      `persona cards are displayed in ${columns} column at full width`,
    );
  },
);

Then(
  "persona cards are displayed in {int} columns",
  async function (columns: number) {
    throw new NotImplementedError(
      `persona cards are displayed in ${columns} columns`,
    );
  },
);

Then(
  "persona cards are displayed in {int} columns in {int} rows",
  async function (columns: number, rows: number) {
    throw new NotImplementedError(
      `persona cards are displayed in ${columns} columns in ${rows} rows`,
    );
  },
);

Then("build cards stack vertically", async function () {
  throw new NotImplementedError("build cards stack vertically");
});

Then("build cards can be displayed side-by-side", async function () {
  throw new NotImplementedError("build cards can be displayed side-by-side");
});

// ============================================================================
// Display/UI State Steps
// ============================================================================

Then("the builder interface is displayed", async function () {
  throw new NotImplementedError("the builder interface is displayed");
});
