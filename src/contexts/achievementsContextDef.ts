import { createContext } from "react"
import type { Achievement, AchievementsData } from "@/lib/achievements"

export interface AchievementsCtx {
  allAchievements: Achievement[]
  unlocked: string[]
  data: AchievementsData
  /** Whether we're still loading from DB on first mount */
  initialLoading: boolean
  checkLessonComplete: (wasPerfect: boolean) => Achievement[]
  checkDailyVisit: (
    userId?: string,
    favoritesCount?: number
  ) => Promise<{ newUnlocks: Achievement[]; daysAbsent: number | null }>
  visitCategory: (categoryId: string) => void
  checkFavorites: (count: number) => Achievement[]
  getAchievement: (id: string) => Achievement | undefined
}

export const AchievementsContext = createContext<AchievementsCtx | undefined>(undefined)
