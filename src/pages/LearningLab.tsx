import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Check,
  Lock,
  Sparkles,
  Star,
  BookOpen,
  Brain,
  Zap,
  Clock,
  Palette,
  Rocket,
  Wand2,
  Target,
  Layers,
  Code2,
  Briefcase,
  Network,
  Server,
  Terminal,
  Puzzle,
  FileCode,
  Cpu,
  KeyRound,
  Database,
  Activity,
  CalendarClock,
  GitBranch,
  Package,
  Heart,
  PartyPopper,
  Image as ImageIcon,
  User,
  Frame,
  SunMedium,
  Ban,
  GraduationCap,
} from "lucide-react";
import { AppBottomNav } from "@/components/AppBottomNav";
import { cn } from "@/lib/utils";
import { useModuleProgress, type TrackId } from "@/lib/moduleProgress";
import { useLives } from "@/contexts/useLives";

type Status = "completed" | "current" | "locked";

type Module = { title: string; icon: typeof BookOpen; xp: number };

const TRACKS: { id: TrackId; label: string; subtitle: string; modules: Module[] }[] = [
  {
    id: "a1",
    label: "Trilha A1",
    subtitle: "Fundamentos de prompts",
    modules: [
      { title: "Boas-vindas",                       icon: Star,     xp: 30 },
      { title: "O que é um prompt",                 icon: BookOpen, xp: 50 },
      { title: "Contexto & clareza",                icon: Brain,    xp: 80 },
      { title: "Personas e papéis (Personas)",      icon: Sparkles, xp: 80 },
      { title: "Estruturas de prompt",              icon: Zap,      xp: 100 },
      { title: "Poucos exemplos (Few-shot)",        icon: Palette,  xp: 120 },
      { title: "Refino iterativo",                  icon: Clock,    xp: 120 },
    ],
  },
  {
    id: "a2",
    label: "Trilha A2",
    subtitle: "Prompts avançados",
    modules: [
      { title: "Cadeia de raciocínio (Chain-of-thought)", icon: Brain,    xp: 60 },
      { title: "Decomposição de tarefas",                  icon: Layers,   xp: 90 },
      { title: "Prompts com restrições",                   icon: Target,   xp: 100 },
      { title: "Estilo e tom controlado",                  icon: Wand2,    xp: 110 },
      { title: "Prompts multi-etapa",                      icon: Rocket,   xp: 130 },
      { title: "Avaliação de respostas",                   icon: Sparkles, xp: 140 },
      { title: "Refino guiado por dados",                  icon: Zap,      xp: 150 },
      { title: "Engenharia de prompt (Prompt Engineering)", icon: Wand2,   xp: 160 },
      { title: "Modelos de linguagem (LLMs)",              icon: Cpu,      xp: 170 },
    ],
  },
  {
    id: "a3",
    label: "Trilha A3",
    subtitle: "Aplicações profissionais",
    modules: [
      { title: "Prompts para código",                       icon: Code2,        xp: 120 },
      { title: "Automação com IA",                          icon: Rocket,       xp: 140 },
      { title: "Prompts para negócios",                     icon: Briefcase,    xp: 150 },
      { title: "Fluxos com agentes (Workflows)",            icon: Layers,       xp: 160 },
      { title: "Avaliação & métricas",                      icon: Target,       xp: 170 },
      { title: "Segurança e proteções (Guardrails)",        icon: Sparkles,     xp: 180 },
      { title: "Projeto final",                             icon: Star,         xp: 200 },
      { title: "Usando agentes de IA (Agents)",             icon: Network,      xp: 180 },
      { title: "Usando OpenRouter",                         icon: Layers,       xp: 170 },
      { title: "Modelos locais (Local Models)",             icon: Server,       xp: 180 },
      { title: "Claude Code na prática",                    icon: Terminal,     xp: 200 },
      { title: "Habilidades (Skills) no Claude Code",       icon: Puzzle,       xp: 200 },
      { title: "Personalizar modelos prontos (Templates)",  icon: FileCode,     xp: 190 },
      { title: "O que é API key",                           icon: KeyRound,     xp: 160 },
      { title: "Migrations e banco de dados",               icon: Database,     xp: 180 },
      { title: "Health check (banco e backend)",            icon: Activity,     xp: 170 },
      { title: "Cron jobs para automações",                 icon: CalendarClock, xp: 190 },
      { title: "Node.js — O que é e para que serve",        icon: Server,       xp: 160 },
      { title: "Git Bash — Terminal e versionamento",       icon: GitBranch,    xp: 170 },
      { title: "npm — Gerenciador de pacotes",              icon: Package,      xp: 160 },
      { title: "Skills em LLMs — Como usar",                icon: Brain,        xp: 180 },
    ],
  },
  {
    id: "a4",
    label: "Trilha A4",
    subtitle: "Prompts visuais com a técnica SAFE",
    modules: [
      { title: "Introdução à Técnica SAFE",           icon: ImageIcon,    xp: 60 },
      { title: "S — Sujeito",                          icon: User,         xp: 90 },
      { title: "A — Atributos",                        icon: Palette,      xp: 100 },
      { title: "F — Enquadramento",                    icon: Frame,        xp: 110 },
      { title: "E — Ambiente",                         icon: SunMedium,    xp: 120 },
      { title: "Restrições negativas",                 icon: Ban,          xp: 130 },
      { title: "Prova final — Dissertativa SAFE",      icon: GraduationCap, xp: 200 },
    ],
  },
];

const TRACK_ORDER: TrackId[] = ["a1", "a2", "a3", "a4"];

