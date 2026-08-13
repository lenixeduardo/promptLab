import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, Gem, Crown, Lock } from "lucide-react"
import { useAvatar, type AvatarOption, type AvatarTier } from "@/components/AvatarProvider"
import { AppBottomNav } from "@/components/AppBottomNav"
import { cn } from "@/lib/utils"
import { sileo } from "sileo"
import { tryCompleteSpecialQuest } from "@/lib/missions"

type FilterValue = "Todos" | AvatarTier

const FILTER_TABS: { label: string; value: FilterValue }[] = [
  { label: "Todos", value: "Todos" },
  { label: "Grátis", value: "Grátis" },
  { label: "Raro", value: "Raro" },
  { label: "Épico", value: "Épico" },
  { label: "Lendário", value: "Lendário" },
]

const TIER_BADGE: Record<AvatarTier, { label: string; className: string }> = {
  Grátis: { label: "GRÁTIS", className: "bg-gray-800 text-white" },
  Raro: { label: "RARO", className: "bg-amber-500 text-white" },
  Épico: { label: "ÉPICO", className: "bg-purple-600 text-white" },
  Lendário: { label: "LENDÁRIO", className: "bg-yellow-500 text-white" },
}

export default function AvatarScreen() {
  const navigate = useNavigate()
  const { equippedId, equipped, setEquipped, options } = useAvatar()
  const [filter, setFilter] = useState<FilterValue>("Todos")
  const [userBalance] = useState(142)

  const filtered = filter === "Todos" ? options : options.filter((a) => a.tier === filter)

  const handleSelect = (avatar: AvatarOption) => {
    if (!avatar.owned && avatar.cost > userBalance) {
      sileo.error({
        title: "Diamantes insuficientes",
        description: `Você precisa de ${avatar.cost - userBalance} diamantes a mais.`,
      })
      return
    }
    setEquipped(avatar.id)
    tryCompleteSpecialQuest("buy-avatar")
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
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5 rounded-full bg-surface-soft px-3 py-1.5">
            <Gem className="h-4 w-4 fill-sky-400 text-sky-400" />
            <span className="text-sm font-bold text-foregroundDark">{userBalance}</span>
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-foregroundDark">Loja de Avatares</h1>
        <p className="mb-5 mt-0.5 text-sm text-foregroundSecondary">
          Desbloqueie seu visual lendário
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
            <p className="text-sm text-white/80">{equipped.desc}</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-1.5">
            <Crown className="h-3.5 w-3.5 text-white" />
            <span className="text-xs font-bold text-white">{equipped.tier}</span>
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
          const badge = TIER_BADGE[avatar.tier]
          const locked = !avatar.owned

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
                <p className="text-[11px] leading-tight text-foregroundSecondary">{avatar.desc}</p>
                {locked && avatar.cost > 0 && (
                  <div className="mt-1 flex items-center gap-1">
                    <Gem className="h-3 w-3 fill-sky-400 text-sky-400" />
                    <span className="text-xs font-bold text-foregroundDark">
                      {avatar.cost.toLocaleString("pt-BR")}
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
