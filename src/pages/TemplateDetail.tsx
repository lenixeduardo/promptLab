import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Bell,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { AppBottomNav } from "@/components/AppBottomNav"
import { cn } from "@/lib/utils"
import { TEMPLATES, type Template } from "@/data/templatesData"

type Tab = "inicio" | "pagina-web" | "prompt" | "resultado" | "live-preview"

const TABS: { key: Tab; label: string }[] = [
  { key: "inicio", label: "Início" },
  { key: "pagina-web", label: "Página Web" },
  { key: "prompt", label: "Prompt" },
  { key: "resultado", label: "Resultado" },
  { key: "live-preview", label: "Preview" },
]

const STAT_ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  Users,
  BarChart3,
  Zap,
}

function MiniDashboardPreview() {
  return (
    <div className="relative h-24 w-36 overflow-hidden rounded-xl border border-white/30 bg-white/20 p-2 backdrop-blur-sm">
      <div className="mb-1.5 h-2 w-16 rounded-full bg-white/60" />
      <div className="mb-2 h-1.5 w-24 rounded-full bg-white/40" />
      <div className="flex gap-1.5">
        <div className="flex-1 rounded-lg bg-white/30 p-1.5">
          <div className="mb-1 h-1 w-full rounded-full bg-white/60" />
          <div className="h-3 w-full rounded-sm bg-white/40" />
        </div>
        <div className="flex-1 rounded-lg bg-white/30 p-1.5">
          <div className="mb-1 h-1 w-full rounded-full bg-white/60" />
          <div className="h-3 w-full rounded-sm bg-white/40" />
        </div>
      </div>
      <div className="mt-1.5 h-1.5 w-20 rounded-full bg-white/50" />
    </div>
  )
}

