export interface Avatar {
  id: string
  name: string
  image: string
  price: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

export const AVATARS: Avatar[] = [
  // Common (Free or cheap)
  {
    id: "cat-green",
    name: "Gato Verde",
    image: "/assets/avatar-cat.png",
    price: 0,
    rarity: "common",
  },
  {
    id: "cat-happy",
    name: "Gato Feliz",
    image: "/assets/mascot-teacher.png",
    price: 50,
    rarity: "common",
  },
  {
    id: "cat-cool",
    name: "Gato Legal",
    image: "/assets/mascot-home.png",
    price: 75,
    rarity: "common",
  },
  {
    id: "cat-smile",
    name: "Gato Sorridente",
    image: "/assets/mascot-login-new.png",
    price: 100,
    rarity: "common",
  },

  // Rare
  {
    id: "cat-golden",
    name: "Gato Dourado",
    image: "/assets/avatar-cat.png",
    price: 150,
    rarity: "rare",
  },
  {
    id: "cat-purple",
    name: "Gato Roxo",
    image: "/assets/mascot-teacher.png",
    price: 180,
    rarity: "rare",
  },
  {
    id: "cat-pink",
    name: "Gato Rosa",
    image: "/assets/mascot-home.png",
    price: 200,
    rarity: "rare",
  },
  {
    id: "cat-blue",
    name: "Gato Azul",
    image: "/assets/mascot-login-new.png",
    price: 220,
    rarity: "rare",
  },

  // Epic
  {
    id: "cat-dragon",
    name: "Dragão Gato",
    image: "/assets/avatar-cat.png",
    price: 270,
    rarity: "epic",
  },
  {
    id: "cat-ninja",
    name: "Gato Ninja",
    image: "/assets/mascot-teacher.png",
    price: 300,
    rarity: "epic",
  },
  {
    id: "cat-astronaut",
    name: "Gato Astronauta",
    image: "/assets/mascot-home.png",
    price: 320,
    rarity: "epic",
  },
  {
    id: "cat-wizard",
    name: "Gato Feiticeiro",
    image: "/assets/mascot-login-new.png",
    price: 350,
    rarity: "epic",
  },

  // Legendary
  {
    id: "cat-phoenix",
    name: "Fênix Gato",
    image: "/assets/avatar-cat.png",
    price: 500,
    rarity: "legendary",
  },
  {
    id: "cat-cyber",
    name: "Gato Cibernético",
    image: "/assets/mascot-teacher.png",
    price: 550,
    rarity: "legendary",
  },
  {
    id: "cat-cosmic",
    name: "Gato Cósmico",
    image: "/assets/mascot-home.png",
    price: 600,
    rarity: "legendary",
  },
  {
    id: "cat-void",
    name: "Gato do Vazio",
    image: "/assets/mascot-login-new.png",
    price: 999,
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
      return "bg-gray-100 dark:bg-gray-800/60"
    case "rare":
      return "bg-blue-100 dark:bg-blue-950/40"
    case "epic":
      return "bg-purple-100 dark:bg-purple-950/40"
    case "legendary":
      return "bg-yellow-100 dark:bg-yellow-950/40"
    default:
      return "bg-gray-100 dark:bg-gray-800/60"
  }
}
