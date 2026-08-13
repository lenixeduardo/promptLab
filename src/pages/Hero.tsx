import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Sparkles, Heart, Star, Play, BookOpen, Zap, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/BrandLogo"
import { CircleTransition } from "@/components/CircleTransition"
import { PageSEO } from "@/components/PageSEO"
import { capture } from "@/lib/analytics"

const HAS_ACCOUNT_KEY = "promptlabz:hasAccount"

const NAV_LINKS = [
  { label: "Recursos", href: "#recursos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Gamificação", href: "#gamificacao" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Planos", href: "#planos" },
  { label: "FAQ", href: "#faq" },
]

export default function Hero() {
  const [transitioning, setTransitioning] = useState(false)
  const navigate = useNavigate()
  const hasAccount =
    typeof window !== "undefined" && localStorage.getItem(HAS_ACCOUNT_KEY) === "true"

  function handleCTA() {
    if (hasAccount) {
      capture("hero_cta_clicked", { cta_text: "Continuar aprendendo" })
      navigate("/login")
    } else {
      capture("hero_cta_clicked", { cta_text: "Começar agora" })
      setTransitioning(true)
    }
  }

  function handleLoginClick() {
    capture("hero_login_clicked")
    navigate("/login")
  }

  function handleWatchDemo() {
    capture("hero_watch_demo_clicked")
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" data-force-light>
      <PageSEO
        title="Aprenda Engenharia de Prompts — Curso Gratuito de IA"
        description="Aprenda engenharia de prompts do zero com lições gamificadas. Plataforma 100% gratuita para dominar ChatGPT, Claude e IA generativa. Comece agora sem cartão de crédito!"
        canonicalPath="/"
      />
      <CircleTransition to="/signup" active={transitioning} />

      {/* ── Desktop Navbar (hidden on mobile) ── */}
      <nav className="hidden lg:flex items-center justify-between px-8 xl:px-16 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <BrandLogo className="text-2xl" />

        <ul className="flex items-center gap-6 xl:gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-[#4A6741] hover:text-[#1A3B24] font-medium transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <Button
          size="default"
          className="flex items-center gap-2 px-6"
          disabled={transitioning}
          onClick={handleCTA}
        >
          <span className="text-sm font-bold tracking-wide">
            {hasAccount ? "CONTINUAR" : "COMEÇAR AGORA"}
          </span>
          <ArrowRight className="h-4 w-4 flex-shrink-0" />
        </Button>
      </nav>

      {/* ── Seção 1: Hero ── */}
      <section className="relative bg-[#EEF9F4] overflow-hidden" style={{ minHeight: "520px" }}>
        {/* ── MOBILE layout ── */}
        <div className="lg:hidden">
          {/* Mascote posicionado à direita como background */}
          <img
            src="/assets/mascot-hero.png"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="absolute right-0 top-0 h-[108%] w-auto pointer-events-none select-none"
          />

          {/* Sparkles decorativos */}
          <Sparkles
            className="animate-twinkle absolute top-24 right-[40%] h-3.5 w-3.5 text-emerald-400/70"
            style={{ animationDelay: "0.4s" }}
          />
          <Sparkles
            className="animate-twinkle absolute top-12 right-[32%] h-3 w-3 text-[#7CC79A]/60"
            style={{ animationDelay: "1.2s" }}
          />

          {/* Conteúdo — coluna esquerda */}
          <div className="relative z-10 flex flex-col px-5 pt-10 pb-10 max-w-[58%]">
            <BrandLogo className="text-2xl mb-10" />

            <h1 className="font-extrabold text-[#1A3B24] leading-[1.1] mb-4">
              <span className="text-[2.5rem]">Aprenda IA</span>
              <br />
              <span className="text-[2rem]">do zero ao</span>
              <br />
              <span className="text-[2rem]">avançado</span>
            </h1>

            <p className="text-sm text-[#4A6741] leading-snug mb-1">
              Domine ChatGPT, Claude e IA generativa com lições gamificadas.
            </p>
            <p className="text-sm text-[#4A6741] leading-snug mb-7">
              Do zero ao avançado, sem precisar saber programar.
            </p>

            <Button
              size="default"
              className="flex items-center justify-between px-5 w-full"
              disabled={transitioning}
              onClick={handleCTA}
            >
              <span className="text-[13px]">{hasAccount ? "CONTINUAR" : "COMEÇAR AGORA"}</span>
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Button>
          </div>
        </div>

        {/* ── DESKTOP layout ── */}
        <div className="hidden lg:flex items-center justify-between px-8 xl:px-16 2xl:px-24 pt-12 pb-0 min-h-[560px] xl:min-h-[620px] max-w-[1400px] mx-auto w-full">
          {/* Left column */}
          <div className="flex flex-col max-w-[560px] xl:max-w-[620px] z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/70 border border-[#A8D5B5] rounded-full px-3.5 py-1.5 w-fit mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[#2A7A4B]" />
              <span className="text-xs font-semibold text-[#2A7A4B]">Do zero ao avançado</span>
            </div>

            {/* H1 */}
            <h1 className="font-extrabold text-[#1A3B24] leading-[1.05] mb-5">
              <span className="text-[3.25rem] xl:text-[3.75rem] block">Aprenda IA</span>
              <span className="text-[3rem] xl:text-[3.5rem] block">do zero ao</span>
              <span className="text-[3rem] xl:text-[3.5rem] block text-[#22C55E]">avançado</span>
            </h1>

            {/* Description */}
            <p className="text-base xl:text-lg text-[#4A6741] leading-relaxed mb-8 max-w-[460px]">
              Domine ChatGPT, Claude e IA generativa com lições gamificadas.
              <br />
              Do zero ao avançado, sem precisar saber programar.
            </p>

            {/* CTA buttons */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                size="lg"
                className="flex items-center gap-3 px-8 text-base font-bold tracking-wide"
                disabled={transitioning}
                onClick={handleCTA}
              >
                {hasAccount ? "CONTINUAR" : "COMEÇAR AGORA"}
                <ArrowRight className="h-5 w-5 flex-shrink-0" />
              </Button>

              <button
                className="flex items-center gap-2.5 text-[#2A7A4B] font-medium text-sm hover:text-[#1A3B24] transition-colors group"
                onClick={handleWatchDemo}
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-[#2A7A4B] group-hover:border-[#1A3B24] transition-colors">
                  <Play className="h-3.5 w-3.5 fill-[#2A7A4B] group-hover:fill-[#1A3B24] transition-colors ml-0.5" />
                </span>
                Ver como funciona
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#2A7A4B]" />
                <span className="text-sm text-[#4A6741]">
                  <strong className="text-[#1A3B24]">68+</strong> lições
                </span>
              </div>
              <span className="text-[#A8D5B5]">•</span>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#2A7A4B]" />
                <span className="text-sm text-[#4A6741]">Gamificado</span>
              </div>
              <span className="text-[#A8D5B5]">•</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#2A7A4B]" />
                <span className="text-sm text-[#4A6741]">
                  <strong className="text-[#1A3B24]">100%</strong> grátis
                </span>
              </div>
            </div>
          </div>

          {/* Right column — mascot */}
          <div className="relative flex-shrink-0 self-end">
            {/* Sparkles decorativos (desktop) */}
            <Sparkles
              className="animate-twinkle absolute -top-8 -left-16 h-5 w-5 text-emerald-400/70"
              style={{ animationDelay: "0.4s" }}
            />
            <Sparkles
              className="animate-twinkle absolute top-16 -left-8 h-3.5 w-3.5 text-[#7CC79A]/60"
              style={{ animationDelay: "1.2s" }}
            />
            <Sparkles
              className="animate-twinkle absolute top-8 right-4 h-4 w-4 text-emerald-300/50"
              style={{ animationDelay: "0.8s" }}
            />

            <img
              src="/assets/mascot-hero.png"
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              className="animate-mascot-float will-change-transform h-[480px] xl:h-[560px] w-auto object-contain pointer-events-none select-none"
            />
          </div>
        </div>
      </section>

      {/* Onda de transição hero → features */}
      <div className="relative -mt-px">
        <svg
          viewBox="0 0 390 48"
          preserveAspectRatio="none"
          className="w-full block"
          style={{ height: "48px" }}
        >
          <path d="M0,0 Q195,48 390,0 L390,48 L0,48 Z" fill="white" />
        </svg>
        <div className="absolute inset-0 top-auto h-px bg-white" />
      </div>

      {/* ── Seção 2: Features ── */}
      <section className="bg-white px-4 lg:px-8 xl:px-16 pt-2 pb-8 lg:pb-16">
        {/* Heading */}
        <div className="flex items-center justify-center gap-2 mb-2 lg:mb-3">
          <Sparkles className="h-4 w-4 text-[#4CAF50] flex-shrink-0" />
          <h2 className="text-[15px] lg:text-2xl xl:text-3xl font-bold text-[#1A3B24] text-center leading-tight">
            Aprenda brincando. Evolua de verdade.
          </h2>
          <Sparkles className="h-4 w-4 text-[#4CAF50] flex-shrink-0" />
        </div>
        <p className="text-sm lg:text-base text-[#4A6741] text-center leading-relaxed mb-6 lg:mb-10">
          Lições curtas, desafios e recompensas para
          <br />
          você aprender mais e melhor todos os dias.
        </p>

        {/* 3 cards — mobile: stacked columns, desktop: horizontal with icon on left */}
        <div className="grid grid-cols-3 gap-3 lg:gap-6 max-w-4xl lg:mx-auto">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 lg:p-6 flex flex-col lg:flex-row items-center lg:items-start lg:gap-5 text-center lg:text-left">
            <img
              src="/assets/mascot-hero-laptop.png"
              alt="Lições práticas"
              className="w-14 h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-contain mb-2 lg:mb-0 flex-shrink-0"
            />
            <div className="flex-1">
              <p className="text-[11px] lg:text-base font-bold text-[#1A3B24] mb-1 leading-tight">
                Lições práticas
              </p>
              <p className="text-[10px] lg:text-sm text-[#4A6741] leading-snug lg:leading-relaxed">
                Conteúdo direto ao ponto com exemplos reais.
              </p>
              <div className="hidden lg:block h-0.5 w-8 bg-[#22C55E] rounded-full mt-3" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 lg:p-6 flex flex-col lg:flex-row items-center lg:items-start lg:gap-5 text-center lg:text-left">
            <img
              src="/assets/icon-trophy.png"
              alt="Gamificado"
              className="w-14 h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-contain mb-2 lg:mb-0 flex-shrink-0"
            />
            <div className="flex-1">
              <p className="text-[11px] lg:text-base font-bold text-[#1A3B24] mb-1 leading-tight">
                Gamificado
              </p>
              <p className="text-[10px] lg:text-sm text-[#4A6741] leading-snug lg:leading-relaxed">
                Ganhe XP, conquistas e suba de nível.
              </p>
              <div className="hidden lg:block h-0.5 w-8 bg-[#22C55E] rounded-full mt-3" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 lg:p-6 flex flex-col lg:flex-row items-center lg:items-start lg:gap-5 text-center lg:text-left">
            <img
              src="/assets/icon-fire.png"
              alt="Progresso real"
              className="w-14 h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-contain mb-2 lg:mb-0 flex-shrink-0"
            />
            <div className="flex-1">
              <p className="text-[11px] lg:text-base font-bold text-[#1A3B24] mb-1 leading-tight">
                Progresso real
              </p>
              <p className="text-[10px] lg:text-sm text-[#4A6741] leading-snug lg:leading-relaxed">
                Acompanhe seu progresso e veja sua evolução.
              </p>
              <div className="hidden lg:block h-0.5 w-8 bg-[#22C55E] rounded-full mt-3" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 3: Prova social ── */}
      <section className="px-4 lg:px-8 xl:px-16 pb-10 lg:pb-16">
        <div className="bg-[#EAF7F0] rounded-2xl p-4 lg:p-6 xl:p-8 flex items-center gap-3 lg:gap-6 max-w-4xl lg:mx-auto">
          {/* Coração */}
          <div className="bg-[#C5EDD6] rounded-xl p-2.5 lg:p-4 flex-shrink-0">
            <Heart className="h-5 w-5 lg:h-7 lg:w-7 text-[#2A7A4B] fill-[#2A7A4B]" />
          </div>

          {/* Texto + avatares */}
          <div className="flex-1 min-w-0">
            <p className="text-xs lg:text-sm xl:text-base text-[#1A3B24] leading-snug mb-2">
              Junte-se aos alunos
              <br className="lg:hidden" /> que já estão evoluindo
              <br className="lg:hidden" /> com o{" "}
              <span className="text-[#2A7A4B] font-bold">PromptLabz</span>
            </p>
            <div className="flex -space-x-2">
              {["avatar-cat", "avatar-punk", "avatar-rocker"].map((name) => (
                <img
                  key={name}
                  src={`/assets/${name}.png`}
                  alt=""
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="flex-shrink-0 text-right">
            <div className="flex gap-0.5 justify-end mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 lg:h-5 lg:w-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-lg lg:text-2xl xl:text-3xl font-extrabold text-[#1A3B24] leading-none">
              4.9/5
            </p>
            <p className="text-[10px] lg:text-xs text-[#4A6741] mt-0.5">de alunos</p>
          </div>
        </div>

        {/* Link "Já tem conta?" discreto */}
        <p className="text-sm text-[#4A6741] text-center mt-6">
          Já tem uma conta?{" "}
          <button
            className="font-bold text-[#2A7A4B] underline-offset-2 hover:underline"
            onClick={handleLoginClick}
          >
            Entrar
          </button>
        </p>
      </section>
    </div>
  )
}
