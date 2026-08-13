import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-stroke-muted bg-card px-4 py-3">
        <Link to="/signup" className="rounded-full p-1.5 text-forest hover:bg-surface-success">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-base font-bold text-primary-dark">Política de Privacidade</h1>
      </div>

      <div className="flex-1 px-5 py-6 prose prose-sm max-w-none text-foreground-secondary">
        <p className="text-xs text-foreground-tertiary mb-4">Última atualização: junho de 2025</p>

        <h2 className="text-base font-bold text-foreground-dark mt-4 mb-2">1. Dados Coletados</h2>
        <p>
          Coletamos apenas os dados necessários para o funcionamento do serviço: nome, e-mail,
          progresso nas lições e preferências de uso. Não coletamos dados sensíveis sem
          consentimento explícito.
        </p>

        <h2 className="text-base font-bold text-foreground-dark mt-4 mb-2">2. Uso dos Dados</h2>
        <p>
          Seus dados são utilizados para: personalizar sua experiência de aprendizado, salvar seu
          progresso, enviar notificações relevantes sobre o serviço e melhorar a plataforma.
        </p>

        <h2 className="text-base font-bold text-foreground-dark mt-4 mb-2">3. Compartilhamento</h2>
        <p>
          Não vendemos nem compartilhamos seus dados pessoais com terceiros, exceto quando
          necessário para o funcionamento do serviço (provedores de infraestrutura como Supabase) ou
          exigido por lei.
        </p>

        <h2 className="text-base font-bold text-foreground-dark mt-4 mb-2">4. Armazenamento</h2>
        <p>
          Seus dados são armazenados de forma segura em servidores da Supabase. Aplicamos medidas
          técnicas para proteger suas informações contra acesso não autorizado.
        </p>

        <h2 className="text-base font-bold text-foreground-dark mt-4 mb-2">
          5. Seus Direitos (LGPD)
        </h2>
        <p>
          Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem direito a: acessar
          seus dados, corrigi-los, solicitar exclusão e portabilidade. Para exercer esses direitos,
          entre em contato conosco.
        </p>

        <h2 className="text-base font-bold text-foreground-dark mt-4 mb-2">6. Cookies</h2>
        <p>
          Utilizamos cookies essenciais para autenticação e cookies de análise (PostHog) para
          entender como o app é usado e melhorá-lo. Você pode desativar cookies analíticos nas
          configurações do navegador.
        </p>

        <h2 className="text-base font-bold text-foreground-dark mt-4 mb-2">7. Contato</h2>
        <p>
          Para exercer seus direitos ou tirar dúvidas sobre privacidade:{" "}
          <a href="mailto:privacidade@promptlabz.com" className="text-forest underline">
            privacidade@promptlabz.com
          </a>
        </p>
      </div>
    </div>
  )
}
