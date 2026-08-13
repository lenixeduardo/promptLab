import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { scopedKey, USER_SCOPE_EVENT } from "@/lib/userScope"

import avatarDefault from "@/assets/avatar-graduation.png"
import avatarGraduation from "@/assets/avatar-graduation.png"
import avatarScientist from "@/assets/avatar-scientist.png"
import avatarCrystal from "@/assets/avatar-crystal.png"
import avatarVR from "@/assets/avatar-vr.png"
import avatarCrown from "@/assets/avatar-crown.png"
import avatarLegendaryCape from "@/assets/avatar-legendary-cape.png"
import avatarNeon from "@/assets/avatar-neon.png"
import avatarPunk from "@/assets/avatar-punk.png"
import avatarRocker from "@/assets/avatar-rocker.png"
import avatarDJ from "@/assets/avatar-dj.png"

export type AvatarTier = "Grátis" | "Raro" | "Épico" | "Lendário"

export interface AvatarOption {
  id: string
  name: string
  desc: string
  image: string
  tier: AvatarTier
  cost: number
  owned: boolean
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: "default",
    name: "Aprendiz",
    desc: "O início de toda jornada",
    image: avatarDefault,
    tier: "Grátis",
    cost: 0,
    owned: true,
  },
  {
    id: "vr",
    name: "Visão do Futuro",
    desc: "Óculos tecnológico VR",
    image: avatarVR,
    tier: "Raro",
    cost: 120,
    owned: true,
  },
  {
    id: "graduation",
    name: "Mestre Formado",
    desc: "Chapéu de formatura dourado",
    image: avatarGraduation,
    tier: "Raro",
    cost: 120,
    owned: false,
  },
  {
    id: "scientist",
    name: "Cientista Prompt",
    desc: "Capa de cientista do laboratório",
    image: avatarScientist,
    tier: "Épico",
    cost: 220,
    owned: false,
  },
  {
    id: "crystal",
    name: "Guardião do Saber",
    desc: "Cristal do Saber em mãos",
    image: avatarCrystal,
    tier: "Lendário",
    cost: 8500,
    owned: false,
  },
  {
    id: "crown",
    name: "Campeão Coroado",
    desc: "Coroa de Campeão da Arena",
    image: avatarCrown,
    tier: "Lendário",
    cost: 9500,
    owned: false,
  },
  {
    id: "wizard",
    name: "Arquimago da IA",
    desc: "Capa lendária estelar",
    image: avatarLegendaryCape,
    tier: "Lendário",
    cost: 10000,
    owned: false,
  },
  {
    id: "neon",
    name: "Cyber Neon",
    desc: "Traje cyberpunk com LEDs neon",
    image: avatarNeon,
    tier: "Lendário",
    cost: 10000,
    owned: false,
  },
  {
    id: "punk",
    name: "Punk Rebelde",
    desc: "Moicano rosa e jaqueta cravejada",
    image: avatarPunk,
    tier: "Lendário",
    cost: 9800,
    owned: false,
  },
  {
    id: "rocker",
    name: "Rockstar",
    desc: "Guitarra elétrica e atitude",
    image: avatarRocker,
    tier: "Lendário",
    cost: 10500,
    owned: false,
  },
  {
    id: "dj",
    name: "DJ Synthwave",
    desc: "Headphones neon e turntable",
    image: avatarDJ,
    tier: "Lendário",
    cost: 9200,
    owned: false,
  },
]

const STORAGE_BASE = "promptlabz-avatar"
const DEFAULT_ID = "vr"

interface AvatarContextType {
  equippedId: string
  equipped: AvatarOption
  setEquipped: (id: string) => void
  options: AvatarOption[]
}

const AvatarContext = createContext<AvatarContextType | null>(null)

function getInitialId(): string {
  if (typeof window === "undefined") return DEFAULT_ID
  const stored = localStorage.getItem(scopedKey(STORAGE_BASE))
  if (stored && AVATAR_OPTIONS.some((a) => a.id === stored)) return stored
  return DEFAULT_ID
}

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [equippedId, setEquippedId] = useState<string>(DEFAULT_ID)

  useEffect(() => {
    setEquippedId(getInitialId())
    const onUserScope = () => setEquippedId(getInitialId())
    window.addEventListener(USER_SCOPE_EVENT, onUserScope)
    return () => window.removeEventListener(USER_SCOPE_EVENT, onUserScope)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(scopedKey(STORAGE_BASE), equippedId)
    }
  }, [equippedId])

  const value = useMemo<AvatarContextType>(() => {
    const equipped = AVATAR_OPTIONS.find((a) => a.id === equippedId) ?? AVATAR_OPTIONS[0]
    return { equippedId, equipped, setEquipped: setEquippedId, options: AVATAR_OPTIONS }
  }, [equippedId])

  return <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>
}

export function useAvatar() {
  const ctx = useContext(AvatarContext)
  if (!ctx) throw new Error("useAvatar must be used within AvatarProvider")
  return ctx
}
