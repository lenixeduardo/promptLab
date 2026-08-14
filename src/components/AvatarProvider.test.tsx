import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor, act } from "@testing-library/react"
import { AvatarProvider, useAvatar } from "./AvatarProvider"
import { getUserProfile, updateUserAvatar } from "@/lib/db"
import { loadInventory } from "@/lib/inventory"

const mockUser = { id: "user-1", email: "test@test.com" }

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: mockUser }),
}))

vi.mock("@/lib/db", () => ({
  getUserProfile: vi.fn().mockResolvedValue({ data: null, error: null }),
  updateUserAvatar: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

vi.mock("@/lib/inventory", () => ({
  loadInventory: vi.fn().mockReturnValue({ powerUps: {}, ownedAvatarIds: ["cat-green"] }),
}))

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  vi.mocked(getUserProfile).mockResolvedValue({ data: null, error: null })
  vi.mocked(loadInventory).mockReturnValue({ powerUps: {}, ownedAvatarIds: ["cat-green"] })
})

describe("AvatarProvider — estado inicial", () => {
  it("começa com o avatar gratuito padrão (cat-green) quando não há cache local", () => {
    const { result } = renderHook(() => useAvatar(), { wrapper: AvatarProvider })
    expect(result.current.equippedId).toBe("cat-green")
    expect(result.current.equipped.name).toBe("Gato Verde")
  })

  it("hidrata a partir do avatar_url do Supabase quando disponível", async () => {
    vi.mocked(getUserProfile).mockResolvedValue({
      data: { avatar_url: "cat-vr" } as never,
      error: null,
    })
    vi.mocked(loadInventory).mockReturnValue({
      powerUps: {},
      ownedAvatarIds: ["cat-green", "cat-vr"],
    })

    const { result } = renderHook(() => useAvatar(), { wrapper: AvatarProvider })

    await waitFor(() => expect(result.current.equippedId).toBe("cat-vr"))
  })

  it("ignora avatar_url do servidor que não existe no catálogo real", async () => {
    vi.mocked(getUserProfile).mockResolvedValue({
      data: { avatar_url: "vr" } as never, // id do catálogo antigo/fake, não existe mais
      error: null,
    })

    const { result } = renderHook(() => useAvatar(), { wrapper: AvatarProvider })

    await waitFor(() => expect(getUserProfile).toHaveBeenCalled())
    expect(result.current.equippedId).toBe("cat-green")
  })
})

describe("AvatarProvider — setEquipped", () => {
  it("equipa um avatar já possuído e persiste no Supabase", async () => {
    vi.mocked(loadInventory).mockReturnValue({
      powerUps: {},
      ownedAvatarIds: ["cat-green", "cat-vr"],
    })
    const { result } = renderHook(() => useAvatar(), { wrapper: AvatarProvider })

    act(() => {
      result.current.setEquipped("cat-vr")
    })

    expect(result.current.equippedId).toBe("cat-vr")
    await waitFor(() => {
      expect(updateUserAvatar).toHaveBeenCalledWith("user-1", "cat-vr")
    })
  })

  it("não faz nada ao tentar equipar um avatar que o usuário não possui", () => {
    vi.mocked(loadInventory).mockReturnValue({ powerUps: {}, ownedAvatarIds: ["cat-green"] })
    const { result } = renderHook(() => useAvatar(), { wrapper: AvatarProvider })

    act(() => {
      result.current.setEquipped("cat-vr")
    })

    expect(result.current.equippedId).toBe("cat-green")
    expect(updateUserAvatar).not.toHaveBeenCalled()
  })
})
