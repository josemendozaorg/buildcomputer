# AI Conversational Builder - UI Mockups

## Desktop Layout (Hybrid Mode)

### Initial State - Entry Point

```
┌────────────────────────────────────────────────────────────────────┐
│  Header: BuildComputer                              [Pricing] [FAQ] │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│   HOW WOULD YOU LIKE TO START?                                    │
│                                                                    │
│   ┌─────────────────────┐  ┌─────────────────────┐              │
│   │  💬 Talk to AI      │  │  🎯 Quick Start     │              │
│   │                     │  │                     │              │
│   │  Have a             │  │  Choose from        │              │
│   │  conversation       │  │  preset personas    │              │
│   │  about your needs   │  │                     │              │
│   │                     │  │  [Start] ──────────>│              │
│   │  [Start Chat]       │  │                     │              │
│   └─────────────────────┘  └─────────────────────┘              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Conversational Mode - Active Chat

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Header: BuildComputer                      [Switch to Quick Start] [🏠] │
├──────────────────────────────┬───────────────────────────────────────────┤
│                              │                                           │
│  AI BUILDER CHAT             │  YOUR BUILD                              │
│  ────────────────            │  ──────────                              │
│                              │                                           │
│  💬 AI: Hi! I'm here to help│  ┌──────────────────────────────┐        │
│  you build your perfect PC.  │  │  Building...                 │        │
│  What will you mainly use    │  │                              │        │
│  it for?                     │  │  Budget: Not set             │        │
│                              │  │  Use case: Not set           │        │
│  [Gaming] [Work] [Creation]  │  └──────────────────────────────┘        │
│  [AI/ML] [Student]           │                                           │
│  [Or type your answer...]    │                                           │
│  ────────────────            │                                           │
│                              │                                           │
│  👤 You: Gaming and some     │                                           │
│  video editing               │                                           │
│  ────────────────            │                                           │
│                              │                                           │
│  💬 AI: Great combo! For     │  ┌──────────────────────────────┐        │
│  gaming, what type of games? │  │  Use case: Gaming +          │        │
│  Competitive (high FPS) or   │  │           Content Creation   │        │
│  story-driven (graphics)?    │  │  Budget: Not set             │        │
│  ⓘ Hover for explanation     │  │                              │        │
│                              │  │  Recommending:               │        │
│  [Competitive] [Story-driven]│  │  • Strong GPU (graphics)     │        │
│  [Both] [Type answer...]     │  │  • Good CPU (editing)        │        │
│  ────────────────            │  └──────────────────────────────┘        │
│                              │                                           │
│  👤 You: Both                 │                                           │
│  ────────────────            │                                           │
│                              │                                           │
│  💬 AI: Perfect! What's your │                                           │
│  budget range?               │                                           │
│                              │                                           │
│  [$500-1000] [$1000-1500]    │                                           │
│  [$1500-2000] [$2000+]       │                                           │
│  [Custom amount...]          │                                           │
│  ────────────────            │                                           │
│                              │                                           │
│  v                           │                                           │
│  [Type your message...]      │                                           │
│                              │                                           │
└──────────────────────────────┴───────────────────────────────────────────┘
```

