import { Link } from "react-router-dom";
import { Swords, ArrowLeft, Clock } from "lucide-react";
import { AppBottomNav } from "@/components/AppBottomNav"

export default function PromptWarsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white pb-24 lg:pb-8">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-stroke-muted bg-card px-4 py-3">
        <Link to="/home" className="rounded-full p-1.5 text-forest hover:bg-surface-success">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          <Swords className="h-5 w-5 text-red-400" strokeWidth={2.4} />
          <h1 className="text-base font-bold text-primary-dark">Prompt Wars</h1>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-red-50 text-red-400 dark:bg-red-950/40 dark:text-red-400">
          <Swords className="h-12 w-12" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-primary-dark">Em breve</h2>
          <p className="text-sm text-foreground-tertiary max-w-xs">
            Os duelos de prompts em tempo real estão chegando. Complete as trilhas A1 e A2 para estar preparado quando os Prompt Wars abrirem!
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-500 dark:bg-red-950/40 dark:text-red-300">
          <Clock className="h-4 w-4" />
          Disponível na v0.1
        </div>
        <Link
          to="/learn"
          className="flex items-center gap-2 rounded-2xl bg-emerald px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-emerald/30"
        >
          Continuar trilha enquanto isso
        </Link>
      </div>

      <AppBottomNav />
    </div>
  );
}
