# Plano funcional — Prompt Enhancer

## 1. Definição do produto

### Problema

Usuários de IA escrevem prompts de forma apressada e genérica, sem estrutura de persona, contexto, formato ou restrições, e recebem respostas igualmente genéricas. Não têm uma ferramenta simples que reescreva prompts fracos em versões estruturadas localmente, sem depender de IA externa.

### Público

Estudantes, profissionais, freelancers e criadores que usam ChatGPT, Claude, Gemini ou outras IAs e querem escrever prompts melhores — mesmo sem conhecer técnicas de engenharia de prompt.

### Proposta de valor

**Ajuda qualquer pessoa a transformar prompts genéricos em instruções estruturadas, claras e acionáveis — tudo local, sem enviar texto para servidores externos.**

### Objetivo do módulo

Permitir que o usuário cole ou digite um prompt e receba instantaneamente uma versão reestruturada e melhorada, com campos opcionais para contexto, persona, formato, tom, público e restrições. O motor é determinístico e local (heurístico), mas preparado para versão futura com IA real.

---

## 2. Escopo do MVP

### Incluído

1. Atalho "Prompt Enhancer" na Home, imediatamente após o card do Analisador de Prompts.
2. Tela protegida com header (voltar, título, badge "Novo", saldo de gemas).
3. Entrada de texto: textarea para colar/digitar o prompt original.
4. Campos de refinamento opcionais expansíveis:
   - Persona / papel
   - Contexto / objetivo
   - Formato de saída desejado
   - Tom / estilo
   - Público-alvo
   - Restrições / limites
5. Motor local de enhancement: reescreve o prompt adicionando os campos preenchidos + heurísticas para campos vazios.
6. Resultado lado a lado (mobile: empilhado): original vs. melhorado.
7. Botão "Copiar prompt melhorado" com feedback.
8. Indicador visual de "melhoria" (score estimado de 0-10 comparando antes/depois).
9. Área "Como funciona" com 3 etapas.
10. Dica contextual sobre boas práticas de prompt.
11. Histórico em memória da sessão (prompts melhorados).
12. Modal de histórico com itens salvos.
13. Estado inicial, preenchimento, resultado, vazio e erro.
14. Layout mobile fiel à referência e adaptação responsiva para desktop.
15. Badge fixo "Novo" no header e na Home.

### Fora de escopo (MVP original — ver atualização na seção 5 e decisão 9)

- ~~Chamada a APIs de IA (OpenAI, Anthropic, Google) para enhancement real.~~ Implementado posteriormente via `enhance-prompt` (Gemini por padrão), com o motor local como fallback.
- Upload de arquivos.
- Análise de histórico de conversas inteiro (é função do Analisador).
- OCR, PDF, DOCX, imagens.
- Persistência de histórico em Supabase, banco ou localStorage.
- Sincronização entre dispositivos.
- Cobrança em gemas, XP, vidas ou assinatura.
- Edição manual do resultado (o usuário copia e edita externamente).
- Versões múltiplas do mesmo prompt.
- Download ou compartilhamento do resultado.

---

## 3. Entrada pela Home

### Posição

O atalho entra **imediatamente após o card "Analisador de Prompts"** e antes dos cards "Sequência diária" e "Gemas".

### Estrutura do card

- Ícone/ilustração: gatinha **engenheira de prompts** com capa de herói / sparkles (ícone `Wand2` ou `Sparkles` + `Wrench`).
- Título: **"Prompt Enhancer"**
- Badge fixo: **"Novo"**
- Descrição: **"Cole seu prompt e receba uma versão melhorada em segundos."**
- CTA visual: seta para a direita.
- Destino: `/prompt-enhancer`.

### Comportamento

- Card inteiro clicável.
- Hover: borda verde mais forte, leve elevação, seta deslocada.
- Foco por teclado: contorno 2 px, contraste 3:1.
- Pressionado: redução sutil de escala.
- Badge "Novo" permanente no MVP.

---

## 4. Jornada completa

### 4.1 Abertura

1. Usuário autenticado acessa a Home.
2. Encontra o atalho imediatamente após o card do Analisador.
3. Aciona o card.
4. Tela do enhancer abre no estado inicial.

### 4.2 Inserção do prompt

1. Textarea com placeholder: **"Cole ou digite seu prompt aqui…"**
2. Abaixo, botão "Melhorar prompt" (desabilitado enquanto vazio).
3. Opcional: seção expansível "Adicionar detalhes (opcional)" com campos de refinamento.

### 4.3 Enhancement

