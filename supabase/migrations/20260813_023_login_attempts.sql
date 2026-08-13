-- Migration: Cria tabela de tentativas de login para rate limiting real
-- Date: 2026-08-13
-- Author: PromptLab
-- Description: TRADEOFFS.md documentava como decisão consciente NÃO implementar
-- rate limit de login próprio, dependendo só do rate limiting nativo do Supabase
-- GoTrue. Esta migration + a Edge Function login-rate-limited/ implementam uma
-- camada adicional real: bloqueio temporário por e-mail após MAX_ATTEMPTS falhas
-- numa janela de tempo, contornando a limitação de que o cooldown de 3s do
-- Login.tsx era só cosmético (client-side, contornável chamando a API direto).
--
-- Esta tabela só é lida/escrita pela Edge Function (service role) — nenhum
-- client autenticado ou anônimo tem qualquer grant sobre ela. Chaveada por
-- e-mail (não user_id) porque tentativas de login acontecem antes de sabermos
-- se o usuário existe.

CREATE TABLE IF NOT EXISTS public.login_attempts (
  email TEXT PRIMARY KEY,
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  locked_until TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Nenhuma policy para anon/authenticated — acesso exclusivo do service_role,
-- que ignora RLS por padrão. Não há GRANT nenhum para anon/authenticated.
REVOKE ALL ON public.login_attempts FROM anon, authenticated;
GRANT ALL ON public.login_attempts TO service_role;
