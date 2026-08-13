import type { TrackId } from "@/lib/moduleProgress"

// ── Tipos de atividade ─────────────────────────────────────────────────

export type ActivityType = "multiple-choice" | "fill-blank" | "match" | "order" | "essay"

/** Questão dissertativa — resposta livre com gabarito de referência */
export type EssayActivity = {
  id: string
  type: "essay"
  prompt: string
  placeholder?: string
  referenceAnswer: string
}

/** Multiple choice (existente) */
export type Question = {
  id: string
  prompt: string
  options: { id: string; text: string }[]
  correct: string
  explanation: string
  hint?: string
}

/** Completar frase — lacuna {___} com opções de palavra */
export type FillBlankActivity = {
  id: string
  type: "fill-blank"
  sentence: string // frase com {___} para lacuna
  options: { id: string; text: string }[]
  correct: string
  explanation: string
  hint?: string
}

/** Ligar palavra → significado */
export type MatchActivity = {
  id: string
  type: "match"
  instruction: string
  pairs: { word: string; definition: string }[]
  correctPairs: Record<string, string>
  explanation: string
}

/** Conectar itens entre duas colunas */
export type OrderActivity = {
  id: string
  type: "order"
  instruction: string
  leftItems: { id: string; text: string }[]
  rightItems: { id: string; text: string }[]
  correctPairs: Record<string, string> // leftId → rightId
  explanation: string
}

// ── Slide de Conteúdo (aparece ANTES das atividades) ──────────────────────

export type ContentSlideBlock =
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "quote"; text: string }
  | { type: "code"; language: string; code: string }
  | { type: "mind-map"; title: string; branches: { label: string; children: string[] }[] }
  | { type: "tip"; text: string }
  | { type: "example"; label: string; before: string; after: string }

export type ContentSlide = {
  id: string
  type: "content-slide"
  blocks: ContentSlideBlock[]
}

export type LessonActivity =
  Question | FillBlankActivity | MatchActivity | OrderActivity | EssayActivity | ContentSlide

// ── Guards ─────────────────────────────────────────────────────────────
export function isFillBlank(a: LessonActivity): a is FillBlankActivity {
  return (a as FillBlankActivity).type === "fill-blank"
}
export function isMatch(a: LessonActivity): a is MatchActivity {
  return (a as MatchActivity).type === "match"
}
export function isOrder(a: LessonActivity): a is OrderActivity {
  return (a as OrderActivity).type === "order"
}
export function isEssay(a: LessonActivity): a is EssayActivity {
  return (a as EssayActivity).type === "essay"
}
export function isContentSlide(a: LessonActivity): a is ContentSlide {
  return (a as ContentSlide).type === "content-slide"
}
// ── Atividades dos novos tipos ─────────────────────────────────────────

const apiKeyFillBlank: LessonActivity[] = [
  {
    id: "ak-fill-1",
    type: "fill-blank",
    sentence:
      "Uma {___} é uma credencial secreta que identifica seu aplicativo ao chamar um serviço externo.",
    options: [
      { id: "a", text: "chave de API" },
      { id: "b", text: "token JWT" },
      { id: "c", text: "hash de senha" },
    ],
    correct: "a",
    explanation:
      "Chave de API (API key) é o segredo que prova ao servidor quem está chamando. JWT é um formato de token, hash é unidirecional.",
  },
  {
    id: "ak-fill-2",
    type: "fill-blank",
    sentence:
      "Quando sua chave de API vaza, a primeira ação deve ser {___} a chave no painel do provedor.",
    options: [
      { id: "a", text: "rotacionar (revogar e gerar nova)" },
      { id: "b", text: "apenas apagar o commit" },
      { id: "c", text: "esperar para ver se alguém usa" },
    ],
    correct: "a",
    explanation:
      "Rotação (rotate) é obrigatória: o histórico do Git mantém o segredo mesmo após o delete. Revogue, gere outra e atualize seus segredos.",
  },
]

const llmMatch: LessonActivity[] = [
  {
    id: "llm-match-1",
    type: "match",
    instruction: "Ligue cada modelo de linguagem à sua empresa criadora:",
    pairs: [
      { word: "Claude", definition: "Anthropic" },
      { word: "GPT-4", definition: "OpenAI" },
      { word: "Gemini", definition: "Google" },
      { word: "Qwen", definition: "Alibaba" },
    ],
    correctPairs: { Claude: "Anthropic", "GPT-4": "OpenAI", Gemini: "Google", Qwen: "Alibaba" },
    explanation:
      "Cada modelo é desenvolvido por uma organização diferente. Claude = Anthropic, GPT = OpenAI, Gemini = Google, Qwen = Alibaba.",
  },
]

const gitOrder: LessonActivity[] = [
  {
    id: "gb-order-1",
    type: "order",
    instruction: "Conecte cada comando Git à sua função correspondente:",
    leftItems: [
      { id: "a", text: "git add" },
      { id: "b", text: "git commit" },
      { id: "c", text: "git push" },
      { id: "d", text: "git clone" },
    ],
    rightItems: [
      { id: "w", text: "Prepara arquivos para o commit" },
      { id: "x", text: "Salva alterações no histórico local" },
      { id: "y", text: "Envia commits para o repositório remoto" },
      { id: "z", text: "Faz cópia local de um repositório remoto" },
    ],
    correctPairs: { a: "w", b: "x", c: "y", d: "z" },
    explanation:
      "Fluxo Git: clone (baixar) → add (preparar) → commit (salvar local) → push (enviar remoto).",
  },
]

const cronMatch: LessonActivity[] = [
  {
    id: "cj-match-1",
    type: "match",
    instruction: "Ligue cada expressão cron ao seu significado:",
    pairs: [
      { word: "0 9 * * 1", definition: "Toda segunda às 09:00" },
      { word: "*/15 * * * *", definition: "A cada 15 minutos" },
      { word: "0 0 * * *", definition: "Todo dia à meia-noite" },
      { word: "0 0 1 * *", definition: "Primeiro dia de cada mês" },
    ],
    correctPairs: {
      "0 9 * * 1": "Toda segunda às 09:00",
      "*/15 * * * *": "A cada 15 minutos",
      "0 0 * * *": "Todo dia à meia-noite",
      "0 0 1 * *": "Primeiro dia de cada mês",
    },
    explanation:
      "Os 5 campos do cron são: minuto, hora, dia-do-mês, mês, dia-da-semana. * = qualquer valor, */N = a cada N.",
  },
]

const healthOrder: LessonActivity[] = [
  {
    id: "hc-order-1",
    type: "order",
    instruction: "Conecte cada conceito de health check à sua descrição:",
    leftItems: [
      { id: "a", text: "Liveness" },
      { id: "b", text: "Readiness" },
      { id: "c", text: "SELECT 1" },
    ],
    rightItems: [
      { id: "x", text: "Verifica se o processo está vivo" },
      { id: "y", text: "Verifica se está pronto para receber tráfego" },
      { id: "z", text: "Consulta leve para testar o banco de dados" },
    ],
    correctPairs: { a: "x", b: "y", c: "z" },
    explanation:
      "Liveness reinicia o app se travar. Readiness tira do balanceador. SELECT 1 testa o banco sem gerar carga.",
  },
]

// Conteúdo padrão (fallback para módulos sem conteúdo dedicado)
export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: "q1",
    prompt: "Qual desses prompts daria o melhor resultado?",
    options: [
      { id: "a", text: "Escreva um texto sobre marketing." },
      {
        id: "b",
        text: "Atue como copywriter sênior e escreva um anúncio de Instagram para um curso de IA voltado a designers que querem aprender prompts em 30 dias. Use tom inspirador, máximo 80 palavras.",
      },
      { id: "c", text: "Texto bom para Instagram, urgente." },
    ],
    correct: "b",
    explanation:
      "Um bom prompt traz persona, contexto, público-alvo e restrições. A opção B faz tudo isso.",
  },
  {
    id: "q2",
    prompt: "Qual técnica ajuda a fixar o formato de saída desejado?",
    options: [
      { id: "a", text: "Cadeia de raciocínio (Chain-of-thought)" },
      { id: "b", text: "Aprendizado com poucos exemplos (Few-shot prompting)" },
      { id: "c", text: "Sem exemplos (Zero-shot)" },
      { id: "d", text: "Ajuste de temperatura (Temperature tuning)" },
    ],
    correct: "b",
    explanation:
      "Poucos exemplos (Few-shot prompting) fornece pares de entrada e saída, ensinando ao modelo o formato esperado.",
  },
  {
    id: "q3",
    prompt: "Pedir 'aja como um especialista em X' é um exemplo de…",
    options: [
      { id: "a", text: "Poucos exemplos (Few-shot)" },
      { id: "b", text: "Atribuição de papel (Persona / Role prompting)" },
      { id: "c", text: "Cadeia de raciocínio (Chain-of-thought)" },
      { id: "d", text: "Refino iterativo" },
    ],
    correct: "b",
    explanation:
      "Atribuir um papel (Role) ou persona orienta o tom e a profundidade da resposta do modelo.",
  },
]

// --- Conteúdo dos novos módulos ---

const engenhariaDePrompt: Question[] = [
  {
    id: "ep1",
    prompt: "O que melhor descreve 'Engenharia de Prompt' (Prompt Engineering)?",
    options: [
      { id: "a", text: "Programar a IA em Python para gerar respostas." },
      {
        id: "b",
        text: "Projetar instruções para maximizar a qualidade e previsibilidade das respostas do modelo.",
      },
      { id: "c", text: "Treinar um novo modelo do zero." },
    ],
    correct: "b",
    explanation:
      "Engenharia de prompt (Prompt Engineering) é o design sistemático de instruções — não envolve treinar o modelo, e sim guiá-lo.",
  },
  {
    id: "ep2",
    prompt:
      "No framework CRAFT (Contexto, Papel, Ação, Formato, Tom — Context, Role, Action, Format, Tone), o 'F' serve para…",
    options: [
      { id: "a", text: "Definir o formato (Format) da resposta — JSON, lista, tabela, parágrafo." },
      { id: "b", text: "Filtrar palavrões." },
      { id: "c", text: "Fixar o nome do modelo usado." },
    ],
    correct: "a",
    explanation:
      "Formato (Format) especifica como a saída deve ser estruturada — chave para integrar IA em fluxos de trabalho (workflows).",
  },
  {
    id: "ep3",
    prompt: "Qual prática reduz alucinações (hallucinations) em prompts críticos?",
    options: [
      { id: "a", text: "Pedir respostas mais longas." },
      { id: "b", text: "Aumentar a temperatura (temperature) para 1.5." },
      {
        id: "c",
        text: "Dar contexto factual no prompt e instruir o modelo a responder 'não sei' quando faltar informação.",
      },
    ],
    correct: "c",
    explanation:
      "Ancoragem em fatos (Grounding) + permissão explícita de admitir incerteza reduz fortemente a alucinação (hallucination).",
  },
]

const conhecaLLMs: Question[] = [
  {
    id: "llm0",
    prompt: "Antes de tudo: o que é um modelo de linguagem grande (LLM)?",
    options: [
      { id: "a", text: "Um banco de dados que guarda perguntas e respostas prontas." },
      {
        id: "b",
        text: "Modelo de Linguagem Grande (Large Language Model) — uma IA treinada em grandes volumes de texto para prever a próxima palavra e gerar respostas em linguagem natural.",
      },
      { id: "c", text: "Um navegador de internet com IA embutida." },
    ],
    correct: "b",
    explanation:
      "LLM = Modelo de Linguagem Grande (Large Language Model). São modelos como GPT, Claude, Gemini e Qwen, treinados em bilhões de palavras para entender e gerar texto.",
    hint: "L = Large (grande), L = Language (linguagem), M = Model (modelo).",
  },
  {
    id: "llm1",
    prompt: "Qual família de modelo de linguagem (LLM) é desenvolvida pela Anthropic?",
    options: [
      { id: "a", text: "Gemini" },
      { id: "b", text: "Claude" },
      { id: "c", text: "Qwen" },
      { id: "d", text: "MiniMax" },
    ],
    correct: "b",
    explanation:
      "Claude é a família da Anthropic. Gemini = Google, Qwen = Alibaba, MiniMax = MiniMax (China).",
  },
  {
    id: "llm2",
    prompt: "Qual modelo é especializado em geração de código pela OpenAI?",
    options: [
      { id: "a", text: "GLM" },
      { id: "b", text: "Codex" },
      { id: "c", text: "Gemini Nano" },
    ],
    correct: "b",
    explanation:
      "Codex é a linha da OpenAI focada em programação, base de produtos como GitHub Copilot e Codex CLI (interface de linha de comando).",
  },
  {
    id: "llm3",
    prompt: "Por que escolher Qwen ou GLM em vez de Claude/GPT em alguns casos?",
    options: [
      { id: "a", text: "São sempre mais inteligentes." },
      {
        id: "b",
        text: "São de pesos abertos (open-weights) — você pode rodar localmente, ajustar e usar sem enviar dados a uma API externa.",
      },
      { id: "c", text: "Não têm limite de contexto." },
    ],
    correct: "b",
    explanation:
      "Qwen (Alibaba) e GLM (Zhipu) liberam os pesos do modelo (open-weights), permitindo execução local, ajuste fino (fine-tuning) e privacidade de dados.",
  },
]

const aplicandoAgents: Question[] = [
  {
    id: "ag0",
    prompt: "Antes de tudo: o que é um agente (Agent) de IA?",
    options: [
      { id: "a", text: "Um humano que vende IA." },
      {
        id: "b",
        text: "Um sistema em que um modelo de linguagem (LLM) recebe um objetivo, decide quais ferramentas (tools) usar e executa ações em um laço (loop) até concluir a tarefa.",
      },
      { id: "c", text: "Um servidor onde a IA fica hospedada." },
    ],
    correct: "b",
    explanation:
      "Agente (Agent) = LLM + ferramentas (tools) + memória + laço de decisão (loop). Ele age, não só responde.",
    hint: "Pense em alguém autônomo executando tarefas para você.",
  },
  {
    id: "ag1",
    prompt:
      "O que diferencia um agente (Agent) de uma chamada simples a um modelo de linguagem (LLM)?",
    options: [
      { id: "a", text: "O agente roda em GPU, o LLM não." },
      {
        id: "b",
        text: "O agente decide quais ferramentas (tools) usar e executa passos em um laço (loop) até atingir um objetivo.",
      },
      { id: "c", text: "Agente é só um nome mais bonito para chatbot." },
    ],
    correct: "b",
    explanation:
      "Um agente combina LLM + ferramentas (tools) + laço de decisão (loop), escolhendo dinamicamente quais ações tomar.",
  },
  {
    id: "ag2",
    prompt: "Qual componente é essencial para um agente executar ações no mundo real?",
    options: [
      { id: "a", text: "Ferramentas (tools) com esquema (schema) de entrada bem definido." },
      { id: "b", text: "Uma fonte musical." },
      { id: "c", text: "Um banco vetorial obrigatoriamente." },
    ],
    correct: "a",
    explanation:
      "Ferramentas (tools) são funções tipadas que o agente chama. Sem elas, ele só conversa — não age.",
  },
  {
    id: "ag3",
    prompt: "Por que limitar o número de iterações de um agente?",
    options: [
      {
        id: "a",
        text: "Para evitar laços infinitos (loops), custos descontrolados e respostas degradadas.",
      },
      { id: "b", text: "Para deixar o código mais bonito." },
      { id: "c", text: "Não precisa limitar — agentes sempre param sozinhos." },
    ],
    correct: "a",
    explanation:
      "Condição de parada (stopWhen) e limite máximo de passos (max steps) são proteções (guardrails) críticas: agentes podem entrar em laço (loop) e queimar tokens rapidamente.",
  },
]

const usandoOpenRouter: Question[] = [
  {
    id: "or0",
    prompt: "Antes de tudo: o que é o OpenRouter?",
    options: [
      { id: "a", text: "Um roteador de internet com IA." },
      {
        id: "b",
        text: "Um portal de acesso (gateway) que dá acesso a centenas de modelos de linguagem (LLMs) — OpenAI, Anthropic, Google, Meta… — por uma única API compatível com a da OpenAI.",
      },
      { id: "c", text: "Uma versão gratuita do GPT." },
    ],
    correct: "b",
    explanation:
      "OpenRouter é uma camada única na frente de muitos provedores. Você troca de modelo mudando um parâmetro.",
    hint: "'Open' (aberto) + 'Router' (roteador) = roteador aberto entre vários modelos.",
  },
  {
    id: "or1",
    prompt: "Qual é a principal proposta do OpenRouter?",
    options: [
      { id: "a", text: "Hospedar seu próprio modelo gratuitamente." },
      {
        id: "b",
        text: "Acessar centenas de modelos (OpenAI, Anthropic, Google, Meta, etc.) por uma única API compatível.",
      },
      { id: "c", text: "Substituir o Claude e o GPT por um modelo único." },
    ],
    correct: "b",
    explanation:
      "OpenRouter é um portal de acesso (gateway): uma API, muitos provedores. Você troca de modelo mudando só um parâmetro.",
  },
  {
    id: "or2",
    prompt: "Como o OpenRouter ajuda no controle de custos?",
    options: [
      {
        id: "a",
        text: "Você define alternativas automáticas (fallbacks) — ex.: tenta GPT-5; se cair, usa Claude — e compara preços por 1M tokens.",
      },
      { id: "b", text: "Negociando com a sua operadora de internet." },
      { id: "c", text: "Cobra sempre o mesmo preço por requisição." },
    ],
    correct: "a",
    explanation:
      "Alternativas automáticas (fallbacks), roteamento por preço e painéis (dashboards) de uso permitem otimizar custo sem mudar o código de cada provedor.",
  },
  {
    id: "or3",
    prompt: "Qual padrão de API o OpenRouter expõe?",
    options: [
      { id: "a", text: "GraphQL exclusivo." },
      { id: "b", text: "Compatível com a API da OpenAI (/v1/chat/completions)." },
      { id: "c", text: "Apenas gRPC." },
    ],
    correct: "b",
    explanation:
      "Por ser compatível com a API da OpenAI (OpenAI-compatible), basta trocar a URL base (baseURL) e a chave de API (API key) — qualquer SDK da OpenAI funciona.",
  },
]

const modelosLocais: Question[] = [
  {
    id: "ml0",
    prompt: "Antes de tudo: o que é um modelo local (Local Model)?",
    options: [
      { id: "a", text: "Um modelo que só funciona no seu país." },
      {
        id: "b",
        text: "Um modelo de linguagem (LLM) cujos pesos rodam direto na sua máquina (ou servidor próprio), sem depender de uma API externa.",
      },
      { id: "c", text: "Uma versão paga do ChatGPT." },
    ],
    correct: "b",
    explanation:
      "Modelo local (Local Model) = você baixa os pesos e roda a inferência localmente (ex.: Ollama, LM Studio). Sem nuvem, sem enviar dados a terceiros.",
    hint: "'Local' = na sua máquina, não na nuvem.",
  },
  {
    id: "ml1",
    prompt:
      "Qual ferramenta popular roda modelos de linguagem (LLMs) localmente via interface de linha de comando (CLI)?",
    options: [
      { id: "a", text: "Ollama" },
      { id: "b", text: "Photoshop" },
      { id: "c", text: "Notion" },
    ],
    correct: "a",
    explanation:
      "Ollama (e LM Studio) baixa modelos quantizados (quantized) e expõe uma API local compatível com a da OpenAI.",
  },
  {
    id: "ml2",
    prompt: "Quando faz mais sentido usar modelo local em vez de API na nuvem?",
    options: [
      {
        id: "a",
        text: "Quando você precisa de privacidade total, modo desconectado (offline) ou custo previsível em alto volume.",
      },
      { id: "b", text: "Sempre — local é melhor em tudo." },
      { id: "c", text: "Nunca — modelos locais não servem para nada." },
    ],
    correct: "a",
    explanation:
      "Privacidade, modo desconectado (offline) e custo fixo são os ganhos. A contrapartida é qualidade menor e exigência de hardware.",
  },
  {
    id: "ml3",
    prompt: "O que significa 'quantização' (quantization) de um modelo — ex.: Q4_K_M?",
    options: [
      {
        id: "a",
        text: "Reduzir a precisão dos pesos para caber em menos memória RAM/VRAM, com leve perda de qualidade.",
      },
      { id: "b", text: "Treinar o modelo em computação quântica (quantum computing)." },
      { id: "c", text: "Limitar o número de tokens (unidades de texto) de saída." },
    ],
    correct: "a",
    explanation:
      "Quantização (quantization) comprime os pesos (de 16 bits para 4/5/8 bits), permitindo rodar modelos grandes em hardware modesto.",
  },
]

const claudeCodePratica: Question[] = [
  {
    id: "cc1",
    prompt: "O que é o Claude Code?",
    options: [
      { id: "a", text: "Um modelo de Claude exclusivo para programar — sem interface." },
      {
        id: "b",
        text: "Uma interface de linha de comando (CLI) agente da Anthropic que edita arquivos, roda comandos e mantém contexto do seu projeto.",
      },
      { id: "c", text: "Uma extensão do VS Code para colorir código." },
    ],
    correct: "b",
    explanation:
      "Claude Code é uma ferramenta de linha de comando (CLI) que opera como agente (Agent) dentro do seu repositório.",
  },
  {
    id: "cc2",
    prompt: "Para que serve o arquivo CLAUDE.md na raiz de um projeto?",
    options: [
      { id: "a", text: "Documentar a licença do projeto." },
      {
        id: "b",
        text: "Dar contexto persistente ao Claude Code: convenções, scripts, regras do repositório.",
      },
      { id: "c", text: "Configurar o Git." },
    ],
    correct: "b",
    explanation:
      "CLAUDE.md é lido automaticamente em cada sessão — é como um prompt de sistema (system prompt) do seu projeto.",
  },
  {
    id: "cc3",
    prompt: "Qual prática melhora resultados com Claude Code em tarefas grandes?",
    options: [
      { id: "a", text: "Pedir tudo em um único prompt enorme." },
      {
        id: "b",
        text: "Quebrar em etapas, revisar as alterações propostas (diffs) e usar /clear entre tarefas independentes.",
      },
      { id: "c", text: "Desabilitar todas as ferramentas (tools)." },
    ],
    correct: "b",
    explanation:
      "Sessões enxutas, etapas pequenas e revisão das alterações propostas (diff) dão muito mais qualidade do que prompts monolíticos.",
  },
]

const skillsClaudeCode: Question[] = [
  {
    id: "sk1",
    prompt: "O que é uma habilidade (Skill) no Claude Code?",
    options: [
      { id: "a", text: "Um plugin pago da Anthropic." },
      {
        id: "b",
        text: "Um pacote de instruções + arquivos auxiliares que o Claude carrega quando a tarefa combina com sua descrição (description).",
      },
      { id: "c", text: "Um atalho de teclado." },
    ],
    correct: "b",
    explanation:
      "Habilidades (Skills) são conhecimento procedural reutilizável — uma pasta com SKILL.md + recursos opcionais.",
  },
  {
    id: "sk2",
    prompt: "Qual campo do SKILL.md é mais importante para o Claude decidir quando ativá-la?",
    options: [
      { id: "a", text: "version (versão)" },
      {
        id: "b",
        text: "description (descrição) — é usada na correspondência de relevância contra o pedido do usuário.",
      },
      { id: "c", text: "author (autor)" },
    ],
    correct: "b",
    explanation:
      "A descrição (description) é o gancho de recuperação (retrieval). Uma descrição vaga = habilidade (skill) nunca ativada.",
  },
  {
    id: "sk3",
    prompt: "Onde uma habilidade (Skill) ativa do projeto fica armazenada?",
    options: [
      { id: "a", text: "Em .workspace/skills/<nome>/ (após ser aplicada a partir do rascunho)." },
      { id: "b", text: "Em node_modules." },
      { id: "c", text: "No bucket do Lovable Cloud." },
    ],
    correct: "a",
    explanation:
      "Rascunhos (drafts) vivem em .agents/skills/ e, depois de aplicados, viram habilidades (skills) ativas em .workspace/skills/.",
  },
]

const personalizarTemplates: Question[] = [
  {
    id: "tp0",
    prompt: "Antes de tudo: o que é um modelo de prompt (Template)?",
    options: [
      { id: "a", text: "Um tema visual do site." },
      {
        id: "b",
        text: "Um modelo de prompt (Template), com partes fixas e variáveis (ex.: {{publico}}, {{tom}}), que pode ser reutilizado em vários casos.",
      },
      { id: "c", text: "Uma resposta pronta da IA, sem precisar de prompt." },
    ],
    correct: "b",
    explanation:
      "Modelo (Template) = prompt parametrizado. Você troca as variáveis e reutiliza a mesma estrutura em vários contextos.",
    hint: "Pense em um molde com lacunas para preencher.",
  },
  {
    id: "tp1",
    prompt: "Qual é a primeira coisa a fazer ao adotar um modelo (template) pronto?",
    options: [
      { id: "a", text: "Renomear todas as variáveis aleatoriamente." },
      {
        id: "b",
        text: "Ler o template inteiro, mapear variáveis de entrada e identificar o que é fixo vs. configurável.",
      },
      { id: "c", text: "Apagar os comentários." },
    ],
    correct: "b",
    explanation:
      "Entender variáveis e blocos configuráveis evita quebrar o modelo (template) ao customizar.",
  },
  {
    id: "tp2",
    prompt: "Como manter a manutenibilidade ao customizar um modelo (template)?",
    options: [
      {
        id: "a",
        text: "Bifurcar (fork), parametrizar as partes que mudam por projeto e versionar suas variações.",
      },
      { id: "b", text: "Reescrever cada vez do zero." },
      { id: "c", text: "Fixar tudo no código (hardcode)." },
    ],
    correct: "a",
    explanation:
      "Bifurcação (fork) + parametrização + versionamento dá reuso real. Fixar no código (hardcode) mata a vantagem do modelo (template).",
  },
  {
    id: "tp3",
    prompt: "Ao adaptar um modelo (template) de prompt, qual erro é mais comum?",
    options: [
      {
        id: "a",
        text: "Remover instruções de formato ou proteções (guardrails) sem entender por que estavam ali.",
      },
      { id: "b", text: "Manter as variáveis originais." },
      { id: "c", text: "Testar antes de publicar." },
    ],
    correct: "a",
    explanation:
      "Restrições e formatos no modelo (template) foram colocados por algum motivo — remover às cegas degrada o resultado.",
  },
]

const apiKeyBasico: Question[] = [
  {
    id: "ak0",
    prompt: "Antes de tudo: o que é uma chave de API (API key)?",
    options: [
      { id: "a", text: "Uma senha pública que qualquer pessoa pode ver." },
      {
        id: "b",
        text: "Uma credencial secreta (string) que identifica e autoriza seu aplicativo a chamar uma API — funciona como uma combinação de login + senha do app.",
      },
      { id: "c", text: "O endereço (URL) da API." },
    ],
    correct: "b",
    explanation:
      "Chave de API (API key) é um segredo que prova ao serviço quem está chamando. Se vazar, qualquer um pode usar a sua conta e gerar custo.",
    hint: "Pense em uma senha que o seu app usa para se identificar no serviço.",
  },
  {
    id: "ak1",
    prompt: "Onde uma chave de API (API key) NUNCA deve ficar?",
    options: [
      { id: "a", text: "Em variáveis de ambiente (.env) do servidor." },
      { id: "b", text: "Em um gerenciador de segredos (Secrets Manager / Vault)." },
      { id: "c", text: "No código do front-end (browser) ou commitada no Git público." },
    ],
    correct: "c",
    explanation:
      "Qualquer coisa que vai para o navegador é pública. Chaves secretas ficam no servidor, em variáveis de ambiente ou em um cofre de segredos.",
  },
  {
    id: "ak2",
    prompt: "Sua chave de API vazou em um repositório público. Qual a primeira ação?",
    options: [
      {
        id: "a",
        text: "Rotacionar (revogar e gerar uma nova) imediatamente no painel do provedor.",
      },
      { id: "b", text: "Apenas apagar o commit — o histórico do Git resolve." },
      { id: "c", text: "Esperar para ver se alguém usa." },
    ],
    correct: "a",
    explanation:
      "Rotação (rotate) é obrigatória: o histórico do Git mantém o segredo mesmo após o delete. Revogue, gere outra e atualize seus segredos.",
  },
]

