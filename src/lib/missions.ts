import { scopedKey, getUserId } from "@/lib/userScope"
import {
  getLocalGems,
  saveLocalGems,
  GEMS_UPDATE_EVENT,
  getLocalXP,
  saveLocalXP,
  XP_UPDATE_EVENT,
} from "@/lib/xp"
import { BookOpen, Flame, Heart, Target, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"

// ── Event ──────────────────────────────────────────────────────────────────
export const MISSION_UPDATE_EVENT = "promptlabz:mission:update"

// ── Mission definitions ────────────────────────────────────────────────────
export type MissionId = "visit" | "lesson" | "skill" | "quiz" | "share"

export interface Mission {
  id: MissionId
  title: string
  desc: string
  hint: string
  xp: number
  icon: LucideIcon
  link?: string
}

export const MISSIONS: Mission[] = [
  {
    id: "visit",
    title: "Faça login hoje",
    desc: "Sequência ativa!",
    hint: "Completado automaticamente ao entrar",
    xp: 10,
    icon: Flame,
  },
  {
    id: "lesson",
    title: "Conclua 1 lição",
    desc: "Pratique pelo menos 5 minutos",
    hint: "Complete uma lição nas trilhas de aprendizado",
    xp: 30,
    icon: BookOpen,
    link: "/learn",
  },
  {
    id: "skill",
    title: "Favorite 3 skills",
    desc: "Habilidades salvas!",
    hint: "Favorite pelo menos 3 habilidades na seção Skills",
    xp: 20,
    icon: Zap,
    link: "/lab",
  },
  {
    id: "quiz",
    title: "Complete uma prova rápida",
    desc: "Desafio concluído!",
    hint: "Conclua uma Prova Rápida até o final",
    xp: 25,
    icon: Target,
    link: "/quiz",
  },
  {
    id: "share",
    title: "Salve um prompt",
    desc: "Prompt salvo!",
    hint: "Favorite um prompt na seção de Prompts",
    xp: 15,
    icon: Heart,
    link: "/prompts",
  },
]

export const CHEST_THRESHOLD = 5
export const CHEST_REWARD_GEMS = 50
export const CHEST_REWARD_XP = 100

// ── Special quests ─────────────────────────────────────────────────────────
export const SPECIAL_QUEST_COOLDOWN_DAYS = 3

export interface SpecialQuest {
  id: string
  title: string
  desc: string
  action: string
  gems: number
  link: string
  linkLabel: string
}

export const SPECIAL_QUESTS: SpecialQuest[] = [
  {
    id: "buy-avatar",
    title: "Personalize seu perfil",
    desc: "Selecione um novo avatar na galeria de avatares",
    action: "buy-avatar",
    gems: 50,
    link: "/avatars",
    linkLabel: "Ir para avatares",
  },
  {
    id: "get-cert",
    title: "Veja seu certificado",
    desc: "Acesse sua área de certificados conquistados",
    action: "certificate",
    gems: 50,
    link: "/certificates",
    linkLabel: "Ver certificado",
  },
  // Missão "Conheça o Premium" removida temporariamente durante a open beta
]

// ── Storage keys ───────────────────────────────────────────────────────────
export const MISSIONS_STORAGE_BASE = "promptlabz:dailyMissions"
export const SPECIAL_QUEST_STORAGE_BASE = "promptlabz:specialQuestV2"

export function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

// ── Mission storage ────────────────────────────────────────────────────────
export interface MissionsStorageData {
  day: string
  completed: Record<string, boolean>
  chestOpened: boolean
}

function defaultCompleted(): Record<string, boolean> {
  return Object.fromEntries(MISSIONS.map((m) => [m.id, false]))
}

export function readMissionsStorage(): MissionsStorageData {
  if (typeof window === "undefined") {
    return { day: todayKey(), completed: defaultCompleted(), chestOpened: false }
  }
  try {
    const raw = localStorage.getItem(scopedKey(MISSIONS_STORAGE_BASE))
    if (!raw) return { day: todayKey(), completed: defaultCompleted(), chestOpened: false }
    const parsed = JSON.parse(raw) as MissionsStorageData
    if (parsed.day !== todayKey()) {
      return { day: todayKey(), completed: defaultCompleted(), chestOpened: false }
    }
    return { ...parsed, completed: { ...defaultCompleted(), ...parsed.completed } }
  } catch {
    return { day: todayKey(), completed: defaultCompleted(), chestOpened: false }
  }
}

function writeMissionsStorage(data: MissionsStorageData): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(scopedKey(MISSIONS_STORAGE_BASE), JSON.stringify(data))
  } catch {
    // quota errors — ignore
  }
}

