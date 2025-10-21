/**
 * Unit Tests for BudgetSlider Component
 *
 * Tests verify that:
 * 1. BudgetSlider renders with default value
 * 2. Value display shows formatted budget
 * 3. onChange callback is called when slider moves
 * 4. Slider has proper min/max/step attributes
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BudgetSlider from "../../src/components/BudgetSlider";

describe("BudgetSlider Component", () => {
  it("should render with default value", () => {
    render(<BudgetSlider value={1500} onChange={() => {}} />);

    // Verify slider is present
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveValue("1500");
  });

  it("should display formatted budget value", () => {
    render(<BudgetSlider value={2000} onChange={() => {}} />);

    // Verify budget display shows formatted value
    expect(screen.getByText(/\$2,?000/)).toBeInTheDocument();
  });

  it("should call onChange when slider value changes", async () => {
    const handleChange = vi.fn();

    render(<BudgetSlider value={1500} onChange={handleChange} />);

    // Get slider and change its value using fireEvent
    const slider = screen.getByRole("slider");
    const { fireEvent } = await import("@testing-library/react");
    fireEvent.change(slider, { target: { value: "2500" } });

    // Verify onChange was called with the new value
    expect(handleChange).toHaveBeenCalledWith(2500);
  });

  it("should have proper min, max, and step attributes", () => {
    render(<BudgetSlider value={1500} onChange={() => {}} />);

    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "500");
    expect(slider).toHaveAttribute("max", "5000");
    expect(slider).toHaveAttribute("step", "100");
  });

  it("should have accessible label", () => {
    render(<BudgetSlider value={1500} onChange={() => {}} />);

    // Verify slider has accessible name
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
  });
});
