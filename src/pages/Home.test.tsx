import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("Home daily tip placement", () => {
  it("renderiza DailyTipCard antes do card de Analisador de Prompts", () => {
    const source = readFileSync(resolve("src/pages/Home.tsx"), "utf8")
    const dailyTipPosition = source.indexOf("<DailyTipCard")
    const analyzerPosition = source.indexOf("Analisador de Prompts")

    expect(dailyTipPosition).toBeGreaterThan(-1)
    expect(analyzerPosition).toBeGreaterThan(-1)
    expect(dailyTipPosition).toBeLessThan(analyzerPosition)
  })
})
