import { useState, useEffect, useRef } from "react"
import { getTrendingSkills, DbTrendingSkill } from "@/lib/db"
import { TRENDING_SKILLS, TrendingSkill } from "@/data/trendingSkillsData"
import { errorLogger } from "@/lib/errorLogging"
import { useErrorRecoveryContext } from "@/contexts/useErrorRecoveryContext"

const MAX_RETRIES = 3
const INITIAL_DELAY_MS = 1000
const isTestEnvironment = import.meta.env.VITEST

function mapDbSkill(s: DbTrendingSkill): TrendingSkill {
  return {
    name: s.name,
    description: s.description,
    category: s.category as TrendingSkill["category"],
    author: s.author,
    installs: s.installs,
    installsCount: s.installs_count,
    tags: s.tags,
    icon: s.icon,
  }
}

export function useTrendingSkills(category?: string) {
  const [skills, setSkills] = useState<TrendingSkill[]>(TRENDING_SKILLS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const retryCountRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const errorRecovery = useErrorRecoveryContext()

  const fetchSkillsWithRetry = async (attemptNum = 0): Promise<void> => {
    try {
      const result = await getTrendingSkills(category)
      if (result.data && result.data.length > 0) {
        setSkills(result.data.map(mapDbSkill))
        setError(null)
        retryCountRef.current = 0
      } else if (result.error) {
        // Disable automatic retry in test environment
        if (attemptNum < MAX_RETRIES && !isTestEnvironment) {
          const delay = INITIAL_DELAY_MS * Math.pow(2, attemptNum)
          timeoutRef.current = setTimeout(() => {
            fetchSkillsWithRetry(attemptNum + 1)
          }, delay)
        } else {
          setError(result.error)
          errorLogger.logApiError("/db/getTrendingSkills", 500, result.error)
          errorRecovery?.addError(result.error, "API_ERROR", [
            { label: "Tentar novamente", action: fetchSkills },
          ])
        }
      }
    } catch (err) {
      if (attemptNum < MAX_RETRIES && !isTestEnvironment) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, attemptNum)
        timeoutRef.current = setTimeout(() => {
          fetchSkillsWithRetry(attemptNum + 1)
        }, delay)
      } else {
        const errorMsg =
          err instanceof Error ? err.message : "Falha ao carregar habilidades em trending"
        setError(errorMsg)
        errorLogger.logError(err, "useTrendingSkills.fetchSkills")
        errorRecovery?.addError(errorMsg, "API_ERROR", [
          { label: "Tentar novamente", action: fetchSkills },
        ])
      }
    } finally {
      if (attemptNum >= MAX_RETRIES || (attemptNum === 0 && !error)) {
        setLoading(false)
      }
    }
  }

  const fetchSkills = async () => {
    setLoading(true)
    setError(null)
    retryCountRef.current = 0
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    await fetchSkillsWithRetry(0)
  }

  useEffect(() => {
    fetchSkills()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [category])

  return { skills, loading, error, refetch: fetchSkills }
}
