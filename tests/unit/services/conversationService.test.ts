/**
 * Unit Tests: conversationService Validation Logic
 *
 * Tests for vague input detection, budget validation, and clarification generation
 */

import { describe, it, expect } from "vitest";
import {
  isVagueInput,
  validateBudget,
  generateClarificationMessage,
  getBudgetGuidanceResponse,
  initConversationState,
  type BudgetValidationResult,
} from "../../../src/services/conversationService";

describe("isVagueInput", () => {
  describe("vague patterns detection", () => {
    it('should detect "something good"', () => {
      expect(isVagueInput("something good")).toBe(true);
      expect(isVagueInput("I want something good")).toBe(true);
    });

    it('should detect "i don\'t know" variations', () => {
      expect(isVagueInput("i don't know")).toBe(true);
      expect(isVagueInput("I don't know")).toBe(true);
      expect(isVagueInput("well, i don't know")).toBe(true);
    });

    it('should detect "idk"', () => {
      expect(isVagueInput("idk")).toBe(true);
      expect(isVagueInput("IDK")).toBe(true);
      expect(isVagueInput("Idk")).toBe(true);
    });

    it('should detect "maybe"', () => {
      expect(isVagueInput("maybe")).toBe(true);
      expect(isVagueInput("Maybe")).toBe(true);
      expect(isVagueInput("MAYBE")).toBe(true);
    });

    it('should detect "whatever"', () => {
      expect(isVagueInput("whatever")).toBe(true);
      expect(isVagueInput("Whatever")).toBe(true);
      expect(isVagueInput("whatever you think")).toBe(true);
    });

    it('should detect "not sure"', () => {
      expect(isVagueInput("not sure")).toBe(true);
      expect(isVagueInput("Not Sure")).toBe(true);
      expect(isVagueInput("I'm not sure")).toBe(true);
    });

    it('should detect "dunno"', () => {
      expect(isVagueInput("dunno")).toBe(true);
      expect(isVagueInput("Dunno")).toBe(true);
    });

    it('should detect "anything"', () => {
      expect(isVagueInput("anything")).toBe(true);
      expect(isVagueInput("Anything")).toBe(true);
      expect(isVagueInput("anything is fine")).toBe(true);
    });

    it('should detect "up to you"', () => {
      expect(isVagueInput("up to you")).toBe(true);
      expect(isVagueInput("Up To You")).toBe(true);
      expect(isVagueInput("it's up to you")).toBe(true);
    });

    it('should detect "doesn\'t matter"', () => {
      expect(isVagueInput("doesn't matter")).toBe(true);
      expect(isVagueInput("Doesn't Matter")).toBe(true);
    });

    it('should detect "i guess"', () => {
      expect(isVagueInput("i guess")).toBe(true);
      expect(isVagueInput("I Guess")).toBe(true);
    });

    it('should detect "any"', () => {
      expect(isVagueInput("any")).toBe(true);
      expect(isVagueInput("Any")).toBe(true);
    });
  });

  describe("empty and short inputs", () => {
    it("should detect empty string as vague", () => {
      expect(isVagueInput("")).toBe(true);
    });

    it("should detect whitespace-only as vague", () => {
      expect(isVagueInput("   ")).toBe(true);
      expect(isVagueInput("\t")).toBe(true);
      expect(isVagueInput("\n")).toBe(true);
    });

    it("should detect single character as vague", () => {
      expect(isVagueInput("a")).toBe(true);
      expect(isVagueInput("1")).toBe(true);
      expect(isVagueInput("?")).toBe(true);
    });
  });

  describe("case-insensitive matching", () => {
    it("should match regardless of casing", () => {
      expect(isVagueInput("IDK")).toBe(true);
      expect(isVagueInput("idk")).toBe(true);
      expect(isVagueInput("Idk")).toBe(true);
      expect(isVagueInput("iDk")).toBe(true);
    });
  });

  describe("clear inputs (not vague)", () => {
    it("should not flag clear specific responses", () => {
      expect(isVagueInput("I want a gaming PC")).toBe(false);
      expect(isVagueInput("My budget is $1500")).toBe(false);
      expect(isVagueInput("I need it for video editing")).toBe(false);
      expect(isVagueInput("Competitive gaming with high FPS")).toBe(false);
    });

    it("should not flag numeric answers", () => {
      expect(isVagueInput("1500")).toBe(false);
      expect(isVagueInput("$2000")).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle null/undefined", () => {
      expect(isVagueInput("")).toBe(true);
    });

    it("should trim whitespace before checking", () => {
      expect(isVagueInput("  idk  ")).toBe(true);
      expect(isVagueInput("  I want gaming PC  ")).toBe(false);
    });
  });
});

