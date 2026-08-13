# PromptLabz

**Plataforma de aprendizado de prompt engineering para estudantes e criadores que querem dominar IA sem depender de aulas soltas ou progresso manual.**

> **MVP (v0.1) em 5 funcionalidades:** autenticação · trilhas com lições interativas · sistema de vidas · central de skills · perfil/progresso. Esse core validou a hipótese do produto; tudo mais abaixo foi construído depois, incrementalmente, em v0.2/v0.3. Escopo exato em [PRODUCT.md](./PRODUCT.md#mvp-v01--escopo-real).

---

## O que é

PromptLabz ajuda estudantes em transição de carreira, criadores de conteúdo e devs iniciantes a praticar prompt engineering de forma gamificada: trilhas de lições, ferramentas interativas de prompt, sistema de vidas, conquistas, ranking e uma biblioteca de 80+ skills reais do [skills.sh](https://www.skills.sh/).

---

## Funcionalidades

Estado atual do produto (v0.3) — MVP + tudo que foi entregue depois, incrementalmente. Ver [ROADMAP.md](./ROADMAP.md) para o que foi entregue em cada versão.

<details>
<summary><strong>Ver todas as funcionalidades entregues (clique para expandir)</strong></summary>

### Aprendizado e Trilhas

- **Autenticação completa** — email/senha, Google OAuth, Apple OAuth, reset de senha via email personalizado com mascote
- **Trilhas de Aprendizado** — módulos sequenciais com lições interativas, feedback imediato e progresso persistido
- **Módulo de Exame** — avaliação ao término de módulos para validar aprendizado
- **Certificados** — geração de certificados em PDF ao concluir trilhas (com QR code e mascote)
- **Central de Skills** — 80+ skills catalogadas com busca full-text, filtro por categoria (7 categorias), ranking por instalações e favoritos
- **Onboarding** — fluxo de boas-vindas para novos usuários

### Ferramentas de Prompt

- **PromptLab** — editor interativo com avaliação em tempo real (clareza, especificidade, score)
- **PromptAnalyzer** — análise de conversas/mensagens com métricas de qualidade e sugestões
- **PromptEnhancer** — melhoria automática de prompts com sugestões contextuais
- **PromptChallenge** — desafios cronometrados de escrita de prompts
- **PromptWars** — modo duelo em tempo real (em breve)
- **Templates** — biblioteca de templates de prompt curados por categoria
- **Biblioteca de Prompts** — explorar, filtrar e usar prompts prontos por categoria

### Gamificação

- **Sistema de Vidas** — 5 vidas que se regeneram com o tempo; perde ao errar, incentiva foco
- **XP e Níveis** — ganhe XP completando lições; suba de nível a cada 500 XP
- **Gemas** — moeda in-game ganha por conquistas e missões; gasta na Loja
- **Loja** — avatares desbloqueáveis e power-ups comprados com gemas
- **Inventário** — gerencie avatares e power-ups adquiridos
- **Conquistas (Achievements)** — badges desbloqueados por consistência, exploração e volume
- **Streak** — rastreamento de dias consecutivos de prática (streak atual + recorde)
- **Missões Diárias** — tarefas diárias com recompensas em XP e gemas
- **LevelUp** — tela comemorativa animada ao subir de nível
- **Ranking** — pódio com top 3 e lista completa de usuários por XP

### Conteúdo e Comunidade

- **Feed de Notícias** — notícias diárias de tecnologia via GitHub Actions (cron 07:00 UTC)
- **Comunidade** — tela de comunidade e interação social
- **Roadmap** — página com o roadmap público do produto
- **Quiz Rápido** — quizzes de conhecimento com tela de resultado

### Perfil e Configurações

- **Perfil com Avatar** — customização de avatar, nome e acompanhamento de progresso por categoria
- **Configurações** — preferências do usuário e conta
- **Tema claro/escuro** — suporte completo a dark mode com `ThemeContext` e `ThemeToggle`
- **Tela de Notificações** (`/notifications`): filtros (Todas/Não lidas/Mentions), agrupamento por data
- **Tela de Favoritos** (`/favorites`): abas (Prompts/Templates/Notícias/Trilhas), estado vazio com CTA
- **Tela Premium/Paywall** (`/premium`): toggle Mensal/Anual (-40%), cards de preço, grid de benefícios, 7 dias grátis
- **Assinatura** — tela de gerenciamento de assinatura
- **Termos e Privacidade** — páginas legais

### Infraestrutura

- **Progresso offline-first** — salvo imediatamente em `localStorage`, sincronizado com Supabase ao reconectar
- **Bottom Navigation Bar** (`AppBottomNav`): navegação inferior fixa com ícones (Início, Trilha, Laboratório, Desafios, Notícias, Perfil)
- **Analytics** — PostHog para eventos de produto + Google Ads/GA4 para conversões
- **Error tracking** — Sentry integrado com painel de auditoria interno (`ErrorTrackingDashboard`)
- **Android** — app nativo via Capacitor (builds debug e release com Gradle)

</details>

---

## Stack

| Tecnologia               | Por quê                                                             |
| ------------------------ | ------------------------------------------------------------------- |
| React 18 + Vite          | SPA rápida; Vite oferece HMR instantâneo e build otimizado          |
| TypeScript               | Contratos claros entre componentes, hooks e camada de dados         |
| Tailwind CSS             | Estilo utilitário sem CSS separado; consistência visual fácil       |
| Supabase                 | Auth + Postgres + RLS gerenciado — sem servidor próprio             |
| Resend                   | Emails transacionais com template HTML próprio (mascote da marca)   |
| Capacitor                | Empacotamento do SPA como app Android nativo sem reescrever código  |
| PostHog                  | Analytics de produto com eventos customizados por fluxo             |
| Sentry                   | Error tracking e monitoramento em produção                          |
| Vitest + Testing Library | Testes unitários e de UI rápidos, compatível com Vite               |
| GitHub Actions           | CI com typecheck → lint → test → build em todo PR; cron de notícias |

---

## Arquitetura

```
Browser (React SPA)          Android (Capacitor)
  └── Pages → Hooks → lib/db → Supabase JS SDK
                                      │
                              ┌───────▼───────┐
                              │   Supabase     │
                              │  Auth (JWT)    │
                              │  Postgres+RLS  │
                              │  Edge Fns      │
                              └───────────────┘
```

**Padrões principais:**

- **Offline-first**: progresso salvo em `localStorage` antes de sincronizar com o banco
- **Lazy loading**: todas as páginas carregadas sob demanda com `React.lazy()`
- **Context API**: 4 contextos (Auth, Lives, Achievements, Theme) com escopo bem definido
- **RLS**: usuário só acessa seus próprios dados; campos premium bloqueados no banco

→ Detalhes completos em [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Como Rodar Localmente

### Pré-requisitos

- Node.js 22+
- pnpm 9+

### Setup

```bash
# 1. Clone e instale
git clone https://github.com/lenixeduardo/promptLabz.git
cd promptLabz
pnpm install

# 2. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase
```

### Com Supabase Local (recomendado para desenvolver)

```bash
# Inicie o Supabase local (requer Docker)
supabase start
supabase db reset

# Copie a URL e anon key exibidas para .env.local
pnpm dev
```

### Sem Supabase (modo degradado)

```bash
# O app funciona sem env configurado — progresso salvo apenas em localStorage
pnpm dev
```

Acesse `http://localhost:5173`

### Build Android

```bash
# Sincroniza o build web com o projeto Capacitor e abre no Android Studio
pnpm android:sync
pnpm android:open

# Builds diretos via Gradle
pnpm android:build:debug    # APK de debug
pnpm android:build:release  # APK de release
```

---

## Validação e Testes

```bash
pnpm typecheck        # TypeScript sem erros
pnpm lint             # ESLint (0 erros; warnings de qualidade visíveis, não bloqueiam)
pnpm format:check     # Prettier — formatação consistente
pnpm test             # Vitest (294 testes — unit + integração + UI)
pnpm test:e2e         # Playwright E2E (6 specs de fluxos críticos)
pnpm build            # Build de produção
```

**Cobertura atual:** hooks, components, pages, contexts — 36 arquivos de teste Vitest + 6 specs Playwright.

---

## Screenshots

> Acesse em: **[promptlabz.vercel.app](https://promptlabz.vercel.app)**

| Home                                                            | Atividade interativa                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------ |
| ![Home — progresso, streak e trilha](./homepage-screenshot.png) | ![Atividade de lição em andamento](./activity-demo-full.png) |

| Preencher lacuna (respondido)                                      | Ordenar etapas                                  |
| ------------------------------------------------------------------ | ----------------------------------------------- |
| ![Fill-in-the-blank respondido](./activity-fillblank-answered.png) | ![Atividade de ordenação](./activity-order.png) |

| Combinar pares                                       | Home (mobile)                                                |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| ![Atividade de combinar pares](./activity-match.png) | ![Home em viewport mobile](./homepage-mobile-screenshot.png) |

---

## Deploy

Veja o guia completo em [DEPLOYMENT.md](./DEPLOYMENT.md).

**Resumo:**

1. Configure projeto no Supabase e rode as migrations (`supabase db push`)
2. Configure Google/Apple OAuth no painel do Supabase
3. Deploy das Edge Functions (`send-auth-email`, `daily-tech-news`, `stripe-checkout`) com Resend e segredos configurados
4. Conecte o repo no Vercel com `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` e variáveis opcionais de PostHog/Sentry/Google Ads
5. Para o feed de notícias: configure `SUPABASE_URL` e `DAILY_NEWS_SECRET` nos secrets do repositório GitHub

---

## Estrutura de Pastas

```
src/
├── components/    # UI reutilizável (AppBottomNav, ErrorBoundary, ThemeToggle, StreakWidget...)
├── contexts/      # Estado global (Auth, Lives, Achievements, Theme)
├── hooks/         # Lógica de negócio (useAuth, useFavorites, useStreak, useRetry...)
├── pages/         # Uma página por rota (~65 páginas)
├── lib/           # Supabase client, db helpers, xp, streak, analytics, errorLogging, certificatePdf...
└── data/          # Conteúdo estático (lições, skills, prompts, templates, missões, power-ups, loja...)
supabase/
├── functions/     # Edge Functions (send-auth-email, daily-tech-news, stripe-checkout)
└── migrations/    # SQL versionado
android/           # Projeto Capacitor Android (gerado — não editar manualmente)
```

---

## Decisões Técnicas

> Versão resumida abaixo. Lista completa + próximos passos priorizados em [TRADEOFFS.md](./TRADEOFFS.md).

- **Supabase** em vez de Firebase: SQL + RLS nativo permite segurança declarativa e queries complexas para analytics futuro
- **Conteúdo em `src/data`** em vez de CMS: acelera o MVP — migração para DB planejada na v0.3
- **React SPA** em vez de Next.js: produto não é SEO-crítico; SSR traria complexidade sem benefício real
- **Capacitor** em vez de React Native: reutiliza 100% do código web existente; trade-off em performance nativa aceito para MVP
- **PostHog + Google Ads** em vez de só GA4: PostHog para análise de produto granular; GA4/Ads para rastrear conversões de tráfego pago
- **Campos premium no banco desde o v0.1**: evita migração futura quando o plano pago for implementado; update protegido por RLS
- **`src/lib/icons.ts`** centraliza imports de lucide-react para tree-shaking, evitando importar toda a biblioteca (700+ kB)
- **Bottom nav e componentes compartilhados** (`AppPageHeader`, `PillTabs`) criados como componentes configuráveis, sem refatorar páginas existentes
- **Streak e XP em localStorage com sync Supabase**: garante responsividade mesmo offline; dados sensíveis (plano, dono do recurso) sempre validados no servidor

---

## Demo

> **Acesse em:** [promptlabz.vercel.app](https://promptlabz.vercel.app)
>
> **Ou rode localmente:**
>
> 1. Clone o repositório: `git clone https://github.com/lenixeduardo/promptLabz.git`
> 2. Instale as dependências: `pnpm install`
> 3. Inicie o servidor: `pnpm dev`
> 4. Acesse `http://localhost:5173` — o app funciona **sem credenciais Supabase** (modo degradado com dados locais)

---

## Credenciais Demo

Para testar o fluxo completo (login, progresso, XP, streak, conquistas) sem jogar do zero, popule o banco local/dev com 5 usuários de teste já com histórico:

```bash
SUPABASE_SERVICE_ROLE_KEY=... VITE_SUPABASE_URL=... node scripts/seed-test-users.mjs
```

| Usuário                    | E-mail                        | Senha                  | Perfil                                                              |
| -------------------------- | ----------------------------- | ---------------------- | ------------------------------------------------------------------- |
| Ana                        | `teste.ana@promptlabz.dev`    | `TestePromptLabz2026!` | Iniciante, poucos módulos concluídos                                |
| Bruno, Carla, Diego, Elisa | `teste.{nome}@promptlabz.dev` | `TestePromptLabz2026!` | Progresso crescente por persona (ver `scripts/seed-test-users.mjs`) |

> Requer a service role key do projeto Supabase (nunca rode contra produção sem certeza — cria contas reais).

---

## Roadmap

| Versão   | Foco                                                                                                   | Status                |
| -------- | ------------------------------------------------------------------------------------------------------ | --------------------- |
| **v0.1** | MVP: auth, trilhas, skills, gamificação                                                                | ✅ Publicado          |
| **v0.2** | Notificações in-app, Favoritos, Premium UI, Ranking, streak, ferramentas de prompt, Android, dark mode | ✅ Concluído          |
| **v0.3** | Stripe real, Sentry, testes E2E, comunidade, PostHog analytics                                         | 🔨 Em desenvolvimento |
| **v1.0** | Premium real, certificados públicos, PWA offline, Prompt Wars ao vivo                                  | 🔮 Futuro             |

→ Detalhes e estimativas em [ROADMAP.md](./ROADMAP.md)

---

## Documentação

| Arquivo                                | Descrição                                                             |
| -------------------------------------- | --------------------------------------------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md)   | Design do sistema, fluxo de dados, banco, decisões                    |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Tokens de design, paleta, tipografia, componentes, animações          |
| [PRODUCT.md](./PRODUCT.md)             | Requisitos, regras de negócio, casos de borda                         |
| [PERSONAS.md](./PERSONAS.md)           | Perfis dos usuários-alvo                                              |
| [ROADMAP.md](./ROADMAP.md)             | Versões, features planejadas, estimativas de esforço                  |
| [CHANGELOG.md](./CHANGELOG.md)         | Histórico de mudanças por versão (v0.1, v0.2, v0.3...)                |
| [TRADEOFFS.md](./TRADEOFFS.md)         | Decisões técnicas ("por que X e não Y") e próximos passos priorizados |
| [DEPLOYMENT.md](./DEPLOYMENT.md)       | Guia de deploy Vercel + Supabase + variáveis de ambiente              |
| [CONTRIBUTING.md](./CONTRIBUTING.md)   | Como contribuir, convenções, testes                                   |
