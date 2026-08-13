import { DAILY_TIPS, type DailyTip } from "@/data/dailyTipsData"

const MS_PER_DAY = 86_400_000

export function getLocalDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY)
}

export function getDailyTip(date = new Date(), tips: readonly DailyTip[] = DAILY_TIPS): DailyTip {
  if (tips.length === 0) {
    throw new Error("Daily tips catalog cannot be empty")
  }

  return tips[getLocalDayNumber(date) % tips.length]
}
