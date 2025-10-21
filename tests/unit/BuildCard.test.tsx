import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import BuildCard from "../../src/components/BuildCard";
import { Build } from "../../src/types/components";

describe("BuildCard Component", () => {
  const mockBuild: Build = {
    id: "optimized",
    title: "Optimized Build",
    price: 876,
    description: "Best balance of performance and value for competitive gaming",
    components: [
      {
        type: "CPU",
        name: "AMD Ryzen 5 7600X",
        brand: "AMD",
        price: 229,
        specs: { cores: "6", threads: "12", "boost clock": "5.3 GHz" },
      },
      {
        type: "GPU",
        name: "NVIDIA GeForce RTX 4060 Ti",
        brand: "NVIDIA",
        price: 449,
        specs: { vram: "8GB GDDR6", "boost clock": "2.54 GHz" },
      },
      {
        type: "RAM",
        name: "G.Skill Ripjaws 32GB DDR5-6000",
        brand: "G.Skill",
        price: 109,
        specs: { capacity: "32GB", speed: "DDR5-6000" },
      },
      {
        type: "Storage",
        name: "Samsung 980 Pro 1TB NVMe SSD",
        brand: "Samsung",
        price: 89,
        specs: { capacity: "1TB", "read speed": "7,000 MB/s" },
      },
    ],
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
    expect(priceElement.textContent).toContain("876");
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
    const performanceBuild: Build = {
      id: "performance",
      title: "Performance Build",
      price: 1366,
      description: "Maximum FPS for competitive advantage",
      components: mockBuild.components, // Reuse components for simplicity
    };

    render(<BuildCard build={performanceBuild} />);

    expect(screen.getByText("Performance Build")).toBeInTheDocument();
    expect(
      screen.getByText("Maximum FPS for competitive advantage"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("build-price").textContent).toContain("1,366");
  });

  describe("Expandable Component Details", () => {
    it("should show 'View Details' button by default", () => {
      render(<BuildCard build={mockBuild} />);

      const viewDetailsButton = screen.getByRole("button", {
        name: /view details/i,
      });
      expect(viewDetailsButton).toBeInTheDocument();
    });

    it("should hide component list initially", () => {
      render(<BuildCard build={mockBuild} />);

      // Components should not be visible initially
      expect(screen.queryByText("AMD Ryzen 5 7600X")).not.toBeInTheDocument();
      expect(
        screen.queryByText("NVIDIA GeForce RTX 4060 Ti"),
      ).not.toBeInTheDocument();
    });

    it("should expand and show components when View Details is clicked", async () => {
      const user = userEvent.setup();
      render(<BuildCard build={mockBuild} />);

      const viewDetailsButton = screen.getByRole("button", {
        name: /view details/i,
      });
      await user.click(viewDetailsButton);

      // Components should now be visible
      expect(screen.getByText("AMD Ryzen 5 7600X")).toBeInTheDocument();
      expect(
        screen.getByText("NVIDIA GeForce RTX 4060 Ti"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("G.Skill Ripjaws 32GB DDR5-6000"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Samsung 980 Pro 1TB NVMe SSD"),
      ).toBeInTheDocument();
    });

    it("should display component types", async () => {
      const user = userEvent.setup();
      render(<BuildCard build={mockBuild} />);

      await user.click(screen.getByRole("button", { name: /view details/i }));

      expect(screen.getByText("CPU")).toBeInTheDocument();
      expect(screen.getByText("GPU")).toBeInTheDocument();
      expect(screen.getByText("RAM")).toBeInTheDocument();
      expect(screen.getByText("Storage")).toBeInTheDocument();
    });

    it("should display component specs", async () => {
      const user = userEvent.setup();
      render(<BuildCard build={mockBuild} />);

      await user.click(screen.getByRole("button", { name: /view details/i }));

      // Check CPU specs (text split across elements)
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("cores")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
      expect(screen.getByText("threads")).toBeInTheDocument();

      // Check GPU specs
      expect(screen.getByText("8GB GDDR6")).toBeInTheDocument();
    });

    it("should collapse when View Details button is clicked again", async () => {
      const user = userEvent.setup();
      render(<BuildCard build={mockBuild} />);

      const button = screen.getByRole("button", { name: /view details/i });

      // Expand
      await user.click(button);
      expect(screen.getByText("AMD Ryzen 5 7600X")).toBeInTheDocument();

      // Collapse
      const hideButton = screen.getByRole("button", { name: /hide details/i });
      await user.click(hideButton);
      expect(screen.queryByText("AMD Ryzen 5 7600X")).not.toBeInTheDocument();
    });

    it("should have data-testid for component list", async () => {
      const user = userEvent.setup();
      render(<BuildCard build={mockBuild} />);

      await user.click(screen.getByRole("button", { name: /view details/i }));

      const componentList = screen.getByTestId("component-list");
      expect(componentList).toBeInTheDocument();
    });
  });
});
