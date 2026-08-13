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

### Rate limit de autenticação: implementado como proxy opcional e "fail-open", em cima do que o Supabase GoTrue já garante

O cooldown de 3s em `Login.tsx` continua sendo só feedback de UX (evita duplo-clique), não proteção real por si só. A proteção de base continua vindo do rate limiting nativo do Supabase Auth (GoTrue). Além disso, `useAuth.ts::login()` agora tenta primeiro a Edge Function `login-rate-limited` (migration `20260813_023_login_attempts.sql`): bloqueia um e-mail por 15 min após 5 falhas em 15 min, usando uma tabela só acessível pelo service role.

**Decisão de arquitetura deliberada — "fail-open"**: como não há como implantar/testar esta Edge Function contra o projeto Supabase real a partir deste ambiente, o cliente (`tryRateLimitedLogin()` em `useAuth.ts`) só usa a resposta da função quando ela responde de forma inequívoca (sessão com `access_token`/`refresh_token` válidos, ou um 429/401 que a própria função decidiu retornar). Qualquer outra coisa — função não implantada (404), erro de rede, resposta em formato inesperado, falha ao hidratar a sessão via `setSession()` — cai automaticamente para o `supabase.auth.signInWithPassword()` direto, exatamente como era antes. Ou seja: login nunca fica bloqueado por causa desta função, mesmo que ela nunca seja implantada ou tenha um bug. A proteção liga sozinha assim que for implantada (`supabase functions deploy login-rate-limited` + aplicar a migration), sem nenhuma mudança de código adicional necessária. Coberto por 7 testes em `useAuth.test.ts` cobrindo sucesso, 429, 401, 404 (não implantada), erro de rede, formato inesperado e falha de `setSession`.

O incremento do contador de tentativas é atômico: em vez de um SELECT seguido de um UPSERT em JS (que deixaria requisições concorrentes para o mesmo e-mail lerem a mesma contagem antes de qualquer uma escrever, subcontando falhas), a Edge Function chama a função `record_failed_login_attempt` (migration `20260813_024_login_attempts_atomic.sql`), um único UPSERT `SECURITY DEFINER` no Postgres que o próprio banco serializa via lock de linha.

### Compra na Loja: falha silenciosa corrigida com rollback local

`Store.tsx::handleBuyAvatar/handleBuyPowerUp` chamava `await updateUserGems(...)` e `await syncInventoryToServer(...)` dentro de um `try/catch`, mas essas duas funções nunca lançam exceção em caso de erro — elas retornam `{ error }` (padrão `DbResult<T>` usado em todo `db.ts`). Isso significa que o `catch` nunca disparava para uma falha real do servidor: o toast de sucesso aparecia mesmo quando a gravação falhava, o usuário ficava com as gemas debitadas localmente e sem o item, e a próxima sincronização com o servidor podia reverter silenciosamente o item "comprado" da UI. Corrigido checando `gemsResult.error`/`syncResult.error` explicitamente e, em caso de falha, revertendo gemas (`saveLocalGems`) e inventário (`saveInventory`) ao estado anterior à compra — coberto por 4 testes novos em `Store.test.tsx`.

### MVP (v0.1) redefinido para 5 funcionalidades, produto atual descrito à parte

`PRODUCT.md` e `README.md` descreviam só o estado atual do produto (v0.3, 11+ funcionalidades) sem nunca isolar o que era, de fato, o MVP que validou a hipótese central. Isso foi corrigido: `PRODUCT.md` agora tem uma seção "MVP (v0.1) — Escopo Real" com as 5 funcionalidades centrais (auth, trilhas, vidas, skills, perfil/progresso), e o restante é explicitamente rotulado como construído depois, incrementalmente, sobre esse core validado.

### Avatar: dois catálogos paralelos e desincronizados (achado, não corrigido)

