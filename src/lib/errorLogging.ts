import * as Sentry from "@sentry/react"
import { getErrorMessage } from "./supabase"

export interface AuditEvent {
  eventType: "login" | "logout" | "error" | "rate_limit" | "api_call" | "settings_change"
  userId?: string
  message: string
  severity: "info" | "warning" | "error"
  metadata?: Record<string, unknown>
  timestamp: string
}

class ErrorLogger {
  private events: AuditEvent[] = []
  private maxEvents = 100

  log(event: Omit<AuditEvent, "timestamp">) {
    const auditEvent: AuditEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    }

    this.events.push(auditEvent)

    // Keep only recent events in memory
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      const logFn = event.severity === "error" ? console.error : event.severity === "warning" ? console.warn : console.log
      logFn(`[${event.eventType.toUpperCase()}]`, event.message, event.metadata)
    }

    // Send to backend if configured (Sentry integration)
    this.sendToBackend(auditEvent)
  }

  logError(error: unknown, context: string, userId?: string) {
    const message = getErrorMessage(error, `Unknown error in ${context}`)

    this.log({
      eventType: "error",
      userId,
      message,
      severity: "error",
      metadata: {
        context,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
      },
    })
  }

  logApiError(endpoint: string, statusCode: number, error: unknown, userId?: string) {
    const message = getErrorMessage(error, `API error from ${endpoint}`)

    this.log({
      eventType: "api_call",
      userId,
      message,
      severity: statusCode >= 500 ? "error" : "warning",
      metadata: {
        endpoint,
        statusCode,
      },
    })
  }

  logRateLimit(endpoint: string, retryAfter?: number, userId?: string) {
    this.log({
      eventType: "rate_limit",
      userId,
      message: `Rate limit exceeded on ${endpoint}`,
      severity: "warning",
      metadata: {
        endpoint,
        retryAfter,
      },
    })
  }

  logAuthEvent(eventType: "login" | "logout", userId: string, success: boolean) {
    this.log({
      eventType,
      userId,
      message: `User ${eventType} ${success ? "successful" : "failed"}`,
      severity: success ? "info" : "warning",
      metadata: { success },
    })
  }

  logSettingsChange(userId: string, setting: string, oldValue: unknown, newValue: unknown) {
    this.log({
      eventType: "settings_change",
      userId,
      message: `Setting changed: ${setting}`,
      severity: "info",
      metadata: {
        setting,
        oldValue,
        newValue,
      },
    })
  }

  getEvents() {
    return [...this.events]
  }

  getEventsSince(timestamp: string) {
    const cutoff = new Date(timestamp).getTime()
    return this.events.filter(e => new Date(e.timestamp).getTime() >= cutoff)
  }

  clearEvents() {
    this.events = []
  }

  private sendToBackend(event: AuditEvent) {
    if (event.severity === "error" || event.severity === "warning") {
      Sentry.addBreadcrumb({
        category: event.eventType,
        message: event.message,
        level: event.severity === "error" ? "error" : "warning",
        data: event.metadata,
      })
    }
    if (event.severity === "error") {
      Sentry.captureMessage(event.message, "error")
    }
  }
}

export const errorLogger = new ErrorLogger()
