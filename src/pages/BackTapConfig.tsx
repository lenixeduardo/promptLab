import {
  ExternalLink,
  Link as LinkIcon,
  Settings as SettingsIcon,
  Hand,
  Smartphone,
} from "lucide-react"
import { AppBottomNav } from "@/components/AppBottomNav"
import { AppPageHeader } from "@/components/AppPageHeader"

const BACK_TAP_STEPS = [
  {
    icon: <LinkIcon className="h-5 w-5 text-emerald" strokeWidth={2.5} />,
    text: "Abra o app Atalhos no iPhone",
  },
  {
    icon: <LinkIcon className="h-5 w-5 text-emerald" strokeWidth={2.5} />,
    text: "Novo atalho → Abrir URL → https://promptlabz.com/?action=enhance",
  },
  {
    icon: <SettingsIcon className="h-5 w-5 text-emerald" strokeWidth={2.5} />,
    text: "Ajustes → Acessibilidade → Toque",
  },
  {
    icon: <Hand className="h-5 w-5 text-emerald" strokeWidth={2.5} />,
    text: "Back Tap → Toque Duplo → seu atalho",
  },
]

export default function BackTapConfigPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white pb-24 lg:pb-8">
      <AppPageHeader title="Configurar Back Tap" back="/settings" />

      <img
        src="/assets/mascot-settings.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-0 z-20 w-36 object-contain"
      />

      <div className="mx-auto w-full max-w-lg space-y-4 px-4 py-5">
        <div className="rounded-2xl border-2 border-stroke-light bg-card">
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface-soft">
              <Smartphone className="h-5 w-5 text-foreground-dark" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground-dark">Acesso rápido pelo iPhone</p>
              <p className="mt-0.5 text-xs leading-relaxed text-foreground-muted">
                Ative o aprimoramento rápido com 2 toques na parte traseira do iPhone
              </p>
            </div>
          </div>

          <div className="space-y-3 border-t border-stroke-muted px-4 py-4">
            {BACK_TAP_STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald text-[11px] font-extrabold text-white">
                  {i + 1}
                </div>
                <p className="flex-1 pt-0.5 text-xs leading-relaxed text-foreground-dark">
                  {step.text}
                </p>
                <div className="flex-shrink-0 pt-0.5">{step.icon}</div>
              </div>
            ))}
          </div>

          <div className="px-4 pb-4">
            <button
              onClick={() => window.open("App-prefs:", "_blank")}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald py-3 text-sm font-bold text-emerald hover:bg-surface-success transition-colors"
            >
              Abrir Ajustes
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <AppBottomNav />
    </div>
  )
}
