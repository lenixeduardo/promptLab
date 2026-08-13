/**
 * @deprecated Content is now served from Supabase. Kept as offline fallback only.
 */

export type SkillDifficulty = "Iniciante" | "Intermediario" | "Avancado"

export interface TrailSkill {
  id: string
  name: string
  description: string
  icon: string
  level: number
  xp: number
  difficulty: SkillDifficulty
}

export interface TrailCategorySkills {
  categoryId: string
  label: string
  icon: string
  skills: TrailSkill[]
}

export const TRAIL_CATEGORY_SKILLS: TrailCategorySkills[] = [
  {
    categoryId: "criatividade",
    label: "Criatividade",
    icon: "Lightbulb",
    skills: [
      {
        id: "geracao-ideias",
        name: "Geração de Ideias",
        description: "Gere muitas ideias relevantes para qualquer tema.",
        icon: "Lightbulb",
        level: 1,
        xp: 100,
        difficulty: "Iniciante",
      },
      {
        id: "variacoes-criativas",
        name: "Variações Criativas",
        description: "Transforme uma ideia em diferentes abordagens únicas.",
        icon: "Lightbulb",
        level: 2,
        xp: 150,
        difficulty: "Iniciante",
      },
      {
        id: "analogias-metaforas",
        name: "Analogias e Metáforas",
        description: "Use analogias para explicar conceitos com clareza.",
        icon: "Star",
        level: 2,
        xp: 150,
        difficulty: "Iniciante",
      },
      {
        id: "narrativas-historias",
        name: "Narrativas e Histórias",
        description: "Crie histórias envolventes e contextos ricos.",
        icon: "BookOpen",
        level: 3,
        xp: 200,
        difficulty: "Intermediario",
      },
      {
        id: "brainstorm-avancado",
        name: "Brainstorm Avançado",
        description: "Combine técnicas para gerar ideias disruptivas.",
        icon: "Zap",
        level: 3,
        xp: 200,
        difficulty: "Intermediario",
      },
      {
        id: "perspectivas",
        name: "Perspectivas Inovadoras",
        description: "Olhe para o problema por ângulos inesperados.",
        icon: "Eye",
        level: 4,
        xp: 250,
        difficulty: "Avancado",
      },
    ],
  },
  {
    categoryId: "prompt-engineering",
    label: "Engenharia de Prompts",
    icon: "Sparkles",
    skills: [
      {
        id: "estrutura-basica",
        name: "Estrutura Básica",
        description: "Monte prompts claros com contexto, tarefa e formato.",
        icon: "ListChecks",
        level: 1,
        xp: 100,
        difficulty: "Iniciante",
      },
      {
        id: "contexto-papel",
        name: "Contexto e Papel",
        description: "Defina personas e contextos para respostas mais precisas.",
        icon: "User",
        level: 2,
        xp: 150,
        difficulty: "Iniciante",
      },
      {
        id: "cadeia-pensamento",
        name: "Cadeia de Pensamento",
        description: "Induza o modelo a raciocinar passo a passo.",
        icon: "Brain",
        level: 3,
        xp: 200,
        difficulty: "Intermediario",
      },
      {
        id: "few-shot",
        name: "Few-Shot Learning",
        description: "Use exemplos no prompt para calibrar o comportamento.",
        icon: "BookOpen",
        level: 3,
        xp: 200,
        difficulty: "Intermediario",
      },
      {
        id: "prompt-chaining",
        name: "Prompt Chaining",
        description: "Encadeie prompts para resolver tarefas complexas.",
        icon: "Workflow",
        level: 4,
        xp: 250,
        difficulty: "Avancado",
      },
      {
        id: "auto-refinamento",
        name: "Auto-Refinamento",
        description: "Faça o modelo revisar e melhorar suas próprias saídas.",
        icon: "RefreshCw",
        level: 4,
        xp: 300,
        difficulty: "Avancado",
      },
    ],
  },
  {
    categoryId: "marketing",
    label: "Marketing",
    icon: "Megaphone",
    skills: [
      {
        id: "copy-basico",
        name: "Copywriting Básico",
        description: "Escreva textos persuasivos para produtos e serviços.",
        icon: "PenLine",
        level: 1,
        xp: 100,
        difficulty: "Iniciante",
      },
      {
        id: "headlines",
        name: "Headlines de Impacto",
        description: "Crie títulos que capturam atenção imediatamente.",
        icon: "Target",
        level: 2,
        xp: 150,
        difficulty: "Iniciante",
      },
      {
        id: "email-marketing",
        name: "Email Marketing",
        description: "Estruture campanhas de email com alta taxa de abertura.",
        icon: "MessageSquare",
        level: 3,
        xp: 200,
        difficulty: "Intermediario",
      },
      {
        id: "funil-conteudo",
        name: "Funil de Conteúdo",
        description: "Produza conteúdo para cada etapa da jornada do cliente.",
        icon: "TrendingUp",
        level: 4,
        xp: 250,
        difficulty: "Avancado",
      },
    ],
  },
  {
    categoryId: "analise-dados",
    label: "Análise de Dados",
    icon: "BarChart3",
    skills: [
      {
        id: "descricao-dados",
        name: "Descrição de Dados",
        description: "Resuma conjuntos de dados em linguagem natural.",
        icon: "BarChart3",
        level: 1,
        xp: 100,
        difficulty: "Iniciante",
      },
      {
        id: "visualizacao",
        name: "Visualizações",
        description: "Escolha e descreva gráficos adequados para cada dado.",
        icon: "LineChart",
        level: 2,
        xp: 150,
        difficulty: "Iniciante",
      },
      {
        id: "insights",
        name: "Extração de Insights",
        description: "Identifique padrões e anomalias em relatórios.",
        icon: "Eye",
        level: 3,
        xp: 200,
        difficulty: "Intermediario",
      },
      {
        id: "sql-prompts",
        name: "SQL com IA",
        description: "Gere e explique queries SQL complexas via prompts.",
        icon: "Database",
        level: 4,
        xp: 250,
        difficulty: "Avancado",
      },
    ],
  },
]
