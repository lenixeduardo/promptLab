import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Send,
  ArrowRight,
  CheckCircle2,
  Camera,
  Upload,
  ImageIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { advanceModule, type TrackId } from "@/lib/moduleProgress";
import { getActivities, getProofTask, TRACK_TOTALS, isMatch, isOrder, isEssay, isContentSlide } from "@/lib/lessonContent";
import type { LessonActivity } from "@/lib/lessonContent";
import { ActivityRenderer } from "@/components/activities/ActivityRenderer";
import { scopedKey } from "@/lib/userScope";
import { completeMission } from "@/lib/missions";
import { useAuth } from "@/hooks/useAuth";
import { useLives } from "@/contexts/useLives";
import { useAchievements } from "@/hooks/useAchievements";
import { awardXP, saveLocalGems, getLocalGems, GEMS_UPDATE_EVENT } from "@/lib/xp";
import { playCorrectSound, playLessonCompleteSound } from "@/lib/sound";
import { TrailCompleteCelebration } from "@/components/TrailCompleteCelebration";

const proofKey = (track: TrackId, module: number) =>
  scopedKey(`promptlabz:proof:${track}:${module}`);

function readProof(track: TrackId, module: number): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(proofKey(track, module));
  } catch {
    return null;
  }
}

export default function LessonPage() {
  const [searchParams] = useSearchParams();
  const track = (searchParams.get("track") as TrackId) || "a1";
  const module = parseInt(searchParams.get("module") || "0", 10);
  const navigate = useNavigate();

  const { user } = useAuth();
  const { lives, consumeLife, awardPerfectBonus } = useLives();
  const { checkLessonComplete } = useAchievements();
  const [trailCelebration, setTrailCelebration] = useState<{ trackLabel: string } | null>(null);
  const pendingLevelUpRef = useRef<{ newLevel: number; prevLevel: number } | null>(null);

  const ACTIVITIES = useMemo(() => getActivities(track, module), [track, module]);
  const proofTask = useMemo(() => getProofTask(track, module), [track, module]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [matchOrderAnswers, setMatchOrderAnswers] = useState<Record<string, Record<string, string>>>({});
  const [proofDataUrl, setProofDataUrl] = useState<string | null>(() => readProof(track, module));
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const rewardGrantedRef = useRef(false);
  const completionSoundPlayedRef = useRef(false);
  const scoreRef = useRef(0);

  useEffect(() => {
    setProofDataUrl(readProof(track, module));
  }, [track, module]);

  // React Router keeps the same component instance when only the query
  // string changes (e.g. clicking "Próxima aula"), so quiz progress from
  // the previous lesson must be reset explicitly when track/module changes.
  useEffect(() => {
    setStep(0);
    setSelected(null);
    setAnswers({});
    setMatchOrderAnswers({});
    rewardGrantedRef.current = false;
    completionSoundPlayedRef.current = false;
    scoreRef.current = 0;
  }, [track, module]);

  const finished = step >= ACTIVITIES.length;
  const currentActivity = ACTIVITIES[step] as LessonActivity | undefined;
  const isCurrentSlide = currentActivity ? isContentSlide(currentActivity) : false;
  const answered = isCurrentSlide || selected !== null || !!matchOrderAnswers[step];
  const isCurrentEssay = currentActivity ? isEssay(currentActivity) : false;
  const isLast = step === ACTIVITIES.length - 1;

  // Slides não contam para score — só as atividades reais
  const scorableActivities = ACTIVITIES.filter((a) => !isContentSlide(a));

  // Score: essays sempre contam 1 se respondidas; match/order por pares; MC/fill-blank por correct
  const score = ACTIVITIES.reduce((acc, activity, i) => {
    if (isContentSlide(activity)) return acc
    if (isEssay(activity)) {
      return answers[activity.id] ? acc + 1 : acc
    }
    if (isMatch(activity)) {
      const connections = matchOrderAnswers[i]
      if (!connections) return acc
      const total = activity.pairs.length
      if (total === 0) return acc
      const matchScore = activity.pairs.filter((p) => connections[p.word] === p.definition).length
      return acc + (matchScore === total ? 1 : 0)
    }
    if (isOrder(activity)) {
      const connections = matchOrderAnswers[i]
      if (!connections) return acc
      const correct = activity.correctPairs
      const total = Object.keys(correct).length
      if (total === 0) return acc
      const matchScore = Object.entries(connections).filter(([k, v]) => correct[k] === v).length
      return acc + (matchScore === total ? 1 : 0)
    }
    const answer = answers[activity.id]
    if (!answer) return acc
    return acc + (answer === (activity as any).correct ? 1 : 0)
  }, 0)

  // Keep scoreRef in sync so the lessonComplete effect reads the latest value
  useEffect(() => { scoreRef.current = score }, [score]);

  function pick(id: string) {
    if (answered || !currentActivity) return
    setSelected(id)
    setAnswers((prev) => ({ ...prev, [currentActivity.id]: id }))
    // Consume a life when the user picks a wrong answer on MC/fill-blank
    const correct = (currentActivity as any).correct as string | undefined
    if (correct && id !== correct) {
      consumeLife()
    } else if (correct) {
      playCorrectSound()
    }
  }

  function handleMatchAnswer(pairs: Record<string, string>) {
    if (answered || !currentActivity) return
    setMatchOrderAnswers((prev) => ({ ...prev, [step]: pairs }))
    setSelected("__match_done__")
    if (isMatch(currentActivity)) {
      const allCorrect = currentActivity.pairs.every((p) => pairs[p.word] === p.definition)
      if (allCorrect) playCorrectSound()
    }
  }

  function handleOrderAnswer(pairs: Record<string, string>) {
    if (answered || !currentActivity) return
    setMatchOrderAnswers((prev) => ({ ...prev, [step]: pairs }))
    setSelected("__order_done__")
    if (isOrder(currentActivity)) {
      const allCorrect = Object.entries(currentActivity.correctPairs).every(([k, v]) => pairs[k] === v)
      if (allCorrect) playCorrectSound()
    }
  }

  function handleEssayAnswer(text: string) {
    if (answered || !currentActivity) return
    setAnswers((prev) => ({ ...prev, [currentActivity.id]: text }))
    setSelected("__essay_done__")
  }

  function next() {
    setSelected(null);
    setStep((s) => s + 1);
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      if (!dataUrl) return;
      try {
        localStorage.setItem(proofKey(track, module), dataUrl);
      } catch {
        // quota full: keep in memory only
      }
      setProofDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function clearProof() {
    try {
      localStorage.removeItem(proofKey(track, module));
    } catch {
      // ignore
    }
    setProofDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const progress = Math.round(((step + (answered ? 1 : 0)) / ACTIVITIES.length) * 100);

  const perfect = finished && score === scorableActivities.length;
  const needsProof = !!proofTask;
  const proofDone = !!proofDataUrl;
  const lessonComplete = perfect && (!needsProof || proofDone);
  const isLastLesson = module === TRACK_TOTALS[track] - 1;
  const showsCompletionScreen = finished && (!needsProof || proofDone);

  useEffect(() => {
    if (!showsCompletionScreen || completionSoundPlayedRef.current) return;
    completionSoundPlayedRef.current = true;
    playLessonCompleteSound();
  }, [showsCompletionScreen]);

  useEffect(() => {
    if (!lessonComplete || rewardGrantedRef.current) return;
    rewardGrantedRef.current = true;
    advanceModule(TRACK_TOTALS[track], track);
    completeMission("lesson");
    // Save XP and gems earned in this lesson
    let leveledUp: { newLevel: number; prevLevel: number } | null = null;
    if (user?.id) {
      const earned = scoreRef.current;
      const xpGain = earned * 25;
      const gemGain = earned * 3;
      const xpResult = awardXP(user.id, xpGain);
      if (xpResult.leveledUp) {
        leveledUp = { newLevel: xpResult.newLevel, prevLevel: xpResult.prevLevel };
      }
      saveLocalGems(user.id, getLocalGems(user.id) + gemGain);
      window.dispatchEvent(new Event(GEMS_UPDATE_EVENT));
    }
    // Check achievements (lessonComplete implies perfect == true)
    checkLessonComplete(true);
    // Award a bonus life for perfect completion
    awardPerfectBonus();

    // Finishing the last lesson of a track completes the whole trail —
    // celebrate that first, then hand off to the level-up screen if the
    // same lesson also crossed a level threshold.
    if (isLastLesson) {
      pendingLevelUpRef.current = leveledUp;
      setTrailCelebration({ trackLabel: track.toUpperCase() });
    } else if (leveledUp) {
      const t = setTimeout(() => navigate("/level-up", { state: leveledUp }), 1200);
      return () => clearTimeout(t);
    }
  }, [lessonComplete, track]);

  if (finished && needsProof && !proofDone) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-stroke-muted bg-card px-4 py-3">
          <Link to="/learn" className="rounded-full p-1.5 text-forest hover:bg-surface-success">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-bold text-primary-dark">Tarefa prática</h1>
        </div>

        <div className="flex flex-1 flex-col px-5 py-6">
          <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-luxury/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-luxury">
            <Camera className="h-3.5 w-3.5" /> Enviar comprovação
          </div>

          <h2 className="text-xl font-extrabold text-foreground-dark">{proofTask!.title}</h2>
          <p className="mt-2 text-sm text-foreground-secondary">{proofTask!.description}</p>

          <div className="mt-4 rounded-2xl border border-stroke-muted bg-surface-soft p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-tertiary">
              Exemplos válidos
            </p>
            <ul className="mt-1.5 space-y-1 text-xs text-foreground-secondary">
              {proofTask!.examples.map((ex) => (
                <li key={ex} className="flex items-start gap-1.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald" />
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          <label
            htmlFor="proof-file"
            className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stroke-light bg-card px-4 py-10 text-center transition-colors hover:border-emerald hover:bg-surface-success/40"
          >
            <Upload className="h-8 w-8 text-emerald" />
            <p className="text-sm font-bold text-foreground-dark">Toque para enviar um print</p>
            <p className="text-[11px] text-foreground-tertiary">PNG ou JPG · da galeria ou câmera</p>
          </label>
          <input
            id="proof-file"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <ImageIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              O print fica salvo só no seu dispositivo. Ele serve para você validar sua prática —
              o módulo só é concluído após o envio.
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <TrailCompleteCelebration
          active={!!trailCelebration}
          trackLabel={trailCelebration?.trackLabel ?? track.toUpperCase()}
          onClose={() => {
            setTrailCelebration(null);
            const pending = pendingLevelUpRef.current;
            pendingLevelUpRef.current = null;
            if (pending) navigate("/level-up", { state: pending });
          }}
        />
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-stroke-muted bg-card px-4 py-3">
          <Link to="/learn" className="rounded-full p-1.5 text-forest hover:bg-surface-success">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-bold text-primary-dark">Lição concluída</h1>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald/15">
            <CheckCircle2 className="h-10 w-10 text-emerald" strokeWidth={2.5} />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-foreground-dark">
            {perfect ? "Perfeito!" : "Boa tentativa!"}
          </h2>
          <p className="mt-1 text-sm text-foreground-tertiary">
            Você acertou {score} de {scorableActivities.length} atividades
          </p>
          {perfect && (
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald/15 px-3 py-1 text-xs font-bold text-emerald">
              <CheckCircle2 className="h-3.5 w-3.5" /> Próximo módulo desbloqueado!
            </p>
          )}

          {needsProof && proofDataUrl && (
            <div className="mt-5 w-full max-w-xs">
              <p className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald/15 px-3 py-1 text-[11px] font-bold text-emerald">
                <Camera className="h-3 w-3" /> Comprovação enviada
              </p>
              <img
                src={proofDataUrl}
                alt="Print enviado"
                className="w-full rounded-xl border border-stroke-muted object-cover"
              />
              <button
                type="button"
                onClick={clearProof}
                className="mt-2 text-[11px] font-bold text-foreground-tertiary underline"
              >
                Enviar outro print
              </button>
            </div>
          )}

          <div className="mt-5 grid w-full max-w-xs grid-cols-2 gap-3">
            <div className="rounded-xl border border-stroke-muted bg-surface-soft py-3 text-center">
              <p className="text-[10px] font-semibold text-foreground-tertiary">XP</p>
              <p className="text-base font-extrabold text-emerald">+{score * 25}</p>
            </div>
            <div className="rounded-xl border border-stroke-muted bg-surface-soft py-3 text-center">
              <p className="text-[10px] font-semibold text-foreground-tertiary">Gemas</p>
              <p className="text-base font-extrabold text-luxury">+{score * 3}</p>
            </div>
          </div>

          <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
            {perfect && (
              isLastLesson ? (
                <Link
                  to="/module-exam"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-luxury py-4 text-sm font-extrabold uppercase tracking-wide text-luxury-foreground shadow-lg shadow-luxury/30 transition-transform active:scale-[0.98]"
                >
                  Fazer prova final do módulo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  to={`/lesson?track=${track}&module=${module + 1}`}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-emerald/30 transition-transform active:scale-[0.98]"
                >
                  Próxima aula
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )
            )}
            <Link
              to="/learn"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-emerald bg-card py-3 text-sm font-bold text-emerald hover:bg-surface-success"
            >
              Voltar à trilha
            </Link>
            <button
              onClick={() => {
                setStep(0);
                setSelected(null);
                setAnswers({});
              }}
              className="rounded-2xl border-2 border-stroke-light bg-card py-3 text-sm font-bold text-foreground-dark transition-colors hover:bg-surface-soft"
            >
              Refazer lição
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-stroke-muted bg-card px-4 py-3">
        <Link to="/learn" className="rounded-full p-1.5 text-forest hover:bg-surface-success">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-stroke-muted/40">
          <div
            className="h-full rounded-full bg-emerald transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-sm font-bold text-red-500 dark:bg-red-950/40 dark:text-red-300">
          <Heart className="h-3.5 w-3.5 fill-red-500" /> <span>{lives}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 py-6">
        <ActivityRenderer
          activity={currentActivity!}
          selected={selected}
          answered={answered}
          step={step}
          total={ACTIVITIES.length}
          onSelect={pick}
          onMatchAnswer={handleMatchAnswer}
          onOrderAnswer={handleOrderAnswer}
          onEssayAnswer={handleEssayAnswer}
        />

        <div className="mt-auto pt-6">
          {answered ? (
            <button
              onClick={next}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald py-4 text-sm font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-emerald-dark"
            >
              {isLast ? "Ver resultado" : isCurrentSlide ? "Continuar" : "Próxima atividade"}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-stroke-light py-4 text-sm font-extrabold uppercase tracking-wide text-neutral pointer-events-none">
              {isCurrentEssay
                ? "Escreva sua resposta para continuar"
                : isMatch(currentActivity!) || isOrder(currentActivity!)
                ? "Conecte todos os itens para continuar"
                : "Selecione uma opção"}
              <Send className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
