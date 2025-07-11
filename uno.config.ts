import { defineConfig, presetAttributify, presetTypography, presetUno } from "unocss";

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetTypography()],
  theme: {
    colors: {
      // Military green theme colors
      primary: "#4a5d3a",
      "primary-light": "#6b8c5a",
      "primary-dark": "#2a3522",
      "primary-alpha": "#4a5d3a88",

      // Player colors
      player: {
        red: "#dc2626",
        blue: "#2563eb",
        green: "#16a34a",
        yellow: "#eab308",
        black: "#1f2937",
        purple: "#9333ea",
      },

      // UI colors
      background: "#f8fafc",
      surface: "#ffffff",
      "surface-alpha": "#ffffff88",
      text: "#1f2937",
      "text-light": "#6b7280",

      // Status colors
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      mono: ["Fira Code", "monospace"],
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
    borderRadius: {
      none: "0",
      sm: "0.125rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      "2xl": "1rem",
      full: "9999px",
    },
    spacing: {
      px: "1px",
      "0": "0",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "8": "2rem",
      "10": "2.5rem",
      "12": "3rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "32": "8rem",
      "40": "10rem",
      "48": "12rem",
      "56": "14rem",
      "64": "16rem",
    },
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    animation: {
      spin: "spin 1s linear infinite",
      ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
      pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      bounce: "bounce 1s infinite",
      "fade-in": "fade-in 0.5s ease-in-out",
      "slide-in": "slide-in 0.3s ease-out",
      roll: "roll 0.5s ease-out",
      glow: "glow 1.5s ease-in-out",
    },
    keyframes: {
      "fade-in": {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
      "slide-in": {
        "0%": { transform: "translateY(-10px)", opacity: "0" },
        "100%": { transform: "translateY(0)", opacity: "1" },
      },
      roll: {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" },
      },
      glow: {
        "0%, 100%": { boxShadow: "0 0 10px rgba(74, 93, 58, 0.3)" },
        "50%": { boxShadow: "0 0 20px rgba(74, 93, 58, 0.6)" },
      },
    },
  },
  shortcuts: {
    // Button shortcuts
    "btn-base":
      "px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer border-none outline-none",
    "btn-primary": "btn-base bg-primary text-white hover:bg-primary-dark active:scale-95",
    "btn-secondary":
      "btn-base bg-surface border border-gray-300 text-text hover:bg-gray-50 active:scale-95",
    "btn-danger": "btn-base bg-error text-white hover:bg-red-700 active:scale-95",
    "btn-success": "btn-base bg-success text-white hover:bg-green-700 active:scale-95",

    // Card shortcuts
    "card-base": "bg-surface rounded-xl shadow-lg border border-gray-200 p-6",
    "card-hover": "card-base hover:shadow-xl transition-shadow duration-200",

    // Layout shortcuts
    "flex-center": "flex items-center justify-center",
    "flex-between": "flex items-center justify-between",
    "flex-col-center": "flex flex-col items-center justify-center",

    // Screen shortcuts
    "screen-container": "min-h-screen bg-background p-4 flex flex-col",
    "screen-content": "w-full max-w-md mx-auto flex-1 flex flex-col",

    // Input shortcuts
    "input-base":
      "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors",

    // Text shortcuts
    "text-heading": "text-2xl font-bold text-text",
    "text-subheading": "text-lg font-semibold text-text",
    "text-body": "text-base text-text",
    "text-caption": "text-sm text-text-light",
  },
  rules: [
    // Custom rules for special cases
    ["glow-primary", { "box-shadow": "0 0 20px rgba(74, 93, 58, 0.4)" }],
    ["glow-success", { "box-shadow": "0 0 20px rgba(16, 185, 129, 0.4)" }],
    ["glow-error", { "box-shadow": "0 0 20px rgba(239, 68, 68, 0.4)" }],
    ["glow-warning", { "box-shadow": "0 0 20px rgba(245, 158, 11, 0.4)" }],

    // Safe area padding for mobile devices
    ["safe-area-top", { "padding-top": "env(safe-area-inset-top)" }],
    ["safe-area-bottom", { "padding-bottom": "env(safe-area-inset-bottom)" }],
    ["safe-area-left", { "padding-left": "env(safe-area-inset-left)" }],
    ["safe-area-right", { "padding-right": "env(safe-area-inset-right)" }],

    // Viewport height helpers
    [
      "h-screen-safe",
      { height: "calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))" },
    ],
    [
      "min-h-screen-safe",
      { "min-height": "calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))" },
    ],
  ],
  transformers: [],
});