const migrationsBasico: Question[] = [
  {
    id: "mg0",
    prompt: "Antes de tudo: o que é uma migration (migração de banco)?",
    options: [
      { id: "a", text: "Mudar o servidor de banco de uma máquina para outra." },
      {
        id: "b",
        text: "Um arquivo versionado com instruções SQL que evolui o esquema do banco (criar tabela, adicionar coluna, alterar tipo) de forma reproduzível.",
      },
      { id: "c", text: "Fazer backup do banco." },
    ],
    correct: "b",
    explanation:
      "Migration = código versionado que descreve uma mudança no banco. Roda em ordem, é registrada, e qualquer ambiente (dev, prod) chega ao mesmo estado.",
    hint: "Pense em commits do Git, mas aplicados ao schema do banco.",
  },
  {
    id: "mg1",
    prompt: "Por que usar migrations em vez de alterar o banco direto pelo painel?",
    options: [
      {
        id: "a",
        text: "Migrations dão histórico, revisão por pares (PR) e reprodutibilidade entre ambientes (dev, staging, prod).",
      },
      { id: "b", text: "São mais bonitas visualmente." },
      { id: "c", text: "Não precisam de SQL." },
    ],
    correct: "a",
    explanation:
      "Mudanças pelo painel ('cliques no dashboard') não ficam versionadas — outro dev não consegue reproduzir. Migrations resolvem isso.",
  },
  {
    id: "mg2",
    prompt: "Qual é uma boa prática para alimentar (seed) dados iniciais no banco?",
    options: [
      { id: "a", text: "Inserir manualmente em produção e torcer para não esquecer." },
      {
        id: "b",
        text: "Criar uma migration de seed com INSERTs idempotentes (ex.: ON CONFLICT DO NOTHING) para popular categorias, papéis e dados de demonstração.",
      },
      { id: "c", text: "Salvar um JSON no front e fingir que é banco." },
    ],
    correct: "b",
    explanation:
      "Migrations de seed idempotentes garantem que dados de catálogo/demo existam em todo ambiente, sem duplicar quando rodadas de novo.",
  },
]

const healthCheckBasico: Question[] = [
  {
    id: "hc0",
    prompt: "Antes de tudo: o que é um health check?",
    options: [
      { id: "a", text: "Um exame médico do desenvolvedor." },
      {
        id: "b",
        text: "Um endpoint (ex.: GET /health) que responde rapidamente dizendo se o serviço — e suas dependências (banco, fila, cache) — estão saudáveis.",
      },
      { id: "c", text: "Um relatório financeiro do projeto." },
    ],
    correct: "b",
    explanation:
      "Health check = sinal de vida do serviço. Usado por balanceadores, monitoramento (uptime) e orquestradores para decidir se o app está apto a receber tráfego.",
    hint: "Pense em um 'tá vivo?' que retorna 200 OK quando tudo está bem.",
  },
  {
    id: "hc1",
    prompt: "Qual a diferença entre liveness e readiness?",
    options: [
      { id: "a", text: "São a mesma coisa." },
      {
        id: "b",
        text: "Liveness = o processo está vivo? Readiness = está pronto para receber tráfego (dependências OK)?",
      },
      { id: "c", text: "Liveness mede CPU; readiness mede memória." },
    ],
    correct: "b",
    explanation:
      "Liveness reinicia o app se travar. Readiness tira do balanceador quando o banco/cache cai, sem matar o processo.",
  },
  {
    id: "hc2",
    prompt: "O que um health check de banco deve verificar — sem custar caro?",
    options: [
      { id: "a", text: "Rodar SELECT * em todas as tabelas." },
      {
        id: "b",
        text: "Executar uma consulta leve (ex.: SELECT 1) com timeout curto e checar latência da conexão.",
      },
      { id: "c", text: "Apenas checar se a porta TCP está aberta." },
    ],
    correct: "b",
    explanation:
      "SELECT 1 com timeout prova que o pool de conexões funciona e o banco responde — sem gerar carga. Só TCP aberto não garante que o banco responde queries.",
  },
]

const cronJobsBasico: Question[] = [
  {
    id: "cj0",
    prompt: "Antes de tudo: o que é um cron job?",
    options: [
      { id: "a", text: "Um cargo de emprego em TI." },
      {
        id: "b",
        text: "Uma tarefa agendada que roda automaticamente em horários definidos por uma expressão cron (ex.: '0 * * * *' = de hora em hora).",
      },
      { id: "c", text: "Um tipo de banco de dados." },
    ],
    correct: "b",
    explanation:
      "Cron job = automação por agendamento. Você descreve a frequência com 5 campos (min hora dia mês dia-semana) e o sistema dispara sua tarefa.",
    hint: "Pense em um despertador que executa código em vez de tocar.",
  },
  {
    id: "cj1",
    prompt: "O que a expressão '0 9 * * 1' significa?",
    options: [
      { id: "a", text: "A cada 9 minutos." },
      { id: "b", text: "Toda segunda-feira às 09:00." },
      { id: "c", text: "Dia 9 de cada mês à meia-noite." },
    ],
    correct: "b",
    explanation:
      "Os campos são: minuto(0) hora(9) dia-do-mês(*) mês(*) dia-da-semana(1=segunda). Logo: segunda 09:00.",
  },
  {
    id: "cj2",
    prompt: "Qual prática evita problemas com cron jobs em produção?",
    options: [
      {
        id: "a",
        text: "Tornar a tarefa idempotente, registrar logs com horário e usar lock para impedir execuções sobrepostas.",
      },
      { id: "b", text: "Rodar a cada segundo sem monitoramento." },
      { id: "c", text: "Confiar que nunca vai falhar." },
    ],
    correct: "a",
    explanation:
      "Idempotência (rodar duas vezes não estraga dados), logs e locks (mutex) são essenciais — jobs podem atrasar, sobrepor ou repetir.",
  },
]

const nodeBasico: Question[] = [
  {
    id: "nb0",
    prompt: "Antes de tudo: o que é o Node.js?",
    options: [
      { id: "a", text: "Um framework para construir sites bonitos." },
      {
        id: "b",
        text: "Um ambiente de execução que permite rodar JavaScript fora do navegador — no servidor, no terminal e em ferramentas de linha de comando.",
      },
      { id: "c", text: "Um banco de dados NoSQL." },
    ],
    correct: "b",
    explanation:
      "Node.js é um runtime (ambiente de execução) baseado no motor V8 do Chrome. Ele executa JavaScript no servidor, possibilitando APIs, automações e scripts de CLI.",
    hint: "Pense no Node.js como o 'motor' que faz JavaScript funcionar fora do navegador.",
  },
  {
    id: "nb1",
    prompt: "Para que o Node.js é mais usado no mundo real?",
    options: [
      { id: "a", text: "Editar imagens e vídeos." },
      {
        id: "b",
        text: "Criar servidores web, APIs REST, ferramentas de linha de comando (CLI) e automações de build.",
      },
      { id: "c", text: "Desenhar interfaces gráficas (GUI) apenas." },
    ],
    correct: "b",
    explanation:
      "Node.js brilha em I/O assíncrono: servidores HTTP, APIs, WebSockets, scripts de build (Vite, Webpack) e CLIs (linha de comando).",
  },
  {
    id: "nb2",
    prompt: "O que significa 'runtime' no contexto do Node.js?",
    options: [
      { id: "a", text: "Um tipo de banco de dados rápido." },
      {
        id: "b",
        text: "O ambiente que executa o código — interpreta, compila e roda o JavaScript, fornecendo APIs como fs, http e path.",
      },
      { id: "c", text: "Um plugin do VS Code." },
    ],
    correct: "b",
    explanation:
      "Runtime = motor de execução. O Node.js fornece o V8 (compilação) + libuv (event loop) + APIs nativas (fs, net, http) para JavaScript funcionar no servidor.",
  },
]

const gitBashBasico: Question[] = [
  {
    id: "gb0",
    prompt: "Antes de tudo: o que é o Git Bash?",
    options: [
      { id: "a", text: "Um jogo de terminal para aprender comandos." },
      {
        id: "b",
        text: "Um terminal para Windows que traz comandos do Linux/Unix (ls, pwd, grep) junto com o Git — permite versionar código e navegar no sistema como em um terminal Unix.",
      },
      { id: "c", text: "Um editor de texto avançado." },
    ],
    correct: "b",
    explanation:
      "Git Bash é o terminal que acompanha o Git for Windows. Ele emula um ambiente Unix no Windows, dando acesso a comandos do Linux e a todos os comandos do Git.",
    hint: "'Bash' é o shell padrão do Linux — o Git Bash traz esse poder para o Windows.",
  },
  {
    id: "gb1",
    prompt: "Qual comando do Git Bash cria uma cópia local de um repositório remoto?",
    options: [
      { id: "a", text: "git copy" },
      { id: "b", text: "git clone <url>" },
      { id: "c", text: "git download" },
    ],
    correct: "b",
    explanation:
      "git clone baixa o repositório inteiro, incluindo histórico de commits e branches, criando uma cópia funcional na sua máquina.",
  },
  {
    id: "gb2",
    prompt: "Qual a diferença entre 'git add', 'git commit' e 'git push'?",
    options: [
      { id: "a", text: "Não há diferença — fazem a mesma coisa." },
      {
        id: "b",
        text: "git add prepara arquivos para commit; git commit salva a alteração no histórico local; git push envia para o repositório remoto.",
      },
      { id: "c", text: "git add cria um branch; git commit faz merge; git push deleta arquivos." },
    ],
    correct: "b",
    explanation:
      "Fluxo Git: add (stage) → commit (salvar no histórico local) → push (sincronizar com remoto). É como embalar, fotografar e enviar.",
  },
]

const npmBasico: Question[] = [
  {
    id: "npm0",
    prompt: "Antes de tudo: o que é npm?",
    options: [
      { id: "a", text: "Um serviço de streaming de música." },
      {
        id: "b",
        text: "Node Package Manager — o gerenciador de pacotes do Node.js que instala, atualiza e remove bibliotecas e ferramentas.",
      },
      { id: "c", text: "Um protocolo de internet novo." },
    ],
    correct: "b",
    explanation:
      "npm (Node Package Manager) é o gerenciador oficial de pacotes do Node.js. Ele lê o package.json, baixa dependências para node_modules e executa scripts.",
    hint: "npm install = 'instalar tudo que o projeto precisa'.",
  },
  {
    id: "npm1",
    prompt: "Qual comando instala todas as dependências listadas no package.json?",
    options: [
      { id: "a", text: "npm start" },
      { id: "b", text: "npm install" },
      { id: "c", text: "npm build" },
    ],
    correct: "b",
    explanation:
      "npm install (ou npm i) lê o package.json, resolve versões compatíveis e baixa tudo para a pasta node_modules. É o primeiro comando ao clonar um projeto.",
  },
  {
    id: "npm2",
    prompt: "O que faz o comando 'npm run dev' em um projeto típico?",
    options: [
      { id: "a", text: "Instala pacotes de desenvolvimento." },
      {
        id: "b",
        text: "Executa o script chamado 'dev' no package.json — geralmente inicia um servidor local de desenvolvimento com hot-reload.",
      },
      { id: "c", text: "Compila o projeto para produção." },
    ],
    correct: "b",
    explanation:
      "npm run <script> executa qualquer script definido no package.json. 'dev' geralmente sobe um servidor local (ex.: Vite em localhost:5173) com recarregamento automático.",
  },
]

const skillsLLMBasico: Question[] = [
  {
    id: "skllm0",
    prompt: "Antes de tudo: o que são skills (habilidades) em LLMs?",
    options: [
      { id: "a", text: "Pacotes de software que se instalam via npm no modelo." },
      {
        id: "b",
        text: "Conjuntos de instruções, exemplos e diretrizes que ensinam o modelo de IA a executar uma tarefa específica com qualidade e consistência.",
      },
      { id: "c", text: "Atalhos de teclado dentro do chat." },
    ],
    correct: "b",
    explanation:
      "Skills em LLMs são 'super prompts' — instruções estruturadas, exemplos few-shot e regras que transformam o modelo em um especialista em uma tarefa específica. Não são código instalável; são conhecimento textual.",
    hint: "Pense em skills como um 'manual de instruções' que você dá à IA para ela se comportar de forma especializada.",
  },
  {
    id: "skllm1",
    prompt: "Qual é a diferença entre uma 'skill' e um 'prompt' comum?",
    options: [
      { id: "a", text: "Não há diferença — são a mesma coisa." },
      {
        id: "b",
        text: "Uma skill é um prompt sistemático e reutilizável, com estrutura, exemplos e proteções (guardrails), enquanto um prompt comum é uma pergunta isolada.",
      },
      { id: "c", text: "Skills só funcionam no ChatGPT pago." },
    ],
    correct: "b",
    explanation:
      "Prompt = pergunta pontual. Skill = sistema completo: persona, regras, exemplos de entrada/saída, formato e proteções (guardrails). Skills são projetadas para serem reutilizáveis e consistentes.",
  },
  {
    id: "skllm2",
    prompt: "Como você 'instala' ou usa uma skill em uma LLM?",
    options: [
      { id: "a", text: "Executa 'npm install skill-name' no terminal." },
      {
        id: "b",
        text: "Copia o conteúdo da skill (instruções + exemplos) para o contexto do chat, system prompt ou arquivo de configuração da ferramenta que usa a LLM.",
      },
      { id: "c", text: "Faz download de um arquivo .exe." },
    ],
    correct: "b",
    explanation:
      "Skills não são instaladas como software. Você as 'carrega' no contexto: cola no system prompt, importa como arquivo no Claude Code (.claude/skills/), ou carrega em ferramentas como Cursor, n8n e Lovable que suportam instruções personalizadas.",
  },
]

// ── A1 — Fundamentos de Prompts ───────────────────────────────────────────

const a1Boas_vindas: Question[] = [
  {
    id: "a1bv0",
    prompt: "O que é o PromptLabz?",
    options: [
      { id: "a", text: "Uma plataforma para treinar modelos de IA do zero." },
      {
        id: "b",
        text: "Uma trilha de aprendizado prática para você dominar a arte de escrever prompts e usar IA com eficiência.",
      },
      { id: "c", text: "Um substituto para o ChatGPT." },
    ],
    correct: "b",
    explanation:
      "PromptLabz é um curso prático em formato de trilha. Você aprende prompts — desde o básico até aplicações profissionais — com atividades, exemplos reais e desafios.",
  },
  {
    id: "a1bv1",
    prompt: "Qual é a habilidade central que você vai desenvolver nesta trilha?",
    options: [
      { id: "a", text: "Programar modelos de linguagem (LLMs) em Python." },
      {
        id: "b",
        text: "Escrever prompts claros, específicos e eficazes para obter respostas de qualidade da IA.",
      },
      { id: "c", text: "Criar apresentações de slides com IA." },
    ],
    correct: "b",
    explanation:
      "Engenharia de prompt (Prompt Engineering) é a habilidade de comunicar intenções com clareza para a IA. Pequenas mudanças no prompt geram grandes diferenças no resultado.",
    hint: "Pense em prompt como a instrução que você dá à IA.",
  },
  {
    id: "a1bv2",
    prompt: "Por que aprender a escrever bons prompts é valioso?",
    options: [
      { id: "a", text: "Porque a IA não funciona sem prompts perfeitos." },
      {
        id: "b",
        text: "Porque prompts bem escritos multiplicam sua produtividade — você consegue resultados melhores, mais rápido, sem precisar saber programar.",
      },
      { id: "c", text: "Porque a maioria dos modelos de IA cobra por palavra no prompt." },
    ],
    correct: "b",
    explanation:
      "Um bom prompt é a diferença entre uma resposta genérica e uma resposta que resolve seu problema real. É a habilidade mais acessível e de maior retorno para usar IA no dia a dia.",
  },
]

const a1OQueEPrompt: Question[] = [
  {
    id: "a1oqp0",
    prompt: "O que é um prompt em IA?",
    options: [
      { id: "a", text: "O botão 'Enviar' no chat." },
      {
        id: "b",
        text: "A instrução, pergunta ou texto que você envia para um modelo de linguagem (LLM) para obter uma resposta.",
      },
      { id: "c", text: "O nome do servidor onde a IA roda." },
    ],
    correct: "b",
    explanation:
      "Prompt é a sua entrada (input) para o modelo. Pode ser uma pergunta, um comando, um trecho de texto para continuar — qualquer coisa que você envia para a IA processar.",
    hint: "É o que você 'digita' para a IA.",
  },
  {
    id: "a1oqp1",
    prompt: "Qual destes é um exemplo de prompt ruim?",
    options: [
      {
        id: "a",
        text: '"Resuma em 3 pontos os benefícios de beber água para adultos sedentários."',
      },
      { id: "b", text: '"Me conta algo."' },
      {
        id: "c",
        text: '"Liste 5 estratégias de marketing para um restaurante italiano delivery no bairro do Itaim Bibi."',
      },
    ],
    correct: "b",
    explanation:
      '"Me conta algo" é vago demais. Sem contexto ou objetivo, a IA vai gerar algo aleatório e inútil. Bons prompts têm objetivo claro e contexto suficiente.',
  },
  {
    id: "a1oqp2",
    prompt: "O que torna um prompt eficaz?",
    options: [
      { id: "a", text: "Usar palavras em maiúsculas para dar ênfase." },
      { id: "b", text: "Ser longo — quanto maior, melhor." },
      {
        id: "c",
        text: "Ter objetivo claro, contexto relevante e instrução específica sobre o que você quer.",
      },
    ],
    correct: "c",
    explanation:
      "Um prompt eficaz responde internamente: 'O que eu quero?', 'Para quem?', 'Em que formato?' Clareza vence comprimento.",
  },
]

const a1ContextoClareza: Question[] = [
  {
    id: "a1cc0",
    prompt: "Por que adicionar contexto em um prompt melhora a resposta?",
    options: [
      { id: "a", text: "Porque a IA cobra menos quando recebe mais texto." },
      {
        id: "b",
        text: "Porque o modelo não tem acesso ao seu histórico ou situação — o contexto é a única fonte de informação que ele tem sobre você.",
      },
      { id: "c", text: "Para confundir o modelo e gerar respostas criativas." },
    ],
    correct: "b",
    explanation:
      "O modelo não conhece você. Fornecer contexto (quem você é, para que serve, qual o público) é a forma de personalizar a resposta para o seu cenário específico.",
  },
  {
    id: "a1cc1",
    prompt: "Qual prompt tem mais contexto e clareza?",
    options: [
      { id: "a", text: '"Crie um e-mail."' },
      {
        id: "b",
        text: '"Crie um e-mail formal de 5 linhas recusando uma proposta de parceria, mantendo tom cordial, para enviar ao CEO de uma startup de fintech."',
      },
      { id: "c", text: '"E-mail de recusa para CEO de fintech."' },
    ],
    correct: "b",
    explanation:
      "O prompt B especifica tipo (formal), tamanho (5 linhas), objetivo (recusa), tom (cordial) e destinatário (CEO de fintech). Esses detalhes eliminam ambiguidade.",
  },
  {
    id: "a1cc2",
    prompt: "O que é 'ambiguidade' em prompts e por que ela é problemática?",
    options: [
      { id: "a", text: "Quando o prompt tem mais de 500 caracteres — o modelo fica confuso." },
      {
        id: "b",
        text: "Quando o prompt pode ser interpretado de várias formas, levando a respostas que não atendem ao que você realmente queria.",
      },
      { id: "c", text: "Quando você usa linguagem técnica demais." },
    ],
    correct: "b",
    explanation:
      "Ambiguidade força o modelo a 'adivinhar' sua intenção. Ser específico elimina interpretações erradas e aumenta a chance de a resposta ser exatamente o que você precisa.",
  },
]

const a1PersonasRoles: Question[] = [
  {
    id: "a1pr0",
    prompt: "O que é 'role prompting' (atribuição de papel)?",
    options: [
      { id: "a", text: "Definir o papel do usuário como administrador no chat." },
      {
        id: "b",
        text: "Pedir ao modelo que assuma uma persona específica — ex.: 'Aja como um médico', 'Você é um copywriter sênior' — para que responda com esse nível de expertise e tom.",
      },
      { id: "c", text: "Dar uma função matemática para o modelo calcular." },
    ],
    correct: "b",
    explanation:
      "Role prompting direciona o estilo, tom e profundidade da resposta. 'Aja como um professor para crianças de 8 anos' gera uma explicação bem diferente de 'Aja como um PhD em física'.",
  },
  {
    id: "a1pr1",
    prompt: "Como a atribuição de persona muda a resposta do modelo?",
    options: [
      { id: "a", text: "Não muda nada — o modelo ignora essa instrução." },
      {
        id: "b",
        text: "Ajusta o vocabulário, nível técnico, tom e perspectiva da resposta de acordo com a persona pedida.",
      },
      { id: "c", text: "Faz o modelo responder em outra língua automaticamente." },
    ],
    correct: "b",
    explanation:
      "Uma persona calibra toda a resposta. 'Aja como um chef de cozinha' trará termos culinários e dicas práticas. 'Aja como um crítico gastronômico' trará análise e vocabulário sofisticado.",
  },
  {
    id: "a1pr2",
    prompt: "Qual é a forma mais eficaz de definir uma persona em um prompt?",
    options: [
      { id: "a", text: '"Seja inteligente."' },
      { id: "b", text: '"Aja como um especialista."' },
      {
        id: "c",
        text: '"Você é um gerente de produto com 10 anos de experiência em SaaS B2B. Responda como se estivesse orientando um founder iniciante."',
      },
    ],
    correct: "c",
    explanation:
      "Personas eficazes têm especificidade: área, nível de experiência e relação com o interlocutor. Quanto mais detalhada, mais consistente e útil a resposta.",
  },
]

const a1EstruturasPrompt: Question[] = [
  {
    id: "a1ep0",
    prompt: "O framework CRAFT (Contexto, Papel, Ação, Formato, Tom) serve para:",
    options: [
      { id: "a", text: "Criar logos com IA." },
      {
        id: "b",
        text: "Estruturar prompts de forma completa, garantindo que todos os elementos importantes estejam presentes.",
      },
      { id: "c", text: "Programar robôs de automação." },
    ],
    correct: "b",
    explanation:
      "CRAFT é um checklist de boas práticas: Contexto (situação), Role/Papel (persona), Ação (o que fazer), Formato (como apresentar), Tom (estilo da escrita).",
  },
  {
    id: "a1ep1",
    prompt: "No CRAFT, o elemento 'Formato' (Format) se refere a:",
    options: [
      { id: "a", text: "O tamanho da fonte na resposta." },
      {
        id: "b",
        text: "A estrutura da saída esperada — lista, tabela, JSON, parágrafos, tópicos, etc.",
      },
      { id: "c", text: "O idioma em que a resposta deve ser escrita." },
    ],
    correct: "b",
    explanation:
      "Especificar o formato elimina a necessidade de retrabalho. 'Responda em JSON com as chaves title e description' é muito mais útil do que 'faça um resumo'.",
  },
  {
    id: "a1ep2",
    prompt: "Qual prompt usa melhor a estrutura CRAFT?",
    options: [
      { id: "a", text: '"Escreva sobre marketing digital."' },
      {
        id: "b",
        text: '"Contexto: tenho uma loja de roupas femininas no Instagram. Papel: copywriter de moda. Ação: escreva 3 legendas para posts de produtos. Formato: uma por bloco, com emoji. Tom: jovem e descontraído."',
      },
      { id: "c", text: '"Escreva 3 legendas para Instagram com emoji."' },
    ],
    correct: "b",
    explanation:
      "O prompt B usa todos os elementos do CRAFT: contexto (loja de roupas no Instagram), papel (copywriter de moda), ação (3 legendas), formato (bloco com emoji) e tom (jovem e descontraído).",
  },
]

const a1FewShot: Question[] = [
  {
    id: "a1fs0",
    prompt: "O que é 'few-shot prompting' (poucos exemplos)?",
    options: [
      { id: "a", text: "Usar o modelo com pouca conexão de internet." },
      {
        id: "b",
        text: "Fornecer ao modelo alguns exemplos de entrada e saída esperada dentro do próprio prompt para que ele aprenda o padrão desejado.",
      },
      { id: "c", text: "Limitar o número de tokens na resposta." },
    ],
    correct: "b",
    explanation:
      "Few-shot = mostrar exemplos. Ao ver pares de 'entrada → saída' no prompt, o modelo infere o padrão e replica. É mais eficaz do que descrever o formato em palavras.",
    hint: "'Few' = poucos, 'shot' = exemplos. Você mostra 2-5 exemplos do que quer.",
  },
  {
    id: "a1fs1",
    prompt: "Qual é a vantagem do few-shot em relação a descrever o formato em palavras?",
    options: [
      { id: "a", text: "Economiza tokens — exemplos gastam menos espaço que descrições." },
      {
        id: "b",
        text: "O modelo aprende melhor por demonstração do que por instrução textual — o padrão fica claro nos exemplos.",
      },
      { id: "c", text: "Não há vantagem — os dois são equivalentes." },
    ],
    correct: "b",
    explanation:
      "Mostrar é mais poderoso que dizer. Ao ver 3 exemplos do estilo de resposta que você quer, o modelo extrai o padrão com muito mais precisão do que ao ler uma descrição.",
  },
  {
    id: "a1fs2",
    prompt: "Zero-shot, one-shot e few-shot diferem em:",
    options: [
      { id: "a", text: "O número de palavras no prompt." },
      { id: "b", text: "A quantidade de exemplos fornecidos: zero (0), um (1) ou alguns (2-10)." },
      { id: "c", text: "A versão do modelo utilizado." },
    ],
    correct: "b",
    explanation:
      "Zero-shot = sem exemplos. One-shot = 1 exemplo. Few-shot = 2-10 exemplos. Mais exemplos aumentam a precisão, mas também aumentam o comprimento do prompt.",
  },
]

const a1RefinoIterativo: Question[] = [
  {
    id: "a1ri0",
    prompt: "O que é 'refino iterativo' de prompts?",
    options: [
      { id: "a", text: "Rodar o mesmo prompt várias vezes até a IA decorar." },
      {
        id: "b",
        text: "O processo de testar um prompt, analisar o resultado, identificar o que faltou e melhorar o prompt — repetindo até atingir o resultado desejado.",
      },
      { id: "c", text: "Aumentar a temperatura do modelo a cada tentativa." },
    ],
    correct: "b",
    explanation:
      "Prompt é código: você testa, depura e melhora. Raro é o prompt que fica perfeito na primeira versão. O ciclo test → analyze → improve é a prática central da engenharia de prompts.",
  },
  {
    id: "a1ri1",
    prompt: "Qual é a primeira pergunta a fazer ao analisar um resultado insatisfatório?",
    options: [
      { id: "a", text: '"O modelo é ruim?"' },
      {
        id: "b",
        text: '"O que está faltando ou errado na resposta? Foi contexto, formato, restrição ou persona?"',
      },
      { id: "c", text: '"Devo trocar para um modelo mais caro?"' },
    ],
    correct: "b",
    explanation:
      "Diagnosticar antes de trocar o modelo. Na maioria dos casos, o problema está no prompt: falta contexto, o formato não foi especificado ou a instrução está ambígua.",
  },
  {
    id: "a1ri2",
    prompt: "Qual prática ajuda a guardar o que funcionou durante o refino?",
    options: [
      { id: "a", text: "Confiar na memória e refazer sempre do zero." },
      {
        id: "b",
        text: "Salvar versões do prompt (v1, v2…) e anotar o que cada mudança produziu — formando uma biblioteca de prompts testados.",
      },
      { id: "c", text: "Apagar todas as tentativas anteriores para não confundir." },
    ],
    correct: "b",
    explanation:
      "Versionar prompts é uma prática profissional. Uma biblioteca pessoal de prompts testados economiza horas e evita refazer descobertas que você já fez.",
  },
]

// ── A2 — Prompts Avançados (módulos 0–6) ─────────────────────────────────