### Conversational Mode - Results Shown

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Header: BuildComputer                      [Start New Build] [Save] [🏠]│
├──────────────────────────────┬───────────────────────────────────────────┤
│                              │                                           │
│  AI BUILDER CHAT ▼           │  YOUR BUILD                              │
│  (Minimized - click to       │  ──────────                              │
│   expand)                    │                                           │
│                              │  Gaming + Content Creation | $1500-2000  │
├──────────────────────────────┤                                           │
│                              │  ┌─────────────────────────────────┐     │
│  💬 Need to adjust? Ask me!  │  │ RECOMMENDED BUILD               │     │
│                              │  │ $1,847 - Performance Sweet Spot │     │
│  [Type question...]          │  │                                 │     │
│                              │  │ CPU: AMD Ryzen 7 7700X          │     │
│                              │  │ ⓘ Why? [8 cores for editing]   │     │
│                              │  │                                 │     │
│                              │  │ GPU: RTX 4070                   │     │
│                              │  │ ⓘ Why? [Great for both uses]   │     │
│                              │  │                                 │     │
│                              │  │ RAM: 32GB DDR5                  │     │
│                              │  │ Storage: 1TB NVMe + 2TB HDD     │     │
│                              │  │                                 │     │
│                              │  │ [View Full Details]             │     │
│                              │  │ [Compare Alternatives]          │     │
│                              │  │ [Adjust Build]                  │     │
│                              │  └─────────────────────────────────┘     │
│                              │                                           │
│                              │  ALTERNATIVE OPTIONS:                    │
│                              │  ┌────────────┐  ┌────────────┐         │
│                              │  │ Budget     │  │ Performance│         │
│                              │  │ $1,456     │  │ $2,234     │         │
│                              │  └────────────┘  └────────────┘         │
│                              │                                           │
└──────────────────────────────┴───────────────────────────────────────────┘
```

### Quick Start Mode (Existing Persona Flow Enhanced)

```
┌────────────────────────────────────────────────────────────────────┐
│  Header: BuildComputer             [Switch to AI Chat] [Pricing]   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│   CHOOSE YOUR STORY                        ⓘ Need help? Ask AI →  │
│                                                                    │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                        │
│   │ 🎮   │  │ 🎬   │  │ 🎨   │  │ 🤖   │                        │
│   │Compet│  │Cinema│  │Creato│  │ AI   │                        │
│   │itive │  │tic   │  │r     │  │Enthu │                        │
│   │Gamer │  │Gamer │  │      │  │siast │                        │
│   │      │  │      │  │      │  │      │  ⓘ Hover for           │
│   └──────┘  └──────┘  └──────┘  └──────┘     educational info    │
│                                                                    │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                        │
│   │ 📚   │  │ 💼   │  │ 🏠   │  │ 🔧   │                        │
│   │Studen│  │Profes│  │Casual│  │Custom│                        │
│   │t     │  │sional│  │User  │  │Build │                        │
│   │      │  │      │  │      │  │Soon! │                        │
│   └──────┘  └──────┘  └──────┘  └──────┘                        │
│                                                                    │
│   [Selected: Competitive Gamer 🎮]                                │
│                                                                    │
│   WHAT'S YOUR BUDGET?                                             │
│   ────────────────────────                                        │
│   [────────●──────────────]  $1,500                              │
│   $500              $3,000                                        │
│                                                                    │
│   💡 AI Insight: For competitive gaming, prioritizing high        │
│      refresh rate? I can optimize your build for 240Hz gaming.   │
│      [Yes, optimize] [No thanks]                                 │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Mobile Layout

### Mobile - Entry Point

```
┌──────────────────────┐
│  BuildComputer    ☰  │
├──────────────────────┤
│                      │
│  How would you like  │
│  to start?           │
│                      │
│  ┌────────────────┐  │
│  │  💬 Talk to AI │  │
│  │                │  │
│  │  Chat about    │  │
│  │  your needs    │  │
│  │                │  │
│  │  [Start Chat]  │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │  🎯 Quick Pick │  │
│  │                │  │
│  │  Choose preset │  │
│  │  options       │  │
│  │                │  │
│  │  [Start]       │  │
│  └────────────────┘  │
│                      │
└──────────────────────┘
```

### Mobile - Chat Active

```
┌──────────────────────┐
│  AI Builder       ⨉  │
├──────────────────────┤
│                      │
│  💬 AI: What will    │
│  you mainly use your │
│  PC for?             │
│                      │
│  [Gaming]            │
│  [Work]              │
│  [Content Creation]  │
│  [AI/ML]             │
│  [Other...]          │
│                      │
│  ──────────────      │
│                      │
│  👤 You: Gaming and  │
│  video editing       │
│                      │
│  ──────────────      │
│                      │
│  💬 AI: Great! What  │
│  type of gaming?     │
│  ⓘ Tap for info      │
│                      │
│  [Competitive]       │
│  [Story-driven]      │
│  [Both]              │
│                      │
│  ──────────────      │
│                      │
│ ▼ More messages...   │
│                      │
├──────────────────────┤
│ [Type message...] 📤 │
└──────────────────────┘
```

### Mobile - Results

```
┌──────────────────────┐
│  Your Build       ☰  │
├──────────────────────┤
│                      │
│  Gaming + Creation   │
│  Budget: $1500-2000  │
│                      │
│  ┌────────────────┐  │
│  │ RECOMMENDED    │  │
│  │ $1,847         │  │
│  │                │  │
│  │ CPU: Ryzen 7   │  │
│  │ 7700X          │  │
│  │ ⓘ Why?         │  │
│  │                │  │
│  │ GPU: RTX 4070  │  │
│  │ ⓘ Why?         │  │
│  │                │  │
│  │ RAM: 32GB DDR5 │  │
│  │ Storage: 1TB   │  │
│  │                │  │
│  │ [View Details] │  │
│  └────────────────┘  │
│                      │
│  Other Options:      │
│  [Budget] [Premium]  │
│                      │
│  ┌────────────────┐  │
│  │ 💬 Questions?  │  │
│  │ [Ask AI]       │  │
│  └────────────────┘  │
│                      │
└──────────────────────┘
```

## Educational Tooltip Example

