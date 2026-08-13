import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, Gem, Lock } from "lucide-react"
import { useAvatar } from "@/components/AvatarProvider"
import { useAuth } from "@/hooks/useAuth"
import { loadInventory } from "@/lib/inventory"
import { getLocalGems } from "@/lib/xp"
import { AppBottomNav } from "@/components/AppBottomNav"
import { cn } from "@/lib/utils"
import { sileo } from "sileo"
import type { Avatar } from "@/data/avatarsData"

type FilterValue = "Todos" | Avatar["rarity"]

const FILTER_TABS: { label: string; value: FilterValue }[] = [
  { label: "Todos", value: "Todos" },
  { label: "Comum", value: "common" },
  { label: "Raro", value: "rare" },
  { label: "Épico", value: "epic" },
  { label: "Lendário", value: "legendary" },
]

const RARITY_BADGE: Record<Avatar["rarity"], { label: string; className: string }> = {
  common: { label: "COMUM", className: "bg-gray-800 text-white" },
  rare: { label: "RARO", className: "bg-amber-500 text-white" },
  epic: { label: "ÉPICO", className: "bg-purple-600 text-white" },
  legendary: { label: "LENDÁRIO", className: "bg-yellow-500 text-white" },
}

export default function AvatarScreen() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { equippedId, equipped, setEquipped, options } = useAvatar()
  const [filter, setFilter] = useState<FilterValue>("Todos")
  const [ownedIds, setOwnedIds] = useState<string[]>(["cat-green"])
  const [gems, setGems] = useState(0)

  useEffect(() => {
    if (!user?.id) return
    setOwnedIds(loadInventory(user.id).ownedAvatarIds)
    setGems(getLocalGems(user.id))
  }, [user?.id])

  const filtered = filter === "Todos" ? options : options.filter((a) => a.rarity === filter)

  const handleSelect = (avatar: Avatar) => {
    const owned = ownedIds.includes(avatar.id)
    if (!owned) {
      sileo.info({
        title: "Você ainda não tem esse avatar",
        description: "Desbloqueie na loja com gemas.",
      })
      navigate("/store")
      return
    }
    setEquipped(avatar.id)
    sileo.success({
      title: "Avatar equipado!",
      description: `Você agora está usando ${avatar.name}`,
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-white pb-28 lg:pb-8">
      {/* Header */}
      <div className="px-4 pt-6">
        <div className="mb-2 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-soft text-foregroundSecondary"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5 rounded-full bg-surface-soft px-3 py-1.5">
            <Gem className="h-4 w-4 fill-sky-400 text-sky-400" />
            <span className="text-sm font-bold text-foregroundDark">{gems}</span>
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-foregroundDark">Meus Avatares</h1>
        <p className="mb-5 mt-0.5 text-sm text-foregroundSecondary">
          Toque para equipar um avatar que você já desbloqueou
        </p>
      </div>

      {/* Featured: currently equipped avatar */}
      <div className="mx-4 mb-5 overflow-hidden rounded-3xl bg-emerald p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white/30 bg-white/20">
            <img src={equipped.image} alt={equipped.name} className="h-full w-full object-cover" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-white">{equipped.name}</h2>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {FILTER_TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              filter === value
                ? "bg-emerald text-white"
                : "bg-surface-soft text-foregroundSecondary"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Avatar grid — 2 columns */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {filtered.map((avatar) => {
          const isEquipped = equippedId === avatar.id
          const owned = ownedIds.includes(avatar.id)
          const badge = RARITY_BADGE[avatar.rarity]
          const locked = !owned

          return (
            <button
              key={avatar.id}
              onClick={() => handleSelect(avatar)}
              className={cn(
                "relative overflow-hidden rounded-2xl bg-[#E8F5E9] p-3 text-left transition-all active:scale-95",
                isEquipped ? "ring-2 ring-emerald ring-offset-1" : ""
              )}
            >
              {/* Rarity badge — top left */}
              <span
                className={cn(
                  "absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide",
                  badge.className
                )}
              >
                {badge.label}
              </span>

              {/* Lock icon — top right */}
              {locked && (
                <div className="absolute right-2.5 top-2.5 rounded-full bg-black/20 p-1">
                  <Lock className="h-3 w-3 text-white" />
                </div>
              )}

              {isEquipped && (
                <span className="absolute right-2.5 top-2.5 rounded-full bg-primary-dark px-2 py-0.5 text-[9px] font-bold text-white">
                  Ativo
                </span>
              )}

              {/* Avatar image */}
              <div className="mt-7 flex justify-center">
                <img
                  src={avatar.image}
                  alt={avatar.name}
                  className={cn("h-28 w-28 object-contain", locked && "opacity-60")}
                />
              </div>

              {/* Info */}
              <div className="mt-2 space-y-0.5">
                <p className="text-sm font-bold leading-tight text-foregroundDark">{avatar.name}</p>
                {locked && avatar.price > 0 && (
                  <div className="mt-1 flex items-center gap-1">
                    <Gem className="h-3 w-3 fill-sky-400 text-sky-400" />
                    <span className="text-xs font-bold text-foregroundDark">
                      {avatar.price.toLocaleString("pt-BR")}
                    </span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <AppBottomNav />
    </div>
  )
}