1. Usuário aciona "Melhorar prompt".
2. Textarea é substituído por estado "Melhorando…" com progresso simples.
3. Motor local processa o prompt + campos opcionais.
4. Resultado é exibido em ~500ms (simulado).

### 4.4 Resultado

1. Layout lado a lado (desktop) ou empilhado (mobile):
   - **Esquerda/topo:** Prompt original com badge "Original"
   - **Direita/baixo:** Prompt melhorado com badge "Melhorado ✨"
2. Score de melhoria estimado (ex: "Salto de qualidade: +3.2").
3. O que foi adicionado: lista de tags dos campos incluídos.
4. Botão "Copiar prompt melhorado" com feedback de cópia.
5. Botão "Nova melhoria" para limpar e começar de novo.
6. Entrada no histórico da sessão.

### 4.5 Histórico

1. "Ver melhorias anteriores" abre modal.
2. Lista prompts melhorados na sessão.
3. Selecionar item restaura o resultado.
4. Isolado por userId.
5. Recarga ou logout apaga.

### 4.6 Nova melhoria

1. Limpa prompt, resultado e campos opcionais.
2. Histórico permanece disponível.

---

## 5. Motor de enhancement

> **Atualização:** o Prompt Enhancer agora chama uma IA real (Edge Function
> `enhance-prompt`, provedor padrão Gemini — gratuito) para reescrever o
> prompt. O motor determinístico abaixo passou a ser o **fallback**: entra em
> ação apenas quando a IA está indisponível, sem chave configurada, ou com a
> cota diária do usuário esgotada — nesse caso a UI exibe um aviso "Motor
> local" e o resultado permanece consistente com o restante deste documento.
> Ver seção 13, decisão 9.

### Princípio (motor de fallback)

Quando a IA não está disponível, o app usa regras determinísticas para reestruturar o prompt. O motor:

1. **Analisa estrutura atual** do prompt (persona? ação? contexto? formato? restrições? tom? público? exemplos?)
2. **Identifica campos ausentes** entre os 8 critérios
3. **Monta template** com:
   - Persona (se fornecida ou ausente → `[especialista/papel]`)
   - Contexto (se fornecido ou inferido do texto)
   - Tarefa clara (extraída ou mantida)
   - Formato de saída
   - Tom / estilo
   - Público-alvo
   - Restrições / limites
4. **Gera prompt final** concatenando os blocos na ordem:
   ```
   [Persona] + [Contexto] + [Tarefa] + [Formato] + [Tom] + [Público] + [Restrições]
   ```

### Critérios de avaliação de melhoria

O score de melhoria é calculado comparando quantos dos 8 critérios estavam presentes no original vs. quantos estão presentes no melhorado:

| Critério | Peso |
|---|---|
| Persona definida | 1.5 |
| Ação clara (verbo) | 1.5 |
| Contexto / objetivo | 1.5 |
| Formato de saída | 1.0 |
| Tom / estilo | 1.0 |
| Público-alvo | 1.0 |
| Restrições / limites | 1.0 |
| Exemplos (few-shot) | 0.5 |

**Score original:** soma dos pesos dos critérios detectados no prompt bruto.
**Score melhorado:** soma dos pesos de todos os critérios (presentes no template).
**Salto:** score melhorado - score original (exibido como "+X.X").

### Campos de refinamento opcionais

| Campo | Placeholder | Exemplo |
|---|---|---|
| Persona / papel | "ex: especialista em marketing" | "Atue como um copywriter sênior" |
| Contexto / objetivo | "ex: preciso de um texto para newsletter" | "Preciso aumentar a taxa de abertura de emails" |
| Formato de saída | "ex: lista, tabela, parágrafo, json" | "Responda em formato de bullet points" |
| Tom / estilo | "ex: formal, divertido, técnico" | "Tom profissional mas acessível" |
| Público-alvo | "ex: iniciantes, CEOs, devs" | "Para pequenos empresários" |
| Restrições / limites | "ex: máx 200 palavras" | "Máximo 3 parágrafos, sem jargão técnico" |

---

## 6. Estrutura visual

### Ordem no estado inicial

1. Header (voltar, título, badge "Novo", gemas).
2. Card principal com textarea + botão.
3. Seção expansível "Adicionar detalhes".
4. Área "Como funciona" (3 etapas).
5. Dica.
6. Botão "Ver melhorias anteriores".
7. Navegação inferior.

### Header

- Botão voltar circular à esquerda.
- Bloco central: título "Prompt Enhancer", badge "Novo", descrição.
- Saldo de gemas à direita.

### Card de entrada

