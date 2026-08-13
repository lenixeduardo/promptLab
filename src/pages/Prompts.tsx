import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  ArrowRight, Briefcase,
  Lightbulb, Megaphone, Code2, Apple, ClipboardList, BarChart3,
  MessageSquare, Settings, Palette, Headphones, Users,
  type LucideIcon,
} from "lucide-react"
import { sileo } from "sileo"
import { type LabCategory } from "@/data/labCategoriesData"
import { useLabCategories } from "@/hooks/useLabCategories"
import { AppBottomNav } from "@/components/AppBottomNav"
import { PageSEO } from "@/components/PageSEO"
import { useAuthContext } from "@/contexts/AuthContext"

type DiffFilter = "Todos" | "Iniciante" | "Intermediario" | "Avancado"

const DIFF_TABS: DiffFilter[] = ["Todos", "Iniciante", "Intermediario", "Avancado"]
const DIFF_LABELS: Record<DiffFilter, string> = {
  Todos: "Todos",
  Iniciante: "Iniciante",
  Intermediario: "Intermediário",
  Avancado: "Avançado",
}

const ICON_MAP: Record<string, LucideIcon> = {
  Lightbulb, Megaphone, Code2, Apple, ClipboardList, BarChart3,
  MessageSquare, Settings, Briefcase, Palette, Headphones, Users,
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
  const { user } = useAuthContext()
  const [activeDiff, setActiveDiff] = useState<DiffFilter>("Todos")
  const { categories, promptOfTheDay, loading, error } = useLabCategories()

  useEffect(() => {
    if (error) {
      sileo.error({ title: `Erro ao carregar categorias: ${error}` })
    }
  }, [error])

  const goToCategory = (categoryId: string) => {
    if (!user) {
      navigate("/signup")
      return
    }
    navigate(`/prompts/category/${categoryId}`)
  }

  return (
    <div className="min-h-dvh bg-white pb-24 lg:pb-8">
      <PageSEO
        title="Laboratório de Prompts — Prompts para ChatGPT, Claude e Gemini"
        description="Explore categorias e prompts prontos para ChatGPT, Claude e Gemini no Laboratório de Prompts do PromptLabz. Crie uma conta grátis para usar todos os prompts."
        canonicalPath="/prompts"
      />
      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#C8EDD8] via-[#D5F0E2] to-pageBgLight px-5 pb-6 pt-12">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold leading-tight text-foregroundDark">
              Laboratório de<br />Prompts
            </h1>
            <p className="mt-1.5 text-sm text-[#3E6B50]">
              Experimente, aprimore e domine a arte<br />de criar prompts incríveis.
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
        <div className="mb-6 grid grid-cols-4 lg:grid-cols-6 gap-2.5">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              onClick={() => goToCategory(cat.id)}
            />
          ))}
        </div>

        {/* Em destaque */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-bold text-foregroundDark">Em destaque</h2>
          <button
            onClick={() => goToCategory("Criatividade")}
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
            onClick={() => promptOfTheDay?.categoryId && goToCategory(promptOfTheDay.categoryId)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-dark py-3 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-emerald"
          >
            Usar prompt
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {!user && (
          <div className="mb-8 mt-6 rounded-2xl border border-stroke-muted bg-pageBgLight p-4 text-center">
            <p className="text-sm font-semibold text-foregroundDark">
              Crie uma conta grátis para usar todos os prompts
            </p>
            <Link
              to="/signup"
              className="mt-3 inline-flex h-11 items-center justify-center rounded-full bg-primary-dark px-6 text-sm font-bold text-white hover:bg-emerald"
            >
              Começar grátis
            </Link>
          </div>
        )}
      </div>

      {user && <AppBottomNav />}
    </div>
  )
}