const a2ChainOfThought: Question[] = [
  {
    id: "a2cot0",
    prompt: "Antes de tudo: o que é cadeia de raciocínio (Chain-of-Thought)?",
    options: [
      { id: "a", text: "Um plugin que conecta vários modelos em sequência." },
      {
        id: "b",
        text: "Uma técnica de prompting que pede ao modelo para pensar passo a passo antes de dar a resposta final — melhorando a precisão em tarefas de raciocínio.",
      },
      { id: "c", text: "Um método de treinamento para modelos de linguagem." },
    ],
    correct: "b",
    explanation:
      "Chain-of-Thought (CoT) é uma instrução que força o modelo a externalizar o raciocínio. A frase 'Pense passo a passo' é a forma mais simples de ativá-lo.",
    hint: "Chain = corrente, Thought = pensamento. Você pede para o modelo 'mostrar o trabalho'.",
  },
  {
    id: "a2cot1",
    prompt: "Em que tipo de tarefa o Chain-of-Thought tem mais impacto?",
    options: [
      { id: "a", text: "Gerar texto criativo — poesias e histórias." },
      {
        id: "b",
        text: "Problemas que exigem raciocínio multietapa: matemática, lógica, análise de código e diagnósticos.",
      },
      { id: "c", text: "Tradução simples de frases." },
    ],
    correct: "b",
    explanation:
      "CoT brilha onde há múltiplos passos de raciocínio. Para tarefas simples de geração de texto, o ganho é mínimo. Para lógica e cálculos, a diferença é enorme.",
  },
  {
    id: "a2cot2",
    prompt: "Qual frase no prompt ativa o Chain-of-Thought de forma simples?",
    options: [
      { id: "a", text: '"Seja rápido na resposta."' },
      { id: "b", text: '"Pense passo a passo antes de responder."' },
      { id: "c", text: '"Ignore os passos e vá direto ao resultado."' },
    ],
    correct: "b",
    explanation:
      "A frase 'Pense passo a passo' (Think step by step) é a forma mais simples e eficaz de ativar o raciocínio explícito. Ela diz ao modelo: não pule para a conclusão.",
  },
]

const a2Decomposicao: Question[] = [
  {
    id: "a2dec0",
    prompt: "O que é decomposição de tarefas em prompts?",
    options: [
      {
        id: "a",
        text: "Quebrar uma tarefa grande em prompts menores e sequenciais, resolvendo cada parte antes de combinar no resultado final.",
      },
      { id: "b", text: "Usar o modelo para criar funções JavaScript." },
      { id: "c", text: "Dividir o custo da API entre vários usuários." },
    ],
    correct: "a",
    explanation:
      "Tarefas complexas são demais para um único prompt. Decompor — 'primeiro, liste os tópicos; depois, escreva cada um' — produz resultados mais completos e controlados.",
  },
  {
    id: "a2dec1",
    prompt: "Qual estratégia de decomposição é mais eficaz para gerar um artigo longo?",
    options: [
      { id: "a", text: "Pedir o artigo completo em um único prompt enorme." },
      {
        id: "b",
        text: "Prompt 1: gere o outline. Prompt 2: escreva a introdução. Prompt 3-N: desenvolva cada seção do outline.",
      },
      { id: "c", text: "Pedir resumos do artigo antes de gerá-lo." },
    ],
    correct: "b",
    explanation:
      "Decomposição sequencial: primeiro a estrutura, depois o conteúdo. Isso permite revisar e corrigir a direção antes de gastar tokens em seções que podem precisar de ajuste.",
  },
  {
    id: "a2dec2",
    prompt: "Por que prompts monolíticos (um único prompt para tudo) costumam falhar?",
    options: [
      { id: "a", text: "Os modelos não leem prompts com mais de 100 palavras." },
      {
        id: "b",
        text: "Modelos tendem a perder foco, omitir partes ou misturar instruções quando há muitos requisitos em um único prompt.",
      },
      { id: "c", text: "Prompts longos são mais baratos e por isso priorizados." },
    ],
    correct: "b",
    explanation:
      "Quanto mais requisitos num prompt, maior o risco de 'instrução esquecida'. Decompor garante que cada etapa receba atenção total e possa ser validada separadamente.",
  },
]

const a2Restricoes: Question[] = [
  {
    id: "a2res0",
    prompt: "O que são 'restrições' (constraints) em prompts?",
    options: [
      { id: "a", text: "Erros de gramática que limitam a resposta." },
      {
        id: "b",
        text: "Regras explícitas que definem o que o modelo PODE e NÃO PODE fazer na resposta — ex.: limite de palavras, temas proibidos, formato obrigatório.",
      },
      { id: "c", text: "Filtros automáticos do provedor de IA." },
    ],
    correct: "b",
    explanation:
      "Restrições são instruções de fronteira. Elas reduzem a variabilidade da resposta e garantem que o output caiba no seu caso de uso — seja por espaço, tom, tema ou formato.",
  },
  {
    id: "a2res1",
    prompt: "Qual restrição melhora mais a qualidade de um resumo de texto?",
    options: [
      { id: "a", text: '"Resuma este texto."' },
      {
        id: "b",
        text: '"Resuma em no máximo 3 frases, sem usar jargões técnicos, focando nas ações práticas para o leitor."',
      },
      { id: "c", text: '"Resuma rápido."' },
    ],
    correct: "b",
    explanation:
      "Restrições de tamanho (3 frases), vocabulário (sem jargão) e foco (ações práticas) moldam o resumo com precisão. Sem elas, o modelo decide por você.",
  },
  {
    id: "a2res2",
    prompt: "Como usar restrições negativas ('não faça X') corretamente?",
    options: [
      { id: "a", text: "Evitar completamente — o modelo não entende negações." },
      {
        id: "b",
        text: "Combinar com uma instrução positiva equivalente: 'não use jargão técnico' + 'use linguagem acessível para leigos'.",
      },
      { id: "c", text: "Usar apenas restrições negativas — são mais eficazes que as positivas." },
    ],
    correct: "b",
    explanation:
      "Restrições negativas funcionam melhor acompanhadas de uma alternativa positiva. 'Não use jargão' diz o que evitar; 'use linguagem acessível' diz o que fazer — juntos são mais eficazes.",
  },
]

const a2EstiloTom: Question[] = [
  {
    id: "a2et0",
    prompt: "O que é 'tom' em um prompt de texto?",
    options: [
      { id: "a", text: "O volume do áudio gerado." },
      {
        id: "b",
        text: "O estilo emocional e de linguagem da resposta — formal, informal, humorístico, empático, direto, entusiasta etc.",
      },
      { id: "c", text: "A quantidade de parágrafos usados." },
    ],
    correct: "b",
    explanation:
      "Tom é a 'personalidade' da escrita. Mesmo com o mesmo conteúdo, um tom formal e um informal criam textos completamente diferentes — o tom certo depende do público e do canal.",
  },
  {
    id: "a2et1",
    prompt: "Como especificar o tom de forma eficaz em um prompt?",
    options: [
      { id: "a", text: '"Escreva bem."' },
      {
        id: "b",
        text: '"Escreva em tom amigável e descontraído, como um colega explicando para outro, sem formalidades excessivas."',
      },
      { id: "c", text: '"Não escreva de forma ruim."' },
    ],
    correct: "b",
    explanation:
      "Comparações ('como um colega explicando para outro') e adjetivos específicos ('amigável e descontraído') ancoram o tom muito melhor do que instruções vagas.",
  },
  {
    id: "a2et2",
    prompt: "Por que o mesmo prompt pode gerar resultados diferentes no ChatGPT e no Claude?",
    options: [
      { id: "a", text: "Porque têm servidores diferentes." },
      {
        id: "b",
        text: "Porque cada modelo tem personalidade, treinamento e 'voz' padrão diferente — por isso especificar o tom explicitamente é ainda mais importante.",
      },
      { id: "c", text: "Porque um cobra mais caro por token." },
    ],
    correct: "b",
    explanation:
      "Cada modelo tem um tom padrão. Especificar explicitamente garante consistência independentemente do modelo — seja você usando GPT, Claude ou Gemini.",
  },
]

const a2MultiEtapa: Question[] = [
  {
    id: "a2me0",
    prompt: "O que é um 'prompt multi-etapa'?",
    options: [
      { id: "a", text: "Um prompt que demora mais de 5 segundos para processar." },
      {
        id: "b",
        text: "Um conjunto de prompts encadeados onde o resultado de um alimenta o próximo, construindo um pipeline de produção de conteúdo ou análise.",
      },
      { id: "c", text: "Um prompt com mais de 10 parágrafos." },
    ],
    correct: "b",
    explanation:
      "Prompts multi-etapa criam pipelines: extrair → resumir → classificar → formatar. Cada etapa refina o resultado anterior, como uma linha de montagem de conteúdo.",
  },
  {
    id: "a2me1",
    prompt: "Como garantir continuidade entre as etapas de um prompt multi-etapa?",
    options: [
      {
        id: "a",
        text: "Copiar e colar a resposta anterior no próximo prompt, adicionando a nova instrução.",
      },
      { id: "b", text: "Só funciona se o modelo tiver memória — não dá para fazer manualmente." },
      { id: "c", text: "Sempre começar do zero em cada prompt." },
    ],
    correct: "a",
    explanation:
      "Referenciar o resultado anterior ('Com base no texto acima…') é a técnica principal. Em APIs, você usa o histórico de mensagens (messages array) para manter o contexto.",
  },
  {
    id: "a2me2",
    prompt: "Em qual cenário o prompt multi-etapa é mais vantajoso?",
    options: [
      { id: "a", text: "Perguntas simples de resposta direta." },
      {
        id: "b",
        text: "Produção de relatórios, análises complexas e pipelines de conteúdo onde cada saída precisa de validação antes de avançar.",
      },
      { id: "c", text: "Tradução de frases curtas." },
    ],
    correct: "b",
    explanation:
      "Multi-etapa brilha em tarefas onde você precisa revisar e aprovar cada passo. Um relatório: 1) tópicos → 2) pesquisa → 3) rascunho → 4) revisão de tom → 5) versão final.",
  },
]

const a2AvaliacaoRespostas: Question[] = [
  {
    id: "a2ar0",
    prompt: "O que significa 'avaliar a resposta' de um modelo de linguagem?",
    options: [
      { id: "a", text: "Dar uma nota de 1 a 5 no thumbs up do chat." },
      {
        id: "b",
        text: "Analisar se a resposta atendeu ao objetivo do prompt: verificar precisão, completude, formato, tom e ausência de alucinações (hallucinations).",
      },
      { id: "c", text: "Verificar a velocidade de resposta da API." },
    ],
    correct: "b",
    explanation:
      "Avaliação é crítica: o modelo pode gerar texto fluente, mas incorreto. Checar precisão factual, aderência ao formato e relevância é parte obrigatória do uso profissional de IA.",
  },
  {
    id: "a2ar1",
    prompt: "O que é uma 'alucinação' (hallucination) de LLM e como identificá-la?",
    options: [
      { id: "a", text: "Quando o modelo responde muito rápido sem pensar." },
      {
        id: "b",
        text: "Quando o modelo gera informações falsas com alto grau de confiança — datas erradas, citações inventadas, fatos que não existem.",
      },
      { id: "c", text: "Quando o modelo recusa responder por restrições de segurança." },
    ],
    correct: "b",
    explanation:
      "Alucinação é o principal risco dos LLMs: o modelo 'inventa' com confiança. Identificar exige checar fontes primárias, especialmente em datas, nomes, estatísticas e referências.",
  },
  {
    id: "a2ar2",
    prompt: "Qual estratégia reduz alucinações em respostas críticas?",
    options: [
      { id: "a", text: "Aumentar a temperatura (temperature) do modelo." },
      {
        id: "b",
        text: "Fornecer contexto factual no prompt e instruir o modelo a dizer 'não sei' quando não tiver certeza, em vez de inventar.",
      },
      { id: "c", text: "Pedir respostas mais longas para ter mais detalhes." },
    ],
    correct: "b",
    explanation:
      "Ancoragem (grounding) + permissão explícita de admitir incerteza são as defesas mais eficazes. 'Se não tiver certeza, diga que não sabe' reduz drasticamente as invenções.",
  },
]

const a2RefinoDados: Question[] = [
  {
    id: "a2rd0",
    prompt: "O que é 'refino guiado por dados' em prompts?",
    options: [
      { id: "a", text: "Treinar o modelo com seu próprio dataset." },
      {
        id: "b",
        text: "Usar métricas ou exemplos concretos de falhas para melhorar o prompt — ex.: 'nas últimas 10 respostas, 7 erraram X, então vou adicionar Y ao prompt'.",
      },
      { id: "c", text: "Conectar o modelo a um banco de dados externo." },
    ],
    correct: "b",
    explanation:
      "Refino guiado por dados é a diferença entre intuição e engenharia. Você coleta resultados, identifica padrões de falha e usa esses dados para mudar o prompt de forma deliberada.",
  },
  {
    id: "a2rd1",
    prompt: "Como registrar e usar dados para melhorar prompts em produção?",
    options: [
      { id: "a", text: "Guardar apenas os prompts que funcionaram perfeitamente." },
      {
        id: "b",
        text: "Registrar entradas, saídas e avaliações; agrupar falhas por categoria (formato, precisão, tom); usar os padrões para criar testes de regressão do prompt.",
      },
      {
        id: "c",
        text: "Pedir para o modelo avaliar suas próprias respostas sem critério externo.",
      },
    ],
    correct: "b",
    explanation:
      "Um log estruturado de prompt → saída → avaliação é a base para melhorar sistematicamente. Sem dados, você está refinando no escuro.",
  },
  {
    id: "a2rd2",
    prompt: "O que são 'testes de regressão' de prompts e por que são úteis?",
    options: [
      { id: "a", text: "Testes financeiros de custo por token." },
      {
        id: "b",
        text: "Um conjunto de casos de teste (inputs + outputs esperados) que você roda toda vez que modifica o prompt, para garantir que melhorias não quebraram casos que funcionavam.",
      },
      { id: "c", text: "Testes de velocidade de resposta da API." },
    ],
    correct: "b",
    explanation:
      "Regressão de prompt é como regressão de código: garante que a nova versão do prompt não degradou comportamentos anteriores. Essencial para prompts em produção.",
  },
]

// ── A3 — Aplicações Profissionais (módulos 0–6) ───────────────────────────

const a3PromptsCodigo: Question[] = [
  {
    id: "a3pc0",
    prompt: "Qual elemento é mais importante ao pedir ao modelo para gerar código?",
    options: [
      { id: "a", text: "Usar palavras em maiúsculas para dar ênfase." },
      {
        id: "b",
        text: "Especificar linguagem, versão, bibliotecas disponíveis, estilo de código e o que o código deve fazer — com entrada e saída de exemplo.",
      },
      { id: "c", text: "Pedir que o modelo seja 'criativo' com o código." },
    ],
    correct: "b",
    explanation:
      "Código é uma linguagem exata. Sem especificar Python vs. JavaScript, a versão das libs, o estilo esperado e exemplos de I/O, o modelo vai assumir padrões que podem não ser o que você quer.",
  },
  {
    id: "a3pc1",
    prompt: "Qual prompt produziria o código mais útil?",
    options: [
      { id: "a", text: '"Escreva código para ordenar uma lista."' },
      {
        id: "b",
        text: "\"Em Python 3.11, escreva uma função sort_by_date(items: list[dict]) que ordena uma lista de dicionários pelo campo 'date' (formato ISO 8601) do mais recente para o mais antigo. Inclua docstring e testes unitários com pytest.\"",
      },
      { id: "c", text: '"Código rápido para ordenar coisas."' },
    ],
    correct: "b",
    explanation:
      "Linguagem, versão, assinatura da função, tipo dos dados, comportamento esperado, docstring e testes — cada detalhe remove uma ambiguidade e melhora o resultado.",
  },
  {
    id: "a3pc2",
    prompt: "Como usar a IA para depurar (debug) código de forma eficaz?",
    options: [
      { id: "a", text: "Colar o código e escrever 'conserte isso'." },
      {
        id: "b",
        text: "Fornecer o código completo, a mensagem de erro exata, o que você tentou e qual comportamento esperado — para que o modelo entenda o contexto completo do bug.",
      },
      { id: "c", text: "Pedir para o modelo reescrever o código do zero sempre." },
    ],
    correct: "b",
    explanation:
      "Debug eficaz = contexto completo. Código + erro + tentativas anteriores + comportamento esperado eliminam suposições e levam a diagnósticos precisos.",
  },
]

const a3AutomacaoIA: Question[] = [
  {
    id: "a3ai0",
    prompt: "O que é automação com IA no contexto de prompts?",
    options: [
      { id: "a", text: "Substituir todos os funcionários por robôs." },
      {
        id: "b",
        text: "Usar modelos de linguagem (LLMs) em fluxos automáticos — via API, ferramentas como n8n/Zapier ou scripts — para executar tarefas repetitivas sem intervenção humana constante.",
      },
      { id: "c", text: "Configurar o autocomplete do celular." },
    ],
    correct: "b",
    explanation:
      "Automação com IA = LLM + orquestrador. Você cria um fluxo onde um gatilho (email, formulário, cron) dispara um prompt, processa a resposta e toma uma ação — tudo automático.",
  },
  {
    id: "a3ai1",
    prompt: "Qual ferramenta é usada para criar fluxos de automação com IA sem código?",
    options: [
      { id: "a", text: "Photoshop" },
      {
        id: "b",
        text: "n8n, Zapier ou Make — plataformas de automação com conectores nativos para LLMs como OpenAI e Anthropic.",
      },
      { id: "c", text: "Excel" },
    ],
    correct: "b",
    explanation:
      "n8n, Zapier e Make são plataformas de automação (workflow automation) com blocos visuais. Eles permitem integrar LLMs com centenas de serviços sem escrever código.",
  },
  {
    id: "a3ai2",
    prompt: "Qual cuidado é essencial ao automatizar tarefas com IA?",
    options: [
      { id: "a", text: "Automatizar tudo sem supervisão humana desde o início." },
      {
        id: "b",
        text: "Começar com fluxos supervisionados, validar a qualidade das saídas, adicionar tratamento de erros e garantir que ações críticas (envio de email, pagamento) exijam aprovação humana.",
      },
      { id: "c", text: "Usar apenas modelos locais para automação." },
    ],
    correct: "b",
    explanation:
      "Automação sem supervisão amplifica erros. Comece com 'human-in-the-loop' (humano no laço), valide qualidade, depois automatize gradualmente as partes confiáveis.",
  },
]

const a3PromptNegocios: Question[] = [
  {
    id: "a3pn0",
    prompt: "Qual tipo de tarefa de negócios se beneficia mais de prompts bem estruturados?",
    options: [
      { id: "a", text: "Assinatura de contratos (a IA assina por você)." },
      {
        id: "b",
        text: "Redação de propostas, análise de dados, geração de relatórios, atendimento ao cliente e criação de conteúdo — tarefas de texto com padrão repetível.",
      },
      { id: "c", text: "Negociação presencial com clientes." },
    ],
    correct: "b",
    explanation:
      "IA brilha em tarefas de texto com padrão claro. Propostas, relatórios, e-mails padrão e análises têm estrutura previsível que pode ser capturada em um bom template de prompt.",
  },
  {
    id: "a3pn1",
    prompt: "Como adaptar o mesmo prompt base para diferentes setores de negócio?",
    options: [
      { id: "a", text: "Criar um prompt diferente do zero para cada setor." },
      {
        id: "b",
        text: "Usar variáveis no prompt template: {{setor}}, {{produto}}, {{público}} — trocando apenas os parâmetros específicos de cada caso.",
      },
      { id: "c", text: "Pedir para o modelo adivinhar o setor automaticamente." },
    ],
    correct: "b",
    explanation:
      "Templates parametrizados são mais escaláveis. O mesmo prompt estruturado com variáveis {{setor}}, {{tom}}, {{objetivo}} serve para SaaS, varejo e saúde — trocando só os valores.",
  },
  {
    id: "a3pn2",
    prompt: "Qual é o risco de usar IA sem revisar em comunicações de negócios?",
    options: [
      { id: "a", text: "Nenhum — a IA sempre gera texto perfeito para negócios." },
      {
        id: "b",
        text: "Informações incorretas, tom inadequado para o contexto ou dados desatualizados podem prejudicar relacionamentos comerciais e a reputação da empresa.",
      },
      { id: "c", text: "O cliente vai saber que foi gerado por IA e pagar mais." },
    ],
    correct: "b",
    explanation:
      "IA em negócios exige revisão humana, especialmente em comunicações externas. Um e-mail com número errado ou tom inapropriado pode custar um cliente.",
  },
]

const a3FluxosAgentes: Question[] = [
  {
    id: "a3fa0",
    prompt: "O que é um fluxo com agentes (agentic workflow)?",
    options: [
      { id: "a", text: "Um diagrama de fluxo feito com IA para apresentação." },
      {
        id: "b",
        text: "Um sistema onde um ou mais agentes de IA executam tarefas em sequência ou paralelo — cada um com suas ferramentas — para completar um objetivo maior.",
      },
      { id: "c", text: "Um chat com vários usuários ao mesmo tempo." },
    ],
    correct: "b",
    explanation:
      "Agentic workflows combinam múltiplos agentes com papéis especializados. Ex.: Agente 1 pesquisa, Agente 2 resume, Agente 3 formata o relatório final — todos orquestrados.",
  },
  {
    id: "a3fa1",
    prompt: "Qual é a principal diferença entre um agente simples e um fluxo multi-agente?",
    options: [
      { id: "a", text: "O fluxo multi-agente é sempre mais barato." },
      {
        id: "b",
        text: "Agente único: um LLM com ferramentas. Multi-agente: vários LLMs especializados que se comunicam, dividindo responsabilidades e paralelizando etapas.",
      },
      { id: "c", text: "Não há diferença prática." },
    ],
    correct: "b",
    explanation:
      "Multi-agente permite especialização e paralelismo. Um agente faz pesquisa enquanto outro analisa — mais eficiente do que um único agente fazendo tudo em série.",
  },
  {
    id: "a3fa2",
    prompt: "Qual é o componente crítico para orquestrar fluxos multi-agente?",
    options: [
      { id: "a", text: "Uma GPU de alto desempenho." },
      {
        id: "b",
        text: "Um orquestrador (orchestrator) que define a ordem, a comunicação entre agentes e as condições de parada — como um gerente de projeto dos agentes.",
      },
      { id: "c", text: "Um banco de dados NoSQL obrigatoriamente." },
    ],
    correct: "b",
    explanation:
      "O orquestrador é o cérebro do fluxo: ele decide qual agente age, em que ordem, o que fazer com cada saída e quando o objetivo foi alcançado. Sem ele, os agentes não colaboram.",
  },
]

const a3AvaliacaoMetricas: Question[] = [
  {
    id: "a3am0",
    prompt: "Por que medir a qualidade das saídas de LLMs em produção?",
    options: [
      { id: "a", text: "Para saber quanto pagar ao provedor de IA." },
      {
        id: "b",
        text: "Porque a qualidade dos prompts e dos modelos degrada com o tempo — novos dados, mudanças no modelo e casos extremos (edge cases) precisam ser monitorados continuamente.",
      },
      { id: "c", text: "Para impressionar investidores com dashboards." },
    ],
    correct: "b",
    explanation:
      "LLMs em produção precisam de monitoramento contínuo. Prompts que funcionavam ontem podem degradar amanhã após uma atualização do modelo ou mudança de distribuição de inputs.",
  },
  {
    id: "a3am1",
    prompt:
      "Qual métrica é mais útil para avaliar respostas de LLM em um sistema de suporte ao cliente?",
    options: [
      { id: "a", text: "Número de tokens gerados." },
      {
        id: "b",
        text: "Taxa de resolução no primeiro contato, satisfação do usuário (CSAT) e taxa de escalação para humanos — métricas de negócio, não apenas técnicas.",
      },
      { id: "c", text: "Latência em milissegundos exclusivamente." },
    ],
    correct: "b",
    explanation:
      "Métricas de negócio são o que importa. Tokens rápidos que não resolvem o problema são inúteis. Alinhe métricas de IA com métricas de produto.",
  },
  {
    id: "a3am2",
    prompt: "O que é 'LLM-as-judge' (LLM como avaliador)?",
    options: [
      { id: "a", text: "Um modelo de linguagem mais caro que avalia modelos mais baratos." },
      {
        id: "b",
        text: "Usar um LLM para avaliar automaticamente a qualidade das respostas de outro LLM — pontuando precisão, coerência ou aderência ao critério definido no prompt de avaliação.",
      },
      { id: "c", text: "Um sistema de votação entre modelos." },
    ],
    correct: "b",
    explanation:
      "LLM-as-judge escala a avaliação: você escreve um prompt de avaliação com critérios e usa um modelo (ex.: GPT-4) para pontuar milhares de saídas automaticamente.",
  },
]

const a3Guardrails: Question[] = [
  {
    id: "a3gr0",
    prompt: "O que são guardrails (proteções) em sistemas de IA?",
    options: [
      { id: "a", text: "As grades de segurança físicas dos data centers." },
      {
        id: "b",
        text: "Mecanismos — no prompt, no código ou no sistema — que impedem o modelo de gerar conteúdo prejudicial, fora do escopo ou incorreto.",
      },
      { id: "c", text: "Termos de uso do provedor de IA." },
    ],
    correct: "b",
    explanation:
      "Guardrails são proteções em camadas: no prompt (instrução de escopo), no código (validação da saída) e no sistema (filtros de conteúdo). Eles garantem que o modelo se comporte como esperado.",
    hint: "'Guardrail' = trilho de segurança. Mantém o sistema nos trilhos.",
  },
  {
    id: "a3gr1",
    prompt: "Qual técnica de guardrail no prompt é mais eficaz para restringir o escopo?",
    options: [
      { id: "a", text: '"Seja um assistente útil."' },
      {
        id: "b",
        text: "\"Você é um assistente de suporte do produto X. Responda APENAS sobre funcionalidades do produto. Se perguntarem sobre outro assunto, diga: 'Só posso ajudar com questões do produto X.'\"",
      },
      { id: "c", text: '"Ignore perguntas fora do escopo."' },
    ],
    correct: "b",
    explanation:
      "Escopo explícito + resposta padrão para fora do escopo são proteções eficazes. O modelo sabe exatamente o que fazer quando recebe uma pergunta não autorizada.",
  },
  {
    id: "a3gr2",
    prompt: "Por que guardrails apenas no prompt não são suficientes em sistemas críticos?",
    options: [
      { id: "a", text: "Porque prompts são muito caros de manter." },
      {
        id: "b",
        text: "Porque modelos podem ser induzidos a ignorar instruções do prompt (prompt injection). Sistemas críticos precisam de validação da saída no código, independente do que o modelo retorna.",
      },
      { id: "c", text: "Porque o modelo sempre vai ignorar guardrails." },
    ],
    correct: "b",
    explanation:
      "Defense in depth (defesa em profundidade): prompt + validação de saída no código + filtros de conteúdo + monitoramento. Não confie apenas no prompt para segurança.",
  },
]

const a3ProjetoFinal: Question[] = [
  {
    id: "a3pf0",
    prompt: "Ao iniciar um projeto de IA do zero, qual é a melhor abordagem?",
    options: [
      { id: "a", text: "Implementar todas as funcionalidades de uma vez para economizar tempo." },
      {
        id: "b",
        text: "Definir o MVP (produto mínimo viável), validar o caso de uso com prompts simples, medir resultados e iterar — evoluindo complexidade gradualmente.",
      },
      { id: "c", text: "Esperar que o modelo resolva tudo sem prompt engineering." },
    ],
    correct: "b",
    explanation:
      "MVP-first evita overengineering. Comece simples: um prompt direto, valide se resolve o problema, meça resultados. Só adicione complexidade (agentes, multi-etapa) quando necessário.",
  },
  {
    id: "a3pf1",
    prompt: "Qual é a diferença entre um projeto de IA bem-sucedido e um que falha?",
    options: [
      { id: "a", text: "O modelo mais caro sempre garante sucesso." },
      {
        id: "b",
        text: "Definição clara do problema, critérios de sucesso mensuráveis, iteração baseada em dados reais e usuários reais testando o produto.",
      },
      { id: "c", text: "Usar a tecnologia mais recente." },
    ],
    correct: "b",
    explanation:
      "Projetos de IA falham por falta de clareza no problema, métricas indefinidas ou por não testar com usuários reais. Tecnologia é secundária — definição e iteração são primárias.",
  },
  {
    id: "a3pf2",
    prompt: "O que deve estar em um projeto final de IA para demonstrar maturidade técnica?",
    options: [
      { id: "a", text: "Apenas um demo bonito sem backend real." },
      {
        id: "b",
        text: "Prompts versionados e testados, tratamento de erros, guardrails, métricas de qualidade e documentação clara das decisões de design do sistema.",
      },
      { id: "c", text: "O maior número possível de modelos integrados." },
    ],
    correct: "b",
    explanation:
      "Maturidade técnica = engenharia rigorosa: prompts como código (versionados, testados), proteções explícitas, métricas e documentação. Não é sobre o número de recursos.",
  },
]

