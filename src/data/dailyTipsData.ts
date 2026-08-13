export interface DailyTip {
  id: string
  text: string
}

export const DAILY_TIPS: DailyTip[] = [
  {
    id: "context",
    text: "Dê contexto antes do pedido: objetivo, público e cenário melhoram muito a resposta.",
  },
  {
    id: "role",
    text: "Peça para a IA assumir um papel específico, como revisora, professora ou estrategista.",
  },
  {
    id: "format",
    text: "Diga qual formato você espera: lista, tabela, resumo, roteiro ou passo a passo.",
  },
  {
    id: "example",
    text: "Inclua um exemplo do resultado ideal para reduzir respostas genéricas.",
  },
  {
    id: "constraints",
    text: "Defina limites claros de tamanho, tom, prazo ou ferramentas disponíveis.",
  },
  {
    id: "audience",
    text: "Informe para quem a resposta será criada e qual conhecimento esse público já possui.",
  },
  {
    id: "iterate",
    text: "Use a primeira resposta como rascunho e peça melhorias específicas na próxima rodada.",
  },
  {
    id: "criteria",
    text: "Liste critérios de qualidade para a IA revisar a própria resposta antes de entregar.",
  },
  {
    id: "questions",
    text: "Quando faltar contexto, peça para a IA fazer perguntas antes de responder.",
  },
  {
    id: "steps",
    text: "Divida tarefas grandes em etapas menores e valide uma etapa por vez.",
  },
  {
    id: "sources",
    text: "Para temas factuais, peça fontes e confira informações importantes antes de usar.",
  },
  {
    id: "alternatives",
    text: "Peça três alternativas com vantagens e desvantagens antes de escolher uma direção.",
  },
  {
    id: "tone",
    text: "Descreva o tom desejado com palavras concretas, como direto, acolhedor ou técnico.",
  },
  {
    id: "negative",
    text: "Diga também o que deve ser evitado: clichês, jargão, repetição ou respostas longas.",
  },
  {
    id: "data",
    text: "Separe claramente seus dados, instruções e exemplos usando títulos ou delimitadores.",
  },
  {
    id: "verify",
    text: "Peça para a IA apontar suposições e incertezas em vez de inventar detalhes.",
  },
  {
    id: "rewrite",
    text: "Ao revisar um texto, explique objetivo da mudança em vez de pedir apenas para melhorar.",
  },
  {
    id: "compare",
    text: "Compare opções usando os mesmos critérios para tomar decisões mais consistentes.",
  },
  {
    id: "checklist",
    text: "Transforme requisitos importantes em checklist para evitar itens esquecidos.",
  },
  {
    id: "persona",
    text: "Combine papel, objetivo e público: essa tríade produz prompts mais precisos.",
  },
  {
    id: "feedback",
    text: "Dê feedback concreto sobre o que funcionou e o que precisa mudar na resposta.",
  },
  {
    id: "scope",
    text: "Feche o escopo antes de começar; pedidos menores costumam gerar resultados melhores.",
  },
  {
    id: "structure",
    text: "Peça uma estrutura primeiro e desenvolva conteúdo somente depois de aprová-la.",
  },
  {
    id: "assumptions",
    text: "Solicite uma lista de suposições para detectar interpretações erradas cedo.",
  },
  {
    id: "examples",
    text: "Dois exemplos variados ensinam melhor o padrão do que uma explicação abstrata.",
  },
  {
    id: "test",
    text: "Teste seu prompt com entradas diferentes para descobrir onde ele ainda é ambíguo.",
  },
  {
    id: "privacy",
    text: "Não compartilhe senhas, documentos privados ou dados pessoais sensíveis com a IA.",
  },
  {
    id: "summary",
    text: "Em tarefas longas, peça um resumo das decisões antes de seguir para a próxima etapa.",
  },
  {
    id: "priority",
    text: "Ordene requisitos por prioridade para a IA saber o que preservar quando houver conflito.",
  },
  {
    id: "final-review",
    text: "Antes de usar uma resposta, revise precisão, clareza e adequação ao seu objetivo.",
  },
]