function TabContent({ tab, template }: { tab: Tab; template: Template }) {
  if (tab === "pagina-web") {
    return (
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-foregroundMuted">
            Estrutura da Página
          </p>
          {template.webSections.map((section) => (
            <div
              key={section}
              className="flex items-center gap-3 border-b border-stroke-light py-2.5 last:border-0"
            >
              <div className="h-2 w-2 rounded-full bg-primary-dark" />
              <span className="text-sm text-foregroundDark">{section}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (tab === "prompt") {
    return (
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-foregroundMuted">
            Prompt do Template
          </p>
          <div className="rounded-xl bg-[#F5FBF7] p-3">
            <p className="text-xs leading-relaxed text-foregroundDark">{template.promptContent}</p>
          </div>
        </div>
      </div>
    )
  }

  if (tab === "resultado") {
    return (
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-pageBgLight">
            <span className="text-2xl font-extrabold text-primary-dark">
              {template.resultScore}
            </span>
          </div>
          <p className="text-sm font-bold text-foregroundDark">Excelente resultado!</p>
          <p className="mt-1 text-xs text-foregroundMuted">
            Este template gera resultados de alta qualidade consistentemente.
          </p>
        </div>
      </div>
    )
  }

  if (tab === "live-preview") {
    return <LivePreview template={template} />
  }

  // inicio (default)
  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-foregroundMuted">
          Sobre o template
        </p>
        <p className="text-sm leading-relaxed text-foregroundDark">{template.about}</p>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-foregroundMuted">
          Categorias
        </p>
        <div className="flex flex-wrap gap-2">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-stroke-light bg-pageBgLight px-3 py-1 text-xs font-semibold text-primary-dark"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function LivePreview({ template }: { template: Template }) {
  const accent = template.previewColor ?? "#1E3A5F"
  const isPlanner = ["9", "10", "11", "12"].includes(template.id)

  return (
    <div className="px-4 pt-4">
      <div className="rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-foregroundMuted">
          Visualização
        </p>

        {isPlanner ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-16 flex-1 rounded-xl border border-stroke-light bg-pageBgLight p-3">
                <div className="mb-2 h-2 w-24 rounded-full bg-stroke-light" />
                <div className="grid grid-cols-2 gap-2">
                  {template.webSections.slice(0, 4).map((section) => (
                    <div
                      key={section}
                      className="rounded-lg border border-stroke-light bg-white p-2"
                    >
                      <div className="mb-1.5 h-1.5 w-14 rounded-full bg-stroke-light" />
                      <div className="space-y-1">
                        <div className="h-1.5 w-full rounded-full bg-stroke-light/70" />
                        <div className="h-1.5 w-10 rounded-full bg-stroke-light/70" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="h-16 w-16 rounded-xl border border-white/40 p-2 text-[10px] font-bold text-white shadow-sm"
                style={{ background: accent }}
              >
                {template.name}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {template.webSections.slice(4, 7).map((section) => (
                <div
                  key={section}
                  className="rounded-xl border border-stroke-light bg-[#F5FBF7] p-3"
                >
                  <div className="mb-2 h-2 w-20 rounded-full bg-primary-dark/20" />
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full rounded-full bg-stroke-light/80" />
                    <div className="h-1.5 w-full rounded-full bg-stroke-light/80" />
                    <div className="h-1.5 w-8 rounded-full bg-primary-dark/30" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="h-8 flex-1 rounded-full border border-stroke-light bg-pageBgLight" />
              <div className="h-8 w-20 rounded-full bg-primary-dark/90" />
            </div>
          </div>
        ) : (
          <div
            className="rounded-xl border border-stroke-light p-4"
            style={{ background: `${accent}12` }}
          >
            <div className="mb-3 h-2 w-32 rounded-full bg-stroke-light" />
            <div className="mb-4 h-2 w-48 rounded-full bg-stroke-light" />
            <div className="grid grid-cols-2 gap-2">
              {template.webSections.map((section) => (
                <div key={section} className="rounded-lg border border-stroke-light bg-white p-2.5">
                  <div className="mb-1.5 h-1.5 w-16 rounded-full bg-stroke-light" />
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-stroke-light/80" />
                    <div className="h-1.5 w-10 rounded-full bg-stroke-light/70" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-8 flex-1 rounded-full border border-stroke-light bg-pageBgLight" />
              <div className="h-8 w-24 rounded-full bg-primary-dark" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TemplateDetail() {
  const navigate = useNavigate()
  const { templateId } = useParams<{ templateId: string }>()
  const [activeTab, setActiveTab] = useState<Tab>("inicio")

  const template = TEMPLATES.find((t) => t.id === templateId)

  if (!template) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
        <p className="text-lg font-bold text-primary-dark">Template não encontrado</p>
        <p className="text-sm text-foregroundMuted">
          O template que você está tentando acessar não existe ou foi removido.
        </p>
        <button
          onClick={() => navigate("/templates")}
          className="rounded-xl bg-primary-dark dark:bg-emerald-dark px-6 py-3 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-emerald"
        >
          Ver todos os templates
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-32 lg:pb-8">
      {/* Top header */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-pageBgLight bg-white px-4 pt-10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke-muted bg-surface-soft transition-all active:scale-95"
            aria-label="Voltar"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180 text-primary-dark" />
          </button>
          <span className="text-base font-extrabold text-primary-dark">Prompt Lab</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke-muted bg-surface-soft"
            aria-label="Notificações"
          >
            <Bell className="h-4 w-4 text-primary-dark" strokeWidth={1.8} />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald to-primary-dark" />
        </div>
      </div>

      {/* Tabs */}
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-pageBgLight bg-white px-4 pb-0">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors",
              activeTab === key
                ? "border-primary-dark text-primary-dark"
                : "border-transparent text-foregroundMuted hover:text-primary-dark"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-emerald to-[#46996a] px-5 py-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-extrabold leading-tight text-white">{template.headline}</h1>
            <p className="mt-1.5 text-xs leading-relaxed text-white/80">{template.subheadline}</p>
            {/* Stats */}
            <div className="mt-4 flex gap-4">
              {template.stats.map(({ icon, value, label }) => {
                const StatIcon = STAT_ICON_MAP[icon] ?? TrendingUp
                return (
                  <div key={label} className="flex items-center gap-1.5">
                    <StatIcon className="h-4 w-4 text-white/70" strokeWidth={1.8} />
                    <div>
                      <span className="text-sm font-extrabold text-white">{value}</span>
                      <span className="ml-1 text-xs text-white/70">{label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <MiniDashboardPreview />
        </div>
      </div>

      {/* Tab content */}
      <TabContent tab={activeTab} template={template} />

      {/* Fixed bottom actions */}
      <div className="fixed bottom-[72px] left-0 right-0 z-30 border-t border-pageBgLight bg-white px-4 py-3">
        <div className="mx-auto flex max-w-[460px] gap-3">
          <button
            onClick={() => setActiveTab("live-preview")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary-dark py-3 text-sm font-semibold text-primary-dark transition-all active:scale-95 hover:bg-pageBgLight"
          >
            <ExternalLink className="h-4 w-4" />
            Visualizar ao vivo
          </button>
          <button
            onClick={() => navigate(`/prompt/${template.promptId}`)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-dark dark:bg-emerald-dark py-3 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-emerald"
          >
            Usar este template
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AppBottomNav />
    </div>
  )
}
