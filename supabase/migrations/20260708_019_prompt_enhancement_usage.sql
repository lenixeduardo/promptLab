-- ───────────────────────────────────────────────────────────────────────────────
-- Migration: prompt_enhancement_usage
--
-- Tracks per-user, per-day usage of the "enhance-prompt" Edge Function (the
-- optional AI-powered prompt enhancement in the Prompt Enhancer). The Edge
-- Function enforces the actual daily quota server-side using the service
-- role key; this table is just the counter it reads/writes. Mirrors
-- prompt_evaluation_usage (20260704_017).
-- ───────────────────────────────────────────────────────────────────────────────

create table if not exists public.prompt_enhancement_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  usage_date date not null default current_date,
  count integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, usage_date)
);

create index if not exists idx_prompt_enhancement_usage_user_date
  on public.prompt_enhancement_usage(user_id, usage_date);

alter table public.prompt_enhancement_usage enable row level security;

-- Users may read their own usage row (e.g. to show "3/15 used today" in the UI).
create policy "Users can view own enhancement usage"
  on public.prompt_enhancement_usage for select
  using (auth.uid() = user_id);

-- Only the Edge Function (service role) writes to this table.
create policy "Service role can manage enhancement usage"
  on public.prompt_enhancement_usage for all
  using (auth.role() = 'service_role');

grant select on public.prompt_enhancement_usage to authenticated;
grant all on public.prompt_enhancement_usage to service_role;
