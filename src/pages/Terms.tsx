import { LegalPageLayout } from "@/components/legal/LegalPageLayout"

export default function TermsPage() {
  return (
    <LegalPageLayout
      seoTitle="Termos de Uso"
      seoDescription="Termos de Uso do PromptLabz — condições de uso da plataforma educacional gamificada de engenharia de prompts."
      canonicalPath="/terms"
      title="Termos de Uso"
      lastUpdated="junho de 2025"
      sections={[
        {
          id: "aceitacao",
          heading: "1. Aceitação dos Termos",
          body: <p>Ao criar uma conta no PromptLabz, você concorda com estes Termos de Uso. Se não concordar, não utilize o serviço.</p>,
        },
        {
          id: "uso-do-servico",
          heading: "2. Uso do Serviço",
          body: <p>O PromptLabz é uma plataforma educacional gamificada para aprendizado de engenharia de prompts. Você se compromete a usar o serviço de forma ética e legal.</p>,
        },
        {
          id: "conta-de-usuario",
          heading: "3. Conta de Usuário",
          body: <p>Você é responsável por manter a confidencialidade de suas credenciais de acesso. Notifique-nos imediatamente em caso de acesso não autorizado à sua conta.</p>,
        },
        {
          id: "conteudo",
          heading: "4. Conteúdo",
          body: <p>O conteúdo educacional disponível no PromptLabz é protegido por direitos autorais. É proibida a reprodução, distribuição ou venda sem autorização expressa.</p>,
        },
        {
          id: "plano-gratuito-e-premium",
          heading: "5. Plano Gratuito e Premium",
          body: <p>O PromptLabz oferece acesso gratuito ao conteúdo básico. Funcionalidades premium estão sujeitas a cobrança conforme planos disponíveis.</p>,
        },
        {
          id: "modificacoes",
          heading: "6. Modificações",
          body: <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Notificaremos os usuários sobre alterações significativas.</p>,
        },
        {
          id: "contato",
          heading: "7. Contato",
          body: (
            <p>
              Para dúvidas sobre estes Termos, entre em contato:{" "}
              <a href="mailto:contato@promptlabz.com">contato@promptlabz.com</a>
            </p>
          ),
        },
      ]}
    />
  )
}
