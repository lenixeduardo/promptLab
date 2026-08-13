import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  saveProgress,
  loadProgress,
  syncLocalProgressToSupabase,
  getLeaderboard,
  getNewsArticles,
  getNotifications,
  updateUserXP,
  updateUserGems,
  saveModuleProgress,
  fetchModuleProgress,
  syncInventoryToServer,
  fetchInventoryFromServer,
} from "./db"
import { loadInventory, type StoredInventory } from "./inventory"

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
  isSupabaseConfigured: () => {
    return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY
  },
  getErrorMessage: (err: unknown, fallback: string) => {
    if (err instanceof Error) return err.message
    if (typeof err === "object" && err && "message" in err) {
      const message = (err as { message?: unknown }).message
      if (typeof message === "string") return message
    }
    return fallback
  },
}))

import { supabase } from "@/lib/supabase"

const mockFrom = supabase.from as ReturnType<typeof vi.fn>
const mockRpc = supabase.rpc as ReturnType<typeof vi.fn>

function buildQuery(overrides: Record<string, unknown> = {}) {
  const q = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    ...overrides,
  }
  mockFrom.mockReturnValue(q)
  return q
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  import.meta.env.VITE_SUPABASE_URL = "https://test.supabase.co"
  import.meta.env.VITE_SUPABASE_ANON_KEY = "test-anon-key"
})

// ── getUserProfile ─────────────────────────────────────────────────────────

describe("getUserProfile", () => {
  it("retorna perfil quando Supabase responde com sucesso", async () => {
    const mockProfile = { id: "u1", email: "a@a.com", full_name: "Ana", avatar_url: null }
    const q = buildQuery({ single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }) })

    const result = await getUserProfile("u1")

    expect(result.data).toEqual(mockProfile)
    expect(result.error).toBeNull()
    expect(q.eq).toHaveBeenCalledWith("id", "u1")
  })

  it("retorna erro quando Supabase retorna erro", async () => {
    buildQuery({
      single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
    })

    const result = await getUserProfile("u1")

    expect(result.data).toBeNull()
    expect(result.error).toBe("Not found")
  })

  it("retorna erro de configuração quando env não está definido", async () => {
    import.meta.env.VITE_SUPABASE_URL = ""

    const result = await getUserProfile("u1")

    expect(result.error).toBe("Supabase não configurado")
    expect(mockFrom).not.toHaveBeenCalled()
  })
})

// ── updateUserProfile ──────────────────────────────────────────────────────

describe("updateUserProfile", () => {
  it("atualiza nome e retorna perfil atualizado", async () => {
    const updated = { id: "u1", email: "a@a.com", full_name: "Ana Silva", avatar_url: null }
    buildQuery({ maybeSingle: vi.fn().mockResolvedValue({ data: updated, error: null }) })

    const result = await updateUserProfile("u1", "Ana Silva")

    expect(result.data?.full_name).toBe("Ana Silva")
    expect(result.error).toBeNull()
  })

  it("retorna erro quando update falha", async () => {
    buildQuery({
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: "Update failed" } }),
    })

    const result = await updateUserProfile("u1", "Ana Silva")

    expect(result.data).toBeNull()
    expect(result.error).toBe("Update failed")
  })
})

// ── updateUserAvatar ───────────────────────────────────────────────────────

describe("updateUserAvatar", () => {
  it("atualiza avatar_url e retorna perfil atualizado", async () => {
    const updated = { id: "u1", email: "a@a.com", full_name: "Ana", avatar_url: "cat.png" }
    buildQuery({ single: vi.fn().mockResolvedValue({ data: updated, error: null }) })

    const result = await updateUserAvatar("u1", "cat.png")

    expect(result.data?.avatar_url).toBe("cat.png")
    expect(result.error).toBeNull()
  })
})

// ── saveProgress ───────────────────────────────────────────────────────────

