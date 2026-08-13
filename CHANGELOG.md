# Changelog

Todas as mudanças notáveis do projeto são documentadas neste arquivo, por versão.
Formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).
Para o detalhamento completo por item e estimativas de esforço, veja [ROADMAP.md](./ROADMAP.md).

## [v0.3] — Em andamento

### Adicionado

- Suite de Prompt Tools: `PromptLab`, `PromptAnalyzer`, `PromptEnhancer`, `PromptChallenge`, `PromptWars`
- App Android via Capacitor com build nativo automatizado (`android-build.yml`)
- Feed de Notícias (`News`) com workflow diário automatizado (`daily-tech-news.yml`)
- Sistema de Templates (`Templates` + `TemplateDetail`)
- Loja e Inventário (`Store` + `Inventory`)
- Missões Diárias (`DailyMissions`)
- Sistema de XP e Gems (moeda dupla de progressão)
- Certificados em PDF ao concluir trilha
- Comunidade (`Community`)
- Ranking com pódio (`Ranking`)
- Módulo de Exame (`ModuleExam`, `QuickQuiz`, `QuizResult`)
- Onboarding guiado de primeiro acesso
- Fluxo de Assinatura Premium (UI; sem gateway de pagamento real ainda)

### Corrigido

- RLS de conquistas e progresso de módulo: revogado `INSERT`/`UPDATE` direto do client, substituído por funções `SECURITY DEFINER` com validação de deltas máximos e não-decréscimo (`20260812_020`)
- RLS de XP/gems e leaderboard: mesma classe de correção (`20260704_014`)
- Vazamento de e-mail completo em log de falha de login (`Login.tsx`)
- Integração `errorLogging.ts` → Sentry: referência a `window.Sentry` (nunca definida) trocada por import direto do SDK
- CORS multi-origem (`resolveCorsHeaders()`) conectado de fato nas Edge Functions `evaluate-prompt`, `stripe-checkout` e `stripe-webhook` (a primeira versão só tinha a função pronta, sem nenhum call site)
- Paginação real (`.range()`) em `getReviews`, `getNewsArticles` e `getNotifications`, com UI de "carregar mais" em `News.tsx` e `Notifications.tsx`
- Repositório inteiro formatado com Prettier e `format:check` promovido a gate no CI (estava configurado mas não aplicado)
- MVP (v0.1) isolado como seção própria em `PRODUCT.md`, separado do estado atual do produto (v0.3)

### Adicionado (continuação)

- Paginação real em `getLeaderboard`, com "carregar mais" em `Ranking.tsx`
- Seção "O que dizem sobre o PromptLabz" em `Community.tsx`, consumindo `getReviews` de verdade (antes a função tinha paginação implementada mas nenhum consumidor)
- Upload real de comprovação de lição (`Lesson.tsx`) para o bucket privado `lesson-proofs` no Supabase Storage, com RLS por `auth.uid()` (migration `20260813_021_lesson_proofs_storage.sql`); `localStorage` continua como cache local imediato (offline-first)
- Testes cobrindo os fluxos de paginação novos (`db.test.ts`, `News.test.tsx`, `Notifications.test.tsx`, `Community.test.tsx`) e o upload real de comprovação (`Lesson.proof.test.tsx`)
- Removida `getLessonProofUrl()` (helper de storage sem nenhum consumidor — mesmo padrão de "função sem uso real" já corrigido em `getReviews`)

### Pendente

- Paginação no histórico de lições
- Upload de avatar e "Salvar Resultado" do laboratório persistidos em Storage (issue #151)
- Testes de integração reais contra Supabase local (RLS + migrations)
- Seeds/dados de demonstração para loja, missões e ranking

## [v0.2] — Concluída

### Adicionado

- Notificações in-app com histórico persistido (conquistas, streaks, atualizações de conteúdo)
- Streak semanal com `StreakWidget` e `StreakFlame`
- Compartilhamento de skills via link direto (`/skill/nome`)
- Monitoramento de erros: `errorLogging.ts` + `ErrorTrackingDashboard` + `ErrorBoundary` com recuperação
- Modo dark/light (`ThemeProvider`, `ThemeToggle`)
- SEO básico por página (`PageSEO`)

### Técnico

- Tipagem TypeScript consistente em todos os módulos principais

## [v0.1] — MVP publicado

### Adicionado

- Autenticação completa (email/senha, Google OAuth, Apple OAuth)
- Trilhas de aprendizado com módulos e lições
- Central de Skills com 80+ skills catalogadas, busca, filtro por categoria e ranking
- Sistema de vidas (gamificação)
- Sistema de conquistas (achievements)
- Perfil com avatar customizável
- Progresso salvo localmente e sincronizado com Supabase (offline-first)
- Email de boas-vindas personalizado
- CI/CD com GitHub Actions (typecheck → lint → test → build)
- Cobertura inicial de testes (unit, integração, UI)

---

## Planejado

Veja [ROADMAP.md](./ROADMAP.md) para v0.4 (qualidade/observabilidade/comunidade) e v1.0 (monetização/escala), incluindo estimativas de esforço por item.
