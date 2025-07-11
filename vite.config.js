import preact from "@preact/preset-vite";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: process.env.BASE_URL || "/",
  publicDir: "public",
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Code splitting optimization
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    // Bundle size optimization
    chunkSizeWarningLimit: 500,
  },
  plugins: [
    preact(),
    UnoCSS(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon-192.png", "icons/icon-512.png", "icons/icon-180.png"],
      manifest: {
        name: "Risk Dice Battle",
        short_name: "Risk Dice",
        description: "Mobile-optimized Risk dice battle game",
        theme_color: "#4a5d3a",
        background_color: "#4a5d3a",
        display: "standalone",
        orientation: "portrait",
        start_url: "./",
        icons: [
          {
            src: "./icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "./icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "./icons/icon-180.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        // Workbox configuration for advanced caching
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
        // Service worker options
        skipWaiting: true,
        clientsClaim: true,
        // Clean up old caches
        cleanupOutdatedCaches: true,
        // Precache strategy
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
