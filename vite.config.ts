import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"
import { sentryVitePlugin } from "@sentry/vite-plugin"
import sourceIdentifierPlugin from 'vite-plugin-source-identifier'

const isProd = process.env.BUILD_MODE === 'prod'
const isTest = process.env.VITEST === "true" || process.env.NODE_ENV === "test"

// Guard: VITE_PREVIEW_MODE must never be enabled in a production build.
if (isProd && process.env.VITE_PREVIEW_MODE === 'true') {
  throw new Error(
    '[security] VITE_PREVIEW_MODE=true is not allowed in production builds. ' +
    'Unset this variable before running a prod build.'
  )
}

export default defineConfig({
  plugins: [
    react(),
    sourceIdentifierPlugin({
      enabled: !isProd && !isTest,
      attributePrefix: 'data-matrix',
      includeProps: true,
    }),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: "hidden",
    // Target modern browsers for smaller output (ES2020 avoids many polyfills)
    target: "es2020",
    // Split CSS into per-chunk files so only the styles for the current page load
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Put heavy data files in their own async chunk so the main bundle stays small
        manualChunks: (id: string) => {
          // Vendor: React core — always needed, load first
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/react-router-dom/")) {
            return "vendor-react"
          }
          // Heavy lesson content — only loaded when user opens a lesson
          if (id.includes("/src/data/lessonsData")) {
            return "data-lessons"
          }
          // Trending/prompts data — only loaded on lab/prompts pages
          if (id.includes("/src/data/trendingSkillsData") || id.includes("/src/data/promptsData") || id.includes("/src/data/templatesData")) {
            return "data-content"
          }
          // Radix UI components
          if (id.includes("node_modules/@radix-ui/")) {
            return "vendor-ui"
          }
          // Supabase
          if (id.includes("node_modules/@supabase/")) {
            return "vendor-supabase"
          }
          // Analytics (PostHog) — non-critical, can load async
          if (id.includes("node_modules/posthog-js")) {
            return "vendor-analytics"
          }
          // Heavy PDF/canvas utilities — only used on certificate page
          if (id.includes("node_modules/jspdf") || id.includes("node_modules/html2canvas")) {
            return "vendor-pdf"
          }
          // Charts — only used on analytics/profile pages
          if (id.includes("node_modules/recharts")) {
            return "vendor-charts"
          }
          // Sentry — error monitoring, not on critical path
          if (id.includes("node_modules/@sentry/")) {
            return "vendor-sentry"
          }
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["e2e/**", "node_modules/**"],
    testTimeout: 15000,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/hooks/**", "src/components/**", "src/pages/**", "src/contexts/**"],
    },
  },
})
