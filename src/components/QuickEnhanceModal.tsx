import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Zap, Copy, Check, ExternalLink, RotateCcw, X } from "lucide-react"
import { Drawer as DrawerPrimitive } from "vaul"
import { enhancePrompt, type EnhancementResult } from "@/lib/promptEnhancer"
import { useQuickEnhanceParam } from "@/hooks/useQuickEnhanceParam"
import { cn } from "@/lib/utils"

export function QuickEnhanceModal() {
  const { isOpen, onClose } = useQuickEnhanceParam()
  const navigate = useNavigate()

  const [promptText, setPromptText] = useState("")
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [result, setResult] = useState<EnhancementResult | null>(null)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isOpen) {
      setPromptText("")
      setResult(null)
      setCopied(false)
      timerRef.current = setTimeout(() => textareaRef.current?.focus(), 350)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isOpen])

  function handleEnhance() {
    if (!promptText.trim() || isEnhancing) return
    setIsEnhancing(true)
    timerRef.current = setTimeout(() => {
      setResult(enhancePrompt(promptText, "general"))
      setIsEnhancing(false)
    }, 500)
  }

  async function handleCopy() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.enhanced)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — silent
    }
  }

  function handleViewFull() {
    onClose()
    navigate("/prompt-enhancer", { state: { initialPrompt: promptText } })
  }

  function handleClose() {
    onClose()
    setPromptText("")
    setResult(null)
  }

  return (
    <DrawerPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      shouldScaleBackground
    >
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <DrawerPrimitive.Content className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl bg-white dark:bg-[#1a1f1a] max-h-[92dvh] shadow-2xl outline-none">
          {/* Handle bar — green pill */}
          <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-primary shrink-0" />

          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-4 pb-1 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 fill-primary text-primary" />
                <DrawerPrimitive.Title className="text-[17px] font-extrabold text-foreground leading-tight">
                  Aprimorar Prompt
                </DrawerPrimitive.Title>
              </div>
              <DrawerPrimitive.Description className="text-[13px] text-muted-foreground mt-0.5 leading-snug">
                Cole seu prompt e melhore em segundos
              </DrawerPrimitive.Description>
            </div>
            <button
              onClick={handleClose}
              className="mt-0.5 rounded-full p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
              aria-label="Fechar"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 pt-3 pb-2 space-y-3">
            {/* Textarea + counter */}
            <div>
              <textarea
                ref={textareaRef}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleEnhance()
                }}
                placeholder="Cole ou escreva seu prompt aqui..."
                maxLength={1000}
                rows={result ? 4 : 6}
                className={cn(
                  "w-full resize-none rounded-2xl border px-4 py-3 text-[14px] text-foreground leading-relaxed",
                  "placeholder:text-muted-foreground bg-[#f9fff9] dark:bg-[#111a11]",
                  "border-[#A3E4A1] dark:border-green-900",
                  "focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                )}
              />
              <p className="text-right text-[11px] text-muted-foreground mt-1 pr-1">
                {promptText.length}/1000
              </p>
            </div>

            {/* Result section */}
            {result && (
              <div className="space-y-3">
                {/* Dashed divider */}
                <div className="border-t border-dashed border-[#A3E4A1] dark:border-green-900" />

                {/* RESULTADO label */}
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-primary">
                  Resultado
                </p>

                {/* Score pill + jump */}
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#A3E4A1]/60 dark:bg-green-900/60 px-3 py-1 text-[13px] font-bold text-green-800 dark:text-green-300">
                    {result.originalScore.toFixed(1)} → {result.enhancedScore.toFixed(1)}
                  </span>
                  <span className="text-[13px] font-semibold text-primary">
                    +{result.jump} pontos ✓
                  </span>
                </div>

                {/* Enhanced text box */}
                <div className="max-h-44 overflow-y-auto rounded-2xl border border-[#A3E4A1] dark:border-green-900 bg-[#f0fdf0] dark:bg-[#0d1f0d] px-4 py-3">
                  <p className="text-[13px] text-foreground whitespace-pre-wrap leading-relaxed">
                    {result.enhanced}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer — sticky action area */}
          <div className="shrink-0 px-5 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] space-y-2">
            {!result ? (
              <button
                onClick={handleEnhance}
                disabled={!promptText.trim() || isEnhancing}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-extrabold transition-all",
                  "bg-primary text-white hover:opacity-90 active:scale-[.98]",
                  "disabled:opacity-40 disabled:cursor-not-allowed"
                )}
              >
                {isEnhancing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Aprimorando...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 fill-white" />
                    Aprimorar
                  </>
                )}
              </button>
            ) : (
              <>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-extrabold transition-all active:scale-[.98]",
                      copied ? "bg-green-500 text-white" : "bg-primary text-white hover:opacity-90"
                    )}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                  <button
                    onClick={handleViewFull}
                    className="flex items-center justify-center gap-2 rounded-2xl border-2 border-[#A3E4A1] dark:border-green-800 bg-white dark:bg-transparent px-4 py-3.5 text-[14px] font-bold text-primary hover:bg-[#f0fdf0] dark:hover:bg-green-950/30 transition-all active:scale-[.98]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver completo
                  </button>
                </div>
                <button
                  onClick={() => {
                    setResult(null)
                    setPromptText("")
                  }}
                  className="flex w-full items-center justify-center gap-1.5 py-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Tentar novamente
                </button>
              </>
            )}
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  )
}
