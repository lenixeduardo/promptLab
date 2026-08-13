import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import QRCode from "qrcode"
import frameUrl from "@/assets/certificate-frame.png"
import mascotUrl from "@/assets/certificate-mascot-laurels.png"

interface CertificateData {
  recipient: string
  title: string
  issuedAt: string
  hours: string
  id: string
}

interface CertificateDownload {
  filename: string
  url: string
}

function filenameFor(data: CertificateData) {
  const slug = data.title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return `certificado-${slug || data.id}.pdf`
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,500;1,600&family=Great+Vibes&display=swap"

let fontsPromise: Promise<void> | null = null
function ensureFontsLoaded(): Promise<void> {
  if (fontsPromise) return fontsPromise
  fontsPromise = new Promise((resolve) => {
    if (typeof document === "undefined") return resolve()
    const existing = document.querySelector(`link[data-cert-fonts]`)
    if (!existing) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = FONTS_HREF
      link.setAttribute("data-cert-fonts", "1")
      document.head.appendChild(link)
    }
    const ready = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready
    if (ready) {
      ready.then(() => resolve()).catch(() => resolve())
    } else {
      setTimeout(resolve, 600)
    }
  })
  return fontsPromise
}

// Paleta de verdes do certificado
const GREEN_PRIMARY = "#307818" // verde principal
const GREEN_SUPPORT = "#4B8636" // verde médio de apoio
const GREEN_LIGHT = "#6FAE55" // verde claro (próximo da gatinha)
const GREEN_DARK = "#1F5E17" // verde escuro para contraste

function dividerHtml(withLines: boolean) {
  const line = `<span style="width:40px;height:1px;background:${GREEN_LIGHT};opacity:0.5;"></span>`
  return `
    <div style="margin-top:18px;display:flex;align-items:center;justify-content:center;gap:8px;">
      ${withLines ? line : ""}
      <span style="width:7px;height:7px;transform:rotate(45deg);background:${GREEN_SUPPORT};opacity:0.7;"></span>
      ${withLines ? line : ""}
    </div>`
}

const MUTED = "#666666"
const SCRIPT_FONT = "'Great Vibes', cursive"