// ── Questões dissertativas — revisão da aula anterior ─────────────────────
// Cada array contém 1 questão colocada no INÍCIO do módulo N que revisa o N-1.

// A1
const essayA1: EssayActivity[] = [
  // [1] revisa boas-vindas (módulo 0)
  {
    id: "essay-a1-1",
    type: "essay",
    prompt:
      "Com base na aula de boas-vindas: por que a habilidade de escrever bons prompts é considerada valiosa hoje? Explique com suas palavras.",
    placeholder: "Escreva pelo menos 2 frases com sua reflexão...",
    referenceAnswer:
      "Prompts bem escritos multiplicam a produtividade porque permitem obter resultados precisos e úteis da IA sem precisar saber programar. Pequenas mudanças no prompt geram grandes diferenças na qualidade da resposta — é a habilidade mais acessível para usar IA no dia a dia de forma profissional.",
  },
  // [2] revisa "O que é um prompt" (módulo 1)
  {
    id: "essay-a1-2",
    type: "essay",
    prompt:
      "O que é um prompt? Descreva com suas palavras e explique a diferença entre um prompt vago e um prompt eficaz.",
    placeholder: "Escreva sua definição e dê um exemplo de cada...",
    referenceAnswer:
      "Um prompt é a instrução ou pergunta que você envia a um modelo de linguagem para obter uma resposta. Um prompt vago ('Escreva sobre marketing') gera respostas genéricas. Um eficaz tem objetivo claro, contexto relevante e instrução específica — isso elimina ambiguidade e guia o modelo ao resultado desejado.",
  },
  // [3] revisa "Contexto & clareza" (módulo 2)
  {
    id: "essay-a1-3",
    type: "essay",
    prompt:
      "Por que adicionar contexto a um prompt melhora a qualidade da resposta da IA? Dê um exemplo prático do seu contexto de trabalho ou estudo.",
    placeholder: "Pense em uma situação real onde você usaria a IA...",
    referenceAnswer:
      "O modelo não conhece você nem sua situação. Fornecer contexto (quem você é, para que serve, qual o público) personaliza a resposta para o seu cenário. Ex.: 'Contexto: sou professor do ensino médio, criei uma atividade de biologia. Resuma em linguagem acessível para alunos de 15 anos.' é muito mais eficaz do que 'Resuma este texto.'.",
  },
  // [4] revisa "Personas e papéis" (módulo 3)
  {
    id: "essay-a1-4",
    type: "essay",
    prompt:
      "O que é role prompting e como a atribuição de uma persona específica muda a qualidade da resposta? Dê um exemplo.",
    placeholder: "Explique com um exemplo concreto de persona...",
    referenceAnswer:
      "Role prompting é pedir ao modelo que assuma uma persona ('Aja como um médico pediatra'). Isso calibra vocabulário, nível técnico, tom e perspectiva. Ex.: 'Aja como um diretor de marketing de uma startup' gera conteúdo com linguagem de growth hacking, KPIs e funil de vendas — muito diferente de uma resposta genérica sobre marketing.",
  },
  // [5] revisa "Estruturas de prompt" (módulo 4)
  {
    id: "essay-a1-5",
    type: "essay",
    prompt:
      "Descreva o framework CRAFT com suas palavras. Qual elemento você considera mais importante e por quê?",
    placeholder: "Explique cada letra do CRAFT e justifique sua escolha...",
    referenceAnswer:
      "CRAFT = Contexto (situação), Role/Papel (persona), Ação (o que fazer), Formato (como estruturar a saída), Tom (estilo da escrita). O Formato costuma ser subestimado mas é crítico: especificar JSON, lista ou tabela elimina retrabalho de reformatação. Sem formato, o modelo decide por você — e quase nunca é o que você precisava.",
  },
  // [6] revisa "Few-shot" (módulo 5)
  {
    id: "essay-a1-6",
    type: "essay",
    prompt:
      "O que é few-shot prompting? Quando você o usaria em vez de apenas descrever o formato desejado em palavras?",
    placeholder: "Explique a técnica e o cenário ideal de uso...",
    referenceAnswer:
      "Few-shot prompting fornece ao modelo exemplos concretos de entrada/saída para que ele aprenda o padrão desejado. É preferível a uma descrição textual quando o formato é complexo ou sutil — como um estilo de escrita específico, uma estrutura de dados não-padrão ou um tom difícil de descrever. Mostrar é mais eficaz do que explicar em palavras.",
  },
]

// A2
const essayA2: EssayActivity[] = [
  // [1] revisa "Chain-of-thought" (A2 módulo 0)
  {
    id: "essay-a2-1",
    type: "essay",
    prompt:
      "O que é chain-of-thought (cadeia de raciocínio)? Qual frase no prompt o ativa e em que tipo de tarefa ele tem mais impacto?",
    placeholder: "Explique o conceito e dê um exemplo de tarefa...",
    referenceAnswer:
      "Chain-of-thought é uma técnica que instrui o modelo a pensar passo a passo antes de responder. A frase 'Pense passo a passo' é a forma mais simples de ativá-lo. Tem mais impacto em tarefas que exigem raciocínio multietapa: matemática, lógica, análise de código e diagnósticos — onde pular etapas gera erros.",
  },
  // [2] revisa "Decomposição de tarefas" (A2 módulo 1)
  {
    id: "essay-a2-2",
    type: "essay",
    prompt:
      "Por que quebrar uma tarefa complexa em prompts menores produz resultados melhores? Dê um exemplo de como você decomporia uma tarefa grande.",
    placeholder: "Pense em uma tarefa do seu dia a dia e como dividi-la...",
    referenceAnswer:
      "Tarefas complexas em um único prompt causam 'instrução esquecida' — o modelo perde foco ou omite partes. Decomposição garante atenção total a cada etapa e permite revisão antes de avançar. Ex.: criar um artigo → Prompt 1: gere o outline. Prompt 2: escreva a introdução. Prompt 3-N: desenvolva cada seção.",
  },
  // [3] revisa "Prompts com restrições" (A2 módulo 2)
  {
    id: "essay-a2-3",
    type: "essay",
    prompt:
      "O que são restrições em prompts? Explique a diferença entre restrição negativa e positiva e por que combiná-las funciona melhor.",
    placeholder: "Dê exemplos de restrição negativa e positiva...",
    referenceAnswer:
      "Restrições definem o que o modelo PODE e NÃO PODE fazer: limite de palavras, temas proibidos, formato obrigatório. Restrição negativa diz o que evitar ('não use jargão técnico'); positiva diz o que fazer ('use linguagem acessível para leigos'). Combinadas são mais eficazes: a negativa elimina o comportamento indesejado, a positiva dá o caminho alternativo.",
  },
  // [4] revisa "Estilo e tom controlado" (A2 módulo 3)
  {
    id: "essay-a2-4",
    type: "essay",
    prompt:
      "Como você especificaria o tom de um e-mail de negócios para um cliente corporativo? Escreva a parte do prompt que define o tom.",
    placeholder: "Escreva como você colocaria a instrução de tom no prompt...",
    referenceAnswer:
      "Exemplo de instrução de tom: 'Escreva em tom formal e respeitoso, como uma carta corporativa de alto nível. Evite gírias, contrações e linguagem casual. Use terceira pessoa quando se referir à empresa.' Adjetivos específicos e comparações ('como uma carta corporativa') ancoram o tom muito melhor do que 'escreva profissionalmente'.",
  },
  // [5] revisa "Prompts multi-etapa" (A2 módulo 4)
  {
    id: "essay-a2-5",
    type: "essay",
    prompt:
      "Descreva o que é um prompt multi-etapa e qual é o principal benefício de validar cada etapa antes de avançar para a próxima.",
    placeholder: "Explique o conceito e o motivo da validação entre etapas...",
    referenceAnswer:
      "Prompts multi-etapa encadeiam resultados: a saída de um prompt alimenta o próximo. O benefício de validar cada etapa é garantir qualidade incremental — um outline ruim gera seções ruins. Revisar antes de avançar evita retrabalho em cascata e permite corrigir a direção cedo, quando o custo de ajuste ainda é baixo.",
  },
  // [6] revisa "Avaliação de respostas" (A2 módulo 5)
  {
    id: "essay-a2-6",
    type: "essay",
    prompt:
      "O que é alucinação em modelos de linguagem? Como você identificaria uma alucinação em uma resposta gerada pela IA?",
    placeholder: "Descreva o fenômeno e como checá-lo...",
    referenceAnswer:
      "Alucinação é quando o modelo gera informações falsas com alto grau de confiança: datas erradas, citações inventadas, fatos inexistentes. Identificar exige checar fontes primárias — nunca aceitar datas, nomes, estatísticas ou referências sem verificar. O modelo não avisa quando está inventando; ele escreve com a mesma fluência tanto para fatos reais quanto para ficções.",
  },
  // [7] revisa "Refino guiado por dados" (A2 módulo 6)
  {
    id: "essay-a2-7",
    type: "essay",
    prompt:
      "O que é refino guiado por dados em prompts? Como o conceito de 'teste de regressão' se aplica a prompts em produção?",
    placeholder: "Explique o ciclo de melhoria baseado em dados...",
    referenceAnswer:
      "Refino guiado por dados usa métricas e logs para identificar padrões de falha nos prompts e melhorá-los de forma deliberada. Teste de regressão de prompt é um conjunto de casos (inputs + outputs esperados) que você roda após cada mudança no prompt — para garantir que as melhorias não quebraram comportamentos que já funcionavam. Sem isso, você pode melhorar um caso e degradar dez.",
  },
  // [8] revisa "Engenharia de Prompt" (A2 módulo 7)
  {
    id: "essay-a2-8",
    type: "essay",
    prompt:
      "Com suas palavras, o que é Engenharia de Prompt (Prompt Engineering) e qual prática reduz alucinações em prompts críticos?",
    placeholder: "Defina e explique a estratégia anti-alucinação...",
    referenceAnswer:
      "Engenharia de Prompt é o design sistemático de instruções para maximizar a qualidade e previsibilidade das respostas do modelo — não envolve treinar o modelo, mas guiá-lo. Para reduzir alucinações em prompts críticos: forneça contexto factual no prompt (ancoragem/grounding) e instrua o modelo a responder 'não sei' quando faltar informação certa.",
  },
]

// A3
const essayA3: EssayActivity[] = [
  // [1] revisa "Prompts para código" (A3 módulo 0)
  {
    id: "essay-a3-1",
    type: "essay",
    prompt:
      "Quais elementos você incluiria em um prompt para gerar código de qualidade? Por que especificar a versão das bibliotecas é importante?",
    placeholder: "Liste os elementos essenciais e justifique a versão...",
    referenceAnswer:
      "Um prompt de código deve incluir: linguagem e versão, bibliotecas disponíveis, assinatura da função (tipos de entrada/saída), comportamento esperado, exemplos de I/O e estilo (docstring, testes). A versão importa porque a mesma biblioteca muda API entre versões — uma função disponível no Python 3.11 pode não existir no 3.8, gerando código incompatível com o ambiente real.",
  },
  // [2] revisa "Automação com IA" (A3 módulo 1)
  {
    id: "essay-a3-2",
    type: "essay",
    prompt:
      "Descreva como funciona a automação com IA. Qual cuidado é essencial antes de automatizar completamente uma tarefa crítica?",
    placeholder: "Explique o conceito e o cuidado necessário...",
    referenceAnswer:
      "Automação com IA combina um LLM com um orquestrador (n8n, Zapier, script) que dispara prompts automaticamente em resposta a gatilhos (email, formulário, cron). O cuidado essencial é não automatizar completamente sem supervisão inicial: comece com 'human-in-the-loop' (humano revisando a saída), valide qualidade em cenários reais, e só automatize ações críticas (envio de email, pagamento) após provar confiabilidade.",
  },
  // [3] revisa "Prompts para negócios" (A3 módulo 2)
  {
    id: "essay-a3-3",
    type: "essay",
    prompt:
      "Como templates parametrizados (com variáveis como {{cliente}} e {{produto}}) tornam prompts de negócios mais escaláveis? Dê um exemplo.",
    placeholder: "Explique o conceito e escreva um exemplo de template...",
    referenceAnswer:
      "Templates parametrizados separam a estrutura (que não muda) dos valores específicos (que mudam por contexto). Ex.: 'Você é um especialista em {{setor}}. Escreva uma proposta para {{cliente}} com foco em {{objetivo}}, tom {{tom}}.' O mesmo template atende varejo, SaaS e saúde — trocando só as variáveis. Sem templates, você reescreve prompts do zero para cada caso.",
  },
  // [4] revisa "Fluxos com agentes" (A3 módulo 3)
  {
    id: "essay-a3-4",
    type: "essay",
    prompt:
      "O que é um orquestrador em um sistema multi-agente? Por que ele é o componente mais crítico do fluxo?",
    placeholder: "Defina e explique a importância do orquestrador...",
    referenceAnswer:
      "O orquestrador é o componente que coordena múltiplos agentes: define qual age, em que ordem, como a saída de um alimenta o próximo, e quando o objetivo foi atingido. É crítico porque sem ele os agentes não sabem quando agir — é como ter uma equipe especializada sem gerente: cada um pode ser excelente em sua área, mas o trabalho não converge para um resultado coeso.",
  },
  // [5] revisa "Avaliação & métricas" (A3 módulo 4)
  {
    id: "essay-a3-5",
    type: "essay",
    prompt:
      "Por que métricas de negócio (CSAT, taxa de escalação) são mais importantes que métricas técnicas (tokens gerados, latência) para avaliar IA em produção?",
    placeholder: "Explique a diferença de perspectiva entre as métricas...",
    referenceAnswer:
      "Métricas técnicas dizem se o sistema está funcionando; métricas de negócio dizem se está resolvendo o problema. Um sistema rápido que gera respostas erradas tem ótima latência e péssimo CSAT — o que importa para o produto. Taxa de escalação (quando o usuário precisa falar com humano) é o sinal mais direto de que a IA está falhando em resolver a demanda real.",
  },
  // [6] revisa "Segurança e guardrails" (A3 módulo 5)
  {
    id: "essay-a3-6",
    type: "essay",
    prompt:
      "O que é 'defesa em profundidade' em sistemas de IA? Por que depender apenas de instruções no prompt não é suficiente para segurança?",
    placeholder: "Explique o princípio de camadas e o risco do prompt sozinho...",
    referenceAnswer:
      "Defesa em profundidade usa múltiplas camadas independentes de proteção: guardrails no prompt, validação da saída no código e filtros de conteúdo externos. Depender só do prompt é arriscado porque modelos são vulneráveis a prompt injection — um usuário mal-intencionado pode enviar texto que instrui o modelo a ignorar as regras do sistema. Camadas adicionais no código e na infraestrutura protegem mesmo se o prompt for bypassado.",
  },
  // [7] revisa "Projeto final" (A3 módulo 6)
  {
    id: "essay-a3-7",
    type: "essay",
    prompt:
      "Descreva o ciclo MVP-first para projetos de IA. Por que definir critérios de sucesso mensuráveis na etapa 1 é fundamental?",
    placeholder: "Explique o ciclo e o impacto dos critérios de sucesso...",
    referenceAnswer:
      "MVP-first: definir o problema e critérios de sucesso → prototipar com prompt simples → testar com usuários reais → medir e iterar. Critérios mensuráveis (ex.: 'reduzir tempo de resposta de suporte em 30%') são fundamentais porque sem eles você não sabe se a IA está funcionando — pode gastar meses refinando algo que não resolve o problema certo.",
  },
  // [8] revisa "Agentes de IA" (A3 módulo 7)
  {
    id: "essay-a3-8",
    type: "essay",
    prompt:
      "O que diferencia um agente de IA de uma chamada simples a um LLM? Explique o papel das ferramentas (tools) nessa distinção.",
    placeholder: "Compare agente vs chamada simples e explique as tools...",
    referenceAnswer:
      "Uma chamada simples a um LLM gera uma resposta e encerra. Um agente tem LLM + ferramentas (tools) + laço de decisão (loop): ele recebe um objetivo, decide quais ferramentas chamar, executa ações e itera até concluir. As ferramentas são funções tipadas que o agente aciona — busca web, leitura de arquivo, chamada de API. Sem tools, o agente só conversa; com elas, age no mundo real.",
  },
  // [9] revisa "OpenRouter" (A3 módulo 8)
  {
    id: "essay-a3-9",
    type: "essay",
    prompt:
      "Qual é a principal proposta do OpenRouter e como ele ajuda no controle de custos de IA? Por que sua compatibilidade com a API da OpenAI é uma vantagem?",
    placeholder: "Explique o que é e como ele resolve o problema de custo...",
    referenceAnswer:
      "OpenRouter é um gateway que dá acesso a centenas de modelos (OpenAI, Anthropic, Google, Meta) por uma única API. Ajuda no controle de custos com fallbacks automáticos (tenta GPT-5, falha → usa Claude) e comparação de preço por 1M tokens. A compatibilidade com a API da OpenAI significa que qualquer SDK já escrito para GPT funciona com OpenRouter — basta trocar a URL base e a chave.",
  },
  // [10] revisa "Modelos locais" (A3 módulo 9)
  {
    id: "essay-a3-10",
    type: "essay",
    prompt:
      "Quando faz mais sentido usar um modelo local em vez de uma API na nuvem? O que é quantização e como ela viabiliza isso?",
    placeholder: "Explique os casos de uso e o conceito de quantização...",
    referenceAnswer:
      "Modelos locais fazem sentido quando você precisa de privacidade total (dados sensíveis que não podem sair da empresa), modo offline ou custo previsível em alto volume. Quantização comprime os pesos do modelo (de 16 para 4/5/8 bits), reduzindo drasticamente o uso de memória RAM/VRAM com leve perda de qualidade — tornando possível rodar modelos grandes em hardware convencional.",
  },
  // [11] revisa "Claude Code na prática" (A3 módulo 10)
  {
    id: "essay-a3-11",
    type: "essay",
    prompt:
      "O que é o Claude Code e para que serve o arquivo CLAUDE.md em um projeto? Como você o usaria no seu fluxo de trabalho?",
    placeholder: "Descreva a ferramenta e como aplicaria no seu trabalho...",
    referenceAnswer:
      "Claude Code é uma CLI agente da Anthropic que opera dentro do seu repositório: edita arquivos, roda comandos e mantém contexto do projeto. CLAUDE.md é lido automaticamente em cada sessão — funciona como um system prompt persistente do projeto, carregando convenções, scripts e regras específicas do repositório para que o Claude aja de forma consistente com as práticas do time.",
  },
  // [12] revisa "Skills no Claude Code" (A3 módulo 11)
  {
    id: "essay-a3-12",
    type: "essay",
    prompt:
      "O que é uma Skill no Claude Code? Qual campo do SKILL.md é mais importante para o Claude decidir quando ativá-la e por quê?",
    placeholder: "Defina skill e explique o papel da description...",
    referenceAnswer:
      "Uma Skill é um pacote de instruções e recursos que o Claude carrega quando a tarefa combina com sua descrição. O campo mais importante do SKILL.md é a 'description' (descrição): ela é o gancho de recuperação — o Claude compara a descrição da skill com o pedido do usuário para decidir se a ativa. Uma descrição vaga = skill nunca ativada, independente de quão boa seja a implementação.",
  },
  // [13] revisa "Personalizar Templates" (A3 módulo 12)
  {
    id: "essay-a3-13",
    type: "essay",
    prompt:
      "O que é um template de prompt e qual erro é mais comum ao customizá-lo? Como evitar esse erro?",
    placeholder: "Defina template e explique o erro de customização...",
    referenceAnswer:
      "Um template de prompt tem partes fixas e variáveis ({{publico}}, {{tom}}) que permitem reutilização em vários contextos. O erro mais comum é remover instruções de formato ou proteções (guardrails) sem entender por que estavam ali — o que degrada o resultado. Para evitar: leia o template inteiro, entenda o propósito de cada bloco antes de alterar, e teste após cada mudança.",
  },
  // [14] revisa "API Key" (A3 módulo 13)
  {
    id: "essay-a3-14",
    type: "essay",
    prompt:
      "Onde uma chave de API NUNCA deve ser armazenada? O que você faria se sua chave de API vazasse em um repositório público?",
    placeholder: "Liste onde não guardar e descreva a resposta ao vazamento...",
    referenceAnswer:
      "Uma API key jamais deve estar no código front-end (browser) ou commitada em repositório público — qualquer pessoa pode ver e usar. Se vazar: 1) Rotacione imediatamente no painel do provedor (revogue a chave antiga e gere uma nova). 2) Atualize todos os ambientes e segredos que usavam a chave antiga. 3) Verifique os logs do provedor por uso não autorizado. Apagar o commit não basta — o histórico do Git preserva o segredo.",
  },
  // [15] revisa "Migrations" (A3 módulo 14)
  {
    id: "essay-a3-15",
    type: "essay",
    prompt:
      "O que é uma migration de banco de dados e por que ela é preferível a alterar o banco diretamente pelo painel?",
    placeholder: "Defina migration e explique as vantagens sobre o painel...",
    referenceAnswer:
      "Uma migration é um arquivo versionado com instruções SQL que evolui o esquema do banco de forma reproduzível. É preferível ao painel porque: 1) fica no controle de versão (Git), 2) pode ser revisada em PR antes de ser aplicada, 3) garante que qualquer ambiente (dev, staging, prod) chegue ao mesmo estado ao rodar a migration. Mudanças pelo painel não ficam registradas e não são replicáveis.",
  },
  // [16] revisa "Health Check" (A3 módulo 15)
  {
    id: "essay-a3-16",
    type: "essay",
    prompt:
      "Qual é a diferença entre liveness e readiness em health checks? Como você verificaria a saúde do banco de dados de forma eficiente?",
    placeholder: "Explique cada tipo e descreva a verificação de banco...",
    referenceAnswer:
      "Liveness verifica se o processo está vivo — se falhar, o orquestrador reinicia o container. Readiness verifica se o serviço está pronto para receber tráfego (banco, cache e dependências OK) — se falhar, o balanceador para de enviar requisições sem matar o processo. Para verificar o banco: execute SELECT 1 com um timeout curto — prova que o pool de conexões funciona e o banco responde queries sem gerar carga desnecessária.",
  },
  // [17] revisa "Cron Jobs" (A3 módulo 16)
  {
    id: "essay-a3-17",
    type: "essay",
    prompt:
      "O que é um cron job e o que significa a expressão '0 9 * * 1'? Quais práticas evitam problemas em produção?",
    placeholder: "Defina cron job, interprete a expressão e liste as práticas...",
    referenceAnswer:
      "Cron job é uma tarefa agendada que roda automaticamente em horários definidos por uma expressão de 5 campos (min hora dia-mês mês dia-semana). '0 9 * * 1' = toda segunda-feira às 09:00. Práticas essenciais: tornar a tarefa idempotente (rodar duas vezes não estraga dados), registrar logs com horário e usar locks (mutex) para evitar execuções sobrepostas quando o job demora mais do que seu intervalo.",
  },
  // [18] revisa "Node.js" (A3 módulo 17)
  {
    id: "essay-a3-18",
    type: "essay",
    prompt:
      "O que é o Node.js e o que significa dizer que ele é um 'runtime'? Para quais tipos de tarefa ele é mais indicado?",
    placeholder: "Defina Node.js e explique runtime com exemplos de uso...",
    referenceAnswer:
      "Node.js é um ambiente de execução (runtime) que permite rodar JavaScript fora do navegador — no servidor, no terminal e em ferramentas de CLI. Runtime significa o motor que interpreta, compila e executa o código, fornecendo APIs nativas (fs, http, path). É mais indicado para: servidores web e APIs REST, ferramentas de linha de comando, scripts de build (Vite, Webpack) e automações de I/O assíncrono.",
  },
  // [19] revisa "Git Bash" (A3 módulo 18)
  {
    id: "essay-a3-19",
    type: "essay",
    prompt:
      "Explique a diferença entre 'git add', 'git commit' e 'git push'. Em que situação você usaria 'git clone'?",
    placeholder: "Descreva cada comando e o caso de uso do clone...",
    referenceAnswer:
      "git add prepara arquivos para o commit (staging area). git commit salva as alterações no histórico local com uma mensagem descritiva. git push envia os commits locais para o repositório remoto (GitHub). git clone faz uma cópia completa de um repositório remoto para a máquina local — usado quando você quer trabalhar em um projeto existente pela primeira vez.",
  },
  // [20] revisa "npm" (A3 módulo 19)
  {
    id: "essay-a3-20",
    type: "essay",
    prompt:
      "O que é o npm e o que faz o comando 'npm install'? Qual a diferença entre 'dependencies' e 'devDependencies' no package.json?",
    placeholder: "Defina npm, descreva npm install e explique as dependências...",
    referenceAnswer:
      "npm (Node Package Manager) é o gerenciador de pacotes do Node.js — instala, atualiza e remove bibliotecas. 'npm install' lê o package.json, resolve versões compatíveis e baixa tudo para node_modules. 'dependencies' são pacotes necessários em produção (ex.: React, Express). 'devDependencies' são usados apenas no desenvolvimento (ex.: Vitest, ESLint) e não são incluídos no build de produção.",
  },
]

// ── Atividades extras (fill-blank / match / order) para os módulos novos ──

// A1
const a1OQueEPromptExtra: LessonActivity[] = [
  {
    id: "a1oqp-fb",
    type: "fill-blank",
    sentence:
      "Um {___} é a instrução que você envia para um modelo de linguagem (LLM) para obter uma resposta.",
    options: [
      { id: "a", text: "prompt" },
      { id: "b", text: "cookie" },
      { id: "c", text: "endpoint" },
    ],
    correct: "a",
    explanation:
      "Prompt é o termo técnico para a entrada que você fornece à IA — seja uma pergunta, um comando ou um texto para continuar.",
  },
]

const a1ContextoClareza_extra: LessonActivity[] = [
  {
    id: "a1cc-match",
    type: "match",
    instruction: "Ligue cada elemento de um prompt ao que ele define:",
    pairs: [
      { word: "Contexto", definition: "Quem você é e por que está perguntando" },
      { word: "Objetivo", definition: "O que você quer que a IA faça" },
      { word: "Público-alvo", definition: "Para quem a resposta é destinada" },
      { word: "Formato", definition: "Como a saída deve ser estruturada" },
    ],
    correctPairs: {
      Contexto: "Quem você é e por que está perguntando",
      Objetivo: "O que você quer que a IA faça",
      "Público-alvo": "Para quem a resposta é destinada",
      Formato: "Como a saída deve ser estruturada",
    },
    explanation:
      "Um prompt completo tem contexto (situação), objetivo (ação), público (receptor) e formato (estrutura). Cada elemento elimina uma possível ambiguidade.",
  },
]

const a1PersonasExtra: LessonActivity[] = [
  {
    id: "a1pr-fb",
    type: "fill-blank",
    sentence:
      "Pedir 'Aja como um {___} especializado em X' é a técnica de role prompting que calibra o nível técnico e o tom da resposta.",
    options: [
      { id: "a", text: "especialista sênior" },
      { id: "b", text: "arquivo de texto" },
      { id: "c", text: "banco de dados" },
    ],
    correct: "a",
    explanation:
      "Role prompting atribui uma persona ao modelo. 'Especialista sênior' calibra profundidade e vocabulário; definir a área de atuação torna a persona ainda mais precisa.",
  },
]

