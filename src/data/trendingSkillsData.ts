/**
 * @deprecated Content is now served from Supabase. Kept as offline fallback only.
 */

export interface TrendingSkill {
  name: string
  description: string
  category: SkillCategory
  author: string
  installs: string
  installsCount: number
  tags: string[]
  icon: string
}

export type SkillCategory =
  | "Desenvolvimento"
  | "Design & UI"
  | "IA & Media"
  | "Cloud & Infra"
  | "Marketing"
  | "Produtividade"
  | "Agentes & Workflows"

export const TRENDING_SKILLS: TrendingSkill[] = [
  // ── Desenvolvimento ────────────────────────────────────────────────────
  {
    name: "Test-Driven Development (TDD)",
    description:
      "Implementa o ciclo red-green-refactor para desenvolvimento orientado a testes. Escreva o teste primeiro, depois o código mínimo para passar, e refatore com segurança.",
    category: "Desenvolvimento",
    author: "mattpocock",
    installs: "145K",
    installsCount: 145000,
    tags: ["testing", "tdd", "quality"],
    icon: "CheckSquare",
  },
  {
    name: "Diagnose (Debugging)",
    description:
      "Loop disciplinado de diagnóstico: reproduzir → minimizar → hipotetizar → instrumentar → corrigir → testar regressão. Caça a bugs sistemática.",
    category: "Desenvolvimento",
    author: "mattpocock",
    installs: "132K",
    installsCount: 132000,
    tags: ["debugging", "diagnosis", "bug-hunting"],
    icon: "Bug",
  },
  {
    name: "Improve Codebase Architecture",
    description:
      "Identifica oportunidades de refatoração guiadas pela linguagem de domínio e padrões de projeto. Remove acoplamento e melhora coesão.",
    category: "Desenvolvimento",
    author: "mattpocock",
    installs: "98K",
    installsCount: 98000,
    tags: ["architecture", "refactoring", "clean-code"],
    icon: "Building2",
  },
  {
    name: "Vercel React Best Practices",
    description:
      "Padrões e boas práticas para React no ecossistema Vercel: Server Components, Data Fetching, Streaming, Edge Runtime, Core Web Vitals.",
    category: "Desenvolvimento",
    author: "vercel-labs",
    installs: "312K",
    installsCount: 312000,
    tags: ["react", "vercel", "frontend", "best-practices"],
    icon: "Globe",
  },
  {
    name: "Next.js Best Practices",
    description:
      "Boas práticas para Next.js App Router, caching, Server Components, metadados, middleware e otimização de imagens.",
    category: "Desenvolvimento",
    author: "vercel-labs",
    installs: "298K",
    installsCount: 298000,
    tags: ["nextjs", "react", "ssr", "app-router"],
    icon: "FileJson",
  },
  {
    name: "Supabase + PostgreSQL Best Practices",
    description:
      "Design de esquemas, Row-Level Security, real-time subscriptions, Edge Functions e estratégias de migração para Supabase.",
    category: "Desenvolvimento",
    author: "supabase",
    installs: "187K",
    installsCount: 187000,
    tags: ["database", "postgres", "supabase", "backend"],
    icon: "Database",
  },
  {
    name: "Web App Testing",
    description:
      "Testes com Vitest, React Testing Library e Playwright. Cobertura de testes unitários, de componente e E2E com acessibilidade.",
    category: "Desenvolvimento",
    author: "anthropics",
    installs: "156K",
    installsCount: 156000,
    tags: ["testing", "playwright", "vitest", "e2e"],
    icon: "ShieldCheck",
  },
  {
    name: "Skill Creator",
    description:
      "Cria novas skills para agentes de IA com estrutura padronizada, frontmatter validação e diretrizes de publicação.",
    category: "Desenvolvimento",
    author: "anthropics",
    installs: "89K",
    installsCount: 89000,
    tags: ["skill-creation", "agents", "tooling"],
    icon: "Wand2",
  },

  // ── Design & UI ────────────────────────────────────────────────────────
  {
    name: "High-End Visual Design",
    description:
      "Define fontes, espaçamentos, sombras e animações exatas que fazem um site parecer caro e premium. Bloqueia padrões genéricos de IA.",
    category: "Design & UI",
    author: "leonxlnx",
    installs: "234K",
    installsCount: 234000,
    tags: ["design", "visual", "premium", "ui"],
    icon: "Palette",
  },
  {
    name: "Design Taste — Frontend",
    description:
      "Skill anti-slop para landing pages, portfólios e redesigns. Interfaces que não parecem template. Audit-first, strict pre-flight check.",
    category: "Design & UI",
    author: "leonxlnx",
    installs: "198K",
    installsCount: 198000,
    tags: ["frontend", "design-system", "taste"],
    icon: "Paintbrush",
  },
  {
    name: "Image to Code",
    description:
      "Gera imagens de design seção por seção, analisa composição e implementa o site correspondente com alta fidelidade visual.",
    category: "Design & UI",
    author: "leonxlnx",
    installs: "167K",
    installsCount: 167000,
    tags: ["design-to-code", "frontend", "implementation"],
    icon: "Monitor",
  },
  {
    name: "Brand Kit",
    description:
      "Criação de brand-guidelines boards, sistemas de logo, identity decks e apresentações visuais para marcas premium.",
    category: "Design & UI",
    author: "leonxlnx",
    installs: "145K",
    installsCount: 145000,
    tags: ["branding", "identity", "logo", "guidelines"],
    icon: "Trophy",
  },
  {
    name: "Frontend Design",
    description:
      "Diretrizes de design e implementação para aplicações web modernas: componentes, responsividade, acessibilidade e sistemas de design.",
    category: "Design & UI",
    author: "anthropics",
    installs: "178K",
    installsCount: 178000,
    tags: ["design", "frontend", "ui-ux", "accessibility"],
    icon: "Layout",
  },
  {
    name: "Industrial Brutalist UI",
    description:
      "Interfaces mecânicas cruas que fundem tipografia suíça com estética de terminal militar. Ideal para dashboards e sites editoriais.",
    category: "Design & UI",
    author: "leonxlnx",
    installs: "88K",
    installsCount: 88000,
    tags: ["brutalist", "design", "dashboard", "editorial"],
    icon: "Server",
  },

  // ── IA & Media ─────────────────────────────────────────────────────────
  {
    name: "AI Image Generation",
    description:
      "Geração de imagens de alta qualidade com modelos de difusão: Flux, DALL-E 3, Stable Diffusion. Controle de estilo, composição e variações.",
    category: "IA & Media",
    author: "agentspace-so",
    installs: "456K",
    installsCount: 456000,
    tags: ["ai", "image", "generation", "diffusion"],
    icon: "Image",
  },
  {
    name: "AI Video Generation",
    description:
      "Geração e edição de vídeos com IA: texto-para-vídeo com Kling 3.0, edição, inpaint, extensão de clipes e lip-sync.",
    category: "IA & Media",
    author: "agentspace-so",
    installs: "312K",
    installsCount: 312000,
    tags: ["ai", "video", "generation", "kling"],
    icon: "Video",
  },
  {
    name: "AI Music Generation",
    description:
      "Criação musical com IA via ElevenLabs: composição por texto, controle de estilo e gênero, produção de música royalty-free.",
    category: "IA & Media",
    author: "agentspace-so",
    installs: "234K",
    installsCount: 234000,
    tags: ["ai", "music", "audio", "elevenlabs"],
    icon: "Music",
  },
  {
    name: "Image Editing",
    description:
      "Edição avançada de imagens com IA: inpainting, outpainting, relighting, ControlNet pose, remoção de fundo e transformação.",
    category: "IA & Media",
    author: "agentspace-so",
    installs: "198K",
    installsCount: 198000,
    tags: ["ai", "image-editing", "inpainting", "controlnet"],
    icon: "Scissors",
  },
  {
    name: "AI Avatar Video",
    description:
      "Criação de vídeos com avatar de IA: geração realista a partir de fotos, text-to-speech natural, lip-sync e suporte multilíngue.",
    category: "IA & Media",
    author: "agentspace-so",
    installs: "167K",
    installsCount: 167000,
    tags: ["ai", "avatar", "video", "synthetic-media"],
    icon: "UserCircle",
  },

  // ── Cloud & Infra ──────────────────────────────────────────────────────
  {
    name: "Azure Kubernetes (AKS)",
    description:
      "Gerenciamento completo do Azure Kubernetes Service: provisionamento, node pools, estratégias de deploy, monitoring e RBAC.",
    category: "Cloud & Infra",
    author: "microsoft",
    installs: "278K",
    installsCount: 278000,
    tags: ["azure", "kubernetes", "aks", "containers"],
    icon: "Box",
  },
  {
    name: "Azure Security",
    description:
      "Boas práticas de segurança no Azure: Entra ID, RBAC, Key Vault, Defender for Cloud, network security groups e compliance.",
    category: "Cloud & Infra",
    author: "microsoft",
    installs: "245K",
    installsCount: 245000,
    tags: ["azure", "security", "entra-id", "compliance"],
    icon: "Shield",
  },
  {
    name: "Azure Cost Optimisation",
    description:
      "Análise de custos, budgeting, reserved instances, rightsizing e otimização de gastos em nuvem Azure.",
    category: "Cloud & Infra",
    author: "microsoft",
    installs: "212K",
    installsCount: 212000,
    tags: ["azure", "cost", "optimization", "finops"],
    icon: "Coins",
  },
  {
    name: "Azure Cloud Migration",
    description:
      "Estratégias de migração on-premises para Azure: assessment, planejamento (rehost/refactor/rebuild), Azure Migrate e cutover.",
    category: "Cloud & Infra",
    author: "microsoft",
    installs: "189K",
    installsCount: 189000,
    tags: ["azure", "migration", "cloud", "infrastructure"],
    icon: "ArrowRight",
  },
  {
    name: "OpenClaw — Secure Linux Cloud",
    description:
      "Servidor Linux hardening: firewall, SSH key-only, fail2ban, monitoring com Prometheus, backups automatizados e auditoria de segurança.",
    category: "Cloud & Infra",
    author: "microsoft",
    installs: "98K",
    installsCount: 98000,
    tags: ["linux", "security", "server", "hardening"],
    icon: "Terminal",
  },

  // ── Marketing ──────────────────────────────────────────────────────────
  {
    name: "Copywriting",
    description:
      "Redação profissional de marketing: landing pages, e-mails, anúncios, sales pages. Adaptação de tom de voz e variações para A/B test.",
    category: "Marketing",
    author: "coreyhaines31",
    installs: "198K",
    installsCount: 198000,
    tags: ["copywriting", "marketing", "conversion", "sales"],
    icon: "PenLine",
  },
  {
    name: "SEO Audit",
    description:
      "Auditoria completa de SEO: technical SEO, on-page, off-page, content gaps, structured data e recomendações acionáveis priorizadas.",
    category: "Marketing",
    author: "coreyhaines31",
    installs: "176K",
    installsCount: 176000,
    tags: ["seo", "audit", "technical-seo", "content"],
    icon: "Search",
  },
  {
    name: "Programmatic SEO",
    description:
      "Criação de páginas SEO em escala usando templates, feeds de dados e automação. URL structure, canonical tags e conteúdo unique.",
    category: "Marketing",
    author: "coreyhaines31",
    installs: "156K",
    installsCount: 156000,
    tags: ["seo", "programmatic", "scale", "automation"],
    icon: "Layers",
  },
  {
    name: "Marketing Psychology",
    description:
      "Aplicação de behavioral science e vieses cognitivos no marketing: prova social, escassez, ancoragem, framing e princípios de persuasão.",
    category: "Marketing",
    author: "coreyhaines31",
    installs: "145K",
    installsCount: 145000,
    tags: ["psychology", "marketing", "persuasion", "behavioral-science"],
    icon: "Brain",
  },
  {
    name: "Conversion Rate Optimisation (CRO)",
    description:
      "Otimização de taxas de conversão: análise de funil, A/B testing, layout de landing pages, formulários e UX data-driven.",
    category: "Marketing",
    author: "coreyhaines31",
    installs: "134K",
    installsCount: 134000,
    tags: ["cro", "conversion", "optimization", "ab-testing"],
    icon: "TrendingUp",
  },
  {
    name: "AI SEO",
    description:
      "Otimização de conteúdo para mecanismos de busca com IA: AI Overviews, LLM citations, structured data para consumo por IA, entity SEO.",
    category: "Marketing",
    author: "coreyhaines31",
    installs: "112K",
    installsCount: 112000,
    tags: ["ai-seo", "llm", "search", "content"],
    icon: "Sparkles",
  },
  {
    name: "Product Marketing",
    description:
      "Estratégia de product marketing: posicionamento, mensagem, launch plan, sales enablement, persona e estratégias PLG.",
    category: "Marketing",
    author: "coreyhaines31",
    installs: "98K",
    installsCount: 98000,
    tags: ["product-marketing", "gtm", "positioning", "launch"],
    icon: "Rocket",
  },

  // ── Produtividade ──────────────────────────────────────────────────────
  {
    name: "Brainstorming",
    description:
      "Sessões estruturadas de brainstorming: pensamento divergente para geração de ideias, convergente para seleção, matriz de prioridade.",
    category: "Produtividade",
    author: "obra",
    installs: "234K",
    installsCount: 234000,
    tags: ["brainstorming", "ideation", "creativity", "planning"],
    icon: "Lightbulb",
  },
  {
    name: "Writing Plans",
    description:
      "Criação de planos de execução estruturados a partir de objetivos: breakdown em passos acionáveis, dependências, milestones e riscos.",
    category: "Produtividade",
    author: "obra",
    installs: "212K",
    installsCount: 212000,
    tags: ["planning", "execution", "project-management", "strategy"],
    icon: "ClipboardList",
  },
  {
    name: "Executing Plans",
    description:
      "Execução de planos passo a passo com verification gates, progress tracking, handling de blockers e status reporting.",
    category: "Produtividade",
    author: "obra",
    installs: "189K",
    installsCount: 189000,
    tags: ["execution", "tracking", "verification", "delivery"],
    icon: "ListChecks",
  },
  {
    name: "Remembering Conversations",
    description:
      "Memória episódica para agentes de IA: armazenamento de contexto, decisões e progresso entre sessões com recall inteligente.",
    category: "Produtividade",
    author: "obra",
    installs: "167K",
    installsCount: 167000,
    tags: ["memory", "context", "sessions", "ai-agents"],
    icon: "History",
  },
  {
    name: "Teach",
    description:
      "Ensino multi-sessão: avalia o nível do usuário, cria trilha de aprendizado, trackeia progresso e adapta o ritmo com repetição espaçada.",
    category: "Produtividade",
    author: "mattpocock",
    installs: "123K",
    installsCount: 123000,
    tags: ["teaching", "learning", "education", "tutoring"],
    icon: "GraduationCap",
  },
  {
    name: "Lark Doc",
    description:
      "Gestão de documentos no Lark/Feishu: criação, edição, colaboração, templates, import/export Markdown/Word/PDF e automação.",
    category: "Produtividade",
    author: "larksuite",
    installs: "198K",
    installsCount: 198000,
    tags: ["lark", "documents", "collaboration", "productivity"],
    icon: "FileText",
  },
  {
    name: "Lark OKR",
    description:
      "Gestão de OKRs no Lark/Feishu: criação de objetivos, tracking de key results, check-ins semanais, alinhamento cross-team.",
    category: "Produtividade",
    author: "larksuite",
    installs: "156K",
    installsCount: 156000,
    tags: ["lark", "okr", "goals", "alignment"],
    icon: "Target",
  },

  // ── Agentes & Workflows ────────────────────────────────────────────────
  {
    name: "Dispatching Parallel Agents",
    description:
      "Orquestração de múltiplos agentes de IA em paralelo: divisão de trabalho, dispatch com instruções claras, merge de resultados e retry.",
    category: "Agentes & Workflows",
    author: "obra",
    installs: "256K",
    installsCount: 256000,
    tags: ["agents", "parallel", "orchestration", "workflow"],
    icon: "GitBranch",
  },
  {
    name: "Subagent-Driven Development",
    description:
      "Divide tarefas de desenvolvimento entre subagentes especializados: arquitetura, implementação, revisão, testes e documentação.",
    category: "Agentes & Workflows",
    author: "obra",
    installs: "198K",
    installsCount: 198000,
    tags: ["agents", "development", "subagents", "automation"],
    icon: "Workflow",
  },
  {
    name: "Verification Before Completion",
    description:
      "Gates de qualidade antes de marcar tarefa como completa: checklist de requisitos, execução de testes, revisão de edge cases.",
    category: "Agentes & Workflows",
    author: "obra",
    installs: "178K",
    installsCount: 178000,
    tags: ["quality", "verification", "checklist", "completion"],
    icon: "CheckCircle2",
  },
  {
    name: "MCP Builder",
    description:
      "Construção de servidores MCP (Model Context Protocol): definição de tools, schemas, recursos, autenticação, deploy e integração.",
    category: "Agentes & Workflows",
    author: "anthropics",
    installs: "156K",
    installsCount: 156000,
    tags: ["mcp", "tools", "api", "agents"],
    icon: "Plug",
  },
  {
    name: "Browsing",
    description:
      "Automação de navegação web para agentes de IA: interação com páginas, preenchimento de formulários, extração de dados e screenshots.",
    category: "Agentes & Workflows",
    author: "obra",
    installs: "145K",
    installsCount: 145000,
    tags: ["browsing", "automation", "web", "scraping"],
    icon: "Globe",
  },
]
