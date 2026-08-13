import { Check, Sparkles, Clock, Rocket } from "lucide-react"
import { AppBottomNav } from "@/components/AppBottomNav"
import { AppPageHeader } from "@/components/AppPageHeader"

type Status = "done" | "now" | "next" | "future"

const PHASES: { status: Status; title: string; tag: string; items: string[] }[] = [
  {
    status: "done",
    title: "MVP Visual",
    tag: "Concluído",
    items: ["Identidade Kawaii", "Onboarding", "Laboratório de Prompts"],
  },
  {
    status: "done",
    title: "Motor de Gamificação",
    tag: "Concluído",
    items: ["Avatar dinâmico", "Autenticação", "Sistema de XP e níveis"],
  },
  {
    status: "done",
    title: "v0.3 — Sistema de Templates",
    tag: "Concluído",
    items: [
      "Rotas dinâmicas de templates",
      "Tabelas template_categories & templates",
      "Salvamento de favoritos",
    ],
  },
  {
    status: "done",
    title: "v0.4 — Comunidade",
    tag: "Concluído",
    items: ["Expansão do Hall da Fama", "Feed colaborativo de prompts", "Grupos por interesse"],
  },
  {
    status: "done",
    title: "v0.5 — Premium & Certificados",
    tag: "Concluído",
    items: ["Planos Premium", "Emissão de certificados em PDF", "Templates exclusivos Premium"],
  },
  {
    status: "now",
    title: "v0.6 — Refino & Estabilidade",
    tag: "Em andamento",
    items: [
      "Ajustes finos de UI mobile",
      "Reconhecimento de Premium em todas as áreas",
      "Roadmap público atualizado",
    ],
  },
  {
    status: "next",
    title: "Pendente — Prompt Wars",
    tag: "Pendente",
    items: ["Arena 1v1 de prompts", "Matchmaking e ranking ao vivo", "Recompensas de temporada"],
  },
  {
    status: "future",
    title: "Futuro",
    tag: "Em ideação",
    items: ["Novas mecânicas interativas", "Modo cooperativo no Lab", "Marketplace de templates"],
  },
]

const STATUS_STYLE: Record<Status, { dot: string; chip: string; icon: typeof Check }> = {
  done: { dot: "bg-emerald", chip: "bg-surface-success text-emerald", icon: Check },
  now: { dot: "bg-luxury", chip: "bg-luxury/20 text-luxury", icon: Sparkles },
  next: { dot: "bg-emerald/40", chip: "bg-surface-soft text-forest", icon: Clock },
  future: {
    dot: "bg-stroke-light",
    chip: "bg-surface-soft text-foreground-tertiary",
    icon: Rocket,
  },
}

export default function RoadmapPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white pb-24 lg:pb-8">
      <AppPageHeader title="Roadmap" subtitle="O futuro do Laboratório" back="/profile" />

      <div className="mx-auto w-full max-w-lg lg:max-w-2xl px-4 py-5">
        <ol className="relative space-y-5 border-l-2 border-stroke-light pl-6">
          {PHASES.map((p) => {
            const s = STATUS_STYLE[p.status]
            const Icon = s.icon
            return (
              <li key={p.title} className="relative">
                <span
                  className={`absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full border-4 border-page-bg-light text-white ${s.dot}`}
                >
                  <Icon className="h-3 w-3" strokeWidth={3} />
                </span>
                <div className="rounded-2xl border-2 border-stroke-light bg-card p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-extrabold text-foreground-dark">{p.title}</h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${s.chip}`}
                    >
                      {p.tag}
                    </span>
                  </div>
                  <ul className="space-y-1 text-xs text-foreground-secondary">
                    {p.items.map((i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      <AppBottomNav />
    </div>
  )
}
