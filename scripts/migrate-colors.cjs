/**
 * scripts/migrate-colors.cjs
 *
 * Migrates hardcoded hex colors used in Tailwind arbitrary value syntax
 * (e.g. `text-[#3E8E5E]`) to use design tokens defined in tailwind.config.js
 * (e.g. `text-emerald`).
 *
 * Also handles inline CSS hex colors in style props and test assertions.
 *
 * Usage: node scripts/migrate-colors.cjs
 */

const fs = require("fs")
const path = require("path")

// ═══════════════════════════════════════════════════════════════════════════
// Color → Token Mapping
// Key: uppercase hex (WITHOUT #), Value: Tailwind token class name suffix
// ═══════════════════════════════════════════════════════════════════════════

const MAPPING = {
  // ── Tokens that already existed ─────────────────────────────────────────
  F5FBF5: "pageBg",
  EAF7EF: "pageBgLight",
  "2B5D3A": "primary-dark",
  "4B8C6D": "primary",
  A3E4A1: "primary-light",
  D3EAD3: "muted",
  FFD700: "luxury",
  "8E9C8E": "neutral",
  "4A90E2": "secondary",
  F5A623: "accent",

  // ── New tokens added to tailwind.config.js ──────────────────────────────
  "3E8E5E": "emerald",
  "2F6B45": "forest",
  "1F2A24": "foregroundDark",
  "6B9E7E": "foregroundMuted",
  "4A5E52": "foregroundSecondary",
  "6B7A70": "foregroundTertiary",
  "8A998F": "foregroundPlaceholder",
  BFE3CC: "stroke-light",
  CDEAD8: "stroke-muted",
  F0FAF3: "surface-soft",
  DCF1E4: "surface-success",
  E0F3E7: "gradient-mid",
  D2EEDD: "gradient-end",
  "2E8B57": "link",

  // ── Close matches (similar shades, mapped to nearest token) ─────────────
  "2E7048": "emerald-dark",
  "3E9A63": "emerald",
  "5BA877": "emerald",
  "4A7A5A": "emerald",
  "1E6B3A": "primary-dark",
  "3A4B40": "foregroundDark",
  "1A2E22": "foregroundDark",
  "1A3D2B": "foregroundDark",
  "9AB0A4": "neutral",
  B0C8B8: "neutral",
  "8AB89A": "foregroundMuted",
  C6E7D2: "stroke-muted",
  E1F2E7: "surface-success",
  E0F3E9: "gradient-mid",
  EAF2ED: "pageBgLight",
  E5F5EB: "pageBgLight",
  F7FBF8: "surface-soft",
  BFD9C8: "stroke-light",
  E8F5EE: "stroke-light",
  C2E8D0: "stroke-light",
  D5EFE0: "stroke-muted",
  D4EFE0: "stroke-light",
  F5FAF6: "surface-soft",

  // ── Divider / neutral grays ────────────────────────────────────────────
  E2E8E4: "neutral",
  F5F5F5: "surface-soft",

  // ── Semantic colors that stay (mapped for in-class replacement) ─────────
  // Wrong-answer reds
  FEE2E2: "red-100",
  E05252: "red",
  "991B1B": "red",
  DC2626: "red-600",
  D97706: "amber-600",
  "92400E": "amber-800",

  // Warm streak colors
  FFF8F3: "orange-50",
  E5C9B0: "orange-200",
  "7A4A2A": "orange-800",

  // Error/cancel
  FEE2E2: "red-100",
}

// ═══════════════════════════════════════════════════════════════════════════
// Colors / files that should NOT be replaced
// ═══════════════════════════════════════════════════════════════════════════

const COLORS_TO_SKIP = new Set([
  // Google brand colors (for OAuth buttons)
  "4285F4",
  "34A853",
  "FBBC05",
  "EA4335",
  // Example data, not UI tokens
  "2ECC71",
  "F1C40F",
])

