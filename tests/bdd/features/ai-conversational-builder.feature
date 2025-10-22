Feature: AI Conversational Builder

  As a PC builder
  I want to use AI-powered conversational interface to build a custom PC
  So that I can get personalized recommendations with educational guidance

  Background:
    Given the BuildComputer application is running
    And the AI conversational builder feature is enabled

  # ==========================================
  # Group 1: Hybrid Interaction Model
  # ==========================================

  @acceptance @ai @hybrid-mode
  Scenario: User starts with AI chat mode
    Given user is on the builder page
    When user clicks "Talk to AI Builder" button
    Then chat interface should open with greeting message
    And AI should ask first question about use case
    And quick-reply chips should be visible

  @acceptance @ai @hybrid-mode @persona-preservation
  Scenario: User starts with persona selection (existing flow)
    Given user is on the builder page
    When user clicks a persona card
    Then budget slider should appear
    And build recommendations should generate
    And "Talk to AI Builder" option should still be available

  @acceptance @ai @mode-switching
  Scenario: User switches from persona to AI mode
    Given user has selected a persona and sees build recommendations
    When user clicks "Refine with AI" button
    Then chat interface should open
    And AI should acknowledge current selection
    And AI should ask how to refine the build

  @acceptance @ai @mode-switching
  Scenario: User switches from AI mode to persona selection
    Given user is in the middle of AI conversation
    When user clicks "Quick Select Persona" button
    Then persona cards should be displayed
    And conversation progress should be saved
    And user can return to conversation if needed

  @acceptance @ai @smart-suggestions
  Scenario: AI suggests persona during conversation
    Given user is conversing with AI about requirements
    When AI determines user matches "Competitive Gamer" persona
    Then AI should suggest "You sound like a competitive gamer! Want to see optimized builds?"
    And provide quick-reply chip to accept suggestion
    And provide option to continue custom conversation

  # ==========================================
  # Group 2: Conversational Flow with Quick-Reply Chips
  # ==========================================

  @acceptance @ai @conversation-flow
  Scenario: Complete conversation using only quick-reply chips
    Given user starts AI conversation
    When user selects quick-reply chips for all questions
    Then conversation should complete in 6-10 messages
    And AI should gather: use case, specific needs, budget range
    And build recommendations should be generated
    And conversation should feel natural and friendly

  @acceptance @ai @conversation-flow @mixed-input
  Scenario: Mixed input - chips and text
    Given user is in AI conversation
    When user selects a chip for question 1
    And types free-form text for question 2
    And selects chip for question 3
    Then AI should handle both input types seamlessly
    And responses should acknowledge user's specific text input
    And conversation flow should remain coherent

  @acceptance @ai @conversation-flow @text-input
  Scenario: Text-only conversation
    Given user starts AI conversation
    When user types free-form responses to all questions
    Then AI should parse responses intelligently
    And extract use case, budget, and preferences
    And ask clarifying questions when needed
    And complete conversation in 6-10 messages

  @acceptance @ai @context-awareness
  Scenario: AI remembers context from previous messages
    Given user mentions "I play Valorant competitively" in message 2
    When AI asks about graphics needs in message 4
    Then AI should reference Valorant context
    And response should be like "For Valorant, you'll want high FPS. What's your target?"
    And build recommendations should prioritize high refresh rate

  @acceptance @ai @conversation-controls
  Scenario: User can restart conversation
    Given user is halfway through AI conversation
    When user clicks "Start Over" button
    Then conversation should reset
    And chat history should clear
    And AI should greet user again
    And build preview should reset to empty state

  @acceptance @ai @state-persistence
  Scenario: Conversation saves state on navigation
    Given user is in the middle of AI conversation (message 4 of 8)
    When user navigates to home page
    And returns to builder page
    Then conversation should resume from message 4
    And AI context should be preserved
    And build preview should show current state

  # ==========================================
  # Group 3: Educational Features
  # ==========================================

  @acceptance @educational @tooltips
  Scenario: Component explanation tooltip on hover
    Given user sees build recommendations
    When user hovers over "GPU" component name
    Then tooltip should appear within 100ms
    And show simple explanation: "Graphics card that renders images and games"
    And tooltip should be WCAG 2.1 AA compliant

  @acceptance @educational @popovers
  Scenario: Detailed component explanation on click
    Given user sees build recommendation with RTX 4070
    When user clicks "Learn More" on GPU component
    Then popover should open with detailed explanation
    And show: description, when to choose this GPU, performance tier
    And popover should be dismissable and accessible

  @acceptance @educational @reasoning
  Scenario: "Why this choice?" shows reasoning
    Given user sees build recommendation
    When user clicks "Why this choice?" button on CPU component
    Then AI reasoning should display
    And explain: "I chose Ryzen 7 7800X3D because you need high FPS for competitive gaming"
    And show performance impact and alternatives
    And reasoning should reference user's stated needs

  @acceptance @educational @tooltips @technical-terms
  Scenario: Educational tooltip on technical term
    Given user sees component specs with "PCIe 4.0"
    When user hovers over "PCIe 4.0" term
    Then educational tooltip should appear
    And show simple definition: "PCIe 4.0 = Latest motherboard slot standard for fast data transfer"
    And provide "Learn more" link for deeper explanation

  @acceptance @educational @progressive-disclosure
  Scenario: Progressive disclosure - basic to advanced
    Given user views component explanation
    When user clicks "Show advanced details"
    Then additional technical specs should expand
    And show: clock speeds, TDP, architecture details
    And maintain readability with proper formatting

  @acceptance @educational @real-time-guidance
  Scenario: Real-time compatibility guidance
    Given user is building a PC via conversation
    When AI adds RTX 4090 to build with 550W PSU
    Then AI should show warning: "This GPU needs at least 850W PSU"
    And suggest PSU upgrade options
    And warning should be visually distinct (icon + color)

  # ==========================================
  # Group 4: UI Layouts - Responsive
  # ==========================================

  @acceptance @ui @responsive @desktop
  Scenario: Desktop side-by-side layout
    Given user is on desktop viewport (≥1024px width)
    When user starts AI conversation
    Then chat panel should occupy left 40% of screen
    And build preview should occupy right 60%
    And both panels should be visible simultaneously
    And build preview should update in real-time as conversation progresses

  @acceptance @ui @responsive @mobile
  Scenario: Mobile full-screen chat
    Given user is on mobile viewport (<768px width)
    When user starts AI conversation
    Then chat should fill entire screen
    And build preview should be hidden
    And navigation should show "View Build" button
    And chat input should be fixed at bottom

  @acceptance @ui @responsive @mobile @transitions
  Scenario: Mobile transition to build view
    Given user completes AI conversation on mobile
    When AI shows build recommendations
    Then screen should smoothly transition to build view
    And chat should minimize to bottom drawer
    And user can tap drawer to expand chat again
    And transition should be 60fps smooth

  @acceptance @ui @responsive @tablet
  Scenario: Tablet responsive layout
    Given user is on tablet viewport (768px-1023px width)
    When user starts AI conversation
    Then layout should stack vertically: chat on top, build preview below
    And both sections should be scrollable
    And user can collapse chat to see more of build preview

  # ==========================================
  # Group 5: Error Handling & Edge Cases
  # ==========================================

  @acceptance @error-handling @clarification
  Scenario: Unclear input triggers clarification
    Given user is in AI conversation
    When user types vague response: "something good"
    Then AI should ask for clarification
    And show helpful examples: "Are you looking for gaming, work, or content creation?"
    And provide quick-reply chips with options

  @acceptance @error-handling @budget-validation
  Scenario: Budget validation and guidance
    Given user specifies budget of "$200" in conversation
    When AI processes the budget
    Then AI should explain: "For a complete build, $200 is below minimum. Consider starting at $500 for basic builds."
    And ask if user wants to adjust budget
    And provide chip options: [$500] [$750] [$1000] [Custom]

  @acceptance @error-handling @network-errors
  Scenario: Network error handling (for future API)
    Given user is in AI conversation
    When mock AI service simulates error
    Then error message should display: "Oops! Something went wrong. Let's try that again."
    And user should see "Retry" button
    And conversation context should be preserved
    And previous messages should remain visible

  # ==========================================
  # Group 6: Accessibility & Performance
  # ==========================================

  @acceptance @accessibility @keyboard
  Scenario: Keyboard navigation in chat
    Given user navigates with keyboard only
    When user tabs through chat interface
    Then focus should move through: quick-reply chips, text input, send button
    And Enter key should select focused chip
    And Escape key should close popovers/tooltips
    And focus indicators should be clearly visible (WCAG 2.1 AA)

  @acceptance @accessibility @screen-reader
  Scenario: Screen reader announcements
    Given screen reader user is in AI conversation
    When AI sends new message
    Then message should be announced via aria-live region
    And announcement should include: "AI says: [message text]"
    And typing indicator should announce: "AI is typing"
    And all interactive elements should have proper labels

  @acceptance @performance @animations
  Scenario: Smooth animations and performance
    Given user is interacting with AI chat
    When AI typing indicator appears
    Then animation should run at 60fps
    And message transitions should be smooth (no jank)
    And educational tooltips should appear within 100ms
    And quick-reply chip hover states should be instant (<16ms)
