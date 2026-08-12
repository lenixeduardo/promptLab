// Cria 5 usuários de teste com progresso já registrado na Trilha (assistiram
// aulas e avançaram módulos), para testar manualmente o fluxo de aprendizado,
// XP/gems, streak e conquistas sem precisar jogar do zero.
//
// Uso:
//   SUPABASE_SERVICE_ROLE_KEY=... VITE_SUPABASE_URL=... node scripts/seed-test-users.mjs
//
// Requer a service role key (RLS é ignorado pelo client admin). Nunca rode
// isso contra produção sem ter certeza — cria contas reais no Supabase Auth.

import { createClient } from "@supabase/supabase-js"

const url = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.error(
    "Faltam variáveis de ambiente. Defina VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
  )
  process.exit(1)
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Totais de módulos por trilha, sincronizados com src/lib/lessonContent.ts (TRACK_TOTALS)
const TRACK_TOTALS = { a1: 7, a2: 9, a3: 21, a4: 7 }

const TEST_PASSWORD = "TestePromptLabz2026!"

const TEST_USERS = [
  {
    email: "teste.ana@promptlabz.dev",
    fullName: "Ana Iniciante",
    progress: { a1: 3, a2: 0, a3: 0, a4: 0 },
    xp: 120,
    gems: 40,
    currentStreak: 2,
    longestStreak: 2,
    perfectCount: 1,
    unlocked: ["first-lesson"],
  },
  {
    email: "teste.bruno@promptlabz.dev",
    fullName: "Bruno Progredindo",
    progress: { a1: 7, a2: 5, a3: 0, a4: 0 },
    xp: 640,
    gems: 210,
    currentStreak: 4,
    longestStreak: 5,
    perfectCount: 4,
    unlocked: ["first-lesson", "first-perfect", "first-category", "streak-3"],
  },
  {
    email: "teste.carla@promptlabz.dev",
    fullName: "Carla Avançada",
    progress: { a1: 7, a2: 9, a3: 12, a4: 0 },
    xp: 1580,
    gems: 520,
    currentStreak: 7,
    longestStreak: 9,
    perfectCount: 11,
    unlocked: [
      "first-lesson",
      "ten-lessons",
      "first-perfect",
      "three-perfect",
      "ten-perfect",
      "first-category",
      "streak-3",
      "streak-7",
    ],
  },
  {
    email: "teste.diego@promptlabz.dev",
    fullName: "Diego Quase Lá",
    progress: { a1: 7, a2: 9, a3: 21, a4: 4 },
    xp: 2760,
    gems: 900,
    currentStreak: 12,
    longestStreak: 15,
    perfectCount: 22,
    unlocked: [
      "first-lesson",
      "ten-lessons",
      "fifty-lessons",
      "first-perfect",
      "three-perfect",
      "ten-perfect",
      "first-category",
      "streak-3",
      "streak-7",
    ],
  },
  {
    email: "teste.elisa@promptlabz.dev",
    fullName: "Elisa Trilha Completa",
    progress: { a1: 7, a2: 9, a3: 21, a4: 7 },
    xp: 4200,
    gems: 1500,
    currentStreak: 30,
    longestStreak: 34,
    perfectCount: 40,
    unlocked: [
      "first-lesson",
      "ten-lessons",
      "fifty-lessons",
      "first-perfect",
      "three-perfect",
      "ten-perfect",
      "first-category",
      "streak-3",
      "streak-7",
      "streak-30",
      "social",
    ],
  },
]

function totalCompleted(progress) {
  return Object.values(progress).reduce((sum, n) => sum + n, 0)
}

async function findExistingUserId(email) {
  // admin.listUsers não tem filtro por e-mail direto; pagina até achar.
  let page = 1
  const perPage = 200
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error) throw error
    const found = data.users.find((u) => u.email === email)
    if (found) return found.id
    if (data.users.length < perPage) return null
    page += 1
  }
}

async function upsertTestUser(spec) {
  console.log(`\n→ ${spec.email} (${spec.fullName})`)

  let userId = await findExistingUserId(spec.email)

  if (!userId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: spec.email,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: spec.fullName },
    })
    if (error) throw error
    userId = data.user.id
    console.log(`  criado (auth.users id=${userId})`)
  } else {
    console.log(`  já existia (auth.users id=${userId}), atualizando dados`)
  }

  // O trigger on_auth_user_created popula public.users e public.user_achievements
  // automaticamente na criação. Damos um instante para a trigger rodar antes de
  // fazer update sobre essas linhas.
  await new Promise((r) => setTimeout(r, 300))

  const { error: usersError } = await supabase
    .from("users")
    .update({ full_name: spec.fullName, xp: spec.xp, gems: spec.gems })
    .eq("id", userId)
  if (usersError) throw usersError

  const progressRows = Object.entries(spec.progress)
    .filter(([, completed]) => completed > 0)
    .map(([track, completed]) => ({
      user_id: userId,
      track,
      completed_count: Math.min(completed, TRACK_TOTALS[track]),
    }))
  if (progressRows.length > 0) {
    const { error: progressError } = await supabase
      .from("user_module_progress")
      .upsert(progressRows, { onConflict: "user_id,track" })
    if (progressError) throw progressError
  }

  const { error: streakError } = await supabase.from("user_streaks").upsert(
    {
      user_id: userId,
      current_streak: spec.currentStreak,
      longest_streak: spec.longestStreak,
      last_visit_date: new Date().toISOString().slice(0, 10),
    },
    { onConflict: "user_id" }
  )
  if (streakError) throw streakError

  const { error: achievementsError } = await supabase
    .from("user_achievements")
    .update({
      unlocked_achievements: spec.unlocked,
      total_lessons_completed: totalCompleted(spec.progress),
      perfect_count: spec.perfectCount,
      last_visit_date: new Date().toISOString().slice(0, 10),
      consecutive_days: spec.currentStreak,
      completed_category_ids: Object.entries(spec.progress)
        .filter(([track, completed]) => completed >= TRACK_TOTALS[track])
        .map(([track]) => track),
    })
    .eq("user_id", userId)
  if (achievementsError) throw achievementsError

  console.log(
    `  progresso: ${JSON.stringify(spec.progress)} | xp=${spec.xp} gems=${spec.gems} streak=${spec.currentStreak}`
  )
}

for (const spec of TEST_USERS) {
  await upsertTestUser(spec)
}

console.log("\n✔ 5 usuários de teste prontos. Senha para todos: " + TEST_PASSWORD)
console.log(TEST_USERS.map((u) => `  - ${u.email}`).join("\n"))
