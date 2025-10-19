/**
 * Unit Tests for React Router Configuration
 *
 * Tests verify that:
 * 1. React Router is properly configured
 * 2. Routes are defined correctly
 * 3. Navigation works as expected
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../src/App";

describe("React Router Configuration", () => {
  it("should render the landing page at root route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    // Verify landing page content is displayed - use getAllByText since the brand appears multiple times
    const brandElements = screen.getAllByText(/BuildComputer/i);
    expect(brandElements.length).toBeGreaterThan(0);

    // Verify Get Started button is present
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
  });

  it("should render the BuilderPage at /build route", () => {
    render(
      <MemoryRouter initialEntries={["/build"]}>
        <App />
      </MemoryRouter>,
    );

    // Verify BuilderPage content is displayed
    expect(
      screen.getByRole("heading", { name: /pc builder/i }),
    ).toBeInTheDocument();
  });

  it("should have routing capability configured", () => {
    // This test verifies that react-router-dom is installed and accessible
    expect(() => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>,
      );
    }).not.toThrow();
  });
});
