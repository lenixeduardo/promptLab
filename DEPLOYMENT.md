# PromptLabz — Guia de Deploy

## Stack de Produção

| Serviço | Plataforma | Uso |
|---------|-----------|-----|
| Frontend | Vercel | Hospedagem do SPA |
| Backend | Supabase | Auth + Postgres + Edge Functions |
| Email | Resend | Emails transacionais |
| Monitoramento | Sentry (opcional) | Rastreamento de erros |

---

## 1. Configuração do Supabase

### Criar Projeto

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Anote a **Project URL** e a **anon key** (Dashboard → Settings → API)

### Rodar Migrations

```bash
# Instale o Supabase CLI
npm install -g supabase

# Faça login
supabase login

# Vincule ao projeto remoto
supabase link --project-ref SEU_PROJECT_REF

# Rode as migrations em produção
supabase db push
```

As migrations em `supabase/migrations/` serão aplicadas em ordem (26 arquivos atualmente, de `20260610_000` a `20260813_024`) — algumas das mais recentes:
- `20260610_000_initial_schema.sql` — tabelas base, RLS, trigger
- `20260610_001_users_premium.sql` — campos premium, indexes Stripe
- `20260610_002_community_tables.sql` — tabelas de comunidade (futuro)
- `20260813_022_lesson_completions.sql` — histórico de lições individuais (RLS append-only)
- `20260813_023_login_attempts.sql` — bookkeeping do rate limiter de login (service role only)
- `20260813_024_login_attempts_atomic.sql` — incremento atômico do contador de tentativas

Lista completa sempre em `ls supabase/migrations/` — este README lista só os marcos, não é exaustivo.

### Configurar Auth Providers

No painel do Supabase → Authentication → Providers:

**Email:** habilitado por padrão. Configure "Confirm email" conforme necessidade.