describe("saveProgress", () => {
  const userId = "u1"
  const categoryId = "prompts-basicos"
  const progress = {
    currentModuleIndex: 1,
    currentLessonIndex: 2,
    completedLessonIds: ["l1", "l2"],
  }

  it("salva no localStorage mesmo sem Supabase configurado", async () => {
    import.meta.env.VITE_SUPABASE_URL = ""

    await saveProgress(userId, categoryId, progress)

    const stored = JSON.parse(localStorage.getItem(`promptlabz_progress:${userId}`) || "{}")
    expect(stored[categoryId]).toEqual(progress)
  })

  it("faz upsert no Supabase quando configurado", async () => {
    const q = buildQuery({ upsert: vi.fn().mockResolvedValue({ error: null }) })

    await saveProgress(userId, categoryId, progress)

    expect(q.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: userId,
        category_id: categoryId,
        completed_lessons: progress.completedLessonIds,
      }),
      expect.anything()
    )
  })

  it("retorna erro quando upsert falha mas localStorage foi salvo", async () => {
    buildQuery({ upsert: vi.fn().mockResolvedValue({ error: { message: "DB error" } }) })

    const result = await saveProgress(userId, categoryId, progress)

    expect(result.error).toBe("DB error")
    // localStorage ainda deve ter os dados
    const stored = JSON.parse(localStorage.getItem(`promptlabz_progress:${userId}`) || "{}")
    expect(stored[categoryId]).toEqual(progress)
  })
})

// ── loadProgress ───────────────────────────────────────────────────────────

describe("loadProgress", () => {
  const userId = "u1"

  it("retorna dados do localStorage quando Supabase não está configurado", async () => {
    import.meta.env.VITE_SUPABASE_URL = ""
    const localData = {
      cat1: { currentModuleIndex: 0, currentLessonIndex: 1, completedLessonIds: [] },
    }
    localStorage.setItem(`promptlabz_progress:${userId}`, JSON.stringify(localData))

    const result = await loadProgress(userId)

    expect(result).toEqual(localData)
  })

  it("mescla dados do DB com localStorage quando Supabase está configurado", async () => {
    const dbRows = [
      {
        category_id: "cat1",
        completed_lessons: ["l1"],
        current_module_index: 0,
        current_lesson_index: 1,
      },
    ]
    buildQuery({ eq: vi.fn().mockResolvedValue({ data: dbRows, error: null }) })

    const result = await loadProgress(userId)

    expect(result["cat1"]).toEqual({
      currentModuleIndex: 0,
      currentLessonIndex: 1,
      completedLessonIds: ["l1"],
    })
  })

  it("migra chave legada promptlab_progress automaticamente", async () => {
    import.meta.env.VITE_SUPABASE_URL = ""
    const legacyData = {
      cat1: { currentModuleIndex: 1, currentLessonIndex: 0, completedLessonIds: ["l1"] },
    }
    localStorage.setItem("promptlab_progress", JSON.stringify(legacyData))

    const result = await loadProgress(userId)

    expect(result).toEqual(legacyData)
    // Deve ter migrado para a nova chave
    expect(localStorage.getItem(`promptlabz_progress:${userId}`)).toBeTruthy()
    // E removido a legada
    expect(localStorage.getItem("promptlab_progress")).toBeNull()
  })

  it("retorna objeto vazio quando não há dados locais nem no DB", async () => {
    import.meta.env.VITE_SUPABASE_URL = ""

    const result = await loadProgress(userId)

    expect(result).toEqual({})
  })
})

// ── syncLocalProgressToSupabase ────────────────────────────────────────────

describe("syncLocalProgressToSupabase", () => {
  it("retorna erro quando Supabase não está configurado", async () => {
    import.meta.env.VITE_SUPABASE_URL = ""

    const result = await syncLocalProgressToSupabase("u1")

    expect(result.error).toBe("Supabase não configurado")
  })

  it("sincroniza todos os dados locais para o Supabase", async () => {
    const localData = {
      cat1: { currentModuleIndex: 0, currentLessonIndex: 1, completedLessonIds: ["l1"] },
      cat2: { currentModuleIndex: 1, currentLessonIndex: 0, completedLessonIds: [] },
    }
    localStorage.setItem("promptlabz_progress:u1", JSON.stringify(localData))

    const q = buildQuery({ upsert: vi.fn().mockResolvedValue({ error: null }) })

    const result = await syncLocalProgressToSupabase("u1")

    expect(result.error).toBeNull()
    expect(q.upsert).toHaveBeenCalledTimes(2)
  })

  it("retorna erro quando algum upsert falha", async () => {
    const localData = {
      cat1: { currentModuleIndex: 0, currentLessonIndex: 0, completedLessonIds: [] },
    }
    localStorage.setItem("promptlabz_progress:u1", JSON.stringify(localData))
    buildQuery({ upsert: vi.fn().mockResolvedValue({ error: { message: "Sync failed" } }) })

    const result = await syncLocalProgressToSupabase("u1")

    expect(result.error).toBe("Sync failed")
  })
})

// ── getLeaderboard ─────────────────────────────────────────────────────────

