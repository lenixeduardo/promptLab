import type { Question } from "@/data/lessonsData"

export const QUICK_QUIZ_QUESTIONS: Question[] = [
  {
    id: 1001,
    question: "O que significa 'temperatura' em modelos de linguagem como o GPT?",
    options: [
      { letter: "A", text: "A velocidade de processamento do servidor." },
      { letter: "B", text: "O grau de criatividade e aleatoriedade das respostas." },
      { letter: "C", text: "O limite máximo de tokens por resposta." },
      { letter: "D", text: "A quantidade de energia consumida pelo modelo." },
    ],
    correct: "B",
  },
  {
    id: 1002,
    question: "Qual técnica de prompting instrui o modelo a 'pensar passo a passo'?",
    options: [
      { letter: "A", text: "Few-shot prompting" },
      { letter: "B", text: "Zero-shot prompting" },
      { letter: "C", text: "Chain-of-Thought (CoT)" },
      { letter: "D", text: "System prompting" },
    ],
    correct: "C",
  },
  {
    id: 1003,
    question: "O que é um 'token' no contexto de LLMs?",
    options: [
      { letter: "A", text: "Uma senha de acesso ao modelo." },
      {
        letter: "B",
        text: "Uma unidade de texto (palavra ou parte de palavra) processada pelo modelo.",
      },
      { letter: "C", text: "Um parâmetro de temperatura do modelo." },
      { letter: "D", text: "Um tipo de arquivo de configuração." },
    ],
    correct: "B",
  },
  {
    id: 1004,
    question: "Qual é o objetivo principal do 'few-shot prompting'?",
    options: [
      { letter: "A", text: "Usar um prompt curto com poucas palavras." },
      { letter: "B", text: "Enviar o prompt apenas algumas vezes." },
      { letter: "C", text: "Incluir exemplos no prompt para guiar o comportamento do modelo." },
      { letter: "D", text: "Configurar o modelo com poucos parâmetros." },
    ],
    correct: "C",
  },
  {
    id: 1005,
    question: "Qual é a função de um 'system prompt'?",
    options: [
      { letter: "A", text: "Reiniciar o modelo quando ele trava." },
      { letter: "B", text: "Definir o papel, comportamento e restrições do assistente." },
      { letter: "C", text: "Aumentar o número de tokens disponíveis." },
      { letter: "D", text: "Conectar o modelo à internet em tempo real." },
    ],
    correct: "B",
  },
  {
    id: 1006,
    question: "O que é 'hallucination' (alucinação) em modelos de linguagem?",
    options: [
      { letter: "A", text: "Quando o modelo demora muito para responder." },
      { letter: "B", text: "Quando o modelo gera informações falsas com aparência de verdade." },
      { letter: "C", text: "Um efeito visual na interface do chat." },
      { letter: "D", text: "Quando o modelo recusa uma pergunta." },
    ],
    correct: "B",
  },
  {
    id: 1007,
    question: "Qual desses elementos NÃO faz parte de um prompt eficiente?",
    options: [
      { letter: "A", text: "Instrução clara do que deve ser feito." },
      { letter: "B", text: "Contexto sobre o cenário ou os dados." },
      { letter: "C", text: "A cor preferida do usuário." },
      { letter: "D", text: "Formato de saída desejado." },
    ],
    correct: "C",
  },
  {
    id: 1008,
    question: "O que significa RAG em IA?",
    options: [
      { letter: "A", text: "Rapid AI Generation" },
      { letter: "B", text: "Retrieval-Augmented Generation" },
      { letter: "C", text: "Recursive Attention Graph" },
      { letter: "D", text: "Real-time AI Guidance" },
    ],
    correct: "B",
  },
  {
    id: 1009,
    question: "Como o 'context window' (janela de contexto) afeta um LLM?",
    options: [
      { letter: "A", text: "Determina a velocidade de conexão com o servidor." },
      {
        letter: "B",
        text: "Define a quantidade máxima de texto que o modelo processa de uma vez.",
      },
      { letter: "C", text: "Controla o tamanho da janela do navegador." },
      { letter: "D", text: "Limita o número de usuários simultâneos." },
    ],
    correct: "B",
  },
  {
    id: 1010,
    question: "Qual prática melhora mais a qualidade das respostas ao usar IA para escrita?",
    options: [
      { letter: "A", text: "Usar apenas emojis para ser conciso." },
      { letter: "B", text: "Enviar prompts genéricos para não limitar a criatividade." },
      { letter: "C", text: "Especificar tom, formato, público-alvo e exemplos no prompt." },
      { letter: "D", text: "Reiniciar a conversa a cada mensagem." },
    ],
    correct: "C",
  },
]
