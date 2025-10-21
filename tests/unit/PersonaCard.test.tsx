/**
 * Unit Tests for PersonaCard Component
 *
 * Tests verify that:
 * 1. PersonaCard renders with all persona data
 * 2. Selection state is displayed correctly
 * 3. Click handler is called when card is clicked
 * 4. Accessibility features work (keyboard navigation, ARIA attributes)
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PersonaCard from "../../src/components/PersonaCard";

describe("PersonaCard Component", () => {
  const mockPersona = {
    id: "competitive-gamer",
    title: "Competitive Gamer",
    tagline: "Win every fight",
    examples: "Valorant, CS2, Apex at 144+ FPS",
    icon: "🎮",
  };

  it("should render persona data correctly", () => {
    render(
      <PersonaCard
        persona={mockPersona}
        selected={false}
        onSelect={() => {}}
      />,
    );

    // Verify title is displayed
    expect(screen.getByText("Competitive Gamer")).toBeInTheDocument();

    // Verify tagline is displayed
    expect(screen.getByText("Win every fight")).toBeInTheDocument();

    // Verify examples are displayed
    expect(screen.getByText(/Valorant, CS2, Apex/i)).toBeInTheDocument();

    // Verify icon is displayed
    expect(screen.getByText("🎮")).toBeInTheDocument();
  });

  it("should call onSelect when card is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <PersonaCard
        persona={mockPersona}
        selected={false}
        onSelect={handleSelect}
      />,
    );

    // Click the card
    const card = screen.getByRole("button");
    await user.click(card);

    // Verify handler was called with persona id
    expect(handleSelect).toHaveBeenCalledWith("competitive-gamer");
  });

  it("should display selected state with indigo border", () => {
    const { container } = render(
      <PersonaCard persona={mockPersona} selected={true} onSelect={() => {}} />,
    );

    // Verify selected styling is applied
    const card = container.querySelector("button");
    expect(card).toHaveClass("border-indigo-600");
  });

  it("should not display selected state when not selected", () => {
    const { container } = render(
      <PersonaCard
        persona={mockPersona}
        selected={false}
        onSelect={() => {}}
      />,
    );

    // Verify selected styling is NOT applied
    const card = container.querySelector("button");
    expect(card).not.toHaveClass("border-indigo-600");
  });

  it("should be keyboard accessible", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <PersonaCard
        persona={mockPersona}
        selected={false}
        onSelect={handleSelect}
      />,
    );

    // Tab to card and press Enter
    const card = screen.getByRole("button");
    card.focus();
    await user.keyboard("{Enter}");

    // Verify handler was called
    expect(handleSelect).toHaveBeenCalledWith("competitive-gamer");
  });

  it('should display "Coming Soon" badge for Custom Build persona', () => {
    const customBuildPersona = {
      id: "custom-build",
      title: "Custom Build",
      tagline: "I know what I need",
      examples: "Component-by-component customization",
      icon: "🔧",
    };

    render(
      <PersonaCard
        persona={customBuildPersona}
        selected={false}
        onSelect={() => {}}
      />,
    );

    // Verify "Coming Soon" badge is displayed
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
  });

  it('should not display "Coming Soon" badge for other personas', () => {
    render(
      <PersonaCard
        persona={mockPersona}
        selected={false}
        onSelect={() => {}}
      />,
    );

    // Verify "Coming Soon" badge is NOT displayed
    expect(screen.queryByText("Coming Soon")).not.toBeInTheDocument();
  });
});
