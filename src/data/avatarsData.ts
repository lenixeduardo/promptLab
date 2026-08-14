import avatarVR from "@/assets/avatar-vr.png"
import avatarGraduation from "@/assets/avatar-graduation.png"
import avatarDJ from "@/assets/avatar-dj.png"
import avatarCrystal from "@/assets/avatar-crystal.png"
import avatarCrown from "@/assets/avatar-crown.png"
import avatarLegendaryCape from "@/assets/avatar-legendary-cape.png"
import avatarNeon from "@/assets/avatar-neon.png"

export interface Avatar {
  id: string
  name: string
  image: string
  price: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

// Every entry below is backed by its own hand-drawn art (src/assets/avatar-*.png).
// Don't add placeholder entries that reuse mascot/other-avatar images — a store
// full of visually identical "avatars" is worse than a shorter, real catalog.
export const AVATARS: Avatar[] = [
  // Common (Free)
  {
    id: "cat-green",
    name: "Gato Verde",
    image: "/assets/avatar-cat.png",
    price: 0,
    rarity: "common",
  },

  // Rare
  {
    id: "cat-vr",
    name: "Gato Visionário",
    image: avatarVR,
    price: 150,
    rarity: "rare",
  },
  {
    id: "cat-graduation",
    name: "Gato Formado",
    image: avatarGraduation,
    price: 180,
    rarity: "rare",
  },

  // Epic
  {
    id: "cat-dj",
    name: "Gato DJ",
    image: avatarDJ,
    price: 350,
    rarity: "epic",
  },

  // Legendary
  {
    id: "cat-crystal",
    name: "Gato Cristal",
    image: avatarCrystal,
    price: 600,
    rarity: "legendary",
  },
  {
    id: "cat-crown",
    name: "Gato Coroado",
    image: avatarCrown,
    price: 700,
    rarity: "legendary",
  },
  {
    id: "cat-wizard",
    name: "Gato Arquimago",
    image: avatarLegendaryCape,
    price: 800,
    rarity: "legendary",
  },
  {
    id: "cat-neon",
    name: "Gato Neon",
    image: avatarNeon,
    price: 900,
    rarity: "legendary",
  },
  {
    id: "cat-punk",
    name: "Gatinha Punk",
    image: "/assets/avatar-punk.png",
    price: 1100,
    rarity: "legendary",
  },
  {
    id: "cat-rocker",
    name: "Gatinha Rockeira",
    image: "/assets/avatar-rocker.png",
    price: 1200,
    rarity: "legendary",
  },
  {
    id: "cat-scientist",
    name: "Gato Cientista",
    image: "/assets/avatar-scientist.png",
    price: 1500,
    rarity: "legendary",
  },
]

export function getAvatarById(id: string): Avatar | undefined {
  return AVATARS.find((a) => a.id === id)
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case "common":
      return "text-gray-600"
    case "rare":
      return "text-blue-600"
    case "epic":
      return "text-purple-600"
    case "legendary":
      return "text-yellow-600"
    default:
      return "text-gray-600"
  }
}

export function getRarityBg(rarity: string): string {
  switch (rarity) {
    case "common":
      return "bg-gray-100"
    case "rare":
      return "bg-blue-100"
    case "epic":
      return "bg-purple-100"
    case "legendary":
      return "bg-yellow-100"
    default:
      return "bg-gray-100"
  }
}
