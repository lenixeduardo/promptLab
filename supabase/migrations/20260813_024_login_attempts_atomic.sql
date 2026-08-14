-- Migration: Torna o contador de tentativas de login atômico
-- Date: 2026-08-13
-- Author: PromptLab
-- Description: A Edge Function login-rate-limited/ originalmente fazia um
-- SELECT seguido de um UPSERT em JS para incrementar attempt_count — duas
-- requisições concorrentes contra o mesmo e-mail podiam ler o mesmo valor
-- antes de qualquer uma escrever, deixando mais de MAX_ATTEMPTS falhas
-- passarem antes do lockout realmente travar (race condition clássica de
-- "read-then-write"). Esta função resolve isso com um único UPSERT atômico
-- no Postgres (INSERT ... ON CONFLICT DO UPDATE), que o motor serializa
-- via lock de linha na constraint de unicidade do e-mail — concorrência
-- não quebra mais a contagem.

CREATE OR REPLACE FUNCTION public.record_failed_login_attempt(
  p_email TEXT,
  p_window_ms BIGINT,
  p_max_attempts INTEGER,
  p_lockout_ms BIGINT
)
RETURNS TABLE (attempt_count INTEGER, locked_until TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now TIMESTAMP WITH TIME ZONE := timezone('utc'::text, now());
  v_row public.login_attempts%ROWTYPE;
BEGIN
  INSERT INTO public.login_attempts (email, attempt_count, window_start, locked_until)
  VALUES (p_email, 1, v_now, NULL)
  ON CONFLICT (email) DO UPDATE SET
    attempt_count = CASE
      WHEN v_now - login_attempts.window_start > (p_window_ms || ' milliseconds')::interval
        THEN 1
      ELSE login_attempts.attempt_count + 1
    END,
    window_start = CASE
      WHEN v_now - login_attempts.window_start > (p_window_ms || ' milliseconds')::interval
        THEN v_now
      ELSE login_attempts.window_start
    END,
    -- Sempre limpa um locked_until antigo aqui: se este e-mail merece um
    -- novo lockout, o IF logo abaixo o define de novo a partir de v_now.
    -- Sem isso, um locked_until já expirado ficava travado para sempre e
    -- o e-mail nunca mais podia ser bloqueado de novo (bug corrigido nesta
    -- mesma migration antes de qualquer deploy).
    locked_until = NULL
  RETURNING * INTO v_row;

  -- Segundo UPDATE só para computar locked_until a partir do attempt_count
  -- já resolvido acima, evitando duplicar a mesma expressão CASE três vezes.
  IF v_row.attempt_count >= p_max_attempts THEN
    UPDATE public.login_attempts
    SET locked_until = v_now + (p_lockout_ms || ' milliseconds')::interval
    WHERE email = p_email
    RETURNING * INTO v_row;
  END IF;

  RETURN QUERY SELECT v_row.attempt_count, v_row.locked_until;
END;
$$;

REVOKE ALL ON FUNCTION public.record_failed_login_attempt(TEXT, BIGINT, INTEGER, BIGINT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_failed_login_attempt(TEXT, BIGINT, INTEGER, BIGINT) TO service_role;
