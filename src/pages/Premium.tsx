import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, Sparkles, Loader2, Crown, Lock, Star } from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { PremiumPlanCard } from "@/components/premium/PremiumPlanCard"
import { PremiumBenefitCard } from "@/components/premium/PremiumBenefitCard"
import {
  PREMIUM_PLANS,
  PREMIUM_FEATURES,
  type BillingCycle,
} from "@/data/premiumData"
import { cn } from "@/lib/utils"
import { AppBottomNav } from "@/components/AppBottomNav"
import { sileo } from "sileo"
import { supabase } from "@/lib/supabase"
import { trackPremiumViewed } from "@/lib/analytics"
import { tryCompleteSpecialQuest } from "@/lib/missions"
import { PageSEO } from "@/components/PageSEO"
import { useAuthContext } from "@/contexts/AuthContext"
import { Link } from "react-router-dom"

export default function Premium() {
  const navigate = useNavigate()
  const { user } = useAuthContext()

  useEffect(() => {
    trackPremiumViewed()
    tryCompleteSpecialQuest("try-premium")
  }, [])
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly")
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const handleStartPremium = async () => {
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
        sileo.error({
          title: "Erro",
          description: "Não foi possível iniciar o checkout.",
        })
        return
      }
      window.location.href = data.url
    } catch {
      sileo.error({
        title: "Erro",
        description: "Não foi possível iniciar o checkout.",
      })
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-surface-success to-background px-4 py-6 pb-24 lg:pb-8">
      <PageSEO
        title="Premium — Planos PromptLabz"
        description="Conheça os planos Premium do PromptLabz: IA ilimitada, gamificação completa e recursos exclusivos para acelerar seu aprendizado de engenharia de prompts."
        canonicalPath="/premium"
      />
      <div className="mx-auto w-full max-w-lg lg:max-w-2xl">
        {/* Back button */}
        <button
          onClick={() => navigate(user ? "/home" : "/")}
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-forest transition-colors hover:bg-surface-success"
          aria-label="Voltar"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
        </button>

        {/* Hero section */}
        <div className="relative mb-6 overflow-hidden">
          <div className="pointer-events-none absolute -left-10 top-4 h-40 w-40 rounded-full bg-emerald/10 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-10 h-32 w-32 rounded-full bg-emerald/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-extrabold">
                <span className="text-foregroundDark">Prompt</span>
                <span className="text-emerald">Labz</span>
              </p>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-success px-3 py-1 text-xs font-semibold text-emerald">
                <Sparkles aria-hidden className="h-3.5 w-3.5" />
                Desbloqueie todo o potencial
              </div>

              <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                <span className="text-foregroundDark">Seja </span>
                <span className="text-emerald">Premium</span>
              </h1>

              <p className="mt-1.5 max-w-[220px] text-sm leading-relaxed text-foregroundMuted">
                Acesse recursos exclusivos e acelere seus estudos com IA.
              </p>
            </div>

            <div className="relative shrink-0">
              <img
                src="/assets/mascot-premium.png"
                alt="Mascote PromptLabz comemorando"
                className="h-48 w-auto object-contain lg:h-56"
              />
              <Sparkles
                aria-hidden
                className="absolute -left-3 top-3 h-3.5 w-3.5 text-emerald opacity-40"
              />
              <Star aria-hidden className="absolute right-0 top-0 h-3 w-3 text-emerald opacity-30" />
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-stroke-muted bg-white p-5 shadow-md dark:border-emerald/40">
          {/* Billing toggle */}
          <div className="mb-5 flex items-center gap-1 rounded-full bg-pageBgLight p-1">
            {PREMIUM_PLANS.map((plan) => {
              const isSelected = billingCycle === plan.id
              return (
                <button
                  key={plan.id}
                  onClick={() => setBillingCycle(plan.id)}
                  aria-pressed={isSelected}
                  data-selected={isSelected}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    isSelected
                      ? "border border-emerald bg-white text-emerald dark:border-transparent dark:bg-emerald dark:text-white"
                      : "border border-transparent text-foregroundMuted hover:text-foregroundDark",
                  )}
                >
                  {plan.title}
                  {plan.badge && (
                    <span className="rounded-full bg-emerald px-1.5 py-0.5 text-[10px] font-bold text-white">
                      -40%
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Plan cards */}
          <div className="mb-2 flex flex-col gap-3" role="radiogroup" aria-label="Ciclo de cobrança">
            {PREMIUM_PLANS.map((plan) => (
              <PremiumPlanCard
                key={plan.id}
                plan={plan}
                selected={billingCycle === plan.id}
                onSelect={() => setBillingCycle(plan.id)}
              />
            ))}
          </div>

          {/* Features list */}
          <section className="mt-5">
            <div className="mb-1 flex items-center justify-center gap-2 text-sm font-bold text-foregroundDark">
              <Sparkles aria-hidden className="h-4 w-4 text-emerald" />
              Todos os planos incluem
              <Sparkles aria-hidden className="h-4 w-4 text-emerald" />
            </div>
            <div className="divide-y divide-stroke-muted">
              {PREMIUM_FEATURES.map((feature) => (
                <PremiumBenefitCard key={feature.id} feature={feature} variant="row" />
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="mt-5 text-center">
            <Button
              size="lg"
              className={cn(
                "w-full shadow-lg shadow-emerald/20",
                checkoutLoading ? "gap-2" : "h-auto flex-col gap-0.5 py-3 normal-case tracking-normal",
              )}
              onClick={handleStartPremium}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecionando...
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5 text-[15px] font-extrabold">
                    Quero ser Premium <Crown aria-hidden className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-medium opacity-90">Comece sua jornada agora</span>
                </>
              )}
            </Button>
            <p className="mt-2 text-xs font-medium text-foregroundMuted">
              30 dias grátis · cancele quando quiser
            </p>
          </div>
        </div>

        {/* Footer trust line */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-foregroundMuted">
          <Lock aria-hidden className="h-3.5 w-3.5" />
          Pagamento seguro · Cancele quando quiser
        </div>

        <p className="mb-8 mt-3 text-center text-xs text-foregroundMuted">
          Ao assinar, você concorda com os{" "}
          <Link to="/terms" className="underline underline-offset-2 hover:text-primary">
            Termos de Uso
          </Link>{" "}
          e a{" "}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-primary">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>

      {user ? (
        <AppBottomNav />
      ) : (
        <div className="fixed inset-x-0 bottom-0 border-t border-stroke-muted bg-white/95 px-5 py-3 backdrop-blur">
          <Link
            to="/signup"
            className="mx-auto flex h-11 max-w-lg items-center justify-center rounded-full bg-primary-dark px-6 text-sm font-bold text-white hover:bg-emerald"
          >
            Começar grátis
          </Link>
        </div>
      )}
    </div>
  )
}
