import {
  Users,
  User,
  Calendar,
  Clock,
  BadgeCheck,
  ShieldCheck,
  Download,
  Share2,
  Copy,
  Check,
  Info,
} from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { AppBottomNav } from "@/components/AppBottomNav"
import { AppPageHeader } from "@/components/AppPageHeader"
import verifyShield from "@/assets/verify-shield.png"
import { createCertificatePdfBlob, downloadCertificatePdf } from "@/lib/certificatePdf"

function lookupCertificate(id: string) {
  return {
    id,
    course: "Engenharia de Prompts para Iniciantes",
    recipient: "Lenix Eduardo",
    issuedAt: "08 de maio de 2025",
    hours: "10 horas",
    issuer: "PromptLabz",
  }
}

export default function VerifyPage() {
  const { id = "" } = useParams<{ id: string }>()
  const cert = lookupCertificate(id)
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState<"dl" | "sh" | null>(null)

  function buildData() {
    return {
      recipient: cert.recipient,
      title: cert.course,
      issuedAt: cert.issuedAt,
      hours: cert.hours,
      id: cert.id,
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(cert.id)
      setCopied(true)
      toast.success("Código copiado")
      setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error("Não foi possível copiar")
    }
  }

  async function handleDownload() {
    if (busy) return
    setBusy("dl")
    const tid = toast.loading("Gerando seu certificado…")
    try {
      const { filename } = await downloadCertificatePdf(buildData())
      toast.success(`Baixado: ${filename}`, { id: tid })
    } catch (err) {
      console.error(err)
      toast.error("Não foi possível gerar o PDF.", { id: tid })
    } finally {
      setBusy(null)
    }
  }

  async function handleShare() {
    if (busy) return
    setBusy("sh")
    const tid = toast.loading("Preparando certificado…")
    try {
      const data = buildData()
      const blob = await createCertificatePdfBlob(data)
      const filename = `certificado-${data.id}.pdf`
      const file = new File([blob], filename, { type: "application/pdf" })
      const navAny = navigator as Navigator & {
        canShare?: (d: { files?: File[] }) => boolean
        share?: (d: { title?: string; text?: string; files?: File[] }) => Promise<void>
      }
      if (navAny.share && navAny.canShare?.({ files: [file] })) {
        await navAny.share({
          title: `Certificado — ${cert.course}`,
          text: `Certificado autêntico do PromptLabz`,
          files: [file],
        })
        toast.success("Pronto para compartilhar!", { id: tid })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
        toast.success("Compartilhamento indisponível — PDF baixado.", { id: tid })
      }
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        console.error(err)
        toast.error("Não foi possível compartilhar.", { id: tid })
      } else {
        toast.dismiss(tid)
      }
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white pb-24 lg:pb-8">
      <AppPageHeader
        title="Validação de Certificado"
        subtitle="Verifique a autenticidade do certificado emitido pelo PromptLabz"
        back="/"
      />

      <div className="mx-auto w-full max-w-lg space-y-4 px-4 py-5">
        <section className="rounded-3xl border-2 border-emerald/20 bg-gradient-to-b from-surface-success/60 to-card p-6">
          <div className="flex justify-center">
            <img
              src={verifyShield}
              alt="Selo de certificado validado"
              className="h-40 w-40 object-contain drop-shadow-[0_8px_20px_rgba(46,125,78,0.25)]"
            />
          </div>
          <h2 className="mt-4 text-center text-2xl font-extrabold text-emerald">
            Certificado válido!
          </h2>
          <p className="mt-2 text-center text-sm leading-snug text-foreground-tertiary">
            Este certificado foi emitido e verificado com sucesso pelo PromptLabz.
          </p>
          <div className="mt-5 border-t border-emerald/15 pt-4">
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-surface-success px-4 py-2">
              <ShieldCheck className="h-4 w-4 text-emerald" />
              <span className="text-sm font-bold text-emerald">Autenticidade confirmada</span>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-stroke-light bg-card p-5">
          <h3 className="text-base font-extrabold text-foreground-dark">
            Informações do Certificado
          </h3>
          <dl className="mt-4 space-y-3.5">
            <InfoRow
              icon={<Users className="h-4 w-4" />}
              label="Nome do Curso"
              value={cert.course}
            />
            <InfoRow
              icon={<User className="h-4 w-4" />}
              label="Destinatário"
              value={cert.recipient}
            />
            <InfoRow
              icon={<Calendar className="h-4 w-4" />}
              label="Data de Emissão"
              value={cert.issuedAt}
            />
            <InfoRow
              icon={<Clock className="h-4 w-4" />}
              label="Carga Horária"
              value={cert.hours}
            />
            <InfoRow
              icon={<BadgeCheck className="h-4 w-4" />}
              label="Código do Certificado"
              value={
                <button
                  onClick={copyCode}
                  className="inline-flex items-center gap-1.5 rounded-md text-right font-mono text-sm font-semibold text-foreground-dark hover:text-emerald"
                >
                  {cert.id}
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-foreground-tertiary" />
                  )}
                </button>
              }
            />
            <InfoRow icon={<User className="h-4 w-4" />} label="Emitido por" value={cert.issuer} />
          </dl>
        </section>

        <section className="flex items-start gap-3 rounded-2xl border border-emerald/20 bg-surface-success/60 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald" />
          <div>
            <p className="text-sm font-extrabold text-emerald">
              Este certificado é autêntico e válido.
            </p>
            <p className="mt-1 text-xs leading-snug text-foreground-tertiary">
              A verificação foi realizada diretamente em nossa base oficial.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            disabled={busy !== null}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-emerald bg-card py-3.5 text-sm font-bold text-emerald hover:bg-surface-success disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {busy === "dl" ? "Gerando…" : "Baixar Certificado"}
          </button>
          <button
            onClick={handleShare}
            disabled={busy !== null}
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald py-3.5 text-sm font-bold text-white hover:bg-emerald-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Share2 className="h-4 w-4" />
            {busy === "sh" ? "Preparando…" : "Compartilhar"}
          </button>
        </div>

        <div className="flex items-start justify-center gap-2 px-2 pt-2 text-center">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground-tertiary" />
          <p className="text-xs leading-snug text-foreground-tertiary">
            Verifique sempre a autenticidade do certificado em{" "}
            <span className="font-bold text-emerald">promptlabz.com/validar</span>
          </p>
        </div>
      </div>

      <AppBottomNav />
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2 text-emerald">
        <span className="flex h-6 w-6 items-center justify-center">{icon}</span>
        <span className="text-sm font-medium text-foreground-secondary">{label}</span>
      </div>
      <div className="max-w-[60%] text-right text-sm font-semibold text-foreground-dark">
        {value}
      </div>
    </div>
  )
}
