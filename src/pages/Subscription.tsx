import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Award,
  BookMarked,
  Check,
  FileText,
  RefreshCw,
  Flame,
  Loader2,
  Zap,
} from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { sileo } from "sileo"
import { supabase } from "@/lib/supabase"

type BillingPeriod = "monthly" | "annual"

const FEATURES = [
  "Acesso a todos os módulos",
  "Desafios ilimitados",
  "Feedbacks avançados",
  "Suporte prioritário",
]

const EXTRA_FEATURES = [
  { Icon: Award, label: "Certificado de conclusão" },
  { Icon: BookMarked, label: "Conteúdos exclusivos" },
  { Icon: FileText, label: "Modelos de prompts PRO" },
  { Icon: RefreshCw, label: "Atualizações semanais" },
]

export default function Subscription() {
  const navigate = useNavigate()
  const [billing, setBilling] = useState<BillingPeriod>("annual")
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  async function handleSubscribe() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      navigate("/login")
      return
    }

    setCheckoutLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke("stripe-checkout")
      if (error || !data?.url) {
        sileo.error({ title: "Erro", description: "Não foi possível iniciar o checkout." })
        return
      }
      window.location.href = data.url
    } catch {
      sileo.error({ title: "Erro", description: "Não foi possível iniciar o checkout." })
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-[420px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stroke-muted bg-white shadow-sm transition-all hover:bg-surface-soft"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5 text-primary-dark" />
          </button>
          <span className="text-lg font-extrabold text-primary-dark">PromptLabz</span>
          <span className="rounded-full bg-primary-dark px-3 py-1 text-xs font-bold text-white">
            PRO
          </span>
        </div>

        {/* Hero section */}
        <div className="flex items-center gap-2 px-5 pb-6 pt-1">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold leading-snug text-foregroundDark">
              Destrave todo o seu potencial com PromptLabz PRO
            </h1>
            <p className="mt-2 text-sm text-foregroundMuted">
              Recursos avançados para quem quer sair do básico e dominar de verdade.
            </p>
          </div>
          <img
            src="/assets/mascot-teacher.png"
            alt="PromptLabz PRO"
            className="h-40 w-auto shrink-0 object-contain"
          />
        </div>

        {/* Billing toggle */}
        <div className="mx-5 mb-6 flex rounded-full border border-stroke-light bg-pageBgLight p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              "flex-1 rounded-full py-2.5 text-sm font-semibold transition-all",
              billing === "monthly"
                ? "bg-white text-foregroundDark shadow-sm"
                : "text-foregroundMuted hover:text-primary-dark"
            )}
          >
            Mensal
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={cn(
              "flex-1 rounded-full py-2.5 text-sm font-semibold transition-all",
              billing === "annual"
                ? "bg-white text-foregroundDark shadow-sm"
                : "text-foregroundMuted hover:text-primary-dark"
            )}
          >
            Anual <Flame className="inline h-3.5 w-3.5 text-orange-500" /> 2 meses grátis
          </button>
        </div>

        {/* Pricing cards */}
        <div className="mx-5 mb-6 flex gap-3">
          {/* Mensal card */}
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              "flex flex-1 flex-col rounded-2xl border-2 bg-white p-4 text-left transition-all",
              billing === "monthly"
                ? "border-emerald shadow-md"
                : "border-[#E5EDEA] shadow-sm hover:border-stroke-light"
            )}
          >
            <p className="text-sm font-bold text-foregroundDark">Mensal</p>
            <p className="mt-2 text-3xl font-extrabold text-foregroundDark">R$ 29,90</p>
            <p className="text-xs text-foregroundMuted">/mês</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-foregroundSecondary">
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-center">
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 transition-all",
                  billing === "monthly"
                    ? "border-emerald bg-emerald"
                    : "border-stroke-muted bg-white"
                )}
              />
            </div>
          </button>

          {/* Anual card */}
          <button
            onClick={() => setBilling("annual")}
            className={cn(
              "relative flex flex-1 flex-col rounded-2xl border-2 bg-white p-4 pt-7 text-left transition-all",
              billing === "annual"
                ? "border-emerald shadow-md"
                : "border-[#E5EDEA] shadow-sm hover:border-stroke-light"
            )}
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald px-3 py-1 text-[10px] font-bold text-white">
              Mais escolhido
            </span>
            <p className="text-sm font-bold text-emerald">Anual</p>
            <p className="mt-2 text-3xl font-extrabold text-foregroundDark">R$ 299,00</p>
            <p className="text-xs text-foregroundMuted">/ano</p>
            <p className="mt-1 text-xs font-semibold text-emerald">Economize R$ 59,80</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-foregroundSecondary">
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-center">
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 transition-all",
                  billing === "annual"
                    ? "border-emerald bg-emerald"
                    : "border-stroke-muted bg-white"
                )}
              />
            </div>
          </button>
        </div>

        {/* Extra features grid */}
        <div className="mx-5 mb-8 grid grid-cols-2 gap-3">
          {EXTRA_FEATURES.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-2xl border border-stroke-muted bg-white px-3 py-3 shadow-sm"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-pageBgLight">
                <Icon className="h-4 w-4 text-emerald" />
              </div>
              <span className="text-xs font-semibold leading-tight text-foregroundDark">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-5 pb-10">
          <Button
            size="lg"
            className="w-full gap-1 text-lg"
            onClick={handleSubscribe}
            disabled={checkoutLoading}
          >
            {checkoutLoading ? (
              <>
                Redirecionando... <Loader2 className="inline h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Começar agora <Zap className="inline h-4 w-4 ml-1" />
              </>
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-foregroundPlaceholder">
            7 dias grátis. Cancele quando quiser.
          </p>
        </div>
      </div>
    </div>
  )
}
