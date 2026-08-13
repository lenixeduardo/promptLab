import { useState, useEffect, useRef } from "react"
import { getPrompts, DbPrompt } from "@/lib/db"
import { PROMPTS, PromptCard } from "@/data/promptsData"
import { errorLogger } from "@/lib/errorLogging"

const MAX_RETRIES = 3
const INITIAL_DELAY_MS = 1000
const isTestEnvironment = import.meta.env.VITEST

function mapDbPrompt(p: DbPrompt): PromptCard {
  return {
    title: p.title,
    difficulty: p.difficulty as PromptCard["difficulty"],
    color: p.color as PromptCard["color"],
    category: p.category as PromptCard["category"],
    promptText: p.prompt_text,
    description: p.description,
    exampleInput: p.example_input ?? undefined,
    exampleOutput: p.example_output ?? undefined,
  }
}

export function usePrompts(category?: string, difficulty?: string) {
  const fallback = category ? PROMPTS.filter((p) => p.category === category) : PROMPTS
  const [prompts, setPrompts] = useState<PromptCard[]>(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchPromptsWithRetry = async (attemptNum = 0): Promise<void> => {
    try {
      const result = await getPrompts(category, difficulty)
      if (result.data && result.data.length > 0) {
        setPrompts(result.data.map(mapDbPrompt))
        setError(null)
      } else if (result.data && result.data.length === 0) {
        setPrompts(fallback)
      } else if (result.error) {
        // Disable automatic retry in test environment
        if (attemptNum < MAX_RETRIES && !isTestEnvironment) {
          const delay = INITIAL_DELAY_MS * Math.pow(2, attemptNum)
          timeoutRef.current = setTimeout(() => {
            fetchPromptsWithRetry(attemptNum + 1)
          }, delay)
          return
        } else {
          setError(result.error)
          errorLogger.logApiError("/db/getPrompts", 500, result.error)
        }
      }
    } catch (err) {
      if (attemptNum < MAX_RETRIES && !isTestEnvironment) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, attemptNum)
        timeoutRef.current = setTimeout(() => {
          fetchPromptsWithRetry(attemptNum + 1)
        }, delay)
        return
      } else {
        const errorMsg = err instanceof Error ? err.message : "Falha ao carregar prompts"
        setError(errorMsg)
        errorLogger.logError(err, "usePrompts.fetchPrompts")
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchPrompts = async () => {
    setLoading(true)
    setError(null)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    await fetchPromptsWithRetry(0)
  }

  useEffect(() => {
    fetchPrompts()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [category, difficulty])

  return { prompts, loading, error, refetch: fetchPrompts }
}
