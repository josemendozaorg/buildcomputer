/**
 * Unit Tests for PersonaSelector Component
 *
 * Tests verify that:
 * 1. PersonaSelector renders all 8 persona cards
 * 2. Single selection behavior (only one selected at a time)
 * 3. onSelect callback is called when a persona is selected
 * 4. Selection state is managed correctly
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PersonaSelector from "../../src/components/PersonaSelector";

describe("PersonaSelector Component", () => {
  it("should render 8 persona cards", () => {
    render(<PersonaSelector selectedPersonaId={null} onSelect={() => {}} />);

    // Verify all 8 personas are rendered
    expect(screen.getByText("Competitive Gamer")).toBeInTheDocument();
    expect(screen.getByText("Cinematic Gamer")).toBeInTheDocument();
    expect(screen.getByText("Creator")).toBeInTheDocument();
    expect(screen.getByText("AI Enthusiast")).toBeInTheDocument();
    expect(screen.getByText("Student")).toBeInTheDocument();
    expect(screen.getByText("Professional")).toBeInTheDocument();
    expect(screen.getByText("Casual User")).toBeInTheDocument();
    expect(screen.getByText("Custom Build")).toBeInTheDocument();
  });

  it("should call onSelect when a persona card is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <PersonaSelector selectedPersonaId={null} onSelect={handleSelect} />,
    );

    // Click on Competitive Gamer card
    const card = screen.getByText("Competitive Gamer").closest("button");
    if (card) {
      await user.click(card);
    }

    // Verify callback was called with the persona id
    expect(handleSelect).toHaveBeenCalledWith("competitive-gamer");
  });

  it("should display selected persona with highlighted state", () => {
    const { container } = render(
      <PersonaSelector
        selectedPersonaId="competitive-gamer"
        onSelect={() => {}}
      />,
    );

    // Find the selected card
    const selectedCard = screen
      .getByText("Competitive Gamer")
      .closest("button");

    // Verify selected styling is applied
    expect(selectedCard).toHaveClass("border-indigo-600");
  });

  it("should display only one persona as selected", () => {
    const { container } = render(
      <PersonaSelector selectedPersonaId="creator" onSelect={() => {}} />,
    );

    // Count cards with selected styling
    const selectedCards = container.querySelectorAll(".border-indigo-600");

    // Verify only one card is selected
    expect(selectedCards).toHaveLength(1);
  });

  it("should allow changing selection", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    const { rerender } = render(
      <PersonaSelector
        selectedPersonaId="competitive-gamer"
        onSelect={handleSelect}
      />,
    );

    // Click on a different persona
    const creatorCard = screen.getByText("Creator").closest("button");
    if (creatorCard) {
      await user.click(creatorCard);
    }

    // Verify callback was called with new persona id
    expect(handleSelect).toHaveBeenCalledWith("creator");

    // Re-render with new selection
    rerender(
      <PersonaSelector selectedPersonaId="creator" onSelect={handleSelect} />,
    );

    // Verify new persona is selected
    const selectedCard = screen.getByText("Creator").closest("button");
    expect(selectedCard).toHaveClass("border-indigo-600");
  });

  it("should display cards in a grid layout", () => {
    const { container } = render(
      <PersonaSelector selectedPersonaId={null} onSelect={() => {}} />,
    );

    // Verify grid container exists
    const grid = container.querySelector(".grid");
    expect(grid).toBeInTheDocument();
  });
});
