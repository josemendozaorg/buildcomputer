import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BuildRecommendations from "../../src/components/BuildRecommendations";

describe("BuildRecommendations Component", () => {
  it("should render 3 build recommendation cards", () => {
    render(
      <BuildRecommendations personaId="competitive-gamer" budget={2000} />,
    );

    const buildCards = screen.getAllByTestId("build-card");
    expect(buildCards).toHaveLength(3);
  });

  it("should show Optimized, Performance, and Featured builds", () => {
    render(
      <BuildRecommendations personaId="competitive-gamer" budget={2000} />,
    );

    expect(screen.getByText("Optimized Build")).toBeInTheDocument();
    expect(screen.getByText("Performance Build")).toBeInTheDocument();
    expect(screen.getByText("Featured Build")).toBeInTheDocument();
  });

  it("should display prices for all builds", () => {
    render(
      <BuildRecommendations personaId="competitive-gamer" budget={2000} />,
    );

    const prices = screen.getAllByTestId("build-price");
    expect(prices).toHaveLength(3);

    prices.forEach((price) => {
      expect(price.textContent).toContain("$");
    });
  });

  it("should display descriptions for all builds", () => {
    render(
      <BuildRecommendations personaId="competitive-gamer" budget={2000} />,
    );

    const descriptions = screen.getAllByTestId("build-description");
    expect(descriptions).toHaveLength(3);

    descriptions.forEach((description) => {
      expect(description.textContent).toBeTruthy();
    });
  });

  it("should adjust builds based on budget", () => {
    const { rerender } = render(
      <BuildRecommendations personaId="competitive-gamer" budget={1000} />,
    );

    // Low budget build
    const lowBudgetPrices = screen.getAllByTestId("build-price");
    const lowBudgetPrice1 = lowBudgetPrices[0].textContent || "";

    // Higher budget build
    rerender(
      <BuildRecommendations personaId="competitive-gamer" budget={4000} />,
    );

    const highBudgetPrices = screen.getAllByTestId("build-price");
    const highBudgetPrice1 = highBudgetPrices[0].textContent || "";

    // Prices should be different
    expect(lowBudgetPrice1).not.toBe(highBudgetPrice1);
  });

  it("should show gaming-focused descriptions for gaming personas", () => {
    render(
      <BuildRecommendations personaId="competitive-gamer" budget={2000} />,
    );

    const descriptions = screen.getAllByTestId("build-description");
    const allText = descriptions
      .map((d) => d.textContent?.toLowerCase())
      .join(" ");

    // Should contain gaming-related terms
    expect(
      allText.includes("gaming") ||
        allText.includes("fps") ||
        allText.includes("performance"),
    ).toBe(true);
  });
});
