import { chromium } from "@playwright/test"
import { mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, "../screenshots")
mkdirSync(outDir, { recursive: true })

const BASE = "http://localhost:4173"

const PAGES = [
  { name: "01-landing", path: "/" },
  { name: "02-login", path: "/login" },
  { name: "03-onboarding", path: "/onboarding" },
  { name: "04-module-exam", path: "/module-exam" },
  { name: "05-prompt-wars", path: "/prompt-wars" },
  { name: "06-prompt-lab", path: "/prompt-lab" },
  { name: "07-lesson", path: "/lesson?track=a1&module=0" },
  { name: "08-learn", path: "/learn" },
  { name: "09-missions", path: "/missions" },
  { name: "10-community", path: "/community" },
  { name: "11-roadmap", path: "/roadmap" },
  { name: "12-settings", path: "/settings" },
  { name: "13-ranking", path: "/ranking" },
]

;(async () => {
  const browser = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  })

  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  })

  const page = await ctx.newPage()

  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("PAGE ERR:", msg.text())
  })
  page.on("pageerror", (err) => console.log("PAGE EXCEPTION:", err.message))

  for (const { name, path } of PAGES) {
    console.log(`Navigating to ${path}...`)
    try {
      await page.goto(BASE + path, { waitUntil: "load", timeout: 15000 })
      // Wait for React to mount and render
      await page.waitForFunction(
        () => {
          const root = document.getElementById("root")
          return root && root.children.length > 0
        },
        { timeout: 10000 }
      )
      // Extra settle time for animations/fonts
      await page.waitForTimeout(1000)
      const file = join(outDir, `${name}.png`)
      await page.screenshot({ path: file, fullPage: true })
      console.log(`  ✓ ${name}.png`)
    } catch (e) {
      console.log(`  ✗ ${name}: ${e.message}`)
    }
  }

  await browser.close()
  console.log("\nDone! Screenshots in ./screenshots/")
})()
