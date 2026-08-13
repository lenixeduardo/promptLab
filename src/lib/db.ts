import { supabase, isSupabaseConfigured, getErrorMessage } from "./supabase"
import { loadInventory, saveInventory, type StoredInventory } from "./inventory"

export interface CategoryProgress {
  currentModuleIndex: number
  currentLessonIndex: number
  completedLessonIds: string[]
}

export interface DbLessonCompletion {
  id: string
  track: string
  module_index: number
  completed_at: string
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  premium_status?: "free" | "trial" | "active" | "cancelled"
  trial_ends_at?: string | null
  xp?: number
  gems?: number
}

export interface DbResult<T> {
  data: T | null
  error: string | null
}

const profileColumns = "id,email,full_name,avatar_url,premium_status,trial_ends_at,xp,gems"
const LEGACY_PROGRESS_KEYS = ["promptlabz_progress", "promptlab_progress"] as const

function getProgressStorageKey(userId?: string) {
  return userId ? `promptlabz_progress:${userId}` : LEGACY_PROGRESS_KEYS[0]
}

// ── Profile Operations ────────────────────────────────────────────────────────

export async function getUserProfile(userId: string): Promise<DbResult<Profile>> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase não configurado" }
  }
  try {
    const { data, error } = await supabase
      .from("users")
      .select(profileColumns)
      .eq("id", userId)
      .single()

    if (error) throw error
    return { data: data as Profile, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao carregar perfil") }
  }
}

export async function updateUserProfile(
  userId: string,
  fullName: string
): Promise<DbResult<Profile>> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase não configurado" }
  }
  try {
    const { data, error } = await supabase
      .from("users")
      .upsert({ id: userId, full_name: fullName }, { onConflict: "id" })
      .select(profileColumns)
      .maybeSingle()

    if (error) throw error
    return { data: data as Profile, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao atualizar perfil") }
  }
}

export async function updateUserAvatar(
  userId: string,
  avatarUrl: string
): Promise<DbResult<Profile>> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase não configurado" }
  }
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ avatar_url: avatarUrl })
      .eq("id", userId)
      .select(profileColumns)
      .single()

    if (error) throw error
    return { data: data as Profile, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao atualizar avatar") }
  }
}

// ── Progress Operations ────────────────────────────────────────────────────────

export async function saveProgress(userId: string, categoryId: string, progress: CategoryProgress) {
  // Always update local storage
  updateLocalProgress(userId, categoryId, progress)

  if (!isSupabaseConfigured()) return { error: "Supabase não configurado" }

  try {
    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: userId,
        category_id: categoryId,
        completed_lessons: progress.completedLessonIds,
        current_module_index: progress.currentModuleIndex,
        current_lesson_index: progress.currentLessonIndex,
      },
      { onConflict: "user_id,category_id" }
    )

    if (error) throw error
    return { error: null }
  } catch (err) {
    return { error: getErrorMessage(err, "Erro ao salvar progresso") }
  }
}

export async function loadProgress(userId: string): Promise<Record<string, CategoryProgress>> {
  // Start with whatever is in local storage
  const localData = getLocalProgress(userId)

  if (!isSupabaseConfigured() || !userId) {
    return localData
  }

  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("category_id,completed_lessons,current_module_index,current_lesson_index")
      .eq("user_id", userId)

    if (error) throw error

    if (data && data.length > 0) {
      const dbProgress: Record<string, CategoryProgress> = { ...localData }
      data.forEach((row) => {
        dbProgress[row.category_id] = {
          currentModuleIndex: row.current_module_index,
          currentLessonIndex: row.current_lesson_index,
          completedLessonIds: row.completed_lessons || [],
        }
      })

      // Update local storage to stay in sync
      localStorage.setItem(getProgressStorageKey(userId), JSON.stringify(dbProgress))
      return dbProgress
    }
  } catch (err) {
    console.error(
      "Error loading progress from Supabase:",
      getErrorMessage(err, "Erro ao carregar progresso")
    )
  }

  return localData
}

