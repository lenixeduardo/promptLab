// ═══════════════════════════════════════════════════════════════════════════
// Achievement System — Types, Definitions & Condition Logic (Pure)
// No side effects (no localStorage, no I/O). Storage lives in achievements-db.ts.
// This runs in all environments but the UI display is gated by DEV mode.
// ═══════════════════════════════════════════════════════════════════════════

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string // lucide-react icon name
  category: "progress" | "performance" | "streak" | "exploration"
}

export interface AchievementsData {
  unlocked: string[] // achievement IDs
  totalLessonsCompleted: number
  perfectCount: number
  lastVisitDate: string | null // "YYYY-MM-DD"
  consecutiveDays: number
  longestStreak: number
  visitedCategories: string[] // category IDs visited
  completedCategoryIds: string[] // category IDs fully completed
}

// ─── Achievement Definitions ─────────────────────────────────────────────

export const ACHIEVEMENTS: Achievement[] = [
  // ── Progress ───────────────────────────────────────────────────────────
  {
    id: "first-lesson",
    title: "Primeira Lição",
    description: "Complete sua primeira lição",
    icon: "BookOpen",
    category: "progress",
  },
  {
    id: "ten-lessons",
    title: "Dedicação",
    description: "Complete 10 lições",
    icon: "BookOpen",
    category: "progress",
  },
  {
    id: "fifty-lessons",
    title: "Mestre dos Estudos",
    description: "Complete 50 lições",
    icon: "GraduationCap",
    category: "progress",
  },
  {
    id: "first-category",
    title: "Explorador",
    description: "Complete sua primeira categoria de aprendizado",
    icon: "Trophy",
    category: "progress",
  },

  // ── Performance ────────────────────────────────────────────────────────
  {
    id: "first-perfect",
    title: "Perfeição Inicial",
    description: "Acerte 100% em uma lição",
    icon: "Target",
    category: "performance",
  },
  {
    id: "three-perfect",
    title: "Três Vezes Perfeito",
    description: "Acerte 100% em 3 lições",
    icon: "Award",
    category: "performance",
  },
  {
    id: "ten-perfect",
    title: "Dez de Dez",
    description: "Acerte 100% em 10 lições",
    icon: "Award",
    category: "performance",
  },

  // ── Streak ─────────────────────────────────────────────────────────────
  {
    id: "streak-3",
    title: "Consistente",
    description: "Use o app por 3 dias consecutivos",
    icon: "Zap",
    category: "streak",
  },
  {
    id: "streak-7",
    title: "Determinado",
    description: "Use o app por 7 dias consecutivos",
    icon: "Sparkles",
    category: "streak",
  },
  {
    id: "streak-30",
    title: "Viciado em Aprender",
    description: "Use o app por 30 dias consecutivos",
    icon: "Award",
    category: "streak",
  },

  // ── Exploration ────────────────────────────────────────────────────────
  {
    id: "five-favorites",
    title: "Colecionador",
    description: "Favorita 5 skills",
    icon: "Heart",
    category: "exploration",
  },
  {
    id: "social",
    title: "Social",
    description: "Visite todas as categorias de aprendizado",
    icon: "Globe",
    category: "exploration",
  },
]

export const ACHIEVEMENTS_MAP = new Map(ACHIEVEMENTS.map((a) => [a.id, a]))

// ─── Condition Checking ──────────────────────────────────────────────────

export type CheckResult = { newUnlocks: Achievement[]; data: AchievementsData }

/**
 * Check all achievement conditions and return any newly unlocked achievements
 * along with the updated data (without persisting).
 */
