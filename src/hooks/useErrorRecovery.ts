import { useState, useCallback, useRef, useEffect } from "react"

interface RecoveryAction {
  label: string
  action: () => Promise<void>
  icon?: string
}

interface ErrorState {
  message: string
  code?: string
  timestamp: number
  recoveryActions: RecoveryAction[]
  isRetrying: boolean
}

export function useErrorRecovery() {
  const [errors, setErrors] = useState<ErrorState[]>([])
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const addError = useCallback(
    (message: string, code?: string, recoveryActions: RecoveryAction[] = []) => {
      const error: ErrorState = {
        message,
        code,
        timestamp: Date.now(),
        recoveryActions,
        isRetrying: false,
      }

      setErrors((prev) => [error, ...prev.slice(0, 4)])

      // Auto-clear non-critical errors after 8 seconds
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)
      errorTimeoutRef.current = setTimeout(() => {
        if (code && !["NETWORK_ERROR", "AUTH_ERROR"].includes(code)) {
          setErrors((prev) => prev.filter((e) => e.timestamp !== error.timestamp))
        }
      }, 8000)
    },
    []
  )

  const removeError = useCallback((timestamp: number) => {
    setErrors((prev) => prev.filter((e) => e.timestamp !== timestamp))
  }, [])

  const executeRecovery = useCallback(
    async (errorIndex: number, actionIndex: number) => {
      setErrors((prev) => {
        const updated = [...prev]
        if (updated[errorIndex] && updated[errorIndex].recoveryActions[actionIndex]) {
          updated[errorIndex].isRetrying = true
        }
        return updated
      })

      try {
        const error = errors[errorIndex]
        if (error && error.recoveryActions[actionIndex]) {
          await error.recoveryActions[actionIndex].action()
          removeError(error.timestamp)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Recovery action failed"
        addError(message, "RECOVERY_FAILED")
      } finally {
        setErrors((prev) => {
          const updated = [...prev]
          if (updated[errorIndex]) {
            updated[errorIndex].isRetrying = false
          }
          return updated
        })
      }
    },
    [errors, addError, removeError]
  )

  const clearErrors = useCallback(() => {
    setErrors([])
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)
  }, [])

  const getLastError = useCallback((): ErrorState | null => {
    return errors.length > 0 ? errors[0] : null
  }, [errors])

  const hasNetworkError = useCallback((): boolean => {
    return errors.some((e) => e.code === "NETWORK_ERROR")
  }, [errors])

  return {
    errors,
    isOnline,
    addError,
    removeError,
    executeRecovery,
    clearErrors,
    getLastError,
    hasNetworkError,
    errorCount: errors.length,
  }
}
