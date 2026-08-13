import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Star, Users, Clock, MessageSquare } from "lucide-react"
import { AppBottomNav } from "@/components/AppBottomNav"
import { AppPageHeader } from "@/components/AppPageHeader"
import { getReviews, type DbReview } from "@/lib/db"

const PAGE_SIZE = 10

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          strokeWidth={1.5}
          fill={i <= rating ? "currentColor" : "none"}
          style={{ color: i <= rating ? "#F5A623" : "#D1D5DB" }}
        />
      ))}
    </div>
  )
}

function formatRelativeDate(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days <= 0) return "hoje"
  if (days === 1) return "ontem"
  if (days < 30) return `há ${days} dias`
  const months = Math.floor(days / 30)
  return `há ${months} ${months === 1 ? "mês" : "meses"}`
}

function ReviewCard({ review }: { review: DbReview }) {
  return (
    <div className="rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <StarRow rating={review.rating} />
        <span className="text-[10px] text-foregroundPlaceholder">
          {formatRelativeDate(review.created_at)}
        </span>
      </div>
      {review.comment && (
        <p className="mt-2 text-xs leading-relaxed text-foregroundDark">{review.comment}</p>
      )}
    </div>
  )
}

export default function CommunityPage() {
  const [reviews, setReviews] = useState<DbReview[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    getReviews(PAGE_SIZE, 0)
      .then(({ data }) => {
        setReviews(data ?? [])
        setHasMore((data?.length ?? 0) === PAGE_SIZE)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleLoadMore = () => {
    if (loadingMore) return
    setLoadingMore(true)
    getReviews(PAGE_SIZE, reviews.length)
      .then(({ data }) => {
        setReviews((prev) => [...prev, ...(data ?? [])])
        setHasMore((data?.length ?? 0) === PAGE_SIZE)
      })
      .finally(() => setLoadingMore(false))
  }

  return (
    <div className="flex min-h-screen flex-col bg-white pb-24 lg:pb-8">
      <AppPageHeader title="Comunidade" />

      <div className="flex flex-1 flex-col items-center gap-6 px-6 pt-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald/10 text-emerald">
          <Users className="h-12 w-12" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-primary-dark">Em breve</h2>
          <p className="max-w-xs text-sm text-foreground-tertiary">
            O feed da comunidade está a caminho! Você poderá compartilhar prompts, participar de
            desafios e aprender com outros usuários.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald/10 px-4 py-2 text-sm font-semibold text-emerald">
          <Clock className="h-4 w-4" />
          Disponível na v0.1
        </div>
        <Link
          to="/learn"
          className="flex items-center gap-2 rounded-2xl bg-emerald px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-emerald/30"
        >
          Continuar aprendendo
        </Link>

        {!loading && reviews.length > 0 && (
          <div className="mt-4 w-full max-w-md text-left">
            <div className="mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary-dark" />
              <h3 className="text-sm font-bold text-foregroundDark">
                O que dizem sobre o PromptLabz
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="mx-auto mt-3 block rounded-full border border-stroke-light px-5 py-2 text-sm font-semibold text-primary-dark transition-colors hover:bg-surface-soft disabled:opacity-50"
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
