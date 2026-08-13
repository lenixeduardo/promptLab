export const SOUND_KEY = "promptlabz:settings:sound"

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem(SOUND_KEY) !== "false"
  } catch {
    return true
  }
}

type ToneStep = { freq: number; start: number; duration: number; gain?: number }

let sharedContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!sharedContext) {
    sharedContext = new Ctor()
  }
  if (sharedContext.state === "suspended") {
    void sharedContext.resume()
  }
  return sharedContext
}

function playTones(steps: ToneStep[]) {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  for (const { freq, start, duration, gain = 0.2 } of steps) {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.type = "sine"
    oscillator.frequency.value = freq
    const startTime = now + start
    const endTime = startTime + duration

    gainNode.gain.setValueAtTime(0, startTime)
    gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.01)
    gainNode.gain.linearRampToValueAtTime(0, endTime)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.start(startTime)
    oscillator.stop(endTime)
  }
}

/** Curta e ascendente — feedback ao acertar uma questão. */
export function playCorrectSound() {
  playTones([
    { freq: 660, start: 0, duration: 0.1 },
    { freq: 880, start: 0.09, duration: 0.15 },
  ])
}

/** Fanfarra curta — feedback ao concluir uma aula. */
export function playLessonCompleteSound() {
  playTones([
    { freq: 523.25, start: 0, duration: 0.12 },
    { freq: 659.25, start: 0.11, duration: 0.12 },
    { freq: 783.99, start: 0.22, duration: 0.12 },
    { freq: 1046.5, start: 0.33, duration: 0.3, gain: 0.22 },
  ])
}
