import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { loadInventory } from "@/lib/inventory"
import { getLocalXP } from "@/lib/xp"
import { POWER_UPS } from "@/data/powerUpsData"
import { AVATARS, getAvatarById } from "@/data/avatarsData"
import { getUserProfile, fetchInventoryFromServer } from "@/lib/db"
import * as Icons from "@/lib/icons"
import { cn } from "@/lib/utils"

export default function Inventory() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [xp, setXp] = useState(0)
  const [powerUps, setPowerUps] = useState<Record<string, number>>({})
  const [ownedAvatarIds, setOwnedAvatarIds] = useState<string[]>(["cat-green"])
  const [activeAvatarId, setActiveAvatarId] = useState<string>("cat-green")

  useEffect(() => {
    if (!user?.id) return
    const inv = loadInventory(user.id)
    setPowerUps(inv.powerUps)
    setOwnedAvatarIds(inv.ownedAvatarIds)
    setXp(getLocalXP(user.id))

    getUserProfile(user.id)
      .then(({ data: profile }) => {
        if (profile?.avatar_url) setActiveAvatarId(profile.avatar_url)
      })
      .catch((err) => {
        console.error("Falha ao carregar perfil do usuário:", err)
      })

    // Hidrata com o servidor (útil ao logar em um dispositivo novo), mesclando
    // com o que já está em localStorage.
    fetchInventoryFromServer(user.id)
      .then(({ data }) => {
        if (data) {
          setPowerUps(data.powerUps)
          setOwnedAvatarIds(data.ownedAvatarIds)
        }
      })
      .catch((err) => {
        console.error("Falha ao sincronizar inventário do servidor:", err)
      })
  }, [user?.id])

  const ownedAvatars = ownedAvatarIds
    .map((id) => getAvatarById(id))
    .filter(Boolean) as typeof AVATARS

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="mx-auto flex w-full max-w-[420px] flex-col px-5 pb-10 pt-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-primary-dark shadow-sm hover:bg-white"
            aria-label="Voltar"
          >
            <Icons.ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
          </button>
          <h1 className="text-xl font-extrabold text-primary-dark">Inventário</h1>
          <div className="flex items-center gap-1 rounded-full bg-primary-dark px-3 py-1 shadow">
            <Icons.Zap className="h-3.5 w-3.5 text-yellow-300" />
            <span className="text-xs font-bold text-white">{xp.toLocaleString("pt-BR")}</span>
          </div>
        </div>

        <p className="mb-6 text-center text-sm text-emerald">Seus recursos e poder-ups</p>

        {/* Power-ups */}
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary-dark">
            Power-ups
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {POWER_UPS.map((pu) => {
              const Icon = Icons[pu.icon as keyof typeof Icons] as React.ComponentType<{
                className?: string
              }>
              const qty = powerUps[pu.id] ?? 0
              return (
                <div
                  key={pu.id}
                  className="relative flex flex-col items-center gap-2 rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm"
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      pu.color
                    )}
                  >
                    {Icon && <Icon className="h-6 w-6 text-primary-dark" />}
                  </div>
                  <p className="text-center text-xs font-bold text-foregroundDark">{pu.name}</p>
                  <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-primary-dark px-1.5 text-[10px] font-bold text-white">
                    {qty}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Avatares */}
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary-dark">
              Avatares
            </h2>
            <button
              onClick={() => navigate("/store")}
              className="text-xs font-semibold text-emerald hover:underline"
            >
              Ver loja →
            </button>
          </div>
          {ownedAvatars.length === 0 ? (
            <p className="text-center text-sm text-foregroundTertiary">
              Nenhum avatar desbloqueado ainda.
            </p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {ownedAvatars.map((avatar) => (
                <div
                  key={avatar.id}
                  className={cn(
                    "flex shrink-0 flex-col items-center gap-1.5 rounded-2xl border-2 p-2",
                    activeAvatarId === avatar.id
                      ? "border-primary-dark bg-pageBgLight"
                      : "border-stroke-muted bg-white"
                  )}
                >
                  <div className="h-16 w-16 overflow-hidden rounded-xl">
                    <img
                      src={avatar.image}
                      alt={avatar.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="w-16 text-center text-[10px] font-semibold leading-tight text-primary-dark">
                    {avatar.name}
                  </p>
                  {activeAvatarId === avatar.id && (
                    <span className="rounded-full bg-primary-dark px-2 py-0.5 text-[9px] font-bold text-white">
                      Ativo
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Outros Itens */}
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary-dark">
            Outros Itens
          </h2>
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-stroke-muted bg-white/60 py-10">
            <div className="text-center">
              <Icons.Box className="mx-auto mb-2 h-8 w-8 text-stroke-muted" />
              <p className="text-sm text-neutral">Em breve...</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