// Sync local storage data to database when a user signs in
export async function syncLocalProgressToSupabase(userId: string) {
  if (!isSupabaseConfigured() || !userId) return { error: "Supabase não configurado" }

  try {
    const localData = getLocalProgress(userId)
    const promises = Object.entries(localData).map(([catId, progress]) => {
      return supabase.from("user_progress").upsert(
        {
          user_id: userId,
          category_id: catId,
          completed_lessons: progress.completedLessonIds,
          current_module_index: progress.currentModuleIndex,
          current_lesson_index: progress.currentLessonIndex,
        },
        { onConflict: "user_id,category_id" }
      )
    })

    const results = await Promise.all(promises)
    const failed = results.find((result) => result.error)
    if (failed?.error) throw failed.error
    return { error: null }
  } catch (err) {
    return { error: getErrorMessage(err, "Erro ao sincronizar progresso") }
  }
}

// Helper local storage functions
function getLocalProgress(userId?: string): Record<string, CategoryProgress> {
  try {
    const key = getProgressStorageKey(userId)
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)

    for (const legacyKey of LEGACY_PROGRESS_KEYS) {
      const legacySaved = localStorage.getItem(legacyKey)
      if (!legacySaved) continue

      const parsed = JSON.parse(legacySaved) as Record<string, CategoryProgress>
      localStorage.setItem(key, JSON.stringify(parsed))
      localStorage.removeItem(legacyKey)
      return parsed
    }

    return {}
  } catch {
    return {}
  }
}

function updateLocalProgress(userId: string, categoryId: string, progress: CategoryProgress) {
  try {
    const key = getProgressStorageKey(userId)
    const data = getLocalProgress(userId)
    data[categoryId] = progress
    localStorage.setItem(key, JSON.stringify(data))
  } catch (err) {
    console.error(
      "Error updating local progress storage:",
      getErrorMessage(err, "Erro ao atualizar storage local")
    )
  }
}

// ── Streak Operations ─────────────────────────────────────────────────────────

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string | null
}

export async function loadStreak(userId: string): Promise<DbResult<StreakData>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    const { data, error } = await supabase
      .from("user_streaks")
      .select("current_streak,longest_streak,last_visit_date")
      .eq("user_id", userId)
      .maybeSingle()

    if (error) throw error
    if (!data) return { data: null, error: null }
    return {
      data: {
        currentStreak: data.current_streak,
        longestStreak: data.longest_streak,
        lastVisitDate: data.last_visit_date ?? null,
      },
      error: null,
    }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao carregar streak") }
  }
}

export async function saveStreak(
  userId: string,
  params: { currentStreak: number; longestStreak: number; lastVisitDate: string }
): Promise<DbResult<void>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    const { error } = await supabase.from("user_streaks").upsert(
      {
        user_id: userId,
        current_streak: params.currentStreak,
        longest_streak: params.longestStreak,
        last_visit_date: params.lastVisitDate,
      },
      { onConflict: "user_id" }
    )
    if (error) throw error
    return { data: null, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao salvar streak") }
  }
}

// ── Leaderboard ───────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  id: string
  full_name: string | null
  avatar_url: string | null
  xp: number
}

export async function getLeaderboard(
  limit = 20,
  offset = 0
): Promise<DbResult<LeaderboardEntry[]>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    // `leaderboard_entries` is a narrow view (id, full_name, avatar_url, xp)
    // over public.users — it never exposes email or other sensitive columns.
    // See supabase/migrations/20260704_014_secure_leaderboard_and_xp.sql.
    const { data, error } = await supabase
      .from("leaderboard_entries")
      .select("id,full_name,avatar_url,xp")
      .gte("xp", 0)
      .order("xp", { ascending: false })
      .range(offset, offset + limit - 1)
    if (error) throw error
    return { data: data as LeaderboardEntry[], error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao carregar ranking") }
  }
}

export async function updateUserXP(
  userId: string,
  xp: number,
  gems?: number
): Promise<DbResult<void>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    // The client no longer has UPDATE grant on users.xp/gems. Syncing goes
    // through the sync_user_xp() SECURITY DEFINER function instead, which
    // only ever updates the caller's own row (auth.uid()) and enforces
    // sane per-call deltas server-side.
    // See supabase/migrations/20260704_014_secure_leaderboard_and_xp.sql.
    const { error } = await supabase.rpc("sync_user_xp", {
      new_xp: xp,
      new_gems: gems ?? null,
    })
    if (error) throw error
    return { data: null, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao sincronizar XP") }
  }
}

// ── News ──────────────────────────────────────────────────────────────────────

