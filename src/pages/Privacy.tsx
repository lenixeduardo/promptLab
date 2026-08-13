import { LegalPageLayout } from "@/components/legal/LegalPageLayout"

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      seoTitle="Política de Privacidade"
      seoDescription="Política de Privacidade do PromptLabz — como coletamos, usamos e protegemos seus dados, em conformidade com a LGPD."
      canonicalPath="/privacy"
      title="Política de Privacidade"
      lastUpdated="junho de 2025"
      sections={[
        {
          id: "dados-coletados",
          heading: "1. Dados Coletados",
          body: <p>Coletamos apenas os dados necessários para o funcionamento do serviço: nome, e-mail, progresso nas lições e preferências de uso. Não coletamos dados sensíveis sem consentimento explícito.</p>,
        },
        {
          id: "uso-dos-dados",
          heading: "2. Uso dos Dados",
          body: <p>Seus dados são utilizados para: personalizar sua experiência de aprendizado, salvar seu progresso, enviar notificações relevantes sobre o serviço e melhorar a plataforma.</p>,
        },
        {
          id: "compartilhamento",
          heading: "3. Compartilhamento",
          body: <p>Não vendemos nem compartilhamos seus dados pessoais com terceiros, exceto quando necessário para o funcionamento do serviço (provedores de infraestrutura como Supabase) ou exigido por lei.</p>,
        },
        {
          id: "armazenamento",
          heading: "4. Armazenamento",
          body: <p>Seus dados são armazenados de forma segura em servidores da Supabase. Aplicamos medidas técnicas para proteger suas informações contra acesso não autorizado.</p>,
        },
        {
          id: "seus-direitos-lgpd",
          heading: "5. Seus Direitos (LGPD)",
          body: <p>Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem direito a: acessar seus dados, corrigi-los, solicitar exclusão e portabilidade. Para exercer esses direitos, entre em contato conosco.</p>,
        },
        {
          id: "cookies",
          heading: "6. Cookies",
          body: <p>Utilizamos cookies essenciais para autenticação e cookies de análise (PostHog) para entender como o app é usado e melhorá-lo. Você pode desativar cookies analíticos nas configurações do navegador.</p>,
        },
        {
          id: "contato",
          heading: "7. Contato",
          body: (
            <p>
              Para exercer seus direitos ou tirar dúvidas sobre privacidade:{" "}
              <a href="mailto:privacidade@promptlabz.com">privacidade@promptlabz.com</a>
            </p>
          ),
        },
      ]}
    />
  )
}
