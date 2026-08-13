-- Migration: Cria tabela de histórico individual de lições concluídas
-- Date: 2026-08-13
-- Author: PromptLab
-- Description: Antes desta migration não existia nenhum registro por-lição de
-- progresso — só um contador agregado por trilha (user_module_progress.completed_count).
-- Isso impedia qualquer tela de "histórico de lições" real: não havia como saber
-- QUAIS lições foram concluídas nem QUANDO, apenas quantas. Esta tabela é um log
-- de append (uma linha por lição concluída, com timestamp), consumido por
-- getLessonCompletions() em src/lib/db.ts com paginação real (.range()).
--
-- Nota de segurança: diferente de xp/gems/achievements (protegidos por funções
-- SECURITY DEFINER em 20260812_020, porque um valor forjado ali dá vantagem real
-- ao usuário — XP no ranking, conquistas desbloqueadas), uma linha forjada aqui
-- só polui o próprio histórico do usuário que a criou (não afeta XP, ranking,
-- certificados nem nenhum outro usuário) — RLS padrão (auth.uid() = user_id) é
-- suficiente. A constraint UNIQUE evita duplicatas por reenvio/retry.

CREATE TABLE IF NOT EXISTS public.lesson_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track TEXT NOT NULL CHECK (track IN ('a1', 'a2', 'a3', 'a4')),
  module_index INTEGER NOT NULL CHECK (module_index >= 0 AND module_index < 200),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, track, module_index)
);

ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own lesson completions" ON public.lesson_completions;
CREATE POLICY "Users can view own lesson completions" ON public.lesson_completions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own lesson completions" ON public.lesson_completions;
CREATE POLICY "Users can insert own lesson completions" ON public.lesson_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- No UPDATE/DELETE policy: completions are append-only, matching the rest of
-- the app's audit-trail-style tables (notifications, prompt_evaluation_usage).

CREATE INDEX IF NOT EXISTS lesson_completions_user_completed_at_idx
  ON public.lesson_completions (user_id, completed_at DESC);