export function buildCertificateHtml(
  data: CertificateData,
  frame: string,
  mascot: string,
  qr: string
) {
  return `
<div style="
  width: 800px; height: 1131px; position: relative; background: #FFFDF8;
  font-family: 'Poppins', -apple-system, sans-serif; color: #1f2a23;
  overflow: hidden; box-sizing: border-box;
">
  <img src="${frame}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:fill;pointer-events:none;z-index:1;"/>
  <div style="position:absolute;top:135px;left:130px;right:130px;bottom:290px;display:flex;flex-direction:column;align-items:center;text-align:center;z-index:2;">
    <div style="font-weight:800;font-size:64px;line-height:1.05;letter-spacing:5px;text-transform:uppercase;color:${GREEN_DARK};">Certificado</div>
    <div style="margin-top:16px;display:flex;align-items:center;gap:12px;">
      <span style="width:36px;height:1px;background:${GREEN_LIGHT};opacity:0.6;"></span>
      <span style="font-family:${SCRIPT_FONT};font-size:44px;color:${GREEN_PRIMARY};">de Conquista</span>
      <span style="width:36px;height:1px;background:${GREEN_LIGHT};opacity:0.6;"></span>
    </div>
    <div style="margin-top:34px;font-weight:400;font-size:17px;color:${MUTED};">Parabéns,</div>
    <div style="margin-top:6px;font-family:${SCRIPT_FONT};font-size:66px;line-height:1.1;max-width:620px;color:${GREEN_DARK};">${escapeHtml(data.recipient)}</div>
    ${dividerHtml(false)}
    <div style="margin-top:22px;font-weight:400;font-size:17px;color:${MUTED};">por concluir com excelência o módulo</div>
    <div style="margin-top:8px;font-weight:700;font-size:24px;color:${GREEN_PRIMARY};max-width:540px;line-height:1.3;">${escapeHtml(data.title)}</div>
    <div style="margin-top:26px;display:flex;align-items:center;gap:36px;">
      <div style="text-align:center;">
        <div style="font-size:14px;color:${MUTED};font-weight:400;">Data de conclusão</div>
        <div style="margin-top:4px;font-family:${SCRIPT_FONT};font-size:28px;color:${GREEN_PRIMARY};">${escapeHtml(data.issuedAt)}</div>
      </div>
      <div style="width:1px;height:36px;background:${GREEN_SUPPORT};opacity:0.6;"></div>
      <div style="text-align:center;">
        <div style="font-size:14px;color:${MUTED};font-weight:400;">Carga horária</div>
        <div style="margin-top:4px;font-family:${SCRIPT_FONT};font-size:28px;color:${GREEN_PRIMARY};">${escapeHtml(data.hours)}</div>
      </div>
    </div>
    <img src="${mascot}" alt="" style="margin-top:24px;width:300px;height:auto;object-fit:contain;"/>
    ${dividerHtml(false)}
    <div style="margin-top:22px;width:calc(100% - 100px);display:flex;align-items:center;justify-content:space-between;gap:12px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <img src="${qr}" alt="" style="width:56px;height:56px;"/>
        <div style="text-align:left;">
          <div style="font-size:13px;color:${GREEN_PRIMARY};font-weight:600;">Verifique</div>
          <div style="font-size:12px;color:${MUTED};margin-top:1px;">ID: ${escapeHtml(data.id)}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:${SCRIPT_FONT};font-size:32px;line-height:1;color:${GREEN_DARK};">PromptLabz</div>
        <div style="margin-top:3px;font-weight:600;font-size:13px;color:${GREEN_PRIMARY};">PromptLabz</div>
        <div style="margin-top:2px;font-weight:400;font-size:10px;color:${MUTED};">Seu aprendizado, sua conquista.</div>
      </div>
    </div>
  </div>
</div>`.trim()
}

export async function createCertificatePdfBlob(data: CertificateData): Promise<Blob> {
  const [, frameImg, mascotImg, qrDataUrl] = await Promise.all([
    ensureFontsLoaded(),
    loadImage(frameUrl),
    loadImage(mascotUrl),
    QRCode.toDataURL(`https://promptlabz.app/verify/${encodeURIComponent(data.id)}`, {
      margin: 0,
      color: { dark: GREEN_DARK, light: "#FFFDF8" },
    }),
  ])

  const host = document.createElement("div")
  host.style.position = "fixed"
  host.style.left = "-10000px"
  host.style.top = "0"
  host.style.zIndex = "-1"
  host.style.pointerEvents = "none"
  host.innerHTML = buildCertificateHtml(data, frameImg.src, mascotImg.src, qrDataUrl)
  document.body.appendChild(host)

  try {
    const node = host.firstElementChild as HTMLElement
    const canvas = await html2canvas(node, {
      scale: 2,
      backgroundColor: "#FFFDF8",
      useCORS: true,
      logging: false,
    })

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const imgRatio = canvas.width / canvas.height
    const pageRatio = pageW / pageH
    let drawW = pageW
    let drawH = pageH
    if (imgRatio > pageRatio) {
      drawH = pageW / imgRatio
    } else {
      drawW = pageH * imgRatio
    }
    const offsetX = (pageW - drawW) / 2
    const offsetY = (pageH - drawH) / 2
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", offsetX, offsetY, drawW, drawH)
    return pdf.output("blob")
  } finally {
    host.remove()
  }
}

export async function downloadCertificatePdf(data: CertificateData): Promise<CertificateDownload> {
  const filename = filenameFor(data)
  const blob = await createCertificatePdfBlob(data)
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.rel = "noopener"
  document.body.appendChild(link)
  link.click()
  link.remove()
  return { filename, url }
}
