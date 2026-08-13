import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { SOUND_KEY, isSoundEnabled } from "./sound"

function mockAudioContext() {
  const oscillators: Array<{ start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn> }> = []
  class FakeAudioContext {
    state = "running"
    currentTime = 0
    destination = {}
    createOscillator() {
      const osc = {
        type: "sine",
        frequency: { value: 0 },
        start: vi.fn(),
        stop: vi.fn(),
        connect: vi.fn(),
      }
      oscillators.push(osc)
      return osc
    }
    createGain() {
      return {
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      }
    }
    resume() {
      return Promise.resolve()
    }
  }
  ;(window as unknown as { AudioContext: typeof FakeAudioContext }).AudioContext = FakeAudioContext
  return oscillators
}

describe("sound", () => {
  const originalAudioContext = window.AudioContext

  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  afterEach(() => {
    ;(window as unknown as { AudioContext?: typeof AudioContext }).AudioContext =
      originalAudioContext
  })

  it("is enabled by default", () => {
    expect(isSoundEnabled()).toBe(true)
  })

  it("is disabled when the sound setting is turned off", () => {
    localStorage.setItem(SOUND_KEY, "false")
    expect(isSoundEnabled()).toBe(false)
  })

  it("does not create any oscillator when sound is disabled", async () => {
    const oscillators = mockAudioContext()
    localStorage.setItem(SOUND_KEY, "false")
    const { playCorrectSound } = await import("./sound")
    playCorrectSound()
    expect(oscillators.length).toBe(0)
  })

  it("plays tones for the correct-answer sound when enabled", async () => {
    const oscillators = mockAudioContext()
    const { playCorrectSound } = await import("./sound")
    playCorrectSound()
    expect(oscillators.length).toBeGreaterThan(0)
    oscillators.forEach((osc) => {
      expect(osc.start).toHaveBeenCalled()
      expect(osc.stop).toHaveBeenCalled()
    })
  })

  it("plays a longer sequence of tones for the lesson-complete sound", async () => {
    const oscillators = mockAudioContext()
    const { playLessonCompleteSound } = await import("./sound")
    playLessonCompleteSound()
    expect(oscillators.length).toBeGreaterThan(1)
  })
})
