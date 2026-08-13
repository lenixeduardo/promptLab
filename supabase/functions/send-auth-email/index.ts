import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0"

const resendApiKey = Deno.env.get("RESEND_API_KEY")!
const resendFromEmail = Deno.env.get("RESEND_FROM_EMAIL")!
const supabaseUrl = (Deno.env.get("SUPABASE_URL") ?? "").replace(/\/$/, "")
const appUrl = (Deno.env.get("APP_URL") ?? "http://localhost:5173").replace(/\/$/, "")
const appName = Deno.env.get("APP_NAME") ?? "PromptLabz"
const hookSecret = (Deno.env.get("SEND_EMAIL_HOOK_SECRET") ?? "").replace("v1,whsec_", "")

type EmailActionType =
  "signup" | "magiclink" | "recovery" | "email_change" | "reauthentication" | string

interface HookPayload {
  user: {
    email: string
    new_email?: string
    user_metadata?: {
      full_name?: string
      [key: string]: unknown
    }
  }
  email_data: {
    token?: string
    token_hash?: string
    token_new?: string
    token_hash_new?: string
    redirect_to?: string
    email_action_type: EmailActionType
    site_url?: string
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function getRecipientName(payload: HookPayload) {
  return payload.user.user_metadata?.full_name?.trim() || "criador"
}

function getActionCopy(action: EmailActionType) {
  switch (action) {
    case "signup":
      return {
        subject: "Confirme seu email no PromptLabz",
        title: "Confirme seu email",
        body: "Seu acesso estÃ¡ quase pronto. Confirme seu email para liberar login, progresso e trilhas personalizadas.",
        cta: "Confirmar email",
        footer: "Se vocÃª nÃ£o criou conta, ignore este email.",
      }
    case "recovery":
      return {
        subject: "Redefina sua senha no PromptLabz",
        title: "Redefina sua senha",
        body: "Recebemos pedido para trocar sua senha. Use botÃ£o abaixo para continuar com seguranÃ§a.",
        cta: "Redefinir senha",
        footer: "Se vocÃª nÃ£o pediu troca de senha, ignore este email.",
      }
    case "magiclink":
      return {
        subject: "Seu link de acesso do PromptLabz",
        title: "Entre com link seguro",
        body: "Use botÃ£o abaixo para entrar sem digitar senha.",
        cta: "Entrar agora",
        footer: "Se vocÃª nÃ£o pediu acesso, ignore este email.",
      }
    case "email_change":
      return {
        subject: "Confirme alteraÃ§Ã£o de email no PromptLabz",
        title: "Confirme novo email",
        body: "Use botÃ£o abaixo para concluir alteraÃ§Ã£o do seu email de acesso.",
        cta: "Confirmar alteraÃ§Ã£o",
        footer: "Se vocÃª nÃ£o pediu alteraÃ§Ã£o, ignore este email.",
      }
    default:
      return {
        subject: "AÃ§Ã£o de seguranÃ§a no PromptLabz",
        title: "Confirme aÃ§Ã£o na sua conta",
        body: "Recebemos uma aÃ§Ã£o de autenticaÃ§Ã£o na sua conta. Use botÃ£o abaixo para continuar.",
        cta: "Continuar",
        footer: "Se vocÃª nÃ£o reconhece esta aÃ§Ã£o, ignore este email.",
      }
  }
}

function buildConfirmationUrl(tokenHash: string, action: EmailActionType, redirectTo?: string) {
  return `${supabaseUrl}/auth/v1/verify?token=${encodeURIComponent(tokenHash)}&type=${encodeURIComponent(action)}&redirect_to=${encodeURIComponent(redirectTo || `${appUrl}/login`)}`
}

function buildEmailHtml(
  payload: HookPayload,
  confirmationUrl: string,
  tone: "default" | "new-email" = "default"
) {
  const name = escapeHtml(getRecipientName(payload))
  const copy = getActionCopy(payload.email_data.email_action_type)
  const mascotUrl = `${appUrl}/assets/mascot-login-new.png`
  const body =
    tone === "new-email"
      ? `Oi, ${name}. Confirme este novo email para concluir troca de acesso da sua conta.`
      : `Oi, ${name}. ${copy.body}`

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(copy.subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#eaf7ef;font-family:Arial,Helvetica,sans-serif;color:#1f2a24;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eaf7ef;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #cde8d8;border-radius:24px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(180deg,#dff3e6 0%,#f7fcf8 100%);padding:32px 24px 20px;text-align:center;">
                <img src="${mascotUrl}" alt="Mascote PromptLabz" width="120" style="display:block;margin:0 auto 18px;width:120px;height:auto;" />
                <div style="font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#3e8e5e;">${escapeHtml(appName)}</div>
                <h1 style="margin:14px 0 10px;font-size:30px;line-height:1.15;color:#1f2a24;">${escapeHtml(copy.title)}</h1>
                <p style="margin:0 auto;max-width:420px;font-size:16px;line-height:1.6;color:#42564a;">
                  ${escapeHtml(body)}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7fbf8;border:1px solid #dfeee5;border-radius:18px;">
                  <tr>
                    <td style="padding:18px 18px 8px;font-size:14px;font-weight:700;color:#2f6b45;">
                      AÃ§Ã£o segura
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 18px 18px;font-size:14px;line-height:1.6;color:#4f6358;">
                      Clique no botÃ£o abaixo para concluir processo. Link leva vocÃª para ambiente do ${escapeHtml(appName)}, nÃ£o para remetente genÃ©rico do provedor.
                    </td>
                  </tr>
                </table>

                <div style="text-align:center;padding:24px 0 18px;">
                  <a href="${confirmationUrl}" style="display:inline-block;background:#2f8f5b;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:15px 28px;border-radius:999px;">
                    ${escapeHtml(copy.cta)}
                  </a>
                </div>

                <p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:#61766a;text-align:center;">
                  ${escapeHtml(copy.footer)}
                </p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:#8a9a91;word-break:break-all;text-align:center;">
                  Se botÃ£o falhar, copie link:<br />
                  <a href="${confirmationUrl}" style="color:#2f8f5b;">${confirmationUrl}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

async function sendWithResend(to: string, subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${appName} <${resendFromEmail}>`,
      to: [to],
      subject,
      html,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Resend error: ${response.status} ${errorText}`)
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("not allowed", { status: 400 })
  }

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)
  const webhook = new Webhook(hookSecret)

  try {
    const parsed = webhook.verify(payload, headers) as HookPayload
    const copy = getActionCopy(parsed.email_data.email_action_type)
    const tokenHash = parsed.email_data.token_hash
    if (!tokenHash) {
      throw new Error("missing token_hash")
    }
    const confirmationUrl = buildConfirmationUrl(
      tokenHash,
      parsed.email_data.email_action_type,
      parsed.email_data.redirect_to
    )
    const html = buildEmailHtml(parsed, confirmationUrl)

    await sendWithResend(parsed.user.email, copy.subject, html)

    if (
      parsed.email_data.email_action_type === "email_change" &&
      parsed.user.new_email &&
      parsed.email_data.token_hash_new
    ) {
      const newEmailUrl = buildConfirmationUrl(
        parsed.email_data.token_hash_new,
        parsed.email_data.email_action_type,
        parsed.email_data.redirect_to
      )

      await sendWithResend(
        parsed.user.new_email,
        "Confirme novo email no PromptLabz",
        buildEmailHtml(parsed, newEmailUrl, "new-email")
      )
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("send-auth-email error:", error)
    return new Response(JSON.stringify({ error: "email_send_failed" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
})