// ── Special quest storage ──────────────────────────────────────────────────
export interface SpecialQuestStorageData {
  lastCompletedDate: string | null
  lastCompletedQuestId: string | null
}

export function readSpecialQuestStorage(): SpecialQuestStorageData {
  if (typeof window === "undefined") return { lastCompletedDate: null, lastCompletedQuestId: null }
  try {
    const raw = localStorage.getItem(scopedKey(SPECIAL_QUEST_STORAGE_BASE))
    if (!raw) return { lastCompletedDate: null, lastCompletedQuestId: null }
    return JSON.parse(raw) as SpecialQuestStorageData
  } catch {
    return { lastCompletedDate: null, lastCompletedQuestId: null }
  }
}

// ── Daily special quest ────────────────────────────────────────────────────
export function getDailySpecialQuest(): SpecialQuest {
  const key = todayKey()
  const hash = [...key].reduce((h, c) => (h * 31 + c.charCodeAt(0)) & 0x7fffffff, 0)
  return SPECIAL_QUESTS[hash % SPECIAL_QUESTS.length]
}

export function isSpecialQuestAvailable(): boolean {
  const { lastCompletedDate } = readSpecialQuestStorage()
  if (!lastCompletedDate) return true
  if (lastCompletedDate === todayKey()) return false
  const last = new Date(lastCompletedDate)
  const today = new Date()
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays >= SPECIAL_QUEST_COOLDOWN_DAYS
}

export function isSpecialQuestCompletedToday(): boolean {
  return readSpecialQuestStorage().lastCompletedDate === todayKey()
}

// ── Actions ────────────────────────────────────────────────────────────────

export function completeMission(id: string): void {
  if (typeof window === "undefined") return
  const stored = readMissionsStorage()
  if (stored.completed[id]) return
  stored.completed[id] = true
  writeMissionsStorage(stored)
  const mission = MISSIONS.find((m) => m.id === id)
  if (mission) {
    const uid = getUserId()
    if (uid) {
      saveLocalXP(uid, getLocalXP(uid) + mission.xp)
      window.dispatchEvent(new CustomEvent(XP_UPDATE_EVENT))
    }
  }
  window.dispatchEvent(new CustomEvent(MISSION_UPDATE_EVENT))
}

export function openDailyChest(): void {
  if (typeof window === "undefined") return
  const stored = readMissionsStorage()
  if (stored.chestOpened) return
  const doneCount = MISSIONS.filter((m) => stored.completed[m.id]).length
  if (doneCount < CHEST_THRESHOLD) return
  stored.chestOpened = true
  writeMissionsStorage(stored)
  const uid = getUserId()
  if (uid) {
    saveLocalGems(uid, getLocalGems(uid) + CHEST_REWARD_GEMS)
    window.dispatchEvent(new CustomEvent(GEMS_UPDATE_EVENT))
    saveLocalXP(uid, getLocalXP(uid) + CHEST_REWARD_XP)
    window.dispatchEvent(new CustomEvent(XP_UPDATE_EVENT))
  }
  window.dispatchEvent(new CustomEvent(MISSION_UPDATE_EVENT))
}

export function tryCompleteSpecialQuest(actionId: string): void {
  if (typeof window === "undefined") return
  const quest = getDailySpecialQuest()
  if (quest.action !== actionId) return
  if (!isSpecialQuestAvailable()) return
  try {
    localStorage.setItem(
      scopedKey(SPECIAL_QUEST_STORAGE_BASE),
      JSON.stringify({ lastCompletedDate: todayKey(), lastCompletedQuestId: quest.id })
    )
    const uid = getUserId()
    if (uid) {
      saveLocalGems(uid, getLocalGems(uid) + quest.gems)
      window.dispatchEvent(new CustomEvent(GEMS_UPDATE_EVENT))
    }
    window.dispatchEvent(new CustomEvent(MISSION_UPDATE_EVENT))
  } catch {
    // ignore
  }
}