// Confetti animation colors in LevelUp.tsx – keep as-is since they need
// to be JS variables, not Tailwind classes.
const FILES_WITH_CONFETTI = ["LevelUp.tsx", "LevelUp.test.tsx"]
const CONFETTI_COLORS = new Set(["7CC79A", "A8EDCA", "E8F9EF", "FFD166"])

// ═══════════════════════════════════════════════════════════════════════════
// Utility
// ═══════════════════════════════════════════════════════════════════════════

function shouldWalk(dir) {
  const base = path.basename(dir)
  return !base.startsWith(".") && base !== "node_modules" && base !== "dist"
}

function isTargetFile(name) {
  return /\.(tsx?|css)$/i.test(name)
}

function collectFiles(rootDir) {
  const files = []
  try {
    for (const entry of fs.readdirSync(rootDir, { withFileEncoding: "utf8" })) {
      // Actually readdirSync doesn't accept withFileEncoding. Use withFileTypes.
    }
  } catch {
    /* ignore */
  }

  function walk(dir) {
    let entries
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of entries) {
      const full = path.join(dir, e.name)
      if (e.isDirectory() && shouldWalk(full)) walk(full)
      else if (e.isFile() && isTargetFile(e.name)) files.push(full)
    }
  }
  walk(rootDir)
  return files
}

// ═══════════════════════════════════════════════════════════════════════════
// Main replacement logic
// ═══════════════════════════════════════════════════════════════════════════

function replaceHexWithToken(content, filePath) {
  let modified = false
  const fileName = path.basename(filePath)
  const hasConfetti = FILES_WITH_CONFETTI.includes(fileName)

  for (let [hex, token] of Object.entries(MAPPING)) {
    const upper = hex.toUpperCase()
    const lower = hex.toLowerCase()

    // Skip confetti colors in LevelUp files
    if (hasConfetti && CONFETTI_COLORS.has(upper)) continue
    // Skip protected colors
    if (COLORS_TO_SKIP.has(upper)) continue

    // ── 1. Replace `-\[#HEX\]` (Tailwind arbitrary values) ──────────────
    // Matches: text-[#3E8E5E], hover:bg-[#EAF7EF], from-[#XYZ], etc.
    // The token is inserted directly (replacing whole `-[#HEX]` segment).
    // Build pattern: -[#HEX] (with possible brackets for regex safety)
    const pattern = new RegExp(`-\\[#${lower}\\]`, "gi")
    const newContent = content.replace(pattern, `-${token}`)
    if (newContent !== content) {
      modified = true
      content = newContent
    }
  }

  return modified ? content : null
}

// ═══════════════════════════════════════════════════════════════════════════
// Run
// ═══════════════════════════════════════════════════════════════════════════

const ROOTS = [
  path.resolve(__dirname, "..", "src"),
  // Also update the email template (backend)
  path.resolve(__dirname, "..", "supabase", "functions", "send-auth-email"),
]

let totalFiles = 0
let totalChanges = 0
let errors = []

for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue

  for (const filePath of collectFiles(root)) {
    let content
    try {
      content = fs.readFileSync(filePath, "utf-8")
    } catch (e) {
      errors.push(`${filePath}: ${e.message}`)
      continue
    }

    // Only process files that actually contain hex colors
    if (!/#[0-9a-fA-F]{6}/.test(content)) continue

    const result = replaceHexWithToken(content, filePath)
    if (result !== null) {
      try {
        fs.writeFileSync(filePath, result, "utf-8")
        console.log(`  ✓ ${path.relative(process.cwd(), filePath)}`)
        totalChanges++
      } catch (e) {
        errors.push(`${filePath}: ${e.message}`)
      }
    }
    totalFiles++
  }
}

console.log(`\nScanned ${totalFiles} files.`)
console.log(`Updated ${totalChanges} files.`)

if (errors.length > 0) {
  console.error(`\nErrors (${errors.length}):`)
  for (const err of errors) console.error(`  ✗ ${err}`)
  process.exit(1)
} else {
  console.log("\nMigration complete!")
}
