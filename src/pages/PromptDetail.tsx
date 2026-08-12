import { useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { ChevronDown, ChevronUp, Copy, ArrowRight, Heart } from "lucide-react"
import { AppBottomNav } from "@/components/AppBottomNav"
import { cn } from "@/lib/utils"
import { trackPromptUsed } from "@/lib/analytics"
import { useFavoritePrompts } from "@/hooks/useFavoritePrompts"
import { TEMPLATES } from "@/data/templatesData"

const PROMPT_DATA = {
  id: "1",
  title: "Prompt para Landing Pages SaaS",
  category: "Marketing Digital",
  text: `Você é um especialista em marketing digital e copywriting para produtos SaaS. Crie uma landing page completa e persuasiva para [NOME DO PRODUTO], uma ferramenta de [CATEGORIA] voltada para [PÚBLICO-ALVO].

A landing page deve incluir:
- Headline principal impactante que destaque o principal benefício
- Subheadline que reforce a proposta de valor
- Seção "Como funciona" com 3 passos simples
- 3-5 benefícios principais com ícones descritivos
- Prova social (depoimentos e métricas de resultado)
- FAQ com as 5 dúvidas mais comuns
- CTA principal e secundário bem posicionados

Tom: profissional mas acessível. Foco em conversão.`,
  tags: ["Processos", "Otimizado", "Teste", "Qualidade"],
  howItWorks: [
    {
      id: "1",
      title: "Defina seu contexto",
      description:
        "Preencha os campos entre colchetes com as informações do seu produto: nome, categoria e público-alvo.",
    },
    {
      id: "2",
      title: "Escolha o tom certo",
      description:
        "Ajuste o tom conforme sua marca: formal para B2B enterprise, casual para startups e early adopters.",
    },
    {
      id: "3",
      title: "Itere e refine",
      description:
        "Use a resposta gerada como base e peça refinamentos específicos: 'torne o headline mais urgente' ou 'adicione mais prova social'.",
    },
    {
      id: "4",
      title: "Valide com dados",
      description:
        "Teste duas versões do headline com A/B test e meça qual converte melhor antes de publicar definitivamente.",
    },
  ],
  steps: [
    { label: "Input", description: "Preencha o contexto" },
    { label: "Análise", description: "IA processa" },
    { label: "Output", description: "Copy pronto" },
  ],
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof PROMPT_DATA.howItWorks)[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-stroke-light last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="text-sm font-semibold text-foregroundDark">{item.title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-foregroundMuted" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-foregroundMuted" />
        )}
      </button>
      {isOpen && (
        <p className="pb-3 text-xs leading-relaxed text-foregroundSecondary">{item.description}</p>
      )}
    </div>
  )
}