describe("getLeaderboard", () => {
  it("consulta a view leaderboard_entries (nunca a tabela users diretamente)", async () => {
    const entries = [{ id: "u1", full_name: "Ana", avatar_url: null, xp: 300 }]
    buildQuery({ limit: vi.fn().mockResolvedValue({ data: entries, error: null }) })

    const result = await getLeaderboard(10)

    expect(mockFrom).toHaveBeenCalledWith("leaderboard_entries")
    expect(mockFrom).not.toHaveBeenCalledWith("users")
    expect(result.data).toEqual(entries)
    expect(result.error).toBeNull()
  })

  it("retorna erro quando a consulta falha", async () => {
    buildQuery({
      limit: vi.fn().mockResolvedValue({ data: null, error: { message: "Query failed" } }),
    })

    const result = await getLeaderboard()

    expect(result.data).toBeNull()
    expect(result.error).toBe("Query failed")
  })
})

// ── Paginação real (.range()) ────────────────────────────────────────────

describe("getNewsArticles", () => {
  it("usa .range(offset, offset+limit-1) em vez de .limit() fixo", async () => {
    const q = buildQuery({ range: vi.fn().mockResolvedValue({ data: [], error: null }) })

    await getNewsArticles(30, 60)

    expect(q.range).toHaveBeenCalledWith(60, 89)
  })

  it("por padrão busca a primeira página (offset 0)", async () => {
    const q = buildQuery({ range: vi.fn().mockResolvedValue({ data: [], error: null }) })

    await getNewsArticles(30)

    expect(q.range).toHaveBeenCalledWith(0, 29)
  })
})

describe("getNotifications", () => {
  it("usa .range(offset, offset+limit-1) para paginar notificações do usuário", async () => {
    const q = buildQuery({ range: vi.fn().mockResolvedValue({ data: [], error: null }) })

    await getNotifications("user-1", 50, 100)

    expect(q.range).toHaveBeenCalledWith(100, 149)
  })
})

// ── updateUserXP ───────────────────────────────────────────────────────────

describe("updateUserXP", () => {
  it("chama o RPC sync_user_xp em vez de dar update direto na tabela users", async () => {
    mockRpc.mockResolvedValue({ data: null, error: null })

    const result = await updateUserXP("u1", 500, 20)

    expect(mockRpc).toHaveBeenCalledWith("sync_user_xp", { new_xp: 500, new_gems: 20 })
    expect(mockFrom).not.toHaveBeenCalled()
    expect(result.error).toBeNull()
  })

  it("envia new_gems null quando gems não é informado", async () => {
    mockRpc.mockResolvedValue({ data: null, error: null })

    await updateUserXP("u1", 500)

    expect(mockRpc).toHaveBeenCalledWith("sync_user_xp", { new_xp: 500, new_gems: null })
  })

  it("retorna erro quando o RPC rejeita (ex: delta acima do permitido)", async () => {
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: "sync_user_xp: xp increase too large" },
    })

    const result = await updateUserXP("u1", 999999)

    expect(result.error).toBe("sync_user_xp: xp increase too large")
  })
})

// ── updateUserGems ─────────────────────────────────────────────────────────

describe("updateUserGems", () => {
  it("busca o xp atual e chama sync_user_xp em vez de dar update direto na tabela users", async () => {
    buildQuery({ single: vi.fn().mockResolvedValue({ data: { xp: 300 }, error: null }) })
    mockRpc.mockResolvedValue({ data: null, error: null })

    const result = await updateUserGems("u1", 40)

    expect(mockRpc).toHaveBeenCalledWith("sync_user_xp", { new_xp: 300, new_gems: 40 })
    expect(result.error).toBeNull()
  })

  it("retorna erro quando não consegue ler o xp atual", async () => {
    buildQuery({
      single: vi.fn().mockResolvedValue({ data: null, error: { message: "Profile not found" } }),
    })

    const result = await updateUserGems("u1", 40)

    expect(mockRpc).not.toHaveBeenCalled()
    expect(result.error).toBe("Profile not found")
  })

  it("retorna erro quando o RPC rejeita", async () => {
    buildQuery({ single: vi.fn().mockResolvedValue({ data: { xp: 300 }, error: null }) })
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: "sync_user_xp: gems increase too large" },
    })

    const result = await updateUserGems("u1", 999999)

    expect(result.error).toBe("sync_user_xp: gems increase too large")
  })
})

// ── saveModuleProgress / fetchModuleProgress ───────────────────────────────

