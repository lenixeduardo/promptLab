export interface TemplateStats {
  icon: string
  value: string
  label: string
}

export type TemplateCategory =
  "Paginas Web" | "Dashboards" | "Relatorios" | "Planilhas" | "Apresentacoes"

export interface Template {
  id: string
  name: string
  description: string
  category: TemplateCategory
  isPremium: boolean
  usageCount: number
  icon: string
  previewColor: string
  featured: boolean
  headline: string
  subheadline: string
  about: string
  tags: string[]
  stats: TemplateStats[]
  promptId: string
  webSections: string[]
  promptContent: string
  resultScore: number
}

export const TEMPLATE_CATEGORIES: { id: string; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "Paginas Web", label: "Páginas Web" },
  { id: "Dashboards", label: "Dashboards" },
  { id: "Relatorios", label: "Relatórios" },
  { id: "Planilhas", label: "Planilhas" },
  { id: "Apresentacoes", label: "Apresentações" },
]

export const TEMPLATES: Template[] = [
  {
    id: "1",
    name: "Landing Page SaaS",
    description: "Landing page moderna para sua startup converter visitantes em clientes.",
    category: "Paginas Web",
    isPremium: false,
    usageCount: 5200,
    icon: "Globe",
    previewColor: "#1E3A5F",
    featured: true,
    headline: "Sua startup merece ir além.",
    subheadline: "Templates de copy otimizados para converter visitantes em clientes pagantes.",
    about:
      "Este template foi desenvolvido especificamente para startups em fase de crescimento que precisam de uma landing page de alta conversão. Baseado nas melhores práticas de copywriting para SaaS, ele inclui todos os elementos essenciais para convencer seu visitante a tomar uma ação.\n\nO prompt guia a IA para criar copy com foco em benefícios claros, prova social convincente e chamadas para ação irresistíveis — tudo alinhado com o estágio e público-alvo do seu produto.",
    tags: ["Copywriting", "Builder", "Design/Layout", "Conversão"],
    stats: [
      { icon: "TrendingUp", value: "5.000+", label: "Prompts" },
      { icon: "Users", value: "2.1k", label: "Usuários" },
    ],
    promptId: "1",
    webSections: [
      "Hero Section",
      "Benefícios",
      "Como Funciona",
      "Depoimentos",
      "Preços",
      "FAQ",
      "CTA Final",
    ],
    promptContent:
      "Você é um especialista em copywriting para SaaS. Crie uma landing page completa para [PRODUTO], focada em conversão para [PÚBLICO-ALVO]. Inclua headline, benefícios, prova social e CTA persuasivo. Tom: [FORMAL/CASUAL].",
    resultScore: 92,
  },
  {
    id: "2",
    name: "Dashboard Financeiro",
    description: "Dashboard completo para gestão financeira pessoal e empresarial.",
    category: "Dashboards",
    isPremium: true,
    usageCount: 3800,
    icon: "BarChart3",
    previewColor: "#1A4A3E",
    featured: true,
    headline: "Controle total do seu dinheiro.",
    subheadline:
      "Dashboard interativo para visualizar receitas, despesas e investimentos em tempo real.",
    about:
      "Template profissional para gestão financeira com visão consolidada de entradas, saídas, metas e projeções. Ideal para freelancers, PJs e pequenos empreendedores que precisam de controle real sobre suas finanças.",
    tags: ["Finanças", "Gestão", "Analytics", "Planilha"],
    stats: [
      { icon: "TrendingUp", value: "3.800+", label: "Usuários" },
      { icon: "BarChart3", value: "98%", label: "Satisfação" },
    ],
    promptId: "2",
    webSections: [
      "Visão Geral",
      "Receitas",
      "Despesas",
      "Investimentos",
      "Metas",
      "Relatórios",
      "Configurações",
    ],
    promptContent:
      "Você é um especialista em finanças pessoais e design de dashboards. Crie um dashboard financeiro completo para [PERFIL] (freelancer/empresa/pessoa física). Inclua visão de receitas, despesas, saldo, metas e projeções para [PERÍODO].",
    resultScore: 88,
  },
  {
    id: "3",
    name: "Planner Semanal",
    description: "Organize sua semana e aumente sua produtividade com metas claras.",
    category: "Planilhas",
    isPremium: false,
    usageCount: 4100,
    icon: "ClipboardList",
    previewColor: "#3D1A5F",
    featured: true,
    headline: "Semana organizada, resultados garantidos.",
    subheadline:
      "Planner visual e interativo para planejar suas tarefas, hábitos e metas semanais.",
    about:
      "Organize sua semana de forma visual e eficiente. Este planner foi criado para quem quer sair do caos e entrar em modo de alta performance com uma ferramenta simples e poderosa.",
    tags: ["Produtividade", "Organização", "Hábitos", "Planejamento"],
    stats: [
      { icon: "Zap", value: "4.1k", label: "Usuários" },
      { icon: "TrendingUp", value: "4.9", label: "Avaliação" },
    ],
    promptId: "3",
    webSections: [
      "Visão da Semana",
      "Tarefas do Dia",
      "Acompanhamento de Hábitos",
      "Metas Semanais",
      "Prioridades",
      "Retrospectiva",
      "Notas",
    ],
    promptContent:
      "Você é um coach de produtividade. Crie um planner semanal completo para [PERFIL DE USUÁRIO]. Organize as tarefas por prioridade, inclua acompanhamento de hábitos e espaço para reflexão diária. Foco: [ÁREA: trabalho/estudos/pessoal].",
    resultScore: 90,
  },
  {
    id: "4",
    name: "Agenda Online",
    description: "Gerencie agendamentos e reuniões de forma simples e eficaz.",
    category: "Planilhas",
    isPremium: false,
    usageCount: 12400,
    icon: "Calendar",
    previewColor: "#1F3A5F",
    featured: false,
    headline: "Nunca mais perca um compromisso.",
    subheadline: "Sistema de agenda completo para gerenciar reuniões, tarefas e compromissos.",
    about:
      "Template de agenda online completo com visão diária, semanal e mensal. Perfeito para profissionais que precisam organizar clientes, reuniões e prazos de forma clara.",
    tags: ["Agenda", "Produtividade", "Gestão de Tempo", "Reuniões"],
    stats: [
      { icon: "Users", value: "12.4k", label: "Usuários" },
      { icon: "TrendingUp", value: "4.8", label: "Avaliação" },
    ],
    promptId: "4",
    webSections: [
      "Calendário Mensal",
      "Visão Diária",
      "Visão Semanal",
      "Compromissos",
      "Contatos",
      "Lembretes",
      "Configurações",
    ],
    promptContent:
      "Você é um assistente de organização pessoal. Crie um sistema de agenda completo para [PROFISSÃO]. Estruture compromissos por categoria, defina lembretes automáticos e integre com lista de contatos. Contexto: [VOLUME DE COMPROMISSOS/dia].",
    resultScore: 85,
  },
  {
    id: "5",
    name: "E-commerce Completo",
    description: "Loja virtual completa com carrinho e checkout integrado.",
    category: "Paginas Web",
    isPremium: true,
    usageCount: 8700,
    icon: "Briefcase",
    previewColor: "#3A1A1A",
    featured: false,
    headline: "Sua loja online do jeito certo.",
    subheadline: "Template completo para e-commerce com listagem de produtos, carrinho e checkout.",
    about:
      "Solução completa para quem quer montar uma loja virtual profissional rapidamente. Inclui páginas de produto, listagem por categoria, carrinho de compras e fluxo de checkout otimizado para conversão.",
    tags: ["E-commerce", "Vendas", "Design/Layout", "Conversão"],
    stats: [
      { icon: "TrendingUp", value: "8.7k", label: "Usuários" },
      { icon: "Users", value: "35%", label: "↑ Conversão" },
    ],
    promptId: "5",
    webSections: [
      "Home / Vitrine",
      "Listagem de Produtos",
      "Página do Produto",
      "Carrinho",
      "Checkout",
      "Confirmação do Pedido",
      "Área do Cliente",
    ],
    promptContent:
      "Você é um especialista em UX de e-commerce e copywriting de vendas. Crie o conteúdo completo para uma loja virtual de [NICHO/PRODUTO]. Inclua descrições de produto, página de categoria, processo de checkout e e-mails transacionais. Público: [PÚBLICO-ALVO].",
    resultScore: 94,
  },
  {
    id: "6",
    name: "Faturamento Simples",
    description: "Sistema de faturamento e controle de clientes simplificado.",
    category: "Planilhas",
    isPremium: true,
    usageCount: 5200,
    icon: "Settings",
    previewColor: "#1A3A3A",
    featured: false,
    headline: "Fature mais, preocupe-se menos.",
    subheadline:
      "Template de faturamento profissional com emissão de notas e controle de recebimentos.",
    about:
      "Simplifique seu processo de faturamento com este template completo. Ideal para freelancers, consultores e pequenas empresas que precisam de controle financeiro sem complicação.",
    tags: ["Finanças", "Faturamento", "Freelancer", "Gestão"],
    stats: [
      { icon: "TrendingUp", value: "5.2k", label: "Usuários" },
      { icon: "Users", value: "100%", label: "Profissional" },
    ],
    promptId: "6",
    webSections: [
      "Painel Principal",
      "Clientes",
      "Serviços",
      "Notas Fiscais",
      "Recebimentos",
      "Relatório Mensal",
      "Configurações",
    ],
    promptContent:
      "Você é um especialista em gestão financeira para autônomos. Crie um sistema de faturamento simplificado para [PROFISSÃO/SERVIÇO]. Inclua emissão de notas, controle de recebimentos pendentes e relatório mensal. Volume estimado: [X clientes/mês].",
    resultScore: 87,
  },
  {
    id: "7",
    name: "Plataforma de Cursos",
    description: "Plataforma para cursos online e gestão de alunos.",
    category: "Paginas Web",
    isPremium: false,
    usageCount: 4100,
    icon: "Lightbulb",
    previewColor: "#2A1A4A",
    featured: false,
    headline: "Ensine o mundo.",
    subheadline:
      "Template completo para criar e vender cursos online com área de alunos integrada.",
    about:
      "Crie sua plataforma de cursos online com este template completo. Inclui página inicial, listagem de cursos, área do aluno, progresso e certificados.",
    tags: ["Educação", "Cursos", "E-learning", "Plataforma"],
    stats: [
      { icon: "Users", value: "4.1k", label: "Usuários" },
      { icon: "TrendingUp", value: "50k", label: "Alunos" },
    ],
    promptId: "7",
    webSections: [
      "Página Inicial",
      "Catálogo de Cursos",
      "Página do Curso",
      "Área do Aluno",
      "Progresso",
      "Certificados",
      "Suporte",
    ],
    promptContent:
      "Você é um especialista em educação online e design instrucional. Crie o conteúdo completo para uma plataforma de cursos sobre [TEMA]. Inclua apresentação do curso, módulos, área do aluno e landing page de vendas. Público-alvo: [PERFIL DO ALUNO].",
    resultScore: 91,
  },
  {
    id: "8",
    name: "Relatório de Vendas",
    description: "Análise detalhada do desempenho de vendas mensal.",
    category: "Relatorios",
    isPremium: true,
    usageCount: 3200,
    icon: "BarChart3",
    previewColor: "#1A2A3A",
    featured: false,
    headline: "Decisões baseadas em dados.",
    subheadline:
      "Template profissional de relatório de vendas com métricas, gráficos e análise de tendências.",
    about:
      "Relatório completo de performance de vendas com análise mensal, comparação com períodos anteriores, top produtos e projeções para o próximo ciclo.",
    tags: ["Vendas", "Analytics", "Relatório", "Métricas"],
    stats: [
      { icon: "TrendingUp", value: "3.2k", label: "Usuários" },
      { icon: "BarChart3", value: "99%", label: "Precisão" },
    ],
    promptId: "8",
    webSections: [
      "Resumo Executivo",
      "Performance Mensal",
      "Top Produtos",
      "Vendas por Canal",
      "Comparativo de Período",
      "Projeções",
      "Ações Recomendadas",
    ],
    promptContent:
      "Você é um analista de vendas sênior. Crie um relatório completo de performance de vendas para [EMPRESA/SETOR] referente a [PERÍODO]. Inclua métricas principais, análise de tendências, comparativo com período anterior e recomendações estratégicas.",
    resultScore: 96,
  },
  {
    id: "9",
    name: "Planner Semanal Minimalista",
    description: "Planejamento visual da semana com foco em tarefas e prioridades claras.",
    category: "Planilhas",
    isPremium: false,
    usageCount: 7400,
    icon: "CalendarDays",
    previewColor: "#2E1A3A",
    featured: true,
    headline: "Semana organizada, resultados garantidos.",
    subheadline:
      "Template limpo para organizar a semana por prioridades, bloqueios de tempo e follow-ups.",
    about:
      "Planner semanal minimalista para quem quer clareza sem ruídos. Inclui visão geral da semana, top 3 prioridades, blocos de foco, follow-ups e retrospectiva.",
    tags: ["Produtividade", "Planejamento", "Semanal", "Foco"],
    stats: [
      { icon: "TrendingUp", value: "7.4k", label: "Usuários" },
      { icon: "Zap", value: "4.9", label: "Avaliação" },
    ],
    promptId: "new-planner-week",
    webSections: [
      "Visão Semanal",
      "Top 3 Prioridades",
      "Segunda a Sexta",
      "Follow-ups",
      "Hábitos Leves",
      "Retrospectiva",
    ],
    promptContent:
      "Você é um coach de produtividade. Crie um planner semanal minimalista para [PERFIL]. Estruture com top 3 prioridades, blocos de foco, follow-ups e uma retrospectiva simples. Foco: [trabalho/estudos/pessoal].",
    resultScore: 92,
  },
  {
    id: "10",
    name: "Planejador de Conteúdo Mensal",
    description: "Calendário mensal de conteúdo com formatos, canais e objetivo por publicação.",
    category: "Planilhas",
    isPremium: false,
    usageCount: 6800,
    icon: "Calendar",
    previewColor: "#3A2020",
    featured: true,
    headline: "Conteúdo consistente, sem ansiedade.",
    subheadline:
      "Template mensal para planejar posts, reels, newsletters e campanhas com linhagem narrativa.",
    about:
      "Organize o conteúdo do mês antecipadamente com datas, responsáveis e objetivo. O template ajuda a equilibrar educação, entretenimento e conversão.",
    tags: ["Conteúdo", "Social Media", "Planejamento", "Mensal"],
    stats: [
      { icon: "TrendingUp", value: "6.8k", label: "Usuários" },
      { icon: "Users", value: "12.4k", label: "Usuários" },
    ],
    promptId: "new-planner-content",
    webSections: [
      "Objetivo do Mês",
      "Datas Oportunistas",
      "Calendário por Semana",
      "Formatos",
      "Roda de Conteúdo",
      "Checklist de Aprovação",
      "Métricas",
    ],
    promptContent:
      "Você é um estrategista de conteúdo. Crie um planejador de conteúdo mensal para [NICHO/MARCA]. Inclua datas oportunistas, rodízio de formatos, responsáveis e objetivo por publicação.",
    resultScore: 91,
  },
  {
    id: "11",
    name: "Planejador de Projeto",
    description: "Controle de projeto com marcos, riscos e ações definidas por semana.",
    category: "Planilhas",
    isPremium: true,
    usageCount: 5100,
    icon: "ClipboardList",
    previewColor: "#12313A",
    featured: false,
    headline: "Do roadmap à execução.",
    subheadline:
      "Template para gerenciar projetos com marcos claros, riscos mapeados e check-in semanal.",
    about:
      "Template de gerenciamento de projetos com visão de objetivo, marcos, backlog priorizado, riscos, actions owners e status report.",
    tags: ["Projetos", "Gestão", "Roadmap", "PM"],
    stats: [
      { icon: "TrendingUp", value: "5.1k", label: "Usuários" },
      { icon: "BarChart3", value: "93%", label: "Sucesso" },
    ],
    promptId: "new-planner-project",
    webSections: [
      "Objetivo",
      "Marco Principal",
      "Backlog",
      "Marcos por Semana",
      "Riscos",
      "Ações por Responsável",
      "Indicadores",
    ],
    promptContent:
      "Você é um gerente de projetos. Crie um planejador de projeto para [PROJETO]. Inclua objetivo, marcos, backlog priorizado, riscos e ações com responsáveis. Contexto: [prazo/equipe/restrições].",
    resultScore: 94,
  },
  {
    id: "12",
    name: "Diário de Estudos",
    description: "Rotina diária de estudos com revisão espaçada e metas de aprendizado.",
    category: "Planilhas",
    isPremium: false,
    usageCount: 8900,
    icon: "BookOpen",
    previewColor: "#1F2A3A",
    featured: true,
    headline: "Estude menos, aprenda mais.",
    subheadline:
      "Planejador diário de estudos com sessões curtas, revisão espaçada e acompanhamento de desempenho.",
    about:
      "Transforme o estudo em um sistema repetível com foco em concentração, revisão e checagem de evolução.",
    tags: ["Estudos", "Aprendizado", "Rotina", "Foco"],
    stats: [
      { icon: "Users", value: "8.9k", label: "Usuários" },
      { icon: "TrendingUp", value: "4.8", label: "Avaliação" },
    ],
    promptId: "new-planner-study",
    webSections: [
      "Meta da Semana",
      "Segunda a Sexta",
      "Técnica de Estudo",
      "Revisão Espaçada",
      "Flashcards",
      "Check-in",
      "Reflexão",
    ],
    promptContent:
      "Você é um mentor de estudos. Crie um diário de estudos para [OBJETIVO] no período de [PRAZO]. Estruture sessões curtas, revisão espaçada e indicadores de evolução.",
    resultScore: 93,
  },
]
