@acceptance
Feature: Persona-Based PC Builder MVP
  As a user who wants to build a PC
  I want to select my use case and budget instead of technical specs
  So that I can get instant build recommendations without technical knowledge

  Background:
    Given the BuildComputer application is running

  @ui @navigation
  Scenario: User navigates to PC Builder from landing page
    Given the user is on the BuildComputer landing page
    When the user clicks the "Get Started" button
    Then the browser navigates to the "/build" route
    And the persona selection interface is displayed
    And 8 persona cards are visible

  @ui @persona-selection
  Scenario: User selects a persona and sees budget slider
    Given the user is on the "/build" page
    When the user clicks the "Competitive Gamer" persona card
    Then the persona card is visually highlighted with an indigo border
    And the budget slider appears below the persona cards
    And the slider is set to a default value of $1500

  @ui @budget @build-recommendations
  Scenario: User adjusts budget and sees build recommendations
    Given the user has selected the "Competitive Gamer" persona
    And the budget slider is visible
    When the user drags the slider to $2000
    Then the budget value display updates to show "$2000"
    And 3 build recommendation cards appear instantly within 200ms
    And the cards show "Optimized Build", "Performance Build", and "Featured Build"
    And each card displays a total price and capability description

  @build-details
  Scenario: User expands build details to view components
    Given the user is viewing 3 build recommendation cards
    When the user clicks "View Details" on the "Optimized Build" card
    Then the card expands with a smooth transition of 300ms
    And a component list is revealed showing CPU, GPU, RAM, Storage
    And each component shows name, type, and key specs

  @persona-switching
  Scenario: User changes persona and sees updated builds
    Given the user has selected "Competitive Gamer" with budget $2000
    And build recommendations are displayed
    When the user clicks the "Creator" persona card
    Then the "Competitive Gamer" card is deselected
    And the "Creator" card is highlighted
    And the build recommendations update instantly to show creator-optimized builds
    And the capability descriptions change to reflect content creation use cases

  @edge-case @budget-validation
  Scenario: User sets budget too low for selected persona
    Given the user has selected the "AI Enthusiast" persona
    When the user sets the budget slider to $600
    Then a yellow warning banner appears
    And the warning states "This persona works best with a budget of at least $1200"
    And build cards show disabled state or adjusted recommendations

  @accessibility @keyboard
  Scenario: User navigates with keyboard only
    Given the user is on the "/build" page
    When the user presses the Tab key repeatedly
    Then focus moves through persona cards in logical order
    And each focused element shows a visible focus ring in indigo-500
    When the user presses Enter on a focused persona card
    Then the persona is selected
    When the user tabs to the budget slider and uses arrow keys
    Then the slider value increases and decreases accordingly

  @mobile @touch
  Scenario: Mobile user interacts with touch
    Given the user is on a mobile device with viewport width less than 640px
    And the user is on the "/build" page
    When the user taps a persona card
    Then the card is selected without hover state
    When the user drags the budget slider with touch
    Then the slider thumb responds smoothly to touch input
    And the touch target is at least 44x44 pixels

  @desktop @hover
  Scenario: Desktop user sees hover effects
    Given the user is on a desktop device with a mouse
    And the user is viewing the persona cards
    When the user moves the mouse over a persona card
    Then the card scales to 105% with 150ms transition
    And the card shadow increases
    And the cursor changes to pointer

  @direct-access
  Scenario: User accesses /build directly via URL
    Given the user types "/build" in the browser address bar
    When the page loads
    Then the builder interface is displayed
    And no persona is pre-selected
    And the budget slider is not visible yet
    And an empty state message says "Choose your story above to see build recommendations"

  @responsive @ui
  Scenario: Responsive layout adapts to screen size
    Given the user is on the "/build" page
    When the viewport width is less than 640px
    Then persona cards are displayed in 1 column at full width
    And build cards stack vertically
    When the viewport width is between 640px and 1024px
    Then persona cards are displayed in 2 columns
    When the viewport width is greater than 1024px
    Then persona cards are displayed in 4 columns in 2 rows
    And build cards can be displayed side-by-side

  @ui @future-feature
  Scenario: "Custom Build" persona indicates future feature
    Given the user is on the "/build" page
    And the user is viewing the 8 persona cards
    When the user looks at the "Custom Build" card
    Then the card displays a "Coming Soon" badge
    And clicking it shows a tooltip saying "Component-by-component customization coming soon"
