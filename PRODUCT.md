# PromptLabz — Definição de Produto

## Declaração do Problema

**"Ajuda estudantes e criadores iniciantes a praticar prompts e habilidades de IA sem depender de aulas soltas ou progresso manual."**

---

## Usuários-Alvo

### Primário: Estudante em Transição de Carreira

- Pessoa entre 20–35 anos querendo entrar na área de tecnologia ou IA
- Sente que "precisa aprender tudo" mas não sabe por onde começar
- Prefere aprender fazendo, com feedback imediato
- Usa celular para estudar nos intervalos do trabalho

### Secundário: Criador de Conteúdo Iniciante

- Influenciador ou freelancer que quer usar IA nas suas criações
- Não tem background técnico
- Quer templates prontos e habilidades práticas
- Aprende melhor com exemplos do mundo real

### Terciário: Desenvolvedor Júnior

- Programador iniciante que quer melhorar produtividade com IA
- Já usa ferramentas como GitHub Copilot mas quer dominar prompt engineering
- Busca skills específicas para seu stack

---

## MVP (v0.1) — Escopo Real

O MVP fechado que valida a hipótese central do produto — "gamificação com feedback imediato ensina prompt engineering melhor que aulas soltas" — tem 5 funcionalidades, não mais:

1. **Autenticação**: entrar/sair sem fricção (email+senha + Google OAuth)
2. **Trilhas de Aprendizado**: módulos sequenciais com lições interativas e feedback imediato — é o core loop que prova a hipótese
3. **Sistema de Vidas**: gamificação mínima que cria consequência e engajamento na prática
4. **Central de Skills**: contexto prático ("pra que serve isso") ligado às lições
5. **Perfil e Progresso**: prova de avanço, salvo local e sincronizado — sem isso o usuário não vê motivo para voltar

Tudo que vem depois (PromptLab/Analyzer/Enhancer/Challenge/Wars, Gems/Loja/Inventário/Missões, Certificados, Notícias, Templates, Comunidade/Ranking, app Android) foi construído em v0.2/v0.3 **depois** do MVP validado, incrementalmente — não é "MVP com 20 funcionalidades", é um produto que já passou da validação inicial. Ver [ROADMAP.md](./ROADMAP.md) para o que foi entregue em cada versão e [TRADEOFFS.md](./TRADEOFFS.md) para as decisões por trás de cada extensão.

## Funcionalidades Entregues (estado atual, v0.3)

1. **Autenticação**: Login/Signup com email+senha, Google OAuth e Apple OAuth
2. **Trilhas de Aprendizado**: Módulos sequenciais com lições interativas, exames e certificados
3. **Central de Skills**: Catálogo navegável de 80+ skills com busca, filtro e favoritos
4. **Suite de Prompt Tools**: PromptLab, PromptAnalyzer, PromptEnhancer, PromptChallenge e PromptWars
5. **Gamificação Completa**: Vidas, XP, Gems, Streak, Conquistas, Missões Diárias, Loja e Inventário
6. **Perfil e Progresso**: Acompanhamento de lições concluídas, salvo local e na nuvem
7. **Certificados**: PDF gerado ao concluir trilhas
8. **Feed de Notícias**: Notícias diárias de tech geradas por GitHub Actions
9. **Templates**: Catálogo de templates de prompts prontos para uso
10. **Comunidade e Ranking**: Leaderboard com pódio e página de comunidade
11. **App Android**: Build nativo via Capacitor

---

## Requisitos Funcionais

| #    | Requisito                                                   | Prioridade |
| ---- | ----------------------------------------------------------- | ---------- |
| RF01 | Usuário pode criar conta com email/senha                    | Alta       |
| RF02 | Usuário pode fazer login com Google                         | Alta       |
| RF03 | Usuário pode resetar senha via email                        | Alta       |
| RF04 | Progresso é salvo automaticamente (offline-first)           | Alta       |
| RF05 | Lições têm resposta correta/incorreta com feedback imediato | Alta       |
| RF06 | Skills podem ser buscadas por nome, autor, tag              | Alta       |
| RF07 | Usuário pode favoritar skills e prompts                     | Média      |
| RF08 | Ranking de skills por instalações e usuários por XP         | Média      |
| RF09 | Sistema de conquistas (achievements) desbloqueáveis         | Média      |
| RF10 | Perfil com avatar customizável                              | Média      |
| RF11 | Email de boas-vindas personalizado                          | Baixa      |
| RF12 | Assinatura Premium com conteúdo exclusivo                   | Alta       |
| RF13 | PromptLab: experimentação livre de prompts                  | Alta       |
| RF14 | PromptAnalyzer: análise de qualidade com pontuação          | Alta       |
| RF15 | PromptEnhancer: sugestão de melhoria de prompt              | Alta       |
| RF16 | PromptChallenge: desafios com critérios e pontuação         | Alta       |
| RF17 | PromptWars: batalha de prompts com placar                   | Média      |
| RF18 | Missões diárias com objetivos renováveis a cada 24h         | Alta       |
| RF19 | XP e Gems ganhos em lições, desafios e missões              | Alta       |
| RF20 | Loja com power-ups adquiríveis por Gems                     | Média      |
| RF21 | Inventário de itens adquiridos                              | Média      |
| RF22 | Certificado em PDF ao concluir trilha                       | Média      |
| RF23 | Feed de notícias tech atualizado diariamente                | Média      |
| RF24 | Templates navegáveis por categoria                          | Média      |
| RF25 | Notificações in-app (conquistas, streaks, novidades)        | Média      |
| RF26 | Streak de dias consecutivos de estudo                       | Média      |
| RF27 | Exame de módulo com resultado e pontuação                   | Alta       |
| RF28 | Onboarding guiado para novos usuários                       | Alta       |

