-- Security fix: user_achievements and user_module_progress had RLS policies
-- that only checked row ownership (auth.uid() = user_id), with no validation
-- of the *values* being written. Since neither table had an explicit REVOKE,
-- authenticated clients had full column-level UPDATE/INSERT grants (the
-- Supabase default), so any logged-in user could call, e.g.:
--
--   supabase.from('user_achievements').upsert({ user_id: <own id>,
--     unlocked_achievements: [...all 50 ids], perfect_count: 999999 })
--
-- and instantly unlock every achievement/badge, or set Trilha module
-- progress to the max without completing any lessons (which also drives
-- certificate eligibility). This is the same bug class already fixed for
-- xp/gems in 20260704_014_secure_leaderboard_and_xp.sql — applying the same
-- "SECURITY DEFINER function with monotonic, capped-delta writes" pattern
-- here.

-- ── user_achievements ───────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can update own achievements" ON public.user_achievements;
-- "Users can view own achievements" (SELECT) is unaffected and stays as-is.
-- Row creation is handled by the handle_new_user() trigger (SECURITY
-- DEFINER); ongoing writes now only happen through sync_user_achievements().

REVOKE INSERT, UPDATE ON public.user_achievements FROM authenticated;

CREATE OR REPLACE FUNCTION public.sync_user_achievements(
  p_unlocked_achievements text[],
  p_total_lessons_completed integer,
  p_perfect_count integer,
  p_last_visit_date date,
  p_consecutive_days integer,
  p_visited_categories text[],
  p_completed_category_ids text[]
)
RETURNS void AS $$
DECLARE
  uid uuid := auth.uid();
  cur public.user_achievements%ROWTYPE;
  max_unlocked_delta CONSTANT integer := 10;
  max_lessons_delta CONSTANT integer := 200;
  max_perfect_delta CONSTANT integer := 200;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'sync_user_achievements: not authenticated';
  END IF;

  SELECT * INTO cur FROM public.user_achievements WHERE user_id = uid FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'sync_user_achievements: achievements row not found';
  END IF;

  IF p_total_lessons_completed IS NULL OR p_total_lessons_completed < cur.total_lessons_completed THEN
    RAISE EXCEPTION 'sync_user_achievements: total_lessons_completed cannot decrease';
  END IF;
  IF p_total_lessons_completed - cur.total_lessons_completed > max_lessons_delta THEN
    RAISE EXCEPTION 'sync_user_achievements: total_lessons_completed increase too large';
  END IF;

  IF p_perfect_count IS NULL OR p_perfect_count < cur.perfect_count THEN
    RAISE EXCEPTION 'sync_user_achievements: perfect_count cannot decrease';
  END IF;
  IF p_perfect_count - cur.perfect_count > max_perfect_delta THEN
    RAISE EXCEPTION 'sync_user_achievements: perfect_count increase too large';
  END IF;

  IF p_unlocked_achievements IS NULL OR NOT (cur.unlocked_achievements <@ p_unlocked_achievements) THEN
    RAISE EXCEPTION 'sync_user_achievements: unlocked_achievements cannot lose entries';
  END IF;
  IF cardinality(p_unlocked_achievements) - cardinality(cur.unlocked_achievements) > max_unlocked_delta THEN
    RAISE EXCEPTION 'sync_user_achievements: unlocked_achievements grew too fast';
  END IF;
  IF cardinality(p_unlocked_achievements) > 50 THEN
    RAISE EXCEPTION 'sync_user_achievements: too many unlocked achievements';
  END IF;

  IF p_visited_categories IS NULL OR NOT (cur.visited_categories <@ p_visited_categories) THEN
    RAISE EXCEPTION 'sync_user_achievements: visited_categories cannot lose entries';
  END IF;
  IF p_completed_category_ids IS NULL OR NOT (cur.completed_category_ids <@ p_completed_category_ids) THEN
    RAISE EXCEPTION 'sync_user_achievements: completed_category_ids cannot lose entries';
  END IF;

  IF p_consecutive_days IS NULL OR p_consecutive_days < 0 OR p_consecutive_days > 3650 THEN
    RAISE EXCEPTION 'sync_user_achievements: invalid consecutive_days value';
  END IF;

  UPDATE public.user_achievements
  SET unlocked_achievements = p_unlocked_achievements,
      total_lessons_completed = p_total_lessons_completed,
      perfect_count = p_perfect_count,
      last_visit_date = p_last_visit_date,
      consecutive_days = p_consecutive_days,
      visited_categories = p_visited_categories,
      completed_category_ids = p_completed_category_ids
  WHERE user_id = uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.sync_user_achievements(text[], integer, integer, date, integer, text[], text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_user_achievements(text[], integer, integer, date, integer, text[], text[]) TO authenticated;

-- ── user_module_progress ────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can insert own module progress" ON public.user_module_progress;
DROP POLICY IF EXISTS "Users can update own module progress" ON public.user_module_progress;
-- "Users can view own module progress" (SELECT) is unaffected and stays as-is.

REVOKE INSERT, UPDATE ON public.user_module_progress FROM authenticated;

CREATE OR REPLACE FUNCTION public.sync_module_progress(p_track text, p_completed_count integer)
RETURNS void AS $$
DECLARE
  uid uuid := auth.uid();
  cur_count integer;
  max_delta CONSTANT integer := 20;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'sync_module_progress: not authenticated';
  END IF;

  IF p_track NOT IN ('a1', 'a2', 'a3') THEN
    RAISE EXCEPTION 'sync_module_progress: invalid track';
  END IF;

  IF p_completed_count IS NULL OR p_completed_count < 0 OR p_completed_count > 200 THEN
    RAISE EXCEPTION 'sync_module_progress: invalid completed_count';
  END IF;

  SELECT completed_count INTO cur_count
  FROM public.user_module_progress
  WHERE user_id = uid AND track = p_track
  FOR UPDATE;

  IF NOT FOUND THEN
    IF p_completed_count > max_delta THEN
      RAISE EXCEPTION 'sync_module_progress: initial completed_count too large';
    END IF;
    INSERT INTO public.user_module_progress (user_id, track, completed_count)
    VALUES (uid, p_track, p_completed_count);
    RETURN;
  END IF;

  IF p_completed_count < cur_count THEN
    RAISE EXCEPTION 'sync_module_progress: completed_count cannot decrease';
  END IF;
  IF p_completed_count - cur_count > max_delta THEN
    RAISE EXCEPTION 'sync_module_progress: completed_count increase too large';
  END IF;

  UPDATE public.user_module_progress
  SET completed_count = p_completed_count
  WHERE user_id = uid AND track = p_track;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.sync_module_progress(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_module_progress(text, integer) TO authenticated;

-- ── prompt_evaluation_usage: atomic check-and-increment ────────────────────
-- The evaluate-prompt Edge Function used to read the current day's count,
-- compare it to the daily limit, and only then upsert count + 1 as two
-- separate round trips. Concurrent requests from the same user could all
-- read the same pre-increment count before any of them wrote back, letting
-- the daily quota (used to cap Anthropic API spend) be bypassed by firing
-- requests in parallel. This function folds the check and the increment
-- into one atomic upsert so concurrent callers serialize on the row's
-- unique constraint instead of racing on a stale read.

CREATE OR REPLACE FUNCTION public.increment_prompt_evaluation_usage(
  p_user_id uuid,
  p_usage_date date,
  p_daily_limit integer
)
RETURNS integer AS $$
DECLARE
  new_count integer;
BEGIN
  INSERT INTO public.prompt_evaluation_usage (user_id, usage_date, count, updated_at)
  VALUES (p_user_id, p_usage_date, 1, now())
  ON CONFLICT (user_id, usage_date) DO UPDATE
    SET count = public.prompt_evaluation_usage.count + 1,
        updated_at = now()
    WHERE public.prompt_evaluation_usage.count < p_daily_limit
  RETURNING count INTO new_count;

  -- NULL means the row already existed with count >= p_daily_limit, so the
  -- WHERE clause on the DO UPDATE suppressed the write — quota exhausted.
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.increment_prompt_evaluation_usage(uuid, date, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_prompt_evaluation_usage(uuid, date, integer) TO service_role;