**Google OAuth:**
1. Crie credenciais em [console.cloud.google.com](https://console.cloud.google.com)
2. Authorized redirect URI: `https://SEU_PROJECT.supabase.co/auth/v1/callback`
3. Copie Client ID e Client Secret para o Supabase

**Apple OAuth:**
1. Requer Apple Developer Account ($99/ano)
2. Configure: Service ID, Team ID, Key ID, Private Key
3. Siga a [documentação do Supabase](https://supabase.com/docs/guides/auth/social-login/auth-apple)

### Configurar URLs de Redirect

Dashboard → Authentication → URL Configuration:

```
Site URL: https://seu-dominio.vercel.app
Redirect URLs:
  https://seu-dominio.vercel.app/auth/callback
  https://seu-dominio.vercel.app/login
  https://seu-dominio.vercel.app/reset-password
```

---

## 2. Deploy das Edge Functions

### Configurar Secrets

```bash
# Crie um arquivo .env.production com as variáveis das functions
supabase secrets set \
  APP_URL=https://seu-dominio.vercel.app \
  APP_NAME=PromptLabz \
  RESEND_API_KEY=re_... \
  RESEND_FROM_EMAIL=no-reply@seudominio.com \
  SEND_EMAIL_HOOK_SECRET=v1,...
```

### Deploy das Functions

```bash
# Deploy da function de email
supabase functions deploy send-auth-email --no-verify-jwt

# Verifique se está ativa
supabase functions list
```

### Rate limit de login (opcional, mas recomendado)

`login-rate-limited` bloqueia um e-mail por 15min após 5 tentativas de login falhas em 15min (ver `TRADEOFFS.md`). É **opcional por desenho**: o cliente cai automaticamente para o login direto se esta função não estiver implantada, então o app funciona normalmente sem ela — mas a proteção extra só liga depois de:

```bash
# 1. Aplique a migration que cria a tabela de tentativas
supabase db push   # ou: supabase migration up

# 2. Implante a function
supabase functions deploy login-rate-limited

# Não precisa de secrets extras — usa SUPABASE_URL/ANON_KEY/SERVICE_ROLE_KEY,
# já injetados automaticamente pelo runtime das Edge Functions.
```

### Configurar Hook de Email no Supabase

Dashboard → Authentication → Hooks → **Send Email Hook**:
1. Selecione: HTTPS
2. URL: `https://SEU_PROJECT.supabase.co/functions/v1/send-auth-email`
3. Gere o secret e salve como `SEND_EMAIL_HOOK_SECRET`

### Verificar Domínio no Resend

1. Acesse [resend.com](https://resend.com) e adicione seu domínio
2. Adicione os registros DNS fornecidos
3. `RESEND_FROM_EMAIL` deve ser um email do domínio verificado

---

## 3. Deploy no Vercel

### Via Dashboard

1. Acesse [vercel.com](https://vercel.com) e conecte o repositório
2. Framework Preset: **Vite**
3. Build Command: `pnpm build:prod`
4. Output Directory: `dist`
5. Instale o projeto

### Variáveis de Ambiente no Vercel

No painel do projeto → Settings → Environment Variables:

**Obrigatórias:**
```
VITE_SUPABASE_URL      = https://SEU_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGc...
```

**Opcionais (analytics e monitoramento):**
```
VITE_POSTHOG_KEY       = phc_...           # PostHog product analytics
VITE_POSTHOG_HOST      = https://us.i.posthog.com
VITE_GTAG_ID           = G-...             # Google Analytics/Ads
VITE_GTAG_CONVERSION_SIGNUP = AW-...       # Conversão de signup (Google Ads)
VITE_SENTRY_DSN        = https://...@sentry.io/...  # Error tracking
```

**Variáveis de build-time para Sentry source maps** (não aparecem no bundle):
```
SENTRY_ORG     = seu-org-slug
SENTRY_PROJECT = promptlabz
SENTRY_AUTH_TOKEN = sntrys_...   # Token com project:read + org:read + project:releases
```

> ⚠️ Variáveis com prefixo `VITE_` são expostas no bundle do cliente. Nunca coloque secrets do servidor aqui. `SENTRY_AUTH_TOKEN` é variável de build e nunca vai para o browser.

### Preview Deployments

O Vercel cria automaticamente previews para cada PR. Para que o auth funcione nos previews:

1. Adicione o padrão de URL de preview nas Redirect URLs do Supabase:
   ```
   https://*-lenixeduardo.vercel.app/auth/callback
   ```

---

## 4. Monitoramento (Opcional)

### Sentry

```bash
pnpm add @sentry/react
```

Configure `src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
})
```

Adicione `VITE_SENTRY_DSN` no Vercel com o DSN do seu projeto Sentry.

### Health Check

A Edge Function `health` (`supabase/functions/health/index.ts`) expõe um endpoint público e sem autenticação que confirma se a function está no ar e se ela consegue alcançar o Postgres (uma query `HEAD`/`count` sem ler dados nenhuma linha real):

```bash
supabase functions deploy health --no-verify-jwt

curl https://SEU_PROJECT.supabase.co/functions/v1/health
# { "status": "ok", "db": "reachable", "latencyMs": 42, "timestamp": "..." }
```

Aponte seu serviço de monitoramento (UptimeRobot, Better Uptime, cron simples etc.) para essa URL. Complementarmente, monitore incidentes de infraestrutura pelo [Supabase Status Page](https://status.supabase.com).

---

## 5. GitHub Actions Secrets (CI/CD)

Para o CI e os workflows automáticos funcionarem, configure os seguintes secrets em **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Obrigatório | Uso |
|--------|-------------|-----|
| `DAILY_NEWS_SECRET` | Para o cron de notícias | Autentica chamada à Edge Function `daily-tech-news` |
| `SUPABASE_URL` | Para o cron de notícias | URL do projeto Supabase |
| `SENTRY_AUTH_TOKEN` | Para source maps | Upload de source maps no build de produção |
| `SENTRY_ORG` | Para source maps | Slug da organização Sentry |
| `SENTRY_PROJECT` | Para source maps | Slug do projeto Sentry |

Os secrets `DAILY_NEWS_SECRET` e `SUPABASE_URL` são lidos pelo workflow `.github/workflows/daily-tech-news.yml` que roda diariamente às 07:00 UTC.

---

## 6. Checklist Pré-Deploy

```
[ ] supabase db push rodou sem erros (todas as migrations de `supabase/migrations/` aplicadas — confira a contagem com `ls supabase/migrations/ | wc -l`)
[ ] Edge Function send-auth-email deployada e testada
[ ] Hook de email configurado no Supabase Auth
[ ] VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY configurados no Vercel
[ ] Redirect URLs configuradas no Supabase (incluindo preview)
[ ] pnpm build roda sem erros localmente
[ ] Login com email, Google testados no preview
[ ] Reset de senha testado (email chega com template personalizado)
[ ] Progresso salva e sincroniza com DB
[ ] GitHub Actions secrets configurados (DAILY_NEWS_SECRET, SUPABASE_URL)
```

---

## 7. Rollback

Em caso de problema após deploy:

```bash
# Via Vercel CLI
vercel rollback

# Via Dashboard: Deployments → clique no deploy anterior → Redeploy
```

Para rollback de migrations no Supabase, execute o SQL inverso manualmente via SQL Editor no Dashboard (não há rollback automático).

---

## Variáveis de Ambiente — Referência Completa

### Frontend (Vercel)

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_SUPABASE_URL` | ✅ | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Chave pública do Supabase |
| `VITE_POSTHOG_KEY` | ❌ | API key do PostHog (product analytics) |
| `VITE_POSTHOG_HOST` | ❌ | Host do PostHog (default: us.i.posthog.com) |
| `VITE_GTAG_ID` | ❌ | ID do Google Analytics / Ads |
| `VITE_GTAG_CONVERSION_SIGNUP` | ❌ | ID de conversão de signup para Google Ads |
| `VITE_SENTRY_DSN` | ❌ | DSN do Sentry para monitoramento de erros |
| `VITE_PREVIEW_MODE` | ❌ | Ativa modo demo sem auth (NUNCA em produção) |

### Build-time (Vercel ou CI — não vão para o browser)

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `SENTRY_ORG` | ❌ | Slug da organização no Sentry |
| `SENTRY_PROJECT` | ❌ | Slug do projeto no Sentry |
| `SENTRY_AUTH_TOKEN` | ❌ | Token para upload de source maps |

### Edge Functions (Supabase)

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `APP_URL` | ✅ | URL do frontend (para links em emails) |
| `APP_NAME` | ✅ | Nome do app nos emails |
| `RESEND_API_KEY` | ✅ | Chave da API do Resend |
| `RESEND_FROM_EMAIL` | ✅ | Email remetente verificado |
| `SEND_EMAIL_HOOK_SECRET` | ✅ | Secret do webhook de email do Supabase |

### GitHub Actions Secrets

| Secret | Obrigatório | Descrição |
|--------|-------------|-----------|
| `DAILY_NEWS_SECRET` | Para cron de notícias | Autentica a chamada ao Edge Function |
| `SUPABASE_URL` | Para cron de notícias | URL do projeto Supabase (no Actions) |
| `SENTRY_AUTH_TOKEN` | Para source maps | Token de upload (se usar Sentry) |