---

## Requisitos Não-Funcionais

| #     | Requisito                           | Meta                                      |
| ----- | ----------------------------------- | ----------------------------------------- |
| RNF01 | Performance: First Contentful Paint | < 1.5s                                    |
| RNF02 | Build size (chunk principal)        | < 500 kB                                  |
| RNF03 | Disponibilidade                     | 99.5% uptime                              |
| RNF04 | Responsividade                      | Mobile-first, funciona em 320px+          |
| RNF05 | Acessibilidade                      | WCAG AA (foco visível, contraste, labels) |
| RNF06 | Segurança: senhas                   | Hash via Supabase Auth (bcrypt)           |
| RNF07 | Segurança: RLS                      | Usuário só acessa seus próprios dados     |
| RNF08 | SEO                                 | Meta tags por página via `PageSEO`        |
| RNF09 | App Android                         | APK gerado via Capacitor + GitHub Actions |
| RNF10 | Tema                                | Dark/light mode com persistência          |

---

## Regras de Negócio

### Autenticação

- Email deve ser válido (formato RFC 5322)
- Senha mínimo 6 caracteres
- Conta inativa por 90+ dias pode ser arquivada
- OAuth retorna para `/auth/callback`, redirecionando para `/home`
- Novo usuário passa pelo fluxo de `/onboarding` antes do `/home`

### Progresso

- Progresso é salvo no `localStorage` imediatamente (offline-first)
- Sincroniza com Supabase quando há conexão e usuário autenticado
- Legado: chaves antigas (`promptlab_progress`) são migradas automaticamente
- Lição só é marcada como completa ao responder corretamente
- Exame de módulo (`ModuleExam`) exige nota mínima para avançar

### Vidas

- Usuário começa com 5 vidas
- Perde 1 vida por resposta errada em lição
- Vidas se regeneram com o tempo (1 a cada 30 min)
- Com 0 vidas, não pode iniciar nova lição (deve esperar regeneração)
- Power-ups da loja podem restaurar vidas instantaneamente

### XP e Gems

- XP é ganho ao completar lições, desafios e missões — nunca pode ser comprado
- Gems são ganhos em atividades e podem futuramente ser adquiridos via IAP
- XP determina o ranking global de usuários
- Gems são a moeda da loja de power-ups
- Level up ocorre ao atingir limiares de XP definidos em `lib/levelTitles.ts`

### Streak

- Incrementado quando usuário completa ao menos 1 lição no dia
- Zerado se passa um dia sem atividade
- `StreakWidget` exibe chama animada quando streak >= 3 dias
- Atingir 7 dias consecutivos desbloqueia conquista de streak

### Missões Diárias

- Conjunto de objetivos renova a cada 24h (meia-noite local)
- Completar missão concede XP e Gems definidos em `lib/missions.ts`
- Missões não completadas no dia expiram sem acúmulo

### Favoritos

- Favoritos salvos em `localStorage` por nome de skill
- Sem limite de favoritos
- Favoritar a 1ª skill desbloqueia conquista "Primeiro Favorito"

### Conquistas

- Verificadas no cliente após cada ação relevante (lição, favorito, categoria visitada, streak, compra)
- Uma conquista desbloqueada não pode ser "revertida"
- Desbloqueio gera notificação in-app

### Certificados

- Gerado em PDF via `lib/certificatePdf.ts` ao concluir 100% de uma trilha
- Contém nome do usuário, nome da trilha, data e código único
- Disponível na página `Certificates` para download posterior

### Prompt Tools

- **PromptLab**: sem critério de acerto — feedback qualitativo apenas
- **PromptAnalyzer**: pontuação 0–100 baseada em clareza, especificidade, contexto e formato
- **PromptEnhancer**: recebe prompt do usuário e retorna versão melhorada com explicação das mudanças
- **PromptChallenge**: tem critérios de aceitação explícitos; pontuação afeta XP
- **PromptWars**: dois prompts competem; vencedor determinado por votação ou critério automático

### Loja e Inventário

