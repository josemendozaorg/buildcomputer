/**
 * Unit Tests: mockAIService Error Simulation
 *
 * Tests for AI service with network error simulation
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  generateAIResponse,
  simulateNetworkError,
  detectPersona,
  type AIMessage,
} from "../../../src/services/mockAIService";

describe("mockAIService", () => {
  beforeEach(() => {
    // Reset error simulation before each test
    simulateNetworkError(false);
  });

  describe("detectPersona", () => {
    it("should detect competitive gamer from keywords", () => {
      expect(detectPersona("I play valorant competitively")).toBe(
        "competitive-gamer",
      );
      expect(detectPersona("esports")).toBe("competitive-gamer");
      expect(detectPersona("I need high fps")).toBe("competitive-gamer");
    });

    it("should detect casual gamer", () => {
      expect(detectPersona("I want to play games")).toBe("casual-gamer");
      expect(detectPersona("gaming PC")).toBe("casual-gamer");
    });

    it("should detect content creator", () => {
      expect(detectPersona("YouTube video editing")).toBe("content-creator");
      expect(detectPersona("streaming on twitch")).toBe("content-creator");
    });

    it("should detect workstation", () => {
      expect(detectPersona("office work")).toBe("workstation");
      expect(detectPersona("coding and programming")).toBe("workstation");
    });

    it("should detect student", () => {
      expect(detectPersona("student homework")).toBe("student");
      expect(detectPersona("cheap budget build")).toBe("student");
    });

    it("should detect AI/ML", () => {
      expect(detectPersona("machine learning")).toBe("ai-ml");
      expect(detectPersona("tensorflow deep learning")).toBe("ai-ml");
    });

    it("should return null for no match", () => {
      expect(detectPersona("random text")).toBe(null);
      expect(detectPersona("hello")).toBe(null);
    });
  });

  describe("generateAIResponse - normal operation", () => {
    it("should return AI response with persona suggestion", async () => {
      const response = await generateAIResponse("I play valorant");

      expect(response.content).toBeDefined();
      expect(response.suggestions).toBeDefined();
      expect(response.suggestions?.personaId).toBe("competitive-gamer");
      expect(response.suggestions?.acceptLabel).toBe("Yes, show me builds");
    });

    it("should return default response for non-persona messages", async () => {
      const response = await generateAIResponse("hello");

      expect(response.content).toContain("Tell me more");
      expect(response.suggestions).toBeUndefined();
    });

    it("should be async and return a Promise", () => {
      const result = generateAIResponse("gaming");
      expect(result).toBeInstanceOf(Promise);
    });

    it("should complete within reasonable time (< 500ms)", async () => {
      const start = Date.now();
      await generateAIResponse("gaming");
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(500);
    });
  });

  describe("simulateNetworkError", () => {
    it("should enable error simulation", async () => {
      simulateNetworkError(true);
      // Error should be thrown on next call
      await expect(generateAIResponse("test")).rejects.toThrow();
    });

    it("should disable error simulation", async () => {
      simulateNetworkError(true);
      simulateNetworkError(false);

      // Should succeed after disabling
      const response = await generateAIResponse("gaming");
      expect(response).toBeDefined();
    });

    it("should throw network error when enabled", async () => {
      simulateNetworkError(true);

      await expect(generateAIResponse("gaming")).rejects.toThrow(
        "Network error",
      );
    });

    it("should throw error immediately without delay", async () => {
      simulateNetworkError(true);

      const start = Date.now();
      try {
        await generateAIResponse("gaming");
      } catch (error) {
        const duration = Date.now() - start;
        expect(duration).toBeLessThan(50); // Should fail fast
      }
    });

    it("should persist across multiple calls", async () => {
      simulateNetworkError(true);

      await expect(generateAIResponse("test1")).rejects.toThrow();
      await expect(generateAIResponse("test2")).rejects.toThrow();
      await expect(generateAIResponse("test3")).rejects.toThrow();
    });

    it("should reset properly", async () => {
      simulateNetworkError(true);
      await expect(generateAIResponse("test")).rejects.toThrow();

      simulateNetworkError(false);
      const response = await generateAIResponse("gaming");
      expect(response).toBeDefined();
    });
  });

  describe("error message content", () => {
    it("should throw descriptive error message", async () => {
      simulateNetworkError(true);

      try {
        await generateAIResponse("gaming");
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("Network error");
        expect((error as Error).message).toContain("AI service");
      }
    });
  });
});