const a1EstruturasExtra: LessonActivity[] = [
  {
    id: "a1ep-fb",
    type: "fill-blank",
    sentence:
      "No framework CRAFT, a letra 'F' representa {___} — o campo que define como a saída deve ser estruturada (lista, JSON, tabela etc.).",
    options: [
      { id: "a", text: "Formato (Format)" },
      { id: "b", text: "Foco" },
      { id: "c", text: "Fluxo" },
    ],
    correct: "a",
    explanation:
      "Formato (Format) é o 'F' do CRAFT. Especificar o formato elimina a necessidade de reformatar a resposta manualmente — JSON, lista numerada, tabela, parágrafos.",
  },
]

const a1FewShotExtra: LessonActivity[] = [
  {
    id: "a1fs-order",
    type: "order",
    instruction: "Conecte cada técnica de prompting ao número de exemplos que ela usa:",
    leftItems: [
      { id: "a", text: "Zero-shot" },
      { id: "b", text: "One-shot" },
      { id: "c", text: "Few-shot" },
    ],
    rightItems: [
      { id: "x", text: "Nenhum exemplo fornecido" },
      { id: "y", text: "Um único exemplo de input/output" },
      { id: "z", text: "Dois ou mais exemplos" },
    ],
    correctPairs: { a: "x", b: "y", c: "z" },
    explanation:
      "Zero = 0 exemplos. One = 1. Few = 2+. Mais exemplos ensinam o padrão melhor, mas aumentam o tamanho do prompt.",
  },
]

const a1RefinoExtra: LessonActivity[] = [
  {
    id: "a1ri-match",
    type: "match",
    instruction: "Ligue cada etapa do ciclo de refino ao que ela representa:",
    pairs: [
      { word: "Testar", definition: "Rodar o prompt e coletar o resultado" },
      { word: "Analisar", definition: "Identificar onde a resposta falhou" },
      { word: "Melhorar", definition: "Editar o prompt com base na análise" },
      { word: "Versionar", definition: "Salvar a nova versão como v2, v3…" },
    ],
    correctPairs: {
      Testar: "Rodar o prompt e coletar o resultado",
      Analisar: "Identificar onde a resposta falhou",
      Melhorar: "Editar o prompt com base na análise",
      Versionar: "Salvar a nova versão como v2, v3…",
    },
    explanation:
      "Refino iterativo é um ciclo: testar → analisar → melhorar → versionar. Sem versionar, você perde o histórico do que funcionou.",
  },
]

// A2
const a2CotExtra: LessonActivity[] = [
  {
    id: "a2cot-fb",
    type: "fill-blank",
    sentence:
      "A frase '{___}' é a instrução mais simples para ativar o raciocínio explícito (chain-of-thought) em um prompt.",
    options: [
      { id: "a", text: "Pense passo a passo" },
      { id: "b", text: "Seja criativo" },
      { id: "c", text: "Responda rapidamente" },
    ],
    correct: "a",
    explanation:
      "'Pense passo a passo' (Think step by step) instrui o modelo a externalizar o raciocínio antes da resposta final, reduzindo erros em tarefas de lógica.",
  },
]

const a2DecomposicaoExtra: LessonActivity[] = [
  {
    id: "a2dec-order",
    type: "order",
    instruction:
      "Conecte cada etapa de decomposição ao seu papel no pipeline de criação de um artigo:",
    leftItems: [
      { id: "a", text: "Etapa 1 — Estrutura" },
      { id: "b", text: "Etapa 2 — Rascunho" },
      { id: "c", text: "Etapa 3 — Revisão" },
      { id: "d", text: "Etapa 4 — Publicação" },
    ],
    rightItems: [
      { id: "w", text: "Gerar outline com tópicos e subtópicos" },
      { id: "x", text: "Desenvolver o conteúdo de cada seção" },
      { id: "y", text: "Corrigir tom, erros e coerência" },
      { id: "z", text: "Formatar e distribuir no canal certo" },
    ],
    correctPairs: { a: "w", b: "x", c: "y", d: "z" },
    explanation:
      "Outline → conteúdo → revisão → publicação é o pipeline clássico. Cada etapa pode ser um prompt separado, com revisão humana entre elas.",
  },
]

const a2RestricaoExtra: LessonActivity[] = [
  {
    id: "a2res-fb",
    type: "fill-blank",
    sentence:
      "Uma restrição negativa ('não faça X') funciona melhor combinada com uma instrução {___} equivalente ('faça Y em vez disso').",
    options: [
      { id: "a", text: "positiva" },
      { id: "b", text: "inversa" },
      { id: "c", text: "longa" },
    ],
    correct: "a",
    explanation:
      "Restrições negativas dizem o que evitar; instruções positivas dizem o que fazer. Juntas, eliminam ambiguidade e dão ao modelo um caminho claro.",
  },
]

const a2EstiloTomExtra: LessonActivity[] = [
  {
    id: "a2et-match",
    type: "match",
    instruction: "Ligue cada tom ao contexto mais adequado:",
    pairs: [
      { word: "Formal", definition: "Relatório executivo ou comunicação corporativa" },
      { word: "Conversacional", definition: "Tutorial ou blog para iniciantes" },
      { word: "Técnico", definition: "Documentação de API ou white paper" },
      { word: "Empático", definition: "Mensagem de suporte ao cliente em crise" },
    ],
    correctPairs: {
      Formal: "Relatório executivo ou comunicação corporativa",
      Conversacional: "Tutorial ou blog para iniciantes",
      Técnico: "Documentação de API ou white paper",
      Empático: "Mensagem de suporte ao cliente em crise",
    },
    explanation:
      "Tom errado no contexto certo quebra a comunicação. Um e-mail de suporte com tom técnico frio pode frustrar um cliente — mesmo com a resposta correta.",
  },
]

const a2MultiEtapaExtra: LessonActivity[] = [
  {
    id: "a2me-order",
    type: "order",
    instruction: "Ordene as etapas de um pipeline multi-etapa para gerar um relatório de mercado:",
    leftItems: [
      { id: "a", text: "Passo 1" },
      { id: "b", text: "Passo 2" },
      { id: "c", text: "Passo 3" },
      { id: "d", text: "Passo 4" },
    ],
    rightItems: [
      { id: "w", text: "Definir escopo e perguntas-chave" },
      { id: "x", text: "Coletar e resumir dados por seção" },
      { id: "y", text: "Gerar análise e conclusões" },
      { id: "z", text: "Formatar e revisar o documento final" },
    ],
    correctPairs: { a: "w", b: "x", c: "y", d: "z" },
    explanation:
      "Escopo → coleta → análise → formato é o pipeline típico. Validar cada etapa antes de avançar garante que o resultado final tenha qualidade.",
  },
]

const a2AvaliacaoExtra: LessonActivity[] = [
  {
    id: "a2ar-fb",
    type: "fill-blank",
    sentence:
      "Quando um modelo de linguagem gera informações falsas com alto grau de confiança, chamamos esse fenômeno de {___}.",
    options: [
      { id: "a", text: "alucinação (hallucination)" },
      { id: "b", text: "sobrecarga (overload)" },
      { id: "c", text: "truncagem (truncation)" },
    ],
    correct: "a",
    explanation:
      "Alucinação (hallucination) é o principal risco dos LLMs: o modelo inventa fatos com confiança. Identificar exige verificar fontes primárias, especialmente datas, nomes e estatísticas.",
  },
]

const a2RefinoDadosExtra: LessonActivity[] = [
  {
    id: "a2rd-match",
    type: "match",
    instruction: "Ligue cada conceito de melhoria de prompt ao seu significado:",
    pairs: [
      { word: "Teste A/B", definition: "Comparar duas versões do prompt com métricas objetivas" },
      { word: "Regressão", definition: "Garantir que melhorias não quebraram casos anteriores" },
      { word: "Log de erros", definition: "Registro de inputs que geraram respostas incorretas" },
      { word: "Golden set", definition: "Conjunto de casos com respostas ideais para benchmark" },
    ],
    correctPairs: {
      "Teste A/B": "Comparar duas versões do prompt com métricas objetivas",
      Regressão: "Garantir que melhorias não quebraram casos anteriores",
      "Log de erros": "Registro de inputs que geraram respostas incorretas",
      "Golden set": "Conjunto de casos com respostas ideais para benchmark",
    },
    explanation:
      "Engenharia de prompt profissional usa as mesmas práticas de engenharia de software: testes, regressão e benchmarks para melhorar com dados.",
  },
]

// A3
const a3CodigoExtra: LessonActivity[] = [
  {
    id: "a3pc-fb",
    type: "fill-blank",
    sentence:
      "Ao pedir código, especificar a linguagem, a {___} das bibliotecas usadas e exemplos de entrada/saída elimina a maioria das ambiguidades.",
    options: [
      { id: "a", text: "versão" },
      { id: "b", text: "cor" },
      { id: "c", text: "localização geográfica" },
    ],
    correct: "a",
    explanation:
      "Linguagem + versão + bibliotecas + I/O de exemplo é o combo mínimo para código reutilizável. Sem versão, o modelo pode gerar código incompatível com seu ambiente.",
  },
]

const a3AutomacaoExtra: LessonActivity[] = [
  {
    id: "a3ai-match",
    type: "match",
    instruction: "Ligue cada ferramenta de automação ao seu perfil de uso:",
    pairs: [
      { word: "n8n", definition: "Fluxos visuais, código aberto, auto-hospedável" },
      { word: "Zapier", definition: "Automações simples entre SaaS sem código" },
      { word: "Make", definition: "Automações visuais de complexidade média" },
      { word: "Python + API", definition: "Controle total com código customizado" },
    ],
    correctPairs: {
      n8n: "Fluxos visuais, código aberto, auto-hospedável",
      Zapier: "Automações simples entre SaaS sem código",
      Make: "Automações visuais de complexidade média",
      "Python + API": "Controle total com código customizado",
    },
    explanation:
      "Escolha a ferramenta pelo nível de controle necessário: Zapier para o simples, n8n para mais poder, Python quando precisar de lógica avançada ou privacidade total.",
  },
]

const a3NegociosExtra: LessonActivity[] = [
  {
    id: "a3pn-order",
    type: "order",
    instruction: "Ordene o processo de usar IA para gerar uma proposta comercial:",
    leftItems: [
      { id: "a", text: "Passo 1" },
      { id: "b", text: "Passo 2" },
      { id: "c", text: "Passo 3" },
      { id: "d", text: "Passo 4" },
    ],
    rightItems: [
      { id: "w", text: "Definir o template e variáveis da proposta" },
      { id: "x", text: "Preencher contexto (cliente, produto, objetivo)" },
      { id: "y", text: "Gerar rascunho com IA" },
      { id: "z", text: "Revisar e personalizar antes de enviar" },
    ],
    correctPairs: { a: "w", b: "x", c: "y", d: "z" },
    explanation:
      "Template → contexto → geração → revisão humana. A revisão final é obrigatória: a IA pode acertar o tom mas errar um dado específico do cliente.",
  },
]

const a3FluxosExtra: LessonActivity[] = [
  {
    id: "a3fa-fb",
    type: "fill-blank",
    sentence:
      "O componente que coordena múltiplos agentes, define a ordem de execução e as condições de parada é chamado de {___}.",
    options: [
      { id: "a", text: "orquestrador (orchestrator)" },
      { id: "b", text: "compilador" },
      { id: "c", text: "proxy reverso" },
    ],
    correct: "a",
    explanation:
      "Orquestrador é o 'gerente' do fluxo multi-agente. Sem ele, os agentes não sabem quando agir, em que ordem, ou quando o objetivo foi atingido.",
  },
]

const a3MetricasExtra: LessonActivity[] = [
  {
    id: "a3am-match",
    type: "match",
    instruction: "Ligue cada métrica ao que ela mede em sistemas de IA em produção:",
    pairs: [
      { word: "Taxa de alucinação", definition: "Frequência com que o modelo inventa informações" },
      { word: "CSAT", definition: "Satisfação do usuário com a resposta recebida" },
      {
        word: "Latência P95",
        definition: "Tempo de resposta no percentil 95 (pior caso frequente)",
      },
      { word: "Taxa de escalação", definition: "Casos enviados para atendimento humano" },
    ],
    correctPairs: {
      "Taxa de alucinação": "Frequência com que o modelo inventa informações",
      CSAT: "Satisfação do usuário com a resposta recebida",
      "Latência P95": "Tempo de resposta no percentil 95 (pior caso frequente)",
      "Taxa de escalação": "Casos enviados para atendimento humano",
    },
    explanation:
      "Métricas de IA têm duas camadas: técnicas (latência, tokens) e de negócio (CSAT, escalação). As de negócio dizem se a IA está realmente resolvendo o problema.",
  },
]

const a3GuardrailsExtra: LessonActivity[] = [
  {
    id: "a3gr-fb",
    type: "fill-blank",
    sentence:
      "A estratégia de usar múltiplas camadas de proteção — prompt + validação no código + filtros — é chamada de {___} em profundidade.",
    options: [
      { id: "a", text: "defesa" },
      { id: "b", text: "ataque" },
      { id: "c", text: "automação" },
    ],
    correct: "a",
    explanation:
      "Defesa em profundidade (defense in depth) é o princípio de não depender de uma única proteção. Camadas independentes garantem que a falha de uma não comprometa o sistema.",
  },
]

const a3ProjetoFinalExtra: LessonActivity[] = [
  {
    id: "a3pf-order",
    type: "order",
    instruction: "Ordene as etapas do ciclo de desenvolvimento de um produto com IA:",
    leftItems: [
      { id: "a", text: "Etapa 1" },
      { id: "b", text: "Etapa 2" },
      { id: "c", text: "Etapa 3" },
      { id: "d", text: "Etapa 4" },
    ],
    rightItems: [
      { id: "w", text: "Definir o problema e critérios de sucesso" },
      { id: "x", text: "Prototipar com prompt simples (MVP)" },
      { id: "y", text: "Testar com usuários reais e coletar feedback" },
      { id: "z", text: "Medir métricas e iterar na próxima versão" },
    ],
    correctPairs: { a: "w", b: "x", c: "y", d: "z" },
    explanation:
      "Definir → prototipar → testar → medir é o ciclo de produto aplicado à IA. Sem métricas claras na etapa 1, você não saberá se a IA está realmente resolvendo o problema.",
  },
]

// Conteúdo por trilha → módulo (índice). Falta → DEFAULT_QUESTIONS.
// Agora suporta LessonActivity[] (múltiplos tipos) em vez de apenas Question[]
// ── A4 — Técnica SAFE para Geração de Imagens com IA ──────────────────────

const a4Intro: Question[] = [
  {
    id: "a4-intro-1",
    prompt: "O que significa a sigla SAFE na técnica de prompts visuais?",
    options: [
      { id: "a", text: "Style, Angle, Focus, Edit" },
      {
        id: "b",
        text: "Subject, Attributes, Framing, Environment (Sujeito, Atributos, Enquadramento, Ambiente)",
      },
      { id: "c", text: "Speed, Accuracy, Format, Export" },
    ],
    correct: "b",
    explanation:
      "SAFE organiza o prompt em quatro partes: Sujeito (quem aparece), Atributos (como aparece), Enquadramento (como a imagem é composta) e Ambiente (onde e sob qual luz).",
  },
  {
    id: "a4-intro-2",
    prompt:
      'Por que o prompt "Gere uma imagem bonita de um homem em uma cafeteria" é considerado fraco?',
    options: [
      { id: "a", text: "Porque é curto demais para qualquer IA processar." },
      {
        id: "b",
        text: "Porque não define sujeito com detalhes, atributos, enquadramento nem ambiente com clareza.",
      },
      { id: "c", text: "Porque menciona um cenário muito específico." },
    ],
    correct: "b",
    explanation:
      "O prompt não informa idade, roupa, estilo, ângulo de câmera nem iluminação — a IA precisa 'adivinhar' quase tudo, gerando um resultado genérico.",
  },
  {
    id: "a4-intro-3",
    prompt:
      "Qual é a fórmula principal da técnica SAFE, incluindo o componente que evita erros técnicos?",
    options: [
      { id: "a", text: "Ideia + Referência + Estilo" },
      { id: "b", text: "Sujeito + Atributos + Enquadramento + Ambiente + Restrições" },
      { id: "c", text: "Título + Legenda + Hashtags" },
    ],
    correct: "b",
    explanation:
      "A fórmula completa é Sujeito + Atributos + Enquadramento + Ambiente + Restrições — as restrições fecham o prompt evitando erros comuns como mãos deformadas ou texto indesejado.",
    hint: "Pense nas quatro letras de SAFE mais o último campo do template da aula.",
  },
]

const a4IntroFill: LessonActivity[] = [
  {
    id: "a4-intro-fill-1",
    type: "fill-blank",
    sentence:
      "A técnica SAFE ajuda a estruturar prompts completos, evitando comandos {___} como 'gere uma imagem bonita'.",
    options: [
      { id: "a", text: "vagos" },
      { id: "b", text: "longos" },
      { id: "c", text: "técnicos" },
    ],
    correct: "a",
    explanation:
      "Comandos vagos não especificam sujeito, atributos, enquadramento ou ambiente — a técnica SAFE existe justamente para eliminar essa vagueza.",
  },
]

const a4Sujeito: Question[] = [
  {
    id: "a4-sujeito-1",
    prompt: "O que o 'S' (Sujeito) da técnica SAFE define?",
    options: [
      { id: "a", text: "A iluminação e o clima da cena." },
      { id: "b", text: "O elemento principal da imagem — quem ou o que aparece." },
      { id: "c", text: "O formato de arquivo exportado pela IA." },
    ],
    correct: "b",
    explanation:
      "O Sujeito é o elemento central: uma pessoa, animal, produto, personagem, objeto ou cenário — a resposta para 'quem ou o que aparece'.",
  },
  {
    id: "a4-sujeito-2",
    prompt: "Qual das perguntas abaixo NÃO ajuda a definir o Sujeito?",
    options: [
      { id: "a", text: "Quem aparece?" },
      { id: "b", text: "Qual tipo de lente será usada?" },
      { id: "c", text: "Qual postura ou ação o sujeito tem?" },
    ],
    correct: "b",
    explanation:
      "O tipo de lente pertence ao Enquadramento (F), não ao Sujeito. Sujeito trata de quem/o quê, idade, aparência geral e postura.",
    hint: "Lente e ângulo de câmera pertencem a outra letra do SAFE.",
  },
  {
    id: "a4-sujeito-3",
    prompt: "Qual opção descreve melhor um Sujeito bem definido?",
    options: [
      { id: "a", text: '"Uma pessoa."' },
      {
        id: "b",
        text: '"Homem jovem brasileiro, desenvolvedor de software, sentado diante de um setup moderno."',
      },
      { id: "c", text: '"Luz dourada de início de dia."' },
    ],
    correct: "b",
    explanation:
      "A opção B especifica quem é (homem jovem brasileiro), sua atividade (desenvolvedor) e ação (sentado diante de um setup) — exatamente o que o Sujeito deve conter.",
  },
]

const a4SujeitoFill: LessonActivity[] = [
  {
    id: "a4-sujeito-fill-1",
    type: "fill-blank",
    sentence: "O Sujeito responde à pergunta: quem ou o que {___} na imagem.",
    options: [
      { id: "a", text: "aparece" },
      { id: "b", text: "ilumina" },
      { id: "c", text: "emoldura" },
    ],
    correct: "a",
    explanation:
      "Sujeito = quem ou o que aparece na imagem — é sempre o ponto de partida do prompt SAFE.",
  },
]

const a4Atributos: Question[] = [
  {
    id: "a4-atributos-1",
    prompt: "O que os Atributos (A) de SAFE descrevem?",
    options: [
      { id: "a", text: "O local onde a cena acontece." },
      {
        id: "b",
        text: "Os detalhes visuais do sujeito: roupa, expressão, estilo, cores e nível de realismo.",
      },
      { id: "c", text: "O ângulo e a lente da câmera." },
    ],
    correct: "b",
    explanation:
      "Atributos cobrem tudo o que descreve como o sujeito aparece: roupa, expressão, estilo visual, cores principais e nível de realismo.",
  },
  {
    id: "a4-atributos-2",
    prompt:
      "Em 'Usando camiseta preta minimalista, barba bem aparada, expressão concentrada, estilo fotográfico ultra-realista', qual elemento do SAFE está sendo descrito?",
    options: [
      { id: "a", text: "Ambiente" },
      { id: "b", text: "Atributos" },
      { id: "c", text: "Enquadramento" },
    ],
    correct: "b",
    explanation:
      "Roupa, barba, expressão e estilo são características visuais do sujeito — ou seja, Atributos.",
  },
  {
    id: "a4-atributos-3",
    prompt: "Qual pergunta pertence à etapa de Atributos?",
    options: [
      { id: "a", text: "Qual é a idade aproximada do sujeito?" },
      { id: "b", text: "A imagem será vertical ou horizontal?" },
      {
        id: "c",
        text: "Existe algum detalhe importante que deve ser preservado, como uma cicatriz ou tatuagem?",
      },
    ],
    correct: "c",
    explanation:
      "Detalhes a preservar fazem parte dos Atributos. Idade aproximada é do Sujeito (S); formato da imagem é do Enquadramento (F).",
    hint: "Cuidado: uma das opções pertence ao Sujeito, não aos Atributos.",
  },
]

const a4AtributosMatch: LessonActivity[] = [
  {
    id: "a4-atributos-match-1",
    type: "match",
    instruction:
      "Ligue cada palavra-chave de estilo visual ao tipo de imagem que ela melhor descreve:",
    pairs: [
      { word: "Ultra-realista", definition: "Foto profissional indistinguível de uma câmera real" },
      { word: "3D cartoon", definition: "Personagem estilizado tipo mascote de aplicativo" },
      { word: "Editorial", definition: "Estética de revista de moda/lifestyle" },
      { word: "Isométrico", definition: "Ilustração técnica em ângulo de 30° sem perspectiva" },
    ],
    correctPairs: {
      "Ultra-realista": "Foto profissional indistinguível de uma câmera real",
      "3D cartoon": "Personagem estilizado tipo mascote de aplicativo",
      Editorial: "Estética de revista de moda/lifestyle",
      Isométrico: "Ilustração técnica em ângulo de 30° sem perspectiva",
    },
    explanation:
      "Cada estilo visual direciona a IA para uma linguagem estética diferente — escolher a palavra certa nos Atributos evita resultados genéricos.",
  },
]

const a4Enquadramento: Question[] = [
  {
    id: "a4-enquadramento-1",
    prompt: "O que o Enquadramento (F) da técnica SAFE define?",
    options: [
      { id: "a", text: "A expressão facial do sujeito." },
      { id: "b", text: "Como a imagem é composta: formato, plano, ângulo, lente e composição." },
      { id: "c", text: "A paleta de cores do cenário." },
    ],
    correct: "b",
    explanation:
      "Formato, plano, ângulo de câmera e lente descrevem como a imagem é composta — isso é Enquadramento.",
  },
  {
    id: "a4-enquadramento-2",
    prompt:
      'Em "Formato vertical 4:5, plano médio, câmera na altura dos olhos, lente 50 mm", a que elemento do SAFE isso pertence?',
    options: [
      { id: "a", text: "Sujeito" },
      { id: "b", text: "Ambiente" },
      { id: "c", text: "Enquadramento" },
    ],
    correct: "c",
    explanation:
      "Formato, plano, ângulo de câmera e lente descrevem como a imagem é composta — isso é Enquadramento.",
  },
  {
    id: "a4-enquadramento-3",
    prompt: "Qual é a diferença entre 'plano médio' e 'corpo inteiro' no Enquadramento?",
    options: [
      { id: "a", text: "Não há diferença, são sinônimos." },
      {
        id: "b",
        text: "'Plano médio' mostra o sujeito da cintura para cima; 'corpo inteiro' mostra o sujeito completo, da cabeça aos pés.",
      },
      { id: "c", text: "'Plano médio' é usado só para produtos, nunca para pessoas." },
    ],
    correct: "b",
    explanation:
      "Plano médio enquadra da cintura para cima; corpo inteiro mostra o sujeito por completo — a escolha muda o quanto do cenário aparece ao redor.",
  },
]

const a4EnquadramentoOrder: LessonActivity[] = [
  {
    id: "a4-enquadramento-order-1",
    type: "order",
    instruction: "Conecte cada termo de enquadramento à sua definição:",
    leftItems: [
      { id: "a", text: "Plano fechado" },
      { id: "b", text: "Composição centralizada" },
      { id: "c", text: "Lente 50 mm" },
      { id: "d", text: "Fundo desfocado" },
    ],
    rightItems: [
      { id: "w", text: "Enquadra apenas rosto ou detalhe próximo" },
      { id: "x", text: "Sujeito posicionado no centro do quadro" },
      { id: "y", text: "Lente padrão que aproxima o resultado da visão humana" },
      { id: "z", text: "Profundidade de campo rasa isolando o sujeito do cenário" },
    ],
    correctPairs: { a: "w", b: "x", c: "y", d: "z" },
    explanation:
      "Cada termo de enquadramento controla um aspecto diferente da composição — dominar esse vocabulário dá controle fino sobre o resultado.",
  },
]

const a4Ambiente: Question[] = [
  {
    id: "a4-ambiente-1",
    prompt: "O que o Ambiente (E) da técnica SAFE define?",
    options: [
      { id: "a", text: "A postura do sujeito." },
      { id: "b", text: "O local, a iluminação, o clima e a atmosfera da cena." },
      { id: "c", text: "O tipo de lente da câmera." },
    ],
    correct: "b",
    explanation:
      "Local, horário, iluminação e atmosfera emocional pertencem ao Ambiente — a última letra do SAFE antes das Restrições.",
  },
  {
    id: "a4-ambiente-2",
    prompt:
      "'Escritório moderno durante a noite, iluminação ambiente azul e roxa, atmosfera tecnológica' descreve qual elemento do SAFE?",
    options: [
      { id: "a", text: "Ambiente" },
      { id: "b", text: "Atributos" },
      { id: "c", text: "Enquadramento" },
    ],
    correct: "a",
    explanation:
      "Local, horário, iluminação e atmosfera emocional pertencem ao Ambiente — a última letra do SAFE antes das Restrições.",
  },
  {
    id: "a4-ambiente-3",
    prompt: "Qual das opções é um exemplo de 'iluminação' que pode ser usada no campo Ambiente?",
    options: [
      { id: "a", text: "Lente 35 mm" },
      { id: "b", text: "Luz dourada de início de dia" },
      { id: "c", text: "Plano médio aberto" },
    ],
    correct: "b",
    explanation:
      "'Luz dourada de início de dia' descreve iluminação — elemento do Ambiente. Lente e plano pertencem ao Enquadramento.",
    hint: "Duas das opções são termos de Enquadramento, não de Ambiente.",
  },
]

const a4AmbienteMatch: LessonActivity[] = [
  {
    id: "a4-ambiente-match-1",
    type: "match",
    instruction: "Ligue cada tipo de iluminação ao clima que ela transmite:",
    pairs: [
      {
        word: "Luz dourada de início de dia",
        definition: "Atmosfera quente, sofisticada e acolhedora",
      },
      { word: "Neon discreto", definition: "Atmosfera urbana, tecnológica e noturna" },
      {
        word: "Luz suave de estúdio",
        definition: "Atmosfera limpa e profissional, sem sombras duras",
      },
      {
        word: "Iluminação volumétrica",
        definition: "Atmosfera cinematográfica com feixes de luz visíveis",
      },
    ],
    correctPairs: {
      "Luz dourada de início de dia": "Atmosfera quente, sofisticada e acolhedora",
      "Neon discreto": "Atmosfera urbana, tecnológica e noturna",
      "Luz suave de estúdio": "Atmosfera limpa e profissional, sem sombras duras",
      "Iluminação volumétrica": "Atmosfera cinematográfica com feixes de luz visíveis",
    },
    explanation:
      "A escolha da iluminação no campo Ambiente é o que mais influencia a sensação emocional da imagem gerada.",
  },
]

