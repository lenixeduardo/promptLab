import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { usePrompts } from "./usePrompts"

vi.mock("@/lib/db", () => ({
  getPrompts: vi.fn(),
}))

import * as dbModule from "@/lib/db"
const mockGetPrompts = vi.mocked(dbModule.getPrompts)

describe("usePrompts", () => {
  beforeEach(() => {
    mockGetPrompts.mockClear()
  })

  it("returns default fallback prompts initially", () => {
    mockGetPrompts.mockResolvedValue({ data: [], error: null })

    const { result } = renderHook(() => usePrompts())

    expect(result.current.loading).toBe(true)
    expect(Array.isArray(result.current.prompts)).toBe(true)
  })

  it("sets loading to false when prompts load", async () => {
    mockGetPrompts.mockResolvedValue({
      data: [
        {
          title: "Test",
          difficulty: "Iniciante",
          color: "blue",
          category: "test",
          prompt_text: "test",
          description: "test",
        },
      ],
      error: null,
    })

    const { result } = renderHook(() => usePrompts())

    await waitFor(() => expect(result.current.loading).toBe(false))
  })

  it("sets error state when getPrompts fails", async () => {
    mockGetPrompts.mockResolvedValue({ data: null, error: "Network error" })

    const { result } = renderHook(() => usePrompts())

    await waitFor(() => expect(result.current.error).toBe("Network error"))
  })

  it("handles promise rejection with catch", async () => {
    mockGetPrompts.mockRejectedValue(new Error("API Error"))

    const { result } = renderHook(() => usePrompts())

    await waitFor(() => expect(result.current.error).toBe("API Error"))
    expect(result.current.loading).toBe(false)
  })

  it("filters by category when provided", async () => {
    mockGetPrompts.mockResolvedValue({ data: [], error: null })

    const { result } = renderHook(() => usePrompts("Criatividade"))

    expect(mockGetPrompts).toHaveBeenCalledWith("Criatividade", undefined)
  })
})
