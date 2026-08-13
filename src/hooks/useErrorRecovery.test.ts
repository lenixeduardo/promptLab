import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useErrorRecovery } from "./useErrorRecovery"

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe("useErrorRecovery — estado inicial", () => {
  it("começa sem erros e refletindo navigator.onLine", () => {
    const { result } = renderHook(() => useErrorRecovery())
    expect(result.current.errors).toEqual([])
    expect(result.current.isOnline).toBe(navigator.onLine)
    expect(result.current.errorCount).toBe(0)
  })
})

describe("useErrorRecovery — addError / removeError", () => {
  it("adiciona um erro com timestamp e o remove pelo timestamp", () => {
    const { result } = renderHook(() => useErrorRecovery())

    act(() => {
      result.current.addError("Falha ao carregar dados", "NETWORK_ERROR")
    })

    expect(result.current.errorCount).toBe(1)
    expect(result.current.errors[0].message).toBe("Falha ao carregar dados")
    expect(result.current.hasNetworkError()).toBe(true)

    const ts = result.current.errors[0].timestamp
    act(() => {
      result.current.removeError(ts)
    })
    expect(result.current.errorCount).toBe(0)
  })

  it("mantém no máximo os 5 erros mais recentes", () => {
    const { result } = renderHook(() => useErrorRecovery())

    act(() => {
      for (let i = 0; i < 7; i++) {
        result.current.addError(`erro ${i}`)
      }
    })

    expect(result.current.errors.length).toBe(5)
    expect(result.current.errors[0].message).toBe("erro 6")
  })

  it("limpa erros não-críticos automaticamente após 8s, mas mantém NETWORK_ERROR/AUTH_ERROR", () => {
    const { result } = renderHook(() => useErrorRecovery())

    act(() => {
      result.current.addError("erro genérico", "OTHER")
    })
    expect(result.current.errorCount).toBe(1)

    act(() => {
      vi.advanceTimersByTime(8000)
    })
    expect(result.current.errorCount).toBe(0)
  })
})

describe("useErrorRecovery — executeRecovery", () => {
  it("executa a ação de recuperação e remove o erro em caso de sucesso", async () => {
    const { result } = renderHook(() => useErrorRecovery())
    const action = vi.fn().mockResolvedValue(undefined)

    act(() => {
      result.current.addError("Falha de rede", "NETWORK_ERROR", [
        { label: "Tentar novamente", action },
      ])
    })

    await act(async () => {
      await result.current.executeRecovery(0, 0)
    })

    expect(action).toHaveBeenCalledTimes(1)
    expect(result.current.errorCount).toBe(0)
  })

  it("mantém o erro e chama addError('RECOVERY_FAILED') se a ação falhar", async () => {
    const { result } = renderHook(() => useErrorRecovery())
    const action = vi.fn().mockRejectedValue(new Error("ainda offline"))

    act(() => {
      result.current.addError("Falha de rede", "NETWORK_ERROR", [
        { label: "Tentar novamente", action },
      ])
    })

    await act(async () => {
      await result.current.executeRecovery(0, 0)
    })

    // O erro original permanece + um novo erro RECOVERY_FAILED foi adicionado
    expect(result.current.errors.some((e) => e.code === "RECOVERY_FAILED")).toBe(true)
  })
})

describe("useErrorRecovery — clearErrors / getLastError", () => {
  it("clearErrors remove todos os erros", () => {
    const { result } = renderHook(() => useErrorRecovery())
    act(() => {
      result.current.addError("erro 1")
      result.current.addError("erro 2")
    })
    expect(result.current.errorCount).toBe(2)

    act(() => {
      result.current.clearErrors()
    })
    expect(result.current.errorCount).toBe(0)
  })

  it("getLastError retorna o erro mais recente ou null", () => {
    const { result } = renderHook(() => useErrorRecovery())
    expect(result.current.getLastError()).toBeNull()

    act(() => {
      result.current.addError("primeiro")
      result.current.addError("segundo")
    })

    expect(result.current.getLastError()?.message).toBe("segundo")
  })
})
