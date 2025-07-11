import { fireEvent, render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText("Risk Dice Battle")).toBeInTheDocument();
  });

  it("shows development environment ready message", () => {
    render(<App />);
    expect(screen.getByText("Development Environment Ready")).toBeInTheDocument();
  });

  it("has a working counter", () => {
    render(<App />);

    const incrementButton = screen.getByText("Increment");
    const decrementButton = screen.getByText("Decrement");
    const resetButton = screen.getByText("Reset");

    expect(screen.getByText("Count: 0")).toBeInTheDocument();

    fireEvent.click(incrementButton);
    expect(screen.getByText("Count: 1")).toBeInTheDocument();

    fireEvent.click(incrementButton);
    expect(screen.getByText("Count: 2")).toBeInTheDocument();

    fireEvent.click(decrementButton);
    expect(screen.getByText("Count: 1")).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });

  it("displays technology stack information", () => {
    render(<App />);

    expect(screen.getByText(/✅ Preact/)).toBeInTheDocument();
    expect(screen.getByText(/✅ TypeScript/)).toBeInTheDocument();
    expect(screen.getByText(/✅ UnoCSS/)).toBeInTheDocument();
    expect(screen.getByText(/✅ Vitest for testing/)).toBeInTheDocument();
    expect(screen.getByText(/✅ Vite with optimized build/)).toBeInTheDocument();
  });

  it("shows next steps section", () => {
    render(<App />);

    expect(screen.getByText("Next Steps")).toBeInTheDocument();
    expect(screen.getByText(/Phase 2 - Component Migration/)).toBeInTheDocument();
    expect(screen.getByText("Start Migration")).toBeInTheDocument();
  });
});
