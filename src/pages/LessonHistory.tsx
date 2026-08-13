import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { AppPageHeader } from "@/components/AppPageHeader"
import { AppBottomNav } from "@/components/AppBottomNav"
import { useAuth } from "@/hooks/useAuth"
import { getLessonCompletions, type DbLessonCompletion } from "@/lib/db"
import { getCompletedCount } from "@/lib/moduleProgress"
import { TRACKS } from "@/pages/LearningLab"
import type { TrackId } from "@/lib/moduleProgress"

const PAGE_SIZE = 20
const ALL_TRACKS: TrackId[] = ["a1", "a2", "a3", "a4"]

function trackLabel(track: string): string {
  return TRACKS.find((t) => t.id === track)?.label ?? track.toUpperCase()
}

function moduleTitle(track: string, moduleIndex: number): string {
  const found = TRACKS.find((t) => t.id === track)?.modules[moduleIndex]
  return found?.title ?? `Lição ${moduleIndex + 1}`
}

function formatDate(isoDate: string): string {
  const now = Date.now()
  const then = new Date(isoDate).getTime()
  const days = Math.floor((now - then) / 86400000)

  if (days < 1) return "Hoje"
  if (days === 1) return "Ontem"
  if (days < 7) return `Há ${days} dias`
  return new Date(isoDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function LessonHistory() {
  const { user } = useAuth()
  const [completions, setCompletions] = useState<DbLessonCompletion[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState(false)

  const totalCompleted = ALL_TRACKS.reduce((sum, track) => sum + getCompletedCount(track), 0)

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    getLessonCompletions(user.id, PAGE_SIZE, 0)
      .then(({ data, error: err }) => {
        if (err) {
          setError(true)
          return
        }
        setCompletions(data ?? [])
        setHasMore((data?.length ?? 0) === PAGE_SIZE)
      })
      .finally(() => setLoading(false))
  }, [user?.id])

  const handleLoadMore = () => {
    if (!user?.id || loadingMore) return
    setLoadingMore(true)
    getLessonCompletions(user.id, PAGE_SIZE, completions.length)
      .then(({ data, error: err }) => {
        if (err) return
        setCompletions((prev) => [...prev, ...(data ?? [])])
        setHasMore((data?.length ?? 0) === PAGE_SIZE)
      })
      .finally(() => setLoadingMore(false))
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6 pb-24 lg:pb-8">
      <div className="mx-auto w-full max-w-md lg:max-w-2xl">
        <AppPageHeader title="Histórico de Lições" back="/profile" />

        <div className="mb-5 rounded-2xl border border-stroke-muted bg-surface-soft p-4 text-center">
          <p className="text-2xl font-extrabold text-primary-dark">{totalCompleted}</p>
          <p className="text-xs text-foregroundMuted">lições concluídas no total</p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-stroke-muted/30" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <AlertTriangle className="h-12 w-12 text-stroke-light" />
            <p className="text-sm font-semibold text-foregroundMuted">
              Não foi possível carregar seu histórico
            </p>
            <p className="max-w-xs text-xs text-foregroundMuted">
              Verifique sua conexão e tente novamente em instantes.
            </p>
          </div>
        ) : completions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <CheckCircle2 className="h-12 w-12 text-stroke-light" />
            <p className="text-sm font-semibold text-foregroundMuted">
              Nenhuma lição com data registrada ainda
            </p>
            <p className="max-w-xs text-xs text-foregroundMuted">
              Este histórico detalhado começou a ser registrado agora — lições concluídas antes
              disso contam no total acima, mas não têm data individual.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {completions.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-2xl border border-stroke-muted bg-white p-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-success">
                  <CheckCircle2 className="h-5 w-5 text-emerald" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foregroundDark">
                    {moduleTitle(c.track, c.module_index)}
                  </p>
                  <p className="text-xs text-foregroundMuted">{trackLabel(c.track)}</p>
                </div>
                <span className="shrink-0 text-xs text-foregroundMuted">
                  {formatDate(c.completed_at)}
                </span>
              </div>
            ))}
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="mx-auto mt-2 rounded-full border border-stroke-light px-5 py-2 text-sm font-semibold text-primary-dark transition-colors hover:bg-surface-soft disabled:opacity-50"
              >
                {loadingMore ? "Carregando..." : "Carregar mais"}
              </button>
            )}
          </div>
        )}
      </div>

      <AppBottomNav />
    </div>
  )
}
