import { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { getLocalXP, getLevel } from "@/lib/xp"
import { getLevelTitle } from "@/lib/levelTitles"

// ── 3-tier 3D podium ───────────────────────────────────────────────
const TIERS = [
  { w: 104, topH: 10, sideH: 10, topC: "#D5F0E0", sideC: "#B8DCCA" },
  { w: 152, topH: 13, sideH: 13, topC: "#CCEADA", sideC: "#AACFBB" },
  { w: 200, topH: 16, sideH: 16, topC: "#C2E4D4", sideC: "#9EC2AE" },
]

function Podium() {
  return (
    <div className="flex flex-col items-center">
      {TIERS.map((t, i) => (
        <div key={i} className="flex flex-col items-center" style={{ marginTop: i === 0 ? 0 : -1 }}>
          {/* Top face — ellipse */}
          <div
            style={{
              width: t.w,
              height: t.topH,
              borderRadius: "50%",
              background: `radial-gradient(ellipse at 42% 30%, #EAF8F0, ${t.topC})`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          />
          {/* Side body */}
          <div
            style={{
              width: t.w,
              height: t.sideH,
              marginTop: -1,
              background: `linear-gradient(to bottom, ${t.topC}, ${t.sideC})`,
              borderRadius: `0 0 ${t.w / 2}px ${t.w / 2}px`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

// ── Level hex badge with green border + glow ────────────────────────
function HexBadge({ level }: { level: number }) {
  const hexPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
  return (
    <div
      style={{
        filter:
          "drop-shadow(0 0 12px rgba(74,222,128,0.9)) drop-shadow(0 0 28px rgba(74,222,128,0.45))",
      }}
    >
      {/* Outer green hex = "border" */}
      <div
        style={{
          width: 100,
          height: 100,
          clipPath: hexPath,
          background: "#22C55E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Inner dark hex = fill */}
        <div
          style={{
            width: "84%",
            height: "84%",
            clipPath: hexPath,
            background: "linear-gradient(160deg, #1A3D2B 0%, #0D2419 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: "rgba(74,222,128,0.85)",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            NÍVEL
          </span>
          <span
            style={{
              fontSize: 34,
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1,
              marginTop: 1,
            }}
          >
            {level}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Unlock items ────────────────────────────────────────────────────
const UNLOCK_ITEMS = [
  (level: number) => `Novos badges (${level} desbloqueados)`,
  () => "Novos exercícios",
  () => "Desafios exclusivos",
  () => "Funcionalidades exclusivas",
]

interface LevelUpState {
  newLevel: number
  prevLevel: number
}

export default function LevelUp() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [introDone, setIntroDone] = useState(false)

  const state = location.state as LevelUpState | null

  if (!state) {
    const xp = user?.id ? getLocalXP(user.id) : 0
    const level = getLevel(xp)
    return <Navigate to="/level-up" state={{ newLevel: level, prevLevel: level - 1 }} replace />
  }

  const { newLevel } = state

  return introDone ? (
    <LevelUpDetails newLevel={newLevel} onDone={() => navigate("/home")} />
  ) : (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black animate-fade-in"
      onClick={() => setIntroDone(true)}
    >
      <button
        onClick={() => setIntroDone(true)}
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Pular"
      >
        <X className="h-5 w-5" />
      </button>
      <video
        className="w-full max-w-lg"
        src="/assets/animations/level-up.mp4"
        autoPlay
        muted
        playsInline
        onEnded={() => setIntroDone(true)}
      />
    </div>
  )
}

function LevelUpDetails({ newLevel, onDone }: { newLevel: number; onDone: () => void }) {
  const levelTitle = getLevelTitle(newLevel)

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #E4F5EC 0%, #EDF8F2 45%, #F3FBF6 100%)",
      }}
    >
      {/* ── Top bar ───────────────────────────────────────────────── */}
      <div
        className="animate-podium-rise flex items-center justify-between px-5 pt-8 pb-1"
        style={{ animationDelay: "0s" }}
      >
        <button
          onClick={onDone}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/70 text-foregroundMuted shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
        <span className="text-xs font-bold text-foregroundMuted tracking-wide">
          Nível {newLevel}
        </span>
        <div className="w-9" />
      </div>

      {/* ── Title ─────────────────────────────────────────────────── */}
      <h1
        className="animate-podium-rise px-6 pt-1 text-center text-[2.6rem] font-extrabold leading-tight text-[#0D2B1A]"
        style={{ animationDelay: "0.06s" }}
      >
        Novo Nível!
      </h1>

      {/* ── Badge + Podium recap ─────────────────────────────────────── */}
      <div className="relative flex flex-col items-center px-4 pt-4 pb-1">
        <div
          className="animate-podium-rise relative z-10 flex flex-col items-center"
          style={{ animationDelay: "0.18s" }}
        >
          {/* Hex badge sits on top of podium */}
          <div
            className="animate-level-badge-pop relative z-10"
            style={{ animationDelay: "0.32s", marginBottom: -6 }}
          >
            <HexBadge level={newLevel} />
          </div>

          <Podium />
        </div>
      </div>

      {/* ── Text + Cards ──────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-4 px-5 pt-3 pb-6">
        {/* Parabéns block */}
        <div className="animate-podium-rise text-center" style={{ animationDelay: "0.42s" }}>
          <p className="text-xl font-extrabold text-[#0D2B1A]">Parabéns!</p>
          <p className="mt-0.5 text-sm font-medium text-foregroundDark">
            Você alcançou o <span className="font-extrabold text-emerald">Nível {newLevel}</span>
          </p>
          {levelTitle && <p className="text-xs font-semibold text-emerald/80">{levelTitle}</p>}
          <p className="mt-1 text-xs text-foregroundMuted">
            Continue assim e desbloqueie recompensas incríveis!
          </p>
        </div>

        {/* Unlocked items card */}
        <div
          className="animate-podium-rise rounded-2xl border border-stroke-light bg-white px-5 py-4 shadow-sm"
          style={{ animationDelay: "0.52s" }}
        >
          <p className="mb-3 text-sm font-bold text-foregroundDark">O que foi desbloqueado:</p>
          <div className="flex flex-col gap-2.5">
            {UNLOCK_ITEMS.map((text, idx) => (
              <div
                key={idx}
                className="animate-unlock-slide-in flex items-center gap-2.5"
                style={{ animationDelay: `${0.62 + idx * 0.1}s` }}
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald" />
                <span className="text-sm text-foregroundDark">{text(newLevel)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="animate-podium-rise mt-auto" style={{ animationDelay: "1.05s" }}>
          <Button size="lg" className="w-full text-base font-bold tracking-wide" onClick={onDone}>
            EXPLORAR NOVO NÍVEL →
          </Button>
        </div>
      </div>
    </div>
  )
}
