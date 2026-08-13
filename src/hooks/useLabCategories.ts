import { useState, useEffect, useRef } from "react"
import { getLabCategories, getLabConfig, DbLabCategory, DbLabConfig } from "@/lib/db"
import { LAB_CATEGORIES, PROMPT_OF_THE_DAY, LabCategory } from "@/data/labCategoriesData"
import { errorLogger } from "@/lib/errorLogging"
import { useErrorRecoveryContext } from "@/contexts/useErrorRecoveryContext"

const MAX_RETRIES = 3
const INITIAL_DELAY_MS = 1000
const isTestEnvironment = import.meta.env.VITEST

type PromptOfTheDay = typeof PROMPT_OF_THE_DAY

function mapDbCategory(c: DbLabCategory): LabCategory {
  return {
    id: c.category_id,
    label: c.label,
    icon: c.icon,
    promptCount: c.prompt_count,
  }
}

function mapDbConfig(cfg: DbLabConfig): PromptOfTheDay {
  return {
    title: cfg.potd_title,
    description: cfg.potd_description,
    categoryId: cfg.potd_category_id,
  } as PromptOfTheDay
}

export function useLabCategories() {
  const [categories, setCategories] = useState<LabCategory[]>(LAB_CATEGORIES)
  const [promptOfTheDay, setPromptOfTheDay] = useState<PromptOfTheDay>(PROMPT_OF_THE_DAY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const errorRecovery = useErrorRecoveryContext()

  const fetchDataWithRetry = async (attemptNum = 0): Promise<void> => {
    try {
      const [catRes, cfgRes] = await Promise.all([getLabCategories(), getLabConfig()])
      if (catRes.data && catRes.data.length > 0) {
        setCategories(catRes.data.map(mapDbCategory))
      }
      if (cfgRes.data) {
        setPromptOfTheDay(mapDbConfig(cfgRes.data))
      }
      if (catRes.error || cfgRes.error) {
        // Disable automatic retry in test environment
        if (attemptNum < MAX_RETRIES && !isTestEnvironment) {
          const delay = INITIAL_DELAY_MS * Math.pow(2, attemptNum)
          timeoutRef.current = setTimeout(() => {
            fetchDataWithRetry(attemptNum + 1)
          }, delay)
          return
        } else {
          const errorMsg = catRes.error || cfgRes.error || "Falha ao carregar dados"
          setError(errorMsg)
          if (catRes.error) {
            errorLogger.logApiError("/db/getLabCategories", 500, catRes.error)
          }
          if (cfgRes.error) {
            errorLogger.logApiError("/db/getLabConfig", 500, cfgRes.error)
          }
          errorRecovery?.addError(errorMsg, "API_ERROR", [
            { label: "Tentar novamente", action: fetchData },
          ])
        }
      } else {
        setError(null)
      }
    } catch (err) {
      if (attemptNum < MAX_RETRIES && !isTestEnvironment) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, attemptNum)
        timeoutRef.current = setTimeout(() => {
          fetchDataWithRetry(attemptNum + 1)
        }, delay)
        return
      } else {
        const errorMsg = err instanceof Error ? err.message : "Falha ao carregar categorias"
        setError(errorMsg)
        errorLogger.logError(err, "useLabCategories.fetchData")
        errorRecovery?.addError(errorMsg, "API_ERROR", [
          { label: "Tentar novamente", action: fetchData },
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    await fetchDataWithRetry(0)
  }

  useEffect(() => {
    fetchData()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return { categories, promptOfTheDay, loading, error, refetch: fetchData }
}
