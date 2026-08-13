/**
 * @deprecated Content is now served from Supabase. Kept as offline fallback only.
 */

export interface PromptCard {
  title: string
  difficulty: "Iniciante" | "Intermediario" | "Avancado"
  color: "green" | "yellow" | "red"
  category:
    | "Criatividade"
    | "Marketing"
    | "Programacao"
    | "Educacao"
    | "Produtividade"
    | "Gestao de Produto"
    | "Comunicacao"
    | "Analise"
    | "Automacao"
    | "Negocios"
    | "Design"
    | "Suporte"
    | "RH"
  promptText: string
  description: string
  exampleInput?: string
  exampleOutput?: string
}

export const PROMPTS: PromptCard[] = [
  {
    title: "Roteiro de Video Curto",
    difficulty: "Avancado",
    color: "red",
    category: "Criatividade",
    description:
      "Template de roteiro para vídeos curtos (Reels/TikTok/Shorts) com gancho inicial, corpo e CTA final.",
    promptText: `# Instrução
Você é um roteirista de conteúdo curto para redes sociais. Crie um roteiro estruturado para vídeo de até 60 segundos.

# Formato
- **Gancho (0-3s):** Prender atenção imediatamente.
- **Corpo (4-45s):** 1 ideia central, ritmo acelerado.
- **Encerramento (46-60s):** CTA claro (like, comentário, perfil).

# Regras
- Linguagem coloquial e direta.
- Sugira locução + indicação visual (texto na tela / B-roll).`,
    exampleInput: "Tema: Dica rapidíssima de marcação de água na edição de vídeos para iniciantes.",
    exampleOutput:
      "✅ Dica de ouro em 3 passos: \n1...[texto na tela: Resize antes de exportar]\n2...[exemplo visual]\n3...[CTA: Salva o tutorial para não esquecer!]",
  },
  {
    title: "Email Cold Outreach Que Funciona",
    difficulty: "Iniciante",
    color: "green",
    category: "Marketing",
    description:
      "Modelo curto de e-mail de prospecção fria com abertura específica, proposta de valor e single CTA.",
    promptText: `# Instrução
Escreva um e-mail de prospecção fria curto e persuasivo.

# Restrições
- Máximo de 120 palavras.
- Assunto com até 6 palavras.
- Sem "Espero que esta mensagem o encontre bem".
- Abertura com dado específico da empresa/pessoa.
- Apenas 1 pedido claro.`,
    exampleInput:
      "Público: Diretor de operações de uma rede de cafeterias. Oferta: App de gestão de fila e mesas.",
    exampleOutput:
      "Assunto: Filas mais curtas na [nome da cafeteria]\n\nOlá, [Nome], vi que a [Cafeteria] abriu um novo ponto no centro ontem...",
  },
  {
    title: "Copywriting Para Anuncios Performaticos",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Marketing",
    description:
      "Geração de variações de anúncios com frameworks de copy (AIDA / PAS) focados em conversão.",
    promptText: `# Instrução
Escreva 3 variações de anúncios de alta conversão para a plataforma informada.

# Estrutura das variações
- **Opção 1 PAS:** Problema | Agitação | Solução.
- **Opção 2 AIDA:** Atenção | Interesse | Desejo | Ação.
- **Opção 3 Headline-first:** Título curto e ousado + 1 linha de apoio.

# Critérios
- Linguagem adaptada ao público.
- Palavras de poder e específicas, sem jargões vazios.`,
    exampleInput:
      "Produto: Assinatura de pão artesanal saudável (sem glúten, fermentação natural). Canal: Meta Ads.",
    exampleOutput:
      "### Opção 1 PAS\n**Título:** Fome de verdade, sem culpa.\n**Texto:** Pão de fermentação natural sem glúten que deixa a massa macia...",
  },
  {
    title: "Viral Social Hooks",
    difficulty: "Iniciante",
    color: "green",
    category: "Marketing",
    description: "Geração de ganchos curtas e virais para posts de LinkedIn, Instagram e TikTok.",
    promptText: `# Instrução
Crie 8 opções de hook (primeira linha) para redes sociais, divididas por tom e plataforma.

# Formato
- **Educativo/Útil:** Insight que parece contra-intuitivo.
- **Storytelling:** Mini história em 1 frase.
- **Contrarian:** Opinião forte, porém defensável.

# Requisitos
- Cada hook deve ter no máximo 18 palavras.
- Inclua observação rápida de quando usar (ex: LinkedIn profissional).`,
    exampleInput: "Tema: Por que migração de software não é só código, e sim gestão de risco.",
    exampleOutput:
      "1. Educativo: “Migrar sistemas não é refatorar — é transferir risco sem parar a empresa.” (LinkedIn)",
  },
  {
    title: "Plano Semanal Otimizado",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Produtividade",
    description:
      "Monta rotina semanal com blocos de foco profundo, reuniões objetivas e descanso intencional.",
    promptText: `# Instrução
Crie um plano semanal de trabalho realista para o perfil informado.

# Estrutura esperada
- **Segunda a Sexta:** blocos de Deep Work (2h-4h), reuniões curtas, tarefas operacionais e check-in diário.
- **Sexta à tarde:** bloco de fechamento e planejamento da próxima semana.
- **Dica:** sugerir batch de tarefas similares para reduzir trocas de contexto.`,
    exampleInput:
      "Perfil: Desenvolvedor full-stack júnior que também faz suporte e reuniões diárias com equipe.",
    exampleOutput:
      "# Plano Semanal: Full-Stack Júnior\n## Deep Work (Manhãs)\n- Seg/Ter/Qui: 09:00–12:00 — feature X...",
  },
  {
    title: "Facilitador de Reuniao Diaria",
    difficulty: "Iniciante",
    color: "green",
    category: "Comunicacao",
    description: "Guia rápido para stand-ups/daily syncs com tempo curto e foco em bloqueios.",
    promptText: `# Instrução
Crie um roteiro de daily sync de 15 minutos.

# Fluxo sugerido
1. Abertura (1 min): objetivo da reunião.
2. Roda de participantes (10 min): cada pessoa responde Feito / Bloqueio / Próximo.
3. Fechamento (4 min): donos dos blockers definidos e alinhamento de pares.

# Regras
- Sem discussões longas: issues complexas viram follow-up.
- Tom colaborativo, sem culpa.`,
    exampleInput:
      "Time: 2 devs, 1 QA, 1 UX, 1 PM. Objetivo: desbloquear a homologação do checkout.",
    exampleOutput:
      "# Daily Sync - Checkout\n**Tempo:** 15 min\n**Regra:** bloqueios viram follow-up; não abrimos discussões longas...",
  },
  {
    title: "Apresentacao Executiva Estruturada",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Comunicacao",
    description:
      "Cria roteiro de apresentação executiva com enredo, slides sugeridos e perguntas de engajamento.",
    promptText: `# Instrução
Monte um roteiro de apresentação executiva curta (10-12 slides) para stakeholders.

# Estrutura
1. Contexto do problema (dados concretos).
2. Nossa Hipótese.
3. O que validamos até agora.
4. Cenários possíveis.
5. Recomendação + pedido.

# Regras
- Cada slide com 1 mensagem principal.
- Antecipo objeções e responda com dados.`,
    exampleInput:
      "Contexto: Time de produto pediu orçamento de experimento para reduzir no-show em telemedicina.",
    exampleOutput:
      "# Apresentação: No-Show Reduction\n**Slide 1:** Hoje perdemos ~18% das consultas...",
  },
  {
    title: "Analise Exploratoria de Dados Guiada",
    difficulty: "Avancado",
    color: "red",
    category: "Analise",
    description:
      "Plano de análise para explorar um conjunto de dados com perguntas, hipóteses e checagens.",
    promptText: `# Instrução
Escreva um plano de análise exploratória de dados para o cenário fornecido.

# Itens obrigatórios
- Perguntas de negócio que devem ser respondidas.
- Variáveis candidatas e relações esperadas.
- Checks de qualidade (valores faltantes, outliers, janela temporal).
- 3 hipóteses validadas por gráfico.
- Próximos passos para modelagem ou decisão.`,
    exampleInput:
      "Dataset: Vendas de e-commerce com colunas data, canal, ticket, cidade, categoria, status_entrega.",
    exampleOutput:
      "# EDA: Vendas E-commerce\n- **Pergunta 1:** Qual canal entrega maior ticket médio e menor tempo de entrega?",
  },
  {
    title: "Dashboard Executivo em Texto",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Analise",
    description: "Transforma métricas em painel textual com tendências, alertas e ações sugeridas.",
    promptText: `# Instrução
Transforme o conjunto de métricas em um painel textual executivo.

# Formato
- **Visão Geral:** 1 parágrafo com sentimento do negócio.
- **Métricas:** Tabela com nome, valor atual, comparação semana/mês e sinal ↗ ↘ →.
- **Alertas:** Apenas métricas fora do normal.
- **Ações:** Ações sugeridas com responsável sugerido.`,
    exampleInput:
      "Métricas: DAU 12.400 (-4%), receita R$ 284k (+2%), churn 1.9% (target <1.5%), NPS 42 (-3).",
    exampleOutput:
      "# Dashboard - Performance\n## Visão Geral\nSemana de pressão em crescimento líquido...",
  },
  {
    title: "Gerador de Copy Para Carrossel",
    difficulty: "Iniciante",
    color: "green",
    category: "Marketing",
    description:
      "Cria texto para carrosséis educativos com título, tópicos escaneáveis e CTA final.",
    promptText: `# Instrução
Crie o texto de um carrossel para Instagram/LinkedIn com base no tema.

# Estrutura
- Slide 1: Título ousado + promessa de resultado.
- Slides 2-6: Cada slide com frase principal + 1 explicação objetiva.
- Slide 7: Resumo ou cheatsheet visual.
- Slide 8: CTA direto.

# Regras
- Frases curtas e escaneáveis.
- Palavras de engajamento explícito (“salva”, “compartilha”).`,
    exampleInput: "Tema: 6 hábitos rápidos para dormir melhor sem mudar rotina.",
    exampleOutput:
      "# Carrossel: Sono Melhor\n**Slide 1:** 6 hábitos rápidos para dormir mais e rápido (sem mudar sua rotina)...",
  },
  {
    title: "Planejador de Conteudo Mensal",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Produtividade",
    description:
      "Gera calendário de conteúdo de 2 a 4 semanas com temas, formatos, canais e objetivos.",
    promptText: `# Instrução
Crie um calendário de conteúdo para o período informado.

# Tabela obrigatória
| Data | Tema | Canal | Formato | Gancho | Objetivo |

# Regras
- Misture conteúdo educativo, entretenimento e venda.
- Inclua datas oportunistas se relevantes.
- Não repita a ordem de tópicos iguais em dias seguidos.`,
    exampleInput:
      "Nicho: Produtividade para estudantes. Duração: 2 semanas. Canais: TikTok e Instagram.",
    exampleOutput:
      "| Data | Tema | Canal | Formato | Gancho | Objetivo |\n|---|---|---|---|---|---|",
  },
  {
    title: "Facilitador de Retrospectiva Estruturada",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Produtividade",
    description: "Roteiro para retrospectiva com dinâmicas, votação e plano de ação.",
    promptText: `# Instrução
Escreva um roteiro de retrospectiva de sprint ou projeto com duração de 45 minutos.

# Roteiro
1. Abertura e regras (3 min).
2. Coleta silenciosa de pontos (5 min).
3. Agrupamento e votação (7 min).
4. Discussão dos top 3 pontos (20 min).
5. Plano de ação com donos e prazo (10 min).

# Objetivo
- Manter tom de melhoria contínua, sem blame.
- Gerar saídas acionáveis.`,
    exampleInput:
      "Contexto: Sprint com atraso na API, desempenho ruim nos testes E2E, mas boa colaboração front/back.",
    exampleOutput:
      "# Retrospectiva - Sprint 12\n**Duração:** 45 min\n**1. Abertura:** acordar que o foco é processo, não culpa individual...",
  },
  {
    title: "Framework de Avaliacao de Saida de IA",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description:
      "Checklist para auditar respostas de IA quanto a veracidade, tom, conformidade e utilidade.",
    promptText: `# Instrução
Crie um checklist de avaliação de saídas de IA para o caso de uso informado.

# Critérios obrigatórios
- **Veracidade:** Alucinações, factualidade e fontes.
- **Utilidade:** Responde o que foi pedido.
- **Segurança/Ética:** Vieses, toxicidade, PII.
- **Formato:** Segue estrutura solicitada.
- **Tom:** adequado ao público.

# Entregue como matriz de avaliação e exemplos de rerank de prompts.`,
    exampleInput: "Caso: Assistente jurídico que resume contratos e sugere cláusulas de risco.",
    exampleOutput:
      "# Avaliação de Saída - Assistente Jurídico\n## Critérios\n| Critério | Peso | Nota 1 | Nota 2 |",
  },
  {
    title: "Planejador de Lançamento de Produto Digital",
    difficulty: "Avancado",
    color: "red",
    category: "Gestao de Produto",
    description:
      "Plano de lançamento faseado com público-alvo, canais, mensagens e métricas de sucesso.",
    promptText: `# Instrução
Desenvolva uma estratégia de lançamento de produto faseada.

# Fases
1. **Pré-lançamento:** Lista de espera, teasers e early adopters.
2. **Soft launch:** Grupo fechado e proof points.
3. **Lançamento geral:** Aquisição, conteúdo, PR e suporte.

# Itens por fase
- Objetivo da fase
- Ações concretas
- Métricas de sucesso e thresholds

# Saída
- Timeline semanal
- Plano de comunicação por stakeholder`,
    exampleInput: "Produto: Assinatura de pão artesanal saudável com entrega em 24h.",
    exampleOutput: "# Estratégia GTM - Pão Artesanal Saudável\n## Pré-lançamento (Semana 1-2)\n...",
  },
  {
    title: "Playbook de Automacao de Processos",
    difficulty: "Avancado",
    color: "red",
    category: "Automacao",
    description: "Desenha fluxo de automação com gatilhos, ações, validações, fallback e métricas.",
    promptText: `# Instrução
Crie um playbook de automação para o processo informado.

# Estrutura
- Mapa do processo atual (passo a passo).
- Mapa do processo automatizado.
- Ferramentas sugeridas (n8n/Zapier/Make/etc).
- Gatilhos, condições, ações e fallbacks.
- Métricas de sucesso (volume, tempo, erro).

# Regras
- Priorize simplicidade operacional.
- Inclua 3 pontos de falha prováveis e mitigação.`,
    exampleInput:
      "Processo: Quando chega um novo lead no site, enriquecer dados, atribuir score, enviar sequência de e-mails e notificar o responsável.",
    exampleOutput:
      "# Playbook: Autoqualificação de Leads\n## Mapa atual\n1. Lead entra no formulário...",
  },
  {
    title: "Gerador de Receitas com IA",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Criatividade",
    description:
      "Gera receitas personalizadas a partir dos ingredientes disponíveis, restrições e preferências.",
    promptText: `# Instrução
Crie uma receita criativa, prática e saborosa a partir dos ingredientes e restrições informados.

# Formato
- Nome da receita.
- Lista de ingredientes com quantidades.
- Modo de preparo passo a passo.
- Sugestão de harmonização.
- Dica de variação para reaproveitamento.`,
    exampleInput:
      "Ingredientes disponíveis: frango desfiado, creme de leite, batata, milho, cebola, queijo mussarela. Restrição: sem pimenta e sem glúten.",
    exampleOutput: "**Nome:** Escondidinho cremoso de frango com milho\n**Ingredientes:** ...",
  },
  {
    title: "Copy de WhatsApp e Mensagens Curtas",
    difficulty: "Iniciante",
    color: "green",
    category: "Comunicacao",
    description: "Roteiros curtos para mensagens de confirmação, lembrete e pós-venda no WhatsApp.",
    promptText: `# Instrução
Escreva a sequência de mensagens curtas de WhatsApp para o cenário informado.

# Estrutura ideal
- Mensagem 1: Confirmação inicial.
- Mensagem 2: Lembrete 1 antes do evento/prazo.
- Mensagem 3: Lembrete final 1h antes, com CTA.
- Mensagem 4: Pós-evento com pedido de avaliação.

# Regras
- Tom próximo, sem jargões.
- Emojis moderados.
- Texto no formato mobile-friendly.`,
    exampleInput: "Contexto: Agendamento de aula experimental em academia de dança.",
    exampleOutput:
      "**Mensagem 1:** Olá, [Nome]! Sua aula experimental de dança está confirmada para amanhã às 18h...",
  },
  // ── Negocios fallback ────────────────────────────────────────────────────
  {
    title: "Plano de Negocios Rapido",
    difficulty: "Iniciante",
    color: "green",
    category: "Negocios",
    description:
      "Canvas de plano de negócios de uma página com problema, solução, mercado e modelo de receita.",
    promptText: `# Instrução
Crie um plano de negócios de uma página (Lean Canvas) para a ideia descrita.

# Blocos obrigatórios
1. Problema (top 3 dores do cliente).
2. Solução (3 funcionalidades-chave).
3. Proposta de Valor Única (1 frase).
4. Segmento de clientes e early adopters.
5. Canais de distribuição.
6. Modelo de receita e estrutura de custos.
7. Métricas-chave (3 KPIs).`,
    exampleInput:
      "Ideia: App de aluguel de trajes sociais por assinatura para jovens profissionais.",
    exampleOutput: "# Lean Canvas: AlugaFormal\n**Problema:** 1. Comprar terno é caro...",
  },
  {
    title: "Estrategia de Precificacao",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Negocios",
    description:
      "Comparação de estratégias de precificação e recomendação baseada no produto e mercado.",
    promptText: `# Instrução
Analise o produto/serviço e recomende a melhor estratégia de precificação.

# Estratégias a avaliar
1. Cost-plus: custo + margem desejada.
2. Valor percebido: willingness to pay do cliente.
3. Competitiva: ancoragem no mercado.
4. Freemium / Assinatura: se aplicável.

# Entregue
- Tabela comparativa das 3 estratégias.
- Recomendação justificada.
- Faixa de preço sugerida.`,
    exampleInput:
      "Produto: Curso online de Excel avançado, 8h de conteúdo, com suporte via WhatsApp.",
    exampleOutput:
      "# Estratégia de Precificação: Curso Excel\n| Estratégia | Preço sugerido | Prós | Contras |",
  },
  // ── Design fallback ──────────────────────────────────────────────────────
  {
    title: "Briefing de Design Visual",
    difficulty: "Iniciante",
    color: "green",
    category: "Design",
    description:
      "Documento de briefing para projetos de design com objetivos, público, referências e restrições.",
    promptText: `# Instrução
Crie um briefing de design visual completo para o projeto descrito.

# Seções obrigatórias
- Objetivo do projeto (o que será criado e por quê).
- Público-alvo (perfil, faixa etária, contexto de uso).
- Tom e personalidade (3 adjetivos e 3 "não somos X").
- Referências visuais (descreva estilos ou cite exemplos).
- Restrições (cores da marca, tipografia existente, formatos).
- Entregáveis esperados e prazo.`,
    exampleInput:
      "Projeto: Redesign da embalagem de uma linha de chás orgânicos para público feminino 30-45 anos.",
    exampleOutput:
      "# Briefing: Redesign Linha de Chás Orgânicos\n**Objetivo:** Elevar percepção de premium...",
  },
  {
    title: "Sistema de Design Minimo",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Design",
    description:
      "Especificação de tokens de design (cores, tipografia, espaçamento) para consistência visual.",
    promptText: `# Instrução
Defina os tokens de um sistema de design mínimo para a marca descrita.

# Entregáveis
- Paleta de cores: primária, secundária, neutros, feedbacks.
- Tipografia: família, pesos e tamanhos para h1→h4, body, caption.
- Escala de espaçamento: base 4px ou 8px.
- Bordas e raios: padrão de border-radius.
- Sombras: 3 níveis (baixo, médio, alto).
- Componentes base: botão, input, card, badge.`,
    exampleInput:
      "Marca: Fintech de crédito para autônomos. Valores: confiança, simplicidade, modernidade.",
    exampleOutput: "# Design System: FinCredit\n**Primária:** #1A56DB (azul profundo)...",
  },
  // ── Suporte fallback ─────────────────────────────────────────────────────
  {
    title: "Resposta a Reclamacao de Cliente",
    difficulty: "Iniciante",
    color: "green",
    category: "Suporte",
    description:
      "Modelo de resposta empática e resolutiva para reclamações de clientes insatisfeitos.",
    promptText: `# Instrução
Escreva uma resposta profissional e empática para a reclamação do cliente.

# Estrutura
1. Acolhimento: reconhecer a frustração sem defensividade.
2. Pedido de desculpas: sincero e específico.
3. Explicação breve: o que aconteceu (sem excesso).
4. Solução: o que será feito e prazo.
5. Gesto de boa vontade: compensação se aplicável.
6. Encerramento: reforço do compromisso com a experiência.

# Tom: humano, direto, nunca robótico.`,
    exampleInput: "Reclamação: Produto chegou amassado e o suporte demorou 5 dias para responder.",
    exampleOutput: "Olá, [Nome], fico genuinamente chateado com o que aconteceu...",
  },
  {
    title: "Script de FAQ Inteligente",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Suporte",
    description: "Criação de perguntas frequentes com respostas claras e caminho de escalonamento.",
    promptText: `# Instrução
Crie um FAQ inteligente para o produto/serviço descrito.

# Para cada pergunta inclua
- Pergunta (como o cliente realmente pergunta).
- Resposta direta (máx. 3 parágrafos).
- Link ou passo útil (documento, tutorial, tela).
- Se não resolver: caminho de escalonamento (chat, e-mail, tel).

# Gere pelo menos 8 perguntas cobrindo: conta, pagamento, produto, cancelamento, bug.`,
    exampleInput: "Produto: Plataforma SaaS de gestão de projetos para equipes remotas.",
    exampleOutput:
      "**1. Como faço para adicionar um membro à minha equipe?**\nAcesse Configurações → Membros → Convidar...",
  },
  // ── RH fallback ──────────────────────────────────────────────────────────
  {
    title: "Descricao de Vaga Atrativa",
    difficulty: "Iniciante",
    color: "green",
    category: "RH",
    description: "Modelo de descrição de vaga inclusiva, clara e que atrai os candidatos certos.",
    promptText: `# Instrução
Escreva uma descrição de vaga profissional e atrativa para a posição descrita.

# Seções obrigatórias
1. Sobre a empresa (missão, cultura, 3 linhas).
2. Sobre o cargo (o que a pessoa fará no dia a dia).
3. Responsabilidades (5-7 bullets).
4. Requisitos obrigatórios (máx. 5 — seja realista).
5. Diferenciais desejáveis (máx. 3).
6. Benefícios (seja específico, sem "ambiente inovador" genérico).
7. Como se candidatar.

# Linguagem inclusiva: evite termos que excluam gênero ou idade.`,
    exampleInput: "Cargo: Desenvolvedor(a) Front-end Pleno. Stack: React, TypeScript. Remoto, PJ.",
    exampleOutput:
      "# Vaga: Desenvolvedor(a) Front-end Pleno\n**Sobre nós:** Somos uma fintech que simplifica...",
  },
  {
    title: "Roteiro de Entrevista Estruturada",
    difficulty: "Intermediario",
    color: "yellow",
    category: "RH",
    description: "Script de entrevista comportamental com perguntas STAR e rubrica de avaliação.",
    promptText: `# Instrução
Crie um roteiro de entrevista estruturada para a vaga descrita.

# Entregáveis
- Abertura (2 min): apresentação e alinhamento de agenda.
- Perguntas técnicas (3-4): avaliação de habilidades-chave.
- Perguntas comportamentais STAR (4-5): situação passada real.
- Perguntas situacionais (2-3): "o que você faria se...".
- Espaço para perguntas do candidato (5 min).
- Rubrica de avaliação: critérios e pontuação 1-5 por competência.`,
    exampleInput:
      "Vaga: Gerente de Produto. Competências: visão de produto, comunicação, priorização.",
    exampleOutput:
      '# Roteiro de Entrevista: Gerente de Produto\n**Abertura:** "Obrigado por estar aqui, [Nome]..."',
  },
]
