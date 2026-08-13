/**
 * promptEnhancer.ts
 *
 * Local, deterministic prompt enhancement engine.
 * Takes a raw prompt + focus mode and produces a structured,
 * improved version with bullet points. No network calls.
 */

// ── Types ─────────────────────────────────────────────────────────────────

export type FocusMode = "general" | "creativity" | "precision" | "detail"

/** Legacy refinement fields — kept for backward compat but no longer required */
export interface EnhancementFields {
  persona?: string
  context?: string
  format?: string
  tone?: string
  audience?: string
  constraints?: string
}

export interface EnhancementResult {
  original: string
  /** Full text for clipboard (includes audience + tone lines) */
  enhanced: string
  /** Main content only (without audience/tone labels) */
  enhancedMain: string
  originalScore: number
  enhancedScore: number
  jump: number
  focusMode: FocusMode
  appliedTechniques: string[]
  audience: string
  tone: string
  // Legacy — kept for history compat
  addedFields: string[]
  presentFields: string[]
  originalFields: string[]
}

// ── Criteria weights ──────────────────────────────────────────────────────

interface Criterion {
  key: string
  label: string
  weight: number
  detect: (text: string) => boolean
}

export const CRITERIA: Criterion[] = [
  {
    key: "persona",
    label: "Persona",
    weight: 1.5,
    detect: (t) =>
      /\b(aja como|atue como|você é um|você é uma|assuma o papel|persona|especialista em|seja um|seja uma|como um|como uma)\b/i.test(
        t
      ),
  },
  {
    key: "action",
    label: "Ação clara",
    weight: 1.5,
    detect: (t) =>
      /\b(crie|escreva|gere|liste|explique|resuma|traduza|analise|compare|sugira|descreva|reescreva|classifique|extraia|recomende|elabore|desenvolva|produza|faça|crie um|crie uma|gere um)\b/i.test(
        t
      ),
  },
  {
    key: "context",
    label: "Contexto",
    weight: 1.5,
    detect: (t) =>
      /\b(contexto|cenário|background|situação|estou|estamos|tenho|temos|preciso|precisamos|meu objetivo|nosso|a empresa|o projeto|para isso|com foco em)\b/i.test(
        t
      ),
  },
  {
    key: "format",
    label: "Formato",
    weight: 1.0,
    detect: (t) =>
      /\b(formato|estrutura|em formato|responda em|saída em|lista|tabela|markdown|json|tópicos|bullet|seções|parágrafos|enumere|organize como)\b/i.test(
        t
      ),
  },
  {
    key: "tone",
    label: "Tom",
    weight: 1.0,
    detect: (t) =>
      /\b(tom|estilo|formal|informal|amigável|profissional|divertido|técnico|didático|conciso|persuasivo|casual|sério|acadêmico|criativo|tom de voz)\b/i.test(
        t
      ),
  },
  {
    key: "audience",
    label: "Público",
    weight: 1.0,
    detect: (t) =>
      /\b(público[- ]alvo|destinado a|voltado para|para iniciantes|para leigos|para crianças|para desenvolvedores|para gerentes|audiência|leitor|para quem|público)\b/i.test(
        t
      ),
  },
  {
    key: "constraints",
    label: "Restrições",
    weight: 1.0,
    detect: (t) =>
      /\b(máximo|mínimo|no máximo|no mínimo|até \d+|limite|palavras|caracteres|tokens|frases|parágrafos|não use|evite|sem usar|não inclua|excluindo)\b/i.test(
        t
      ),
  },
  {
    key: "examples",
    label: "Exemplos",
    weight: 0.5,
    detect: (t) =>
      /\b(exemplo|exemplos|por exemplo|ex:|few[- ]?shot|como no exemplo|veja:|tal como|como por exemplo)\b/i.test(
        t
      ),
  },
]

// ── Focus mode configs ────────────────────────────────────────────────────

interface FocusConfig {
  bullets: readonly string[]
  audience: string
  tone: string
  techniques: readonly string[]
}

