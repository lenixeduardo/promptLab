import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { sileo } from "sileo"
import * as Icons from "@/lib/icons"
import { useTrendingSkills } from "@/hooks/useTrendingSkills"
import { usePrompts } from "@/hooks/usePrompts"
import { TEMPLATES } from "@/data/templatesData"
import { SkillIcon } from "@/components/skills/shared"
import { AppBottomNav } from "@/components/AppBottomNav"
import { slugifyTitle } from "@/lib/utils"

type LabTab = "skills" | "prompts" | "templates"
type FilterMode = "todas" | "recomendadas" | "mais-usadas"

const TABS: { key: LabTab; label: string }[] = [
  { key: "skills", label: "Skills" },
  { key: "prompts", label: "Prompts" },
  { key: "templates", label: "Templates" },
]

const HEADER_INFO: Record<LabTab, { title: string; subtitle: string }> = {
  skills: { title: "Laboratório de Skills", subtitle: "80+ skills reais para potencializar sua IA" },
  prompts: { title: "Laboratório de Prompts", subtitle: "Copie, adapte e use prompts da comunidade" },
  templates: { title: "Laboratório de Templates", subtitle: "Estruturas prontas para você partir na frente" },
}

const FILTER_PILLS: { key: FilterMode; label: string; icon: string }[] = [
  { key: "todas", label: "Todas", icon: "LayoutGrid" },
  { key: "recomendadas", label: "Recomendadas", icon: "Star" },
  { key: "mais-usadas", label: "Mais usadas", icon: "Flame" },
]

const PROMPT_ICONS: Record<string, keyof typeof Icons> = {
  Marketing: "Megaphone",
  Criatividade: "Lightbulb",
  Programacao: "Code2",
  Educacao: "BookOpen",
  Produtividade: "Zap",
  "Gestao de Produto": "ClipboardList",
  Comunicacao: "MessageSquare",
  Analise: "BarChart3",
  Automacao: "Settings",
}

const PROMPT_USAGE: Record<string, string> = {
  Marketing: "2.4k",
  Criatividade: "3.2k",
  Programacao: "1.9k",
  Educacao: "1.8k",
  Produtividade: "2.1k",
  "Gestao de Produto": "1.5k",
  Comunicacao: "2.0k",
  Analise: "1.3k",
  Automacao: "1.7k",
}

const TEMPLATE_CATEGORY_LABELS: Record<string, string> = {
  "Paginas Web": "Páginas Web",
  Dashboards: "Dashboards",
  Relatorios: "Relatórios",
  Planilhas: "Planilhas",
  Apresentacoes: "Apresentações",
}

