// ═══════════════════════════════════════════════════════════════════════════
// Sentry — Error Monitoring & Performance
// Import this as the FIRST import in main.tsx to catch all errors.
// ═══════════════════════════════════════════════════════════════════════════

import * as Sentry from "@sentry/react"

const dsn = import.meta.env.VITE_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.PROD ? "production" : "development",
    integrations: [Sentry.browserTracingIntegration()],
    // Performance monitoring — sample rate in production
    tracesSampleRate: import.meta.env.PROD ? 0.25 : 1.0,
    // Session replay — only in production to save quota
    replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 0,
    replaysOnErrorSampleRate: 1.0,
  })
}
