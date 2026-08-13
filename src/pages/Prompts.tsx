import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowRight,
  Briefcase,
  Search,
  X,
  Lightbulb,
  Megaphone,
  Code2,
  Apple,
  ClipboardList,
  BarChart3,
  MessageSquare,
  Settings,
  Palette,
  Headphones,
  Users,
  type LucideIcon,
} from "lucide-react"
import { sileo } from "sileo"
import { type LabCategory } from "@/data/labCategoriesData"
import { useLabCategories } from "@/hooks/useLabCategories"
import { AppBottomNav } from "@/components/AppBottomNav"

type DiffFilter = "Todos" | "Iniciante" | "Intermediario" | "Avancado"

const DIFF_TABS: DiffFilter[] = ["Todos", "Iniciante", "Intermediario", "Avancado"]
const DIFF_LABELS: Record<DiffFilter, string> = {
  Todos: "Todos",
  Iniciante: "Iniciante",
  Intermediario: "Intermediário",
  Avancado: "Avançado",
}

const ICON_MAP: Record<string, LucideIcon> = {
  Lightbulb,
  Megaphone,
  Code2,
  Apple,
  ClipboardList,
  BarChart3,
  MessageSquare,
  Settings,
  Briefcase,
  Palette,
  Headphones,
  Users,
}

function CategoryCard({ cat, onClick }: { cat: LabCategory; onClick: () => void }) {
  const Icon = ICON_MAP[cat.icon] ?? Lightbulb
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-2xl border border-stroke-muted bg-white p-3 text-center shadow-sm transition-all active:scale-95 hover:bg-surface-soft"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pageBgLight">
        <Icon className="h-5 w-5 text-primary-dark" strokeWidth={1.8} />
      </div>
      <p className="text-[10px] font-semibold leading-tight text-foregroundDark">{cat.label}</p>
      <p className="text-[9px] text-foregroundMuted">{cat.promptCount} prompts</p>
    </button>
  )
}

export default function Prompts() {
  const navigate = useNavigate()
  const [activeDiff, setActiveDiff] = useState<DiffFilter>("Todos")
  const [search, setSearch] = useState("")
  const { categories, promptOfTheDay, error } = useLabCategories()

  useEffect(() => {
    if (error) {
      sileo.error({ title: `Erro ao carregar categorias: ${error}` })
    }
  }, [error])

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return categories
    return categories.filter((cat) => cat.label.toLowerCase().includes(q))
  }, [categories, search])

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-8">
      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#C8EDD8] via-[#D5F0E2] to-pageBgLight px-5 pb-6 pt-12">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold leading-tight text-foregroundDark">
              Laboratório de
              <br />
              Prompts
            </h1>
            <p className="mt-1.5 text-sm text-[#3E6B50]">
              Experimente, aprimore e domine a arte
              <br />
              de criar prompts incríveis.
            </p>
          </div>
          <img
            src="/assets/mascot-login-new.png"
            alt="Mascote"
            className="h-28 w-auto object-contain"
          />
        </div>
      </div>

      <div className="px-4 pt-4 lg:max-w-5xl lg:mx-auto">
        {/* Busca de categorias */}
        <div className="mb-4 flex items-center gap-2 rounded-full border border-stroke-light bg-surface-soft px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-foregroundMuted" />
          <input
            type="text"
            placeholder="Buscar categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar categoria de prompts"
            className="flex-1 bg-transparent text-sm text-foregroundDark placeholder:text-foregroundPlaceholder focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Limpar busca"
              className="rounded-full p-0.5 text-foregroundMuted"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Difficulty filter tabs */}
        <div role="tablist" className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
          {DIFF_TABS.map((d) => (
            <button
              key={d}
              role="tab"
              aria-selected={activeDiff === d}
              onClick={() => setActiveDiff(d)}
              className={`inline-flex shrink-0 items-center rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeDiff === d
                  ? "border-primary-dark bg-primary-dark text-white"
                  : "border-stroke-light bg-white text-primary-dark hover:bg-pageBgLight"
              }`}
            >
              {DIFF_LABELS[d]}
            </button>
          ))}
        </div>

        {/* Categories section */}
        <h2 className="mb-3 text-base font-bold text-foregroundDark">Categorias</h2>
        {filteredCategories.length === 0 ? (
          <p className="mb-6 py-6 text-center text-sm text-foregroundMuted">
            Nenhuma categoria encontrada para "{search}".
          </p>
        ) : (
          <div className="mb-6 grid grid-cols-4 lg:grid-cols-6 gap-2.5">
            {filteredCategories.map((cat) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                onClick={() => navigate(`/prompts/category/${cat.id}`)}
              />
            ))}
          </div>
        )}

        {/* Em destaque */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-bold text-foregroundDark">Em destaque</h2>
          <button
            onClick={() => navigate("/prompts/category/Criatividade")}
            className="text-xs font-semibold text-primary-dark"
          >
            Ver todos &gt;
          </button>
        </div>

        <div className="rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-foregroundMuted">
            Prompt do Dia
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-pageBgLight">
              <Briefcase className="h-8 w-8 text-primary-dark" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foregroundDark">{promptOfTheDay?.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-foregroundSecondary">
                {promptOfTheDay?.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/prompts/category/${promptOfTheDay?.categoryId}`)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-dark py-3 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-emerald"
          >
            Usar prompt
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AppBottomNav />
    </div>
  )
}
