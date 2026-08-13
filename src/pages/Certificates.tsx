import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Award, Download, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppPageHeader } from "@/components/AppPageHeader"
import { useAuth } from "@/hooks/useAuth"
import { getLocalXP, getLevel } from "@/lib/xp"
import { getLevelTitle } from "@/lib/levelTitles"
import { downloadCertificatePdf } from "@/lib/certificatePdf"
import { tryCompleteSpecialQuest } from "@/lib/missions"

interface StoredCertificate {
  id: string
  courseName: string
  completionDate: string
  hours: number
  track?: "A1" | "A2" | "A3"
}

const DEMO_CERTIFICATES: StoredCertificate[] = [
  {
    id: "cert-demo-001",
    courseName: "Engenharia de Prompts para Iniciantes",
    completionDate: new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    hours: 4,
    track: "A1",
  },
  {
    id: "cert-demo-002",
    courseName: "Prompts Avançados com ChatGPT",
    completionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    hours: 6,
    track: "A2",
  },
]

function loadCertificates(userId: string): StoredCertificate[] {
  try {
    const raw = localStorage.getItem(`cert_list_${userId}`)
    if (raw) return JSON.parse(raw) as StoredCertificate[]
  } catch {
    // ignore parse errors
  }
  // Seed with demo certificates on first visit
  localStorage.setItem(`cert_list_${userId}`, JSON.stringify(DEMO_CERTIFICATES))
  return DEMO_CERTIFICATES
}

export default function Certificates() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const xp = user?.id ? getLocalXP(user.id) : 0
  const level = getLevel(xp)
  const levelTitle = getLevelTitle(level)
  const displayName = user?.user_metadata?.full_name || levelTitle

  const [certs] = useState<StoredCertificate[]>(() =>
    user?.id ? loadCertificates(user.id) : DEMO_CERTIFICATES
  )
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    tryCompleteSpecialQuest("certificate")
  }, [])

  async function handleDownload(cert: StoredCertificate) {
    setDownloading(cert.id)
    try {
      await downloadCertificatePdf({
        recipient: displayName,
        title: cert.courseName,
        issuedAt: cert.completionDate,
        hours: `${cert.hours}h`,
        id: cert.id,
      })
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <AppPageHeader title="Meus Certificados" back="/settings" />

      <div className="mx-auto w-full max-w-lg px-4 py-6">
        {/* Stats banner */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-stroke-muted bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald/10">
            <Award className="h-5 w-5 text-emerald" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-primary-dark">{certs.length}</p>
            <p className="text-xs font-semibold text-foregroundMuted">
              {certs.length === 1 ? "certificado conquistado" : "certificados conquistados"}
            </p>
          </div>
        </div>

        {certs.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-soft">
              <BookOpen className="h-8 w-8 text-foregroundMuted" />
            </div>
            <h2 className="text-lg font-bold text-foregroundDark">Nenhum certificado ainda</h2>
            <p className="mt-2 max-w-xs text-sm text-foregroundMuted">
              Complete um curso para ganhar seu primeiro certificado.
            </p>
            <Button className="mt-6" onClick={() => navigate("/home")}>
              Explorar cursos
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="overflow-hidden rounded-2xl border-2 border-stroke-light bg-white shadow-sm"
              >
                {/* Accent bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-primary-dark via-emerald to-[#7CC79A]" />

                <div className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-dark">
                      <span className="text-xs font-extrabold text-white">
                        {cert.track ?? "PL"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-emerald">
                        Certificado de Conquista
                      </p>
                      <h3 className="mt-0.5 text-sm font-extrabold leading-snug text-foregroundDark line-clamp-2">
                        {cert.courseName}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-surface-soft px-2.5 py-1 text-[11px] font-semibold text-foregroundMuted">
                      {cert.completionDate}
                    </span>
                    <span className="rounded-full bg-emerald/10 px-2.5 py-1 text-[11px] font-semibold text-emerald">
                      {cert.hours}h
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      className="h-9 flex-1 gap-1.5 px-3 text-xs"
                      disabled={downloading === cert.id}
                      onClick={() => handleDownload(cert)}
                    >
                      <Download className="h-3.5 w-3.5" />
                      {downloading === cert.id ? "Gerando…" : "Baixar PDF"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
