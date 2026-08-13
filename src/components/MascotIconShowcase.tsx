/**
 * MascotIconShowcase
 *
 * Componente showcase para demonstrar todos os ícones mascote disponíveis.
 * Útil para documentação e testes de UI.
 */

interface MascotIcon {
  name: string
  filename: string
  description: string
  category: "learning" | "achievement" | "creative" | "strategy" | "social"
}

const MASCOT_ICONS: MascotIcon[] = [
  {
    name: "Livro",
    filename: "mascot_book.svg",
    description: "Para aprendizado geral",
    category: "learning",
  },
  {
    name: "Formatura",
    filename: "mascot_graduation.svg",
    description: "Para conclusão/sucesso",
    category: "achievement",
  },
  {
    name: "Lâmpada",
    filename: "mascot_lightbulb.svg",
    description: "Para criatividade/insights",
    category: "creative",
  },
  {
    name: "Código",
    filename: "mascot_code.svg",
    description: "Para desenvolvimento",
    category: "learning",
  },
  {
    name: "Foguete",
    filename: "mascot_rocket.svg",
    description: "Para crescimento/velocidade",
    category: "achievement",
  },
  {
    name: "Troféu",
    filename: "mascot_trophy.svg",
    description: "Para conquistas",
    category: "achievement",
  },
  {
    name: "Quebra-cabeça",
    filename: "mascot_puzzle.svg",
    description: "Para resolução de problemas",
    category: "strategy",
  },
  {
    name: "Paleta",
    filename: "mascot_palette.svg",
    description: "Para design/criatividade",
    category: "creative",
  },
  {
    name: "Gráfico",
    filename: "mascot_chart.svg",
    description: "Para análise/progresso",
    category: "learning",
  },
  {
    name: "Cérebro",
    filename: "mascot_brain.svg",
    description: "Para inteligência/estratégia",
    category: "strategy",
  },
  {
    name: "Alvo",
    filename: "mascot_target.svg",
    description: "Para metas/objetivos",
    category: "strategy",
  },
  {
    name: "Coração",
    filename: "mascot_heart.svg",
    description: "Para paixão/dedicação",
    category: "creative",
  },
  {
    name: "Estrela",
    filename: "mascot_star.svg",
    description: "Para excelência",
    category: "achievement",
  },
  {
    name: "Missão",
    filename: "mascot_quest.svg",
    description: "Para jornada/aventura",
    category: "learning",
  },
  {
    name: "Medalha",
    filename: "mascot_medal.svg",
    description: "Para honra/reconhecimento",
    category: "achievement",
  },
  {
    name: "Coroa",
    filename: "mascot_crown.svg",
    description: "Para liderança",
    category: "social",
  },
  {
    name: "Crescimento",
    filename: "mascot_growth.svg",
    description: "Para desenvolvimento",
    category: "achievement",
  },
  {
    name: "Rede",
    filename: "mascot_network.svg",
    description: "Para comunidade/conexão",
    category: "social",
  },
  {
    name: "Foco",
    filename: "mascot_focus.svg",
    description: "Para dedicação/determinação",
    category: "strategy",
  },
  {
    name: "Equipe",
    filename: "mascot_team.svg",
    description: "Para colaboração/grupo",
    category: "social",
  },
  {
    name: "Celebração",
    filename: "mascot_celebrate.svg",
    description: "Para vitória/felicidade",
    category: "achievement",
  },
]

const CATEGORIES = {
  learning: { label: "Aprendizado", color: "bg-blue-50" },
  achievement: { label: "Conquistas", color: "bg-green-50" },
  creative: { label: "Criatividade", color: "bg-purple-50" },
  strategy: { label: "Estratégia", color: "bg-orange-50" },
  social: { label: "Social", color: "bg-pink-50" },
}

export function MascotIconShowcase() {
  const grouped = MASCOT_ICONS.reduce(
    (acc, icon) => {
      if (!acc[icon.category]) acc[icon.category] = []
      acc[icon.category].push(icon)
      return acc
    },
    {} as Record<string, MascotIcon[]>
  )

  return (
    <div className="w-full space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold text-foregroundDark">Mascot Icons Showcase</h2>
        <p className="text-sm text-foregroundTertiary">21 ícones educacionais disponíveis</p>
      </div>

      {Object.entries(grouped).map(([category, icons]) => (
        <div key={category}>
          <h3 className="mb-4 text-lg font-semibold text-emerald">
            {CATEGORIES[category as keyof typeof CATEGORIES].label}
          </h3>
          <div
            className={`grid grid-cols-2 gap-4 rounded-lg ${CATEGORIES[category as keyof typeof CATEGORIES].color} p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`}
          >
            {icons.map((icon) => (
              <div key={icon.filename} className="flex flex-col items-center gap-2">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white shadow-sm">
                  <img
                    src={`/assets/mascot-icons/${icon.filename}`}
                    alt={icon.name}
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-foregroundDark">{icon.name}</p>
                  <p className="text-[10px] text-foregroundTertiary">{icon.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Usage example */}
      <div className="rounded-lg border border-stroke-light bg-white p-4">
        <h3 className="mb-3 font-semibold text-emerald">Como Usar</h3>
        <pre className="overflow-x-auto rounded bg-[#F9FCFA] p-3 text-[10px] text-foregroundDark">
          {`<img
  src="/assets/mascot-icons/mascot_book.svg"
  alt="Mascote estudando"
  className="h-12 w-12 object-contain"
/>`}
        </pre>
      </div>
    </div>
  )
}