describe("saveModuleProgress", () => {
  it("chama o RPC sync_module_progress com o track e a contagem concluída", async () => {
    mockRpc.mockResolvedValue({ data: null, error: null })

    const result = await saveModuleProgress("u1", "a1", 3)

    expect(result.error).toBeNull()
    expect(mockRpc).toHaveBeenCalledWith("sync_module_progress", {
      p_track: "a1",
      p_completed_count: 3,
    })
  })

  it("retorna erro quando o RPC falha", async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: "Insert failed" } })

    const result = await saveModuleProgress("u1", "a1", 3)

    expect(result.error).toBe("Insert failed")
  })
})

describe("fetchModuleProgress", () => {
  it("retorna um mapa track → completed_count", async () => {
    buildQuery({
      eq: vi.fn().mockResolvedValue({
        data: [
          { track: "a1", completed_count: 7 },
          { track: "a2", completed_count: 2 },
        ],
        error: null,
      }),
    })

    const result = await fetchModuleProgress("u1")

    expect(result.error).toBeNull()
    expect(result.data).toEqual({ a1: 7, a2: 2 })
  })

  it("retorna erro quando a consulta falha", async () => {
    buildQuery({
      eq: vi.fn().mockResolvedValue({ data: null, error: { message: "Query failed" } }),
    })

    const result = await fetchModuleProgress("u1")

    expect(result.data).toBeNull()
    expect(result.error).toBe("Query failed")
  })
})

// ── syncInventoryToServer ──────────────────────────────────────────────────

describe("syncInventoryToServer", () => {
  const userId = "u1"
  const inv: StoredInventory = {
    powerUps: { "boost-xp": 2, protection: 1, "focus-total": 0 },
    ownedAvatarIds: ["cat-green", "cat-blue"],
  }

  it("retorna erro quando Supabase não está configurado", async () => {
    import.meta.env.VITE_SUPABASE_URL = ""

    const result = await syncInventoryToServer(userId, inv)

    expect(result.error).toBe("Supabase não configurado")
  })

  it("faz upsert no Supabase com os dados do inventário", async () => {
    const q = buildQuery({ upsert: vi.fn().mockResolvedValue({ error: null }) })

    const result = await syncInventoryToServer(userId, inv)

    expect(result.error).toBeNull()
    expect(q.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: userId,
        boost_xp: 2,
        protection: 1,
        focus_total: 0,
        owned_avatar_ids: ["cat-green", "cat-blue"],
      }),
      expect.anything()
    )
  })

  it("retorna erro quando o upsert falha", async () => {
    buildQuery({ upsert: vi.fn().mockResolvedValue({ error: { message: "Insert failed" } }) })

    const result = await syncInventoryToServer(userId, inv)

    expect(result.error).toBe("Insert failed")
  })
})

// ── fetchInventoryFromServer ───────────────────────────────────────────────

describe("fetchInventoryFromServer", () => {
  const userId = "u1"

  it("retorna erro quando Supabase não está configurado", async () => {
    import.meta.env.VITE_SUPABASE_URL = ""

    const result = await fetchInventoryFromServer(userId)

    expect(result.error).toBe("Supabase não configurado")
  })

  it("retorna null sem erro quando não há linha no servidor", async () => {
    buildQuery({ maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) })

    const result = await fetchInventoryFromServer(userId)

    expect(result.data).toBeNull()
    expect(result.error).toBeNull()
  })

  it("mescla dados do servidor com o localStorage (mantendo o maior valor)", async () => {
    localStorage.setItem(
      `pl:inventory:${userId}`,
      JSON.stringify({
        powerUps: { "boost-xp": 3, protection: 0, "focus-total": 1 },
        ownedAvatarIds: ["cat-green"],
      })
    )
    buildQuery({
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          boost_xp: 1,
          protection: 5,
          focus_total: 0,
          owned_avatar_ids: ["cat-blue"],
        },
        error: null,
      }),
    })

    const result = await fetchInventoryFromServer(userId)

    expect(result.error).toBeNull()
    expect(result.data).toEqual({
      powerUps: { "boost-xp": 3, protection: 5, "focus-total": 1 },
      ownedAvatarIds: ["cat-green", "cat-blue"],
    })
    // Deve ter persistido o resultado mesclado no localStorage
    expect(loadInventory(userId)).toEqual(result.data)
  })

  it("retorna erro quando a consulta falha", async () => {
    buildQuery({
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: "Query failed" } }),
    })

    const result = await fetchInventoryFromServer(userId)

    expect(result.data).toBeNull()
    expect(result.error).toBe("Query failed")
  })
})
