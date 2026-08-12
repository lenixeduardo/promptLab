import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Gift, Sparkles, ArrowRight, Star, Gem } from "lucide-react";
import { AppBottomNav } from "@/components/AppBottomNav";
import { AppPageHeader } from "@/components/AppPageHeader";
import { cn } from "@/lib/utils";
import { useDailyMissions } from "@/hooks/useDailyMissions";

export default function MissionsPage() {
  const {
    missions,
    completed,
    doneCount,
    chestUnlocked,
    chestOpened,
    handleOpenChest,
    specialQuest,
    questCompleted,
    questAvailable,
    CHEST_THRESHOLD,
    CHEST_REWARD_GEMS,
    CHEST_REWARD_XP,
    SPECIAL_QUEST_COOLDOWN_DAYS,
  } = useDailyMissions();

  return (
    <div className="flex min-h-screen flex-col bg-white pb-24 lg:pb-8">
      <AppPageHeader
        title="Missões Diárias"
        subtitle={`Conclua ${CHEST_THRESHOLD} missões para ganhar +${CHEST_REWARD_XP} XP e +${CHEST_REWARD_GEMS} gemas`}
        back="/home"
      />

      <div className="mx-auto w-full max-w-lg lg:max-w-3xl px-4 py-4">
        {/* Daily chest */}
        <div
          className={cn(
            "mb-5 overflow-hidden rounded-2xl border-2 p-4 transition-colors",
            chestUnlocked
              ? "border-luxury bg-gradient-to-br from-luxury/20 to-luxury/5"
              : "border-stroke-light bg-card",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                chestUnlocked
                  ? "bg-luxury text-luxury-foreground animate-pulse"
                  : "bg-page-bg-light text-foreground-tertiary",
              )}
            >
              <Gift className="h-6 w-6" strokeWidth={2.4} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-foreground-dark">
                Baú diário{" "}
                {chestOpened ? "aberto!" : chestUnlocked ? "disponível" : "em progresso"}
              </p>
              <p className="flex items-center gap-0.5 text-[11px] text-foreground-tertiary flex-wrap">
                Conclua {CHEST_THRESHOLD} missões para ganhar +{CHEST_REWARD_XP} XP e +{CHEST_REWARD_GEMS}
                <Gem className="h-3 w-3 text-luxury inline-block" />
              </p>
            </div>
            <span className="rounded-full bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
              {Math.min(doneCount, CHEST_THRESHOLD)}/{CHEST_THRESHOLD}
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-stroke-muted/40">
            <div
              className="h-full rounded-full bg-luxury transition-all"
              style={{ width: `${Math.min(100, (doneCount / CHEST_THRESHOLD) * 100)}%` }}
            />
          </div>
          {chestUnlocked && (
            <button
              onClick={handleOpenChest}
              disabled={chestOpened}
              className={cn(
                "mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors",
                chestOpened
                  ? "bg-emerald/20 text-emerald-dark cursor-default"
                  : "bg-luxury text-luxury-foreground hover:brightness-105",
              )}
            >
              {chestOpened ? (
                <>
                  <Sparkles className="h-4 w-4" /> +{CHEST_REWARD_XP} XP e +{CHEST_REWARD_GEMS}
                  <Gem className="h-3.5 w-3.5" /> coletados
                </>
              ) : (
                <>
                  <Gift className="h-4 w-4" /> Abrir baú
                </>
              )}
            </button>
          )}
        </div>

        {/* Special quest */}
        <div
          className={cn(
            "mb-5 rounded-2xl border-2 p-4 transition-colors",
            questCompleted
              ? "border-luxury/40 bg-luxury/5"
              : questAvailable
              ? "border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/30"
              : "border-stroke-light bg-card",
          )}
        >
          <div className="mb-2 flex items-center gap-2">
            <Star
              className={cn(
                "h-4 w-4",
                questCompleted
                  ? "fill-luxury text-luxury"
                  : questAvailable
                  ? "text-amber-500"
                  : "text-foreground-tertiary",
              )}
            />
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-tertiary">
              Quest especial do baú
            </span>
            {!questAvailable && !questCompleted && (
              <span className="ml-auto rounded-full bg-stroke-light px-2 py-0.5 text-[10px] font-bold text-foreground-tertiary">
                Cooldown {SPECIAL_QUEST_COOLDOWN_DAYS} dias
              </span>
            )}
            {questCompleted && (
              <span className="ml-auto flex items-center gap-0.5 rounded-full bg-luxury/20 px-2 py-0.5 text-[10px] font-bold text-luxury">
                +{specialQuest.gems} <Gem className="h-3 w-3" /> coletados
              </span>
            )}
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p
                className={cn(
                  "text-sm font-bold",
                  questCompleted
                    ? "line-through text-foreground-tertiary"
                    : "text-foreground-dark",
                )}
              >
                {specialQuest.title}
              </p>
              <p className="mt-0.5 text-[11px] text-foreground-tertiary">{specialQuest.desc}</p>
            </div>
            <span className="shrink-0 flex items-center gap-0.5 rounded-full bg-luxury/15 px-2 py-0.5 text-[11px] font-bold text-luxury">
              +{specialQuest.gems} <Gem className="h-3 w-3" />
            </span>
          </div>
          {questAvailable && !questCompleted && (
            <Link
              to={specialQuest.link}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-500"
            >
              {specialQuest.linkLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Mission list — read-only, no click-to-complete */}
        {missions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Gift className="h-10 w-10 text-stroke-light" />
            <p className="text-sm font-bold text-foreground-dark">Nenhuma missão disponível</p>
            <p className="text-xs text-foreground-tertiary">Volte amanhã para novas missões!</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {missions.map((m) => {
            const Icon = m.icon;
            const isDone = completed[m.id];
            return (
              <div
                key={m.id}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border-2 p-4",
                  isDone
                    ? "border-emerald/40 bg-surface-success/60"
                    : "border-stroke-light bg-card",
                )}
              >
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    isDone ? "bg-emerald text-white" : "bg-page-bg-light text-forest",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p
                    className={cn(
                      "text-sm font-bold",
                      isDone
                        ? "text-emerald-dark line-through decoration-2"
                        : "text-foreground-dark",
                    )}
                  >
                    {m.title}
                  </p>
                  <p className="text-[11px] text-foreground-tertiary">
                    {isDone ? m.desc : m.hint}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    +{m.xp} XP
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald" />
                  ) : m.link ? (
                    <Link to={m.link} aria-label={`Ir para ${m.title}`}>
                      <ArrowRight className="h-5 w-5 text-forest transition-colors hover:text-emerald" />
                    </Link>
                  ) : (
                    <Circle className="h-5 w-5 text-stroke-light" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}

        <Link
          to="/home"
          className="mt-6 block text-center text-xs font-semibold text-foreground-tertiary hover:text-emerald"
        >
          Voltar ao início
        </Link>
      </div>

      <AppBottomNav />
    </div>
  );
}
