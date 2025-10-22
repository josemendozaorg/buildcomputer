# AI Conversational Builder - Requirements Clarification

## Current State Analysis

**Existing MVP:**

- 8 static personas (Competitive Gamer, Cinematic Gamer, Creator, AI Enthusiast, Student, Professional, Casual User, Custom Build)
- Linear workflow: Persona selection → Budget slider → 3 build recommendations (Optimized/Performance/Featured)
- Static component database with ~538 lines of hardcoded components organized by budget tier
- Component selection logic based on persona + budget tier
- All interactions are click-based with immediate updates

**Technology Stack:**

- React 18 + TypeScript (strict)
- Tailwind CSS for styling
- Vitest + Playwright + QuickPickle (BDD) for testing
- Vite for build tooling

## Critical Questions Requiring User Decisions

### 1. AI Interaction Model & Integration Strategy

**Question:** How should AI integrate with the existing persona system?

**Options:**

**A) Hybrid Approach (RECOMMENDED)**

- Keep persona cards as entry point for quick starts
- Add "Talk to AI Builder" button for conversational flow
- Users can switch between modes at any time
- AI can suggest personas during conversation
- **Pros:** Preserves existing UX, adds flexibility, gradual learning curve
- **Cons:** More complex state management

**B) Replace Personas with Pure Conversational Interface**

- Remove persona cards entirely
- Start with AI chat greeting: "Hi! Let's build your perfect PC. What will you mainly use it for?"
- AI determines persona through conversation
- **Pros:** Fully conversational, modern AI-first experience
- **Cons:** Breaks existing workflows, may alienate users who prefer quick selection

**C) AI-Enhanced Personas**

- Keep persona selection as primary flow
- Add AI chatbot as sidebar/panel for questions during build process
- AI provides explanations and refinements, not primary navigation
- **Pros:** Minimal disruption, clear separation of concerns
- **Cons:** AI feels like an afterthought rather than core feature

**My Recommendation:** **Option A (Hybrid)** - Provides best of both worlds, allows users to choose their preferred interaction style.

---

### 2. Educational Features Definition

**Question:** What specific educational features should AI provide?

**Options to implement (select multiple):**

**A) Component Explanations**

- Tooltip/popover on hover: "What does this component do?"
- AI explains in simple terms (e.g., "GPU = Graphics card that renders images")
- Include when it matters for their use case

**B) Recommendation Reasoning**

- "Why this choice?" button on each component
- AI explains: "I chose RTX 4070 because you need ray tracing for Cyberpunk at high FPS"
- Shows performance impact and alternatives

**C) Comparison Mode**

- "Compare components" feature
- AI explains differences: "RTX 4070 vs RTX 4060 Ti: 40% faster in 4K gaming, costs $200 more"
- Visual charts/graphs for specs

**D) Real-time Guidance During Selection**

- AI suggests adjustments: "Your CPU might bottleneck this GPU, consider upgrading"
- Compatibility warnings with explanations
- Budget optimization tips

**E) Educational Tooltips Throughout UI**

- Hover over technical terms for instant definitions
- "Learn more" links to deeper explanations
- Progressive disclosure (basic → intermediate → expert)

**My Recommendation:** Implement **A, B, D, E** in Phase 1. Add **C** in Phase 2.

---

### 3. Conversational Flow Design

**Question:** What should the AI conversation flow look like?

**Option A: Structured Wizard with Natural Language (RECOMMENDED)**

```
AI: Hi! I'm here to help you build the perfect PC. What will you mainly use it for?
User: Gaming and streaming
AI: Great! What games do you play?
User: Mostly Valorant and some Cyberpunk
AI: Got it! For competitive games like Valorant, you'll want high FPS. For Cyberpunk, you'll need strong graphics. What's your budget range?
User: Around $1500-2000
AI: Perfect! Let me create some builds for you...
[Shows 3 build cards with explanations]
```

**Option B: Free-form Conversation**

```
AI: Tell me about your dream PC!
User: I want something for gaming but not too expensive
AI: What's your budget?
User: Maybe $1500?
AI: What games?
[More back-and-forth, less structured]
```

**Option C: Guided Prompts with Chat**

```
[UI shows prompt chips:]
"What will you use it for?" [Gaming] [Work] [Content Creation] [AI/ML] [General Use]
User clicks: Gaming
AI: Nice! What type of gaming? [Show chips: Competitive, Story-driven, Both]
[Hybrid of chips + chat input]
```

**My Recommendation:** **Option C** - Combines speed of selection with flexibility of natural language.

---

### 4. Mock Product Database Structure

**Question:** How should we structure the mock product database for future real data integration?

**Option A: Enhanced Current Structure (RECOMMENDED)**

```typescript
interface Product {
  id: string; // Unique identifier for future DB
  type: ComponentType;
  name: string;
  brand: string;
  price: number;
  specs: Record<string, string>;

  // NEW for AI features:
  description: string; // AI-friendly explanation
  performance_tier: "entry" | "mid" | "high" | "enthusiast";
  use_cases: string[]; // ['gaming', 'content-creation', 'ai-workload']
  compatibility_notes: string[]; // ['Requires PCIe 4.0', 'Needs 650W PSU']
  pros: string[]; // For AI to explain
  cons: string[]; // For AI to explain
  alternatives: string[]; // Product IDs of comparable components
}
```

