import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock localStorage
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Define proper types for the global mocks
interface MockIntersectionObserver {
  new (
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ): IntersectionObserver;
}

interface MockResizeObserver {
  new (callback: ResizeObserverCallback): ResizeObserver;
}

// Extend the global type definitions
declare global {
  interface Window {
    IntersectionObserver: MockIntersectionObserver;
    ResizeObserver: MockResizeObserver;
  }
}

// Mock IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
  disconnect() {
    // Mock implementation
  }
  observe() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
} as unknown as MockIntersectionObserver;

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  disconnect() {
    // Mock implementation
  }
  observe() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
} as unknown as MockResizeObserver;

// Mock env for safe area insets
Object.defineProperty(window, "env", {
  value: {
    "safe-area-inset-top": "0px",
    "safe-area-inset-bottom": "0px",
    "safe-area-inset-left": "0px",
    "safe-area-inset-right": "0px",
  },
  writable: true,
});

// Mock CSS env() function
const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = function (element, pseudoElement) {
  const style = originalGetComputedStyle.call(this, element, pseudoElement);
  const originalGetPropertyValue = style.getPropertyValue;

  style.getPropertyValue = function (property) {
    if (property.startsWith("env(")) {
      return "0px";
    }
    return originalGetPropertyValue.call(this, property);
  };

  return style;
};
