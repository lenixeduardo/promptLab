import { useCallback, useEffect, useRef, useState } from "react"
import {
  ACHIEVEMENTS,
  checkAchievements,
  updateStreak,
  getDaysSinceLastVisit,
} from "@/lib/achievements"
import {
  loadAchievements,
  saveAchievements,
  loadAchievementsFromDb,
  saveAchievementsToDb,
  syncLocalAchievementsToSupabase,
} from "@/lib/achievements-db"
import {
  loadStreak,
  saveStreak,
  insertNotification,
  getAchievementDefinitions,
  type DbAchievementDefinition,
} from "@/lib/db"
import { useAuthContext } from "@/contexts/AuthContext"
import { AchievementsContext } from "./achievementsContextDef"

export type { AchievementsCtx } from "./achievementsContextDef"
export { AchievementsContext } from "./achievementsContextDef"

import type { AchievementsData, Achievement } from "@/lib/achievements"
import type { ReactNode } from "react"

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext()
  const userId = user?.id ?? null

  // Start with localStorage data (fast, works offline, no flash)
  const [initialLoading, setInitialLoading] = useState(true)
  const [data, setData] = useState<AchievementsData>(loadAchievements)
  const [definitions, setDefinitions] = useState<Achievement[]>(ACHIEVEMENTS)
  const dataRef = useRef(data)
  useEffect(() => {
    dataRef.current = data
  }, [data])
  const userIdRef = useRef(userId)
  useEffect(() => {
    userIdRef.current = userId
  }, [userId])

  // ── Load from DB on mount / on user change ──────────────────────────────
  const loadedUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setInitialLoading(false)
      return
    }

    // Only load from DB once per userId (handles user switching correctly)
    if (loadedUserIdRef.current === userId) return
    loadedUserIdRef.current = userId

    let cancelled = false

    ;(async () => {
      // 1. Try loading from DB
      const { data: dbData } = await loadAchievementsFromDb(userId)

      if (cancelled) return

      if (dbData) {
        // DB has data — use it as source of truth, overwrite localStorage
        setData(dbData)
        saveAchievements(dbData)
      } else {
        // No DB data yet — sync localStorage → DB (first login or new user)
        await syncLocalAchievementsToSupabase(userId)
      }

      setInitialLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [userId])

  // ── Fetch achievement definitions from DB ────────────────────────────────
  useEffect(() => {
    getAchievementDefinitions().then(({ data }) => {
      if (data && data.length > 0) {
        setDefinitions(
          data.map((d) => ({
            id: d.ach_id,
            title: d.title,
            description: d.description,
            icon: d.icon,
            category: d.category as Achievement["category"],
          }))
        )
      }
    })
  }, [])

  // ── Persist: always localStorage (offline-safe), DB when user is logged in ──
  const lastSavedRef = useRef("")

  useEffect(() => {
    // Always persist to localStorage (fast, no network needed)
    saveAchievements(data)

    // Write to DB when user is logged in (debounced via string diff)
    const json = JSON.stringify(data)
    if (userId && json !== lastSavedRef.current) {
      lastSavedRef.current = json
      saveAchievementsToDb(userId, data).catch(() => {
        // Silently fail — localStorage is the fallback
      })
    }
  }, [data, userId])

  // ── Methods ──────────────────────────────────────────────────────────────

  const checkLessonComplete = useCallback((wasPerfect: boolean): Achievement[] => {
    const prev = dataRef.current
    const { newUnlocks, data: next } = checkAchievements(prev, {
      totalLessonsCompleted: prev.totalLessonsCompleted + 1,
      perfectCount: prev.perfectCount + (wasPerfect ? 1 : 0),
    })
    if (newUnlocks.length > 0) {
      setData(next)
      const uid = userIdRef.current
      if (uid) {
        newUnlocks.forEach((achievement) => {
          insertNotification(uid, {
            type: "achievement",
            title: `Conquista desbloqueada! 🏆`,
            description: `Você conquistou "${achievement.title}": ${achievement.description}`,
          }).catch(() => {
            /* silent — non-critical */
          })
        })
      }
    }
    return newUnlocks
  }, [])

  const checkDailyVisit = useCallback(
    async (
      userId?: string,
      favoritesCount?: number
    ): Promise<{ newUnlocks: Achievement[]; daysAbsent: number | null }> => {
      const existing = dataRef.current

      // Calculate new streak locally first (optimistic)
      const { newLastVisit, newConsecutive } = updateStreak(
        existing.lastVisitDate,
        existing.consecutiveDays
      )

      let finalConsecutive = newConsecutive
      let finalLongest = Math.max(existing.longestStreak, newConsecutive)
      let priorLastVisit = existing.lastVisitDate

      // Sync with Supabase if authenticated
      if (userId) {
        const { data: remote } = await loadStreak(userId)
        if (remote) {
          // Use the highest value between local and remote to avoid data loss
          finalConsecutive = Math.max(finalConsecutive, remote.currentStreak)
          // If remote last_visit_date is today, trust remote streak
          if (remote.lastVisitDate === newLastVisit) {
            finalConsecutive = remote.currentStreak
          }
          finalLongest = Math.max(finalLongest, remote.longestStreak, finalConsecutive)
          // Remote may be more recent than local (e.g. visited from another device)
          if (remote.lastVisitDate && (!priorLastVisit || remote.lastVisitDate > priorLastVisit)) {
            priorLastVisit = remote.lastVisitDate
          }
        }

        // Persist updated streak to Supabase (fire-and-forget)
        saveStreak(userId, {
          currentStreak: finalConsecutive,
          longestStreak: finalLongest,
          lastVisitDate: newLastVisit,
        }).catch(() => {
          /* silent — localStorage is the fallback */
        })
      }

      // Days the user was away before this visit — used to greet returning users.
      const daysAbsent = getDaysSinceLastVisit(priorLastVisit)

      const streakData: AchievementsData = {
        ...existing,
        lastVisitDate: newLastVisit,
        consecutiveDays: finalConsecutive,
        longestStreak: finalLongest,
      }

      const { newUnlocks, data: next } = checkAchievements(streakData, {
        consecutiveDays: finalConsecutive,
        favoritesCount,
      })

      if (
        newLastVisit !== existing.lastVisitDate ||
        newUnlocks.length > 0 ||
        finalConsecutive !== existing.consecutiveDays
      ) {
        setData({ ...next, longestStreak: finalLongest })
      }

      return { newUnlocks, daysAbsent }
    },
    []
  )

  const visitCategory = useCallback((categoryId: string) => {
    const existing = dataRef.current
    if (existing.visitedCategories.includes(categoryId)) return

    const { newUnlocks, data: next } = checkAchievements(existing, {
      visitedCategories: [...existing.visitedCategories, categoryId],
    })
    if (newUnlocks.length > 0) {
      setData(next)
    } else {
      setData({ ...existing, visitedCategories: [...existing.visitedCategories, categoryId] })
    }
  }, [])

  const checkFavorites = useCallback((count: number): Achievement[] => {
    const { newUnlocks, data: next } = checkAchievements(dataRef.current, { favoritesCount: count })
    if (newUnlocks.length > 0) {
      setData(next)
    }
    return newUnlocks
  }, [])

  const getAchievement = useCallback((id: string) => {
    return ACHIEVEMENTS.find((a) => a.id === id)
  }, [])

  return (
    <AchievementsContext.Provider
      value={{
        allAchievements: definitions,
        unlocked: data.unlocked,
        data,
        initialLoading,
        checkLessonComplete,
        checkDailyVisit,
        visitCategory,
        checkFavorites,
        getAchievement,
      }}
    >
      {children}
    </AchievementsContext.Provider>
  )
}
