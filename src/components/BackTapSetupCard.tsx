import { Smartphone, ExternalLink } from 'lucide-react'

const STEPS = [
  'Abra o app Atalhos no iPhone',
  'Novo atalho → Abrir URL → https://promptlabz.com/?action=enhance',
  'Ajustes → Acessibilidade → Toque',
  'Back Tap → Toque Duplo → seu atalho',
]

export function BackTapSetupCard() {
  return (
    <div className="rounded-2xl border-2 border-stroke-light bg-card overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b border-stroke-light">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-soft">
          <Smartphone className="h-6 w-6 text-foreground-secondary" />
        </div>
        <div>
          <p className="font-bold text-foreground-dark">Configurar Back Tap</p>
          <p className="text-xs text-foreground-tertiary leading-relaxed">
            Ative o aprimoramento rápido com 2 toques na parte traseira do iPhone
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-foreground-dark text-background text-sm font-extrabold">
              {i + 1}
            </span>
            <p className="text-sm text-foreground-secondary leading-relaxed pt-0.5">{step}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-stroke-light p-4">
        <a
          href="App-Prefs:root=ACCESSIBILITY"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-surface-soft py-3 text-sm font-bold text-foreground-secondary transition-colors hover:bg-stroke-light"
        >
          Abrir Ajustes
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