function useTrackCompletion() {
  return {
    a1: useModuleProgress("a1"),
    a2: useModuleProgress("a2"),
    a3: useModuleProgress("a3"),
    a4: useModuleProgress("a4"),
  };
}

export default function LearningLabPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const track = (searchParams.get("track") as TrackId) || "a1";
  const completions = useTrackCompletion();
  const { lives } = useLives();

  const trackUnlocked: Record<TrackId, boolean> = {
    a1: true,
    a2: true,
    a3: true,
    a4: true,
  };

  const active = TRACKS.find((t) => t.id === track) ?? TRACKS[0];
  const completed = completions[active.id];
  const statusFor = (i: number): Status =>
    i < completed ? "completed" : i === completed ? "current" : "locked";

  return (
    <div className="flex min-h-screen flex-col bg-white pb-24 lg:pb-8">
      <div className="sticky top-0 z-10 border-b border-stroke-muted bg-card px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between lg:max-w-5xl lg:mx-auto">
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-primary-dark">{active.label}</h1>
            <p className="text-xs text-foreground-tertiary">
              {completed} de {active.modules.length} módulos · {active.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-500 dark:bg-red-950/40 dark:text-red-300">
            <Heart className="h-3.5 w-3.5 fill-red-500" /> <span>{lives}</span>
          </div>
        </div>

        <div role="tablist" className="mt-3 flex gap-2 overflow-x-auto lg:max-w-5xl lg:mx-auto">
          {TRACKS.map((t) => {
            const unlocked = trackUnlocked[t.id];
            const isActive = t.id === active.id;
            const done = completions[t.id] >= t.modules.length;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                disabled={!unlocked}
                onClick={() => setSearchParams({ track: t.id })}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow"
                    : unlocked
                      ? "border-stroke-light bg-surface-soft text-foreground-dark hover:bg-card"
                      : "border-stroke-muted bg-surface-soft text-neutral opacity-60",
                )}
              >
                {!unlocked && <Lock className="h-3 w-3" />}
                {done && unlocked && <Check className="h-3 w-3" />}
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-md lg:max-w-5xl px-6 py-8 lg:px-8">
        <div className="relative flex flex-col items-stretch gap-2 lg:grid lg:grid-cols-2 lg:gap-4 lg:items-start">
          {active.modules.map((m, i) => {
            const Icon = m.icon;
            const status = statusFor(i);
            const isLocked = status === "locked";
            const isCurrent = status === "current";
            const isDone = status === "completed";
            const offsets = ["ml-0", "ml-16", "ml-28", "ml-16", "ml-0", "ml-16", "ml-28"];
            const offset = offsets[i % offsets.length];
            const isLast = i === active.modules.length - 1;

            return (
              <div key={i} className={cn("relative flex flex-col items-start gap-1 lg:ml-0", offset)}>
                <Link
                  to={isLocked ? "/learn" : `/lesson?track=${active.id}&module=${i}`}
                  className={cn(
                    "relative flex h-20 w-20 items-center justify-center rounded-full border-4 transition-transform active:scale-95",
                    isDone && "bg-emerald border-emerald-dark text-white shadow-lg shadow-emerald/30",
                    isCurrent && "bg-luxury border-amber-500 text-luxury-foreground shadow-lg shadow-luxury/40 animate-pulse will-change-[opacity]",
                    isLocked && "bg-surface-soft border-stroke-light text-neutral",
                  )}
                  aria-label={m.title}
                >
                  {isDone ? (
                    <Check className="h-8 w-8" strokeWidth={3} />
                  ) : isLocked ? (
                    <Lock className="h-6 w-6" />
                  ) : (
                    <Icon className="h-8 w-8" strokeWidth={2.2} />
                  )}
                  {isCurrent && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-luxury px-2 py-0.5 text-[9px] font-extrabold uppercase text-luxury-foreground shadow">
                      Começar
                    </span>
                  )}
                </Link>

                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="ml-9 flex h-10 w-1 flex-col items-center justify-between"
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", isDone ? "bg-emerald" : "bg-stroke-light")} />
                    <span className={cn("h-1.5 w-1.5 rounded-full", isDone ? "bg-emerald/70" : "bg-stroke-light")} />
                    <span className={cn("h-1.5 w-1.5 rounded-full", isDone ? "bg-emerald/50" : "bg-stroke-light")} />
                    <span className={cn("h-1.5 w-1.5 rounded-full", isDone ? "bg-emerald/30" : "bg-stroke-light")} />
                  </div>
                )}

                <div className="ml-1 max-w-[10rem]">
                  <p
                    className={cn(
                      "text-xs font-bold",
                      isLocked ? "text-neutral" : "text-foreground-dark",
                    )}
                  >
                    {m.title}
                  </p>
                  <p className="text-[10px] text-foreground-tertiary">+{m.xp} XP</p>
                </div>
              </div>
            );
          })}

          {completed >= active.modules.length && (
            <div className="mt-6 rounded-2xl border-2 border-emerald/40 bg-emerald/10 p-4 text-center">
              <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-emerald-dark">
                Trilha {active.label.replace("Trilha ", "")} concluída! <PartyPopper className="h-4 w-4" />
              </p>
              {(() => {
                const nextId = TRACK_ORDER[TRACK_ORDER.indexOf(active.id) + 1];
                if (!nextId || !trackUnlocked[nextId]) return null;
                return (
                  <button
                    type="button"
                    onClick={() => setSearchParams({ track: nextId })}
                    className="mt-2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground"
                  >
                    Continuar na próxima trilha →
                  </button>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      <AppBottomNav />
    </div>
  );
}
