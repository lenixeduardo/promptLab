import { useState, useEffect } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { ExternalLink, X, MailOpen } from "lucide-react"
import { AppBottomNav } from "@/components/AppBottomNav"
import {
  NEWS_ARTICLES,
  CATEGORY_COVER_IMAGES,
  type NewsArticle,
  type NewsCategory,
} from "@/data/newsData"
import { getNewsArticles, type DbNewsArticle } from "@/lib/db"
import { cn } from "@/lib/utils"

const CATEGORIES: Array<"Todos" | NewsCategory> = [
  "Todos", "OpenAI", "Anthropic", "Google", "ChatGPT", "Meta", "Microsoft", "General",
]

const CATEGORY_STYLES: Record<NewsCategory, string> = {
  OpenAI:    "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  Anthropic: "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
  Google:    "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  ChatGPT:   "bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800",
  Meta:      "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
  Microsoft: "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
  General:   "bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-800/60 dark:text-gray-300 dark:border-gray-700",
}

const PT_MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${PT_MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function mapDbArticle(row: DbNewsArticle): NewsArticle {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    date: formatDate(row.published_at),
    imageEmoji: row.image_emoji,
    imageUrl: row.image_url ?? CATEGORY_COVER_IMAGES[row.category] ?? CATEGORY_COVER_IMAGES.General,
    sourceUrl: row.source_url ?? undefined,
  }
}

function NewsCard({
  article,
  onOpen,
}: {
  article: NewsArticle
  onOpen: (article: NewsArticle) => void
}) {
  const [imgError, setImgError] = useState(false)
  const coverSrc = imgError ? CATEGORY_COVER_IMAGES[article.category] : article.imageUrl

  return (
    <button
      type="button"
      onClick={() => onOpen(article)}
      aria-label={article.title}
      className="group w-full overflow-hidden rounded-2xl border border-stroke-muted bg-white text-left transition-colors hover:border-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
    >
      {/* Cover image */}
      <div className="relative h-44 w-full overflow-hidden bg-pageBgLight">
        <img
          src={coverSrc}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Category badge over image */}
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide backdrop-blur-sm",
            CATEGORY_STYLES[article.category],
          )}
        >
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-4">
        <p className="text-sm font-bold leading-snug text-foregroundDark line-clamp-2">
          {article.title}
        </p>
        <p className="line-clamp-2 text-xs leading-relaxed text-foregroundTertiary">
          {article.description}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[10px] text-foregroundPlaceholder">{article.date}</span>
          {article.sourceUrl && (
            <span className="text-[10px] font-medium text-emerald-600">
              Ler artigo →
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function NewsCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stroke-muted bg-white">
      <div className="h-44 w-full animate-pulse bg-stroke-muted/40" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-16 animate-pulse rounded-full bg-stroke-muted/40" />
        <div className="h-4 w-full animate-pulse rounded bg-stroke-muted/40" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-stroke-muted/30" />
      </div>
    </div>
  )
}

export default function News() {
  const [activeCategory, setActiveCategory] = useState<"Todos" | NewsCategory>("Todos")
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)

  useEffect(() => {
    getNewsArticles().then(({ data }) => {
      setArticles(data && data.length > 0 ? data.map(mapDbArticle) : NEWS_ARTICLES)
      setLoading(false)
    })
  }, [])

  const filtered =
    activeCategory === "Todos"
      ? articles
      : articles.filter((a) => a.category === activeCategory)

  return (
    <div className="flex min-h-screen flex-col bg-white pb-24 lg:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-stroke-muted bg-white px-4 lg:px-8 py-3">
        <h1 className="text-xl lg:text-2xl font-bold text-primary-dark">Notícias</h1>
        <p className="text-xs text-foregroundTertiary">
          Fique por dentro do mundo de AI e Prompt Engineering
        </p>
      </div>

      {/* Category filter chips */}
      <div className="no-scrollbar overflow-x-auto border-b border-stroke-muted bg-white">
        <div className="flex gap-2 px-4 py-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                activeCategory === cat
                  ? "border-primary-dark bg-primary-dark text-white"
                  : "border-stroke-light bg-white text-primary-dark hover:border-emerald",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles grid */}
      <div className="flex-1 px-4 lg:px-8 py-4 lg:max-w-5xl lg:mx-auto lg:w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => <NewsCardSkeleton key={i} />)}
          </>
        ) : filtered.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
            <MailOpen className="h-10 w-10 text-foreground-muted" strokeWidth={1.5} />
            <p className="text-sm font-medium text-foregroundTertiary">Nenhuma notícia nessa categoria.</p>
          </div>
        ) : (
          filtered.map((article) => (
            <NewsCard key={article.id} article={article} onOpen={setSelectedArticle} />
          ))
        )}
      </div>
      </div>

      <Dialog.Root
        open={selectedArticle !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedArticle(null)
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
          {selectedArticle && (
            <Dialog.Content className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[85vh] max-w-md -translate-y-1/2 overflow-y-auto rounded-2xl border border-stroke-muted bg-white p-5 shadow-xl focus:outline-none">
              <div className="relative -mx-5 -mt-5 mb-5 h-48 overflow-hidden rounded-t-2xl bg-pageBgLight">
                <img
                  src={selectedArticle.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Dialog.Close
                  aria-label="Fechar noticia"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary-dark shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                >
                  <X className="h-5 w-5" />
                </Dialog.Close>
                <span
                  className={cn(
                    "absolute bottom-3 left-4 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide",
                    CATEGORY_STYLES[selectedArticle.category],
                  )}
                >
                  {selectedArticle.category}
                </span>
              </div>

              <p className="text-[10px] text-foregroundPlaceholder">{selectedArticle.date}</p>
              <Dialog.Title className="mt-2 text-xl font-bold leading-tight text-foregroundDark">
                {selectedArticle.title}
              </Dialog.Title>
              <Dialog.Description className="mt-3 text-sm leading-relaxed text-foregroundSecondary">
                {selectedArticle.description}
              </Dialog.Description>
              {selectedArticle.sourceUrl && /^https?:\/\//i.test(selectedArticle.sourceUrl) && (
                <a
                  href={selectedArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-dark px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
                >
                  Ler artigo completo
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </Dialog.Content>
          )}
        </Dialog.Portal>
      </Dialog.Root>

      <AppBottomNav />
    </div>
  )
}
