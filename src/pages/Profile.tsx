import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Settings, ChevronRight, Zap, BookOpen, Edit2, Heart, Crown, Flame } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { AppBottomNav } from "@/components/AppBottomNav"
import { useAuth } from "@/hooks/useAuth"
import { useAchievements } from "@/hooks/useAchievements"
import { useAvatar } from "@/components/AvatarProvider"
import { getLocalXP, getLevel, getLevelProgress } from "@/lib/xp"
import { getLevelTitle } from "@/lib/levelTitles"
import { usePremium } from "@/components/PremiumProvider"
import { cn } from "@/lib/utils"

function StatCard({
  value,
  label,
  icon: Icon,
  iconClass,
}: {
  value: number | string
  label: string
  icon: React.ComponentType<{ className?: string }>
  iconClass?: string
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-white px-2 py-3 shadow-sm">
      <Icon className={cn("h-4 w-4", iconClass ?? "text-emerald")} />
      <span className="text-lg font-extrabold leading-none text-primary-dark">{value}</span>
      <span className="text-[10px] font-medium text-foregroundMuted">{label}</span>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { unlocked, data } = useAchievements()
  const { isPremium, toggle } = usePremium()
  const { equipped } = useAvatar()

  const xp = user?.id ? getLocalXP(user.id) : 0
  const level = getLevel(xp)
  const { currentXP, targetXP } = getLevelProgress(xp)
  const levelTitle = getLevelTitle(level)
  const xpToNext = targetXP - currentXP
  const xpPct = Math.round((currentXP / targetXP) * 100)
  const skillsCount = unlocked.length

  return (
    <div className="min-h-screen bg-white pb-28 lg:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-stroke-muted bg-white/95 px-5 pb-3 pt-5 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[420px] lg:max-w-2xl items-center justify-between">
          <h1 className="text-xl font-extrabold text-primary-dark">Perfil</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/settings"
              className="rounded-full p-2 text-foregroundMuted hover:bg-surface-soft"
              aria-label="Configurações"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[420px] lg:max-w-2xl px-4 pt-4">
        <div className="flex flex-col gap-4">

          {/* Hero card verde */}
          <div className="rounded-2xl bg-emerald p-5">
            <div className="mb-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white/40 shadow-md">
                  <img src={equipped.image} alt={equipped.name} className="h-full w-full object-cover" />
                </div>
                <button
                  onClick={() => navigate("/avatars")}
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-dark shadow"
                  aria-label="Trocar avatar"
                >
                  <Edit2 className="h-3 w-3 text-white" />
                </button>
              </div>

              {/* Dados do usuário */}
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xl font-extrabold text-white">
                  {user?.user_metadata?.full_name || levelTitle}
                </h2>
                <p className="truncate text-sm text-white/75">{user?.email}</p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white">
                  <Crown className="h-3 w-3 text-accent" />
                  {levelTitle} · Nível {level}
                </span>
              </div>
            </div>

            {/* Barra de progresso XP */}
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-white/25"
              role="progressbar"
              aria-valuenow={xpPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-white/80">
              {xp} XP · {xpToNext} para o próximo nível
            </p>
          </div>

          {/* Card Torne-se Premium oculto temporariamente durante a open beta */}

          {/* Modo teste Premium — apenas visível em desenvolvimento */}
          {import.meta.env.DEV && <div
            className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-accent bg-white p-4 shadow-sm"
            style={{ borderColor: "rgba(245, 166, 35, 0.45)" }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pageBgLight">
              <Crown className="h-5 w-5 text-foregroundMuted" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-primary-dark">Modo teste Premium</p>
              <p className="text-xs text-foregroundMuted">
                Ative para testar recursos Premium localmente
              </p>
            </div>
            <button
              role="switch"
              aria-checked={isPremium}
              onClick={toggle}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
                isPremium ? "bg-emerald" : "bg-stroke-muted",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
                  isPremium ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </button>
          </div>}

          {/* Stats row */}
          <div className="flex gap-2">
            <StatCard
              value={data.totalLessonsCompleted}
              label="Lições"
              icon={BookOpen}
              iconClass="text-emerald"
            />
            <StatCard
              value={data.consecutiveDays}
              label="Sequência"
              icon={Flame}
              iconClass="text-brand-orange"
            />
            <StatCard
              value={xp}
              label="XP"
              icon={Zap}
              iconClass="text-emerald"
            />
            <StatCard
              value={skillsCount}
              label="Skills"
              icon={Heart}
              iconClass="text-rose-500"
            />
          </div>

        </div>
      </div>

      <AppBottomNav />
    </div>
  )
}