**Option B: Separate AI Context Layer**

```typescript
// Keep current Product type
// Add separate AI metadata
interface AIProductContext {
  product_id: string;
  simple_explanation: string;
  when_to_choose: string;
  common_questions: FAQItem[];
}
```

**My Recommendation:** **Option A** - Single source of truth, easier to maintain, ready for real API integration.

---

### 5. UI/UX Patterns

**Question:** What UI pattern for the conversational interface?

**Option A: Side-by-Side Layout (RECOMMENDED)**

```
┌─────────────────┬──────────────────┐
│                 │                  │
│  Chat Panel     │  Build Preview   │
│  (Left 40%)     │  (Right 60%)     │
│                 │                  │
│  AI messages    │  Components      │
│  User input     │  updating live   │
│                 │                  │
└─────────────────┴──────────────────┘
```

**Option B: Full-screen Chat → Results**

```
Step 1: Chat fills screen
Step 2: Slide to results view
Step 3: Chat becomes footer/drawer
```

**Option C: Overlay Chat Widget**

```
Main UI stays the same
Chat bubble in bottom-right
Expands to overlay panel
```

**My Recommendation:** **Option A** for desktop, **Option B** for mobile (responsive).

---

### 6. AI Service Integration

**Question:** Which AI service should we integrate for conversational features?

**Critical Decision - Requires User Input:**

**Option A: OpenAI GPT-4 API**

- Pros: Best conversational quality, wide adoption, good documentation
- Cons: Costs per token, requires API key, external dependency
- Cost: ~$0.01-0.03 per conversation

**Option B: Anthropic Claude API**

- Pros: Excellent instruction following, good at structured output
- Cons: Requires API key, external dependency
- Cost: ~$0.008-0.024 per conversation

**Option C: Local LLM (Ollama/LM Studio)**

- Pros: No API costs, privacy-friendly, works offline
- Cons: Requires local setup, slower, less capable
- Cost: Free (compute only)

**Option D: Mock AI Service (for MVP)**

- Pros: No external dependencies, fast development, predictable behavior
- Cons: Not true AI, limited flexibility, needs replacement later
- Cost: Free

**My Recommendation for Phase 1:** **Option D (Mock)** - Build the UI/UX flows with deterministic responses, then swap in real AI (A or B) in Phase 2. This allows us to:

- Develop and test faster
- Perfect the conversation flow
- Avoid API costs during development
- Easy to swap providers later

---

## Proposed Feature Scope for MVP

### Phase 1: AI Conversational Interface (This PR)

**In Scope:**

1. Hybrid interaction model (persona cards + conversational mode)
2. Mock AI service with scripted responses
3. Chat UI component with typing indicators
4. Educational tooltips and component explanations
5. Real-time build preview updates during conversation
6. "Why this choice?" reasoning for recommendations
7. Enhanced product database with AI context
8. Smooth animations and transitions
9. Full test coverage (Unit + BDD + E2E)

**Out of Scope (Future PRs):**

- Real AI API integration (OpenAI/Claude)
- Component comparison charts/graphs
- Advanced compatibility checking
- Price tracking and alerts
- User accounts and saved builds
- Multi-language support

### Success Metrics

- 100% test coverage maintained
- All 12 existing BDD scenarios still pass
- 15+ new BDD scenarios for conversational flow
- Conversational flow completes in under 2 minutes
- Educational content displayed within 100ms
- WCAG 2.1 AA compliance
- Smooth 60fps animations

---

## Questions for User Approval

**PLEASE CONFIRM:**

1. **AI Integration:** Approve Hybrid approach (personas + conversational mode)?
2. **Educational Features:** Implement A, B, D, E (explanations, reasoning, guidance, tooltips)?
3. **Conversation Flow:** Use guided prompts with chat (Option C)?
4. **Database Structure:** Enhanced Product interface (Option A)?
5. **UI Layout:** Side-by-side for desktop, full-screen for mobile (Option A + B)?
6. **AI Service:** Start with Mock AI service, plan for real API in Phase 2 (Option D)?
7. **Scope:** Agree with Phase 1 scope above?

**ADDITIONAL QUESTIONS:**

8. **Tone & Personality:** Should the AI be:
   - Professional and informative?
   - Friendly and casual?
   - Enthusiastic and encouraging?
   - Technical expert?

9. **Conversation Length:** Target number of messages before showing builds:
   - Quick (3-5 messages)?
   - Moderate (6-10 messages)?
   - Detailed (10+ messages)?

10. **Error Handling:** How should AI handle unclear input?
    - Ask for clarification?
    - Make best guess and confirm?
    - Show examples/suggestions?

Please review and approve/modify these decisions so I can proceed to Phase 2 (Spec creation).
