import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useRetry } from "./useRetry"

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe("useRetry — estado inicial", () => {
  it("começa sem estar tentando novamente e com retryCount zero", () => {
    const { result } = renderHook(() => useRetry())
    expect(result.current.isRetrying).toBe(false)
    expect(result.current.retryCount).toBe(0)
    expect(result.current.canRetry).toBe(true)
  })
})

describe("useRetry — retry() com sucesso", () => {
  it("executa a função após o delay e zera o retryCount", async () => {
    const { result } = renderHook(() => useRetry({ delayMs: 1000 }))
    const fn = vi.fn().mockResolvedValue(undefined)

    let retryPromise: Promise<void>
    act(() => {
      retryPromise = result.current.retry(fn)
    })

    expect(result.current.isRetrying).toBe(true)
    expect(fn).not.toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
      await retryPromise
    })

    expect(fn).toHaveBeenCalledTimes(1)
    expect(result.current.retryCount).toBe(0)
    expect(result.current.isRetrying).toBe(false)
  })
})

describe("useRetry — retry() com falha", () => {
  it("incrementa retryCount e aplica backoff exponencial", async () => {
    const { result } = renderHook(() =>
      useRetry({ delayMs: 100, backoffMultiplier: 2, maxAttempts: 3 })
    )
    const fn = vi.fn().mockRejectedValue(new Error("falhou"))

    await act(async () => {
      const p = result.current.retry(fn)
      await vi.advanceTimersByTimeAsync(100)
      await p
    })
    expect(result.current.retryCount).toBe(1)
    expect(result.current.canRetry).toBe(true)

    // Segunda tentativa: delay dobra (100 * 2^1 = 200ms)
    await act(async () => {
      const p = result.current.retry(fn)
      await vi.advanceTimersByTimeAsync(200)
      await p
    })
    expect(result.current.retryCount).toBe(2)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it("para de permitir retry após atingir maxAttempts", async () => {
    const { result } = renderHook(() => useRetry({ delayMs: 10, maxAttempts: 1 }))
    const fn = vi.fn().mockRejectedValue(new Error("falhou"))

    await act(async () => {
      const p = result.current.retry(fn)
      await vi.advanceTimersByTimeAsync(10)
      await p
    })

    expect(result.current.retryCount).toBe(1)
    expect(result.current.canRetry).toBe(false)

    // Uma nova chamada a retry() não deve executar fn de novo (limite atingido)
    await act(async () => {
      await result.current.retry(fn)
    })
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe("useRetry — reset()", () => {
  it("zera retryCount e isRetrying", async () => {
    const { result } = renderHook(() => useRetry({ delayMs: 10 }))
    const fn = vi.fn().mockRejectedValue(new Error("falhou"))

    await act(async () => {
      const p = result.current.retry(fn)
      await vi.advanceTimersByTimeAsync(10)
      await p
    })
    expect(result.current.retryCount).toBe(1)

    act(() => {
      result.current.reset()
    })

    expect(result.current.retryCount).toBe(0)
    expect(result.current.isRetrying).toBe(false)
    expect(result.current.canRetry).toBe(true)
  })
})