export interface DbNewsArticle {
  id: string
  title: string
  description: string
  category: "OpenAI" | "Anthropic" | "Google" | "ChatGPT" | "Meta" | "Microsoft" | "General"
  image_emoji: string
  image_url: string | null
  source_url: string | null
  published_at: string
}

export async function getNewsArticles(limit = 30, offset = 0): Promise<DbResult<DbNewsArticle[]>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    const { data, error } = await supabase
      .from("news_articles")
      .select("id,title,description,category,image_emoji,image_url,source_url,published_at")
      .eq("visible", true)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1)
    if (error) throw error
    return { data: data as DbNewsArticle[], error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao carregar notícias") }
  }
}

// ── Notifications ─────────────────────────────────────────────────────────────

export interface DbNotification {
  id: string
  user_id: string
  type: "achievement" | "mention" | "system" | "reminder"
  title: string
  description: string
  action_label: string | null
  href: string | null
  mention: boolean
  read_at: string | null
  created_at: string
}

export async function getNotifications(
  userId: string,
  limit = 50,
  offset = 0
): Promise<DbResult<DbNotification[]>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("id,user_id,type,title,description,action_label,href,mention,read_at,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)
    if (error) throw error
    return { data: data as DbNotification[], error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao carregar notificações") }
  }
}

export async function markNotificationsRead(userId: string): Promise<DbResult<void>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("read_at", null)
    if (error) throw error
    return { data: null, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao marcar notificações como lidas") }
  }
}

export async function insertNotification(
  userId: string,
  notification: {
    type: "achievement" | "mention" | "system" | "reminder"
    title: string
    description: string
    action_label?: string
    href?: string
    mention?: boolean
  }
): Promise<DbResult<DbNotification>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type: notification.type,
        title: notification.title,
        description: notification.description,
        action_label: notification.action_label ?? null,
        href: notification.href ?? null,
        mention: notification.mention ?? false,
      })
      .select()
      .single()
    if (error) throw error
    return { data: data as DbNotification, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao inserir notificação") }
  }
}

// ── Gems Sync ─────────────────────────────────────────────────────────────────

export async function updateUserGems(userId: string, gems: number): Promise<DbResult<void>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("xp")
      .eq("id", userId)
      .single()
    if (profileError) throw profileError
    const { error } = await supabase.rpc("sync_user_xp", {
      new_xp: (profile as { xp: number }).xp,
      new_gems: gems,
    })
    if (error) throw error
    return { data: null, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao atualizar gemas") }
  }
}

// ── Module (Trilha) Progress Sync ─────────────────────────────────────────────

// Persists how many modules the user completed in a track (a1/a2/a3). Called as a
// fire-and-forget side-effect after `advanceModule()`; localStorage remains the
// source of truth for immediate reads. See src/lib/moduleProgress.ts.
export async function saveModuleProgress(
  userId: string,
  track: string,
  completedCount: number
): Promise<DbResult<void>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    const { error } = await supabase.rpc("sync_module_progress", {
      p_track: track,
      p_completed_count: completedCount,
    })
    if (error) throw error
    return { data: null, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao sincronizar progresso da trilha") }
  }
}

// Hydrates module progress from Supabase (útil ao logar em um dispositivo novo ou
// após perda de localStorage). Caller merges with local data, taking the max per track.
export async function fetchModuleProgress(
  userId: string
): Promise<DbResult<Record<string, number>>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    const { data, error } = await supabase
      .from("user_module_progress")
      .select("track,completed_count")
      .eq("user_id", userId)
    if (error) throw error
    const result: Record<string, number> = {}
    for (const row of data ?? []) result[row.track] = row.completed_count
    return { data: result, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao carregar progresso da trilha") }
  }
}

// ── Lesson History ─────────────────────────────────────────────────────────

// Best-effort: fire-and-forget from Lesson.tsx when a lesson completes. The
// UNIQUE(user_id, track, module_index) constraint makes this safely retryable
// — a duplicate call for the same lesson is silently ignored, not an error.
export async function recordLessonCompletion(
  userId: string,
  track: string,
  moduleIndex: number
): Promise<DbResult<void>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    const { error } = await supabase
      .from("lesson_completions")
      .upsert(
        { user_id: userId, track, module_index: moduleIndex },
        { onConflict: "user_id,track,module_index", ignoreDuplicates: true }
      )
    if (error) throw error
    return { data: null, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao registrar lição concluída") }
  }
}

