import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-stroke-muted bg-card px-4 py-3">
        <Link to="/signup" className="rounded-full p-1.5 text-forest hover:bg-surface-success">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-base font-bold text-primary-dark">Termos de Uso</h1>
      </div>

      <div className="flex-1 px-5 py-6 prose prose-sm max-w-none text-foreground-secondary">
        <p className="text-xs text-foreground-tertiary mb-4">Última atualização: junho de 2025</p>

        <h2 className="text-base font-bold text-foreground-dark mt-4 mb-2">
          1. Aceitação dos Termos
        </h2>
        <p>
          Ao criar uma conta no PromptLabz, você concorda com estes Termos de Uso. Se não concordar,
          não utilize o serviço.
        </p>

        <h2 className="text-base font-bold text-foreground-dark mt-4 mb-2">2. Uso do Serviço</h2>
        <p>
          O PromptLabz é uma plataforma educacional gamificada para aprendizado de engenharia de
          prompts. Você se compromete a usar o serviço de forma ética e legal.
        </p>

        <h2 className="text-base font-bold text-foreground-dark mt-4 mb-2">3. Conta de Usuário</h2>
        <p>
          Você é responsável por manter a confidencialidade de suas credenciais de acesso.
          Notifique-nos imediatamente em caso de acesso não autorizado à sua conta.
        </p>

        <h2 className="text-base font-bold text-foreground-dark mt-4 mb-2">4. Conteúdo</h2>
        <p>
          O conteúdo educacional disponível no PromptLabz é protegido por direitos autorais. É
          proibida a reprodução, distribuição ou venda sem autorização expressa.
        </p>

        <h2 className="text-base font-bold text-foreground-dark mt-4 mb-2">
          5. Plano Gratuito e Premium
        </h2>
        <p>
          O PromptLabz oferece acesso gratuito ao conteúdo básico. Funcionalidades premium estão
          sujeitas a cobrança conforme planos disponíveis.
        </p>

        <h2 className="text-base font-bold text-foreground-dark mt-4 mb-2">6. Modificações</h2>
        <p>
          Reservamo-nos o direito de modificar estes termos a qualquer momento. Notificaremos os
          usuários sobre alterações significativas.
        </p>

        <h2 className="text-base font-bold text-foreground-dark mt-4 mb-2">7. Contato</h2>
        <p>
          Para dúvidas sobre estes Termos, entre em contato:{" "}
          <a href="mailto:contato@promptlabz.com" className="text-forest underline">
            contato@promptlabz.com
          </a>
        </p>
      </div>
    </div>
  )
}
