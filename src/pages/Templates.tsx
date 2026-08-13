import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
  Bookmark,
  Users,
  Lock,
  Globe,
  BarChart3,
  ClipboardList,
  Calendar,
  Briefcase,
  Settings,
  Lightbulb,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { TEMPLATES, TEMPLATE_CATEGORIES, type Template } from "@/data/templatesData"
import { AppBottomNav } from "@/components/AppBottomNav"

const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  BarChart3,
  ClipboardList,
  Calendar,
  Briefcase,
  Settings,
  Lightbulb,
  TrendingUp,
  Zap,
  Users,
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function MiniPreview({ color }: { color: string }) {
  return (
    <div
      className="relative h-28 w-full overflow-hidden rounded-xl"
      style={{ background: `linear-gradient(135deg, ${color}ee, ${color})` }}
    >
      <div className="absolute inset-0 p-3 opacity-40">
        <div className="mb-2 h-2 w-20 rounded-full bg-white/70" />
        <div className="mb-3 h-1.5 w-28 rounded-full bg-white/50" />
        <div className="flex gap-1.5">
          <div className="flex-1 rounded-lg bg-white/30 p-1.5">
            <div className="mb-1 h-1 rounded-full bg-white/60" />
            <div className="h-4 rounded bg-white/40" />
          </div>
          <div className="flex-1 rounded-lg bg-white/30 p-1.5">
            <div className="mb-1 h-1 rounded-full bg-white/60" />
            <div className="h-4 rounded bg-white/40" />
          </div>
          <div className="flex-1 rounded-lg bg-white/30 p-1.5">
            <div className="mb-1 h-1 rounded-full bg-white/60" />
            <div className="h-4 rounded bg-white/40" />
          </div>
        </div>
        <div className="mt-2 h-1.5 w-16 rounded-full bg-white/50" />
      </div>
    </div>
  )
}

function FeaturedCard({ template, onClick }: { template: Template; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-44 shrink-0 overflow-hidden rounded-2xl transition-all active:scale-95"
      style={{ background: template.previewColor }}
    >
      <MiniPreview color={template.previewColor} />
      <div className="px-3 pb-3 pt-2 text-left">
        <p className="line-clamp-1 text-xs font-bold text-white">{template.name}</p>
        <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-white/70">
          {template.description}
        </p>
        <div className="mt-2">
          {template.isPremium ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/20 px-2 py-0.5 text-[10px] font-semibold text-yellow-300">
              <Lock className="h-2.5 w-2.5" />
              Premium
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
              Grátis
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function PopularCard({ template, onClick }: { template: Template; onClick: () => void }) {
  const Icon = ICON_MAP[template.icon] ?? Lightbulb

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-[#CDEAD8] dark:border-stroke-light bg-white p-4 shadow-sm transition-all active:scale-[0.98] hover:bg-[#F7FCF8] dark:hover:bg-surface-soft text-left"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EF] dark:bg-surface-soft">
        <Icon className="h-5 w-5 text-[#2B5D3A] dark:text-emerald" strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold leading-snug text-[#1F2A24] dark:text-foregroundDark">
          {template.name}
        </p>
        <p className="mt-0.5 line-clamp-1 text-xs text-[#4A5E52] dark:text-foregroundMuted">
          {template.description}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="flex items-center gap-1 text-[10px] text-[#6B9E7E] dark:text-foregroundMuted">
          <Users className="h-3 w-3" />
          <span>{formatCount(template.usageCount)}</span>
        </div>
        {template.isPremium ? (
          <Bookmark className="h-4 w-4 fill-[#2B5D3A] text-[#2B5D3A] dark:fill-emerald dark:text-emerald" />
        ) : (
          <Bookmark className="h-4 w-4 text-[#CDEAD8] dark:text-stroke-light" />
        )}
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-[#6B9E7E] dark:text-foregroundMuted" />
    </button>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-[#6B9E7E] dark:text-foregroundMuted">
      <Search className="h-14 w-14 text-[#CDEAD8] dark:text-stroke-light" />
      <p className="text-base font-semibold">Nenhum template encontrado</p>
      <p className="text-sm opacity-70">Tente ajustar o filtro ou a busca.</p>
    </div>
  )
}

export default function Templates() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState("todos")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return TEMPLATES.filter((t) => {
      const matchCat = activeCategory === "todos" || t.category === activeCategory
      const matchSearch =
        !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [activeCategory, search])

  const featured = useMemo(() => filtered.filter((t) => t.featured), [filtered])
  const popular = useMemo(
    () => [...filtered].sort((a, b) => b.usageCount - a.usageCount),
    [filtered]
  )

  const isSearching = search.trim().length > 0

  return (
    <div className="min-h-screen bg-white dark:bg-pageBg pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-white px-4 pb-3 pt-12 shadow-sm">
        <div className="mb-1 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#2B5D3A] dark:text-emerald transition-colors hover:bg-[#EAF7EF] dark:hover:bg-surface-soft"
              aria-label="Voltar"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-[#1F2A24] dark:text-foregroundDark">
                Templates
              </h1>
              <p className="text-xs text-[#4A5E52] dark:text-foregroundMuted">
                Explore e use templates prontos e otimizados.
              </p>
            </div>
          </div>
          <img
            src="/assets/mascot-login-new.png"
            alt="Mascote"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Search + Filtros */}
        <div className="mt-3 flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-[#BFE3CC] dark:border-stroke-light bg-[#F4F9F5] dark:bg-surface-soft px-4 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-[#6B9E7E] dark:text-foregroundMuted" />
            <input
              type="text"
              placeholder="Buscar templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#1F2A24] dark:text-foregroundDark placeholder:text-[#8A998F] dark:placeholder:text-foregroundPlaceholder focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="rounded-full p-0.5 text-[#6B9E7E] dark:text-foregroundMuted"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button className="flex items-center gap-1.5 rounded-full border border-[#BFE3CC] dark:border-stroke-light bg-white px-3 py-2 text-xs font-semibold text-[#2B5D3A] dark:text-emerald transition-colors hover:bg-[#EAF7EF] dark:hover:bg-surface-soft">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtros
          </button>
        </div>

        {/* Category tabs */}
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex shrink-0 items-center rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === cat.id
                  ? "border-[#2B5D3A] bg-[#2B5D3A] text-white dark:border-emerald dark:bg-emerald dark:text-[#0A1F12]"
                  : "border-[#BFE3CC] dark:border-stroke-light bg-white text-[#2B5D3A] dark:text-emerald hover:bg-[#EAF7EF] dark:hover:bg-surface-soft"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5 px-4 pt-5">
        {/* Banner de assinatura premium oculto temporariamente durante a open beta */}

        {/* Destaques */}
        {featured.length > 0 && !isSearching && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1F2A24] dark:text-foregroundDark">
                Destaques
              </h2>
              <button className="text-xs font-semibold text-[#2B5D3A] dark:text-emerald">
                Ver todos
              </button>
            </div>
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
              {featured.map((t) => (
                <FeaturedCard
                  key={t.id}
                  template={t}
                  onClick={() => navigate(`/template/${t.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mais usados / Resultados */}
        {popular.length > 0 ? (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1F2A24] dark:text-foregroundDark">
                {isSearching ? "Resultados" : "Mais usados"}
              </h2>
              {!isSearching && (
                <button className="text-xs font-semibold text-[#2B5D3A] dark:text-emerald">
                  Ver todos
                </button>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {popular.map((t) => (
                <PopularCard
                  key={t.id}
                  template={t}
                  onClick={() => navigate(`/template/${t.id}`)}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      <AppBottomNav />
    </div>
  )
}