describe("validateBudget", () => {
  describe("valid budgets", () => {
    it("should accept $400 (minimum boundary)", () => {
      const result = validateBudget("$400");
      expect(result.valid).toBe(true);
      expect(result.amount).toBe(400);
      expect(result.error).toBeUndefined();
    });

    it("should accept $15,000 (maximum boundary)", () => {
      const result = validateBudget("$15,000");
      expect(result.valid).toBe(true);
      expect(result.amount).toBe(15000);
      expect(result.error).toBeUndefined();
    });

    it("should accept values in range", () => {
      expect(validateBudget("$1000").valid).toBe(true);
      expect(validateBudget("$2500").valid).toBe(true);
      expect(validateBudget("$8000").valid).toBe(true);
    });
  });

  describe("format parsing", () => {
    it('should parse "$1000" format', () => {
      const result = validateBudget("$1000");
      expect(result.valid).toBe(true);
      expect(result.amount).toBe(1000);
    });

    it('should parse "1000" format (no $)', () => {
      const result = validateBudget("1000");
      expect(result.valid).toBe(true);
      expect(result.amount).toBe(1000);
    });

    it('should parse "$1,000" format (with commas)', () => {
      const result = validateBudget("$1,000");
      expect(result.valid).toBe(true);
      expect(result.amount).toBe(1000);
    });

    it('should parse "1k" format (k suffix)', () => {
      const result = validateBudget("1k");
      expect(result.valid).toBe(true);
      expect(result.amount).toBe(1000);
    });

    it('should parse "2.5k" format (decimal k suffix)', () => {
      const result = validateBudget("2.5k");
      expect(result.valid).toBe(true);
      expect(result.amount).toBe(2500);
    });

    it('should parse "1 k" format (space before k)', () => {
      const result = validateBudget("1 k");
      expect(result.valid).toBe(true);
      expect(result.amount).toBe(1000);
    });
  });

  describe("too low budgets", () => {
    it("should reject $399", () => {
      const result = validateBudget("$399");
      expect(result.valid).toBe(false);
      expect(result.amount).toBe(399);
      expect(result.error).toBe("too_low");
      expect(result.message).toContain("$400");
    });

    it("should reject $200", () => {
      const result = validateBudget("$200");
      expect(result.valid).toBe(false);
      expect(result.amount).toBe(200);
      expect(result.error).toBe("too_low");
    });

    it("should reject $100", () => {
      const result = validateBudget("$100");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("too_low");
    });
  });

  describe("too high budgets", () => {
    it("should reject $15,001", () => {
      const result = validateBudget("$15,001");
      expect(result.valid).toBe(false);
      expect(result.amount).toBe(15001);
      expect(result.error).toBe("too_high");
      expect(result.message).toContain("$15,000");
    });

    it("should reject $50,000", () => {
      const result = validateBudget("$50,000");
      expect(result.valid).toBe(false);
      expect(result.amount).toBe(50000);
      expect(result.error).toBe("too_high");
    });

    it("should reject $100,000", () => {
      const result = validateBudget("$100,000");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("too_high");
    });
  });

  describe("invalid formats", () => {
    it("should reject empty string", () => {
      const result = validateBudget("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("invalid_format");
      expect(result.message).toBeDefined();
    });

    it("should reject non-numeric input", () => {
      const result = validateBudget("expensive");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("invalid_format");
    });

    it('should reject "free"', () => {
      const result = validateBudget("free");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("invalid_format");
    });
  });

  describe("educational messaging", () => {
    it("should include explanation for low budgets", () => {
      const result = validateBudget("$200");
      expect(result.message).toContain("CPU");
      expect(result.message).toContain("motherboard");
      expect(result.message).toContain("$450-500 minimum");
    });

    it("should include explanation for high budgets", () => {
      const result = validateBudget("$50,000");
      expect(result.message).toContain("high-end");
      expect(result.message).toContain("$5,000-8,000");
    });
  });
});

describe("generateClarificationMessage", () => {
  describe("escalation after 3 vague inputs", () => {
    it("should escalate with guided prompts after 3 vague inputs", () => {
      const state = initConversationState();
      const response = generateClarificationMessage(state, 3);

      expect(response.message).toContain("Having trouble");
      expect(response.message).toContain("specific questions");
      expect(response.chips).toBeDefined();
      expect(response.chips?.length).toBeGreaterThan(3);
    });

    it("should include helpful guided prompt chips", () => {
      const state = initConversationState();
      const response = generateClarificationMessage(state, 3);

      expect(response.chips).toContain("What will you use the PC for?");
      expect(response.chips).toContain("What's your budget range?");
    });
  });

  describe("context-aware clarification (step 0-1: use case)", () => {
    it("should provide use case clarification", () => {
      const state = initConversationState();
      state.step = 1;
      const response = generateClarificationMessage(state, 1);

      expect(response.message).toContain("gaming, work, or content creation");
      expect(response.chips).toBeDefined();
      expect(response.chips).toContain("I want a gaming PC");
    });
  });

  describe("context-aware clarification (step 2: specific needs)", () => {
    it("should provide specific needs clarification", () => {
      const state = initConversationState();
      state.step = 2;
      const response = generateClarificationMessage(state, 1);

      expect(response.message).toContain("more detail");
      expect(response.chips).toBeDefined();
      expect(response.chips).toContain("Performance");
    });
  });

  describe("context-aware clarification (step 3: budget)", () => {
    it("should provide budget clarification", () => {
      const state = initConversationState();
      state.step = 3;
      const response = generateClarificationMessage(state, 1);

      expect(response.message).toContain("budget");
      expect(response.chips).toBeDefined();
      expect(response.chips).toContain("Under $1000");
    });
  });

  describe("default clarification", () => {
    it("should provide generic clarification for unknown step", () => {
      const state = initConversationState();
      state.step = 99;
      const response = generateClarificationMessage(state, 1);

      expect(response.message).toBeDefined();
      expect(response.chips).toBeDefined();
    });
  });
});

describe("getBudgetGuidanceResponse", () => {
  describe("too_low budget guidance", () => {
    it("should provide low budget guidance", () => {
      const response = getBudgetGuidanceResponse("too_low");

      expect(response.message).toContain("under $400");
      expect(response.message).toContain("entry-level");
      expect(response.chips).toBeDefined();
    });

    it("should include appropriate preset chips for low budget", () => {
      const response = getBudgetGuidanceResponse("too_low");

      expect(response.chips).toContain("$400");
      expect(response.chips).toContain("$750");
      expect(response.chips).toContain("$1000");
      expect(response.chips).toContain("Custom");
    });
  });

  describe("too_high budget guidance", () => {
    it("should provide high budget guidance", () => {
      const response = getBudgetGuidanceResponse("too_high");

      expect(response.message).toContain("budget");
      expect(response.message).toContain("$8,000");
      expect(response.chips).toBeDefined();
    });

    it("should include appropriate preset chips for high budget", () => {
      const response = getBudgetGuidanceResponse("too_high");

      expect(response.chips).toContain("$1500");
      expect(response.chips).toContain("$3000");
      expect(response.chips).toContain("$5000");
      expect(response.chips).toContain("$8000");
      expect(response.chips).toContain("Custom");
    });
  });
});

describe("ConversationState initialization", () => {
  it("should initialize with vague input tracking", () => {
    const state = initConversationState();

    expect(state.vagueInputCount).toBe(0);
    expect(state.lastInputWasVague).toBe(false);
  });
});