const a4Restricoes: Question[] = [
  {
    id: "a4-restricoes-1",
    prompt: "Qual é a função das Restrições negativas no prompt SAFE?",
    options: [
      { id: "a", text: "Substituir a necessidade de descrever o Sujeito." },
      {
        id: "b",
        text: "Informar explicitamente o que NÃO deve aparecer na imagem, evitando erros comuns da IA.",
      },
      { id: "c", text: "Definir o formato de arquivo de saída." },
    ],
    correct: "b",
    explanation:
      "Restrições como 'sem texto', 'sem logotipos' e 'mãos anatômicas corretas' funcionam como uma rede de segurança contra artefatos comuns de geração de imagem.",
  },
  {
    id: "a4-restricoes-2",
    prompt:
      "Por que 'mãos anatômicas corretas' costuma aparecer como restrição em prompts de pessoas?",
    options: [
      {
        id: "a",
        text: "Porque IAs de imagem historicamente erram na geração de mãos, gerando dedos deformados.",
      },
      { id: "b", text: "Porque é uma exigência legal em todos os países." },
      { id: "c", text: "Porque aumenta o tempo de geração da imagem." },
    ],
    correct: "a",
    explanation:
      "Mãos são um ponto fraco conhecido de muitos modelos de geração de imagem — pedir explicitamente anatomia correta reduz esse tipo de erro.",
  },
  {
    id: "a4-restricoes-3",
    prompt:
      "Restrições negativas substituem a necessidade de um bom Sujeito, Atributos, Enquadramento e Ambiente?",
    options: [
      { id: "a", text: "Sim, restrições bem escritas bastam sozinhas." },
      {
        id: "b",
        text: "Não — elas apenas complementam as quatro primeiras letras, evitando falhas técnicas, mas não definem o conteúdo da imagem.",
      },
      { id: "c", text: "Sim, desde que sejam longas o suficiente." },
    ],
    correct: "b",
    explanation:
      "Restrições fecham o prompt prevenindo erros técnicos, mas sem um Sujeito, Atributos, Enquadramento e Ambiente bem definidos, a imagem ainda sai genérica.",
  },
]

const a4RestricoesOrder: LessonActivity[] = [
  {
    id: "a4-restricoes-order-1",
    type: "order",
    instruction: "Conecte cada restrição negativa ao problema que ela evita:",
    leftItems: [
      { id: "a", text: "Sem texto / sem logotipos" },
      { id: "b", text: "Mãos anatômicas corretas" },
      { id: "c", text: "Sem pele artificial" },
      { id: "d", text: "Sem distorções" },
    ],
    rightItems: [
      { id: "w", text: "Palavras ilegíveis ou marcas inventadas aparecendo na imagem" },
      { id: "x", text: "Dedos extras ou deformados" },
      { id: "y", text: "Aparência de boneco/plástico no rosto" },
      { id: "z", text: "Elementos fisicamente impossíveis ou tortos na composição" },
    ],
    correctPairs: { a: "w", b: "x", c: "y", d: "z" },
    explanation:
      "Cada restrição ataca um erro específico e recorrente dos modelos de geração de imagem.",
  },
]

// Essays de revisão — cada item revisa o módulo anterior da trilha A4
const essayA4: EssayActivity[] = [
  // [1] revisa "Introdução à Técnica SAFE" (módulo 0)
  {
    id: "essay-a4-1",
    type: "essay",
    prompt:
      "Com base na introdução à técnica SAFE: por que um prompt como 'gere uma imagem bonita de um app' é considerado fraco, e o que a sigla SAFE resolve nesse problema?",
    placeholder: "Explique o problema do prompt vago e como SAFE organiza a solução...",
    referenceAnswer:
      "O prompt não define sujeito, atributos, enquadramento nem ambiente, forçando a IA a adivinhar. SAFE resolve isso organizando o prompt em Sujeito (quem/o quê), Atributos (como aparece), Enquadramento (como é composto) e Ambiente (onde e sob qual luz), além de Restrições para evitar erros técnicos — o resultado é um prompt completo e replicável.",
  },
  // [2] revisa "S — Sujeito" (módulo 1)
  {
    id: "essay-a4-2",
    type: "essay",
    prompt:
      "O que deve estar presente na definição do Sujeito de um prompt SAFE? Escreva um exemplo de Sujeito bem descrito para uma cena à sua escolha.",
    placeholder: "Descreva quem/o que aparece, com idade, aparência e ação...",
    referenceAnswer:
      "O Sujeito deve responder quem ou o que aparece, com idade aproximada, aparência geral e postura/ação. Ex.: 'Mulher jovem brasileira, designer gráfica, sentada em frente a uma mesa de desenho digital, olhando atentamente para a tela.'",
  },
  // [3] revisa "A — Atributos" (módulo 2)
  {
    id: "essay-a4-3",
    type: "essay",
    prompt:
      "Explique a diferença entre Sujeito e Atributos na técnica SAFE. Dê um exemplo de Atributos aplicados ao Sujeito do exercício anterior.",
    placeholder: "Diferencie os dois campos e complete com atributos...",
    referenceAnswer:
      "O Sujeito define quem/o que aparece; os Atributos definem como esse sujeito aparece — roupa, expressão, estilo, cores e nível de realismo. Ex.: 'Usando blazer bege, expressão focada, estilo editorial premium, pele natural, cores neutras.'",
  },
  // [4] revisa "F — Enquadramento" (módulo 3)
  {
    id: "essay-a4-4",
    type: "essay",
    prompt:
      "Escreva um Enquadramento completo (formato, plano, ângulo e lente) para a cena que você vem construindo nos exercícios anteriores.",
    placeholder: "Defina formato da imagem, plano, ângulo de câmera e lente...",
    referenceAnswer:
      "Exemplo: 'Formato vertical 4:5, plano médio, câmera na altura dos olhos, composição centralizada, lente 50 mm, fundo levemente desfocado.' O Enquadramento controla como a cena é composta visualmente, independente do que está nela.",
  },
  // [5] revisa "E — Ambiente" (módulo 4)
  {
    id: "essay-a4-5",
    type: "essay",
    prompt:
      "Descreva o Ambiente ideal para a cena que você vem construindo: local, iluminação e atmosfera. Por que a escolha de iluminação muda tanto o resultado?",
    placeholder: "Descreva local, horário, luz e clima emocional...",
    referenceAnswer:
      "Exemplo: 'Estúdio de design moderno durante a tarde, luz natural suave entrando pela janela, atmosfera criativa e organizada.' A iluminação muda o resultado porque define o tom emocional da imagem — a mesma cena parece completamente diferente sob luz dourada, neon ou luz fria de estúdio.",
  },
  // [6] revisa "Restrições negativas" (módulo 5)
  {
    id: "essay-a4-6",
    type: "essay",
    prompt:
      "Liste ao menos 4 restrições negativas úteis para o tipo de imagem que você vem descrevendo nos exercícios e explique o que cada uma evita.",
    placeholder: "Liste restrições e o problema técnico que cada uma previne...",
    referenceAnswer:
      "Exemplo: 'Sem texto' evita palavras ilegíveis inventadas; 'sem logotipos' evita marcas fictícias; 'mãos anatômicas corretas' evita dedos deformados; 'sem distorções' evita elementos fisicamente impossíveis. Restrições não substituem um bom Sujeito/Atributos/Enquadramento/Ambiente, mas evitam falhas técnicas comuns da IA.",
  },
]

// Prova final — dissertativa aplicando as 5 regras (S, A, F, E, Restrições) de uma vez
const a4ProvaFinal: EssayActivity[] = [
  {
    id: "a4-prova-1",
    type: "essay",
    prompt:
      "PROVA — Parte 1 (Foto profissional): escolha um tema de pessoa trabalhando ou estudando. Escreva separadamente 1) Sujeito, 2) Atributos, 3) Enquadramento, 4) Ambiente, 5) Restrições — depois una tudo em um único parágrafo de prompt final.",
    placeholder:
      "1) Sujeito: ... 2) Atributos: ... 3) Enquadramento: ... 4) Ambiente: ... 5) Restrições: ... Prompt final: ...",
    referenceAnswer:
      "Exemplo — Sujeito: 'Jovem estudante brasileira de medicina, sentada em uma biblioteca.' Atributos: 'Usando blusa azul-clara, óculos de leitura, expressão concentrada, estilo fotográfico realista.' Enquadramento: 'Formato vertical 4:5, plano médio, câmera na altura dos olhos, composição centralizada, lente 50 mm.' Ambiente: 'Biblioteca universitária à tarde, luz natural suave pela janela, estantes desfocadas ao fundo, atmosfera estudiosa e tranquila.' Restrições: 'Sem texto, sem logotipos, sem distorções, mãos anatômicas corretas, alta definição.' Prompt final: 'Jovem estudante brasileira de medicina, sentada em uma biblioteca universitária, lendo com expressão concentrada. Usando blusa azul-clara e óculos de leitura, estilo fotográfico realista, pele natural. Formato vertical 4:5, plano médio, câmera na altura dos olhos, composição centralizada, lente 50 mm, fundo desfocado. Ambiente com luz natural suave da tarde, estantes ao fundo, atmosfera estudiosa e tranquila. Sem texto, sem logotipos, sem distorções, mãos anatômicas corretas, alta definição.'",
  },
  {
    id: "a4-prova-2",
    type: "essay",
    prompt:
      "PROVA — Parte 2 (Divulgação de produto digital): escolha um app, SaaS, curso ou ferramenta. Escreva separadamente Sujeito, Atributos, Enquadramento, Ambiente e Restrições, e depois o prompt final unificado.",
    placeholder:
      "1) Sujeito: ... 2) Atributos: ... 3) Enquadramento: ... 4) Ambiente: ... 5) Restrições: ... Prompt final: ...",
    referenceAnswer:
      "Exemplo — Sujeito: 'Mockup de aplicativo de finanças pessoais exibido em uma tela de celular centralizada.' Atributos: 'Interface moderna e limpa, gráficos de gastos coloridos, tipografia elegante, paleta verde e branco.' Enquadramento: 'Formato vertical 9:16, celular centralizado na composição.' Ambiente: 'Fundo escuro premium com linhas abstratas suaves, iluminação sofisticada, atmosfera de produto digital moderno.' Restrições: 'Sem textos ilegíveis, sem marcas externas, sem distorções, alta definição.' O prompt final reúne os cinco campos em um único parágrafo coeso, como no Exemplo 2 da aula.",
  },
  {
    id: "a4-prova-3",
    type: "essay",
    prompt:
      "PROVA — Parte 3 (Asset para interface): escolha um mascote, ícone ou ilustração sem fundo. Escreva separadamente Sujeito, Atributos, Enquadramento, Ambiente e Restrições, e depois o prompt final unificado.",
    placeholder:
      "1) Sujeito: ... 2) Atributos: ... 3) Enquadramento: ... 4) Ambiente: ... 5) Restrições: ... Prompt final: ...",
    referenceAnswer:
      "Exemplo — Sujeito: 'Mascote robô estilizado para aplicativo de produtividade.' Atributos: 'Aparência amigável e moderna, cores azul e branco, olhos grandes, pose confiante, estilo 3D cartoon premium.' Enquadramento: 'Composição centralizada, corpo inteiro.' Ambiente: 'Iluminação suave de estúdio, fundo transparente.' Restrições: 'Sem texto adicional, sem fundo, sem distorções, alta definição.' O prompt final combina os cinco campos em um único parágrafo coeso, seguindo o modelo do Exemplo 3 da aula.",
  },
  {
    id: "a4-prova-4",
    type: "essay",
    prompt:
      "Releia os prompts finais que você escreveu nas partes 1, 2 e 3. Avalie-os usando os critérios da aula: clareza do sujeito, riqueza dos atributos, precisão do enquadramento, qualidade do ambiente, coerência visual e uso correto de restrições negativas. O que você melhoraria em cada um?",
    placeholder: "Para cada prompt, aponte um ponto forte e um ponto a melhorar...",
    referenceAnswer:
      "Uma boa autoavaliação identifica, para cada prompt: se o Sujeito está livre de ambiguidade, se os Atributos evitam contradições (ex.: não pedir 'realista' e 'cartoon' ao mesmo tempo), se o Enquadramento é compatível com o Ambiente descrito, e se as Restrições cobrem os riscos mais prováveis daquele tipo de imagem (mãos, texto, logotipos). Não existe resposta única certa — o objetivo é praticar a autocrítica usando os critérios da aula.",
  },
]

export const LESSONS: Record<TrackId, LessonActivity[][]> = {
  a1: [
    a1Boas_vindas, // 0
    [essayA1[0], ...a1OQueEPrompt, ...a1OQueEPromptExtra], // 1 ← essay revisa módulo 0
    [essayA1[1], ...a1ContextoClareza, ...a1ContextoClareza_extra], // 2 ← essay revisa módulo 1
    [essayA1[2], ...a1PersonasRoles, ...a1PersonasExtra], // 3 ← essay revisa módulo 2
    [essayA1[3], ...a1EstruturasPrompt, ...a1EstruturasExtra], // 4 ← essay revisa módulo 3
    [essayA1[4], ...a1FewShot, ...a1FewShotExtra], // 5 ← essay revisa módulo 4
    [essayA1[5], ...a1RefinoIterativo, ...a1RefinoExtra], // 6 ← essay revisa módulo 5
  ],
  a2: [
    [...a2ChainOfThought, ...a2CotExtra], // 0
    [essayA2[0], ...a2Decomposicao, ...a2DecomposicaoExtra], // 1 ← essay revisa módulo 0
    [essayA2[1], ...a2Restricoes, ...a2RestricaoExtra], // 2 ← essay revisa módulo 1
    [essayA2[2], ...a2EstiloTom, ...a2EstiloTomExtra], // 3 ← essay revisa módulo 2
    [essayA2[3], ...a2MultiEtapa, ...a2MultiEtapaExtra], // 4 ← essay revisa módulo 3
    [essayA2[4], ...a2AvaliacaoRespostas, ...a2AvaliacaoExtra], // 5 ← essay revisa módulo 4
    [essayA2[5], ...a2RefinoDados, ...a2RefinoDadosExtra], // 6 ← essay revisa módulo 5
    [essayA2[6], ...engenhariaDePrompt], // 7 ← essay revisa módulo 6
    [essayA2[7], ...conhecaLLMs], // 8 ← essay revisa módulo 7
  ],
  a3: [
    [...a3PromptsCodigo, ...a3CodigoExtra], // 0
    [essayA3[0], ...a3AutomacaoIA, ...a3AutomacaoExtra], // 1 ← essay revisa módulo 0
    [essayA3[1], ...a3PromptNegocios, ...a3NegociosExtra], // 2 ← essay revisa módulo 1
    [essayA3[2], ...a3FluxosAgentes, ...a3FluxosExtra], // 3 ← essay revisa módulo 2
    [essayA3[3], ...a3AvaliacaoMetricas, ...a3MetricasExtra], // 4 ← essay revisa módulo 3
    [essayA3[4], ...a3Guardrails, ...a3GuardrailsExtra], // 5 ← essay revisa módulo 4
    [essayA3[5], ...a3ProjetoFinal, ...a3ProjetoFinalExtra], // 6 ← essay revisa módulo 5
    [essayA3[6], ...aplicandoAgents], // 7 ← essay revisa módulo 6
    [essayA3[7], ...usandoOpenRouter], // 8 ← essay revisa módulo 7
    [essayA3[8], ...modelosLocais], // 9 ← essay revisa módulo 8
    [essayA3[9], ...claudeCodePratica], // 10 ← essay revisa módulo 9
    [essayA3[10], ...skillsClaudeCode], // 11 ← essay revisa módulo 10
    [essayA3[11], ...personalizarTemplates], // 12 ← essay revisa módulo 11
    [essayA3[12], ...apiKeyBasico, ...apiKeyFillBlank], // 13 ← essay revisa módulo 12
    [essayA3[13], ...migrationsBasico], // 14 ← essay revisa módulo 13
    [essayA3[14], ...healthCheckBasico, ...healthOrder], // 15 ← essay revisa módulo 14
    [essayA3[15], ...cronJobsBasico, ...cronMatch], // 16 ← essay revisa módulo 15
    [essayA3[16], ...nodeBasico], // 17 ← essay revisa módulo 16
    [essayA3[17], ...gitBashBasico, ...gitOrder], // 18 ← essay revisa módulo 17
    [essayA3[18], ...npmBasico], // 19 ← essay revisa módulo 18
    [essayA3[19], ...skillsLLMBasico, ...llmMatch], // 20 ← essay revisa módulo 19
  ],
  a4: [
    [...a4Intro, ...a4IntroFill], // 0 — Introdução à Técnica SAFE
    [essayA4[0], ...a4Sujeito, ...a4SujeitoFill], // 1 — S — Sujeito (essay revisa módulo 0)
    [essayA4[1], ...a4Atributos, ...a4AtributosMatch], // 2 — A — Atributos (essay revisa módulo 1)
    [essayA4[2], ...a4Enquadramento, ...a4EnquadramentoOrder], // 3 — F — Enquadramento (essay revisa módulo 2)
    [essayA4[3], ...a4Ambiente, ...a4AmbienteMatch], // 4 — E — Ambiente (essay revisa módulo 3)
    [essayA4[4], ...a4Restricoes, ...a4RestricoesOrder], // 5 — Restrições negativas (essay revisa módulo 4)
    [essayA4[5], ...a4ProvaFinal], // 6 — Prova final dissertativa (essay revisa módulo 5 + prova SAFE completa)
  ],
}

// ── Slides de conteúdo introdutório (um por módulo) ───────────────────────
// Estes slides aparecem ANTES das atividades em cada lição.

