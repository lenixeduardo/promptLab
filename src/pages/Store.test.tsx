import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import Store from "./Store"
import { sileo } from "sileo"
import { updateUserGems, syncInventoryToServer } from "@/lib/db"
import { loadInventory, saveInventory, addAvatar } from "@/lib/inventory"
import { getLocalGems, saveLocalGems } from "@/lib/xp"

const mockSetEquipped = vi.fn()

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-1" } }),
}))

vi.mock("@/components/AvatarProvider", () => ({
  useAvatar: () => ({ setEquipped: mockSetEquipped }),
}))

vi.mock("@/lib/inventory", () => ({
  loadInventory: vi.fn(),
  saveInventory: vi.fn(),
  addAvatar: vi.fn(),
  addPowerUp: vi.fn(),
}))

vi.mock("@/lib/xp", () => ({
  getLocalGems: vi.fn(),
  saveLocalGems: vi.fn(),
}))

vi.mock("@/lib/db", () => ({
  updateUserGems: vi.fn(),
  syncInventoryToServer: vi.fn(),
  fetchInventoryFromServer: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

vi.mock("sileo", () => ({
  sileo: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))

const baseInventory = {
  powerUps: { "boost-xp": 0, protection: 0, "focus-total": 0 },
  ownedAvatarIds: ["cat-green"],
}

function renderStore() {
  return render(
    <MemoryRouter>
      <Store />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getLocalGems).mockReturnValue(100)
  vi.mocked(loadInventory).mockReturnValue(structuredClone(baseInventory))
})

describe("Store — compra de avatar", () => {
  it("confirma a compra e chama updateUserGems/syncInventoryToServer quando ambos têm sucesso", async () => {
    vi.mocked(addAvatar).mockReturnValue({
      ...structuredClone(baseInventory),
      ownedAvatarIds: ["cat-green", "cat-happy"],
    })
    vi.mocked(updateUserGems).mockResolvedValue({ data: null, error: null })
    vi.mocked(syncInventoryToServer).mockResolvedValue({ data: null, error: null })

    renderStore()
    await userEvent.click(screen.getByText("Gato Feliz"))

    await waitFor(() => {
      expect(sileo.success).toHaveBeenCalledWith(
        expect.objectContaining({ title: expect.stringContaining("desbloqueado") })
      )
    })
    expect(updateUserGems).toHaveBeenCalledWith("user-1", 50)
    expect(saveLocalGems).not.toHaveBeenCalledWith("user-1", 100)
  })

  it("reverte gemas e inventário quando o servidor rejeita a compra, sem mostrar sucesso falso", async () => {
    vi.mocked(addAvatar).mockReturnValue({
      ...structuredClone(baseInventory),
      ownedAvatarIds: ["cat-green", "cat-happy"],
    })
    vi.mocked(updateUserGems).mockResolvedValue({ data: null, error: "Erro no servidor" })
    vi.mocked(syncInventoryToServer).mockResolvedValue({ data: null, error: null })

    renderStore()
    await userEvent.click(screen.getByText("Gato Feliz"))

    await waitFor(() => {
      expect(sileo.error).toHaveBeenCalledWith(
        expect.objectContaining({ title: expect.stringContaining("Erro ao salvar") })
      )
    })
    expect(sileo.success).not.toHaveBeenCalled()
    // Rolled back to the pre-purchase gem balance and inventory.
    expect(saveLocalGems).toHaveBeenCalledWith("user-1", 100)
    expect(saveInventory).toHaveBeenCalledWith("user-1", baseInventory)
  })

  it("reverte quando a sincronização do inventário falha mesmo com as gemas salvas", async () => {
    vi.mocked(addAvatar).mockReturnValue({
      ...structuredClone(baseInventory),
      ownedAvatarIds: ["cat-green", "cat-happy"],
    })
    vi.mocked(updateUserGems).mockResolvedValue({ data: null, error: null })
    vi.mocked(syncInventoryToServer).mockResolvedValue({ data: null, error: "Falha de rede" })

    renderStore()
    await userEvent.click(screen.getByText("Gato Feliz"))

    await waitFor(() => {
      expect(saveLocalGems).toHaveBeenCalledWith("user-1", 100)
    })
    expect(sileo.success).not.toHaveBeenCalled()
  })

  it("não permite comprar sem gemas suficientes e não chama o servidor", async () => {
    vi.mocked(getLocalGems).mockReturnValue(10)

    renderStore()
    await userEvent.click(screen.getByText("Gato Feliz"))

    await waitFor(() => {
      expect(sileo.error).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Gemas insuficientes" })
      )
    })
    expect(updateUserGems).not.toHaveBeenCalled()
    expect(addAvatar).not.toHaveBeenCalled()
  })
})
