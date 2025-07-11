import preact from "@preact/preset-vite";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [preact(), UnoCSS()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    globals: true,
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary", "json"],
      exclude: [
        "node_modules/",
        "dist/",
        "public/",
        "src/test-setup.ts",
        "**/*.test.*",
        "**/*.spec.*",
        "**/*.d.ts",
        "vite.config.*",
        "vitest.config.*",
        "uno.config.*",
      ],
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
