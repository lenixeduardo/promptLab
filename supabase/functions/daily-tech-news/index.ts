import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const dailyNewsSecret = Deno.env.get("DAILY_NEWS_SECRET")!

type NewsCategory = "OpenAI" | "Anthropic" | "Google" | "ChatGPT" | "Meta" | "Microsoft" | "General"

// Curated stable Unsplash images used as category cover fallbacks.
// Each URL is a specific photo ID so the image never changes.
const CATEGORY_COVER_IMAGES: Record<NewsCategory, string> = {
  OpenAI: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
  Anthropic: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
  Google: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80",
  ChatGPT: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80",
  Meta: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=80",
  Microsoft: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80",
  General: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
}

interface ArticleInsert {
  title: string
  description: string
  category: NewsCategory
  image_emoji: string
  image_url: string
  source_url: string
  external_id: string
  published_at: string
}

const CATEGORY_KEYWORDS: [NewsCategory, string[]][] = [
  ["Anthropic", ["anthropic", "claude ai", "claude 3", "claude 4", "claude opus", "claude sonnet"]],
  ["ChatGPT", ["chatgpt"]],
  [
    "OpenAI",
    [
      "openai",
      "gpt-4",
      "gpt-5",
      "gpt4",
      "gpt5",
      "dall-e",
      "dall·e",
      "sora",
      "whisper",
      "o3-mini",
      "o4-mini",
    ],
  ],
  [
    "Google",
    [
      "google ai",
      "google deepmind",
      "gemini",
      "deepmind",
      "google bard",
      "vertex ai",
      "notebooklm",
    ],
  ],
  ["Meta", ["meta ai", "llama 2", "llama 3", "llama 4", "meta llama"]],
  ["Microsoft", ["microsoft copilot", "azure openai", "github copilot", "bing ai", "microsoft ai"]],
]

const CATEGORY_EMOJIS: Record<NewsCategory, string> = {
  OpenAI: "🤖",
  Anthropic: "🧠",
  Google: "🔍",
  ChatGPT: "💬",
  Meta: "🦙",
  Microsoft: "💻",
  General: "📰",
}

function categorize(text: string): { category: NewsCategory; emoji: string } {
  const lower = text.toLowerCase()
  for (const [cat, keywords] of CATEGORY_KEYWORDS) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return { category: cat, emoji: CATEGORY_EMOJIS[cat] }
    }
  }
  return { category: "General", emoji: "📰" }
}

const AI_FILTER_KEYWORDS = [
  "openai",
  "anthropic",
  "claude",
  "chatgpt",
  "gpt-4",
  "gpt-5",
  "gemini",
  "llm",
  "large language model",
  "generative ai",
  "llama",
  "copilot",
  "sora",
  "dall-e",
  "deepmind",
  "machine learning",
  "neural network",
  "artificial intelligence",
  "ai model",
  "prompt engineering",
]

function matchesAiFilter(text: string): boolean {
  const lower = text.toLowerCase()
  return AI_FILTER_KEYWORDS.some((kw) => lower.includes(kw))
}

async function fetchHackerNews(): Promise<ArticleInsert[]> {
  const topIds: number[] = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  ).then((r) => r.json())

  const stories = await Promise.all(
    topIds.slice(0, 150).map((id) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .then((r) => r.json())
        .catch(() => null)
    )
  )

  return stories
    .filter((s) => s?.type === "story" && s.url && s.title && matchesAiFilter(s.title))
    .slice(0, 15)
    .map((s) => {
      const { category, emoji } = categorize(s.title)
      const score = s.score ?? 0
      const comments = s.descendants ?? 0
      return {
        title: (s.title as string).slice(0, 300),
        description: `${score} pontos · ${comments} comentários no Hacker News`,
        category,
        image_emoji: emoji,
        image_url: CATEGORY_COVER_IMAGES[category],
        source_url: s.url as string,
        external_id: `hn_${s.id}`,
        published_at: new Date((s.time as number) * 1000).toISOString(),
      }
    })
}

async function fetchDevTo(): Promise<ArticleInsert[]> {
  const articles: Record<string, unknown>[] = await fetch(
    "https://dev.to/api/articles?tags=ai,machinelearning,llm&per_page=30&top=1"
  )
    .then((r) => r.json())
    .catch(() => [])

  return articles
    .filter((a) => a?.title && matchesAiFilter(`${a.title} ${a.description ?? ""}`))
    .slice(0, 15)
    .map((a) => {
      const combinedText = `${a.title} ${a.description ?? ""}`
      const { category, emoji } = categorize(combinedText)
      const desc = ((a.description as string) || (a.title as string)).slice(0, 800)
      const coverImage =
        (a.cover_image as string | null) ||
        (a.social_image as string | null) ||
        CATEGORY_COVER_IMAGES[category]
      return {
        title: (a.title as string).slice(0, 300),
        description: desc,
        category,
        image_emoji: emoji,
        image_url: coverImage,
        source_url: a.url as string,
        external_id: `devto_${a.id}`,
        published_at: (a.published_at as string) || new Date().toISOString(),
      }
    })
}

Deno.serve(async (req) => {
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    })
  }

  const authHeader = req.headers.get("Authorization")
  if (!dailyNewsSecret || authHeader !== `Bearer ${dailyNewsSecret}`) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const [hnArticles, devtoArticles] = await Promise.all([fetchHackerNews(), fetchDevTo()])

    const allArticles = [...hnArticles, ...devtoArticles]

    if (allArticles.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, inserted: 0, message: "no articles matched ai filter" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    }

    const externalIds = allArticles.map((a) => a.external_id)
    const { data: existing } = await supabase
      .from("news_articles")
      .select("external_id")
      .in("external_id", externalIds)

    const existingIds = new Set((existing ?? []).map((r) => r.external_id as string))
    const newArticles = allArticles.filter((a) => !existingIds.has(a.external_id))

    if (newArticles.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, inserted: 0, message: "all articles already exist" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    }

    const { error } = await supabase.from("news_articles").insert(newArticles)
    if (error) throw error

    console.log(`daily-tech-news: inserted ${newArticles.length} new articles`)

    return new Response(
      JSON.stringify({
        ok: true,
        inserted: newArticles.length,
        sources: { hn: hnArticles.length, devto: devtoArticles.length },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (err) {
    console.error("daily-tech-news error:", err)
    return new Response(JSON.stringify({ error: "internal_error", message: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
