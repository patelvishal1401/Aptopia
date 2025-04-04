"use client"

import { useEffect, useRef } from "react"

export default function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
        this.color = `hsl(${Math.random() * 60 + 210}, 70%, 60%)`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.size > 0.2) this.size -= 0.05
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Token class
    class Token {
      x: number
      y: number
      size: number
      text: string
      color: string
      speedX: number
      speedY: number
      angle: number
      rotationSpeed: number

      constructor() {
        const rect = canvas.getBoundingClientRect()
        this.x = Math.random() * rect.width
        this.y = Math.random() * rect.height
        this.size = Math.random() * 20 + 20
        this.text = ["$", "₿", "Ξ", "Ł", "Ð"][Math.floor(Math.random() * 5)]
        this.color = `hsl(${Math.random() * 60 + 210}, 70%, 60%)`
        this.speedX = (Math.random() - 0.5) * 2
        this.speedY = (Math.random() - 0.5) * 2
        this.angle = 0
        this.rotationSpeed = (Math.random() - 0.5) * 0.02
      }

      update() {
        const rect = canvas.getBoundingClientRect()
        this.x += this.speedX
        this.y += this.speedY
        this.angle += this.rotationSpeed

        // Bounce off edges
        if (this.x <= this.size || this.x >= rect.width - this.size) {
          this.speedX *= -1
        }
        if (this.y <= this.size || this.y >= rect.height - this.size) {
          this.speedY *= -1
        }
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.font = `${this.size}px Arial`
        ctx.fillStyle = this.color
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(this.text, 0, 0)
        ctx.restore()
      }
    }

    // Initialize particles and tokens
    const particles: Particle[] = []
    const tokens: Token[] = []
    const particleCount = 50
    const tokenCount = 5

    for (let i = 0; i < tokenCount; i++) {
      tokens.push(new Token())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw tokens
      tokens.forEach((token) => {
        token.update()
        token.draw()

        // Create particles at token positions
        if (Math.random() < 0.2) {
          particles.push(new Particle(token.x, token.y))
        }
      })

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()

        // Remove small particles
        if (particles[i].size <= 0.2) {
          particles.splice(i, 1)
          i--
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="relative w-full h-[400px] md:h-[500px]">
      <canvas ref={canvasRef} className="w-full h-full rounded-lg" style={{ background: "transparent" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  )
}