export default function PromptDetail() {
  const navigate = useNavigate()
  const { promptId } = useParams<{ promptId: string }>()
  const location = useLocation()
  const [openItem, setOpenItem] = useState<string | null>("1")
  const [copied, setCopied] = useState(false)
  const { toggleFavoritePrompt, isFavoritePrompt } = useFavoritePrompts()

  // Resolve prompt: check location.state first, then look up by promptId in TEMPLATES
  const statePrompt = (location.state as { promptText?: string; title?: string; category?: string; tags?: string[] } | null)
  const matchedTemplate = promptId ? TEMPLATES.find((t) => t.promptId === promptId) : null

  const prompt = statePrompt?.promptText
    ? {
        id: promptId ?? PROMPT_DATA.id,
        title: statePrompt.title ?? PROMPT_DATA.title,
        category: statePrompt.category ?? PROMPT_DATA.category,
        text: statePrompt.promptText,
        tags: statePrompt.tags ?? PROMPT_DATA.tags,
        howItWorks: PROMPT_DATA.howItWorks,
        steps: PROMPT_DATA.steps,
      }
    : matchedTemplate
    ? {
        id: matchedTemplate.promptId,
        title: matchedTemplate.name,
        category: matchedTemplate.category,
        text: matchedTemplate.promptContent,
        tags: matchedTemplate.tags,
        howItWorks: PROMPT_DATA.howItWorks,
        steps: PROMPT_DATA.steps,
      }
    : promptId && promptId !== PROMPT_DATA.id
    ? null
    : PROMPT_DATA

  const isFav = isFavoritePrompt(prompt?.id ?? PROMPT_DATA.id)

  function handleCopy() {
    if (!prompt) return
    navigator.clipboard
      .writeText(prompt.text)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {
        // Clipboard permission denied or unavailable — nothing to recover from here.
      })
  }

  // Not found state
  if (!prompt) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 pb-32">
        <p className="mb-2 text-lg font-bold text-foregroundDark">Prompt não encontrado</p>
        <p className="mb-6 text-sm text-foregroundSecondary text-center">
          Não conseguimos encontrar o prompt com ID "{promptId}".
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border border-primary-dark px-5 py-3 text-sm font-semibold text-primary-dark transition-all active:scale-95 hover:bg-pageBgLight"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Voltar
        </button>
        <AppBottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-32 lg:pb-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#C8EDD8] via-[#D5F0E2] to-pageBgLight px-5 pb-6 pt-12">
        <div className="mb-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stroke-muted bg-white shadow-sm transition-all active:scale-95"
            aria-label="Voltar"
          >
            <ArrowRight className="h-4 w-4 rotate-180 text-primary-dark" />
          </button>
          <span className="text-xs font-semibold text-[#3E6B50]">{prompt.category}</span>
          <button
            onClick={() => toggleFavoritePrompt(prompt.id)}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-stroke-muted bg-white shadow-sm transition-all active:scale-95"
            aria-label={isFav ? "Remover dos favoritos" : "Salvar nos favoritos"}
          >
            <Heart
              className={cn("h-4 w-4 transition-colors", isFav ? "fill-red-500 text-red-500" : "text-foreground-tertiary")}
            />
          </button>
        </div>
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            <h1 className="text-xl font-extrabold leading-tight text-foregroundDark">
              {prompt.title}
            </h1>
          </div>
          <img
            src="/assets/mascot-login-new.png"
            alt="Mascote"
            className="h-24 w-auto shrink-0 object-contain"
          />
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Prompt completo */}
        <div className="rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-foregroundMuted">
            Prompt completo:
          </p>
          <div className="max-h-40 overflow-y-auto rounded-xl bg-[#F5FBF7] p-3">
            <p className="whitespace-pre-wrap text-xs leading-relaxed text-foregroundDark">
              {prompt.text}
            </p>
          </div>
        </div>

        {/* Como funciona */}
        <div className="rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
          <p className="mb-1 text-sm font-bold text-foregroundDark">Como funciona?</p>
          {prompt.howItWorks.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openItem === item.id}
              onToggle={() => setOpenItem(openItem === item.id ? null : item.id)}
            />
          ))}
        </div>

        {/* Processo de resultado */}
        <div className="rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
          <p className="mb-4 text-sm font-bold text-foregroundDark">Processo de resultado:</p>
          <div className="flex items-center justify-between">
            {prompt.steps.map((step, i) => (
              <div key={step.label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-dark text-sm font-bold text-white shadow-md">
                    {i + 1}
                  </div>
                  <span className="text-[11px] font-semibold text-foregroundDark">{step.label}</span>
                  <span className="text-[9px] text-center text-foregroundMuted">{step.description}</span>
                </div>
                {i < prompt.steps.length - 1 && (
                  <div className="mx-1 mb-6 h-0.5 flex-1 bg-gradient-to-r from-primary-dark to-stroke-light" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-stroke-light bg-transparent px-3 py-1 text-xs font-semibold text-primary-dark"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Fixed bottom actions */}
      <div className="fixed bottom-[72px] left-0 right-0 z-30 border-t border-pageBgLight bg-white px-4 py-3">
        <div className="mx-auto flex max-w-[460px] gap-3">
          <button
            onClick={handleCopy}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all active:scale-95",
              copied
                ? "border-emerald bg-pageBgLight text-emerald"
                : "border-primary-dark text-primary-dark hover:bg-pageBgLight"
            )}
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copiado!" : "Copiar Prompt"}
          </button>
          <button
            onClick={() => {
              trackPromptUsed(prompt.category, prompt.title)
              navigate("/lab-result")
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-dark py-3 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-emerald"
          >
            Usar no calculador
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AppBottomNav />
    </div>
  )
}