export function checkAchievements(
  data: AchievementsData,
  params: {
    totalLessonsCompleted?: number // from progress
    perfectCount?: number // from lesson results
    consecutiveDays?: number // from streak
    visitedCategories?: string[] // from page visits
    completedCategoryIds?: string[] // from progress
    favoritesCount?: number // from favorites
  }
): CheckResult {
  const newUnlocks: Achievement[] = []
  const next = { ...data }

  // Apply params that are provided
  if (params.totalLessonsCompleted !== undefined) {
    next.totalLessonsCompleted = params.totalLessonsCompleted
  }
  if (params.perfectCount !== undefined) {
    next.perfectCount = params.perfectCount
  }
  if (params.consecutiveDays !== undefined) {
    next.consecutiveDays = params.consecutiveDays
  }
  if (params.visitedCategories !== undefined) {
    next.visitedCategories = [...new Set([...data.visitedCategories, ...params.visitedCategories])]
  }
  if (params.completedCategoryIds !== undefined) {
    next.completedCategoryIds = [
      ...new Set([...data.completedCategoryIds, ...params.completedCategoryIds]),
    ]
  }

  const unlockedSet = new Set(data.unlocked)

  // ── Progress checks ──────────────────────────────────────────────────
  checkAndUnlock("first-lesson", () => next.totalLessonsCompleted >= 1)
  checkAndUnlock("ten-lessons", () => next.totalLessonsCompleted >= 10)
  checkAndUnlock("fifty-lessons", () => next.totalLessonsCompleted >= 50)
  checkAndUnlock("first-category", () => next.completedCategoryIds.length >= 1)

  // ── Performance checks ───────────────────────────────────────────────
  checkAndUnlock("first-perfect", () => next.perfectCount >= 1)
  checkAndUnlock("three-perfect", () => next.perfectCount >= 3)
  checkAndUnlock("ten-perfect", () => next.perfectCount >= 10)

  // ── Streak checks ────────────────────────────────────────────────────
  checkAndUnlock("streak-3", () => next.consecutiveDays >= 3)
  checkAndUnlock("streak-7", () => next.consecutiveDays >= 7)
  checkAndUnlock("streak-30", () => next.consecutiveDays >= 30)

  // ── Exploration checks ───────────────────────────────────────────────
  checkAndUnlock("five-favorites", () => (params.favoritesCount ?? 0) >= 5)

  // Social: visited at least 8 categories (most/all of the existing ones)
  checkAndUnlock("social", () => next.visitedCategories.length >= 8)

  function checkAndUnlock(id: string, condition: () => boolean) {
    if (!unlockedSet.has(id) && condition()) {
      const ach = ACHIEVEMENTS_MAP.get(id)
      if (ach) {
        newUnlocks.push(ach)
        unlockedSet.add(id)
      }
    }
  }

  next.unlocked = [...unlockedSet]
  return { newUnlocks, data: next }
}

// ─── Streak Helper ───────────────────────────────────────────────────────

export function updateStreak(
  lastVisitDate: string | null,
  consecutiveDays: number
): {
  newLastVisit: string
  newConsecutive: number
} {
  const today = new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  if (lastVisitDate === today) {
    // Already visited today — no change
    return { newLastVisit: today, newConsecutive: consecutiveDays }
  }

  if (lastVisitDate === yesterday) {
    // Visited yesterday — increment streak
    return { newLastVisit: today, newConsecutive: consecutiveDays + 1 }
  }

  // Streak broken or first visit
  return { newLastVisit: today, newConsecutive: 1 }
}

/**
 * Whole calendar days between `lastVisitDate` ("YYYY-MM-DD") and today.
 * Returns null when there's no prior visit to compare against.
 */
export function getDaysSinceLastVisit(lastVisitDate: string | null): number | null {
  if (!lastVisitDate) return null
  const today = new Date().toISOString().slice(0, 10)
  const msPerDay = 86400000
  return Math.round((Date.parse(today) - Date.parse(lastVisitDate)) / msPerDay)
}

export function getProgressCount(
  achId: string,
  data: Pick<
    AchievementsData,
    "totalLessonsCompleted" | "perfectCount" | "consecutiveDays" | "visitedCategories"
  >
): { current: number; max: number } | null {
  switch (achId) {
    case "first-lesson":
      return { current: Math.min(data.totalLessonsCompleted, 1), max: 1 }
    case "ten-lessons":
      return { current: Math.min(data.totalLessonsCompleted, 10), max: 10 }
    case "fifty-lessons":
      return { current: Math.min(data.totalLessonsCompleted, 50), max: 50 }
    case "first-perfect":
      return { current: Math.min(data.perfectCount, 1), max: 1 }
    case "three-perfect":
      return { current: Math.min(data.perfectCount, 3), max: 3 }
    case "ten-perfect":
      return { current: Math.min(data.perfectCount, 10), max: 10 }
    case "streak-3":
      return { current: Math.min(data.consecutiveDays, 3), max: 3 }
    case "streak-7":
      return { current: Math.min(data.consecutiveDays, 7), max: 7 }
    case "streak-30":
      return { current: Math.min(data.consecutiveDays, 30), max: 30 }
    case "first-category":
      return { current: Math.min(data.visitedCategories.length, 1), max: 1 }
    default:
      return null
  }
}