- Itens comprados com Gems são persistidos em `lib/inventory.ts`
- Power-ups têm efeito imediato (restaurar vida) ou passivo (XP bônus por N lições)
- Itens consumíveis somem do inventário ao serem usados

### Premium

- Campos `premium_status`, `stripe_customer_id`, `trial_ends_at` existem no DB
- Update desses campos é bloqueado no cliente via RLS (só backend/webhook)
- Status possíveis: `free` | `trial` | `active` | `cancelled`
- Conteúdo premium exibe cadeado e redireciona para `Subscription` quando acessado por usuário `free`

### Feed de Notícias

- Workflow `daily-tech-news.yml` roda diariamente via GitHub Actions
- Conteúdo gerado é commitado/atualizado no repositório ou em tabela Supabase
- Usuário pode filtrar por categoria (IA, dev, ferramentas etc.)

---

## Transições de Estado

```
[Anônimo] → Signup → [Onboarding] → [Autenticado]
[Anônimo] → Login → [Autenticado]
[Autenticado] → Logout → [Anônimo]

# Fluxo de Lição
[Autenticado] → Inicia Lição → [Em Lição]
[Em Lição] → Resposta Correta → [Lição Completa]
[Em Lição] → Resposta Errada + Vidas > 0 → [Em Lição] (perde vida)
[Em Lição] → Resposta Errada + Vidas = 0 → [Bloqueado] (aguarda regeneração)
[Lição Completa] → Último da Trilha → [Missão Completa] → (gera Certificado)

# Fluxo de Exame
[Autenticado] → Inicia ModuleExam → [Em Exame]
[Em Exame] → Finaliza → [QuizResult] (aprovado/reprovado)
[QuizResult] → Aprovado → [LevelUp?] → [Home]
[QuizResult] → Reprovado → [LearningLab] (revisão)

# Fluxo de PromptChallenge
[Autenticado] → Seleciona Desafio → [Em PromptChallenge]
[Em PromptChallenge] → Submete Prompt → [LabResult] (pontuação + XP)

# Fluxo de Missões
[Autenticado] → Visita DailyMissions → [Vê Missões do Dia]
[Completa Objetivo] → [Missão Concluída] → (credita XP/Gems) → [DailyMissions atualizado]

# Fluxo de Loja
[Autenticado] → Visita Store → [Seleciona Item]
[Seleciona Item] → Gems suficientes → [Confirmação] → [Item no Inventário]
[Seleciona Item] → Gems insuficientes → [Bloqueado] (sugestão de missões)

# Fluxo de Premium
[free] → Acessa conteúdo premium → [Paywall] → Subscription
[Subscription] → Pagamento confirmado → [active]
[active] → Cancela → [cancelled] → (acesso até fim do período)
```

---

## Casos de Borda Mapeados

### Conectividade

- **Sem internet ao salvar progresso**: salva local, sincroniza ao reconectar
- **Token expirado**: Supabase renova automaticamente; se falhar, redireciona para login
- **Supabase offline**: app funciona em modo degradado (só localStorage)
- **Workflow de notícias falha**: página `News` exibe último conteúdo disponível ou empty state

### Dados Inválidos

- **Email mal formatado no signup**: erro inline no campo
- **Senha muito curta**: erro inline antes de chamar API
- **Nome vazio no perfil**: aceito (campo opcional)
- **Avatar URL inválida**: fallback para avatar padrão
- **Prompt vazio em PromptChallenge**: botão de submit desabilitado

### Limite de Recursos

- **Sem vidas restantes**: botão "Iniciar Lição" desabilitado com contador regressivo
- **Gems insuficientes na loja**: item bloqueado com sugestão de missões para ganhar gems
- **Categoria sem lições**: empty state com mensagem amigável
- **Skill não encontrada na busca**: empty state com mascote
- **Nenhuma skill favoritada**: empty state explicativo
- **Sem missões disponíveis (bug)**: exibe contador até próxima renovação

### Erros de API

- **Falha no signup**: mensagem de erro localizada no toast
- **Email já cadastrado**: mensagem específica "Este email já está em uso"
- **Credenciais inválidas no login**: mensagem genérica (não revela se email existe)
- **Erro no OAuth**: redireciona para `/login` com parâmetro de erro
- **Rate limit do Supabase**: `429` é capturado e exibe "Tente novamente em alguns segundos"
- **Falha na geração do certificado PDF**: toast de erro + botão de retry

### Edge Cases de UI

- **Clique duplo em submit**: botão é desabilitado durante loading
- **Navegação com back button**: estado da lição é preservado no router
- **Reload durante lição**: progresso local é restaurado do localStorage
- **Múltiplas abas**: a última a salvar prevalece (sem conflito ativo)
- **Tema alterado durante lição**: `ThemeProvider` aplica sem interromper sessão
- **Usuário completa missão já feita no dia**: idempotente, não credita novamente
