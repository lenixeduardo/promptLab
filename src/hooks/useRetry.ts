import { useState, useCallback, useRef } from "react"

export interface RetryOptions {
  maxAttempts?: number
  delayMs?: number
  backoffMultiplier?: number
}

export function useRetry(options: RetryOptions = {}) {
  const { maxAttempts = 3, delayMs = 1000, backoffMultiplier = 2 } = options

  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const retry = useCallback(
    async (fn: () => Promise<void>) => {
      if (retryCount >= maxAttempts) return

      setIsRetrying(true)
      const nextAttempt = retryCount + 1
      const delay = delayMs * Math.pow(backoffMultiplier, retryCount)

      try {
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, delay)
        })

        await fn()
        setRetryCount(0)
        setIsRetrying(false)
      } catch (error) {
        setRetryCount(nextAttempt)
        setIsRetrying(false)
        if (nextAttempt < maxAttempts) {
          // Will retry next time retry is called
        }
      }
    },
    [retryCount, maxAttempts, delayMs, backoffMultiplier]
  )

  const reset = useCallback(() => {
    setRetryCount(0)
    setIsRetrying(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const canRetry = retryCount < maxAttempts

  return {
    retry,
    reset,
    isRetrying,
    retryCount,
    canRetry,
  }
}
