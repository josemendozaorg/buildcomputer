/**
 * Unit Tests for BuilderPage Component
 *
 * Tests verify that:
 * 1. BuilderPage renders successfully
 * 2. PersonaSelector is displayed
 * 3. Component structure is correct
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BuilderPage from "../../src/pages/BuilderPage";

describe("BuilderPage Component", () => {
  it("should render successfully", () => {
    const { container } = render(<BuilderPage />);
    expect(container).toBeTruthy();
  });

  it("should display the PersonaSelector with heading", () => {
    render(<BuilderPage />);

    // Verify PersonaSelector heading is present
    expect(
      screen.getByRole("heading", { name: /choose your story/i }),
    ).toBeInTheDocument();
  });

  it("should have proper semantic structure", () => {
    const { container } = render(<BuilderPage />);

    // Verify main content area exists
    expect(container.querySelector("main")).toBeTruthy();
  });
});
