import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Lightbulb,
  BookOpen,
  Zap,
  Eye,
  Brain,
  ListChecks,
  User,
  Workflow,
  RefreshCw,
  PenLine,
  Target,
  TrendingUp,
  MessageSquare,
  BarChart3,
  Database,
  LineChart,
  type LucideIcon,
} from "lucide-react"
import { TRAIL_CATEGORY_SKILLS, type SkillDifficulty } from "@/data/trailCategorySkillsData"
import { AppBottomNav } from "@/components/AppBottomNav"

type DiffFilter = "Todas" | SkillDifficulty

const DIFF_TABS: DiffFilter[] = ["Todas", "Iniciante", "Intermediario", "Avancado"]
const DIFF_LABELS: Record<DiffFilter, string> = {
  Todas: "Todas",
  Iniciante: "Iniciante",
  Intermediario: "Intermediário",
  Avancado: "Avançado",
}

const LEVEL_BADGE: Record<number, { bg: string; text: string }> = {
  1: { bg: "bg-pageBgLight", text: "text-primary-dark" },
  2: { bg: "bg-pageBgLight", text: "text-primary-dark" },
  3: { bg: "bg-[#FFF7ED]", text: "text-amber-800" },
  4: { bg: "bg-[#FEF2F2]", text: "text-red" },
}

const ICON_MAP: Record<string, LucideIcon> = {
  Lightbulb,
  BookOpen,
  Zap,
  Eye,
  Brain,
  Star,
  ListChecks,
  User,
  Workflow,
  RefreshCw,
  PenLine,
  Target,
  TrendingUp,
  MessageSquare,
  BarChart3,
  Database,
  LineChart,
}

export default function SkillCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const [activeDiff, setActiveDiff] = useState<DiffFilter>("Todas")

  const catData = TRAIL_CATEGORY_SKILLS.find((c) => c.categoryId === categoryId)

  const filtered = useMemo(() => {
    if (!catData) return []
    if (activeDiff === "Todas") return catData.skills
    return catData.skills.filter((s) => s.difficulty === activeDiff)
  }, [catData, activeDiff])

  if (!catData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white text-foregroundMuted">
        <p className="text-base font-semibold">Categoria não encontrada</p>
        <button onClick={() => navigate(-1)} className="text-sm font-semibold text-primary-dark">
          Voltar
        </button>
      </div>
    )
  }

  const CategoryIcon = ICON_MAP[catData.icon] ?? Lightbulb

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-white px-4 pb-4 pt-12 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-primary-dark transition-colors hover:bg-pageBgLight"
              aria-label="Voltar"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-extrabold text-foregroundDark">{catData.label}</h1>
              <p className="text-xs text-foregroundMuted">
                {catData.skills.length} skills disponíveis
              </p>
            </div>
          </div>

          {/* Hexagonal icon */}
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3CD]"
            style={{ clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)" }}
          >
            <CategoryIcon className="h-7 w-7 text-amber-600" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Difficulty filter tabs */}
        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
          {DIFF_TABS.map((d) => (
            <button
              key={d}
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

        {/* Skill list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-foregroundMuted">
            <Star className="h-14 w-14 text-stroke-muted" />
            <p className="text-base font-semibold">Nenhuma skill encontrada</p>
            <p className="text-sm opacity-70">Tente outro filtro de dificuldade.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((skill) => {
              const SkillIcon = ICON_MAP[skill.icon] ?? Lightbulb
              const badge = LEVEL_BADGE[skill.level] ?? LEVEL_BADGE[1]
              return (
                <div
                  key={skill.id}
                  className="flex items-center gap-3 rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pageBgLight">
                    <SkillIcon className="h-6 w-6 text-primary-dark" strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foregroundDark">{skill.name}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-foregroundMuted">
                      {skill.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text}`}
                    >
                      Nível {skill.level}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-600">
                      <Star className="h-3 w-3 fill-amber-600 text-amber-600" />
                      {skill.xp} XP
                    </span>
                  </div>

                  <ChevronRight className="h-4 w-4 shrink-0 text-foregroundMuted" />
                </div>
              )
            })}
          </div>
        )}
      </div>

      <AppBottomNav />
    </div>
  )
}