- Textarea grande com borda verde, cantos arredondados.
- Placeholder: *"Cole ou digite seu prompt aqui…"*
- Contador de caracteres no canto inferior direito.
- Botão "Melhorar prompt" verde, full width no mobile.
- Abaixo: "Grátis • Processamento local"

### Campos de refinamento

- Seção colapsável com `ChevronDown`.
- Rótulo: "Adicionar detalhes (opcional) — mais precisão no resultado".
- 6 campos de texto simples, empilhados.
- Cada um com label, ícone e placeholder.

### Estado de resultado

1. Layout duas colunas no desktop, empilhado no mobile.
2. Coluna esquerda/topo: **Original** — badge cinza, texto original.
3. Coluna direita/baixo: **Melhorado ✨** — badge verde, texto melhorado com diffs destacados.
4. Score de melhoria: badge com "+X.X" e seta pra cima verde.
5. Tags dos campos adicionados (ex: "Persona", "Formato", "Restrições").
6. Botão "Copiar prompt melhorado".
7. Botão "Nova melhoria" (secondary).

### Como funciona

Três etapas:
1. **Cole seu prompt** — Insira o texto que você quer melhorar.
2. **Adicione detalhes** — Preencha campos opcionais para refinar.
3. **Receba a versão melhorada** — Pronto para copiar e usar.

### Desktop

- Largura máxima confortável (~900px).
- Resultado em grid 2 colunas.
- Campos de refinamento em grid 2 colunas.

---

## 7. Estados e copy final

### 7.1 Estado inicial

**Header:**
- Título: **"Prompt Enhancer"**
- Badge: **"Novo"**
- Descrição: **"Transforme prompts genéricos em instruções poderosas."**
- Label acessível do saldo: **"Saldo de gemas: {saldo}"**
- Label do voltar: **"Voltar para a Home"**

**Entrada:**
- Placeholder: **"Cole ou digite seu prompt aqui…"**
- Label acessível textarea: **"Digite ou cole o prompt que deseja melhorar"**
- Botão: **"Melhorar prompt"** (desabilitado se vazio)
- Texto: **"Grátis • Processamento local"**
- Contador: **"{n} caracteres"**

**Refinamento:**
- Título: **"Adicionar detalhes (opcional)"**
- Subtítulo: **"Quanto mais detalhes, melhor o resultado."**
- Campos: Persona, Contexto, Formato, Tom, Público, Restrições.

### 7.2 Melhorando

- Textarea desabilitado.
- Botão mostra spinner + **"Melhorando…"**
- Mascote animada com sparkles.

### 7.3 Resultado

**Original:**
- Badge: **"Original"**
- Label: **"Seu prompt original"**

**Melhorado:**
- Badge: **"Melhorado ✨"**
- Label: **"Prompt com melhorias aplicadas"**

**Score:**
- **"Salto de qualidade: +{score}"**

**Tags:**
- **"Campos adicionados: Persona, Formato, Restrições"**

**Ações:**
- Botão: **"Copiar prompt melhorado"**
- Confirmação: **"Prompt copiado!"**
- Erro: **"Não foi possível copiar. Selecione o texto manualmente."**
- Botão: **"Nova melhoria"**

### 7.4 Estado vazio (textarea vazio)

- Botão desabilitado.
- Texto: **"Digite ou cole um prompt para começar."**

### 7.5 Histórico vazio

- Modal: **"Melhorias anteriores"**
- Título: **"Nenhuma melhoria anterior"**
- Texto: **"As melhorias concluídas nesta sessão aparecerão aqui."**
- Botão: **"Fechar"**

### 7.6 Histórico populado

- Modal: **"Melhorias anteriores"**
- Subtítulo: **"Disponíveis somente nesta sessão."**
- Item: **"{trecho do prompt original}…"**
- Metadado: **"Salto +{score} • {hora}"**
- Ação: **"Ver resultado"**
- Botão: **"Fechar"**

---

## 8. Regras de negócio

1. Usuário precisa estar autenticado.
2. Gratuito — zero gemas, zero XP.
3. Textarea aceita qualquer texto (sem limite de formato).
4. Limite de caracteres: 5000 caracteres por prompt.
5. Campos opcionais: limite de 200 caracteres cada.
6. Modo IA consulta um LLM externo (ver decisão 9) e por isso não é determinístico; o modo fallback (sem IA disponível) continua determinístico — mesmo input = mesmo output.
7. O prompt digitado só sai do dispositivo quando o modo IA está ativo (chamada autenticada à Edge Function `enhance-prompt`); no fallback local, nenhuma requisição de rede contém o texto digitado.
8. Histórico em memória, isolado por userId.
9. Recarga e logout apagam histórico.
10. "Nova melhoria" preserva histórico.
11. Badge "Novo" fixo e permanente.
12. Score de melhoria é puramente informativo.

