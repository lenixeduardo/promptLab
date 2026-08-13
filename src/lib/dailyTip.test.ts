import { describe, expect, it } from "vitest"
import { getDailyTip, getLocalDayNumber } from "@/lib/dailyTip"

describe("getDailyTip", () => {
  const tips = [
    { id: "one", text: "Primeira" },
    { id: "two", text: "Segunda" },
    { id: "three", text: "Terceira" },
  ]

  it("mantém a mesma dica durante a mesma data local", () => {
    expect(getDailyTip(new Date(2026, 5, 22, 0, 1), tips)).toEqual(
      getDailyTip(new Date(2026, 5, 22, 23, 59), tips)
    )
  })

  it("avança para outra dica no dia seguinte", () => {
    expect(getDailyTip(new Date(2026, 5, 23), tips).id).not.toBe(
      getDailyTip(new Date(2026, 5, 22), tips).id
    )
  })

  it("reinicia após completar o catálogo", () => {
    expect(getDailyTip(new Date(2026, 5, 25), tips)).toEqual(
      getDailyTip(new Date(2026, 5, 22), tips)
    )
  })

  it("rejeita catálogo vazio", () => {
    expect(() => getDailyTip(new Date(2026, 5, 22), [])).toThrow(
      "Daily tips catalog cannot be empty"
    )
  })
})

describe("getLocalDayNumber", () => {
  it("ignora horário e usa apenas data civil local", () => {
    expect(getLocalDayNumber(new Date(2026, 5, 22, 0, 1))).toBe(
      getLocalDayNumber(new Date(2026, 5, 22, 23, 59))
    )
  })
})