Existem hoje **dois sistemas de avatar independentes**: `AvatarScreen.tsx`/`AvatarProvider.tsx` (11 opções em `AVATAR_OPTIONS`, seleção salva só em `localStorage`, nunca chama `updateUserAvatar`) e `Store.tsx`/`Inventory.tsx` (17 opções em `AVATARS`, compra via `addAvatar`, persiste em `users.avatar_url` via `updateUserAvatar`). Os catálogos usam IDs e imagens diferentes e não convergem — dependendo de qual fluxo o usuário usa, o avatar escolhido pode não ser o mesmo em telas diferentes, e a persistência no servidor é inconsistente (um caminho salva, o outro não). **Decisão consciente de não corrigir agora**: unificar os dois sistemas é um refactor real (decidir qual catálogo é a fonte da verdade, migrar usuários com avatar já selecionado no fluxo que não persiste, tocar RLS/schema se necessário) — risco desproporcional para consertar numa sessão de auditoria, dado que "avatar" não é um fluxo crítico (auth, pagamento, progresso). Rastreado como parte da issue [#151](https://github.com/lenixeduardo/promptLabz/issues/151).

### Histórico de lições: não existe como dado, não é uma correção pontual

A issue [#150](https://github.com/lenixeduardo/promptLabz/issues/150) menciona "paginação no histórico de lições" — investigando o código, **não existe hoje nenhuma lista de lições individuais concluídas** para paginar. O que existe são só contadores agregados (`totalLessonsCompleted` em `Achievements.tsx`/`Profile.tsx`, um inteiro por trilha em `moduleProgress.ts`). Construir isso do zero exigiria um novo modelo de dado (tabela ou array por lição com data de conclusão) e uma tela nova — feature genuína, não um ajuste de paginação em uma lista que já existe. Documentando para não ser confundido com um "quick win" nas próximas rodadas de auditoria.

## Próximos Passos (priorizados)

**Curto prazo (v0.3, em andamento)**

- Abrir PR da branch de correções para `main` e deixar o CI rodar de fato (o commit com as correções desta auditoria só existe na branch de trabalho até isso acontecer — README/CHANGELOG/TRADEOFFS.md só ficam visíveis para quem olha `main` depois do merge)
- Paginação real (`.range()`) implementada em `getReviews`/`getNewsArticles`/`getNotifications`/`getLeaderboard`, com UI de "carregar mais" em `News.tsx`/`Notifications.tsx`/`Ranking.tsx`/`Community.tsx`. Falta só o histórico de lições — rastreado na issue [#150](https://github.com/lenixeduardo/promptLabz/issues/150)
- Upload real implementado para o print de comprovação de lição (`Lesson.tsx` → bucket privado `lesson-proofs` no Supabase Storage, RLS por `auth.uid()`, migration `20260813_021`). Falta ainda o avatar do usuário e o "Salvar Resultado" do laboratório — rastreado na issue [#151](https://github.com/lenixeduardo/promptLabz/issues/151)
- `getReviews` tinha paginação implementada mas nenhum consumidor real — corrigido: `Community.tsx` agora mostra uma seção "O que dizem sobre o PromptLabz" com reviews reais paginadas
- `supabase.integration.test.ts` reescrito para autenticar um usuário de teste real antes de gravar (hoje ele grava direto com a anon key sem sessão — rodar contra o projeto real quebraria por causa das políticas de RLS que exigem `auth.uid() = user_id`; a correção correta é subir um Supabase local efêmero no CI via `supabase start` + migrations, não usar a anon key de produção sem autenticação)
- Seeds/dados de demonstração para loja, missões e ranking
- CI: `pnpm smoke:supabase` e `pnpm test:e2e` foram adicionados ao workflow como passos não-bloqueantes (`continue-on-error: true`) para começar a gerar sinal real sem arriscar quebrar o pipeline por instabilidade de ambiente; promovê-los a bloqueantes depois de alguns ciclos verdes

**Médio prazo (v0.4)**

- Migrar conteúdo de `src/data` para tabelas do Supabase com seeds
- Unificar os dois catálogos de avatar (ver achado acima)
- Construir histórico de lições (dado + tela) do zero (ver achado acima)
- TypeScript strict mode
- Cache via Service Worker (PWA) para skills e trilhas

**Longo prazo (v1.0)**

- Stripe completo (checkout, webhook, portal de assinante)
- Modo offline real (PWA)
- API pública para integrações externas

Para o detalhamento completo, estimativas de esforço (S/M/L/XL) e status por item, veja [ROADMAP.md](./ROADMAP.md) e [CHANGELOG.md](./CHANGELOG.md).
