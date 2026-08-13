import type { Category } from "@/data/lessonsData"
import type { CategoryProgress } from "@/lib/db"
import type { TrailModule } from "@/components/LearningPathTrail"

/**
 * Derives the visual status of each category on the learning trail
 * based on the user's real progress data.
 *
 * Rules:
 *   - completed : every lesson in every module of this category is in completedLessonIds
 *   - current   : the first non-completed category (or the one with partial progress)
 *   - locked    : every category that comes after the current one
 */
export function computeTrailModules(
  progress: Record<string, CategoryProgress>,
  categories: Category[]
): TrailModule[] {
  let foundCurrent = false

  return categories.map((category): TrailModule => {
    const allLessonIds = category.modules.flatMap((mod) => mod.lessons.map((lesson) => lesson.id))

    const categoryProgress = progress[category.id]
    const completedLessonIds = categoryProgress?.completedLessonIds ?? []

    const isCompleted =
      allLessonIds.length > 0 && allLessonIds.every((id) => completedLessonIds.includes(id))

    if (isCompleted) {
      return { id: category.id, title: category.title, status: "completed" }
    }

    if (!foundCurrent) {
      foundCurrent = true
      return { id: category.id, title: category.title, status: "current" }
    }

    return { id: category.id, title: category.title, status: "locked" }
  })
}
