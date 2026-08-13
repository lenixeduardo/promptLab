import { useMemo, useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { sileo } from "sileo"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
  Bookmark,
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
  type LucideIcon,
} from "lucide-react"
import { type PromptCard } from "@/data/promptsData"
import { usePrompts } from "@/hooks/usePrompts"
import { useLabCategories } from "@/hooks/useLabCategories"
import { AppBottomNav } from "@/components/AppBottomNav"
import { slugifyTitle } from "@/lib/utils"

type DiffFilter = "Todos" | PromptCard["difficulty"]

const DIFF_TABS: DiffFilter[] = ["Todos", "Iniciante", "Intermediario", "Avancado"]
const DIFF_LABELS: Record<DiffFilter, string> = {
  Todos: "Todos",
  Iniciante: "Iniciante",
  Intermediario: "Intermediário",
  Avancado: "Avançado",
}

const DIFF_BADGE: Record<
  PromptCard["difficulty"],
  { dot: string; label: string; bg: string; text: string }
> = {
  Iniciante: {
    dot: "bg-primary-dark",
    label: "Iniciante",
    bg: "bg-pageBgLight",
    text: "text-primary-dark",
  },
  Intermediario: {
    dot: "bg-amber-600",
    label: "Intermediário",
    bg: "bg-[#FFF7ED]",
    text: "text-amber-800",
  },
  Avancado: { dot: "bg-red-600", label: "Avançado", bg: "bg-[#FEF2F2]", text: "text-red" },
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

function PromptListCard({
  prompt,
  saved,
  onToggleSave,
  onOpen,
}: {
  prompt: PromptCard
  saved: boolean
  onToggleSave: () => void
  onOpen: () => void
}) {
  const badge = DIFF_BADGE[prompt.difficulty]

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-start gap-3 rounded-2xl border border-stroke-muted bg-white p-4 text-left shadow-sm transition-all active:scale-[0.99] hover:bg-surface-soft"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-snug text-foregroundDark">{prompt.title}</p>
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-foregroundSecondary">
              {prompt.description}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                onToggleSave()
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation()
                  e.preventDefault()
                  onToggleSave()
                }
              }}
              className="rounded-full p-1 transition-colors hover:bg-pageBgLight"
              aria-label={saved ? "Remover dos salvos" : "Salvar prompt"}
            >
              <Bookmark
                className={`h-4 w-4 ${saved ? "fill-primary-dark text-primary-dark" : "text-foregroundMuted"}`}
              />
            </span>
            <ChevronRight className="h-4 w-4 text-foregroundMuted" />
          </div>
        </div>
        <span
          className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
          {badge.label}
        </span>
      </div>
    </button>
  )
}

export default function PromptCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()

  const [activeDiff, setActiveDiff] = useState<DiffFilter>("Todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  const { categories, loading: labLoading, error: catError } = useLabCategories()
  const { prompts, loading: promptsLoading, error: promptsError } = usePrompts(categoryId)

  useEffect(() => {
    if (catError) {
      sileo.error({ title: `Erro ao carregar categorias: ${catError}` })
    }
  }, [catError])

  useEffect(() => {
    if (promptsError) {
      sileo.error({ title: `Erro ao carregar prompts: ${promptsError}` })
    }
  }, [promptsError])

  const catMeta = categories.find((c) => c.id === categoryId)
  const label = catMeta?.label.replace("\n", " ") ?? categoryId ?? "Categoria"
  const CategoryIcon = ICON_MAP[catMeta?.icon ?? ""] ?? Lightbulb

  const basePrompts = useMemo(() => prompts, [prompts])

  const filtered = useMemo(() => {
    let result =
      activeDiff === "Todos" ? basePrompts : basePrompts.filter((p) => p.difficulty === activeDiff)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }
    return result
  }, [basePrompts, activeDiff, searchQuery])

  function toggleSave(title: string) {
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (next.has(title)) {
        next.delete(title)
      } else {
        next.add(title)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-white px-4 pb-4 pt-12 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-primary-dark transition-colors hover:bg-pageBgLight"
              aria-label="Voltar"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-extrabold text-foregroundDark">{label}</h1>
              <p className="text-xs text-foregroundMuted">
                {basePrompts.length} prompts disponíveis
              </p>
            </div>
          </div>
          {catMeta && (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pageBgLight">
              <CategoryIcon className="h-6 w-6 text-primary-dark" strokeWidth={1.8} />
            </div>
          )}
        </div>

        {/* Search + Filtros */}
        <div className="flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-stroke-light bg-[#F4F9F5] px-4 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-foregroundMuted" />
            <input
              type="text"
              placeholder="Buscar prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foregroundDark placeholder:text-foregroundPlaceholder focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="rounded-full p-0.5 text-foregroundMuted"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button className="flex items-center gap-1.5 rounded-full border border-stroke-light bg-white px-3 py-2 text-xs font-semibold text-primary-dark transition-colors hover:bg-pageBgLight">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtros
          </button>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Difficulty tabs */}
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

        {/* Prompt list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-foregroundMuted">
            <Search className="h-14 w-14 text-stroke-muted" />
            <p className="text-base font-semibold">Nenhum prompt encontrado</p>
            <p className="text-sm opacity-70">Tente ajustar o filtro ou a busca.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((prompt, idx) => (
              <PromptListCard
                key={`${prompt.title}-${idx}`}
                prompt={prompt}
                saved={savedIds.has(prompt.title)}
                onToggleSave={() => toggleSave(prompt.title)}
                onOpen={() =>
                  navigate(`/prompt/${slugifyTitle(prompt.title)}`, {
                    state: {
                      title: prompt.title,
                      category: prompt.category,
                      promptText: prompt.promptText,
                    },
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      <AppBottomNav />
    </div>
  )
}