const SLIDE_CONTENT: Record<TrackId, ContentSlide[][]> = {
  // ── Trilha A1 — Fundamentos de Prompts ────────────────────────────────
  a1: [
    // Módulo 0 — Boas-vindas
    [
      {
        id: "slide-a1-0",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Bem-vindo ao PromptLabz!" },
          {
            type: "text",
            text: "PromptLabz é uma trilha de aprendizado prática para você dominar a arte de escrever prompts e usar IA com eficiência. Aqui você não aprende teoria desconectada — aprende com exercícios, exemplos reais e desafios progressivos.",
          },
          {
            type: "mind-map",
            title: "O que você vai dominar",
            branches: [
              {
                label: "A1 — Fundamentos",
                children: [
                  "O que é prompt",
                  "Contexto & clareza",
                  "Role prompting",
                  "Framework CRAFT",
                  "Few-shot",
                  "Refino iterativo",
                ],
              },
              {
                label: "A2 — Avançado",
                children: ["Chain-of-thought", "Decomposição", "Multi-etapa", "Avaliação"],
              },
              { label: "A3 — Profissional", children: ["Código", "Automação", "Agentes", "APIs"] },
            ],
          },
          {
            type: "quote",
            text: '"Saber escrever bons prompts é como saber fazer as perguntas certas — a habilidade mais valiosa para trabalhar com IA."',
          },
          {
            type: "tip",
            text: "Complete todas as atividades com nota perfeita para desbloquear o próximo módulo e ganhar uma vida bônus!",
          },
        ],
      },
    ],
    // Módulo 1 — O que é um Prompt
    [
      {
        id: "slide-a1-1",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "O que é um Prompt?" },
          {
            type: "text",
            text: "Um prompt é a instrução, pergunta ou texto que você envia para um modelo de linguagem (LLM) para obter uma resposta. É a sua entrada (input) — pode ser uma pergunta simples, um comando detalhado, um trecho de texto para continuar ou qualquer coisa que você envia para a IA processar.",
          },
          {
            type: "example",
            label: "Prompt vago × Prompt eficaz",
            before: "Me conta algo sobre marketing.",
            after:
              "Liste 5 estratégias de marketing digital para um restaurante delivery no bairro do Itaim Bibi, focando em redes sociais. Use bullet points curtos.",
          },
          {
            type: "text",
            text: "A diferença entre os dois exemplos é clareza, contexto e objetivo. Um prompt eficaz responde internamente: 'O que eu quero?', 'Para quem?', 'Em que formato?'",
          },
          {
            type: "tip",
            text: "Clareza sempre vence comprimento. Um prompt curto e específico é melhor que um longo e vago.",
          },
        ],
      },
    ],
    // Módulo 2 — Contexto & Clareza
    [
      {
        id: "slide-a1-2",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Contexto & Clareza em Prompts" },
          {
            type: "text",
            text: "O modelo de IA não conhece você, sua empresa, seu público ou seu histórico. O contexto que você fornece no prompt é a única fonte de informação que ele tem para personalizar a resposta. Sem contexto, o modelo adivinha — e geralmente erra o alvo.",
          },
          {
            type: "example",
            label: "Sem contexto × Com contexto",
            before: "Crie um e-mail de recusa.",
            after:
              "Crie um e-mail formal de 5 linhas recusando uma proposta de parceria, mantendo tom cordial, para enviar ao CEO de uma startup de fintech. Assine como Diretor Comercial.",
          },
          {
            type: "text",
            text: "Elementos de contexto que transformam um prompt: quem você é, para quem é destinado, qual o objetivo, qual o canal (e-mail, post, relatório) e quais restrições existem.",
          },
          {
            type: "tip",
            text: "Antes de enviar um prompt, pergunte: 'Se outra pessoa lesse isso, saberia exatamente o que preciso?' Se não, adicione contexto.",
          },
        ],
      },
    ],
    // Módulo 3 — Personas e Papéis
    [
      {
        id: "slide-a1-3",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Role Prompting — Atribuição de Persona" },
          {
            type: "text",
            text: "Role prompting é pedir ao modelo que assuma uma persona específica. Ao definir um papel, você calibra o vocabulário, o nível técnico, o tom e a perspectiva da resposta. A mesma pergunta gera respostas completamente diferentes dependendo do papel atribuído.",
          },
          {
            type: "mind-map",
            title: "Como a persona muda a resposta",
            branches: [
              {
                label: "Médico pediatra",
                children: [
                  "Linguagem acessível para pais",
                  "Foco em segurança infantil",
                  "Evita jargão técnico excessivo",
                ],
              },
              {
                label: "PhD em Medicina",
                children: [
                  "Terminologia clínica precisa",
                  "Referências a estudos",
                  "Profundidade técnica",
                ],
              },
              {
                label: "Professor de 5° ano",
                children: ["Analogias simples", "Exemplos do cotidiano", "Frases curtas"],
              },
            ],
          },
          {
            type: "example",
            label: "Persona vaga × Persona específica",
            before: "Aja como especialista. Explique autenticação.",
            after:
              "Você é um engenheiro de software sênior com 10 anos em segurança web. Explique autenticação JWT para um dev junior que sabe JavaScript mas nunca trabalhou com tokens.",
          },
          {
            type: "tip",
            text: "Quanto mais específica a persona (área + experiência + relação com o interlocutor), mais consistente e útil a resposta.",
          },
        ],
      },
    ],
    // Módulo 4 — Estruturas de Prompt (CRAFT)
    [
      {
        id: "slide-a1-4",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Framework CRAFT — Estrutura Completa" },
          {
            type: "text",
            text: "CRAFT é um checklist que garante que os elementos mais importantes estejam presentes no seu prompt. Cada letra representa um componente que, quando presente, reduz ambiguidade e melhora a qualidade da resposta.",
          },
          {
            type: "mind-map",
            title: "CRAFT",
            branches: [
              {
                label: "C — Contexto",
                children: ["Quem você é", "Qual é a situação", "Por que você precisa disso"],
              },
              {
                label: "R — Role (Papel)",
                children: ["Persona do modelo", "Nível de expertise", "Relação com o interlocutor"],
              },
              {
                label: "A — Ação",
                children: ["O que o modelo deve fazer", "Verbo de ação claro", "Escopo definido"],
              },
              {
                label: "F — Formato",
                children: ["Lista, JSON, tabela", "Número de itens", "Tamanho máximo"],
              },
              {
                label: "T — Tom",
                children: ["Formal / informal", "Técnico / acessível", "Entusiasta / neutro"],
              },
            ],
          },
          {
            type: "example",
            label: "Prompt com CRAFT completo",
            before: "Escreva sobre marketing digital.",
            after:
              "Contexto: tenho loja de roupas no Instagram com 5k seguidores. Papel: copywriter de moda. Ação: escreva 3 legendas para posts de produto. Formato: uma por bloco, máximo 80 palavras, com 3 emojis. Tom: jovem, descontraído e inspirador.",
          },
        ],
      },
    ],
    // Módulo 5 — Few-Shot Prompting
    [
      {
        id: "slide-a1-5",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Few-Shot Prompting — Aprender por Exemplos" },
          {
            type: "text",
            text: "Few-shot prompting fornece ao modelo exemplos concretos de entrada e saída dentro do próprio prompt. O modelo infere o padrão dos exemplos e replica na nova resposta. É mais eficaz do que descrever o formato em palavras — mostrar é mais poderoso que dizer.",
          },
          {
            type: "mind-map",
            title: "Variações de 'shot'",
            branches: [
              {
                label: "Zero-shot",
                children: [
                  "Nenhum exemplo",
                  "Depende do modelo entender a instrução",
                  "Bom para tarefas simples",
                ],
              },
              {
                label: "One-shot",
                children: ["1 exemplo de input/output", "Suficiente para formatos simples"],
              },
              {
                label: "Few-shot",
                children: [
                  "2–10 exemplos",
                  "Ensina padrões complexos",
                  "Ideal para formatos específicos",
                ],
              },
            ],
          },
          {
            type: "code",
            language: "prompt",
            code: `Classifique o sentimento do texto. Use: POSITIVO, NEGATIVO ou NEUTRO.

Texto: "O produto chegou no prazo e funcionou perfeitamente."
Sentimento: POSITIVO

Texto: "Péssimo atendimento, nunca mais compro aqui."
Sentimento: NEGATIVO

Texto: "O pacote foi entregue ontem."
Sentimento: [← modelo preenche aqui]`,
          },
          {
            type: "tip",
            text: "2–3 exemplos geralmente são suficientes. Mais de 5 só se o padrão for muito complexo ou sutil.",
          },
        ],
      },
    ],
    // Módulo 6 — Refino Iterativo
    [
      {
        id: "slide-a1-6",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Refino Iterativo — Prompts como Código" },
          {
            type: "text",
            text: "Raramente um prompt fica perfeito na primeira versão. Prompts são como código: você testa, identifica o que falhou, melhora e testa de novo. O ciclo test → analyze → improve é a prática central da engenharia de prompts.",
          },
          {
            type: "mind-map",
            title: "Ciclo de Refino",
            branches: [
              { label: "1. Testar", children: ["Rodar o prompt", "Anotar o resultado"] },
              {
                label: "2. Analisar",
                children: ["O que faltou?", "Contexto? Formato? Tom? Persona?"],
              },
              {
                label: "3. Melhorar",
                children: ["Adicionar o que faltou", "Remover o que confundiu"],
              },
              {
                label: "4. Versionar",
                children: ["Salvar como v2, v3…", "Construir biblioteca pessoal"],
              },
            ],
          },
          {
            type: "quote",
            text: '"Prompt engineering é 10% inspiração, 90% iteração. A versão 1 raramente é a versão boa."',
          },
          {
            type: "tip",
            text: "Ao analisar uma resposta ruim, sempre pergunte primeiro: 'O que estava faltando ou ambíguo no MEU prompt?' — não no modelo.",
          },
        ],
      },
    ],
  ],

  // ── Trilha A2 — Prompts Avançados ─────────────────────────────────────
  a2: [
    // Módulo 0 — Chain-of-Thought
    [
      {
        id: "slide-a2-0",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Chain-of-Thought — Raciocínio Passo a Passo" },
          {
            type: "text",
            text: "Chain-of-Thought (CoT) é uma técnica que instrui o modelo a externalizar o raciocínio antes de dar a resposta final. Ao 'mostrar o trabalho', o modelo comete menos erros em problemas que exigem múltiplos passos de lógica.",
          },
          {
            type: "example",
            label: "Sem CoT × Com CoT",
            before: "Quantas palavras tem 'inteligência artificial'? Multiplique por 7.",
            after:
              "Pense passo a passo:\n1. Contar as palavras: 'inteligência' (1) + 'artificial' (2) = 2 palavras.\n2. Multiplicar: 2 × 7 = 14.\nResposta: 14.",
          },
          {
            type: "text",
            text: "Chain-of-Thought tem mais impacto em: matemática e lógica, análise de código, diagnósticos, raciocínio jurídico e qualquer tarefa onde pular etapas gera erros.",
          },
          {
            type: "code",
            language: "prompt",
            code: `Analise este contrato e identifique cláusulas problemáticas.
Pense passo a passo:
1. Liste todas as obrigações de cada parte.
2. Identifique assimetrias ou ambiguidades.
3. Aponte cláusulas que favorecem desproporcionalmente uma parte.
Após a análise, liste os problemas encontrados.`,
          },
          {
            type: "tip",
            text: "A frase mais simples para ativar CoT: 'Pense passo a passo antes de responder.' Experimente adicionar isso a qualquer prompt de raciocínio.",
          },
        ],
      },
    ],
    // Módulo 1 — Decomposição de Tarefas
    [
      {
        id: "slide-a2-1",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Decomposição — Dividir para Conquistar" },
          {
            type: "text",
            text: "Tarefas complexas em um único prompt causam 'instrução esquecida' — o modelo perde foco, omite partes ou mistura requisitos. Decompor a tarefa em prompts menores e sequenciais garante atenção total a cada etapa e permite revisar antes de avançar.",
          },
          {
            type: "mind-map",
            title: "Pipeline de criação de artigo",
            branches: [
              {
                label: "Prompt 1 — Estrutura",
                children: [
                  "Gerar outline com tópicos e subtópicos",
                  "Revisar e aprovar antes de avançar",
                ],
              },
              {
                label: "Prompt 2 — Conteúdo",
                children: [
                  "Desenvolver cada seção do outline",
                  "Manter contexto do outline aprovado",
                ],
              },
              {
                label: "Prompt 3 — Revisão",
                children: ["Checar coerência, tom e erros", "Ajustar com instruções específicas"],
              },
            ],
          },
          {
            type: "quote",
            text: '"Quanto mais requisitos num único prompt, maior o risco de instrução esquecida. Decompor garante que cada etapa receba atenção total."',
          },
          {
            type: "tip",
            text: "Regra prática: se sua tarefa tem mais de 3 requisitos distintos, considere decompô-la em prompts separados.",
          },
        ],
      },
    ],
    // Módulo 2 — Prompts com Restrições
    [
      {
        id: "slide-a2-2",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Restrições — Definindo as Fronteiras" },
          {
            type: "text",
            text: "Restrições são instruções explícitas que definem o que o modelo pode e não pode fazer: limite de palavras, temas proibidos, formato obrigatório. Elas reduzem a variabilidade da resposta e garantem que o output caiba no seu caso de uso.",
          },
          {
            type: "example",
            label: "Sem restrição × Com restrições",
            before: "Resuma este texto.",
            after:
              "Resuma em no máximo 3 frases, sem usar jargões técnicos, focando nas ações práticas para o leitor. Não mencione percentuais ou estatísticas.",
          },
          {
            type: "mind-map",
            title: "Tipos de Restrição",
            branches: [
              {
                label: "Tamanho",
                children: ["máx. 100 palavras", "exatamente 3 bullet points", "1 parágrafo"],
              },
              {
                label: "Vocabulário",
                children: ["sem jargão técnico", "linguagem para leigos", "em português formal"],
              },
              {
                label: "Foco",
                children: ["apenas sobre X", "não mencione Y", "foco em ações práticas"],
              },
              { label: "Formato", children: ["JSON", "tabela Markdown", "lista numerada"] },
            ],
          },
          {
            type: "tip",
            text: "Restrições negativas ('não faça X') funcionam melhor acompanhadas de uma instrução positiva equivalente ('faça Y em vez disso').",
          },
        ],
      },
    ],
    // Módulo 3 — Estilo e Tom Controlado
    [
      {
        id: "slide-a2-3",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Estilo e Tom — A Personalidade da Escrita" },
          {
            type: "text",
            text: "Tom é o estilo emocional e de linguagem da resposta — formal, informal, humorístico, empático, direto, técnico. Mesmo com o mesmo conteúdo, toms diferentes criam textos completamente diferentes. Especificar explicitamente garante consistência independente do modelo.",
          },
          {
            type: "mind-map",
            title: "Tom × Contexto",
            branches: [
              {
                label: "Formal",
                children: [
                  "Relatório executivo",
                  "Comunicação corporativa",
                  "Documentação oficial",
                ],
              },
              {
                label: "Conversacional",
                children: ["Tutorial para iniciantes", "Blog post", "E-mail de acompanhamento"],
              },
              {
                label: "Técnico",
                children: ["Documentação de API", "White paper", "Artigo científico"],
              },
              {
                label: "Empático",
                children: ["Suporte ao cliente", "Comunicação de crise", "Mensagem de desculpas"],
              },
            ],
          },
          {
            type: "example",
            label: "Tom vago × Tom específico",
            before: "Escreva profissionalmente.",
            after:
              "Escreva em tom formal e respeitoso, como uma carta corporativa de alto nível. Evite contrações e gírias. Use frases completas e linguagem direta.",
          },
          {
            type: "tip",
            text: "Use comparações para definir tom: 'como um colega explicando para outro' é muito mais claro que 'informal'.",
          },
        ],
      },
    ],
    // Módulo 4 — Prompts Multi-etapa
    [
      {
        id: "slide-a2-4",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Prompts Multi-etapa — Pipelines de Conteúdo" },
          {
            type: "text",
            text: "Prompts multi-etapa encadeiam resultados: a saída de um prompt alimenta o próximo. Isso cria pipelines de produção onde você pode revisar e ajustar cada etapa antes de avançar — como uma linha de montagem de conteúdo.",
          },
          {
            type: "code",
            language: "prompt",
            code: `# Passo 1 — Estrutura
Extraia os 5 pontos principais deste artigo: [artigo]

# Passo 2 — Síntese (usa saída do passo 1)
Com base nesses 5 pontos: [resultado anterior]
Escreva um resumo executivo de 150 palavras para um CEO.

# Passo 3 — Adaptação (usa saída do passo 2)
Adapte este resumo: [resultado anterior]
Para publicação no LinkedIn. Tom: inspirador. Máx: 300 chars.`,
          },
          {
            type: "tip",
            text: "Para manter contexto entre etapas: copie e cole o resultado anterior no próximo prompt precedido de 'Com base no texto acima…'",
          },
        ],
      },
    ],
    // Módulo 5 — Avaliação de Respostas
    [
      {
        id: "slide-a2-5",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Avaliando Respostas de LLMs" },
          {
            type: "text",
            text: "Modelos podem gerar texto fluente mas incorreto. Avaliar respostas de LLMs significa verificar: precisão factual, completude, aderência ao formato solicitado, tom adequado e ausência de alucinações (informações inventadas apresentadas como fatos).",
          },
          {
            type: "mind-map",
            title: "O que verificar em uma resposta",
            branches: [
              {
                label: "Precisão",
                children: [
                  "Fatos verificáveis corretos?",
                  "Datas, nomes, números conferidos?",
                  "Fontes citadas existem?",
                ],
              },
              {
                label: "Completude",
                children: ["Todos os pontos foram cobertos?", "Alguma instrução foi ignorada?"],
              },
              {
                label: "Formato",
                children: ["Estrutura pedida foi seguida?", "Tamanho dentro do limite?"],
              },
              {
                label: "Alucinação",
                children: ["Modelo admitiu incerteza?", "Informações parecem inventadas?"],
              },
            ],
          },
          {
            type: "quote",
            text: '"Alucinação: quando o modelo gera informações falsas com alto grau de confiança. Ele não avisa — escreve ficção com a mesma fluência dos fatos."',
          },
          {
            type: "tip",
            text: "Para reduzir alucinações: forneça contexto factual no prompt e instrua explicitamente: 'Se não tiver certeza, diga que não sabe'.",
          },
        ],
      },
    ],
    // Módulo 6 — Refino Guiado por Dados
    [
      {
        id: "slide-a2-6",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Refino Guiado por Dados" },
          {
            type: "text",
            text: "Refino guiado por dados é a diferença entre intuição e engenharia. Em vez de mudar o prompt por instinto, você coleta resultados, identifica padrões de falha e usa esses dados para melhorar de forma deliberada — como um engenheiro depurando código.",
          },
          {
            type: "mind-map",
            title: "Ciclo de melhoria baseado em dados",
            branches: [
              {
                label: "Coletar",
                children: [
                  "Registrar inputs e outputs",
                  "Avaliar cada resposta (1-5 ou pass/fail)",
                ],
              },
              {
                label: "Analisar",
                children: ["Agrupar falhas por categoria", "Identificar padrões recorrentes"],
              },
              {
                label: "Melhorar",
                children: [
                  "Adicionar instrução para a falha mais comum",
                  "Criar teste de regressão",
                ],
              },
              {
                label: "Validar",
                children: ["Rodar todos os casos anteriores", "Confirmar melhoria sem regressão"],
              },
            ],
          },
          {
            type: "tip",
            text: "Testes de regressão de prompt: um conjunto de inputs com outputs esperados que você roda toda vez que muda o prompt — para garantir que nenhuma melhoria quebrou casos que funcionavam.",
          },
        ],
      },
    ],
    // Módulo 7 — Engenharia de Prompt
    [
      {
        id: "slide-a2-7",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Engenharia de Prompt — A Ciência por Trás" },
          {
            type: "text",
            text: "Engenharia de Prompt é o design sistemático de instruções para maximizar a qualidade e previsibilidade das respostas do modelo. Não envolve treinar o modelo — é sobre guiá-lo com precisão. É uma disciplina que combina psicologia, linguística e lógica de sistemas.",
          },
          {
            type: "mind-map",
            title: "Técnicas de Prompt Engineering",
            branches: [
              { label: "Zero-shot", children: ["Sem exemplos", "Apenas instrução clara"] },
              { label: "Few-shot", children: ["2-10 exemplos", "Ensina padrão por demonstração"] },
              {
                label: "Chain-of-Thought",
                children: ["'Pense passo a passo'", "Externaliza raciocínio"],
              },
              { label: "CRAFT", children: ["Contexto + Role + Ação + Formato + Tom"] },
              { label: "Guardrails", children: ["Restrições explícitas", "Instruções de escopo"] },
            ],
          },
          {
            type: "code",
            language: "prompt",
            code: `# Exemplo de prompt com engenharia completa:

Você é um copywriter sênior especializado em SaaS B2B.
[Role: persona específica]

Contexto: temos um produto de gestão de projetos para PMEs.
[Context: situação clara]

Ação: escreva 3 variações de headline para landing page.
[Action: objetivo preciso]

Formato: uma variação por linha, máx. 8 palavras cada.
[Format: estrutura definida]

Tom: direto, orientado a resultado, sem jargão.
[Tone: estilo especificado]

NÃO use as palavras: revolucionário, incrível, poderoso.
[Guardrail: restrição explícita]`,
          },
        ],
      },
    ],
    // Módulo 8 — Conhecendo LLMs
    [
      {
        id: "slide-a2-8",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Conhecendo os Modelos de Linguagem (LLMs)" },
          {
            type: "text",
            text: "LLM (Large Language Model) é um modelo de IA treinado em grandes volumes de texto para prever a próxima palavra mais provável com base no contexto. Esse mecanismo simples, aplicado em escala massiva, gera texto coerente, responde perguntas e resolve problemas.",
          },
          {
            type: "mind-map",
            title: "Principais LLMs e suas origens",
            branches: [
              {
                label: "Anthropic",
                children: ["Claude (Claude 3, 4…)", "Foco em segurança e alinhamento"],
              },
              { label: "OpenAI", children: ["GPT-4, GPT-5", "Codex (especializado em código)"] },
              { label: "Google", children: ["Gemini (Nano, Flash, Pro, Ultra)"] },
              { label: "Meta", children: ["Llama (open-weights, local)"] },
              { label: "Alibaba", children: ["Qwen (open-weights)"] },
            ],
          },
          {
            type: "text",
            text: "Modelos open-weights (Llama, Qwen) liberam os pesos e permitem rodar localmente — útil para privacidade e custo. Modelos proprietários (Claude, GPT) oferecem maior qualidade via API.",
          },
          {
            type: "tip",
            text: "Escolha o modelo pelo caso de uso: Claude para raciocínio e código, GPT para ecossistema e integrações, Gemini para contexto longo, Llama/Qwen para privacidade local.",
          },
        ],
      },
    ],
  ],

  // ── Trilha A3 — Aplicações Profissionais ──────────────────────────────
  a3: [
    // Módulo 0 — Prompts para Código
    [
      {
        id: "slide-a3-0",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Prompts para Geração de Código" },
          {
            type: "text",
            text: "Gerar código de qualidade com IA exige especificidade máxima. Código é uma linguagem exata — uma ambiguidade no prompt gera código que roda mas faz a coisa errada, ou que usa uma API que não existe na versão que você usa.",
          },
          {
            type: "code",
            language: "prompt",
            code: `# Prompt ruim:
Escreva código para ordenar uma lista.

# Prompt profissional:
Em Python 3.11, escreva uma função:
- Nome: sort_by_date(items: list[dict]) -> list[dict]
- Ordena pelo campo 'date' (formato ISO 8601)
- Ordem: do mais recente para o mais antigo
- Inclua: docstring com parâmetros e retorno
- Inclua: 3 casos de teste com pytest
- Bibliotecas disponíveis: apenas stdlib`,
          },
          {
            type: "mind-map",
            title: "Elementos do prompt de código",
            branches: [
              {
                label: "Linguagem e versão",
                children: ["Python 3.11", "TypeScript 5", "Node.js 20"],
              },
              { label: "Assinatura", children: ["Nome da função", "Tipos de entrada/saída"] },
              {
                label: "Comportamento",
                children: ["O que faz", "Casos extremos", "Erros tratados"],
              },
              {
                label: "Restrições",
                children: ["Bibliotecas permitidas", "Estilo (PEP8, ESLint)"],
              },
              { label: "Validação", children: ["Incluir testes", "Incluir docstring"] },
            ],
          },
          {
            type: "tip",
            text: "Para debug: forneça código + erro exato + o que você já tentou + comportamento esperado. Contexto completo = diagnóstico preciso.",
          },
        ],
      },
    ],
    // Módulo 1 — Automação com IA
    [
      {
        id: "slide-a3-1",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Automação com IA — LLM + Orquestrador" },
          {
            type: "text",
            text: "Automação com IA combina um modelo de linguagem com um orquestrador (n8n, Zapier, script Python) que dispara prompts automaticamente em resposta a gatilhos. O resultado é um fluxo que executa tarefas de texto repetitivas sem intervenção humana constante.",
          },
          {
            type: "mind-map",
            title: "Plataformas de automação",
            branches: [
              {
                label: "n8n",
                children: ["Código aberto", "Auto-hospedável", "Fluxos visuais complexos"],
              },
              {
                label: "Zapier",
                children: ["Sem código", "Rápido para integrações simples", "Limitado em lógica"],
              },
              {
                label: "Make (ex-Integromat)",
                children: ["Visual, complexidade média", "Bom para dados estruturados"],
              },
              {
                label: "Python + API",
                children: ["Controle total", "Scripts customizados", "Privacidade máxima"],
              },
            ],
          },
          {
            type: "code",
            language: "python",
            code: `# Exemplo: automação de triagem de e-mails
import anthropic

client = anthropic.Anthropic()

def triagem_email(assunto: str, corpo: str) -> dict:
    prompt = f"""
    Classifique este e-mail em: URGENTE, NORMAL ou SPAM.
    Retorne JSON: {{"categoria": "...", "razao": "..."}}

    Assunto: {assunto}
    Corpo: {corpo}
    """
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text`,
          },
          {
            type: "tip",
            text: "Comece com 'human-in-the-loop' (humano revisando). Só automatize completamente após validar a qualidade em cenários reais.",
          },
        ],
      },
    ],
    // Módulo 2 — Prompts para Negócios
    [
      {
        id: "slide-a3-2",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Prompts para Negócios — Escala com Templates" },
          {
            type: "text",
            text: "Templates parametrizados (com variáveis como {{cliente}}, {{setor}}, {{objetivo}}) permitem reutilizar a mesma estrutura de prompt em múltiplos contextos, trocando apenas os valores específicos. Isso escala o uso de IA de um para muitos.",
          },
          {
            type: "code",
            language: "prompt",
            code: `# Template de proposta comercial parametrizado:

Você é um consultor de negócios especialista em {{setor}}.

Escreva uma proposta de {{tipo_proposta}} para:
- Cliente: {{nome_cliente}}
- Desafio: {{desafio_principal}}
- Orçamento estimado: {{orcamento}}
- Prazo: {{prazo}}

Formato: estrutura executiva com 4 seções:
1. Entendimento do desafio
2. Solução proposta
3. Cronograma e entregáveis
4. Investimento e ROI esperado

Tom: formal e orientado a resultado.
Tamanho: máx. 500 palavras.`,
          },
          {
            type: "tip",
            text: "Sempre revise antes de enviar para clientes. IA pode acertar o tom mas errar um dado específico — revisão humana é obrigatória em comunicações externas.",
          },
        ],
      },
    ],
    // Módulo 3 — Fluxos com Agentes
    [
      {
        id: "slide-a3-3",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Fluxos com Agentes — IA que Age" },
          {
            type: "text",
            text: "Um agente de IA é um sistema onde um LLM recebe um objetivo, decide quais ferramentas (tools) usar e executa ações em um laço (loop) até concluir a tarefa. Diferente de uma chamada simples, o agente age — não apenas responde.",
          },
          {
            type: "mind-map",
            title: "Componentes de um Agente",
            branches: [
              { label: "LLM", children: ["Raciocina sobre o objetivo", "Decide próximos passos"] },
              {
                label: "Ferramentas (Tools)",
                children: [
                  "Busca web",
                  "Leitura de arquivo",
                  "Chamada de API",
                  "Execução de código",
                ],
              },
              { label: "Memória", children: ["Contexto de curto prazo", "Histórico de ações"] },
              {
                label: "Orquestrador",
                children: ["Loop de decisão", "Condição de parada", "Limite de iterações"],
              },
            ],
          },
          {
            type: "code",
            language: "python",
            code: `# Fluxo multi-agente simplificado:
# Agente 1: Pesquisa → Agente 2: Análise → Agente 3: Relatório

orquestrador.run([
    Agente("Pesquisador", tools=["web_search", "arxiv"]),
    Agente("Analista",    tools=["code_exec", "calculator"]),
    Agente("Redator",     tools=["format_document"]),
], objetivo="Analise tendências em LLMs de 2024 e gere relatório")`,
          },
          {
            type: "tip",
            text: "Sempre defina condição de parada e limite máximo de iterações. Agentes sem limite podem entrar em loop infinito e gerar custos exponenciais.",
          },
        ],
      },
    ],
    // Módulo 4 — Avaliação & Métricas
    [
      {
        id: "slide-a3-4",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Avaliação & Métricas em Sistemas de IA" },
          {
            type: "text",
            text: "IA em produção precisa de monitoramento contínuo. Prompts que funcionavam ontem podem degradar após uma atualização do modelo ou mudança na distribuição dos inputs. Métricas de negócio (não apenas técnicas) revelam se a IA está realmente resolvendo o problema.",
          },
          {
            type: "mind-map",
            title: "Camadas de métricas",
            branches: [
              {
                label: "Técnicas",
                children: ["Latência (P50, P95)", "Taxa de erro", "Tokens consumidos/mês"],
              },
              {
                label: "Qualidade",
                children: ["Taxa de alucinação", "Aderência ao formato", "Coerência da resposta"],
              },
              {
                label: "Negócio",
                children: [
                  "CSAT (satisfação)",
                  "Taxa de escalação para humano",
                  "Taxa de resolução",
                ],
              },
            ],
          },
          {
            type: "text",
            text: "LLM-as-judge: usar um LLM para avaliar automaticamente a qualidade das respostas de outro LLM — você escreve um prompt de avaliação com critérios e o modelo pontua milhares de saídas automaticamente.",
          },
          {
            type: "tip",
            text: "Métricas de negócio são a estrela do norte. Um sistema rápido que gera respostas erradas tem ótima latência e péssimo CSAT.",
          },
        ],
      },
    ],
    // Módulo 5 — Segurança e Guardrails
    [
      {
        id: "slide-a3-5",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Guardrails — Segurança em Sistemas de IA" },
          {
            type: "text",
            text: "Guardrails são mecanismos que impedem o modelo de gerar conteúdo prejudicial, fora do escopo ou incorreto. Eles operam em camadas: no prompt (instrução de escopo), no código (validação da saída) e no sistema (filtros externos). A estratégia é 'defesa em profundidade'.",
          },
          {
            type: "mind-map",
            title: "Camadas de Defesa",
            branches: [
              {
                label: "No Prompt",
                children: [
                  "Definir escopo explícito",
                  "Instruir resposta padrão para fora do escopo",
                  "Guardrails negativos ('não faça X')",
                ],
              },
              {
                label: "No Código",
                children: [
                  "Validar formato da saída",
                  "Checar conteúdo proibido",
                  "Limite de tokens de saída",
                ],
              },
              {
                label: "No Sistema",
                children: [
                  "Filtros de conteúdo externos",
                  "Rate limiting",
                  "Logging para auditoria",
                ],
              },
            ],
          },
          {
            type: "code",
            language: "prompt",
            code: `# Guardrail de escopo no system prompt:
Você é um assistente de suporte do produto X.

REGRAS:
- Responda APENAS sobre funcionalidades do produto X.
- Para qualquer outra pergunta, diga:
  "Só posso ajudar com questões sobre o produto X.
   Para outros assuntos, consulte [link]."
- NUNCA invente funcionalidades que não existem.
- Se não souber, diga: "Não tenho essa informação."`,
          },
          {
            type: "tip",
            text: "Prompt injection: usuários podem enviar texto que instrui o modelo a ignorar suas regras. Por isso, guardrails apenas no prompt não são suficientes para sistemas críticos.",
          },
        ],
      },
    ],
    // Módulo 6 — Projeto Final
    [
      {
        id: "slide-a3-6",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Projeto Final — MVP-First com IA" },
          {
            type: "text",
            text: "Projetos de IA bem-sucedidos seguem o ciclo MVP-first: começar simples, validar com usuários reais, medir resultados e iterar. A tecnologia é secundária — clareza do problema e critérios de sucesso mensuráveis são primários.",
          },
          {
            type: "mind-map",
            title: "Ciclo de projeto de IA",
            branches: [
              {
                label: "1. Definir",
                children: [
                  "Problema em 1 frase",
                  "Usuário-alvo",
                  "Critérios de sucesso mensuráveis",
                ],
              },
              {
                label: "2. Prototipar",
                children: ["Prompt simples (MVP)", "Sem over-engineering inicial"],
              },
              {
                label: "3. Testar",
                children: ["Usuários reais", "Casos extremos", "Feedback qualitativo"],
              },
              {
                label: "4. Medir",
                children: ["Métricas definidas na etapa 1", "Comparar com baseline"],
              },
              {
                label: "5. Iterar",
                children: ["Refinar prompt", "Adicionar complexidade gradualmente"],
              },
            ],
          },
          {
            type: "quote",
            text: '"A diferença entre um projeto de IA bem-sucedido e um que falha: clareza do problema, métricas definidas e testes com usuários reais — não o modelo mais caro."',
          },
          {
            type: "tip",
            text: "Um projeto de IA maduro tem: prompts versionados e testados, tratamento de erros, guardrails, métricas de qualidade e documentação das decisões de design.",
          },
        ],
      },
    ],
    // Módulo 7 — Aplicando Agentes
    [
      {
        id: "slide-a3-7",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Agentes de IA na Prática" },
          {
            type: "text",
            text: "Um agente recebe um objetivo, decide quais ferramentas usar, executa ações e itera até concluir. Ferramentas (tools) são funções tipadas que o agente chama — busca web, leitura de arquivo, chamada de API, execução de código. Sem tools, o agente só conversa; com elas, age no mundo real.",
          },
          {
            type: "code",
            language: "python",
            code: `# Definindo uma ferramenta para um agente
tools = [
    {
        "name": "buscar_preco",
        "description": "Busca o preço atual de um produto no e-commerce",
        "input_schema": {
            "type": "object",
            "properties": {
                "produto": {
                    "type": "string",
                    "description": "Nome do produto"
                }
            },
            "required": ["produto"]
        }
    }
]

# O agente decide QUANDO e SE chamar cada tool
# com base no objetivo recebido`,
          },
          {
            type: "tip",
            text: "Proteja seu agente com: limite de iterações (max_steps), timeout por ação, e revisão humana antes de ações irreversíveis (envio de e-mail, pagamento).",
          },
        ],
      },
    ],
    // Módulo 8 — OpenRouter
    [
      {
        id: "slide-a3-8",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "OpenRouter — Um Gateway para Todos os LLMs" },
          {
            type: "text",
            text: "OpenRouter é um gateway que unifica acesso a centenas de modelos de linguagem (OpenAI, Anthropic, Google, Meta, e mais) por uma única API compatível com a da OpenAI. Você troca de modelo mudando apenas um parâmetro — sem reescrever o código.",
          },
          {
            type: "code",
            language: "python",
            code: `# Com OpenRouter, a API é compatível com OpenAI:
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="sua_chave_openrouter",  # não a da OpenAI
)

# Troque apenas o 'model' para usar qualquer LLM:
response = client.chat.completions.create(
    model="anthropic/claude-sonnet-4-6",  # ou openai/gpt-4o
    messages=[{"role": "user", "content": "Olá!"}]
)`,
          },
          {
            type: "mind-map",
            title: "Vantagens do OpenRouter",
            branches: [
              {
                label: "Flexibilidade",
                children: ["Centenas de modelos", "Troca com 1 parâmetro"],
              },
              {
                label: "Custo",
                children: ["Fallbacks automáticos", "Comparação de preços", "Pay-per-use"],
              },
              {
                label: "Compatibilidade",
                children: ["API compatível com OpenAI", "Qualquer SDK OpenAI funciona"],
              },
            ],
          },
        ],
      },
    ],
    // Módulo 9 — Modelos Locais
    [
      {
        id: "slide-a3-9",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Modelos Locais — IA sem Nuvem" },
          {
            type: "text",
            text: "Modelos locais têm seus pesos rodando diretamente na sua máquina, sem depender de APIs externas. Isso garante privacidade total (dados nunca saem), funcionamento offline e custo previsível em alto volume — à custa de qualidade menor e exigência de hardware.",
          },
          {
            type: "mind-map",
            title: "Ferramentas para modelos locais",
            branches: [
              {
                label: "Ollama",
                children: [
                  "CLI simples",
                  "API local compatível com OpenAI",
                  "Gerencia download de modelos",
                ],
              },
              {
                label: "LM Studio",
                children: ["Interface gráfica", "Suporta GGUF quantizado", "Chat integrado"],
              },
              {
                label: "llama.cpp",
                children: ["C++ otimizado", "Máxima performance", "Para desenvolvedores"],
              },
            ],
          },
          {
            type: "code",
            language: "bash",
            code: `# Instalar e rodar modelo local com Ollama:
ollama pull llama3.1:8b          # baixar modelo
ollama run llama3.1:8b           # chat direto no terminal

# API local compatível com OpenAI (porta 11434):
curl http://localhost:11434/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{"model": "llama3.1:8b", "messages": [...]}'`,
          },
          {
            type: "tip",
            text: "Quantização (Q4, Q5, Q8): comprime os pesos do modelo para caber em menos RAM com leve perda de qualidade. Q4_K_M é o balanço mais comum para uso geral.",
          },
        ],
      },
    ],
    // Módulo 10 — Claude Code na Prática
    [
      {
        id: "slide-a3-10",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Claude Code — IA Agente no seu Terminal" },
          {
            type: "text",
            text: "Claude Code é uma CLI agente da Anthropic que opera dentro do seu repositório: lê e edita arquivos, roda comandos, mantém contexto do projeto e executa tarefas complexas de desenvolvimento. É um agente completo que age sobre o seu código.",
          },
          {
            type: "code",
            language: "bash",
            code: `# Instalar e configurar Claude Code:
npm install -g @anthropic-ai/claude-code

# Iniciar sessão em um projeto:
cd meu-projeto/
claude

# Comandos especiais dentro do Claude Code:
/init      # gera CLAUDE.md com contexto do projeto
/clear     # limpa contexto (nova sessão)
/help      # lista todos os comandos disponíveis`,
          },
          {
            type: "mind-map",
            title: "Arquivo CLAUDE.md",
            branches: [
              {
                label: "O que incluir",
                children: [
                  "Comandos de desenvolvimento",
                  "Convenções do projeto",
                  "Estrutura de pastas",
                  "Regras de negócio",
                ],
              },
              {
                label: "Como funciona",
                children: [
                  "Lido automaticamente em cada sessão",
                  "Funciona como system prompt do projeto",
                  "Persistente entre sessões",
                ],
              },
            ],
          },
          {
            type: "tip",
            text: "Para tarefas grandes: quebre em etapas pequenas, revise os diffs propostos, e use /clear entre tarefas independentes para manter o contexto limpo.",
          },
        ],
      },
    ],
    // Módulo 11 — Skills no Claude Code
    [
      {
        id: "slide-a3-11",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Skills no Claude Code — Conhecimento Reutilizável" },
          {
            type: "text",
            text: "Uma Skill é um pacote de instruções e recursos que o Claude carrega quando a tarefa combina com sua descrição. Skills são conhecimento procedural reutilizável — uma pasta com SKILL.md + recursos opcionais (templates, exemplos, scripts).",
          },
          {
            type: "code",
            language: "markdown",
            code: `# Estrutura de uma Skill (.claude/skills/minha-skill/)

SKILL.md:
---
name: deploy-vercel
description: |
  Use when deploying to Vercel, running vercel commands,
  or troubleshooting Vercel deployments. Covers CLI setup,
  environment variables, and common errors.
---

# Como fazer deploy no Vercel

## Pré-requisitos
...

## Passos para deploy
...

## Erros comuns e soluções
...`,
          },
          {
            type: "tip",
            text: "O campo 'description' do SKILL.md é o mais importante: é o gancho de recuperação que o Claude usa para decidir quando ativar a skill. Uma descrição vaga = skill nunca ativada.",
          },
        ],
      },
    ],
    // Módulo 12 — Personalizar Templates
    [
      {
        id: "slide-a3-12",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Templates de Prompt — Parametrizar para Reutilizar" },
          {
            type: "text",
            text: "Um template de prompt tem partes fixas (estrutura, guardrails, formato) e partes variáveis ({{cliente}}, {{setor}}, {{objetivo}}). Parametrizar separa o que é padrão do que muda por caso de uso, tornando o prompt escalável e manutenível.",
          },
          {
            type: "code",
            language: "prompt",
            code: `# Template parametrizado de análise de sentimento:

Você é um analista de {{setor}}.

Analise o feedback abaixo e retorne JSON:
{
  "sentimento": "POSITIVO | NEGATIVO | NEUTRO",
  "intensidade": 1-5,
  "temas_principais": ["tema1", "tema2"],
  "acao_recomendada": "..."
}

Contexto: feedback de {{tipo_cliente}} sobre {{produto}}.
Tom da análise: {{tom_analise}}.

Feedback:
"""
{{feedback_do_cliente}}
"""`,
          },
          {
            type: "tip",
            text: "Antes de customizar um template: leia tudo, mapeie as variáveis, identifique os guardrails. Remover proteções sem entender por que estão ali é o erro mais comum ao adaptar templates.",
          },
        ],
      },
    ],
    // Módulo 13 — API Key Básico
    [
      {
        id: "slide-a3-13",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Chaves de API — Segurança desde o Início" },
          {
            type: "text",
            text: "Uma chave de API (API key) é uma credencial secreta que identifica e autoriza seu aplicativo a chamar uma API. Funciona como login + senha do seu app junto ao serviço. Se vazar, qualquer um pode usar a sua conta, gerar custos e acessar seus dados.",
          },
          {
            type: "mind-map",
            title: "Onde guardar (e onde NÃO guardar)",
            branches: [
              {
                label: "NUNCA aqui",
                children: [
                  "Código front-end (browser)",
                  "Repositório Git público",
                  "Mensagens de chat",
                  "E-mails",
                ],
              },
              {
                label: "Use sempre",
                children: [
                  "Variáveis de ambiente (.env)",
                  "Secrets Manager (Vault)",
                  "CI/CD secrets (GitHub Secrets)",
                ],
              },
            ],
          },
          {
            type: "code",
            language: "bash",
            code: `# .env (nunca commitar — add ao .gitignore)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# .env.example (commitar — sem valores reais)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Acessar no código:
import os
api_key = os.environ["ANTHROPIC_API_KEY"]`,
          },
          {
            type: "tip",
            text: "Se sua chave vazar: 1) Rotacione imediatamente (revogue + gere nova). 2) Cheque os logs por uso não autorizado. 3) Apagar o commit NÃO basta — o histórico do Git preserva o segredo.",
          },
        ],
      },
    ],
    // Módulo 14 — Migrations
    [
      {
        id: "slide-a3-14",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Migrations — Versionamento do Banco de Dados" },
          {
            type: "text",
            text: "Uma migration é um arquivo versionado com instruções SQL que evolui o esquema do banco de forma reproduzível. Pense como commits do Git aplicados ao schema — cada mudança fica registrada, pode ser revisada em PR e qualquer ambiente chega ao mesmo estado ao rodar as migrations.",
          },
          {
            type: "code",
            language: "sql",
            code: `-- Migration: 0001_criar_tabela_usuarios.sql
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    nome TEXT,
    criado_em TIMESTAMPTZ DEFAULT now()
);

-- Migration: 0002_adicionar_plano.sql
ALTER TABLE usuarios
ADD COLUMN plano TEXT NOT NULL DEFAULT 'free'
    CHECK (plano IN ('free', 'pro', 'enterprise'));

-- Seed idempotente (pode rodar várias vezes):
INSERT INTO planos (nome, preco) VALUES
  ('free', 0), ('pro', 49), ('enterprise', 199)
ON CONFLICT (nome) DO NOTHING;`,
          },
          {
            type: "tip",
            text: "Regra de ouro: nunca altere uma migration já aplicada em produção — crie uma nova migration para desfazer ou corrigir.",
          },
        ],
      },
    ],
    // Módulo 15 — Health Check
    [
      {
        id: "slide-a3-15",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Health Check — Sinal de Vida do Serviço" },
          {
            type: "text",
            text: "Um health check é um endpoint (GET /health) que responde rapidamente dizendo se o serviço está saudável. Balanceadores de carga, orquestradores (Kubernetes) e ferramentas de monitoramento usam esse endpoint para decidir se o app está apto a receber tráfego.",
          },
          {
            type: "mind-map",
            title: "Tipos de health check",
            branches: [
              {
                label: "Liveness",
                children: ["'O processo está vivo?'", "Falha → orquestrador reinicia o container"],
              },
              {
                label: "Readiness",
                children: [
                  "'Está pronto para tráfego?'",
                  "Falha → balanceador para de enviar requisições",
                  "Banco/cache podem estar verificados aqui",
                ],
              },
              {
                label: "Startup",
                children: [
                  "'Terminou de inicializar?'",
                  "Evita matar containers lentos para subir",
                ],
              },
            ],
          },
          {
            type: "code",
            language: "javascript",
            code: `// Health check em Node.js / Express:
app.get('/health', async (req, res) => {
    const checks = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        db: 'unknown',
    };

    try {
        // SELECT 1 — leve, prova que o pool funciona
        await db.query('SELECT 1');
        checks.db = 'ok';
    } catch {
        checks.db = 'error';
        checks.status = 'degraded';
    }

    const code = checks.status === 'ok' ? 200 : 503;
    res.status(code).json(checks);
});`,
          },
        ],
      },
    ],
    // Módulo 16 — Cron Jobs
    [
      {
        id: "slide-a3-16",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Cron Jobs — Automação por Agendamento" },
          {
            type: "text",
            text: "Um cron job é uma tarefa agendada que roda automaticamente em horários definidos por uma expressão cron. A expressão tem 5 campos: minuto, hora, dia-do-mês, mês, dia-da-semana. Asterisco (*) significa 'qualquer valor'.",
          },
          {
            type: "code",
            language: "bash",
            code: `# Formato: minuto hora dia-mês mês dia-semana

0 9 * * 1      → toda segunda-feira às 09:00
*/15 * * * *   → a cada 15 minutos
0 0 * * *      → todo dia à meia-noite
0 0 1 * *      → primeiro dia de cada mês às 00:00
30 8 * * 1-5   → dias úteis às 08:30

# Ferramenta de teste visual: crontab.guru
# Verificar jobs ativos no Linux:
crontab -l`,
          },
          {
            type: "mind-map",
            title: "Boas práticas em produção",
            branches: [
              {
                label: "Idempotência",
                children: [
                  "Rodar duas vezes não estraga dados",
                  "Use ON CONFLICT DO NOTHING em INSERTs",
                ],
              },
              {
                label: "Logs",
                children: ["Registre início, fim e erros", "Inclua timestamp e ID de execução"],
              },
              {
                label: "Lock (mutex)",
                children: ["Evita execuções sobrepostas", "Job lento + intervalo curto = problema"],
              },
              {
                label: "Alertas",
                children: ["Notifique quando falhar", "Monitore duração anormal"],
              },
            ],
          },
        ],
      },
    ],
    // Módulo 17 — Node.js Básico
    [
      {
        id: "slide-a3-17",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Node.js — JavaScript no Servidor" },
          {
            type: "text",
            text: "Node.js é um runtime (ambiente de execução) baseado no motor V8 do Chrome que permite rodar JavaScript fora do navegador — no servidor, no terminal e em ferramentas de linha de comando. Ele é o fundamento de ferramentas como npm, Vite, Next.js e a maioria dos CLIs modernos.",
          },
          {
            type: "mind-map",
            title: "Para que Node.js é usado",
            branches: [
              {
                label: "APIs e servidores web",
                children: ["Express, Fastify, Hono", "REST e GraphQL"],
              },
              {
                label: "CLIs",
                children: ["Ferramentas de linha de comando", "Scripts de automação"],
              },
              { label: "Build tools", children: ["Vite, Webpack, esbuild", "TypeScript compiler"] },
              {
                label: "Runtimes derivados",
                children: ["Deno (seguro por padrão)", "Bun (rápido, compatível npm)"],
              },
            ],
          },
          {
            type: "code",
            language: "javascript",
            code: `// Hello World em Node.js:
// arquivo: server.js
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!');
});

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});

// Rodar: node server.js`,
          },
          {
            type: "tip",
            text: "Node.js brilha em I/O assíncrono (muitas requisições simultâneas). Não é ideal para tarefas CPU-intensivas (processamento de imagem, ML) — use Python ou Rust para isso.",
          },
        ],
      },
    ],
    // Módulo 18 — Git Bash Básico
    [
      {
        id: "slide-a3-18",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Git Bash — Controle de Versão no Terminal" },
          {
            type: "text",
            text: "Git é o sistema de controle de versão mais usado no mundo. Git Bash é o terminal que traz Git + comandos Unix (ls, pwd, grep) para Windows. Juntos, permitem versionar código, colaborar em equipe e navegar pelo sistema como em um terminal Unix.",
          },
          {
            type: "mind-map",
            title: "Fluxo básico do Git",
            branches: [
              {
                label: "Iniciar",
                children: [
                  "git clone <url>  → copiar repositório",
                  "git init         → criar novo repo",
                ],
              },
              {
                label: "Salvar",
                children: [
                  "git add <arquivo>  → preparar para commit",
                  'git commit -m "msg" → salvar no histórico local',
                ],
              },
              {
                label: "Sincronizar",
                children: [
                  "git push  → enviar para repositório remoto",
                  "git pull  → receber mudanças do remoto",
                ],
              },
              {
                label: "Colaborar",
                children: ["git branch  → criar branch", "git merge   → unir branches"],
              },
            ],
          },
          {
            type: "code",
            language: "bash",
            code: `# Fluxo diário típico:
git status                    # ver o que mudou
git add src/componente.tsx    # preparar arquivo
git add -p                    # revisar mudança por mudança
git commit -m "feat: add botão de login"  # salvar
git push origin main          # enviar para GitHub

# Ver histórico:
git log --oneline -10  # últimos 10 commits resumidos`,
          },
        ],
      },
    ],
    // Módulo 19 — npm Básico
    [
      {
        id: "slide-a3-19",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "npm — Gerenciador de Pacotes do Node.js" },
          {
            type: "text",
            text: "npm (Node Package Manager) é o gerenciador oficial de pacotes do Node.js. Ele lê o package.json, resolve versões compatíveis e baixa bibliotecas para a pasta node_modules. É o primeiro comando a rodar ao clonar um projeto.",
          },
          {
            type: "code",
            language: "bash",
            code: `# Comandos essenciais:
npm install              # instala tudo do package.json
npm install express      # adiciona uma dependência
npm install -D vitest    # adiciona devDependency
npm run dev              # executa script "dev" do package.json
npm run build            # compila para produção
npm run test             # roda os testes

# package.json:
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest"
  },
  "dependencies":    { "react": "^18" },  // produção
  "devDependencies": { "vite": "^5" }     // só em dev
}`,
          },
          {
            type: "tip",
            text: "Alternativas ao npm: pnpm (mais rápido, economiza disco) e yarn (versão v1 ou berry). A sintaxe de comandos é quase idêntica — pnpm install, pnpm run dev.",
          },
        ],
      },
    ],
    // Módulo 20 — Skills LLM Básico
    [
      {
        id: "slide-a3-20",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Skills em LLMs — Prompts Sistematizados" },
          {
            type: "text",
            text: "Skills em LLMs são conjuntos de instruções, exemplos e diretrizes que ensinam o modelo a executar uma tarefa específica com qualidade e consistência. Diferente de um prompt comum (pergunta pontual), uma skill é um sistema completo com persona, regras, exemplos few-shot, formato e guardrails.",
          },
          {
            type: "mind-map",
            title: "Skill × Prompt comum",
            branches: [
              {
                label: "Prompt comum",
                children: [
                  "Pergunta pontual e isolada",
                  "Sem estrutura reutilizável",
                  "Sem examples ou guardrails",
                ],
              },
              {
                label: "Skill",
                children: [
                  "Persona definida",
                  "Regras e restrições",
                  "Exemplos few-shot integrados",
                  "Formato de saída fixo",
                  "Guardrails de segurança",
                ],
              },
            ],
          },
          {
            type: "code",
            language: "markdown",
            code: `# Exemplo de Skill: Revisor de Código

Você é um engenheiro sênior especializado em code review.

## Regras de revisão:
- Priorize: segurança > correção > performance > estilo
- Aponte problemas com: linha, categoria e sugestão de fix
- Para cada problema, classifique: CRÍTICO | IMPORTANTE | SUGESTÃO
- Não reescreva o código — explique o que e por que mudar

## Formato de saída:
**Linha XX** [CRÍTICO] Problema: ... Sugestão: ...

## O que NÃO fazer:
- Nunca aprove código com SQL injection ou XSS
- Não comente sobre estilo se houver problemas críticos`,
          },
          {
            type: "tip",
            text: "Skills são 'instaladas' no contexto: no system prompt, em arquivos de configuração (CLAUDE.md, .cursorrules), ou em ferramentas como Claude Code (.claude/skills/).",
          },
        ],
      },
    ],
  ],

  // ── Trilha A4 — Técnica SAFE para Geração de Imagens com IA ────────────
  a4: [
    // Módulo 0 — Introdução à Técnica SAFE
    [
      {
        id: "slide-a4-0",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "A Técnica SAFE para Geração de Imagens" },
          {
            type: "text",
            text: "A geração de imagens com IA depende diretamente da clareza do prompt. Quanto mais organizado for o pedido, maior a chance de a imagem sair próxima do resultado desejado. A técnica SAFE estrutura o prompt em quatro partes essenciais, evitando comandos vagos.",
          },
          {
            type: "example",
            label: "Prompt fraco × Prompt SAFE",
            before: "Gere uma imagem bonita de um homem em uma cafeteria.",
            after:
              "Jovem empresário brasileiro sentado em uma cafeteria moderna, usando camisa preta casual, expressão confiante. Fotografia ultra-realista, luz dourada de início de dia, enquadramento meio corpo, lente 50 mm. Sem texto, sem logotipos, sem artefatos.",
          },
          {
            type: "mind-map",
            title: "SAFE",
            branches: [
              {
                label: "S — Sujeito",
                children: ["Quem ou o que aparece", "Idade, aparência, postura"],
              },
              {
                label: "A — Atributos",
                children: ["Roupa, expressão, estilo", "Cores e nível de realismo"],
              },
              {
                label: "F — Enquadramento",
                children: ["Formato, plano, ângulo", "Lente e composição"],
              },
              { label: "E — Ambiente", children: ["Local, iluminação", "Clima e atmosfera"] },
            ],
          },
          {
            type: "tip",
            text: "Nesta trilha você vai dominar cada letra do SAFE em um módulo dedicado — e no módulo final vai aplicar as 5 regras (S, A, F, E e Restrições) de uma vez, em uma prova dissertativa.",
          },
        ],
      },
    ],
    // Módulo 1 — S: Sujeito
    [
      {
        id: "slide-a4-1",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "S — Sujeito: Quem ou o que aparece" },
          {
            type: "text",
            text: "O Sujeito define o elemento principal da imagem: uma pessoa, animal, produto, personagem, objeto ou cenário. É sempre a primeira frase do prompt SAFE — defina-o antes de pensar em estilo, enquadramento ou cenário.",
          },
          {
            type: "mind-map",
            title: "Perguntas para definir o Sujeito",
            branches: [
              {
                label: "Identidade",
                children: ["Quem aparece?", "É pessoa, animal, produto, personagem ou objeto?"],
              },
              {
                label: "Características",
                children: ["Qual idade aproximada?", "Qual aparência geral?"],
              },
              { label: "Ação", children: ["Qual postura?", "O que está fazendo?"] },
            ],
          },
          {
            type: "example",
            label: "Sujeito vago × Sujeito claro",
            before: "Um homem.",
            after:
              "Homem jovem brasileiro, desenvolvedor de software, sentado diante de um setup moderno.",
          },
          {
            type: "tip",
            text: "Evite adjetivos genéricos como 'bonito' ou 'legal' no Sujeito — prefira fatos concretos: idade, profissão, ação.",
          },
        ],
      },
    ],
    // Módulo 2 — A: Atributos
    [
      {
        id: "slide-a4-2",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "A — Atributos: Como o sujeito aparece" },
          {
            type: "text",
            text: "Os Atributos definem os detalhes visuais do sujeito: roupa, expressão, estilo visual, cores principais, nível de realismo e qualquer detalhe importante que deve ser preservado.",
          },
          {
            type: "mind-map",
            title: "Atributos",
            branches: [
              {
                label: "Roupa & estilo",
                children: [
                  "Tipo de roupa",
                  "Estilo visual (ultra-realista, cartoon, editorial...)",
                ],
              },
              { label: "Expressão", children: ["Expressão facial", "Emoção transmitida"] },
              {
                label: "Cores & realismo",
                children: ["Cores principais", "Nível de realismo desejado"],
              },
            ],
          },
          {
            type: "example",
            label: "Sujeito sem atributos × Sujeito com atributos",
            before: "Homem jovem brasileiro, desenvolvedor de software.",
            after:
              "Usando camiseta preta minimalista, barba bem aparada, expressão concentrada, aparência natural, estilo fotográfico ultra-realista.",
          },
          {
            type: "tip",
            text: "Palavras úteis de estilo: ultra-realista, cinematográfico, editorial, minimalista, futurista, premium, 3D cartoon, isométrico, concept art.",
          },
        ],
      },
    ],
    // Módulo 3 — F: Enquadramento
    [
      {
        id: "slide-a4-3",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "F — Enquadramento: Como a imagem é composta" },
          {
            type: "text",
            text: "O Enquadramento define como a imagem será composta: formato, plano, ângulo de câmera, tipo de lente e posição do sujeito na composição.",
          },
          {
            type: "mind-map",
            title: "Enquadramento",
            branches: [
              {
                label: "Formato",
                children: ["Vertical (4:5, 9:16)", "Horizontal (16:9)", "Quadrado (1:1)"],
              },
              {
                label: "Plano",
                children: ["Fechado (rosto)", "Médio (cintura para cima)", "Corpo inteiro"],
              },
              {
                label: "Ângulo & lente",
                children: ["Altura dos olhos", "Levemente abaixo", "Lente 35 mm / 50 mm"],
              },
            ],
          },
          {
            type: "example",
            label: "Sem enquadramento × Com enquadramento",
            before: "Uma câmera apontada para o homem.",
            after:
              "Formato vertical 4:5, plano médio, câmera levemente abaixo da linha dos olhos, composição centralizada, lente 50 mm, fundo levemente desfocado.",
          },
          {
            type: "tip",
            text: "O Enquadramento não muda o que está na cena — muda como a cena é mostrada. Combine-o sempre com um bom Sujeito e Atributos.",
          },
        ],
      },
    ],
    // Módulo 4 — E: Ambiente
    [
      {
        id: "slide-a4-4",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "E — Ambiente: Onde e sob qual luz" },
          {
            type: "text",
            text: "O Ambiente define o local, o horário, a iluminação e a atmosfera emocional da cena. É o elemento que mais influencia o clima e a sensação transmitida pela imagem.",
          },
          {
            type: "mind-map",
            title: "Ambiente",
            branches: [
              { label: "Local", children: ["Onde a cena acontece", "Interno ou externo"] },
              { label: "Iluminação", children: ["Horário do dia", "Tipo de luz"] },
              { label: "Atmosfera", children: ["Clima emocional", "Fundo limpo ou detalhado"] },
            ],
          },
          {
            type: "example",
            label: "Ambiente vago × Ambiente descrito",
            before: "Em um escritório.",
            after:
              "Escritório moderno durante a noite, iluminação ambiente azul e roxa, monitores ligados ao fundo, atmosfera tecnológica e premium.",
          },
          {
            type: "tip",
            text: "Palavras úteis de iluminação: luz dourada de início de dia, luz suave de estúdio, iluminação cinematográfica, luz natural pela janela, neon discreto, contraluz suave, iluminação volumétrica.",
          },
        ],
      },
    ],
    // Módulo 5 — Restrições negativas (a 5ª regra)
    [
      {
        id: "slide-a4-5",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Restrições — A 5ª Regra da Técnica SAFE" },
          {
            type: "text",
            text: "Além de Sujeito, Atributos, Enquadramento e Ambiente, todo prompt SAFE completo termina com Restrições: o que NÃO deve aparecer na imagem. Elas funcionam como uma rede de segurança contra erros técnicos comuns de modelos de geração de imagem.",
          },
          {
            type: "mind-map",
            title: "Restrições comuns",
            branches: [
              {
                label: "Elementos indesejados",
                children: ["Sem texto", "Sem logotipos", "Sem elementos extras"],
              },
              {
                label: "Erros técnicos",
                children: ["Sem artefatos", "Sem distorções", "Mãos anatômicas corretas"],
              },
              { label: "Aparência", children: ["Sem pele artificial", "Sem aparência de boneco"] },
            ],
          },
          {
            type: "example",
            label: "Sem restrições × Com restrições",
            before: "Homem sentado em uma cafeteria, foto realista.",
            after:
              "Homem sentado em uma cafeteria, foto realista. Sem texto, sem logotipos, sem distorções, sem artefatos, mãos anatômicas corretas, alta definição.",
          },
          {
            type: "tip",
            text: "Restrições não substituem um bom Sujeito, Atributos, Enquadramento e Ambiente — elas apenas evitam erros técnicos comuns da IA, como dedos deformados ou texto inventado.",
          },
        ],
      },
    ],
    // Módulo 6 — Prova final
    [
      {
        id: "slide-a4-6",
        type: "content-slide",
        blocks: [
          { type: "heading", text: "Prova Final — Aplicando as 5 Regras de Uma Vez" },
          {
            type: "text",
            text: "Chegou a hora de juntar tudo. Nesta prova dissertativa, você vai escrever três prompts completos aplicando as 5 regras da técnica SAFE: Sujeito, Atributos, Enquadramento, Ambiente e Restrições — para uma foto profissional, uma divulgação de produto digital e um asset de interface.",
          },
          {
            type: "mind-map",
            title: "Critérios de avaliação",
            branches: [
              { label: "Conteúdo", children: ["Clareza do sujeito", "Riqueza dos atributos"] },
              {
                label: "Composição",
                children: ["Precisão do enquadramento", "Qualidade da descrição do ambiente"],
              },
              {
                label: "Consistência",
                children: [
                  "Coerência visual",
                  "Ausência de contradições",
                  "Uso correto de restrições negativas",
                ],
              },
            ],
          },
          {
            type: "quote",
            text: '"Quanto mais claro o prompt, maior o controle sobre o resultado gerado pela IA."',
          },
          {
            type: "tip",
            text: "Não corra para o prompt final — escreva primeiro cada regra separadamente (S, A, F, E, Restrições) e só depois junte tudo em um único parágrafo coeso.",
          },
        ],
      },
    ],
  ],
}

