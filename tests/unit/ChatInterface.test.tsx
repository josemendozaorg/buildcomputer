/**
 * Unit Tests for ChatInterface Component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatInterface from "../../src/components/ChatInterface";

describe("ChatInterface", () => {
  it("should render greeting message on mount", () => {
    render(<ChatInterface />);

    expect(
      screen.getByText(/Hi! I'm here to help you build the perfect PC/i),
    ).toBeInTheDocument();
  });

  it("should display AI's first question about use case", () => {
    render(<ChatInterface />);

    expect(
      screen.getByText(/What will you mainly use it for?/i),
    ).toBeInTheDocument();
  });

  it("should render quick-reply chips for use case options", () => {
    render(<ChatInterface />);

    expect(screen.getByRole("button", { name: /Gaming/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Work/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Content Creation/i }),
    ).toBeInTheDocument();
  });

  it("should have accessible chat container", () => {
    render(<ChatInterface />);

    const chatContainer = screen.getByRole("region", { name: /AI Chat/i });
    expect(chatContainer).toBeInTheDocument();
  });

  it("should display message history area", () => {
    render(<ChatInterface />);

    const messageArea = screen.getByTestId("message-history");
    expect(messageArea).toBeInTheDocument();
  });

  it("should have text input for user messages", () => {
    render(<ChatInterface />);

    const input = screen.getByPlaceholderText(/Type your message/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("should have send button", () => {
    render(<ChatInterface />);

    const sendButton = screen.getByRole("button", { name: /Send/i });
    expect(sendButton).toBeInTheDocument();
  });

  it("should call onMessage callback when user sends message", async () => {
    const onMessage = vi.fn();
    const user = userEvent.setup();
    render(<ChatInterface onMessage={onMessage} />);

    const input = screen.getByPlaceholderText(/Type your message/i);
    await user.type(input, "I want to build a gaming PC");

    const sendButton = screen.getByRole("button", { name: /Send/i });
    await user.click(sendButton);

    expect(onMessage).toHaveBeenCalledWith("I want to build a gaming PC");
  });

  it("should clear input after sending message", async () => {
    const user = userEvent.setup();
    render(<ChatInterface />);

    const input = screen.getByPlaceholderText(/Type your message/i);
    await user.type(input, "Test message");

    const sendButton = screen.getByRole("button", { name: /Send/i });
    await user.click(sendButton);

    expect(input.value).toBe("");
  });
});
