import { Link } from "react-router-dom"
import { Users, Clock } from "lucide-react"
import { AppBottomNav } from "@/components/AppBottomNav"
import { AppPageHeader } from "@/components/AppPageHeader"

export default function CommunityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white pb-24 lg:pb-8">
      <AppPageHeader title="Comunidade" />

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald/10 text-emerald">
          <Users className="h-12 w-12" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-primary-dark">Em breve</h2>
          <p className="text-sm text-foreground-tertiary max-w-xs">
            O feed da comunidade está a caminho! Você poderá compartilhar prompts, participar de
            desafios e aprender com outros usuários.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald/10 px-4 py-2 text-sm font-semibold text-emerald">
          <Clock className="h-4 w-4" />
          Disponível na v0.1
        </div>
        <Link
          to="/learn"
          className="flex items-center gap-2 rounded-2xl bg-emerald px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-emerald/30"
        >
          Continuar aprendendo
        </Link>
      </div>

      <AppBottomNav />
    </div>
  )
}
