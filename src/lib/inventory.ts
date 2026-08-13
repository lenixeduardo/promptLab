import type { PowerUpId } from "@/data/powerUpsData"

export interface StoredInventory {
  powerUps: Record<PowerUpId, number>
  ownedAvatarIds: string[]
}

const DEFAULT_INVENTORY: StoredInventory = {
  powerUps: { "boost-xp": 0, protection: 0, "focus-total": 0 },
  ownedAvatarIds: ["cat-green"],
}

function storageKey(userId: string) {
  return `pl:inventory:${userId}`
}

export function loadInventory(userId: string): StoredInventory {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return structuredClone(DEFAULT_INVENTORY)
    const parsed = JSON.parse(raw) as Partial<StoredInventory>
    return {
      powerUps: { ...DEFAULT_INVENTORY.powerUps, ...(parsed.powerUps ?? {}) },
      ownedAvatarIds: parsed.ownedAvatarIds ?? [...DEFAULT_INVENTORY.ownedAvatarIds],
    }
  } catch {
    return structuredClone(DEFAULT_INVENTORY)
  }
}

export function saveInventory(userId: string, inv: StoredInventory): void {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(inv))
  } catch {
    // ignore write errors
  }
}

export function addPowerUp(userId: string, id: PowerUpId, qty = 1): StoredInventory {
  const inv = loadInventory(userId)
  inv.powerUps[id] = (inv.powerUps[id] ?? 0) + qty
  saveInventory(userId, inv)
  return inv
}

export function addAvatar(userId: string, avatarId: string): StoredInventory {
  const inv = loadInventory(userId)
  if (!inv.ownedAvatarIds.includes(avatarId)) {
    inv.ownedAvatarIds.push(avatarId)
    saveInventory(userId, inv)
  }
  return inv
}
