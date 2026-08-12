export type PowerUpId = "boost-xp" | "protection" | "focus-total"

export interface PowerUp {
  id: PowerUpId
  name: string
  description: string
  icon: "Flame" | "Shield" | "Zap"
  color: string
  storePrice: number
}

export const POWER_UPS: PowerUp[] = [
  {
    id: "boost-xp",
    name: "Boost XP",
    description: "Dobra o XP ganho na próxima lição",
    icon: "Flame",
    color: "bg-orange-100 dark:bg-orange-950/40",
    storePrice: 50,
  },
  {
    id: "protection",
    name: "Proteção",
    description: "Protege uma vida em caso de erro",
    icon: "Shield",
    color: "bg-blue-100 dark:bg-blue-950/40",
    storePrice: 40,
  },
  {
    id: "focus-total",
    name: "Foca Total",
    description: "Aumenta a concentração na lição",
    icon: "Zap",
    color: "bg-yellow-100 dark:bg-yellow-950/40",
    storePrice: 10,
  },
]

export function getPowerUpById(id: string): PowerUp | undefined {
  return POWER_UPS.find((p) => p.id === id)
}
