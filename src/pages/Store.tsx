import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { loadInventory, addPowerUp, addAvatar } from "@/lib/inventory"
import { getLocalGems, saveLocalGems } from "@/lib/xp"
import { updateUserAvatar, updateUserGems, syncInventoryToServer, fetchInventoryFromServer } from "@/lib/db"
import { AVATARS } from "@/data/avatarsData"
import { POWER_UPS } from "@/data/powerUpsData"
import { GEM_PACKAGES } from "@/data/storeItemsData"
import type { PowerUpId } from "@/data/powerUpsData"
import * as Icons from "@/lib/icons"
import { cn } from "@/lib/utils"
import { sileo } from "sileo"

export default function Store() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [gems, setGems] = useState(0)
  const [ownedAvatarIds, setOwnedAvatarIds] = useState<string[]>(["cat-green"])
  const [purchasingId, setPurchasingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return
    setGems(getLocalGems(user.id))
    const inv = loadInventory(user.id)
    setOwnedAvatarIds(inv.ownedAvatarIds)

    // Hidrata com o servidor (útil ao logar em um dispositivo novo), mesclando
    // com o que já está em localStorage.
    fetchInventoryFromServer(user.id)
      .then(({ data }) => {
        if (data) setOwnedAvatarIds(data.ownedAvatarIds)
      })
      .catch((err) => {
        console.error("Falha ao sincronizar inventário do servidor:", err)
      })
  }, [user?.id])

  function deductGems(price: number): number | null {
    if (!user?.id) return null
    if (gems < price) {
      sileo.error({ title: "Gemas insuficientes", description: `Você precisa de ${price} 💎` })
      return null
    }
    const newGems = gems - price
    saveLocalGems(user.id, newGems)
    setGems(newGems)
    return newGems
  }

  async function handleBuyAvatar(avatarId: string, price: number) {
    if (!user?.id || purchasingId) return
    if (ownedAvatarIds.includes(avatarId)) return
    const newGems = deductGems(price)
    if (newGems === null) return
    setPurchasingId(avatarId)
    try {
      const inv = addAvatar(user.id, avatarId)
      setOwnedAvatarIds([...inv.ownedAvatarIds])
      await updateUserAvatar(user.id, avatarId)
      await updateUserGems(user.id, newGems)
      await syncInventoryToServer(user.id, inv)
      sileo.success({ title: "Avatar desbloqueado! 🎉" })
    } catch {
      sileo.error({ title: "Erro ao salvar. Tente novamente." })
    } finally {
      setPurchasingId(null)
    }
  }

  async function handleBuyPowerUp(id: PowerUpId, price: number) {
    if (!user?.id || purchasingId) return
    const newGems = deductGems(price)
    if (newGems === null) return
    setPurchasingId(id)
    try {
      const inv = addPowerUp(user.id, id)
      await updateUserGems(user.id, newGems)
      await syncInventoryToServer(user.id, inv)
      sileo.success({ title: "Power-up adicionado! ⚡" })
    } catch {
      sileo.error({ title: "Erro ao salvar. Tente novamente." })
    } finally {
      setPurchasingId(null)
    }
  }

  function handleBuyGemPackage() {
    sileo.success({
      title: "Em breve!",
      description: "Integração de pagamento em construção.",
    })
  }

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
          <h1 className="text-xl font-extrabold text-primary-dark">Loja</h1>
          <div className="flex items-center gap-1 rounded-full bg-primary-dark px-3 py-1 shadow">
            <Icons.Diamond className="h-3.5 w-3.5 text-cyan-300" />
            <span className="text-xs font-bold text-white">{gems.toLocaleString("pt-BR")}</span>
          </div>
        </div>

        <p className="mb-6 text-center text-sm text-emerald">
          Veja aqui o que você pode desbloquear para criar power-ups!
        </p>

        {/* Hero animado */}
        <div className="mb-6 flex flex-col items-center rounded-2xl border border-stroke-muted bg-white py-6 shadow-sm">
          <div className="animate-bounce">
            <img
              src="/assets/mascot-promo.png"
              alt="Loja"
              className="h-28 w-auto object-contain"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/assets/mascot-home.png"
              }}
            />
          </div>
          <p className="mt-3 text-center text-sm font-semibold text-primary-dark">
            Desbloqueie novos avatares e power-ups
          </p>
        </div>

        {/* Avatares */}
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary-dark">
            Avatares
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {AVATARS.filter((a) => a.price > 0).map((avatar) => {
              const owned = ownedAvatarIds.includes(avatar.id)
              const buying = purchasingId === avatar.id
              return (
                <button
                  key={avatar.id}
                  onClick={() => handleBuyAvatar(avatar.id, avatar.price)}
                  disabled={owned || !!purchasingId}
                  className={cn(
                    "relative flex flex-col items-center gap-2 rounded-2xl border p-3 shadow-sm transition-all active:scale-[0.97]",
                    owned
                      ? "border-primary-dark bg-pageBgLight opacity-80"
                      : buying
                        ? "border-stroke-muted bg-white opacity-70"
                        : "border-stroke-muted bg-white hover:shadow-md disabled:opacity-60"
                  )}
                >
                  {owned && (
                    <span className="absolute right-2 top-2 rounded-full bg-primary-dark px-2 py-0.5 text-[9px] font-bold text-white">
                      Meu
                    </span>
                  )}
                  <div className="h-16 w-16 overflow-hidden rounded-xl">
                    <img
                      src={avatar.image}
                      alt={avatar.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-center text-xs font-bold text-foregroundDark dark:text-white">{avatar.name}</p>
                  {!owned && (
                    <div className="flex items-center gap-1">
                      {buying ? (
                        <span className="text-xs font-semibold text-primary-dark">Comprando...</span>
                      ) : (
                        <>
                          <Icons.Diamond className="h-3 w-3 text-cyan-500" />
                          <span className="text-xs font-semibold text-primary-dark">{avatar.price}</span>
                        </>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* Power-ups */}
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary-dark">
            Power-ups
          </h2>
          <div className="flex flex-col gap-3">
            {POWER_UPS.map((pu) => {
              const Icon = Icons[pu.icon as keyof typeof Icons] as React.ComponentType<{
                className?: string
              }>
              const buying = purchasingId === pu.id
              return (
                <button
                  key={pu.id}
                  onClick={() => handleBuyPowerUp(pu.id, pu.storePrice)}
                  disabled={!!purchasingId}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm transition-all active:scale-[0.98]",
                    buying ? "opacity-70" : "hover:shadow-md disabled:opacity-60"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      pu.color
                    )}
                  >
                    {Icon && <Icon className="h-6 w-6 text-primary-dark" />}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-foregroundDark dark:text-white">{pu.name}</p>
                    <p className="text-xs text-foregroundMuted dark:text-foregroundSecondary">{pu.description}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-pageBgLight px-3 py-1">
                    {buying ? (
                      <span className="text-xs font-bold text-primary-dark">Comprando...</span>
                    ) : (
                      <>
                        <Icons.Diamond className="h-3 w-3 text-cyan-500" />
                        <span className="text-xs font-bold text-primary-dark">{pu.storePrice}</span>
                      </>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Pacotes especiais */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary-dark">
              Pacotes especiais
            </h2>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              Em breve
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 opacity-60">
            {GEM_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="relative flex flex-col items-center gap-2 rounded-2xl border border-stroke-muted bg-gradient-to-b from-white to-pageBgLight p-4 shadow-sm cursor-not-allowed"
              >
                {pkg.badge && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary-dark px-3 py-0.5 text-[9px] font-bold text-white whitespace-nowrap">
                    {pkg.badge}
                  </span>
                )}
                <div className="flex items-center gap-1.5 pt-1">
                  <Icons.Diamond className="h-5 w-5 text-cyan-500" />
                  <span className="text-2xl font-extrabold text-primary-dark">{pkg.gemAmount}</span>
                </div>
                <p className="text-xs text-emerald">{pkg.name}</p>
                <div className="w-full rounded-xl bg-stroke-muted py-2 text-center text-xs font-bold text-foreground-tertiary">
                  Pagamento em breve
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