export async function getLessonCompletions(
  userId: string,
  limit = 20,
  offset = 0
): Promise<DbResult<DbLessonCompletion[]>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    const { data, error } = await supabase
      .from("lesson_completions")
      .select("id,track,module_index,completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .range(offset, offset + limit - 1)
    if (error) throw error
    return { data: data as DbLessonCompletion[], error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao carregar histórico de lições") }
  }
}

// ── Inventory Sync ────────────────────────────────────────────────────────────

// Sends the current local inventory (power-ups + avatares comprados) to Supabase.
// Called as an additional side-effect after a purchase; local storage remains the
// source of truth for offline/degraded mode.
export async function syncInventoryToServer(
  userId: string,
  inv: StoredInventory
): Promise<DbResult<void>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    const { error } = await supabase.from("user_inventory").upsert(
      {
        user_id: userId,
        boost_xp: inv.powerUps["boost-xp"] ?? 0,
        protection: inv.powerUps["protection"] ?? 0,
        focus_total: inv.powerUps["focus-total"] ?? 0,
        owned_avatar_ids: inv.ownedAvatarIds,
      },
      { onConflict: "user_id" }
    )
    if (error) throw error
    return { data: null, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao sincronizar inventário") }
  }
}

// Hydrates the inventory from Supabase (útil ao logar em um dispositivo novo),
// mesclando com o que já existe em localStorage para não perder compras feitas offline.
export async function fetchInventoryFromServer(userId: string): Promise<DbResult<StoredInventory>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    const { data, error } = await supabase
      .from("user_inventory")
      .select("boost_xp,protection,focus_total,owned_avatar_ids")
      .eq("user_id", userId)
      .maybeSingle()

    if (error) throw error
    if (!data) return { data: null, error: null }

    const local = loadInventory(userId)
    const merged: StoredInventory = {
      powerUps: {
        "boost-xp": Math.max(local.powerUps["boost-xp"] ?? 0, data.boost_xp ?? 0),
        protection: Math.max(local.powerUps["protection"] ?? 0, data.protection ?? 0),
        "focus-total": Math.max(local.powerUps["focus-total"] ?? 0, data.focus_total ?? 0),
      },
      ownedAvatarIds: Array.from(
        new Set([...local.ownedAvatarIds, ...(data.owned_avatar_ids ?? [])])
      ),
    }
    saveInventory(userId, merged)
    return { data: merged, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao carregar inventário") }
  }
}

// ── Content Tables ────────────────────────────────────────────────────────────

export interface DbTrendingSkill {
  id: string
  name: string
  description: string
  category: string
  author: string
  installs: string
  installs_count: number
  tags: string[]
  icon: string
  sort_order: number
}

export interface DbSkillTrailItem {
  id: string
  trail_item_id: string
  category_id: string
  name: string
  description: string
  icon: string
  level: number
  xp: number
  difficulty: string
  sort_order: number
}

export interface DbSkillTrailCategory {
  category_id: string
  label: string
  icon: string
  sort_order: number
  skill_trail_items: DbSkillTrailItem[]
}

export interface DbPrompt {
  id: string
  title: string
  difficulty: string
  color: string
  category: string
  prompt_text: string
  description: string
  example_input: string | null
  example_output: string | null
  sort_order: number
}

export interface DbLabCategory {
  category_id: string
  label: string
  icon: string
  prompt_count: number
  sort_order: number
}

export interface DbLabConfig {
  potd_title: string
  potd_description: string
  potd_category_id: string
}

export interface DbAchievementDefinition {
  ach_id: string
  title: string
  description: string
  icon: string
  category: string
  sort_order: number
}

export interface DbReview {
  id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
}

export async function getTrendingSkills(category?: string): Promise<DbResult<DbTrendingSkill[]>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase not configured" }
  try {
    let query = supabase.from("trending_skills").select("*").order("sort_order")
    if (category) query = query.eq("category", category)
    const { data, error } = await query
    if (error) throw error
    return { data: data ?? [], error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Failed to load skills") }
  }
}