// ─── Browser Preview ─────────────────────────────────────────────────────────
function BrowserPreview({ color }: { color: string }) {
  return (
    <div className="overflow-hidden bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center gap-1.5 bg-gray-200 dark:bg-gray-700 px-3 py-2">
        <div className="h-2 w-2 rounded-full bg-red-400" />
        <div className="h-2 w-2 rounded-full bg-yellow-400" />
        <div className="h-2 w-2 rounded-full bg-green-400" />
        <div className="ml-2 flex-1 rounded bg-white/50 dark:bg-white/10 px-2 py-0.5 text-[8px] text-gray-500 dark:text-gray-400">
          promptlabz.ai
        </div>
      </div>
      <div
        className="relative h-44"
        style={{ background: `linear-gradient(135deg, ${color}dd, ${color})` }}
      >
        <div className="absolute inset-0 flex flex-col gap-2 p-5 opacity-70">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-2 w-2 rounded-full bg-white/80" />
            <div className="h-1.5 w-16 rounded-full bg-white/70" />
            <div className="ml-auto flex gap-3">
              <div className="h-1.5 w-8 rounded-full bg-white/50" />
              <div className="h-1.5 w-8 rounded-full bg-white/50" />
              <div className="h-1.5 w-8 rounded-full bg-white/50" />
            </div>
          </div>
          <div className="mt-1">
            <div className="mb-2 h-4 w-3/5 rounded-full bg-white/80" />
            <div className="mb-4 h-2 w-2/5 rounded-full bg-white/50" />
            <div className="h-8 w-28 rounded-lg bg-white/90" />
          </div>
          <div className="mt-auto flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 rounded-xl bg-white/20 p-2.5">
                <div className="mb-1.5 h-1.5 rounded-full bg-white/60" />
                <div className="h-5 rounded-lg bg-white/30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Skills Tab ──────────────────────────────────────────────────────────────
function SkillsTab() {
  const navigate = useNavigate()
  const { skills, error: skillsError } = useTrendingSkills()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterMode>("todas")

  useEffect(() => {
    if (skillsError) {
      sileo.error({ title: `Erro ao carregar skills: ${skillsError}` })
    }
  }, [skillsError])

  const superpowers = useMemo(
    () => [...skills].sort((a, b) => b.installsCount - a.installsCount).slice(0, 6),
    [skills]
  )

  const filtered = useMemo(() => {
    const base =
      filter === "recomendadas"
        ? superpowers
        : filter === "mais-usadas"
          ? [...skills].sort((a, b) => b.installsCount - a.installsCount)
          : skills
    if (!search.trim()) return base
    const q = search.toLowerCase()
    return base.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    )
  }, [skills, search, filter, superpowers])

  return (
    <div>
      {/* Search */}
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-stroke-light bg-white px-4 py-3 dark:border-stroke-muted dark:bg-surface-soft">
        <Icons.Search className="h-4 w-4 shrink-0 text-foregroundMuted" />
        <input
          type="text"
          placeholder="Buscar skills..."
          aria-label="Buscar skills"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foregroundDark placeholder:text-foregroundPlaceholder focus:outline-none dark:text-white"
        />
        {search && (
          <button onClick={() => setSearch("")} aria-label="Limpar busca">
            <Icons.X className="h-3.5 w-3.5 text-foregroundMuted" />
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
        {FILTER_PILLS.map(({ key, label, icon }) => {
          const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[icon]
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === key
                  ? "bg-emerald text-white"
                  : "border border-stroke-light bg-white text-foregroundMuted dark:border-stroke-muted dark:bg-surface-soft"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          )
        })}
      </div>

      {/* Superpowers featured section */}
      {filter === "todas" && !search.trim() && superpowers.length > 0 && (
        <div className="mb-5 rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 p-4 dark:border-yellow-900/40 dark:from-[#1E2D0F] dark:to-[#1A2A0E]">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400">
                <Icons.Star className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="text-sm font-bold text-foregroundDark dark:text-white">
                Recomendadas — Superpowers
              </span>
            </div>
          </div>
          <p className="mb-3 text-xs text-foregroundMuted">Skills curadas com instalação 1-clique</p>
          <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
            {superpowers.map(skill => (
              <button
                key={skill.name}
                onClick={() => navigate(`/skill/${encodeURIComponent(skill.name)}`, { state: { skill } })}
                className="w-36 shrink-0 rounded-xl border border-yellow-200 bg-white p-3 text-left transition-all active:scale-95 dark:border-yellow-900/40 dark:bg-[#1A2E1F]"
              >
                <div className="mb-2 flex items-start justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pageBgLight dark:bg-[#243B29]">
                    <SkillIcon iconName={skill.icon} />
                  </span>
                  <span className="rounded-full bg-emerald/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald dark:bg-emerald/20">
                    SUPER
                  </span>
                </div>
                <p className="mb-1 line-clamp-2 text-[11px] font-bold leading-snug text-foregroundDark dark:text-white">
                  {skill.name}
                </p>
                <p className="text-[10px] font-semibold text-emerald">{skill.installs} instalações</p>
                <p className="text-[9px] text-foregroundMuted">por {skill.author}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Count */}
      <p className="mb-3 text-xs font-medium text-foregroundMuted">
        {filtered.length} skills encontradas
      </p>

      {/* Skills list */}
      {filtered.length === 0 && search.trim() && (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Icons.Search className="h-8 w-8 text-foregroundMuted" />
          <p className="text-sm font-semibold text-foregroundDark dark:text-white">Nenhuma skill encontrada</p>
          <p className="text-xs text-foregroundMuted">Tente um termo diferente</p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 pb-4">
        {filtered.map(skill => (
          <button
            key={skill.name}
            onClick={() => navigate(`/skill/${encodeURIComponent(skill.name)}`, { state: { skill } })}
            className="flex w-full items-center gap-3 rounded-2xl border border-stroke-muted bg-white px-4 py-3.5 text-left shadow-sm transition-all active:scale-[0.99] dark:border-stroke-light dark:bg-[#1A2E1F]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pageBgLight dark:bg-[#243B29]">
              <SkillIcon iconName={skill.icon} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foregroundDark dark:text-white">{skill.name}</p>
              <p className="text-[11px] text-foregroundMuted">
                {skill.category} · {skill.installs} instalações
              </p>
            </div>
            <Icons.ChevronRight className="h-4 w-4 shrink-0 text-foregroundMuted" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Prompts Tab ─────────────────────────────────────────────────────────────
function PromptsTab() {
  const navigate = useNavigate()
  const { prompts, error: promptsError } = usePrompts()
  const [search, setSearch] = useState("")
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null)

  useEffect(() => {
    if (promptsError) {
      sileo.error({ title: `Erro ao carregar prompts: ${promptsError}` })
    }
  }, [promptsError])

  const filtered = useMemo(() => {
    if (!search.trim()) return prompts
    const q = search.toLowerCase()
    return prompts.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }, [prompts, search])

  const handleCopy = (text: string, title: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedTitle(title)
        setTimeout(() => setCopiedTitle(null), 2000)
      })
      .catch(() => {
        // Clipboard permission denied or unavailable — nothing to recover from here.
      })
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-stroke-light bg-white px-4 py-3 dark:border-stroke-muted dark:bg-surface-soft">
        <Icons.Search className="h-4 w-4 shrink-0 text-foregroundMuted" />
        <input
          type="text"
          placeholder="Buscar prompts..."
          aria-label="Buscar prompts"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foregroundDark placeholder:text-foregroundPlaceholder focus:outline-none dark:text-white"
        />
        {search && (
          <button onClick={() => setSearch("")} aria-label="Limpar busca">
            <Icons.X className="h-3.5 w-3.5 text-foregroundMuted" />
          </button>
        )}
      </div>

      {/* Laboratório de Avaliação card */}
      <button
        onClick={() => navigate("/prompt-lab")}
        className="mb-5 flex w-full items-center gap-3 rounded-2xl border border-emerald/30 bg-[#0D1B12] p-4 text-left transition-all active:scale-[0.99]"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald/20">
          <Icons.Zap className="h-5 w-5 text-emerald" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">Laboratório de Avaliação</p>
          <p className="mt-0.5 text-xs text-gray-400">Escreva um prompt e receba nota da gatinha</p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald">
          <Icons.ArrowRight className="h-4 w-4 text-white" />
        </div>
      </button>

      {/* Count */}
      <p className="mb-3 text-xs font-medium text-foregroundMuted">
        {filtered.length} prompts encontrados
      </p>

      {/* Prompt cards */}
      {filtered.length === 0 && search.trim() && (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Icons.Search className="h-8 w-8 text-foregroundMuted" />
          <p className="text-sm font-semibold text-foregroundDark dark:text-white">Nenhum prompt encontrado</p>
          <p className="text-xs text-foregroundMuted">Tente um termo diferente</p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pb-4">
        {filtered.map((prompt, idx) => {
          const iconKey = PROMPT_ICONS[prompt.category] ?? "Lightbulb"
          const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconKey]
          const usage = PROMPT_USAGE[prompt.category] ?? "1k"
          const isCopied = copiedTitle === prompt.title

          return (
            <div
              key={idx}
              className="rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm dark:border-stroke-light dark:bg-[#1A2E1F]"
            >
              <div className="mb-3 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald/10">
                  <Icon className="h-5 w-5 text-emerald" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foregroundDark dark:text-white">{prompt.title}</p>
                  <p className="mt-0.5 text-[11px] text-foregroundMuted">
                    {prompt.category} · {usage} usos
                  </p>
                </div>
                <button className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-red-50 dark:hover:bg-red-950/30">
                  <Icons.Heart className="h-4 w-4 text-foregroundMuted" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    navigate(`/prompt/${slugifyTitle(prompt.title)}`, {
                      state: {
                        title: prompt.title,
                        category: prompt.category,
                        promptText: prompt.promptText,
                      },
                    })
                  }
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald py-2.5 text-sm font-semibold text-white transition-colors active:scale-95 hover:bg-emerald/90"
                >
                  <Icons.Eye className="h-4 w-4" />
                  Abrir
                </button>
                <button
                  onClick={() => handleCopy(prompt.promptText, prompt.title)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stroke-light transition-colors active:scale-95 hover:bg-surface-soft dark:border-stroke-muted"
                >
                  {isCopied ? (
                    <Icons.Check className="h-4 w-4 text-emerald" />
                  ) : (
                    <Icons.FileStack className="h-4 w-4 text-foregroundMuted" />
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Templates Tab ────────────────────────────────────────────────────────────
function TemplatesTab() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterMode>("todas")

  const filtered = useMemo(() => {
    const base =
      filter === "recomendadas"
        ? TEMPLATES.filter(t => t.featured)
        : filter === "mais-usadas"
          ? [...TEMPLATES].sort((a, b) => b.usageCount - a.usageCount)
          : TEMPLATES
    if (!search.trim()) return base
    const q = search.toLowerCase()
    return base.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    )
  }, [search, filter])

  return (
    <div>
      {/* Search */}
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-stroke-light bg-white px-4 py-3 dark:border-stroke-muted dark:bg-surface-soft">
        <Icons.Search className="h-4 w-4 shrink-0 text-foregroundMuted" />
        <input
          type="text"
          placeholder="Buscar templates..."
          aria-label="Buscar templates"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foregroundDark placeholder:text-foregroundPlaceholder focus:outline-none dark:text-white"
        />
        {search && (
          <button onClick={() => setSearch("")} aria-label="Limpar busca">
            <Icons.X className="h-3.5 w-3.5 text-foregroundMuted" />
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
        {FILTER_PILLS.map(({ key, label, icon }) => {
          const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[icon]
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === key
                  ? "bg-emerald text-white"
                  : "border border-stroke-light bg-white text-foregroundMuted dark:border-stroke-muted dark:bg-surface-soft"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          )
        })}
      </div>

      {/* Count */}
      <p className="mb-3 text-xs font-medium text-foregroundMuted">
        {filtered.length} templates disponíveis
      </p>

      {/* Template cards */}
      {filtered.length === 0 && search.trim() && (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Icons.Search className="h-8 w-8 text-foregroundMuted" />
          <p className="text-sm font-semibold text-foregroundDark dark:text-white">Nenhum template encontrado</p>
          <p className="text-xs text-foregroundMuted">Tente um termo diferente</p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
        {filtered.map(template => (
          <div
            key={template.id}
            className="overflow-hidden rounded-2xl border border-stroke-muted bg-white shadow-sm dark:border-stroke-light dark:bg-[#1A2E1F]"
          >
            {/* Preview image */}
            <div className="relative">
              <BrowserPreview color={template.previewColor} />
              <span className="absolute right-2 top-9 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                {template.webSections.length} blocos
              </span>
            </div>

            {/* Card info */}
            <div className="p-4">
              <p className="text-sm font-bold text-foregroundDark dark:text-white">{template.name}</p>
              <p className="mt-0.5 text-xs text-foregroundMuted">
                {TEMPLATE_CATEGORY_LABELS[template.category] ?? template.category}
              </p>
              <button
                onClick={() => navigate(`/template/${template.id}`)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald py-2.5 text-sm font-semibold text-white transition-colors active:scale-95 hover:bg-emerald/90"
              >
                <Icons.Eye className="h-4 w-4" />
                Abrir template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Lab Page ────────────────────────────────────────────────────────────
export default function Lab() {
  const [activeTab, setActiveTab] = useState<LabTab>("skills")
  const { title, subtitle } = HEADER_INFO[activeTab]

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-8 dark:bg-pageBg">
      {/* Sticky header + tabs */}
      <div className="sticky top-0 z-10 bg-white px-4 lg:px-8 pb-0 pt-6 lg:pt-8 dark:bg-pageBg">
        <div className="lg:max-w-5xl lg:mx-auto">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-foregroundDark dark:text-white">{title}</h1>
          <p className="mt-0.5 text-sm lg:text-base text-[#3E6B50] dark:text-foregroundMuted">{subtitle}</p>

          <div role="tablist" className="mt-4 flex gap-6">
            {TABS.map(tab => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm font-semibold transition-colors ${
                  activeTab === tab.key
                    ? "border-b-2 border-emerald text-emerald"
                    : "text-foregroundMuted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-px bg-stroke-muted" />
      </div>

      {/* Tab content */}
      <div className="px-4 lg:px-8 pt-4 lg:max-w-5xl lg:mx-auto">
        {activeTab === "skills" && <SkillsTab />}
        {activeTab === "prompts" && <PromptsTab />}
        {activeTab === "templates" && <TemplatesTab />}
      </div>

      <AppBottomNav />
    </div>
  )
}
