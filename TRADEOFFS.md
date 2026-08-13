# Trade-offs e Próximos Passos

Documento único consolidando as decisões técnicas "por que X e não Y" (antes espalhadas entre README.md e ROADMAP.md) e os próximos passos priorizados. Objetivo: qualquer avaliador entende as escolhas de arquitetura e o que falta em menos de 2 minutos.

## Decisões de Produto e Arquitetura

### Supabase em vez de Firebase
SQL + RLS nativo permite regras de segurança declarativas e queries relacionais complexas (necessárias para leaderboard, analytics futuro). Firebase exigiria mais lógica de autorização no client para as mesmas garantias.

### React SPA + Vite em vez de Next.js
O produto não é SEO-crítico (é um app autenticado, não um blog/marketing site). SSR traria complexidade de infraestrutura sem benefício real. Vite oferece HMR instantâneo e DX superior para uma SPA pura.

### Capacitor em vez de React Native
O app web já existe e está validado com usuários. Capacitor reutiliza 100% do código React para gerar o APK Android sem bifurcar a codebase. React Native exigiria reescrever a UI — custo alto antes de validar tração mobile. Trade-off aceito: performance nativa um degrau abaixo de RN puro.

### Conteúdo em `src/data` em vez de CMS
Acelera o MVP (sem infraestrutura de CMS/admin), mas cria acoplamento entre conteúdo e deploy. Migração para tabelas do Supabase está planejada na v0.4, quando houver volume de conteúdo que justifique o custo de infraestrutura (ver ROADMAP.md).

### Moeda dupla: XP + Gems
XP representa progresso não-monetizável (não pode ser comprado), preservando a integridade do ranking/leaderboard. Gems são a moeda da loja, ganháveis por conquistas e missões, e futuramente compráveis via IAP sem distorcer o ranking de XP.

### Campos premium no banco desde a v0.1
Evita uma migração de schema disruptiva quando o plano pago for implementado de fato (Stripe). O campo já existe e já é protegido por RLS, mesmo com o fluxo de cobrança ainda não conectado.

### PostHog + Google Ads/GA4 em vez de só GA4
PostHog cobre analytics de produto granular (funis, eventos customizados por fluxo de aprendizado); GA4/Ads cobre atribuição de conversão de tráfego pago. São ferramentas com propósitos diferentes, não redundantes.

### `src/lib/icons.ts` centralizando imports do lucide-react
Evita importar a biblioteca inteira (~700kB) — cada ícone é importado individualmente e re-exportado, preservando tree-shaking real no build do Vite.

### Streak e XP em localStorage com sync para Supabase
Garante responsividade mesmo offline (o usuário não espera round-trip de rede para ver o próprio progresso). Dados sensíveis a fraude (valor final de XP/gems, desbloqueio de conquistas) são sempre revalidados no servidor via funções `SECURITY DEFINER` com limites de delta — o client nunca escreve o valor final diretamente (ver migrations `20260704_014` e `20260812_020`).

### Rate limit de autenticação: gerenciado pelo Supabase GoTrue, não implementado no código do projeto
O cooldown de 3s em `Login.tsx` é feedback de UX, não proteção real contra brute-force — é contornável chamando a API diretamente. A proteção real contra tentativas excessivas de login vem do rate limiting nativo do Supabase Auth (GoTrue), fora do código deste repositório. Decisão consciente: implementar um proxy de rate-limit próprio (Edge Function + tabela de tentativas por IP/e-mail) seria over-engineering para o estágio atual do produto — revisitar se o produto sair do beta fechado.

## Próximos Passos (priorizados)

**Curto prazo (v0.3, em andamento)**
- Paginação/infinite scroll no histórico de lições e nas listagens do backend (`getReviews`, `getNewsArticles`, `getNotifications` hoje usam `LIMIT` fixo, sem `.range()`)
- `supabase.integration.test.ts` reescrito para autenticar um usuário de teste real antes de gravar (hoje ele grava direto com a anon key sem sessão — rodar contra o projeto real quebraria por causa das políticas de RLS que exigem `auth.uid() = user_id`; a correção correta é subir um Supabase local efêmero no CI via `supabase start` + migrations, não usar a anon key de produção sem autenticação)
- Seeds/dados de demonstração para loja, missões e ranking
- CI: `pnpm smoke:supabase` e `pnpm test:e2e` foram adicionados ao workflow como passos não-bloqueantes (`continue-on-error: true`) para começar a gerar sinal real sem arriscar quebrar o pipeline por instabilidade de ambiente; promovê-los a bloqueantes depois de alguns ciclos verdes

**Médio prazo (v0.4)**
- Migrar conteúdo de `src/data` para tabelas do Supabase com seeds
- Integrar Sentry de forma mais completa (eventos de `errorLogging.ts` além de exceções não tratadas)
- TypeScript strict mode + reativação de `no-explicit-any`/`no-unused-vars` no ESLint
- Cache via Service Worker (PWA) para skills e trilhas

**Longo prazo (v1.0)**
- Stripe completo (checkout, webhook, portal de assinante)
- Modo offline real (PWA)
- API pública para integrações externas

Para o detalhamento completo, estimativas de esforço (S/M/L/XL) e status por item, veja [ROADMAP.md](./ROADMAP.md) e [CHANGELOG.md](./CHANGELOG.md).