const FOCUS_CONFIGS: Record<FocusMode, FocusConfig> = {
  general: {
    bullets: [
      "Um título chamativo e relevante",
      "Uma introdução clara e objetiva",
      "Uma chamada para ação (CTA) bem definida",
      "Linguagem acessível e direta",
      "Estrutura organizada e lógica",
    ],
    audience: "Profissionais e interessados no tema",
    tone: "Claro, objetivo e acessível",
    techniques: [
      "Conteúdo claro",
      "Objetivo definido",
      "Estrutura organizada",
      "Detalhamento estratégico",
    ],
  },
  creativity: {
    bullets: [
      "Um gancho inicial surpreendente e atrativo",
      "Abordagem criativa e diferenciada",
      "Storytelling envolvente e memorável",
      "Linguagem expressiva e impactante",
      "CTA criativa que convida à ação",
    ],
    audience: "Público engajado e receptivo a novas ideias",
    tone: "Criativo, inspirador e envolvente",
    techniques: ["Criatividade aplicada", "Storytelling", "Originalidade", "Impacto emocional"],
  },
  precision: {
    bullets: [
      "Objetivo específico e mensurável",
      "CTA clara, direta e irresistível",
      "Linguagem precisa e sem ambiguidade",
      "Dados ou fatos que sustentam a mensagem",
      "Critérios de sucesso bem definidos",
    ],
    audience: "Tomadores de decisão e profissionais exigentes",
    tone: "Preciso, direto e profissional",
    techniques: ["Clareza objetiva", "CTA definida", "Linguagem precisa", "Foco no resultado"],
  },
  detail: {
    bullets: [
      "Contexto detalhado e específico",
      "Especificações técnicas necessárias",
      "Exemplos concretos do resultado esperado",
      "Restrições e limitações bem definidas",
      "Critérios de qualidade e revisão",
    ],
    audience: "Especialistas e profissionais da área",
    tone: "Detalhado, técnico e abrangente",
    techniques: [
      "Alto detalhamento",
      "Especificações claras",
      "Exemplos práticos",
      "Critérios definidos",
    ],
  },
}

export { FOCUS_CONFIGS }

// ── Detection helpers ─────────────────────────────────────────────────────

function detectCriteria(text: string): string[] {
  const lower = text.toLowerCase()
  return CRITERIA.filter((c) => c.detect(lower)).map((c) => c.key)
}

function calculateScore(text: string): number {
  const lower = text.toLowerCase()
  let score = 1.0

  for (const c of CRITERIA) {
    if (c.detect(lower)) {
      score += c.weight
    }
  }

  const words = text.split(/\s+/).filter(Boolean).length
  if (words >= 20) score += 0.5
  if (words >= 50) score += 0.5

  return Math.round(Math.max(0, Math.min(10, score)) * 10) / 10
}

// ── Assembly ──────────────────────────────────────────────────────────────

function assembleEnhanced(
  raw: string,
  focusMode: FocusMode
): { enhanced: string; enhancedMain: string; audience: string; tone: string } {
  const config = FOCUS_CONFIGS[focusMode]
  const bulletLines = config.bullets.map((b) => `• ${b}`).join("\n")
  const enhancedMain = `${raw} com foco em:\nInclua:\n${bulletLines}`
  const enhanced = `${enhancedMain}\n\nPúblico-alvo: ${config.audience}\nTom de voz: ${config.tone}`

  return { enhanced, enhancedMain, audience: config.audience, tone: config.tone }
}

// ── Main enhancement function ─────────────────────────────────────────────

export function enhancePrompt(
  prompt: string,
  focusModeOrFields: FocusMode | EnhancementFields = "general"
): EnhancementResult {
  const focusMode: FocusMode = typeof focusModeOrFields === "string" ? focusModeOrFields : "general"

  const trimmed = prompt.trim()

  if (!trimmed) {
    return {
      original: "",
      enhanced: "",
      enhancedMain: "",
      originalScore: 0,
      enhancedScore: 0,
      jump: 0,
      focusMode,
      appliedTechniques: [],
      audience: "",
      tone: "",
      addedFields: [],
      presentFields: [],
      originalFields: [],
    }
  }

  const originalFields = detectCriteria(trimmed)
  const originalScore = calculateScore(trimmed)

  const { enhanced, enhancedMain, audience, tone } = assembleEnhanced(trimmed, focusMode)
  const enhancedScore = Math.min(10, calculateScore(enhancedMain) + 0.5)
  const presentFields = detectCriteria(enhancedMain)
  const jump = Math.round(Math.max(0, enhancedScore - originalScore) * 10) / 10

  return {
    original: trimmed,
    enhanced,
    enhancedMain,
    originalScore,
    enhancedScore,
    jump,
    focusMode,
    appliedTechniques: [...FOCUS_CONFIGS[focusMode].techniques],
    audience,
    tone,
    addedFields: [],
    presentFields,
    originalFields,
  }
}

// ── Utility ───────────────────────────────────────────────────────────────

export function getAllCriteriaLabels(): { key: string; label: string; weight: number }[] {
  return CRITERIA.map((c) => ({ key: c.key, label: c.label, weight: c.weight }))
}