```
┌─────────────────────────────────────┐
│  GPU: NVIDIA RTX 4070               │
│  ────────────────────────           │
│  Price: $549                        │
│                                     │
│  [ⓘ What is a GPU?]  ← Hover/Click │
└─────────────────────────────────────┘
        │
        v
┌─────────────────────────────────────────────┐
│  What is a GPU?                         ⨉   │
│  ─────────────────                          │
│                                             │
│  GPU = Graphics Processing Unit             │
│                                             │
│  Think of it as the "artist" of your PC.   │
│  It draws everything you see on screen.    │
│                                             │
│  For gaming: Higher GPU = Better graphics  │
│  & smoother gameplay                        │
│                                             │
│  For your use case (Gaming + Editing):     │
│  The RTX 4070 handles:                     │
│  • 1440p gaming at 100+ FPS                │
│  • 4K video editing with GPU acceleration  │
│  • Ray tracing for realistic lighting      │
│                                             │
│  [Learn More] [Compare to RTX 4060]        │
└─────────────────────────────────────────────┘
```

## "Why This Choice?" Example

```
┌──────────────────────────────────────────────┐
│  CPU: AMD Ryzen 7 7700X                     │
│  ────────────────────────                   │
│  8 Cores / 16 Threads                       │
│  Price: $329                                │
│                                             │
│  [🤔 Why this choice?]  ← Click            │
└──────────────────────────────────────────────┘
        │
        v
┌──────────────────────────────────────────────────────┐
│  Why Ryzen 7 7700X?                              ⨉   │
│  ──────────────────                                  │
│                                                      │
│  Based on your needs:                               │
│  ✓ Gaming - High single-core performance           │
│  ✓ Video Editing - 8 cores handle timeline work    │
│                                                      │
│  Performance for your use cases:                    │
│  • Valorant: 400+ FPS (more than enough)           │
│  • Cyberpunk 2077: 100+ FPS at 1440p              │
│  • Premiere Pro: 4K timeline scrubbing smooth      │
│  • DaVinci Resolve: Real-time color grading        │
│                                                      │
│  Why not alternatives?                              │
│  • Ryzen 5 7600X: Only 6 cores, slower editing     │
│  • Ryzen 9 7900X: Overkill for your needs, $200↑  │
│  • Intel i7-13700K: Similar but runs hotter        │
│                                                      │
│  [Compare Alternatives] [I want more cores]         │
└──────────────────────────────────────────────────────┘
```

## Component Interaction Flows

### Educational Hover States

```
Normal State:
  [Component Card]

Hover State:
  [Component Card with subtle highlight]
  ⓘ Tooltip appears: "Click for explanation"

Click State:
  [Modal/Popover with detailed explanation]
```

### Chat Interaction Patterns

```
User Input Methods:
1. Quick Reply Chips: [Option 1] [Option 2] [Option 3]
2. Text Input: [Type your answer...]
3. Slider for Budget: [────●────] with live preview
4. Multi-select: ☑ Gaming  ☑ Work  ☐ Other
```

### Animations & Transitions

```
Chat Messages:
  - AI messages fade in from left (300ms ease-out)
  - User messages slide in from right (200ms ease-out)
  - Typing indicator: 3 dots pulsing (800ms loop)

Build Preview:
  - Components appear with stagger (100ms between each)
  - Price counter animates up (500ms)
  - Smooth height transitions when expanding (300ms)

Educational Tooltips:
  - Fade in 150ms
  - Scale from 95% to 100%
  - Subtle shadow animation
```

## Accessibility Features

```
Keyboard Navigation:
  - Tab through all interactive elements
  - Enter/Space to activate buttons/chips
  - Escape to close modals/tooltips
  - Arrow keys for slider navigation

Screen Reader:
  - All images have alt text
  - ARIA labels on all interactive elements
  - Live regions announce build updates
  - Structured headings for navigation

Visual:
  - High contrast mode support
  - Focus indicators (indigo-500 ring)
  - Minimum touch target: 44x44px
  - Text scalable to 200%
```

## Color Scheme (Tailwind)

```
Primary: Indigo (indigo-600, indigo-500)
Success: Green (green-500)
Warning: Yellow (yellow-500)
Danger: Red (red-500)
Neutral: Gray (gray-100 to gray-900)

AI Messages: bg-indigo-50, text-gray-900
User Messages: bg-gray-100, text-gray-900
Educational: bg-blue-50, border-blue-200
```

---

These mockups demonstrate:

1. Hybrid entry point (choice between AI chat and quick start)
2. Side-by-side layout for desktop (chat + build preview)
3. Educational tooltips and "why" explanations
4. Mobile-first responsive design
5. Smooth animations and transitions
6. Accessibility-first approach
7. Clear information hierarchy
