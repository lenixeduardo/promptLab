import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { MascotGlow } from "@/components/MascotGlow"

interface WelcomeBackScreenProps {
  active: boolean
  name?: string
  onClose: () => void
}

/**
 * Full-screen greeting shown when a user returns after 2+ days away.
 * Mirrors the dark, mascot-centered layout used on Login/Signup.
 */
export function WelcomeBackScreen({ active, name, onClose }: WelcomeBackScreenProps) {
  const [show, setShow] = useState(active)

  useEffect(() => {
    if (active) setShow(true)
  }, [active])

  if (!show) return null

  const close = () => {
    setShow(false)
    onClose()
  }

  const greeting = name ? `É você, ${name}?! Que alegria!` : "Que alegria ter você de volta!"

  return (
    <div className="dark fixed inset-0 z-[70] flex flex-col items-center justify-center bg-gradient-to-b from-pageBgLight via-gradient-mid to-gradient-end px-6 py-10 text-foreground animate-fade-in">
      <div className="flex w-full max-w-[420px] flex-1 flex-col items-center justify-center text-center">
        <MascotGlow size={220}>
          <img
            src="/assets/mascot-welcome-back.png"
            alt="Mascote PromptLabz acenando"
            className="h-48 w-auto object-contain drop-shadow-md"
          />
        </MascotGlow>

        <h1 className="mt-6 animate-scale-in text-2xl font-extrabold text-foreground-dark">
          {greeting}
        </h1>
      </div>

      <Button variant="primary" size="lg" onClick={close} className="mb-4 w-full max-w-[420px]">
        É bom estar de volta!
      </Button>
    </div>
  )
}
