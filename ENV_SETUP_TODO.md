# Checklist — Variáveis de Ambiente Pendentes

Gerado pela auditoria de env vars (branch `claude/audit-env-variables-1u9vzw`).
O código e os `.env.example`/`DEPLOYMENT.md` já estão corretos e completos —
o que falta é preencher os **valores reais** nos painéis externos. Nenhuma
dessas ações pode ser feita por mim sem acesso às suas contas/credenciais.

---

## 1) Vercel (frontend) — Settings → Environment Variables

- [ ] `VITE_SUPABASE_URL` — **obrigatória**, sem ela o app quebra ao carregar (`src/lib/supabase.ts` faz `throw`)
- [ ] `VITE_SUPABASE_ANON_KEY` — **obrigatória**, mesmo motivo
- [ ] `VITE_POSTHOG_KEY` — opcional (analytics desabilitado se vazio)
- [ ] `VITE_POSTHOG_HOST` — opcional (default já cobre US cloud)
- [ ] `VITE_GTAG_ID` — opcional (Google Ads/GA4)
- [ ] `VITE_GTAG_CONVERSION_SIGNUP` — opcional (conversão de signup)
- [ ] `VITE_SENTRY_DSN` — opcional (error tracking)
- [ ] `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` — opcional, só para upload de source maps no build
- [ ] Confirmar que `VITE_PREVIEW_MODE` **não** está setada (ou está `false`) em produção — é bypass de auth

## 2) Supabase — Edge Function Secrets (`supabase secrets set ...`)

- [ ] `APP_URL` — usado em CORS, links de email e redirect do Stripe Checkout
- [ ] `APP_NAME` — opcional, default `PromptLabz`
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_FROM_EMAIL` — precisa ser de domínio verificado no Resend
- [ ] `SEND_EMAIL_HOOK_SECRET` — gerado ao configurar o Send Email Hook no Supabase Auth
- [ ] `DAILY_NEWS_SECRET`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_PRICE_ID`
- [ ] `STRIPE_WEBHOOK_SECRET` — só existe depois de criar o endpoint webhook (ver item 3)
- [ ] `ANTHROPIC_API_KEY` — opcional, fallback heurístico local já funciona sem ela
- [ ] Deploy das 5 Edge Functions: `stripe-checkout`, `stripe-webhook`, `daily-tech-news`, `send-auth-email`, `evaluate-prompt`

## 3) Stripe Dashboard

- [ ] Criar produto/preço recorrente do Premium → copiar `STRIPE_PRICE_ID`
- [ ] Copiar `STRIPE_SECRET_KEY` (Developers → API keys)
- [ ] Criar endpoint webhook apontando para `https://SEU_PROJECT.supabase.co/functions/v1/stripe-webhook` → copiar `STRIPE_WEBHOOK_SECRET`

## 4) Supabase Auth (dashboard, sem CLI)

- [ ] Configurar Send Email Hook (Authentication → Hooks) apontando para `send-auth-email`
- [ ] Configurar Site URL e Redirect URLs (incluindo padrão de preview do Vercel)
- [ ] Habilitar/configurar provedores OAuth (Google, Apple) se forem usados

## 5) GitHub Actions Secrets — Settings → Secrets and variables → Actions

- [ ] `DAILY_NEWS_SECRET` — para o cron `daily-tech-news.yml`
- [ ] `SUPABASE_URL` — idem (secret de CI, separado do auto-injetado nas Edge Functions)
- [ ] `SENTRY_AUTH_TOKEN` / `SENTRY_ORG` / `SENTRY_PROJECT` — se usar Sentry
- [ ] `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — para o workflow `android-build.yml`
- [ ] `KEYSTORE_BASE64` / `KEYSTORE_PASSWORD` / `KEY_ALIAS` / `KEY_PASSWORD` — só necessários para builds de release Android (tags `v*`)

## 6) Validação final

- [ ] Rodar `pnpm smoke:supabase` localmente com `.env.local` preenchido — deve imprimir "Supabase smoke check passed"
- [ ] Testar signup/login (com email chegando via Resend) em preview do Vercel
- [ ] Testar fluxo completo de Premium: clicar assinar → Stripe Checkout → retorno para `/community?subscribed=true` → status premium refletido no app
- [ ] Confirmar que o cron `daily-tech-news.yml` roda com sucesso (manual trigger via `workflow_dispatch`)