---

## 9. Acessibilidade e comportamento

- Ordem de tabulação acompanha ordem visual.
- Textarea tem `aria-label` e `aria-describedby`.
- Botões têm nome acessível.
- Resultado usa `role="region"` e `aria-live="polite"`.
- Modal prende foco, fecha com `Esc`, devolve foco.
- Toast de cópia não recebe foco automaticamente.
- Contraste mínimo: 4.5:1 texto normal, 3:1 interface.
- `prefers-reduced-motion` respeitado.

---

## 10. Matriz de pontuação QA

| Área | Pontos | Condição |
|---|---|---|
| Entrada pela Home | 8 | Posição exata, card completo, badge fixo |
| Fidelidade visual mobile | 12 | Ordem, hierarquia, cores, cards fiéis à referência |
| Adaptação desktop | 6 | Grid 2 colunas, largura máxima, campos 2 colunas |
| Inserção e validação | 12 | Textarea, caracteres, botão desabilitado, limpeza |
| Campos de refinamento | 12 | 6 campos, colapsável, placeholders, preenchimento |
| Motor de enhancement | 16 | Template correto, pesos, score, tags, consistência |
| Estados e copy | 10 | Todos os estados com copy exata |
| Histórico por usuário | 8 | Memória de sessão, isolamento, modal, restauração |
| Privacidade | 6 | Zero envio/rede, mensagem de processamento local |
| Acessibilidade | 5 | Teclado, foco, modal, alertas, contraste |
| Testes e regressão | 5 | Casos críticos automatizados |
| **Total** | **100** | |

---

## 11. Assets e referências

### Mockup de referência
- `C:\Users\uzinh\Downloads\prompt-enhancer.png` (863×1823 px)

### Asset ilustrativo
- `C:\Users\uzinh\Downloads\prompt-asset.png` (1024×1536 px, RGBA)

### Padrão do projeto
- Seguir exatamente a estrutura visual e de componentes do Prompt Analyzer (`src/pages/PromptAnalyzer.tsx`)
- Usar `src/lib/promptParser.ts` e `src/lib/promptAnalyzer.ts` como referência de organização
- Reutilizar componentes existentes: `AppBottomNav`, `PrivateRoute`, tema, cores, badges

---

## 12. Arquivos a criar/modificar

| Arquivo | Ação | Descrição |
|---|---|---|
| `src/lib/promptEnhancer.ts` | **Criar** | Motor local de enhancement com template engine |
| `src/pages/PromptEnhancer.tsx` | **Criar** | Página completa do Prompt Enhancer |
| `src/pages/Home.tsx` | **Modificar** | Adicionar card "Prompt Enhancer" após o card do Analisador |
| `src/App.tsx` | **Modificar** | Adicionar rota `/prompt-enhancer` com `PrivateRoute` |
| `src/lib/promptEnhancer.test.ts` | **Criar** | Testes para o motor de enhancement |
| `docs/features/prompt-enhancer-functional-plan.md` | Este arquivo | Plano funcional |

---

## 13. Decisões registradas

1. **Enhancer é separado do Analyzer.** São complementares: um diagnostica, o outro transforma.
2. **Motor local e determinístico.** Protege privacidade e não cria custo variável.
3. **Campos opcionais colapsáveis.** Reduz fricção inicial mas permite refinamento.
4. **Score é ilustrativo.** Mostra "salto de qualidade" baseado em heurísticas, não em IA.
5. **Badge "Novo" é permanente no MVP.** Consistente com o padrão do Analisador.
6. **Resultado lado a lado no desktop.** Facilita comparação direta.
7. **Histórico não persiste.** Mesma política de privacidade do Analisador.
8. **Gratuito.** Mesmo modelo do Analisador.
9. **IA real com fallback determinístico (atualizado).** O Enhancer chama a Edge Function `enhance-prompt`, que consulta um LLM de verdade (Gemini por padrão — chave gratuita, sem cartão) e reescreve o prompt com base no modo de foco escolhido. Se a chamada falhar (sem chave configurada, erro de rede, ou cota diária por usuário esgotada), a UI cai silenciosamente para o motor local determinístico da seção 5, exibindo um aviso "Motor local" para não fingir uma origem que não ocorreu. Isso resolve a divergência identificada entre a comunicação visual da tela (mascote "trabalhando", texto "com foco em IA") e o comportamento real, que antes era 100% local.
10. **Asset da gatinha engenheira.** Usar `prompt-asset.png` como ilustração da feature.
