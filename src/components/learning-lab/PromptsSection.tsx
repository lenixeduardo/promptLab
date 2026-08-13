import { memo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowRight,
  Briefcase,
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
  FlaskConical,
  type LucideIcon,
} from "lucide-react"
import { useLabCategories } from "@/hooks/useLabCategories"
import type { LabCategory } from "@/data/labCategoriesData"

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

const CategoryCard = memo(function CategoryCard({ cat }: { cat: LabCategory }) {
  const navigate = useNavigate()
  const Icon = ICON_MAP[cat.icon] ?? Lightbulb
  return (
    <button
      onClick={() => navigate(`/prompts/category/${cat.id}`)}
      className="flex flex-col items-center gap-1.5 rounded-2xl border border-stroke-muted bg-white p-3 text-center shadow-sm transition-all active:scale-95 hover:bg-surface-soft"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pageBgLight">
        <Icon className="h-5 w-5 text-primary-dark" strokeWidth={1.8} />
      </div>
      <p className="text-[10px] font-semibold leading-tight text-foregroundDark">{cat.label}</p>
      <p className="text-[9px] text-foregroundMuted">{cat.promptCount} prompts</p>
    </button>
  )
})

export default function PromptsSection() {
  const navigate = useNavigate()
  const { categories, promptOfTheDay } = useLabCategories()

  const handleViewAll = useCallback(() => navigate("/prompts"), [navigate])
  const handleUsePrompt = useCallback(
    () => navigate(`/prompts/category/${promptOfTheDay?.categoryId}`),
    [navigate, promptOfTheDay?.categoryId]
  )

  return (
    <div className="px-4 pt-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-foregroundDark">
        <FlaskConical className="h-5 w-5 shrink-0 text-primary-dark" strokeWidth={2} />
        Laboratório de Prompts
      </h2>

      {/* Categories */}
      <div className="mb-5 grid grid-cols-4 gap-2.5">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}
      </div>

      {/* Em destaque — Prompt of the Day */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foregroundDark">Em destaque</h3>
        <button onClick={handleViewAll} className="text-xs font-semibold text-primary-dark">
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
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foregroundDark">{promptOfTheDay?.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-foregroundSecondary">
              {promptOfTheDay?.description}
            </p>
          </div>
        </div>
        <button
          onClick={handleUsePrompt}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-dark py-3 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-emerald"
        >
          Usar prompt
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
