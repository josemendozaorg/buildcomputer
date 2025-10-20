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

  it("should display builds with actual component prices", () => {
    render(
      <BuildRecommendations personaId="competitive-gamer" budget={2000} />,
    );

    // Should have 3 build tiers
    const buildCards = screen.getAllByTestId("build-card");
    expect(buildCards).toHaveLength(3);

    // Prices should be calculated from actual components
    const prices = screen.getAllByTestId("build-price");
    expect(prices[0].textContent).toBeTruthy();
    expect(prices[1].textContent).toBeTruthy();
    expect(prices[2].textContent).toBeTruthy();

    // Each price should be a valid currency format
    prices.forEach((price) => {
      expect(price.textContent).toMatch(/^\$/);
    });
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
