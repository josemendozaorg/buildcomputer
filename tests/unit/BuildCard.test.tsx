import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BuildCard from "../../src/components/BuildCard";

describe("BuildCard Component", () => {
  const mockBuild = {
    id: "optimized",
    title: "Optimized Build",
    price: 2000,
    description: "Best balance of performance and value for competitive gaming",
  };

  it("should render build title", () => {
    render(<BuildCard build={mockBuild} />);

    expect(screen.getByText("Optimized Build")).toBeInTheDocument();
  });

  it("should render formatted price with dollar sign", () => {
    render(<BuildCard build={mockBuild} />);

    const priceElement = screen.getByTestId("build-price");
    expect(priceElement).toBeInTheDocument();
    expect(priceElement.textContent).toContain("$");
    expect(priceElement.textContent).toContain("2,000");
  });

  it("should render capability description", () => {
    render(<BuildCard build={mockBuild} />);

    const description = screen.getByTestId("build-description");
    expect(description).toBeInTheDocument();
    expect(description.textContent).toBe(
      "Best balance of performance and value for competitive gaming",
    );
  });

  it("should have data-testid='build-card'", () => {
    render(<BuildCard build={mockBuild} />);

    const card = screen.getByTestId("build-card");
    expect(card).toBeInTheDocument();
  });

  it("should display different build information", () => {
    const performanceBuild = {
      id: "performance",
      title: "Performance Build",
      price: 2500,
      description: "Maximum FPS for competitive advantage",
    };

    render(<BuildCard build={performanceBuild} />);

    expect(screen.getByText("Performance Build")).toBeInTheDocument();
    expect(
      screen.getByText("Maximum FPS for competitive advantage"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("build-price").textContent).toContain("2,500");
  });
});
