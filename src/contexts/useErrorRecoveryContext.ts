import { useContext } from "react"
import { ErrorRecoveryContext } from "./ErrorRecoveryState"

/**
 * Access the app-wide error-recovery state (used to surface real network/API
 * failures in the global ErrorRecoveryPanel, not just the "offline" banner).
 * Safe to call outside <ErrorRecoveryProvider> (e.g. in hooks used by tests
 * that don't mount the full app tree) — returns undefined instead of
 * throwing, and callers should no-op when that happens.
 */
export function useErrorRecoveryContext() {
  return useContext(ErrorRecoveryContext)
}
