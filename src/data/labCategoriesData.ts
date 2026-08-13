/**
 * @deprecated Content is now served from Supabase. Kept as offline fallback only.
 */

export interface LabCategory {
  id: string
  label: string
  icon: string
  promptCount: number
}

export const LAB_CATEGORIES: LabCategory[] = [
  { id: "Criatividade", label: "Criatividade", icon: "Lightbulb", promptCount: 12 },
  { id: "Marketing", label: "Marketing", icon: "Megaphone", promptCount: 15 },
  { id: "Programacao", label: "Programação", icon: "Code2", promptCount: 18 },
  { id: "Educacao", label: "Educação", icon: "Apple", promptCount: 14 },
  { id: "Produtividade", label: "Produtividade", icon: "ClipboardList", promptCount: 16 },
  { id: "Analise", label: "Análise de Dados", icon: "BarChart3", promptCount: 12 },
  { id: "Comunicacao", label: "Comunicação", icon: "MessageSquare", promptCount: 15 },
  { id: "Automacao", label: "Automação", icon: "Settings", promptCount: 11 },
  { id: "Negocios", label: "Negócios", icon: "Briefcase", promptCount: 13 },
  { id: "Design", label: "Design", icon: "Palette", promptCount: 17 },
  { id: "Suporte", label: "Suporte ao\nCliente", icon: "Headphones", promptCount: 10 },
  { id: "RH", label: "Recursos\nHumanos", icon: "Users", promptCount: 9 },
  { id: "Gestao de Produto", label: "Gestão de\nProduto", icon: "Briefcase", promptCount: 22 },
]

export const PROMPT_OF_THE_DAY = {
  title: "Análise SWOT Inteligente",
  description: "Gere uma análise SWOT completa para seu negócio com insights acionáveis.",
  categoryId: "Negocios",
}
