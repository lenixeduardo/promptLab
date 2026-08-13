export interface ContentBlock {
  type: "text" | "quote" | "heading"
  text: string
}

export interface QuestionOption {
  letter: string
  text: string
}

export interface Question {
  id: number
  question: string
  options: QuestionOption[]
  correct: string
}

export interface Lesson {
  id: string
  title: string
  icon: string
  duration: string
  content: ContentBlock[]
  questions: Question[]
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Category {
  id: string
  title: string
  modules: Module[]
}

export const lessonsData: Record<string, Category> = {
  "trending-skills": {
    id: "trending-skills",
    title: "Trending Skills",
    modules: [
      {
        id: "ts-mod-1",
        title: "Módulo 1: IA Generativa no Cotidiano",
        lessons: [
          {
            id: "ts-mod-1-l1",
            title: "A Revolução dos Modelos de Linguagem (LLMs)",
            icon: "TrendingUp",
            duration: "10 min",
            content: [
              {
                type: "heading",
                text: "Entendendo os Modelos de Linguagem de Larga Escala",
              },
              {
                type: "text",
                text: "Os Large Language Models (LLMs) transformaram drasticamente a maneira como interagimos com a computação. Diferente de sistemas tradicionais baseados em regras rígidas, os LLMs utilizam redes neurais profundas para prever a próxima palavra com base no contexto fornecido pelo usuário.",
              },
              {
                type: "quote",
                text: "\"Os LLMs não 'pensam' como humanos, mas sim calculam distribuições estatísticas de probabilidade sobre sequências de caracteres obtidas em bases massivas de dados.\"",
              },
              {
                type: "heading",
                text: "Aplicações Práticas Atuais",
              },
              {
                type: "text",
                text: "Hoje em dia, dominar LLMs permite acelerar a escrita de e-mails, resumir relatórios extensos e até criar ideias inovadoras do zero. Saber formular a pergunta ou instrução correta é a chave para extrair o valor máximo dessas ferramentas.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Como os Large Language Models (LLMs) geram respostas?",
                options: [
                  {
                    letter: "A",
                    text: "Procurando respostas pré-programadas em um banco de dados estático.",
                  },
                  {
                    letter: "B",
                    text: "Prevendo a próxima palavra mais provável de acordo com o contexto estatístico fornecido.",
                  },
                  {
                    letter: "C",
                    text: "Utilizando raciocínio lógico biológico idêntico ao do cérebro humano.",
                  },
                  {
                    letter: "D",
                    text: "Copiando e colando textos diretamente da internet em tempo real.",
                  },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual é o principal fator para obter o melhor resultado de um LLM?",
                options: [
                  { letter: "A", text: "Ter uma velocidade alta de digitação." },
                  { letter: "B", text: "A escolha do navegador de internet utilizado." },
                  { letter: "C", text: "A precisão, clareza e estrutura do prompt enviado." },
                  { letter: "D", text: "O tamanho físico do computador." },
                ],
                correct: "C",
              },
            ],
          },
          {
            id: "ts-mod-1-l2",
            title: "Anatomia de um Prompt Eficiente",
            icon: "Settings",
            duration: "12 min",
            content: [
              {
                type: "heading",
                text: "Os Pilares de um Prompt Perfeito",
              },
              {
                type: "text",
                text: "Um prompt de alta performance não é apenas uma pergunta vaga. Ele é constituído por quatro componentes fundamentais: Instrução (o que fazer), Contexto (o cenário ou dados), Entrada (a informação a ser processada) e Saída (o formato desejado).",
              },
              {
                type: "quote",
                text: "\"Exemplo: 'Escreva um resumo (Instrução) do texto abaixo (Entrada) em formato de tópicos (Saída), focando no público executivo (Contexto/Filtro)'.\"",
              },
              {
                type: "text",
                text: "Ao fornecer explicitamente esses elementos, você reduz drasticamente as chances de alucinação do modelo e garante uma resposta imediatamente útil, sem necessidade de infinitos ajustes.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Quais são os quatro componentes ideais para a anatomia de um prompt?",
                options: [
                  { letter: "A", text: "Saudação, pergunta, assinatura e anexo." },
                  { letter: "B", text: "Instrução, Contexto, Entrada e Saída." },
                  { letter: "C", text: "Algoritmo, Código, Servidor e Interface." },
                  { letter: "D", text: "Título, Autor, Data e Resumo." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "O que ajuda a evitar as 'alucinações' em modelos de linguagem?",
                options: [
                  {
                    letter: "A",
                    text: "Fornecer contextos claros, limites bem definidos e instruções detalhadas de saída.",
                  },
                  {
                    letter: "B",
                    text: "Fazer perguntas confusas para testar a inteligência do modelo.",
                  },
                  { letter: "C", text: "Digitar tudo em letras maiúsculas." },
                  { letter: "D", text: "Usar apenas uma palavra no prompt inteiro." },
                ],
                correct: "A",
              },
            ],
          },
        ],
      },
      {
        id: "ts-mod-2",
        title: "Módulo 2: IA nas Profissões Modernas",
        lessons: [
          {
            id: "ts-mod-2-l1",
            title: "Co-pilotagem de Código para Não Programadores",
            icon: "Code2",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Programando através da Linguagem Natural",
              },
              {
                type: "text",
                text: "Com a popularização de assistentes de codificação, a barreira técnica para desenvolver scripts simples, automações de planilhas e páginas web básicas praticamente desapareceu. Agora, qualquer profissional pode atuar como gestor de projetos técnicos instruindo a IA em português sobre qual lógica ela deve construir.",
              },
              {
                type: "quote",
                text: '"O segredo de trabalhar com IAs de codificação é a modularização: quebre seu problema em pequenos scripts menores, teste cada um deles e depois junte-os."',
              },
              {
                type: "text",
                text: "Quando você pede à IA para construir um sistema gigante de uma vez, as chances de bugs são imensas. Ao pedir pequenas partes, como 'escreva uma função que leia um arquivo Excel e remova duplicados', você garante precisão absoluta.",
              },
            ],
            questions: [
              {
                id: 1,
                question:
                  "Qual é a melhor estratégia ao usar IA para gerar código sendo um não programador?",
                options: [
                  {
                    letter: "A",
                    text: "Pedir para a IA criar todo o sistema de uma vez sem dar detalhes.",
                  },
                  {
                    letter: "B",
                    text: "Modularizar o problem em partes menores, testar cada uma e depois integrá-las.",
                  },
                  {
                    letter: "C",
                    text: "Apenas copiar códigos prontos de fóruns sem ler o que eles fazem.",
                  },
                  {
                    letter: "D",
                    text: "Evitar o uso de linguagem natural e tentar aprender sintaxe complexa no primeiro dia.",
                  },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "O que a modularização de código facilita?",
                options: [
                  { letter: "A", text: "O aumento do custo de processamento." },
                  {
                    letter: "B",
                    text: "A detecção rápida de bugs e a precisão do desenvolvimento passo a passo.",
                  },
                  { letter: "C", text: "A dependência excessiva de computadores quânticos." },
                  { letter: "D", text: "A exclusão automática de arquivos do sistema." },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "ts-mod-2-l2",
            title: "Automação de Fluxos de Trabalho com IA",
            icon: "Activity",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Conectando Ferramentas e IAs",
              },
              {
                type: "text",
                text: "Automatizar fluxos operacionais repetitivos é o superpoder dos profissionais mais produtivos da atualidade. Integrando LLMs a ferramentas de automação como Zapier, Make ou n8n, é possível classificar e-mails de clientes automaticamente, gerar respostas rascunhadas e atualizar bancos de dados em segundos.",
              },
              {
                type: "quote",
                text: '"A IA atua como o motor de decisão cognitivo que analisa a entrada de dados e decide qual ação tomar, eliminando a triagem manual enfadonha."',
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual o papel de uma IA em uma automação de fluxo de trabalho?",
                options: [
                  { letter: "A", text: "Apenas armazenar dados de login dos usuários." },
                  {
                    letter: "B",
                    text: "Tomar decisões cognitivas baseadas no conteúdo recebido, como categorizar ou resumir informações.",
                  },
                  { letter: "C", text: "Aumentar a velocidade da rede Wi-Fi." },
                  {
                    letter: "D",
                    text: "Substituir a necessidade de qualquer conexão com a internet.",
                  },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Ferramentas como Zapier e Make servem para quê?",
                options: [
                  { letter: "A", text: "Formatar discos rígidos de servidores." },
                  {
                    letter: "B",
                    text: "Conectar diferentes aplicativos para criar fluxos de automação integrados.",
                  },
                  { letter: "C", text: "Substituir a tela do monitor por realidade virtual." },
                  { letter: "D", text: "Apenas hospedar sites estáticos de portfólio." },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
    ],
  },
  "community-hub": {
    id: "community-hub",
    title: "Community Hub",
    modules: [
      {
        id: "ch-mod-1",
        title: "Módulo 1: Colaboração e Compartilhamento de Prompts",
        lessons: [
          {
            id: "ch-mod-1-l1",
            title: "Engenharia Reversa de Prompts Comunitários",
            icon: "Users",
            duration: "11 min",
            content: [
              {
                type: "heading",
                text: "Aprendendo com a Inteligência Coletiva",
              },
              {
                type: "text",
                text: "A engenharia reversa de prompts consiste em analisar prompts criados por outros especialistas da comunidade e decompor seus elementos para entender por que eles funcionam tão bem. Ao fazer isso, você desenvolve intuição sobre gatilhos semânticos e estruturas de formatação específicas que otimizam as respostas dos LLMs.",
              },
              {
                type: "quote",
                text: '"Olhar para os prompts compartilhados em repositórios abertos é a forma mais rápida de pular a curva de aprendizado inicial e aplicar técnicas avançadas de imediato."',
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que é a Engenharia Reversa de Prompts?",
                options: [
                  {
                    letter: "A",
                    text: "Descompilar o código-fonte binário de um modelo de linguagem proprietário.",
                  },
                  {
                    letter: "B",
                    text: "Analisar prompts de sucesso criados pela comunidade para compreender seus padrões e replicá-los.",
                  },
                  {
                    letter: "C",
                    text: "Escrever prompts de trás para frente para confundir as diretrizes de segurança da IA.",
                  },
                  {
                    letter: "D",
                    text: "Traduzir prompts do português para outros idiomas antigos automaticamente.",
                  },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual a vantagem de estudar prompts criados por especialistas?",
                options: [
                  { letter: "A", text: "Garantir que os modelos consumam menos energia elétrica." },
                  {
                    letter: "B",
                    text: "Evitar a necessidade de pagar assinaturas mensais das plataformas.",
                  },
                  {
                    letter: "C",
                    text: "Adquirir intuição sobre quais estruturas sintáticas e semânticas funcionam melhor.",
                  },
                  {
                    letter: "D",
                    text: "Obter direitos autorais automáticos sobre as respostas geradas.",
                  },
                ],
                correct: "C",
              },
            ],
          },
          {
            id: "ch-mod-1-l2",
            title: "Open Source e Modelos Abertos",
            icon: "Share2",
            duration: "12 min",
            content: [
              {
                type: "heading",
                text: "O Poder dos Modelos Locais e Abertos",
              },
              {
                type: "text",
                text: "Modelos abertos (como Llama, Mistral e Gemma) democratizaram o desenvolvimento de soluções baseadas em IA. Estudar e colaborar com projetos open source permite criar aplicações altamente personalizadas que rodam localmente em servidores próprios ou até mesmo em computadores pessoais, garantindo privacidade e controle total dos dados.",
              },
              {
                type: "quote",
                text: '"Os modelos open source reduzem a dependência de APIs fechadas e possibilitam o ajuste fino (fine-tuning) para nichos específicos de mercado."',
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual é uma das principais vantagens dos modelos open source de IA?",
                options: [
                  {
                    letter: "A",
                    text: "Eles são sempre maiores e mais lentos que os modelos comerciais.",
                  },
                  {
                    letter: "B",
                    text: "A facilidade de executá-los localmente com total controle sobre a privacidade dos dados.",
                  },
                  {
                    letter: "C",
                    text: "A impossibilidade de modificação por programadores terceiros.",
                  },
                  { letter: "D", text: "O fato de não precisarem de eletricidade para funcionar." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "O que significa 'fine-tuning' em modelos abertos?",
                options: [
                  { letter: "A", text: "Limpar o teclado do computador para digitar mais rápido." },
                  { letter: "B", text: "Ajustar os parâmetros de rede do modem de internet." },
                  {
                    letter: "C",
                    text: "Treinar adicionalmente um modelo pré-existente com um conjunto de dados específico para especializá-lo em uma tarefa.",
                  },
                  { letter: "D", text: "Traduzir a interface do chat para diferentes línguas." },
                ],
                correct: "C",
              },
            ],
          },
        ],
      },
      {
        id: "ch-mod-2",
        title: "Módulo 2: Ética e Governança na Comunidade de IA",
        lessons: [
          {
            id: "ch-mod-2-l1",
            title: "O Papel dos Vieses nos Modelos Públicos",
            icon: "Eye",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "A Origem dos Preconceitos e Estereótipos Algorítmicos",
              },
              {
                type: "text",
                text: "Os modelos de linguagem aprendem a partir de textos históricos criados por seres humanos. Consequentemente, eles tendem a reproduzir preconceitos sociais, de gênero, raça e nacionalidade presentes em seus dados de treinamento. Entender esses vieses é vital para criar prompts de mitigação de preconceito.",
              },
              {
                type: "quote",
                text: '"Como engenheiro de prompts, você pode instruir explicitamente o modelo a manter imparcialidade e diversidade de perspectivas em suas respostas."',
              },
            ],
            questions: [
              {
                id: 1,
                question: "De onde vêm os vieses presentes nos modelos de IA públicos?",
                options: [
                  {
                    letter: "A",
                    text: "De erros propositais introduzidos pelos desenvolvedores de hardware.",
                  },
                  {
                    letter: "B",
                    text: "Dos vieses e preconceitos contidos nos dados de treinamento históricos da internet.",
                  },
                  { letter: "C", text: "Dos satélites de comunicação que transmitem os dados." },
                  {
                    letter: "D",
                    text: "A IA cria sentimentos preconceituosos de forma consciente e autônoma.",
                  },
                ],
                correct: "B",
              },
              {
                id: 2,
                question:
                  "Como um usuário de IA pode ajudar a mitigar os vieses nas respostas do modelo?",
                options: [
                  {
                    letter: "A",
                    text: "Escrevendo prompts que exigem neutralidade, objetividade científica e diversidade de perspectivas.",
                  },
                  { letter: "B", text: "Pedindo para a IA mentir sobre fatos históricos." },
                  { letter: "C", text: "Usando termos ofensivos no prompt de entrada." },
                  {
                    letter: "D",
                    text: "Não há como influenciar a resposta, pois os modelos são 100% rígidos.",
                  },
                ],
                correct: "A",
              },
            ],
          },
          {
            id: "ch-mod-2-l2",
            title: "Direitos Autorais e Propriedade Intelectual em IA",
            icon: "Lock",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "O Desafio Legal da Geração de Conteúdo",
              },
              {
                type: "text",
                text: "A quem pertence um texto ou imagem gerada por uma inteligência artificial? As leis de propriedade intelectual ao redor do mundo estão se adaptando rapidamente a essa nova realidade. Compreender a diferença entre dados proprietários, uso de domínio público e direitos de uso comercial é essencial para proteger seus produtos.",
              },
              {
                type: "quote",
                text: '"Atualmente, na maioria dos países, obras puramente geradas por máquinas, sem intervenção humana significativa, não gozam de direitos autorais tradicionais."',
              },
            ],
            questions: [
              {
                id: 1,
                question:
                  "Qual é o consenso geral da maioria das legislações sobre obras geradas integralmente por IA sem interferência humana?",
                options: [
                  {
                    letter: "A",
                    text: "Elas pertencem automaticamente ao fabricante do computador do usuário.",
                  },
                  {
                    letter: "B",
                    text: "Elas não recebem proteção de direitos autorais por carecerem de autoria humana direta.",
                  },
                  { letter: "C", text: "Elas pertencem ao governo federal do país de origem." },
                  { letter: "D", text: "Elas são patenteadas como segredo de Estado." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question:
                  "Como garantir maior segurança jurídica ao utilizar IA em projetos comerciais?",
                options: [
                  {
                    letter: "A",
                    text: "Mesclando as gerações com modificações, curadoria e toques autorais humanos significativos.",
                  },
                  { letter: "B", text: "Apenas fingindo que a IA nunca foi usada na produção." },
                  {
                    letter: "C",
                    text: "Registrando o prompt bruto no cartório como se fosse código de computador.",
                  },
                  {
                    letter: "D",
                    text: "Processando os criadores do modelo de linguagem preventivamente.",
                  },
                ],
                correct: "A",
              },
            ],
          },
        ],
      },
    ],
  },
  design: {
    id: "design",
    title: "Design",
    modules: [
      {
        id: "des-mod-1",
        title: "Módulo 1: Engenharia de Prompts para Geração de Imagens",
        lessons: [
          {
            id: "des-mod-1-l1",
            title: "Princípios Básicos do Midjourney e DALL-E 3",
            icon: "Palette",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "Como os Geradores de Imagem Interpretam Prompts",
              },
              {
                type: "text",
                text: "Modelos de difusão como Midjourney, DALL-E 3 e Stable Diffusion convertem ruído aleatório em imagens estruturadas guiando-se por texto. Escrever prompts de imagem eficientes requer ser descritivo com o objeto principal, com o estilo visual (fotografia, ilustração 3D, pintura a óleo) e com as proporções desejadas.",
              },
              {
                type: "quote",
                text: '"Um bom prompt visual indica claramente o que deve aparecer na cena, o estilo artístico, a iluminação e as especificações de câmera ou rendering."',
              },
            ],
            questions: [
              {
                id: 1,
                question:
                  "Qual é o mecanismo fundamental dos modelos de geração de imagem modernos?",
                options: [
                  {
                    letter: "A",
                    text: "Eles buscam imagens prontas no Google e as recortam juntas.",
                  },
                  {
                    letter: "B",
                    text: "Modelos de difusão que removem gradualmente o ruído aleatório sob a orientação de descrições textuais.",
                  },
                  {
                    letter: "C",
                    text: "Eles desenham em tempo real usando uma mesa digitalizadora virtual interna.",
                  },
                  { letter: "D", text: "Eles traduzem o código HTML em formato PNG." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual é um exemplo de prompt de imagem bem estruturado?",
                options: [
                  { letter: "A", text: '"Uma coisa bonita, legal e incrível."' },
                  {
                    letter: "B",
                    text: '"Retrato fotográfico de um astronauta idoso, iluminação dramática de estúdio, estilo cyberpunk, lentes 85mm, ultra detalhado."',
                  },
                  { letter: "C", text: '"Foto de gato."' },
                  { letter: "D", text: '"Quero uma imagem que não tenha nada feio."' },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "des-mod-1-l2",
            title: "Estilos, Iluminação e Enquadramentos com IA",
            icon: "Camera",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Controlando a Atmosfera Visual",
              },
              {
                type: "text",
                text: "Mudar a iluminação ou o ângulo de uma tomada muda inteiramente o impacto emocional de uma imagem. Ao usar termos técnicos como 'golden hour' (hora de ouro), 'cinematic backlight' (luz de fundo cinematográfica) ou 'macro lens close-up' (plano detalhado com lente macro), você consegue resultados consistentes e profissionais.",
              },
              {
                type: "quote",
                text: '"Dominar a terminologia do cinema e da fotografia tradicional é o melhor atalho para se comunicar fluentemente com as IAs geradoras de arte."',
              },
            ],
            questions: [
              {
                id: 1,
                question:
                  "O que termos como 'golden hour' e 'backlight' controlam na geração de imagens?",
                options: [
                  { letter: "A", text: "O tamanho do arquivo gerado no disco." },
                  { letter: "B", text: "A qualidade e direção da iluminação na cena." },
                  { letter: "C", text: "A velocidade de conexão com a API." },
                  { letter: "D", text: "O número de cores que a tela do usuário consegue exibir." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question:
                  "Como o uso de vocabulário técnico de fotografia afeta as gerações visuais?",
                options: [
                  {
                    letter: "A",
                    text: "Não causa nenhum impacto, pois a IA ignora termos fotográficos.",
                  },
                  {
                    letter: "B",
                    text: "Ajuda a guiar o enquadramento, textura e iluminação da imagem de maneira precisa e profissional.",
                  },
                  { letter: "C", text: "Serve apenas para deixar o prompt mais longo e lento." },
                  {
                    letter: "D",
                    text: "Bloqueia a imagem por ser considerada técnica avançada demais.",
                  },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
      {
        id: "des-mod-2",
        title: "Módulo 2: UX e Interfaces Guiadas por IA",
        lessons: [
          {
            id: "des-mod-2-l1",
            title: "Prompting para Design de Interface (UI)",
            icon: "Layers",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "Prototipagem Rápida de Telas",
              },
              {
                type: "text",
                text: "Utilizar ferramentas de IA para criar layouts e interfaces (UI) revolucionou o processo de descoberta de produtos. Ao descrever as necessidades dos usuários e regras de acessibilidade, você pode pedir à IA códigos em React Native, HTML/Tailwind ou estruturas que podem ser importadas diretamente no Figma.",
              },
              {
                type: "quote",
                text: '"Descreva a hierarquia de componentes e o fluxo de interação para obter estruturas de interface perfeitamente alinhadas com as diretrizes modernas de usabilidade."',
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual a melhor forma de gerar uma estrutura de UI usando IA?",
                options: [
                  {
                    letter: "A",
                    text: "Pedir para criar um site sem definir o público-alvo ou a hierarquia das informações.",
                  },
                  {
                    letter: "B",
                    text: "Especificar a hierarquia dos componentes, fluxo de navegação e frameworks desejados (ex: Tailwind CSS).",
                  },
                  { letter: "C", text: "Usar apenas palavras soltas como 'bonito' e 'moderno'." },
                  {
                    letter: "D",
                    text: "Deixar que a IA decida até mesmo o nome da sua empresa sem sua aprovação.",
                  },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Como a IA acelera o processo de prototipagem rápida em UI?",
                options: [
                  {
                    letter: "A",
                    text: "Substituindo a necessidade de fazer testes com usuários reais permanentes.",
                  },
                  {
                    letter: "B",
                    text: "Gerando rascunhos de código estruturado de layouts visuais em segundos a partir de especificações textuais.",
                  },
                  {
                    letter: "C",
                    text: "Instalando softwares automaticamente no computador do usuário.",
                  },
                  { letter: "D", text: "Desenvolvendo hardware físico de forma mágica." },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "des-mod-2-l2",
            title: "Escrita de Microcópia (UX Writing) com LLMs",
            icon: "Pencil",
            duration: "11 min",
            content: [
              {
                type: "heading",
                text: "Guia de Tom e Voz para Mensagens de Interface",
              },
              {
                type: "text",
                text: "UX Writing é a prática de escrever microtextos em botões, pop-ups, estados de erro e onboarding para guiar o usuário em uma interface. Os LLMs são ótimos parceiros nessa tarefa se você treinar o modelo para adotar o tom e voz específicos de uma marca, garantindo clareza e empatia nas mensagens.",
              },
              {
                type: "quote",
                text: "\"Defina as diretrizes no prompt: 'Escreva um texto de erro de pagamento que seja explicativo, sem termos técnicos assustadores e de tom prestativo'.\"",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que é microcópia (UX Writing)?",
                options: [
                  { letter: "A", text: "O ato de copiar textos minúsculos em livros didáticos." },
                  {
                    letter: "B",
                    text: "Os textos curtos presentes nas interfaces, como botões, mensagens de erro e guias, que ajudam na navegação do usuário.",
                  },
                  { letter: "C", text: "A programação de chips de memória microscópicos." },
                  { letter: "D", text: "O envio de spam de e-mails em massa." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Como configurar um LLM para criar uma boa microcópia?",
                options: [
                  {
                    letter: "A",
                    text: "Pedindo para a IA gerar o texto mais longo e prolixo possível.",
                  },
                  {
                    letter: "B",
                    text: "Definindo de antemão o tom da marca, a clareza exigida e o contexto específico de uso do botão ou erro.",
                  },
                  { letter: "C", text: "Dizendo apenas para a IA escrever de forma aleatória." },
                  {
                    letter: "D",
                    text: "Substituindo todas as palavras por jargões jurídicos confusos.",
                  },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
    ],
  },
  "prompt-science": {
    id: "prompt-science",
    title: "Prompt Science",
    modules: [
      {
        id: "ps-mod-1",
        title: "Módulo 1: Fundamentos Científicos do Prompting",
        lessons: [
          {
            id: "ps-mod-1-l1",
            title: "Como os LLMs Processam Texto (Tokens e Probabilidades)",
            icon: "Cpu",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "A Ciência por Trás da Geração de Palavras",
              },
              {
                type: "text",
                text: "Os computadores não entendem palavras diretamente. Em vez disso, os LLMs quebram textos de entrada em fragmentos chamados tokens. Um token pode ser uma palavra inteira, uma sílaba ou apenas alguns caracteres. Compreender o funcionamento da tokenização é vital, pois você paga por token consumido e a janela de memória do modelo é estritamente limitada por este fator.",
              },
              {
                type: "quote",
                text: '"Cada token processado passa por bilhões de cálculos matriciais em frações de segundo para calcular a distribuição de probabilidade da próxima palavra."',
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que é um 'token' no contexto de LLMs?",
                options: [
                  {
                    letter: "A",
                    text: "Uma moeda digital de cripto utilizada para pagar as empresas de IA.",
                  },
                  {
                    letter: "B",
                    text: "O menor fragmento de texto (caractere, sílaba ou palavra) que o modelo processa internamente.",
                  },
                  { letter: "C", text: "Uma chave física de segurança para conectar no servidor." },
                  { letter: "D", text: "Um bug que faz o modelo de linguagem parar de funcionar." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question:
                  "Por que a tokenização afeta os custos e as restrições operacionais da IA?",
                options: [
                  {
                    letter: "A",
                    text: "Porque os tokens aumentam a velocidade da internet física.",
                  },
                  {
                    letter: "B",
                    text: "Porque o faturamento das APIs e a limitação de memória (janela de contexto) baseiam-se na contagem de tokens processados.",
                  },
                  {
                    letter: "C",
                    text: "Porque os tokens convertem os arquivos para arquivos PDF.",
                  },
                  {
                    letter: "D",
                    text: "Porque o modelo fica com ciúmes quando usamos muitos tokens.",
                  },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "ps-mod-1-l2",
            title: "Temperatura, Top-P e Parâmetros de Decodificação",
            icon: "Sliders",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "Ajustando o Nível de Criatividade e Determinismo",
              },
              {
                type: "text",
                text: "Ao interagir com APIs de LLM, você pode ajustar parâmetros como 'Temperatura' e 'Top-P'. A Temperatura controla o nível de aleatoriedade das previsões de palavras. Um valor próximo a 0 torna a resposta determinística e factual (ótimo para matemática e lógica), enquanto valores próximos a 1 tornam o texto criativo e altamente variável.",
              },
              {
                type: "quote",
                text: '"Ajustar a Temperatura para zero diminui drasticamente a variabilidade das saídas, sendo a melhor configuração para tarefas técnicas repetíveis."',
              },
            ],
            questions: [
              {
                id: 1,
                question:
                  "O que acontece ao definir a Temperatura em 0 (zero) em uma chamada de API?",
                options: [
                  { letter: "A", text: "A resposta será extremamente criativa e imprevisível." },
                  {
                    letter: "B",
                    text: "A resposta será altamente determinística, factual e repetível.",
                  },
                  { letter: "C", text: "O modelo entrará em modo de suspensão de energia." },
                  {
                    letter: "D",
                    text: "O custo financeiro da chamada será duplicado imediatamente.",
                  },
                ],
                correct: "B",
              },
              {
                id: 2,
                question:
                  "Qual configuração de temperatura seria ideal para escrever um poema inédito?",
                options: [
                  { letter: "A", text: "Temperatura 0.0" },
                  {
                    letter: "B",
                    text: "Temperatura 0.8 a 1.0 (maior aleatoriedade e criatividade)",
                  },
                  { letter: "C", text: "Temperatura negativa" },
                  { letter: "D", text: "Manter o computador desligado" },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
      {
        id: "ps-mod-2",
        title: "Módulo 2: Mecanismos de Atenção e Contexto",
        lessons: [
          {
            id: "ps-mod-2-l1",
            title: "O Mecanismo de Atenção (Transformers)",
            icon: "Brain",
            duration: "16 min",
            content: [
              {
                type: "heading",
                text: "A Revolução do Self-Attention",
              },
              {
                type: "text",
                text: "O avanço revolucionário que possibilitou a existência do ChatGPT foi o mecanismo de auto-atenção (Self-Attention) introduzido na arquitetura Transformer em 2017. Ele permite que o modelo pese dinamicamente a importância de cada palavra em relação a todas as outras na mesma frase, independentemente da distância física entre elas.",
              },
              {
                type: "quote",
                text: "\"No exemplo 'O banco do rio estava molhado', a palavra 'rio' ajuda a IA a prestar atenção na semântica correta de 'banco' (margem da água, e não instituição financeira).\"",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que o mecanismo de Self-Attention permite que um Transformer faça?",
                options: [
                  {
                    letter: "A",
                    text: "Desligar partes do computador que não estão sendo usadas.",
                  },
                  {
                    letter: "B",
                    text: "Relacionar e pesar dinamicamente a importância de palavras distantes na frase para entender melhor o significado global.",
                  },
                  { letter: "C", text: "Apenas ler textos em inglês." },
                  { letter: "D", text: "Garantir que a IA nunca cometa erros ortográficos." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question:
                  "Qual artigo acadêmico de 2017 popularizou o mecanismo de Atenção e os Transformers?",
                options: [
                  { letter: "A", text: '"Attention Is All You Need" por pesquisadores do Google.' },
                  {
                    letter: "B",
                    text: '"A Mathematical Theory of Communication" por Claude Shannon.',
                  },
                  { letter: "C", text: '"Computing Machinery and Intelligence" por Alan Turing.' },
                  { letter: "D", text: '"Deep Learning inside Networks".' },
                ],
                correct: "A",
              },
            ],
          },
          {
            id: "ps-mod-2-l2",
            title: "Gerenciamento do Tamanho da Janela de Contexto",
            icon: "BookOpen",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "Lidando com Limites de Memória das IAs",
              },
              {
                type: "text",
                text: "A janela de contexto representa a quantidade total de tokens que um modelo consegue reter na memória de trabalho em uma única chamada. Se o seu prompt ultrapassar esse limite, o LLM esquecerá as partes iniciais da conversa. Por isso, gerenciar o tamanho do contexto e resumir históricos de chats de forma eficiente é crucial para aplicações estáveis de longa duração.",
              },
              {
                type: "quote",
                text: '"Conforme o chat se alonga, criar resumos consolidados é a melhor técnica para não estourar os limites da janela de contexto do modelo."',
              },
            ],
            questions: [
              {
                id: 1,
                question:
                  "O que acontece se uma conversa de chat exceder o limite da janela de contexto de um modelo?",
                options: [
                  {
                    letter: "A",
                    text: "O modelo apaga automaticamente todo o sistema operacional do servidor.",
                  },
                  {
                    letter: "B",
                    text: "A IA começa a ignorar e esquecer as informações mais antigas da conversa.",
                  },
                  {
                    letter: "C",
                    text: "O aplicativo cobra R$100 do cartão cadastrado automaticamente.",
                  },
                  { letter: "D", text: "A IA desliga temporariamente os servidores por 24 horas." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question:
                  "Qual é uma técnica eficiente para manter conversas muito longas ativas sem estourar o contexto?",
                options: [
                  { letter: "A", text: "Repetir o prompt inicial a cada nova linha." },
                  {
                    letter: "B",
                    text: "Fazer o modelo gerar e atualizar resumos periódicos das principais decisões da conversa.",
                  },
                  { letter: "C", text: "Usar apenas letras maiúsculas." },
                  { letter: "D", text: "Substituir todas as palavras por emojis." },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
    ],
  },
  "prompt-engineering": {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    modules: [
      {
        id: "pe-mod-1",
        title: "Módulo 1: Técnicas Clássicas de Prompting",
        lessons: [
          {
            id: "pe-mod-1-l1",
            title: "Zero-Shot vs Few-Shot Learning",
            icon: "Lightbulb",
            duration: "12 min",
            content: [
              {
                type: "heading",
                text: "Aprendizado por Exemplo",
              },
              {
                type: "text",
                text: "A maneira mais direta de instruir um modelo de linguagem é o Zero-Shot Prompting, onde você pede para o modelo realizar uma tarefa sem mostrar exemplos anteriores. No entanto, em tarefas complexas de categorização ou formatação estrita, o Few-Shot Prompting (fornecer 1 ou mais exemplos estruturados de entrada e saída esperada) garante uma fidelidade drástica na entrega.",
              },
              {
                type: "quote",
                text: '"Few-shot é o segredo de ouro para fazer a IA entender o formato estrito de saída JSON que seu código exige, sem a necessidade de processamento pós-geração."',
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual é a principal diferença entre Zero-Shot e Few-Shot Prompting?",
                options: [
                  {
                    letter: "A",
                    text: "Zero-shot é feito em computadores antigos; Few-shot usa computação quântica.",
                  },
                  {
                    letter: "B",
                    text: "Zero-shot faz a pergunta diretamente sem exemplos; Few-shot fornece exemplos reais do padrão esperado.",
                  },
                  { letter: "C", text: "Few-shot exige pagamento extra por chamada." },
                  { letter: "D", text: "Não há diferença prática de acurácia entre eles." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Quando o uso de Few-Shot Prompting é especialmente recomendado?",
                options: [
                  {
                    letter: "A",
                    text: "Para tarefas simples que qualquer modelo resolve diretamente.",
                  },
                  {
                    letter: "B",
                    text: "Quando você precisa que a IA gere dados formatados seguindo um padrão estrito e personalizado.",
                  },
                  {
                    letter: "C",
                    text: "Quando você quer diminuir o número de tokens enviados no prompt.",
                  },
                  { letter: "D", text: "Para economizar o tempo de processamento." },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "pe-mod-1-l2",
            title: "Chain-of-Thought (CoT) e Raciocínio Lógico",
            icon: "HelpCircle",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "A Decomposição Passo a Passo",
              },
              {
                type: "text",
                text: "Modelos de linguagem cometem erros em problemas lógicos simples por tentarem prever a palavra final instantaneamente. A técnica Chain-of-Thought (CoT - Cadeia de Pensamento) resolve isso instruindo o modelo a detalhar seu raciocínio passo a passo antes de apresentar a conclusão.",
              },
              {
                type: "quote",
                text: "\"Adicionar simplesmente a frase 'Pense passo a passo e explique seu raciocínio' ativa um comportamento de encadeamento lógico que reduz alucinações e erros matemáticos complexos.\"",
              },
            ],
            questions: [
              {
                id: 1,
                question:
                  "Por que a técnica Chain-of-Thought melhora as respostas lógicas dos LLMs?",
                options: [
                  {
                    letter: "A",
                    text: "Ela acelera a velocidade física do hardware no servidor da IA.",
                  },
                  {
                    letter: "B",
                    text: "Ela força o modelo a gerar tokens que servem como rascunhos para embasar a resposta final lógica.",
                  },
                  { letter: "C", text: "Ela deleta os dados incorretos da internet." },
                  { letter: "D", text: "Ela traduz o prompt para Python secretamente." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question:
                  "Qual comando em português costuma ativar o comportamento CoT de forma implícita?",
                options: [
                  { letter: "A", text: '"Escreva o mais rápido possível."' },
                  {
                    letter: "B",
                    text: '"Pense passo a passo antes de dar a resposta final e justifique cada etapa."',
                  },
                  { letter: "C", text: '"Dê apenas a resposta final e nada mais."' },
                  { letter: "D", text: '"Não tente pensar."' },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
      {
        id: "pe-mod-2",
        title: "Módulo 2: Técnicas Avançadas de Prompting",
        lessons: [
          {
            id: "pe-mod-2-l1",
            title: "ReAct (Reasoning and Acting)",
            icon: "Zap",
            duration: "17 min",
            content: [
              {
                type: "heading",
                text: "Unindo Raciocínio Lógico com Ações Externas",
              },
              {
                type: "text",
                text: "A técnica ReAct (Raciocínio + Ação) permite que o modelo decida quando precisa buscar informações externas. Ele gera um ciclo estruturado de 'Pensamento', 'Ação' (como buscar informações no Google ou consultar uma API de clima) e 'Observação' (processar o resultado da ação) antes de formular a resposta final para o usuário.",
              },
              {
                type: "quote",
                text: '"O framework ReAct serve como base para a imensa maioria dos agentes e assistentes de IA avançados da atualidade."',
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual é a base do funcionamento do framework ReAct?",
                options: [
                  {
                    letter: "A",
                    text: "Reagir com raiva quando o usuário faz perguntas repetitivas.",
                  },
                  {
                    letter: "B",
                    text: "Alternar continuamente entre etapas de raciocínio (Pensamento) e ações externas (Ação) para resolver o problema.",
                  },
                  {
                    letter: "C",
                    text: "Desativar APIs de terceiros para forçar o modelo a chutar a resposta.",
                  },
                  { letter: "D", text: "Apenas reescrever o código do usuário em Java." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "O que constitui a etapa de 'Observação' em um fluxo ReAct?",
                options: [
                  {
                    letter: "A",
                    text: "A resposta ou dado retornado por uma ferramenta externa após a IA ter executado uma Ação.",
                  },
                  { letter: "B", text: "O usuário olhando para a tela esperando a resposta." },
                  { letter: "C", text: "O tempo que a API leva para conectar." },
                  {
                    letter: "D",
                    text: "Uma câmera de vídeo analisando a expressão facial do usuário.",
                  },
                ],
                correct: "A",
              },
            ],
          },
          {
            id: "pe-mod-2-l2",
            title: "Meta-Prompting e Auto-Refinamento",
            icon: "Award",
            duration: "16 min",
            content: [
              {
                type: "heading",
                text: "IAs Criando Prompts para IAs",
              },
              {
                type: "text",
                text: "Por que quebrar a cabeça escrevendo prompts se os próprios modelos de linguagem são excelentes engenheiros de prompts? O Meta-Prompting consiste em instruir uma IA a redigir, otimizar e testar o prompt final ideal que você utilizará em outra aplicação ou tarefa do dia a dia.",
              },
              {
                type: "quote",
                text: "\"Escreva um meta-prompt instruindo a IA: 'Aja como um designer instrucional sênior e crie um prompt para gerar planos de aula eficazes'.\"",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que é Meta-Prompting?",
                options: [
                  {
                    letter: "A",
                    text: "Desenvolver prompts específicos apenas para a empresa controladora do Facebook.",
                  },
                  {
                    letter: "B",
                    text: "Usar um LLM para gerar, refinar ou otimizar outros prompts de forma sistemática.",
                  },
                  { letter: "C", text: "Uma técnica antiga para deletar dados corrompidos." },
                  {
                    letter: "D",
                    text: "Apenas um prompt muito curto com palavras de baixo calão.",
                  },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual é o principal benefício do auto-refinamento de prompts por IA?",
                options: [
                  { letter: "A", text: "Acelerar a velocidade de carregamento da internet." },
                  {
                    letter: "B",
                    text: "Encontrar e corrigir falhas semânticas ou ambiguidades de forma automatizada e ágil.",
                  },
                  {
                    letter: "C",
                    text: "Diminuir o número de servidores necessários para rodar um prompt.",
                  },
                  { letter: "D", text: "Obter patentes intelectuais mais rápidas." },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
    ],
  },
  "advanced-science": {
    id: "advanced-science",
    title: "Advanced Science",
    modules: [
      {
        id: "as-mod-1",
        title: "Módulo 1: RAG e Sistemas Híbridos",
        lessons: [
          {
            id: "as-mod-1-l1",
            title: "O que é RAG (Retrieval-Augmented Generation)?",
            icon: "Database",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Alimentando a IA com Conhecimento Externo e Dinâmico",
              },
              {
                type: "text",
                text: "Mesmo as maiores IAs possuem dados desatualizados ou desconhecem arquivos internos de empresas privadas. O RAG (Geração Aumentada de Recuperação) corrige isso pesquisando documentos externos correspondentes à pergunta do usuário e acoplando essas informações no prompt da IA como contexto factual temporário.",
              },
              {
                type: "quote",
                text: '"Com o RAG, a IA funciona como um estudante que faz uma prova com consulta aos livros corretos colocados sobre sua mesa."',
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que a sigla RAG significa?",
                options: [
                  { letter: "A", text: "Random Access Generation (Geração de Acesso Aleatório)." },
                  {
                    letter: "B",
                    text: "Retrieval-Augmented Generation (Geração Aumentada de Recuperação).",
                  },
                  { letter: "C", text: "Real-time Action Grid (Grade de Ação em Tempo Real)." },
                  {
                    letter: "D",
                    text: "Recurrent Autonomous Gateway (Portal Autônomo Recorrente).",
                  },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual o principal benefício da arquitetura RAG?",
                options: [
                  {
                    letter: "A",
                    text: "Evitar treinar ou re-treinar o modelo completo fornecendo dados factuais e privados atualizados em tempo de execução.",
                  },
                  { letter: "B", text: "Reduzir o consumo de bateria do servidor para zero." },
                  { letter: "C", text: "Eliminar a necessidade de usar prompts no chat." },
                  { letter: "D", text: "Permitir que a IA se comunique por sinais de fumaça." },
                ],
                correct: "A",
              },
            ],
          },
          {
            id: "as-mod-1-l2",
            title: "Bancos de Dados Vetoriais e Embeddings",
            icon: "Network",
            duration: "16 min",
            content: [
              {
                type: "heading",
                text: "A Matemática da Semelhança Semântica",
              },
              {
                type: "text",
                text: "Para que o sistema RAG encontre o documento certo, os textos são convertidos em vetores de números conhecidos como 'embeddings'. Esses vetores localizam conceitos em um espaço multidimensional. Textos que possuem significados parecidos (como 'cachorro' e 'cão') ficam geometricamente próximos nesse espaço, facilitando a busca.",
              },
              {
                type: "quote",
                text: '"Os bancos de dados vetoriais (como Pinecone, Chroma ou Milvus) são otimizados para encontrar rapidamente estes vetores vizinhos mais próximos."',
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que são 'embeddings' no contexto de inteligência artificial?",
                options: [
                  {
                    letter: "A",
                    text: "Legendas embutidas nas imagens criadas por modelos de difusão.",
                  },
                  {
                    letter: "B",
                    text: "Representações matemáticas vetoriais que capturam o significado semântico de palavras ou textos.",
                  },
                  {
                    letter: "C",
                    text: "Fontes tipográficas especiais para terminais de programador.",
                  },
                  { letter: "D", text: "Placas de circuito impresso para supercomputadores." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Para que serve um banco de dados vetorial?",
                options: [
                  {
                    letter: "A",
                    text: "Apenas para salvar backups em formato de planilha de Excel clássica.",
                  },
                  {
                    letter: "B",
                    text: "Para realizar pesquisas de similaridade geométrica ultrarrápidas entre vetores (embeddings).",
                  },
                  {
                    letter: "C",
                    text: "Para criptografar as senhas das redes sociais dos usuários.",
                  },
                  {
                    letter: "D",
                    text: "Para substituir completamente os servidores de nuvem por discos físicos.",
                  },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
      {
        id: "as-mod-2",
        title: "Módulo 2: Agentes Autônomos e Multiagentes",
        lessons: [
          {
            id: "as-mod-2-l1",
            title: "Arquitetura de Agentes Autônomos (Loop de Ação)",
            icon: "PlayCircle",
            duration: "18 min",
            content: [
              {
                type: "heading",
                text: "IAs que Executam Planos sem Supervisão Direta",
              },
              {
                type: "text",
                text: "Diferente de um chat comum que depende de perguntas a cada etapa, os agentes autônomos recebem um objetivo principal complexo (ex: 'pesquise concorrentes do produto X e crie um slide comparativo'). A IA então se desdobra em sub-tarefas e decide de forma autônoma quais ferramentas usar.",
              },
              {
                type: "quote",
                text: '"Agentes necessitam de três pilares: Planejamento (decomposição do objetivo), Memória (retenção de estados passados) e Ferramentas (APIs para agir)."',
              },
            ],
            questions: [
              {
                id: 1,
                question: "Quais são as três fundações de um agente autônomo baseado em LLMs?",
                options: [
                  { letter: "A", text: "Planejamento, Memória e Ferramentas (Tools)." },
                  { letter: "B", text: "Teclado, Mouse e Monitor de Alta Resolução." },
                  { letter: "C", text: "JavaScript, HTML e CSS." },
                  { letter: "D", text: "Login, Cadastro e Redefinição de senha." },
                ],
                correct: "A",
              },
              {
                id: 2,
                question: "Como o agente autônomo opera para realizar um grande objetivo?",
                options: [
                  {
                    letter: "A",
                    text: "Ele desiste imediatamente ao encontrar o primeiro erro lógico.",
                  },
                  {
                    letter: "B",
                    text: "Ele divide o objetivo maior em tarefas menores, executa-as ciclicamente e avalia seu próprio progresso.",
                  },
                  {
                    letter: "C",
                    text: "Ele pede dinheiro ao usuário para comprar as informações prontas.",
                  },
                  {
                    letter: "D",
                    text: "Ele gera código criptografado que ninguém consegue decifrar.",
                  },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "as-mod-2-l2",
            title: "Colaboração de Multiagentes",
            icon: "Workflow",
            duration: "17 min",
            content: [
              {
                type: "heading",
                text: "Equipes Virtuais Trabalhando Juntas",
              },
              {
                type: "text",
                text: "Ao invés de usar apenas um agente generalista, as soluções mais avançadas utilizam múltiplos agentes com especialidades diferentes conversando entre si. Um agente atua como Gerente de Produto, outro como Desenvolvedor e outro como Analista de Qualidade, gerando um resultado de alto padrão e auto-corrigido.",
              },
              {
                type: "quote",
                text: '"Ao definir papéis opostos para agentes diferentes (como escritor e editor crítico), a qualidade final do texto gerado aumenta exponencialmente."',
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que caracteriza um sistema de Colaboração Multiagente?",
                options: [
                  {
                    letter: "A",
                    text: "Várias pessoas humanas digitando no mesmo chat ao mesmo tempo.",
                  },
                  {
                    letter: "B",
                    text: "Múltiplos agentes de IA com papéis específicos colaborando e revisando o trabalho uns dos outros.",
                  },
                  { letter: "C", text: "A clonagem física de computadores em rede local." },
                  {
                    letter: "D",
                    text: "A fusão de vários modelos em apenas um grande arquivo binário unificado.",
                  },
                ],
                correct: "B",
              },
              {
                id: 2,
                question:
                  "Qual a vantagem de colocar um agente no papel de 'Escritor' e outro no de 'Editor Crítico'?",
                options: [
                  { letter: "A", text: "Fazer o modelo demorar mais para responder de propósito." },
                  { letter: "B", text: "Otimizar o custo da computação." },
                  {
                    letter: "C",
                    text: "Gerar um ciclo saudável de revisão e aprimoramento que corrige erros e eleva o nível do resultado final.",
                  },
                  {
                    letter: "D",
                    text: "Excluir automaticamente qualquer palavra repetida da resposta.",
                  },
                ],
                correct: "C",
              },
            ],
          },
        ],
      },
    ],
  },
  "hour-of-focus": {
    id: "hour-of-focus",
    title: "Hour of Focus",
    modules: [
      {
        id: "hof-mod-1",
        title: "Módulo 1: Produtividade Extrema com IA",
        lessons: [
          {
            id: "hof-mod-1-l1",
            title: "Técnicas de Resumo e Síntese de Grandes Volumes",
            icon: "BookOpen",
            duration: "10 min",
            content: [
              {
                type: "heading",
                text: "Engolindo Conhecimento com Inteligência",
              },
              {
                type: "text",
                text: "Em um mundo repleto de informação, o tempo é o recurso mais valioso. Aprenda a programar prompts de compressão que extraem insights práticos de PDFs de 100 páginas ou de transcrições de reuniões de duas horas em menos de 30 segundos, sem perder as decisões essenciais.",
              },
              {
                type: "quote",
                text: '"Definir o público-alvo do resumo evita que a IA remova detalhes que parecem técnicos para um leigo, mas que são fundamentais para o especialista."',
              },
            ],
            questions: [
              {
                id: 1,
                question:
                  "Qual técnica otimiza o resumo de um relatório corporativo complexo feito por um LLM?",
                options: [
                  {
                    letter: "A",
                    text: "Pedir um resumo curto sem fornecer o contexto ou o público-alvo interessado.",
                  },
                  {
                    letter: "B",
                    text: "Especificar o público-alvo (ex: diretores, engenheiros) e definir restrições estruturais claras (ex: metas, riscos).",
                  },
                  { letter: "C", text: "Copiar e colar o texto várias vezes para confundir a IA." },
                  { letter: "D", text: "Usar apenas palavras isoladas no prompt." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Como evitar que a IA filtre dados cruciais ao resumir textos longos?",
                options: [
                  {
                    letter: "A",
                    text: "Indicando claramente no prompt quais tópicos de interesse (ex: orçamentos, cronogramas) não podem ser excluídos de forma alguma.",
                  },
                  { letter: "B", text: "Não há como evitar, a IA resume conforme quer." },
                  {
                    letter: "C",
                    text: "Pedindo para que a IA reescreva o texto sem resumir nada.",
                  },
                  { letter: "D", text: "Usar uma fonte tipográfica diferente." },
                ],
                correct: "A",
              },
            ],
          },
          {
            id: "hof-mod-1-l2",
            title: "Análise de Dados e Relatórios Gerenciais Rápidos",
            icon: "BarChart3",
            duration: "12 min",
            content: [
              {
                type: "heading",
                text: "Transformando Tabelas em Narrativas de Sucesso",
              },
              {
                type: "text",
                text: "A capacidade de ler números puros e encontrar histórias neles é crucial para líderes modernos. Fornecendo tabelas brutas no formato CSV ou JSON para um LLM, você pode instruí-lo a extrair anomalias, picos de venda, falhas de funil e sugerir planos de ação prontos para apresentação corporativa.",
              },
              {
                type: "quote",
                text: '"Instrua a IA a separar as observações analíticas (o que os números mostram) das sugestões estratégicas (o que a empresa deve fazer a respeito)."',
              },
            ],
            questions: [
              {
                id: 1,
                question:
                  "Como os LLMs auxiliam na análise de arquivos CSV ou tabelas estruturadas?",
                options: [
                  {
                    letter: "A",
                    text: "Eles reescrevem o arquivo no banco de dados físico de forma invisível.",
                  },
                  {
                    letter: "B",
                    text: "Eles identificam padrões, anomalias e transformam números em conclusões textuais fáceis de entender.",
                  },
                  {
                    letter: "C",
                    text: "Eles apenas calculam médias aritméticas básicas mais lentas que o Excel.",
                  },
                  {
                    letter: "D",
                    text: "Eles compram ações do mercado financeiro de forma oculta.",
                  },
                ],
                correct: "B",
              },
              {
                id: 2,
                question:
                  "Qual a melhor recomendação para estruturar um prompt de análise de dados gerenciais?",
                options: [
                  {
                    letter: "A",
                    text: "Misturar observações brutas com opiniões subjetivas na mesma frase longa.",
                  },
                  {
                    letter: "B",
                    text: "Pedir à IA para separar estritamente dados descritivos factuais (o quê) de propostas de soluções práticas (o que fazer).",
                  },
                  {
                    letter: "C",
                    text: "Não enviar os dados, apenas descrever as cores das planilhas.",
                  },
                  { letter: "D", text: "Pedir opiniões aleatórias." },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
      {
        id: "hof-mod-2",
        title: "Módulo 2: Foco e Resolução de Problemas",
        lessons: [
          {
            id: "hof-mod-2-l1",
            title: "Brainstorming Estruturado e Exploração de Cenários",
            icon: "Lightbulb",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "Multiplicando as Suas Ideias Iniciais",
              },
              {
                type: "text",
                text: "Os LLMs são fantásticos para gerar ideias por possuírem referências de milhares de setores diferentes. No entanto, sessões de brainstorming sem estrutura geram respostas repetitivas. Configure papéis específicos como 'advogado do diabo' ou 'usuário cético' para testar a robustez dos seus planos e antecipar falhas de mercado.",
              },
              {
                type: "quote",
                text: '"Use a IA para desafiar suas hipóteses mais queridas. O melhor brainstorming é aquele que revela os seus pontos cegos profissionais."',
              },
            ],
            questions: [
              {
                id: 1,
                question: "Como evitar ideias genéricas em sessões de brainstorming com IAs?",
                options: [
                  { letter: "A", text: "Fazendo perguntas genéricas como 'me dê ideias legais'." },
                  {
                    letter: "B",
                    text: "Instruindo o modelo a adotar papéis específicos de teste (ex: advogado do diabo) e restringindo os nichos de atuação.",
                  },
                  { letter: "C", text: "Mudando o idioma para latim." },
                  { letter: "D", text: "Deixando que o prompt seja formulado por um bot de spam." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question:
                  "Qual o maior benefício de usar IA como testadora de hipóteses corporativas?",
                options: [
                  {
                    letter: "A",
                    text: "Revelar de forma rápida pontos cegos, fraquezas de lógica e antecipar cenários alternativos de mercado.",
                  },
                  { letter: "B", text: "Garantir lucros bilionários automáticos sem esforço." },
                  {
                    letter: "C",
                    text: "Reduzir o tamanho físico do time de executivos para apenas um estagiário.",
                  },
                  {
                    letter: "D",
                    text: "Substituir a tomada de decisão final dos proprietários da empresa.",
                  },
                ],
                correct: "A",
              },
            ],
          },
          {
            id: "hof-mod-2-l2",
            title: "Refatoração Mental e Tomada de Decisão Decisiva",
            icon: "CheckCircle",
            duration: "11 min",
            content: [
              {
                type: "heading",
                text: "Organizando Ideias Confusas sob Pressão",
              },
              {
                type: "text",
                text: "Quando você está lidando com crises ou bloqueios intelectuais, o excesso de informação pode paralisar sua tomada de decisão. Faça um despejo mental rápido digitando todas as suas preocupações sem ordem no prompt e instrua a IA a organizar a confusão em uma matriz de priorização de tarefas urgente e executável.",
              },
              {
                type: "quote",
                text: '"O despejo de ideias bagunçadas (braindump) combinado com técnicas de categorização automática limpa a mente e direciona o foco imediato para as ações de alto impacto."',
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que é a técnica de 'braindump' (despejo mental) estruturada por IA?",
                options: [
                  {
                    letter: "A",
                    text: "Fazer o backup do computador na nuvem pública sem restrições.",
                  },
                  {
                    letter: "B",
                    text: "Digitar ideias e preocupações de forma bagunçada e pedir para a IA categorizá-las em um plano de ação estruturado e lógico.",
                  },
                  { letter: "C", text: "Apagar todas as memórias do chat para limpar os dados." },
                  {
                    letter: "D",
                    text: "Deixar a IA controlar seus canais de chat pessoais de forma autônoma.",
                  },
                ],
                correct: "B",
              },
              {
                id: 2,
                question:
                  "Qual a melhor matriz para instruir a IA a usar na organização das tarefas priorizadas?",
                options: [
                  { letter: "A", text: "Matriz de cores aleatórias." },
                  {
                    letter: "B",
                    text: "Matriz de Eisenhower (Urgente vs Importante) ou Matriz de Esforço vs Impacto.",
                  },
                  {
                    letter: "C",
                    text: "Não usar matriz alguma, apenas uma lista gigante desordenada.",
                  },
                  {
                    letter: "D",
                    text: "Apenas agrupar tudo em uma única pasta sem critérios de triagem.",
                  },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
    ],
  },
  "agent-orchestration": {
    id: "agent-orchestration",
    title: "Orquestração de Agentes",
    modules: [
      {
        id: "ao-mod-1",
        title: "Módulo 1: Sistemas com Agentes de IA",
        lessons: [
          {
            id: "ao-mod-1-l1",
            title: "Do Chatbot ao Agente Executor",
            icon: "Bot",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "Agentes trabalham com objetivo, memória e ferramentas",
              },
              {
                type: "text",
                text: "Um chatbot responde a uma mensagem. Um agente recebe um objetivo, divide o trabalho em etapas, consulta ferramentas e revisa o próprio progresso. Essa mudança permite automatizar tarefas como pesquisar, comparar opções, gerar documentos e validar resultados antes de devolver a resposta final.",
              },
              {
                type: "quote",
                text: '"Um bom agente não é uma IA solta: é um fluxo com papel claro, limites, ferramentas autorizadas e critério de parada."',
              },
              {
                type: "text",
                text: "Para criar agentes confiáveis, defina: papel, objetivo, contexto, ferramentas permitidas, formato de saída e regras de escalonamento quando houver incerteza.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que diferencia um agente de IA de um chatbot simples?",
                options: [
                  { letter: "A", text: "O agente sempre usa uma tela maior." },
                  {
                    letter: "B",
                    text: "O agente pode planejar etapas, usar ferramentas e avaliar progresso rumo a um objetivo.",
                  },
                  { letter: "C", text: "O agente não precisa de nenhum limite ou instrução." },
                  { letter: "D", text: "O agente funciona apenas sem internet." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual item deve existir em um desenho seguro de agente?",
                options: [
                  { letter: "A", text: "Ferramentas autorizadas e critério claro de parada." },
                  { letter: "B", text: "Permissao para executar qualquer acao sem revisao." },
                  { letter: "C", text: "Objetivos vagos para deixar a IA improvisar." },
                  { letter: "D", text: "Ausencia total de logs." },
                ],
                correct: "A",
              },
            ],
          },
          {
            id: "ao-mod-1-l2",
            title: "Orquestração Multiagente",
            icon: "Workflow",
            duration: "16 min",
            content: [
              {
                type: "heading",
                text: "Especialistas pequenos vencem generalistas confusos",
              },
              {
                type: "text",
                text: "Orquestrar agentes significa dividir um trabalho complexo em papéis menores. Um agente pesquisador coleta evidências, um analista estrutura hipóteses, um revisor procura falhas e um coordenador consolida a resposta. O ganho aparece quando cada papel tem responsabilidade e saída bem definida.",
              },
              {
                type: "quote",
                text: '"Multiagente não é colocar várias IAs conversando sem direção; é desenhar uma linha de montagem cognitiva."',
              },
              {
                type: "text",
                text: "O coordenador deve evitar duplicidade, resolver conflitos entre agentes e pedir nova rodada apenas quando a evidência for insuficiente.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual é a função de um agente coordenador?",
                options: [
                  { letter: "A", text: "Ignorar todos os especialistas." },
                  {
                    letter: "B",
                    text: "Consolidar resultados, resolver conflitos e decidir se nova rodada é necessária.",
                  },
                  { letter: "C", text: "Fazer apenas design visual." },
                  { letter: "D", text: "Apagar evidencias divergentes." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Quando sistemas multiagente trazem mais valor?",
                options: [
                  {
                    letter: "A",
                    text: "Quando tarefas exigem pesquisa, análise, revisão e consolidação com papéis diferentes.",
                  },
                  { letter: "B", text: "Quando a tarefa e responder uma pergunta de uma palavra." },
                  { letter: "C", text: "Quando não existe critério de qualidade." },
                  { letter: "D", text: "Quando todos os agentes fazem exatamente a mesma coisa." },
                ],
                correct: "A",
              },
            ],
          },
        ],
      },
    ],
  },
  "ai-finance": {
    id: "ai-finance",
    title: "IA para Financeiro",
    modules: [
      {
        id: "fin-mod-1",
        title: "Módulo 1: Análise Financeira com IA",
        lessons: [
          {
            id: "fin-mod-1-l1",
            title: "Leitura de Fluxo de Caixa com IA",
            icon: "LineChart",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "Transformando números em decisões",
              },
              {
                type: "text",
                text: "A IA pode ajudar a ler extratos, tabelas e categorias de despesas para encontrar padrões: sazonalidade, gastos recorrentes, gargalos de caixa e sinais de risco. O papel da IA não é substituir o financeiro, mas acelerar a leitura e tornar as perguntas melhores.",
              },
              {
                type: "quote",
                text: '"Separe observação factual de recomendação: primeiro o que os dados mostram, depois o que fazer."',
              },
              {
                type: "text",
                text: "Um bom prompt financeiro pede período analisado, categorias, limites, premissas e formato de saída com alertas, oportunidades e próximas ações.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual é uma boa forma de usar IA em fluxo de caixa?",
                options: [
                  { letter: "A", text: "Pedir para inventar saldos sem dados." },
                  {
                    letter: "B",
                    text: "Identificar padrões, recorrências, riscos e oportunidades a partir de dados fornecidos.",
                  },
                  { letter: "C", text: "Substituir conciliacao bancaria sem conferencia." },
                  { letter: "D", text: "Ignorar premissas e periodo analisado." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Por que separar fatos de recomendações em análises financeiras?",
                options: [
                  {
                    letter: "A",
                    text: "Para deixar claro o que veio dos dados e o que é sugestão de ação.",
                  },
                  { letter: "B", text: "Para esconder erros." },
                  { letter: "C", text: "Para aumentar o tamanho do relatório sem motivo." },
                  { letter: "D", text: "Para impedir revisao humana." },
                ],
                correct: "A",
              },
            ],
          },
          {
            id: "fin-mod-1-l2",
            title: "Cenários, Orçamento e Risco",
            icon: "ShieldCheck",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Simular antes de decidir",
              },
              {
                type: "text",
                text: "Com IA, você pode testar cenários como queda de receita, aumento de custos, inadimplência ou contratação de uma nova ferramenta. O modelo ajuda a estruturar hipóteses e explicar impacto, mas os números finais devem ser conferidos em planilha ou sistema financeiro.",
              },
              {
                type: "quote",
                text: '"Cenário financeiro bom sempre mostra premissas, faixa de variação e risco de erro."',
              },
              {
                type: "text",
                text: "Use prompts que peçam melhor caso, caso base e pior caso, incluindo gatilhos de decisao e indicadores que devem ser monitorados.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que um bom cenário financeiro deve explicitar?",
                options: [
                  { letter: "A", text: "Premissas, variações, impacto e risco de erro." },
                  { letter: "B", text: "Apenas uma previsao otimista." },
                  { letter: "C", text: "Somente opinioes sem dados." },
                  { letter: "D", text: "Resultados sem possibilidade de revisao." },
                ],
                correct: "A",
              },
              {
                id: 2,
                question: "Qual cuidado é essencial ao usar IA para orçamento?",
                options: [
                  {
                    letter: "A",
                    text: "Conferir os números finais em fonte financeira confiável.",
                  },
                  { letter: "B", text: "Aceitar qualquer resultado sem validar." },
                  { letter: "C", text: "Nunca informar premissas." },
                  { letter: "D", text: "Misturar moedas e periodos." },
                ],
                correct: "A",
              },
            ],
          },
        ],
      },
    ],
  },
  "ai-marketing": {
    id: "ai-marketing",
    title: "IA para Marketing",
    modules: [
      {
        id: "mkt-mod-1",
        title: "Módulo 1: Estratégia e Conteúdo com IA",
        lessons: [
          {
            id: "mkt-mod-1-l1",
            title: "Pesquisa de Público e Persona",
            icon: "Target",
            duration: "12 min",
            content: [
              {
                type: "heading",
                text: "Marketing bom começa com pergunta boa",
              },
              {
                type: "text",
                text: "A IA ajuda a transformar entrevistas, reviews, comentários e dados de CRM em segmentos de público. Ela pode identificar dores, desejos, objeções, linguagem do cliente e momentos de decisão. Quanto mais real for a entrada, menos genérica será a persona.",
              },
              {
                type: "quote",
                text: '"Persona gerada sem evidência vira personagem. Persona gerada com dados vira ferramenta de decisão."',
              },
              {
                type: "text",
                text: "Peça para a IA citar evidencias, separar segmentos e listar mensagens que devem ser testadas em campanha.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual entrada melhora muito a criação de personas com IA?",
                options: [
                  { letter: "A", text: "Comentários reais, entrevistas, reviews e dados de CRM." },
                  { letter: "B", text: "Apenas pedir uma persona generica." },
                  { letter: "C", text: "Não informar produto nem público." },
                  { letter: "D", text: "Usar somente slogans prontos." },
                ],
                correct: "A",
              },
              {
                id: 2,
                question: "O que diferencia persona util de personagem inventado?",
                options: [
                  {
                    letter: "A",
                    text: "Evidência concreta que sustenta dores, desejos e linguagem.",
                  },
                  { letter: "B", text: "Nome bonito e foto ilustrativa." },
                  { letter: "C", text: "Texto longo sem dados." },
                  { letter: "D", text: "Uso de termos tecnicos sem aplicacao." },
                ],
                correct: "A",
              },
            ],
          },
          {
            id: "mkt-mod-1-l2",
            title: "Campanhas, Copy e Testes A/B",
            icon: "Megaphone",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "Criatividade com critério",
              },
              {
                type: "text",
                text: "A IA pode gerar anúncios, emails, landing pages e variações de copy rapidamente. O valor aparece quando cada versão testa uma hipótese clara: preço, urgência, prova social, dor principal, benefício ou garantia.",
              },
              {
                type: "quote",
                text: '"Não teste dez frases aleatórias. Teste dez hipóteses de comportamento."',
              },
              {
                type: "text",
                text: "Um prompt de campanha deve incluir canal, público, oferta, objeções, tom de voz, restrições legais e métrica principal de sucesso.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que uma boa variacao de teste A/B deve mudar?",
                options: [
                  {
                    letter: "A",
                    text: "Uma hipótese clara, como benefício principal ou prova social.",
                  },
                  { letter: "B", text: "Tudo ao mesmo tempo sem criterio." },
                  { letter: "C", text: "Apenas cor de fundo sempre." },
                  { letter: "D", text: "Nada, para manter resultados iguais." },
                ],
                correct: "A",
              },
              {
                id: 2,
                question: "Quais dados ajudam a IA a criar copy mais precisa?",
                options: [
                  {
                    letter: "A",
                    text: "Canal, público, oferta, objeções, tom de voz e métrica de sucesso.",
                  },
                  { letter: "B", text: "Somente a frase 'faca um anuncio legal'." },
                  { letter: "C", text: "A senha das contas de anuncio." },
                  { letter: "D", text: "Nenhuma informacao sobre produto." },
                ],
                correct: "A",
              },
            ],
          },
        ],
      },
    ],
  },
  "ai-project-management": {
    id: "ai-project-management",
    title: "IA para Projetos",
    modules: [
      {
        id: "pm-mod-1",
        title: "Módulo 1: Gestão de Projetos com IA",
        lessons: [
          {
            id: "pm-mod-1-l1",
            title: "Escopo, Backlog e Priorização",
            icon: "Kanban",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "Da ideia solta ao backlog executável",
              },
              {
                type: "text",
                text: "A IA pode transformar uma conversa confusa em épicos, histórias, critérios de aceite e riscos. Para isso, informe objetivo do produto, usuários, restrições, prazo e o que está fora do escopo.",
              },
              {
                type: "quote",
                text: '"Backlog bom nao e lista gigante: e uma sequencia de decisoes priorizadas."',
              },
              {
                type: "text",
                text: "Peça para a IA classificar itens por impacto, esforço, dependência e risco. Depois valide com time técnico e stakeholders.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Como a IA ajuda na criação de backlog?",
                options: [
                  {
                    letter: "A",
                    text: "Convertendo objetivos em épicos, histórias, critérios de aceite e riscos.",
                  },
                  { letter: "B", text: "Eliminando toda conversa com stakeholders." },
                  { letter: "C", text: "Criando tarefas infinitas sem prioridade." },
                  { letter: "D", text: "Substituindo validacao tecnica." },
                ],
                correct: "A",
              },
              {
                id: 2,
                question: "Quais critérios ajudam a priorizar backlog com IA?",
                options: [
                  { letter: "A", text: "Impacto, esforço, dependência e risco." },
                  { letter: "B", text: "Ordem alfabetica." },
                  { letter: "C", text: "Tamanho do titulo da tarefa." },
                  { letter: "D", text: "Preferencia aleatoria do modelo." },
                ],
                correct: "A",
              },
            ],
          },
          {
            id: "pm-mod-1-l2",
            title: "Reuniões, Riscos e Status Report",
            icon: "CalendarCheck",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Menos reunião perdida, mais decisão registrada",
              },
              {
                type: "text",
                text: "A IA pode resumir reuniões, extrair decisões, donos, prazos, bloqueios e riscos. Também pode transformar notas soltas em status report executivo com semáforo, progresso, próximas ações e pedidos de decisão.",
              },
              {
                type: "quote",
                text: '"Toda reunião deve sair com decisões, responsáveis e data. A IA ajuda a não perder isso no ruído."',
              },
              {
                type: "text",
                text: "Um bom prompt de status pede fatos verificados, mudanças desde a última atualização, riscos com impacto e ações que precisam de patrocínio.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que a IA deve extrair de uma reunião de projeto?",
                options: [
                  { letter: "A", text: "Decisões, responsáveis, prazos, bloqueios e riscos." },
                  { letter: "B", text: "Somente piadas ditas na chamada." },
                  { letter: "C", text: "Dados que nao foram mencionados." },
                  { letter: "D", text: "Senhas e informações sensíveis sem necessidade." },
                ],
                correct: "A",
              },
              {
                id: 2,
                question: "O que torna um status report executivo util?",
                options: [
                  {
                    letter: "A",
                    text: "Progresso, riscos, próximas ações e decisões necessárias.",
                  },
                  { letter: "B", text: "Texto longo sem conclusao." },
                  { letter: "C", text: "Apenas elogios ao projeto." },
                  { letter: "D", text: "Detalhes irrelevantes sem prioridade." },
                ],
                correct: "A",
              },
            ],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // NOVAS CATEGORIAS BASEADAS EM SKILLS.SH
  // ════════════════════════════════════════════════════════════════════════

  desenvolvimento: {
    id: "desenvolvimento",
    title: "Desenvolvimento",
    modules: [
      {
        id: "dev-mod-1",
        title: "Módulo 1: Qualidade e Testes de Código",
        lessons: [
          {
            id: "dev-mod-1-l1",
            title: "Test-Driven Development (TDD)",
            icon: "CheckSquare",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "O Ciclo Red-Green-Refactor",
              },
              {
                type: "text",
                text: "TDD é uma metodologia onde você escreve o teste antes do código de produção. O ciclo é simples: primeiro escreva um teste que falha (Red), depois escreva o código mínimo para passar (Green), e por fim refatore o código mantendo os testes verdes (Refactor). Isso garante que seu código seja testável desde o início.",
              },
              {
                type: "quote",
                text: '"TDD nao e sobre testar tudo — e sobre projetar seu codigo para ser testavel, o que naturalmente leva a um design mais limpo e desacoplado."',
              },
              {
                type: "text",
                text: "Ferramentas como Vitest, Jest e Testing Library sao as mais usadas no ecossistema JavaScript para implementar TDD. No ecossistema Python, pytest e unittest cumprem o mesmo papel.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual é a ordem correta do ciclo TDD?",
                options: [
                  { letter: "A", text: "Codigo → Teste → Refactor" },
                  { letter: "B", text: "Teste que falha → Código mínimo → Refactor" },
                  { letter: "C", text: "Refactor → Teste → Codigo" },
                  { letter: "D", text: "Teste que passa → Codigo → Otimizar" },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual o principal benefício do TDD além da detecção de bugs?",
                options: [
                  { letter: "A", text: "Eliminar a necessidade de documentação." },
                  { letter: "B", text: "Forçar um design de código mais limpo e desacoplado." },
                  { letter: "C", text: "Aumentar a velocidade de escrita de código." },
                  { letter: "D", text: "Substituir a necessidade de code review." },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "dev-mod-1-l2",
            title: "Diagnose e Debugging Sistematico",
            icon: "Bug",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "O Loop de Diagnostico Disciplinado",
              },
              {
                type: "text",
                text: "Debugging eficiente segue um ciclo: Reproduza o bug de forma consistente, Minimize o cenário removendo código irrelevante até isolar a causa raiz, Hipotetize sobre o que está errado, Instrumente com logs ou ferramentas para confirmar, Corrija com a menor mudança possível, e por fim Teste regressão para garantir que nada quebrou.",
              },
              {
                type: "quote",
                text: '"A maior parte do tempo em debugging é gasto tentando reproduzir o bug. Se você não consegue reproduzir sob demanda, você não pode prová-lo resolvido."',
              },
              {
                type: "text",
                text: "Ferramentas como Chrome DevTools, VS Code Debugger, e extensões como React DevTools são essenciais para instrumentar e identificar problemas em aplicações web.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual é o primeiro passo no loop de diagnóstico?",
                options: [
                  { letter: "A", text: "Corrigir o codigo imediatamente." },
                  { letter: "B", text: "Reproduzir o bug de forma consistente." },
                  { letter: "C", text: "Adicionar logs no codigo." },
                  { letter: "D", text: "Pedir ajuda para outro desenvolvedor." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "O que significa 'Minimizar' no contexto de debugging?",
                options: [
                  { letter: "A", text: "Reduzir o tamanho da fonte no editor." },
                  { letter: "B", text: "Remover codigo irrelevante para isolar a causa raiz." },
                  { letter: "C", text: "Minimizar a janela do navegador." },
                  { letter: "D", text: "Usar menos ferramentas de debugging." },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
      {
        id: "dev-mod-2",
        title: "Módulo 2: Frameworks Modernos e Boas Práticas",
        lessons: [
          {
            id: "dev-mod-2-l1",
            title: "React Best Practices no Ecossistema Vercel",
            icon: "Globe",
            duration: "16 min",
            content: [
              {
                type: "heading",
                text: "React Moderno: Server Components e Streaming",
              },
              {
                type: "text",
                text: "O ecossistema React moderno, especialmente com Vercel, introduziu conceitos como Server Components (componentes que rodam no servidor), Data Fetching com Server Actions, Streaming com Suspense boundaries, e otimização de Core Web Vitals. Saber quando usar cada abordagem é essencial para construir aplicações performáticas.",
              },
              {
                type: "quote",
                text: '"Server Components permitem que você mantenha lógica pesada e acesso a banco de dados no servidor, enviando apenas o HTML final para o cliente. Menos JavaScript, mais velocidade."',
              },
              {
                type: "text",
                text: "O Edge Runtime da Vercel permite executar código em servidores distribuídos globalmente, reduzindo a latência para usuários em qualquer região do mundo.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual a principal vantagem dos Server Components no React?",
                options: [
                  { letter: "A", text: "Eles rodam mais rápido no cliente." },
                  {
                    letter: "B",
                    text: "Eles executam no servidor e enviam apenas HTML, reduzindo JavaScript.",
                  },
                  { letter: "C", text: "Eles substituem a necessidade de CSS." },
                  { letter: "D", text: "Eles funcionam apenas com bancos NoSQL." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "O que e o Edge Runtime no contexto da Vercel?",
                options: [
                  {
                    letter: "A",
                    text: "Um ambiente de execução distribuído globalmente para baixa latência.",
                  },
                  { letter: "B", text: "Uma biblioteca de componentes React prontos." },
                  { letter: "C", text: "Um editor de codigo online." },
                  { letter: "D", text: "Um sistema de banco de dados em memoria." },
                ],
                correct: "A",
              },
            ],
          },
          {
            id: "dev-mod-2-l2",
            title: "Web App Testing com Playwright e Vitest",
            icon: "ShieldCheck",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Testes em Multiplos Niveis",
              },
              {
                type: "text",
                text: "Uma estratégia completa de testes envolve três níveis: testes unitários (Vitest) para funções e hooks, testes de componente (React Testing Library) para verificar comportamento de componentes, e testes E2E (Playwright) para simular fluxos completos do usuário no navegador. Cada nível tem seu propósito e juntos formam a pirâmide de testes.",
              },
              {
                type: "quote",
                text: '"Testes E2E são os mais lentos e caros — use-os para fluxos críticos. Invista mais em testes unitários e de componente, que são rápidos e focados."',
              },
              {
                type: "text",
                text: "Playwright permite testar em vários navegadores (Chromium, Firefox, WebKit) com uma única API, incluindo recursos como gravação de vídeo e captura de traces para debugging.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual a ordem recomendada da pirâmide de testes?",
                options: [
                  { letter: "A", text: "Mais testes E2E, menos unitários." },
                  { letter: "B", text: "Mais testes unitários, menos E2E." },
                  { letter: "C", text: "Apenas testes de componente." },
                  { letter: "D", text: "Apenas testes E2E." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual biblioteca é recomendada para testes E2E em vários navegadores?",
                options: [
                  { letter: "A", text: "Jest" },
                  { letter: "B", text: "React Testing Library" },
                  { letter: "C", text: "Playwright" },
                  { letter: "D", text: "Mocha" },
                ],
                correct: "C",
              },
            ],
          },
        ],
      },
      {
        id: "dev-mod-3",
        title: "Módulo 3: Infraestrutura de Dados e Backend",
        lessons: [
          {
            id: "dev-mod-3-l1",
            title: "Supabase e PostgreSQL — Boas Práticas",
            icon: "Database",
            duration: "16 min",
            content: [
              {
                type: "heading",
                text: "Backend como Serviço com Supabase",
              },
              {
                type: "text",
                text: "Supabase é uma plataforma open source que oferece banco de dados PostgreSQL, autenticação, storage e Edge Functions. As boas práticas incluem: design de esquemas com normalização adequada, implementação de Row-Level Security (RLS) para segurança em nível de linha, uso de real-time subscriptions para dados ao vivo, e estratégias de migração com ferramentas como Prisma ou migrations SQL.",
              },
              {
                type: "quote",
                text: "\"RLS no Supabase permite que você defina políticas de acesso diretamente no banco: 'um usuário só pode ver suas próprias tarefas'. A segurança é aplicada no banco, não no código.\"",
              },
              {
                type: "text",
                text: "Edge Functions do Supabase (baseadas em Deno) permitem executar lógica de servidor perto do usuário, ideais para webhooks e integrações com serviços externos.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que e Row-Level Security (RLS) no Supabase?",
                options: [
                  { letter: "A", text: "Um sistema de criptografia de senhas." },
                  {
                    letter: "B",
                    text: "Políticas de acesso aplicadas diretamente no banco para controlar quem vê cada linha.",
                  },
                  { letter: "C", text: "Um firewall de rede para o banco de dados." },
                  { letter: "D", text: "Uma ferramenta de backup automatico." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Em qual runtime as Edge Functions do Supabase sao baseadas?",
                options: [
                  { letter: "A", text: "Node.js" },
                  { letter: "B", text: "Python" },
                  { letter: "C", text: "Deno" },
                  { letter: "D", text: "Bun" },
                ],
                correct: "C",
              },
            ],
          },
          {
            id: "dev-mod-3-l2",
            title: "Skill Creator e Automação de Ferramentas",
            icon: "Wand2",
            duration: "12 min",
            content: [
              {
                type: "heading",
                text: "Criando Skills para Agentes de IA",
              },
              {
                type: "text",
                text: "Skills são instruções modulares que estendem as capacidades de agentes de IA como Claude Code e Cursor. Criar uma skill envolve definir um nome, descrição, instruções claras de comportamento, e recursos auxiliares. O ecossistema de skills permite que desenvolvedores compartilhem e reutilizem comportamentos especializados.",
              },
              {
                type: "quote",
                text: '"Uma boa skill resolve um problema específico de forma declarativa — não diga como fazer, diga o que fazer e deixe o agente decidir a implementação."',
              },
              {
                type: "text",
                text: "O Skill Creator da Anthropic fornece templates e validação automática para garantir que sua skill siga as melhores práticas do ecossistema.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual é a estrutura básica de uma skill para agentes de IA?",
                options: [
                  { letter: "A", text: "Nome, descrição, instruções e recursos auxiliares." },
                  { letter: "B", text: "Apenas um arquivo de codigo fonte." },
                  { letter: "C", text: "Um arquivo binario compilado." },
                  { letter: "D", text: "Uma URL e uma chave de API." },
                ],
                correct: "A",
              },
              {
                id: 2,
                question: "Qual filosofias uma boa skill deve seguir?",
                options: [
                  { letter: "A", text: "Ser o mais genérica possível para cobrir todos os casos." },
                  { letter: "B", text: "Resolver um problema específico de forma declarativa." },
                  { letter: "C", text: "Exigir acesso total ao sistema operacional." },
                  { letter: "D", text: "Ser escrita apenas em Python." },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
    ],
  },

  "design-ui": {
    id: "design-ui",
    title: "Design & UI",
    modules: [
      {
        id: "dui-mod-1",
        title: "Modulo 1: Design Visual Premium",
        lessons: [
          {
            id: "dui-mod-1-l1",
            title: "High-End Visual Design",
            icon: "Palette",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "Fazendo um Site Parecer Caro",
              },
              {
                type: "text",
                text: "Design visual de alto nivel vai alem de escolher cores bonitas. Envolve um sistema intencional de tipografia (hierarquia, contrastes, pares de fontes), espacamento (ritmo vertical consistente), sombras e elevacao (profundidade), estrutura de cards, micro-interacoes, e paleta de cores estrategica. Cada elemento deve ter um proposito.",
              },
              {
                type: "quote",
                text: '"Design caro e design onde cada pixel tem intencao. Nada e aleatorio — desde o tracking do texto ate o raio da borda de um card, tudo e decidido por um sistema."',
              },
              {
                type: "text",
                text: "Ferramentas como Figma sao usadas para criar design systems, enquanto Tailwind CSS permite implementar esses sistemas no codigo com consistencia.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que faz um design parecer 'caro' ou premium?",
                options: [
                  { letter: "A", text: "Usar muitas cores e animacoes." },
                  {
                    letter: "B",
                    text: "Um sistema intencional com tipografia, espacamento, sombras e hierarquia consistentes.",
                  },
                  { letter: "C", text: "Ter muitos efeitos de vidro e blur." },
                  { letter: "D", text: "Usar imagens de banco de imagens." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual ferramenta e comumente usada para criar Design Systems?",
                options: [
                  { letter: "A", text: "Photoshop" },
                  { letter: "B", text: "Figma" },
                  { letter: "C", text: "Illustrator" },
                  { letter: "D", text: "Blender" },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "dui-mod-1-l2",
            title: "Design Taste — Anti-Slop Frontend",
            icon: "Paintbrush",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "Evitando o Generic AI Design",
              },
              {
                type: "text",
                text: "O 'Design Taste' e uma abordagem que visa evitar interfaces genericas que parecem templates prontos. As tecnicas incluem: audit-first (avaliar o design atual antes de mudar), pre-flight check (verificar se o design atende criterios de qualidade antes de finalizar), e aplicacao de principios de design intencional em vez de depender de defaults de frameworks.",
              },
              {
                type: "quote",
                text: '"Se parece com um template que qualquer um poderia ter feito, nao e design — e apenas marcacao. Bom design exige decisao visual em cada elemento."',
              },
              {
                type: "text",
                text: "Esta abordagem e especialmente importante ao usar geradores de codigo por IA, que tendem a produzir layouts seguros e genericos se nao forem guiados por principios de design.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que significa 'audit-first' no contexto de Design Taste?",
                options: [
                  { letter: "A", text: "Auditar o orcamento do projeto antes de comecar." },
                  { letter: "B", text: "Avaliar o design atual antes de fazer mudancas." },
                  { letter: "C", text: "Entrevistar usuarios antes de projetar." },
                  { letter: "D", text: "Testar acessibilidade com ferramentas automaticas." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Por que geradores de IA tendem a produzir designs genericos?",
                options: [
                  { letter: "A", text: "Por que eles nao tem acesso a imagens." },
                  {
                    letter: "B",
                    text: "Por que eles optam por layouts seguros e comuns sem orientacao especifica.",
                  },
                  { letter: "C", text: "Por que eles so usam preto e branco." },
                  { letter: "D", text: "Por que eles nao suportam CSS moderno." },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
      {
        id: "dui-mod-2",
        title: "Modulo 2: Branding e Design de Produto",
        lessons: [
          {
            id: "dui-mod-2-l1",
            title: "Brand Kit — Identidade de Marca",
            icon: "Trophy",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Construindo uma Identidade Visual Coesa",
              },
              {
                type: "text",
                text: "Um Brand Kit e o conjunto de diretrizes que define a identidade visual de uma marca: paleta de cores (primarias, secundarias, neutras), tipografia (fontes para titulos, corpo e codigo), sistema de logos (variacoes horizontal, vertical, icone), tom de voz, e aplicacoes praticas. Um bom brand kit garante consistencia em todos os pontos de contato.",
              },
              {
                type: "quote",
                text: '"Marca nao e o que voce diz que ela e — marca e o que o cliente percebe. O brand kit e o manual para garantir que essa percepcao seja consistente."',
              },
              {
                type: "text",
                text: "Ferramentas como sistemas de design no Figma e plataformas como Zeroheight ajudam a documentar e compartilhar brand kits com equipes inteiras.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que um Brand Kit tipicamente inclui?",
                options: [
                  { letter: "A", text: "Apenas o logo da empresa." },
                  {
                    letter: "B",
                    text: "Paleta de cores, tipografia, sistema de logos, tom de voz e aplicacoes.",
                  },
                  { letter: "C", text: "Apenas as cores da marca." },
                  { letter: "D", text: "Um manual de funcionarios." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual o principal objetivo de um Brand Kit?",
                options: [
                  { letter: "A", text: "Aumentar o valor das acoes da empresa." },
                  {
                    letter: "B",
                    text: "Garantir consistencia visual em todos os pontos de contato da marca.",
                  },
                  { letter: "C", text: "Substituir o departamento de marketing." },
                  { letter: "D", text: "Criar um manual juridico para a marca." },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "dui-mod-2-l2",
            title: "Frontend Design e Diretrizes de UI",
            icon: "Layout",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "Sistemas de Design e Acessibilidade",
              },
              {
                type: "text",
                text: "Frontend Design vai alem da aparencia — e sobre criar sistemas de componentes reutilizaveis com acessibilidade incorporada. Diretrizes incluem: design responsivo (mobile-first), suporte a teclado e leitores de tela (WCAG), contraste de cores adequado, estados de interacao (hover, focus, active, disabled), e consistencia de interacao em toda a aplicacao.",
              },
              {
                type: "quote",
                text: '"Acessibilidade nao e um recurso — e um requisito. Um design que funciona para todos e simplesmente um design melhor."',
              },
              {
                type: "text",
                text: "Ferramentas como Storybook permitem desenvolver e documentar componentes de forma isolada, garantindo que cada peca do sistema de design funcione corretamente.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual abordagem de design responsivo e recomendada atualmente?",
                options: [
                  { letter: "A", text: "Desktop-first." },
                  { letter: "B", text: "Mobile-first." },
                  { letter: "C", text: "Apenas desktop." },
                  { letter: "D", text: "Apenas mobile." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question:
                  "Qual ferramenta e usada para desenvolver componentes de UI de forma isolada?",
                options: [
                  { letter: "A", text: "Figma" },
                  { letter: "B", text: "Storybook" },
                  { letter: "C", text: "Photoshop" },
                  { letter: "D", text: "Webflow" },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
    ],
  },

  "ia-media": {
    id: "ia-media",
    title: "IA & Media",
    modules: [
      {
        id: "mid-mod-1",
        title: "Modulo 1: Geracao de Conteudo com IA",
        lessons: [
          {
            id: "mid-mod-1-l1",
            title: "Geracao de Imagens com IA",
            icon: "Image",
            duration: "16 min",
            content: [
              {
                type: "heading",
                text: "Modelos de Difusao e Engenharia de Prompt Visual",
              },
              {
                type: "text",
                text: "Modelos de geracao de imagem como Flux, DALL-E 3 e Stable Diffusion funcionam atraves de difusao: eles comecam com ruido aleatorio e gradualmente o removem, guiados por uma descricao textual. Para obter resultados de qualidade, o prompt precisa descrever: o sujeito principal, o estilo visual (fotografia, ilustracao 3D, pintura a oleo), a iluminacao, a composicao e as proporcoes.",
              },
              {
                type: "quote",
                text: "\"Um prompt de imagem eficaz e como uma direcao de arte: quanto mais especifico voce for sobre o que quer, menos espaco o modelo tera para 'alucinar' elementos indesejados.\"",
              },
              {
                type: "text",
                text: "Tecnicas avancadas incluem ControlNet para controle de pose, inpainting para editar partes especificas da imagem, e img2img para transformar uma imagem existente em algo novo.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Como funcionam os modelos de difusao para geracao de imagens?",
                options: [
                  { letter: "A", text: "Eles copiam imagens existentes da internet." },
                  {
                    letter: "B",
                    text: "Eles comecam com ruido e gradualmente o removem guiados por um prompt textual.",
                  },
                  { letter: "C", text: "Eles desenham pixel por pixel usando regras matematicas." },
                  {
                    letter: "D",
                    text: "Eles usam redes neurais para colorir rascunhos em preto e branco.",
                  },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "O que e ControlNet no contexto de geracao de imagens?",
                options: [
                  { letter: "A", text: "Uma ferramenta para controlar a temperatura do modelo." },
                  {
                    letter: "B",
                    text: "Uma tecnica para controlar a pose e estrutura de personagens na imagem gerada.",
                  },
                  { letter: "C", text: "Um filtro de cores aplicado apos a geracao." },
                  { letter: "D", text: "Um tipo de rede neural para deteccao de objetos." },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "mid-mod-1-l2",
            title: "Geracao de Videos e Musica com IA",
            icon: "Video",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Texto-para-Video e Composicao Musical",
              },
              {
                type: "text",
                text: "A geracao de videos com IA (como Kling 3.0 e WAN 2.7) permite criar clips a partir de descricoes textuais, alem de editar, estender e aplicar efeitos em videos existentes. A geracao musical com ElevenLabs e outras ferramentas permite compor musicas royalty-free com controle de estilo e genero, ideal para trilhas sonoras de projetos.",
              },
              {
                type: "quote",
                text: '"A geracao de video por IA ainda enfrenta desafios de consistencia temporal — manter a aparencia de objetos e personagens ao longo de varios frames."',
              },
              {
                type: "text",
                text: "A sincronizacao labial (lip-sync) movida a IA permite dublar automaticamente videos em varios idiomas, preservando a sincronia dos labios com o audio traduzido.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual e um dos principais desafios da geracao de video por IA?",
                options: [
                  { letter: "A", text: "Alta resolucao insuficiente." },
                  {
                    letter: "B",
                    text: "Consistencia temporal de objetos e personagens entre frames.",
                  },
                  { letter: "C", text: "Falta de suporte a cores." },
                  { letter: "D", text: "Impossibilidade de exportar em MP4." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual tecnologia permite dublar videos preservando a sincronia labial?",
                options: [
                  { letter: "A", text: "Text-to-Speech" },
                  { letter: "B", text: "Lip-sync com IA" },
                  { letter: "C", text: "Legendas automaticas" },
                  { letter: "D", text: "Traducao simultanea" },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
      {
        id: "mid-mod-2",
        title: "Modulo 2: Edicao e Avatares com IA",
        lessons: [
          {
            id: "mid-mod-2-l1",
            title: "Edicao Avancada de Imagens com IA",
            icon: "Scissors",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "Inpainting, Outpainting e Relighting",
              },
              {
                type: "text",
                text: "As tecnicas de edicao com IA vao muito alem de filtros. Inpainting permite remover ou substituir objetos especificos em uma imagem. Outpainting estende a imagem alem de suas bordas originais, criando novo conteudo que se integra a cena. Relighting ajusta a iluminacao de uma foto para combinar com uma nova cena ou horario.",
              },
              {
                type: "quote",
                text: '"Inpainting e a versao IA do Photoshop — mas em vez de clonar pixels vizinhos, o modelo realmente entende o contexto e gera conteudo novo que faz sentido na cena."',
              },
              {
                type: "text",
                text: "Ferramentas como ControlNet permitem controle ainda mais preciso, como definir a pose exata de uma pessoa na imagem gerada atraves de deteccao de esqueleto (OpenPose).",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual a diferencia entre inpainting e outpainting?",
                options: [
                  {
                    letter: "A",
                    text: "Inpainting edita dentro da imagem; outpainting estende alem das bordas.",
                  },
                  { letter: "B", text: "Inpainting adiciona cor; outpainting remove cor." },
                  { letter: "C", text: "Ambos sao a mesma coisa." },
                  { letter: "D", text: "Inpainting e para videos; outpainting para imagens." },
                ],
                correct: "A",
              },
              {
                id: 2,
                question: "O que e OpenPose no contexto de geracao de imagens?",
                options: [
                  { letter: "A", text: "Uma ferramenta de edicao de poses de yoga." },
                  {
                    letter: "B",
                    text: "Deteccao de esqueleto para controlar a pose de personagens.",
                  },
                  { letter: "C", text: "Um filtro artistico para fotos." },
                  { letter: "D", text: "Um banco de dados de poses humanas." },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "mid-mod-2-l2",
            title: "Avatares e Audio com IA",
            icon: "UserCircle",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "Criacao de Avatares Realistas e Vozes Sinteticas",
              },
              {
                type: "text",
                text: "Avatares de IA sao gerados a partir de uma foto real e depois animados com text-to-speech natural. A tecnologia de lip-sync sincroniza os movimentos da boca com o audio gerado, criando a ilusao de que o avatar esta realmente falando. As aplicacoes incluem apresentacoes corporativas, videos de marketing, tutoriais educacionais e conteudo para redes sociais.",
              },
              {
                type: "quote",
                text: '"Avatares com IA estao democratizando a producao de video — qualquer um pode criar um apresentador virtual sem precisar de equipamento de estidio ou atores."',
              },
              {
                type: "text",
                text: "Plataformas como HeyGen, Synthesia e D-ID oferecem criacao de avatares com suporte a multiplos idiomas, permitindo que um unico video seja traduzido e dublado para diversos mercados.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Como avatares de IA sao tipicamente criados?",
                options: [
                  { letter: "A", text: "Desenhando manualmente cada frame." },
                  {
                    letter: "B",
                    text: "Gerados a partir de uma foto real e animados com text-to-speech.",
                  },
                  { letter: "C", text: "Escaneamento 3D com cameras especiais." },
                  { letter: "D", text: "Selecionados de uma biblioteca de avatares pre-prontos." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual tecnologia sincroniza o movimento dos labios com o audio gerado?",
                options: [
                  { letter: "A", text: "Text-to-Speech" },
                  { letter: "B", text: "Reconhecimento facial" },
                  { letter: "C", text: "Lip-sync com IA" },
                  { letter: "D", text: "Geracao de legendas" },
                ],
                correct: "C",
              },
            ],
          },
        ],
      },
    ],
  },

  "cloud-infra": {
    id: "cloud-infra",
    title: "Cloud & Infra",
    modules: [
      {
        id: "cin-mod-1",
        title: "Modulo 1: Cloud Computing com Azure",
        lessons: [
          {
            id: "cin-mod-1-l1",
            title: "Azure Kubernetes Service (AKS)",
            icon: "Box",
            duration: "16 min",
            content: [
              {
                type: "heading",
                text: "Orquestracao de Containers na Nuvem",
              },
              {
                type: "text",
                text: "O Azure Kubernetes Service (AKS) simplifica o gerenciamento de clusters Kubernetes na nuvem Microsoft. Ele cuida de tarefas complexas como provisionamento de nos, atualizacoes de versao, escalonamento automatico e monitoramento integrado. AKS permite que equipes foquem no desenvolvimento de aplicacoes enquanto a Microsoft gerencia o plano de controle.",
              },
              {
                type: "quote",
                text: '"Kubernetes nao e sobre containers — e sobre orquestracao: garantir que o estado real do seu sistema corresponda ao estado desejado que voce declarou."',
              },
              {
                type: "text",
                text: "Estrategias de deploy como rolling update, blue-green e canary podem ser implementadas no AKS para minimizar downtime durante atualizacoes.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que o AKS gerencia automaticamente?",
                options: [
                  { letter: "A", text: "O codigo da aplicacao." },
                  { letter: "B", text: "Provisionamento de nos, atualizacoes e escalonamento." },
                  { letter: "C", text: "O banco de dados da aplicacao." },
                  { letter: "D", text: "A autenticacao dos usuarios." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual estrategia de deploy minimiza downtime durante atualizacoes?",
                options: [
                  { letter: "A", text: "Recreate (recriar todos os pods)." },
                  { letter: "B", text: "Blue-green ou canary." },
                  { letter: "C", text: "Rollback automatico." },
                  { letter: "D", text: "Deploy em horario comercial." },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "cin-mod-1-l2",
            title: "Seguranca no Azure — Entra ID e RBAC",
            icon: "Shield",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Identity, Access Management e Compliance",
              },
              {
                type: "text",
                text: "A seguranca no Azure comeca com o Entra ID (formerly Azure AD) para gerenciamento de identidades, RBAC (Role-Based Access Control) para controle de acesso granulado, Key Vault para gerenciamento centralizado de segredos e certificados, e o Microsoft Defender for Cloud para monitoramento continuo de ameacas. A conformidade com frameworks como SOC 2, ISO 27001 e HIPAA e facilitada por ferramentas nativas.",
              },
              {
                type: "quote",
                text: '"No modelo de responsabilidade compartilhada da nuvem, a Microsoft garante a seguranca da nuvem — voce e responsavel pela seguranca dentro da nuvem."',
              },
              {
                type: "text",
                text: "Network Security Groups (NSGs) funcionam como firewalls distribuidos, permitindo controlar o trafego de entrada e saida para recursos de rede no Azure.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual servico do Azure gerencia identidades e acessos?",
                options: [
                  { letter: "A", text: "Azure SQL" },
                  { letter: "B", text: "Entra ID" },
                  { letter: "C", text: "Azure Functions" },
                  { letter: "D", text: "Azure DevOps" },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "O que significa 'responsabilidade compartilhada' na nuvem?",
                options: [
                  { letter: "A", text: "O provedor cuida de tudo." },
                  { letter: "B", text: "O cliente e responsavel por tudo." },
                  {
                    letter: "C",
                    text: "O provedor garante a seguranca da nuvem; o cliente, a seguranca dentro dela.",
                  },
                  { letter: "D", text: "Nenhuma das alternativas." },
                ],
                correct: "C",
              },
            ],
          },
        ],
      },
      {
        id: "cin-mod-2",
        title: "Modulo 2: Otimizacao e Linux na Nuvem",
        lessons: [
          {
            id: "cin-mod-2-l1",
            title: "Cost Optimization e FinOps no Azure",
            icon: "Coins",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "Gerenciando Custos na Nuvem",
              },
              {
                type: "text",
                text: "Otimizacao de custos em nuvem (FinOps) envolve varias estrategias: analise de custos com Azure Cost Management, configuracao de budgets e alertas, uso de Reserved Instances e Savings Plans para descontos por compromisso de uso, rightsizing de recursos subutilizados, e escolha de tiers de armazenamento adequados. Uma abordagem FinOps disciplinada pode reduzir custos em 30-50%.",
              },
              {
                type: "quote",
                text: '"O maior custo na nuvem nao e o que voce usa — e o que voce provisiona mas nao usa. Instancias esquecidas rodando 24/7 sao a maior fonte de desperdicio."',
              },
              {
                type: "text",
                text: "Ferramentas como Azure Advisor fornecem recomendacoes personalizadas de otimizacao baseadas nos seus padroes de uso.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual e a maior fonte de desperdicio em nuvem?",
                options: [
                  { letter: "A", text: "Custo de banda de rede." },
                  {
                    letter: "B",
                    text: "Instancias provisionadas mas subutilizadas ou esquecidas.",
                  },
                  { letter: "C", text: "Custo de licencas de software." },
                  { letter: "D", text: "Taxas de suporte tecnico." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "O que sao Reserved Instances no Azure?",
                options: [
                  { letter: "A", text: "Instancias reservadas para uso exclusivo." },
                  { letter: "B", text: "Descontos por compromisso de uso de 1 ou 3 anos." },
                  { letter: "C", text: "Maquinas virtuais com IP fixo." },
                  { letter: "D", text: "Servidores dedicados fisicos." },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "cin-mod-2-l2",
            title: "Linux Server Hardening na Nuvem",
            icon: "Terminal",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Protegendo Servidores Linux",
              },
              {
                type: "text",
                text: "Hardening de servidores Linux envolve: configuracao de firewall (UFW/iptables) para permitir apenas portas necessarias, autenticacao SSH exclusivamente por chave (sem senha), instalacao de fail2ban para bloquear tentativas de invasao, monitoramento com Prometheus e node_exporter, backups automatizados com rotacao, e auditoria regular de seguranca com ferramentas como Lynis.",
              },
              {
                type: "quote",
                text: '"Um servidor seguro nao e configurado uma vez — e um processo continuo de atualizacao, monitoramento e resposta a incidentes."',
              },
              {
                type: "text",
                text: "Praticas como minimal install (instalar apenas o necessario), desabilitar servicos nao utilizados, e manter o sistema atualizado com patches de seguranca formam a base de qualquer estrategia de hardening.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual a melhor pratica para autenticacao SSH em servidores?",
                options: [
                  { letter: "A", text: "Senhas fortes com 12+ caracteres." },
                  { letter: "B", text: "Autenticacao exclusivamente por chave (sem senha)." },
                  { letter: "C", text: "Autenticacao por biometria." },
                  { letter: "D", text: "Login apenas como root." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question:
                  "Qual ferramenta e usada para bloquear tentativas de invasao por brute force?",
                options: [
                  { letter: "A", text: "Prometheus" },
                  { letter: "B", text: "Docker" },
                  { letter: "C", text: "Fail2ban" },
                  { letter: "D", text: "Nginx" },
                ],
                correct: "C",
              },
            ],
          },
        ],
      },
    ],
  },

  "marketing-digital": {
    id: "marketing-digital",
    title: "Marketing",
    modules: [
      {
        id: "mkt2-mod-1",
        title: "Modulo 1: Estrategia e Conteudo",
        lessons: [
          {
            id: "mkt2-mod-1-l1",
            title: "Copywriting para Conversao",
            icon: "PenLine",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "A Arte da Persuasao Escrita",
              },
              {
                type: "text",
                text: "Copywriting e a pratica de escrever textos persuasivos que levam o leitor a agir. Os principios fundamentais incluem: conhecer a dor e o desejo do publico-alvo, escrever titulos que prendam a atencao (hooks), usar tecnicas como AIDA (Atencao, Interesse, Desejo, Acao) e PAS (Problema, Agitacao, Solucao), e sempre incluir uma chamada para acao (CTA) clara.",
              },
              {
                type: "quote",
                text: '"As pessoas nao compram produtos — compram resolucoes para seus problemas. O copywriting eficaz fala da dor que o cliente sente, nao das features que o produto tem."',
              },
              {
                type: "text",
                text: "Testes A/B sao essenciais para otimizar copy: teste diferentes versoes de titulos, CTAs e abordagens para descobrir o que ressoa melhor com seu publico.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que significa a sigla AIDA no copywriting?",
                options: [
                  { letter: "A", text: "Acordo, Interesse, Duvida, Acao." },
                  { letter: "B", text: "Atencao, Interesse, Desejo, Acao." },
                  { letter: "C", text: "Analise, Ideia, Desenvolvimento, Aprovacao." },
                  { letter: "D", text: "Abordagem, Investigacao, Decisao, Avaliacao." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual o foco principal de um bom copywriting?",
                options: [
                  { letter: "A", text: "Descrever todas as features do produto em detalhe." },
                  { letter: "B", text: "Falar da dor do cliente e como o produto a resolve." },
                  { letter: "C", text: "Usar linguagem tecnica para parecer autoritario." },
                  { letter: "D", text: "Escrever textos longos para parecer completo." },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "mkt2-mod-1-l2",
            title: "Content Strategy e Marketing de Conteudo",
            icon: "Layers",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Planejamento Estrategico de Conteudo",
              },
              {
                type: "text",
                text: "Content strategy vai alem de simplesmente publicar posts. Envolve: definicao de topic clusters (grupos de conteudo em torno de um tema central), criacao de pilares de conteudo (paginas abrangentes sobre topicos principais), planejamento de calendario editorial, analise de gaps de conteudo (o que seus concorrentes cobrem que voce nao cobre), e alinhamento com a jornada do cliente (consciencia, consideracao, decisao).",
              },
              {
                type: "quote",
                text: '"Conteudo e o unico ativo de marketing que acumula valor com o tempo. Um post de blog de 2015 ainda pode trazer trafego hoje. Um anuncio pago morre quando o orcamento acaba."',
              },
              {
                type: "text",
                text: "Ferramentas como SEMrush, Ahrefs e Google Search Console ajudam a identificar topicos com potencial de trafego e baixa concorrencia.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que sao 'topic clusters' em content strategy?",
                options: [
                  { letter: "A", text: "Listas de topicos proibidos para a marca." },
                  {
                    letter: "B",
                    text: "Grupos de conteudo interligados em torno de um tema central.",
                  },
                  { letter: "C", text: "Categorias de anuncios pagos." },
                  { letter: "D", text: "Tags de redes sociais." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual e uma vantagem do conteudo em relacao a anuncios pagos?",
                options: [
                  {
                    letter: "A",
                    text: "Conteudo acumula valor com o tempo; anuncios morrem quando o orcamento acaba.",
                  },
                  { letter: "B", text: "Conteudo e mais barato de produzir." },
                  { letter: "C", text: "Conteudo nao precisa de revisao." },
                  { letter: "D", text: "Conteudo funciona sem internet." },
                ],
                correct: "A",
              },
            ],
          },
        ],
      },
      {
        id: "mkt2-mod-2",
        title: "Modulo 2: SEO e Otimizacao",
        lessons: [
          {
            id: "mkt2-mod-2-l1",
            title: "SEO Audit e Diagnostico Tecnico",
            icon: "Search",
            duration: "16 min",
            content: [
              {
                type: "heading",
                text: "Auditando a Saude SEO do Seu Site",
              },
              {
                type: "text",
                text: "Um SEO audit completo cobre: technical SEO (crawlability, indexacao, Core Web Vitals), on-page SEO (meta tags, headers, otimizacao de conteudo), off-page SEO (perfil de backlinks, autoridade de dominio), analise de gaps de conteudo, e structured data (schema markup) para rich snippets. Cada area e avaliada com recomendacoes priorizadas por impacto.",
              },
              {
                type: "quote",
                text: '"SEO nao e sobre enganar o Google — e sobre tornar seu site tao bom que o Google queira mostra-lo para os usuarios. As diretrizes sao claras: faca o melhor conteudo, e o resto vem."',
              },
              {
                type: "text",
                text: "Ferramentas como Google Search Console, Lighthouse e Screaming Frog sao essenciais para identificar problemas tecnicos de SEO.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que cobre a parte 'technical SEO' de um audit?",
                options: [
                  { letter: "A", text: "Apenas palavras-chave." },
                  { letter: "B", text: "Crawlability, indexacao e Core Web Vitals." },
                  { letter: "C", text: "Apenas backlinks." },
                  { letter: "D", text: "Redes sociais." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "O que sao rich snippets no SEO?",
                options: [
                  { letter: "A", text: "Extratos de codigo fonte." },
                  {
                    letter: "B",
                    text: "Resultados enriquecidos com estrelas, precos e imagens nos buscadores.",
                  },
                  { letter: "C", text: "Trechos de texto aleatorios." },
                  { letter: "D", text: "Anuncios em formato de texto." },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "mkt2-mod-2-l2",
            title: "AI SEO — Otimizacao para Busca com IA",
            icon: "Sparkles",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "Preparando Conteudo para AI Overviews e LLMs",
              },
              {
                type: "text",
                text: "Com o crescimento de buscas por IA (AI Overviews do Google, ChatGPT Search, Perplexity), uma nova disciplina surge: AI SEO. Envolve otimizar conteudo para ser citado por LLMs, usando structured data para facilitar a extracao por IA, formatando conteudo de forma que seja facilmente consumivel (listas, tabelas, respostas diretas), e adotando estrategias de entity SEO para que sua marca seja reconhecida como autoridade em topicos especificos.",
              },
              {
                type: "quote",
                text: '"No mundo da busca com IA, seu conteudo nao precisa ser o primeiro do Google — precisa ser o mais citavel pelos LLMs. Estruture suas respostas como se estivesse escrevendo uma enciclopedia para maquinas."',
              },
              {
                type: "text",
                text: "Monitorar a visibilidade em AI search esta se tornando uma metrica importante, com ferramentas emergentes para rastrear citacoes em respostas de LLMs.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que e AI SEO?",
                options: [
                  { letter: "A", text: "Usar IA para escrever artigos de blog." },
                  {
                    letter: "B",
                    text: "Otimizar conteudo para ser citado por LLMs e buscadores com IA.",
                  },
                  { letter: "C", text: "Automatizar a construcao de backlinks." },
                  { letter: "D", text: "Criar imagens com IA para o blog." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual formato de conteudo e mais facil para LLMs consumirem?",
                options: [
                  { letter: "A", text: "Paragrafos longos e densos." },
                  { letter: "B", text: "Listas, tabelas e respostas diretas e estruturadas." },
                  { letter: "C", text: "Videos incorporados." },
                  { letter: "D", text: "Arquivos PDF para download." },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
      {
        id: "mkt2-mod-3",
        title: "Modulo 3: Psicologia e Conversao",
        lessons: [
          {
            id: "mkt2-mod-3-l1",
            title: "Marketing Psychology e Comportamento",
            icon: "Brain",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Vieses Cognitivos Aplicados ao Marketing",
              },
              {
                type: "text",
                text: "A psicologia do marketing aplica principios de behavioral science para influenciar decisoes de compra. Principais vieses: prova social (pessoas seguem o comportamento de outras), escassez (itens limitados sao mais valorizados), ancoragem (a primeira informacao serve como referencia), e framing (como a informacao e apresentada afeta a decisao). O uso etico desses principios pode aumentar significativamente a conversao.",
              },
              {
                type: "quote",
                text: '"Robert Cialdini identificou seis principios universais de persuasao: reciprocidade, compromisso, aprovacao social, autoridade, afinidade e escassez. Domine estes seis e voce domina a arte de influenciar."',
              },
              {
                type: "text",
                text: "A choice architecture (arquitetura de escolha) no UX design usa esses principios para guiar usuarios a decisoes desejadas sem manipular.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que e o principio de 'ancoragem' em psicologia do consumo?",
                options: [
                  {
                    letter: "A",
                    text: "A primeira informacao recebida serve como referencia para decisoes futuras.",
                  },
                  { letter: "B", text: "Produtos sao mais valorizados quando escassos." },
                  { letter: "C", text: "Pessoas seguem o comportamento da maioria." },
                  {
                    letter: "D",
                    text: "Uma vez comprometidas, pessoas tendem a manter a decisao.",
                  },
                ],
                correct: "A",
              },
              {
                id: 2,
                question: "Quantos principios universais de persuasao Robert Cialdini identificou?",
                options: [
                  { letter: "A", text: "Tres" },
                  { letter: "B", text: "Quatro" },
                  { letter: "C", text: "Seis" },
                  { letter: "D", text: "Oito" },
                ],
                correct: "C",
              },
            ],
          },
          {
            id: "mkt2-mod-3-l2",
            title: "CRO — Conversion Rate Optimisation",
            icon: "TrendingUp",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "Otimizando Taxas de Conversao com Dados",
              },
              {
                type: "text",
                text: "CRO e o processo sistematico de aumentar a porcentagem de usuarios que realizam uma acao desejada. Envolve: analise de funil para identificar onde os usuarios estao desistindo, geracao de hipoteses baseadas em dados (nao em achismos), design e implementacao de testes A/B, analise estatistica dos resultados, e implementacao das variantes vencedoras. Ferramentas como Google Optimize e VWO auxiliam neste processo.",
              },
              {
                type: "quote",
                text: '"Nunca confie no seu palpite. Teste tudo. O que parece obvio para voce pode surpreender completamente quando confrontado com dados reais de usuarios."',
              },
              {
                type: "text",
                text: "O framework de CRO mais eficaz segue o ciclo: Pesquisa → Hipotese → Priorizacao → Teste → Analise → Implementacao.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual o primeiro passo do processo de CRO?",
                options: [
                  { letter: "A", text: "Implementar mudancas no site." },
                  { letter: "B", text: "Criar variacoes de pagina." },
                  { letter: "C", text: "Analisar o funil para identificar pontos de desistencia." },
                  { letter: "D", text: "Aumentar o orcamento de trafego." },
                ],
                correct: "C",
              },
              {
                id: 2,
                question: "Qual a melhor forma de validar uma hipotese de CRO?",
                options: [
                  { letter: "A", text: "Perguntar a opiniao do time." },
                  { letter: "B", text: "Implementar e medir com um teste A/B." },
                  { letter: "C", text: "Seguir o que os concorrentes fazem." },
                  { letter: "D", text: "Usar a intuicao do product manager." },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
    ],
  },

  produtividade: {
    id: "produtividade",
    title: "Produtividade",
    modules: [
      {
        id: "pro-mod-1",
        title: "Modulo 1: Planejamento e Estrategia",
        lessons: [
          {
            id: "pro-mod-1-l1",
            title: "Brainstorming Estruturado com IA",
            icon: "Lightbulb",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "Geracao e Selecao de Ideias",
              },
              {
                type: "text",
                text: "Brainstorming com IA combina pensamento divergente (gerar muitas ideias) com convergente (selecionar as melhores). A IA pode atuar como facilitadora, gerando dezenas de variacoes rapidamente e depois ajudando a categorizar e priorizar usando matrizes de decisao. O segredo e dar papeis especificos: 'ato como advogado do diabo' ou 'ato como usuario iniciante'.",
              },
              {
                type: "quote",
                text: '"A IA e excelente para quantidade de ideias; o humano e insubstituivel para qualidade e contexto. A melhor sessao de brainstorming e uma parceria entre os dois."',
              },
              {
                type: "text",
                text: "Tecnicas como SCAMPER (Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Rearrange) funcionam muito bem quando aplicadas por LLMs.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual a melhor forma de usar IA em sessoes de brainstorming?",
                options: [
                  { letter: "A", text: "Deixar a IA decidir tudo sozinha." },
                  {
                    letter: "B",
                    text: "Usar a IA para gerar quantidade e variedade, e o humano para selecionar e contextualizar.",
                  },
                  { letter: "C", text: "Pedir apenas uma ideia final pronta." },
                  { letter: "D", text: "Nao usar IA, apenas metodos tradicionais." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "O que significa a tecnica SCAMPER no brainstorming?",
                options: [
                  { letter: "A", text: "Um metodo de votacao para selecionar ideias." },
                  {
                    letter: "B",
                    text: "Uma sigla para tecnicas de modificacao e combinacao de ideias existentes.",
                  },
                  { letter: "C", text: "Um software de brainstorming." },
                  { letter: "D", text: "Um tipo de reuniao criativa." },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "pro-mod-1-l2",
            title: "Writing Plans — Planos de Execucao",
            icon: "ClipboardList",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "De Objetivos a Passos Acionaveis",
              },
              {
                type: "text",
                text: "Transformar objetivos amplos em planos de execucao e uma habilidade critica. O processo envolve: decompor o objetivo em marcos (milestones), identificar dependencias entre tarefas, estimar recursos e tempo necessarios, avaliar riscos e criar planos de mitigacao, definir criterios de progresso, e estabelecer canais de comunicacao com stakeholders. A IA pode ajudar a estruturar estes planos e identificar pontos cegos.",
              },
              {
                type: "quote",
                text: '"Um plano sem prazos nao e um plano — e uma lista de desejos. Toda tarefa precisa de uma estimativa, mesmo que aproximada, para que o progresso possa ser medido."',
              },
              {
                type: "text",
                text: "Ferramentas como Notion, Linear e Jira ajudam a documentar e acompanhar planos de execucao, enquanto a IA pode sugerir breakdowns otimizados baseados em experiencias anteriores.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual a diferenca entre um plano e uma lista de desejos?",
                options: [
                  { letter: "A", text: "Nenhuma, sao a mesma coisa." },
                  { letter: "B", text: "Um plano tem prazos e metricas de progresso." },
                  { letter: "C", text: "Uma lista de desejos e mais detalhada." },
                  { letter: "D", text: "Um plano e mais curto." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual o primeiro passo ao criar um plano de execucao?",
                options: [
                  { letter: "A", text: "Estimar o orcamento total." },
                  { letter: "B", text: "Decompor o objetivo em marcos e tarefas." },
                  { letter: "C", text: "Contratar mais pessoas." },
                  { letter: "D", text: "Comprar ferramentas de gestao." },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
      {
        id: "pro-mod-2",
        title: "Modulo 2: Execucao e Colaboracao",
        lessons: [
          {
            id: "pro-mod-2-l1",
            title: "Executing Plans — Execucao Disciplinada",
            icon: "ListChecks",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Acompanhamento e Verificacao de Progresso",
              },
              {
                type: "text",
                text: "Executar um plano requer disciplina: gate de verificacao em cada marco (checklist de requisitos atendidos), tracking de progresso com indicadores visuais (semaforo verde/amarelo/vermelho), identificacao e escalonamento de blockers, adaptacao do plano com base em novas informacoes, e comunicacao de status atualizada para stakeholders. O ciclo e: Executar → Verificar → Reportar → Ajustar.",
              },
              {
                type: "quote",
                text: '"Nenhum plano sobrevive ao primeiro contato com a realidade — mas um processo de execucao disciplinado sim. Nao se apaixone pelo plano, se apaixone pelo sistema de adaptacao."',
              },
              {
                type: "text",
                text: "Ferramentas como status reports semanais e dashboards de progresso ajudam a manter todos alinhados durante a execucao.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que sao 'verification gates' na execucao de planos?",
                options: [
                  { letter: "A", text: "Portas fisicas que bloqueiam a entrada do escritorio." },
                  {
                    letter: "B",
                    text: "Checklists de requisitos que devem ser atendidos antes de avancar para o proximo marco.",
                  },
                  { letter: "C", text: "Aprovacoes de orcamento." },
                  { letter: "D", text: "Reunioes diarias em pe." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual o ciclo recomendado para execucao de planos?",
                options: [
                  { letter: "A", text: "Planejar → Executar → Esquecer" },
                  { letter: "B", text: "Executar → Verificar → Reportar → Ajustar" },
                  { letter: "C", text: "Delegar → Monitorar → Cobrar" },
                  { letter: "D", text: "Comecar → Parar → Replanejar" },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "pro-mod-2-l2",
            title: "Ferramentas Lark — Documentos e OKRs",
            icon: "FileText",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "Produtividade Colaborativa com Lark/Feishu",
              },
              {
                type: "text",
                text: "Lark (Feishu) e uma plataforma de produtividade que integra documentos, planilhas, OKRs, reunioes e aprovacoes. Lark Docs permite criacao colaborativa com formatacao rica e automacao. Lark Base funciona como uma planilha-banco de dados hibrida com formulas automacoes e visualizacoes. Lark OKR facilita o alinhamento de metas com check-ins semanais e tracking de progresso.",
              },
              {
                type: "quote",
                text: "\"OKRs bem escritos tem duas partes: o Objetivo (inspiracional, qualitativo) e os Key Results (mensuraveis, quantitativos). 'Aumentar a satisfacao do cliente' nao e um OKR — 'Aumentar NPS de 70 para 85' e um Key Result.\"",
              },
              {
                type: "text",
                text: "A integracao entre as ferramentas Lark permite criar fluxos como: um documento vira uma tarefa, que vira um OKR, com aprovacao automatizada.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que e Lark Base?",
                options: [
                  { letter: "A", text: "Um editor de textos simples." },
                  {
                    letter: "B",
                    text: "Uma ferramenta hibrida de planilha e banco de dados com automacoes.",
                  },
                  { letter: "C", text: "Um sistema de CRM." },
                  { letter: "D", text: "Um chat corporativo." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual a estrutura correta de um OKR?",
                options: [
                  { letter: "A", text: "Apenas metas numericas." },
                  { letter: "B", text: "Objetivo inspiracional + Key Results mensuraveis." },
                  { letter: "C", text: "Lista de tarefas diarias." },
                  { letter: "D", text: "Descricao do cargo e responsabilidades." },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
    ],
  },

  "agentes-workflows": {
    id: "agentes-workflows",
    title: "Agentes & Workflows",
    modules: [
      {
        id: "agw-mod-1",
        title: "Modulo 1: Orquestracao de Agentes de IA",
        lessons: [
          {
            id: "agw-mod-1-l1",
            title: "Dispatching Parallel Agents",
            icon: "GitBranch",
            duration: "16 min",
            content: [
              {
                type: "heading",
                text: "Executando Multiplos Agentes em Paralelo",
              },
              {
                type: "text",
                text: "Orquestrar agentes em paralelo envolve dividir um trabalho grande em tarefas independentes, despachar cada uma para um agente especializado, coletar e consolidar os resultados, tratar falhas com retry e escalonamento, e garantir que dependencias entre tarefas sejam respeitadas. O orquestrador coordena o fluxo sem micromanager cada agente.",
              },
              {
                type: "quote",
                text: '"O ganho de performance com agentes paralelos nao e linear — depende de quao bem voce divide o trabalho. Duas tarefas que competem pelo mesmo recurso nao sao paralelizaveis."',
              },
              {
                type: "text",
                text: "Frameworks como LangGraph, CrewAI e o proprio sistema de subagentes do Claude Code permitem implementar orquestracao paralela com diferentes niveis de sofisticacao.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual o principal desafio ao paralelizar agentes de IA?",
                options: [
                  { letter: "A", text: "Custo de API." },
                  {
                    letter: "B",
                    text: "Dividir o trabalho em tarefas verdadeiramente independentes.",
                  },
                  { letter: "C", text: "Velocidade de conexao com a internet." },
                  { letter: "D", text: "Escolher o modelo de IA certo." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual o papel do orquestrador em um sistema multi-agente?",
                options: [
                  { letter: "A", text: "Executar todas as tarefas sozinho." },
                  {
                    letter: "B",
                    text: "Coordenar o fluxo, consolidar resultados e tratar falhas.",
                  },
                  { letter: "C", text: "Apenas monitorar o progresso." },
                  { letter: "D", text: "Decidir qual modelo de IA usar." },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "agw-mod-1-l2",
            title: "Subagent-Driven Development",
            icon: "Workflow",
            duration: "17 min",
            content: [
              {
                type: "heading",
                text: "Dividir para Conquistar com Subagentes",
              },
              {
                type: "text",
                text: "Subagent-Driven Development e uma abordagem onde tarefas de desenvolvimento sao divididas entre subagentes especializados: um agente de arquitetura projeta a solucao, um de implementacao escreve o codigo, um revisor valida a correcao, um de testes garante cobertura, e um de documentacao escreve a documentacao. Cada agente tem um papel claro e produz uma saida especifica.",
              },
              {
                type: "quote",
                text: '"Um desenvolvedor humano orquestrando 5 subagentes de IA pode produzir o trabalho de 3 desenvolvedores — mas apenas se o humano tiver clareza suficiente para dividir o trabalho corretamente."',
              },
              {
                type: "text",
                text: "Esta abordagem e particularmente eficaz para tarefas bem definidas como criar componentes de UI, escrever testes, ou refatorar codigo seguindo padroes estabelecidos.",
              },
            ],
            questions: [
              {
                id: 1,
                question:
                  "Quantos papeis de subagentes sao tipicamente usados no Subagent-Driven Development?",
                options: [
                  { letter: "A", text: "Apenas 1 agente generalista." },
                  {
                    letter: "B",
                    text: "5 papeis: arquitetura, implementacao, revisao, testes, documentacao.",
                  },
                  { letter: "C", text: "Apenas 2: frontend e backend." },
                  { letter: "D", text: "Depende do projeto, sem estrutura fixa." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Quando esta abordagem e mais eficaz?",
                options: [
                  { letter: "A", text: "Para tarefas ambíguas e mal definidas." },
                  {
                    letter: "B",
                    text: "Para tarefas bem definidas como criar componentes ou escrever testes.",
                  },
                  { letter: "C", text: "Para reunioes de alinhamento." },
                  { letter: "D", text: "Para design thinking." },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
      {
        id: "agw-mod-2",
        title: "Modulo 2: Qualidade e Ferramentas de Agentes",
        lessons: [
          {
            id: "agw-mod-2-l1",
            title: "Verification Before Completion",
            icon: "CheckCircle2",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "Gates de Qualidade Antes de Finalizar",
              },
              {
                type: "text",
                text: "Verification Before Completion e um conjunto de gates de qualidade que devem ser superados antes de marcar uma tarefa como completa. Inclui: checklist de requisitos funcionais e nao funcionais, execucao de testes automatizados e verificacao de cobertura, revisao de edge cases e cenarios de erro, confirmacao de que a documentacao foi atualizada, e sinalizacao de aprovacao final. Cada gate e uma oportunidade de capturar problemas cedo.",
              },
              {
                type: "quote",
                text: "\"Nao existe 'vou ajustar depois'. Ou esta completo de acordo com os criterios de aceite, ou nao esta. 'Depois' e o cemiterio onde os bugs esquecidos vao morrer.\"",
              },
              {
                type: "text",
                text: "Automatizar estes gates com CI/CD (GitHub Actions, GitLab CI) garante que sejam executados consistentemente sem depender de memoria humana.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "Qual o objetivo dos gates de verificacao antes de completar uma tarefa?",
                options: [
                  { letter: "A", text: "Atrasar a entrega propositalmente." },
                  {
                    letter: "B",
                    text: "Capturar problemas cedo antes de considerar a tarefa completa.",
                  },
                  { letter: "C", text: "Aumentar a burocracia do processo." },
                  { letter: "D", text: "Substituir o code review." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question:
                  "Como garantir que os gates de verificacao sejam executados consistentemente?",
                options: [
                  { letter: "A", text: "Pedindo para cada desenvolvedor lembrar." },
                  { letter: "B", text: "Automatizando com CI/CD." },
                  { letter: "C", text: "Colocando cartazes no escritorio." },
                  { letter: "D", text: "Realizando reunioes diarias." },
                ],
                correct: "B",
              },
            ],
          },
          {
            id: "agw-mod-2-l2",
            title: "MCP Builder — Conectando Ferramentas a Agentes",
            icon: "Plug",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Model Context Protocol para Agentes",
              },
              {
                type: "text",
                text: "O Model Context Protocol (MCP) e um padrao aberto que permite agentes de IA se conectarem a ferramentas externas de forma padronizada. Um servidor MCP expoe ferramentas (tools), recursos (resources) e templates de prompt que o agente pode descobrir e usar. Construir um servidor MCP envolve definir schemas, implementar handlers, configurar autenticacao e fazer deploy.",
              },
              {
                type: "quote",
                text: '"MCP e para agentes de IA o que USB e para perifericos de computador — um padrao universal que permite conectar qualquer ferramenta a qualquer agente sem integracoes customizadas."',
              },
              {
                type: "text",
                text: "O MCP ja e suportado por Claude Code, Cursor e outras ferramentas, e a comunidade esta crescendo rapidamente com servidores para bancos de dados, APIs, sistemas de arquivos e mais.",
              },
            ],
            questions: [
              {
                id: 1,
                question: "O que e o Model Context Protocol (MCP)?",
                options: [
                  { letter: "A", text: "Um protocolo de rede para servidores." },
                  {
                    letter: "B",
                    text: "Um padrao aberto para conectar agentes de IA a ferramentas externas.",
                  },
                  { letter: "C", text: "Um formato de arquivo para configuracao." },
                  { letter: "D", text: "Um framework de testes." },
                ],
                correct: "B",
              },
              {
                id: 2,
                question: "Qual analogia descreve bem o proposito do MCP?",
                options: [
                  { letter: "A", text: "MCP e como HDMI para video." },
                  {
                    letter: "B",
                    text: "MCP e como USB para perifericos de computador — um padrao universal.",
                  },
                  { letter: "C", text: "MCP e como Bluetooth para audio." },
                  { letter: "D", text: "MCP e como Wi-Fi para internet." },
                ],
                correct: "B",
              },
            ],
          },
        ],
      },
    ],
  },
}
