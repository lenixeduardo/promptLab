import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  life: number
  decay: number
  rotation: number
  rotationSpeed: number
  type: "circle" | "square" | "star"
}

const COLORS = [
  "#22C55E", // emerald
  "#15803D", // forest
  "#D97706", // luxury/gold
  "#FBBF24", // gold light
  "#3B82F6", // blue
  "#EF4444", // red
  "#F5A623", // accent
  "#A855F7", // purple
]

export function CelebrationCanvas({
  active,
  duration = 3000,
}: {
  active: boolean
  duration?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const activeRef = useRef(false)

  const spawnParticles = useCallback((count = 80) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = canvas.width
    const h = canvas.height
    const centerX = w / 2
    const centerY = h / 2

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 6
      const type = (["circle", "square", "star"] as const)[Math.floor(Math.random() * 3)]
      particlesRef.current.push({
        x: centerX + (Math.random() - 0.5) * 60,
        y: centerY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 4 + Math.random() * 8,
        life: 1,
        decay: 0.005 + Math.random() * 0.01,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        type,
      })
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
    resize()
    window.addEventListener("resize", resize)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    function drawStar(
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) {
      let rot = (Math.PI / 2) * 3
      let x = cx
      let y = cy
      const step = Math.PI / spikes

      ctx!.beginPath()
      ctx!.moveTo(cx, cy - outerRadius)
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius
        y = cy + Math.sin(rot) * outerRadius
        ctx!.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius
        y = cy + Math.sin(rot) * innerRadius
        ctx!.lineTo(x, y)
        rot += step
      }
      ctx!.lineTo(cx, cy - outerRadius)
      ctx!.closePath()
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.15 // gravity
        p.life -= p.decay
        p.rotation += p.rotationSpeed
        p.vx *= 0.98 // air resistance

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color

        if (p.type === "circle") {
          ctx.beginPath()
          ctx.arc(0, 0, p.size * p.life, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.type === "square") {
          ctx.fillRect(
            (-p.size * p.life) / 2,
            (-p.size * p.life) / 2,
            p.size * p.life,
            p.size * p.life
          )
        } else {
          drawStar(0, 0, 5, p.size * p.life, p.size * p.life * 0.4)
          ctx.fill()
        }

        ctx.restore()
      }

      if (activeRef.current || particles.length > 0) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    if (active) {
      activeRef.current = true
      spawnParticles(120)
      const interval = setInterval(() => {
        if (activeRef.current) spawnParticles(40)
      }, 400)
      const raf = requestAnimationFrame(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        // trigger animation loop
        function loop() {
          if (!ctx || !canvas) return
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          const particles = particlesRef.current
          for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i]
            p.x += p.vx
            p.y += p.vy
            p.vy += 0.15
            p.life -= p.decay
            p.rotation += p.rotationSpeed
            p.vx *= 0.98
            if (p.life <= 0) {
              particles.splice(i, 1)
              continue
            }
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(p.rotation)
            ctx.globalAlpha = p.life
            ctx.fillStyle = p.color
            if (p.type === "circle") {
              ctx.beginPath()
              ctx.arc(0, 0, p.size * p.life, 0, Math.PI * 2)
              ctx.fill()
            } else if (p.type === "square") {
              ctx.fillRect(
                (-p.size * p.life) / 2,
                (-p.size * p.life) / 2,
                p.size * p.life,
                p.size * p.life
              )
            } else {
              const drawStar = (
                cx: number,
                cy: number,
                spikes: number,
                outer: number,
                inner: number
              ) => {
                let rot = (Math.PI / 2) * 3
                let x = cx,
                  y = cy
                const step = Math.PI / spikes
                ctx!.beginPath()
                ctx!.moveTo(cx, cy - outer)
                for (let j = 0; j < spikes; j++) {
                  x = cx + Math.cos(rot) * outer
                  y = cy + Math.sin(rot) * outer
                  ctx!.lineTo(x, y)
                  rot += step
                  x = cx + Math.cos(rot) * inner
                  y = cy + Math.sin(rot) * inner
                  ctx!.lineTo(x, y)
                  rot += step
                }
                ctx!.lineTo(cx, cy - outer)
                ctx!.closePath()
              }
              drawStar(0, 0, 5, p.size * p.life, p.size * p.life * 0.4)
              ctx.fill()
            }
            ctx.restore()
          }
          if (activeRef.current || particles.length > 0) {
            requestAnimationFrame(loop)
          }
        }
        requestAnimationFrame(loop)
      })

      const timeout = setTimeout(() => {
        activeRef.current = false
      }, duration)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
        cancelAnimationFrame(raf)
        activeRef.current = false
      }
    }
  }, [active, duration, spawnParticles])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ width: "100%", height: "100%" }}
    />
  )
}
