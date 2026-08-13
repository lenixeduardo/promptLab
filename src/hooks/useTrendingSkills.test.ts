import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useTrendingSkills } from "./useTrendingSkills"

vi.mock("@/lib/db", () => ({
  getTrendingSkills: vi.fn(),
}))

import * as dbModule from "@/lib/db"
const mockGetTrendingSkills = vi.mocked(dbModule.getTrendingSkills)

describe("useTrendingSkills", () => {
  beforeEach(() => {
    mockGetTrendingSkills.mockClear()
  })

  it("returns loading state initially", () => {
    mockGetTrendingSkills.mockResolvedValue({ data: [], error: null })

    const { result } = renderHook(() => useTrendingSkills())

    expect(result.current.loading).toBe(true)
  })

  it("sets loading to false when skills load", async () => {
    mockGetTrendingSkills.mockResolvedValue({ data: [], error: null })

    const { result } = renderHook(() => useTrendingSkills())

    await waitFor(() => expect(result.current.loading).toBe(false))
  })

  it("sets error state on API failure", async () => {
    mockGetTrendingSkills.mockResolvedValue({ data: null, error: "API Error" })

    const { result } = renderHook(() => useTrendingSkills())

    await waitFor(() => expect(result.current.error).toBe("API Error"))
  })

  it("handles promise rejection", async () => {
    mockGetTrendingSkills.mockRejectedValue(new Error("Network failed"))

    const { result } = renderHook(() => useTrendingSkills())

    await waitFor(() => expect(result.current.error).toBe("Network failed"))
    expect(result.current.loading).toBe(false)
  })

  it("filters by category when provided", () => {
    mockGetTrendingSkills.mockResolvedValue({ data: [], error: null })

    renderHook(() => useTrendingSkills("Python"))

    expect(mockGetTrendingSkills).toHaveBeenCalledWith("Python")
  })

  it("updates when category changes", async () => {
    mockGetTrendingSkills.mockResolvedValue({ data: [], error: null })

    const { result, rerender } = renderHook(({ category }) => useTrendingSkills(category), {
      initialProps: { category: undefined },
    })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(mockGetTrendingSkills).toHaveBeenCalledWith(undefined)

    rerender({ category: "Python" })

    expect(mockGetTrendingSkills).toHaveBeenCalledWith("Python")
  })
})
