// ═══════════════════════════════════════════════════════════════════════════
// Achievements — Persistence Layer (localStorage + Supabase)
// ═══════════════════════════════════════════════════════════════════════════

import { supabase, isSupabaseConfigured, getErrorMessage } from "./supabase"
import type { AchievementsData } from "./achievements"

export type DbResult<T> = { data: T | null; error: string | null }

// ─── Storage Key ─────────────────────────────────────────────────────────

const STORAGE_KEY = "pl:achievements"

// ─── Default / Empty Data ────────────────────────────────────────────────

export function getDefaultAchievementsData(): AchievementsData {
  return {
    unlocked: [],
    totalLessonsCompleted: 0,
    perfectCount: 0,
    lastVisitDate: null,
    consecutiveDays: 0,
    longestStreak: 0,
    visitedCategories: [],
    completedCategoryIds: [],
  }
}

// ─── localStorage (offline fallback / cache) ──────────────────────────────

export function loadAchievements(): AchievementsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultAchievementsData()
    return { ...getDefaultAchievementsData(), ...JSON.parse(raw) }
  } catch {
    return getDefaultAchievementsData()
  }
}

export function saveAchievements(data: AchievementsData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

// ─── Supabase ────────────────────────────────────────────────────────────

/**
 * Load achievements from Supabase for a given user.
 * Returns null if no row exists yet (new user).
 */
export async function loadAchievementsFromDb(
  userId: string
): Promise<DbResult<AchievementsData | null>> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase não configurado" }
  }

  try {
    const { data, error } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (error) {
      // PGRST116 = no rows found (new user, trigger hasn't run yet on local dev)
      if (error.code === "PGRST116") {
        return { data: null, error: null }
      }
      throw error
    }

    if (!data) return { data: null, error: null }

    const achievements: AchievementsData = {
      unlocked: data.unlocked_achievements ?? [],
      totalLessonsCompleted: data.total_lessons_completed ?? 0,
      perfectCount: data.perfect_count ?? 0,
      lastVisitDate: data.last_visit_date ?? null,
      consecutiveDays: data.consecutive_days ?? 0,
      longestStreak: data.longest_streak ?? 0,
      visitedCategories: data.visited_categories ?? [],
      completedCategoryIds: data.completed_category_ids ?? [],
    }

    return { data: achievements, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao carregar conquistas") }
  }
}

/**
 * Save (upsert) achievements to Supabase.
 */
export async function saveAchievementsToDb(
  userId: string,
  data: AchievementsData
): Promise<DbResult<null>> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase não configurado" }
  }

  try {
    const { error } = await supabase.rpc("sync_user_achievements", {
      p_unlocked_achievements: data.unlocked,
      p_total_lessons_completed: data.totalLessonsCompleted,
      p_perfect_count: data.perfectCount,
      p_last_visit_date: data.lastVisitDate,
      p_consecutive_days: data.consecutiveDays,
      p_visited_categories: data.visitedCategories,
      p_completed_category_ids: data.completedCategoryIds,
    })

    if (error) throw error
    return { data: null, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao salvar conquistas") }
  }
}

/**
 * One-shot sync: pushes any localStorage achievements to Supabase.
 * Safe to call on every login — only writes if there's local data.
 */
export async function syncLocalAchievementsToSupabase(userId: string): Promise<DbResult<null>> {
  let localData: AchievementsData | null = null

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      localData = JSON.parse(raw)
    }
  } catch {
    // ignore parse errors
  }

  if (!localData) {
    return { data: null, error: null } // nothing to sync
  }

  return saveAchievementsToDb(userId, localData)
}