export async function getSkillTrailCategories(): Promise<DbResult<DbSkillTrailCategory[]>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase not configured" }
  try {
    const { data, error } = await supabase
      .from("skill_trail_categories")
      .select("*, skill_trail_items(*)")
      .order("sort_order")
    if (error) throw error
    return { data: data ?? [], error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Failed to load skill trails") }
  }
}

export async function getPrompts(
  category?: string,
  difficulty?: string
): Promise<DbResult<DbPrompt[]>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase not configured" }
  try {
    let query = supabase.from("prompts").select("*").order("sort_order")
    if (category) query = query.eq("category", category)
    if (difficulty) query = query.eq("difficulty", difficulty)
    const { data, error } = await query
    if (error) throw error
    return { data: data ?? [], error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Failed to load prompts") }
  }
}

export async function getLabCategories(): Promise<DbResult<DbLabCategory[]>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase not configured" }
  try {
    const { data, error } = await supabase.from("lab_categories").select("*").order("sort_order")
    if (error) throw error
    return { data: data ?? [], error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Failed to load lab categories") }
  }
}

export async function getLabConfig(): Promise<DbResult<DbLabConfig>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase not configured" }
  try {
    const { data, error } = await supabase.from("lab_config").select("*").eq("id", 1).single()
    if (error) throw error
    return { data, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Failed to load lab config") }
  }
}

export async function getAchievementDefinitions(): Promise<DbResult<DbAchievementDefinition[]>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase not configured" }
  try {
    const { data, error } = await supabase
      .from("achievement_definitions")
      .select("*")
      .order("sort_order")
    if (error) throw error
    return { data: data ?? [], error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Failed to load achievement definitions") }
  }
}

// ── Reviews Operations ───────────────────────────────────────────────────────────

export interface ReviewInput {
  rating: number
  comment: string | null
}

export async function getReviews(limit = 50, offset = 0): Promise<DbResult<DbReview[]>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase not configured" }
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("id,user_id,rating,comment,created_at,updated_at")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)
    if (error) throw error
    return { data: data as DbReview[], error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Failed to load reviews") }
  }
}

export async function getUserReview(userId: string): Promise<DbResult<DbReview>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase not configured" }
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("id,user_id,rating,comment,created_at,updated_at")
      .eq("user_id", userId)
      .maybeSingle()
    if (error) throw error
    return { data: data as DbReview | null, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Failed to load user review") }
  }
}

export async function insertReview(
  userId: string,
  review: ReviewInput
): Promise<DbResult<DbReview>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase not configured" }
  try {
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: userId,
        rating: review.rating,
        comment: review.comment,
      })
      .select()
      .single()
    if (error) throw error
    return { data: data as DbReview, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Failed to insert review") }
  }
}

export async function updateReview(
  reviewId: string,
  userId: string,
  review: ReviewInput
): Promise<DbResult<DbReview>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase not configured" }
  try {
    const { data, error } = await supabase
      .from("reviews")
      .update({
        rating: review.rating,
        comment: review.comment,
      })
      .eq("id", reviewId)
      .eq("user_id", userId)
      .select()
      .single()
    if (error) throw error
    return { data: data as DbReview, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Failed to update review") }
  }
}

export async function deleteReview(reviewId: string, userId: string): Promise<DbResult<void>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase not configured" }
  try {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId)
      .eq("user_id", userId)
    if (error) throw error
    return { data: null, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Failed to delete review") }
  }
}

// ── Storage: lesson proof uploads ───────────────────────────────────────────

const LESSON_PROOFS_BUCKET = "lesson-proofs"

/**
 * Uploads a lesson-proof image to the private `lesson-proofs` Storage bucket,
 * scoped under `${userId}/...` so RLS on storage.objects can enforce
 * ownership (see supabase/migrations/20260813_021_lesson_proofs_storage.sql).
 * Returns the storage path (not a public URL — the bucket is private).
 */
export async function uploadLessonProof(
  userId: string,
  fileName: string,
  file: Blob
): Promise<DbResult<string>> {
  if (!isSupabaseConfigured()) return { data: null, error: "Supabase não configurado" }
  try {
    const path = `${userId}/${fileName}`
    const { error } = await supabase.storage
      .from(LESSON_PROOFS_BUCKET)
      .upload(path, file, { upsert: true })
    if (error) throw error
    return { data: path, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao enviar comprovação") }
  }
}