export function getActivities(track: TrackId, moduleIndex: number): LessonActivity[] {
  const set = LESSONS[track]?.[moduleIndex]
  const activities = set && set.length > 0 ? set : DEFAULT_QUESTIONS
  const slides = SLIDE_CONTENT[track]?.[moduleIndex] ?? []
  return [...slides, ...activities]
}

/** @deprecated Use getActivities instead */
export function getQuestions(track: TrackId, moduleIndex: number): LessonActivity[] {
  return getActivities(track, moduleIndex)
}

// Total de módulos por trilha (sincronizado com TRACKS em learn.tsx)
export const TRACK_TOTALS: Record<TrackId, number> = {
  a1: 7,
  a2: 9,
  a3: 21,
  a4: 7,
}

// --- Tarefa prática (envio de print) ---
// Módulos em que a aula exige uma comprovação visual (screenshot) além do quiz.
export type ProofTask = {
  title: string
  description: string
  examples: string[]
}

export const PROOF_TASKS: Partial<Record<TrackId, Record<number, ProofTask>>> = {
  a3: {
    7: {
      title: "Mostre um agente (Agent) em ação",
      description:
        "Envie um print de um agente (Agent) executando uma tarefa real (Claude Code, Cursor, ChatGPT Agents, Lovable, n8n etc.) — algo que mostre o agente decidindo passos ou chamando uma ferramenta (tool).",
      examples: [
        "Terminal do Claude Code rodando um plano",
        "Registro (log) do n8n com nós (nodes) de IA",
        "Tela do Cursor em modo Agente (Agent)",
      ],
    },
    8: {
      title: "Sua chamada via OpenRouter",
      description:
        "Envie um print do OpenRouter — Área de testes (Playground), Atividade (Activity), página de Modelos (Models) — ou do código fazendo uma requisição para openrouter.ai/api.",
      examples: [
        "Área de testes (Playground) respondendo",
        "Painel (dashboard) de uso",
        "Trecho de código com URL base (baseURL) openrouter.ai",
      ],
    },
    9: {
      title: "Seu modelo local (Local Model) rodando",
      description:
        "Envie um print de um modelo de linguagem (LLM) respondendo localmente — Ollama, LM Studio, llama.cpp, Jan, GPT4All ou similar.",
      examples: [
        "Saída de `ollama run llama3`",
        "LM Studio com chat respondendo",
        "Terminal mostrando o modelo carregado",
      ],
    },
    10: {
      title: "Claude Code em execução",
      description:
        "Envie um print do Claude Code rodando no seu terminal — pode ser iniciando uma sessão, executando /init, propondo alterações (diff) ou completando uma tarefa.",
      examples: [
        "Tela de boas-vindas do Claude Code",
        "Alterações propostas (diff) antes de aceitar",
        "Conclusão de uma tarefa",
      ],
    },
    11: {
      title: "Uma habilidade (Skill) instalada no Claude Code",
      description:
        "Envie um print mostrando uma habilidade (Skill) instalada/ativada — pode ser a saída do comando que ativa a skill, a estrutura de pastas .claude/skills ou .workspace/skills, ou o Claude usando a skill em uma resposta.",
      examples: [
        "Listagem de .claude/skills/",
        "Mensagem 'Used the X skill' (Habilidade X usada)",
        "SKILL.md aberto no editor",
      ],
    },
    12: {
      title: "Modelo (Template) personalizado por você",
      description:
        "Envie um print do modelo (Template) antes/depois da sua personalização — variáveis trocadas, blocos adaptados ao seu caso — ou da IA respondendo com o template customizado.",
      examples: [
        "Diferenças (diff) do template antes/depois",
        "Prompt final no ChatGPT/Claude",
        "Variáveis preenchidas para o seu cenário",
      ],
    },
  },
}

export function getProofTask(track: TrackId, moduleIndex: number): ProofTask | null {
  return PROOF_TASKS[track]?.[moduleIndex] ?? null
}
