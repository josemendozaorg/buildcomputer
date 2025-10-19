import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../src/App";

describe("App Integration", () => {
  it("should export a valid React component", () => {
    // Verify App is a function (React component)
    expect(typeof App).toBe("function");

    // Verify App renders successfully with all components
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(container).toBeTruthy();

    // Verify key elements are present
    expect(container.querySelector("header")).toBeTruthy();
    expect(container.querySelector("main")).toBeTruthy();
    expect(container.querySelector("footer")).toBeTruthy();
  });
});
