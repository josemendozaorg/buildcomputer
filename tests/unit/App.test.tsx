import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";

describe("App Component", () => {
  it("should render landing page with brand name and headline", () => {
    // Render the App component with Router
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    // Verify BuildComputer brand is present (appears in header and hero)
    const brandElements = screen.getAllByText(/BuildComputer/i);
    expect(brandElements.length).toBeGreaterThan(0);

    // Verify Get Started button is present
    const buttonElement = screen.getByText(/Get Started/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it("should navigate to /build when Get Started button is clicked", async () => {
    const user = userEvent.setup();

    // Render the App component with Router
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    // Verify we're on the landing page
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();

    // Click the Get Started button
    const button = screen.getByText(/Get Started/i);
    await user.click(button);

    // Verify we navigated to the builder page (now shows PersonaSelector)
    expect(
      screen.getByRole("heading", { name: /choose your story/i }),
    ).toBeInTheDocument();
  });
});
