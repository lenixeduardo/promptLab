import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { getLocalXP } from "@/lib/xp"
import { getLevel } from "@/lib/xp"
import { getLevelTitle } from "@/lib/levelTitles"
import { tryCompleteSpecialQuest } from "@/lib/missions"

interface CertificateState {
  courseName?: string
  completionDate?: string
  hours?: number
}

function QRCodePlaceholder() {
  const cells = Array.from({ length: 7 * 7 }, (_, i) => {
    const row = Math.floor(i / 7)
    const col = i % 7
    // Corner blocks
    const isCorner = (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2)
    const isBorder = row === 0 || row === 6 || col === 0 || col === 6
    const isData = !isCorner && !isBorder && Math.random() > 0.5
    return isCorner || isBorder || isData
  })

  return (
    <div
      className="grid rounded border border-stroke-muted bg-white p-1.5"
      style={{ gridTemplateColumns: "repeat(7, 1fr)", width: 60, height: 60 }}
    >
      {cells.map((filled, i) => (
        <div
          key={i}
          className={filled ? "bg-foregroundDark" : "bg-white"}
          style={{ width: "100%", aspectRatio: "1" }}
        />
      ))}
    </div>
  )
}

export default function Certificate() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    tryCompleteSpecialQuest("certificate")
  }, [])

  const state = location.state as CertificateState | null
  const courseName = state?.courseName ?? "Engenharia de Prompts para Iniciantes"
  const hours = state?.hours ?? 4

  const completionDate =
    state?.completionDate ??
    new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })

  const xp = user?.id ? getLocalXP(user.id) : 0
  const level = getLevel(xp)
  const levelTitle = getLevelTitle(level)
  const displayName = user?.user_metadata?.full_name || levelTitle

  const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&title=${encodeURIComponent("Certificado PromptLab")}&summary=${encodeURIComponent(`Concluí o curso: ${courseName}`)}`

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="mx-auto w-full max-w-[420px]">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-emerald hover:text-primary-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        {/* Certificate card */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-stroke-light bg-white shadow-lg">
          {/* Green top accent */}
          <div className="h-2 w-full bg-gradient-to-r from-primary-dark via-emerald to-[#7CC79A]" />

          {/* Card body */}
          <div className="flex flex-col items-center px-6 py-7">
            {/* Logo */}
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-dark">
                <span className="text-xs font-extrabold text-white">PL</span>
              </div>
              <span className="text-sm font-extrabold tracking-tight text-primary-dark">
                PromptLab
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-3 text-center text-2xl font-extrabold leading-tight text-foregroundDark">
              Certificado
              <br />
              de Conquista
            </h1>
            <p className="mt-1 text-center text-xs font-medium text-foregroundMuted">
              por concluir este curso com excelência
            </p>

            {/* Divider */}
            <div className="my-4 h-px w-3/4 bg-gradient-to-r from-transparent via-stroke-muted to-transparent" />

            {/* Recipient & Course */}
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral">Para</p>
            <p className="mt-0.5 text-2xl font-extrabold text-primary-dark">{displayName}</p>

            <p className="mt-3 text-center text-sm font-semibold text-foregroundDark">
              {courseName}
            </p>

            {/* Meta info */}
            <div className="mt-4 flex w-full flex-col gap-1.5 rounded-xl bg-surface-soft px-4 py-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foregroundMuted font-medium">Data de conclusão</span>
                <span className="font-semibold text-foregroundDark">{completionDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-foregroundMuted font-medium">Carga horária</span>
                <span className="font-semibold text-foregroundDark">{hours}h</span>
              </div>
            </div>

            {/* Mascot + QR row */}
            <div className="mt-5 flex w-full items-end justify-between">
              <div className="flex flex-col items-center gap-1">
                <QRCodePlaceholder />
                <span className="text-[9px] text-neutral">verificar</span>
              </div>

              <img
                src="/assets/mascot-promo.png"
                alt="Mascote PromptLab"
                className="h-24 w-auto object-contain drop-shadow"
              />

              {/* Signature */}
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-px w-16 bg-stroke-muted" />
                <span className="text-[9px] font-medium text-neutral">PromptLab</span>
              </div>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[#7CC79A] via-emerald to-primary-dark" />
        </div>

        {/* Share button */}
        <Button
          size="lg"
          className="mt-5 w-full gap-2 text-base"
          onClick={() => window.open(linkedInUrl, "_blank", "noopener,noreferrer")}
        >
          <Linkedin className="h-5 w-5" />
          Compartilhar no LinkedIn
        </Button>
      </div>
    </div>
  )
}
