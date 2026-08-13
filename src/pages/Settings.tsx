import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Bell,
  Globe,
  Volume2,
  HelpCircle,
  LogOut,
  ChevronRight,
  Map,
  Award,
  Sparkles,
  Smartphone,
  Star,
  Heart,
} from "lucide-react"
import { AppBottomNav } from "@/components/AppBottomNav"
import { AppPageHeader } from "@/components/AppPageHeader"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Switch } from "@/components/ui/switch"
import { ReviewModal } from "@/components/ReviewModal"
import { useAuth } from "@/hooks/useAuth"
import { getReminderEnabled, setReminderEnabled } from "@/hooks/useInactiveReminder"
import { getLocalXP, XP_UPDATE_EVENT } from "@/lib/xp"
import { getLevelTitle } from "@/lib/levelTitles"
import { SOUND_KEY, playCorrectSound } from "@/lib/sound"

const NOTIF_KEY = "promptlabz:settings:notif"

export default function SettingsPage() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const userId = user?.id ?? null
  const [xp, setXp] = useState(0)
  useEffect(() => {
    const readXP = () => setXp(userId ? getLocalXP(userId) : 0)
    readXP()
    window.addEventListener(XP_UPDATE_EVENT, readXP)
    window.addEventListener("storage", readXP)
    return () => {
      window.removeEventListener(XP_UPDATE_EVENT, readXP)
      window.removeEventListener("storage", readXP)
    }
  }, [userId])
  const XP_PER_LEVEL = 500
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const currentXPInLevel = xp % XP_PER_LEVEL
  const xpPct = Math.round((currentXPInLevel / XP_PER_LEVEL) * 100)

  const [notif, setNotifState] = useState(() => localStorage.getItem(NOTIF_KEY) !== "false")
  const [sound, setSoundState] = useState(() => localStorage.getItem(SOUND_KEY) !== "false")
  const [reminders, setReminders] = useState(() => getReminderEnabled())
  const [loggingOut, setLoggingOut] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)

  function setNotif(value: boolean) {
    setNotifState(value)
    localStorage.setItem(NOTIF_KEY, String(value))
  }

  function setSound(value: boolean) {
    setSoundState(value)
    localStorage.setItem(SOUND_KEY, String(value))
    if (value) playCorrectSound()
  }

  useEffect(() => {
    setReminderEnabled(reminders)
  }, [reminders])

  async function handleLogout() {
    setLoggingOut(true)
    await logout()
    navigate("/login")
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-white pb-24 lg:pb-8">
      <AppPageHeader title="Configurações" back="/profile" />

      <img
        src="/assets/mascot-settings.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-0 z-20 w-36 object-contain"
      />

      <div className="mx-auto w-full max-w-lg lg:max-w-2xl space-y-5 px-4 py-5">
        {/* Nível */}
        <div className="rounded-2xl bg-gradient-to-br from-forest to-emerald-dark p-5 text-white shadow-lg shadow-forest/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Nível {level}
              </p>
              <p className="text-xl font-extrabold">{getLevelTitle(level)}</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card/15 backdrop-blur">
              <Star className="h-7 w-7 text-luxury fill-luxury" />
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-card/20">
            <div
              className="h-full rounded-full bg-luxury transition-all"
              style={{ width: `${xpPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs opacity-90">
            {currentXPInLevel} / {XP_PER_LEVEL} XP para o próximo nível
          </p>
        </div>

        {/* Preferências */}
        <section className="rounded-2xl border-2 border-stroke-light bg-card">
          <p className="px-4 pt-4 text-[11px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
            Preferências
          </p>
          <div className="divide-y divide-stroke-muted">
            <div className="flex items-center gap-3 px-4 py-3">
              <Bell className="h-5 w-5 text-emerald" />
              <span className="flex-1 text-sm font-semibold text-foreground-dark">
                Notificações push
              </span>
              <Switch checked={notif} onCheckedChange={setNotif} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Volume2 className="h-5 w-5 text-emerald" />
              <span className="flex-1 text-sm font-semibold text-foreground-dark">
                Sons e efeitos
              </span>
              <Switch checked={sound} onCheckedChange={setSound} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Sparkles className="h-5 w-5 text-emerald" />
              <span className="flex-1 text-sm font-semibold text-foreground-dark">
                Lembrete diário (streak)
              </span>
              <Switch checked={reminders} onCheckedChange={setReminders} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Globe className="h-5 w-5 text-emerald" />
              <span className="flex-1 text-sm font-semibold text-foreground-dark">Idioma</span>
              <span className="text-xs font-semibold text-foreground-tertiary">Português (BR)</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="flex-1 text-sm font-semibold text-foreground-dark">Tema</span>
              <ThemeToggle />
            </div>
          </div>
        </section>

        {/* Conta */}
        <section className="rounded-2xl border-2 border-stroke-light bg-card">
          <p className="px-4 pt-4 text-[11px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
            Conta
          </p>
          <div className="divide-y divide-stroke-muted">
            <Link
              to="/certificates"
              className="flex items-center gap-3 px-4 py-3 hover:bg-surface-soft"
            >
              <Award className="h-5 w-5 text-emerald" />
              <span className="flex-1 text-sm font-semibold text-foreground-dark">
                Meus certificados
              </span>
              <ChevronRight className="h-4 w-4 text-foreground-tertiary" />
            </Link>
            <Link to="/roadmap" className="flex items-center gap-3 px-4 py-3 hover:bg-surface-soft">
              <Map className="h-5 w-5 text-emerald" />
              <span className="flex-1 text-sm font-semibold text-foreground-dark">
                Roadmap do produto
              </span>
              <ChevronRight className="h-4 w-4 text-foreground-tertiary" />
            </Link>
            {/* Assinatura Premium oculta temporariamente durante a open beta */}
            <button className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-soft">
              <HelpCircle className="h-5 w-5 text-emerald" />
              <span className="flex-1 text-sm font-semibold text-foreground-dark">
                Ajuda e suporte
              </span>
              <ChevronRight className="h-4 w-4 text-foreground-tertiary" />
            </button>
          </div>
        </section>

        {/* Acesso Rápido */}
        <section className="rounded-2xl border-2 border-stroke-light bg-card">
          <p className="px-4 pt-4 text-[11px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
            Acesso Rápido
          </p>
          <div className="divide-y divide-stroke-muted">
            <Link
              to="/settings/back-tap"
              className="flex items-center gap-3 px-4 py-3 hover:bg-surface-soft"
            >
              <Smartphone className="h-5 w-5 text-emerald" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground-dark">Configurar Back Tap</p>
                <p className="text-xs text-foreground-muted">
                  Aprimoramento rápido com 2 toques no iPhone
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-foreground-tertiary" />
            </Link>
          </div>
        </section>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-500/30 bg-card py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/5 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Saindo..." : "Sair da conta"}
        </button>

        <p className="text-center text-[11px] text-foreground-tertiary">PromptLabz · v0.3 MVP</p>

        {/* Feedback */}
        <section>
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
            Feedback
          </p>
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex w-full items-center gap-3 rounded-2xl bg-emerald px-4 py-4 text-left transition-opacity hover:opacity-90 active:opacity-75"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
              <Heart className="h-5 w-5 text-red-300" fill="currentColor" strokeWidth={0} />
            </div>
            <span className="flex-1 text-sm font-extrabold uppercase tracking-wide text-white">
              Avalie nosso projeto
            </span>
            <Star
              className="h-5 w-5 flex-shrink-0 text-luxury"
              fill="currentColor"
              strokeWidth={0}
            />
          </button>
        </section>

        <ReviewModal open={showReviewModal} onOpenChange={setShowReviewModal} />
      </div>

      <AppBottomNav />
    </div>
  )
}
