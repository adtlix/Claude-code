'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Play, ArrowDown } from 'lucide-react'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; vx: number; vy: number; r: number; color: string }[] = []
    const colors = ['rgba(124,58,237,', 'rgba(59,130,246,', 'rgba(167,139,250,', 'rgba(96,165,250,']

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let animId: number
    const draw = () => {
      ctx.fillStyle = 'rgba(10,10,15,0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + '0.8)'
        ctx.fill()
      })

      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(124,58,237,${(1 - dist / 120) * 0.3})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f]" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Now in early access — join 12,000+ creators
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
          Create cinematic
          <br />
          <span className="text-gradient">AI videos</span>
          <br />
          in seconds
        </h1>

        <p className="text-xl md:text-2xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
          Turn your ideas into stunning, professional-quality videos with the most advanced AI video generation platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-lg px-10"
          >
            Get Early Access — Free
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
            className="gap-2"
          >
            <Play className="w-5 h-5" />
            Watch Demo
          </Button>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-white/40 text-sm">
          {[['10M+', 'Videos Created'], ['99.9%', 'Uptime'], ['4K', 'Max Resolution']].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-white/80">{val}</div>
              <div>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 hover:text-white/60 transition-colors animate-bounce"
      >
        <ArrowDown className="w-6 h-6" />
      </button>
    </section>
  )
}
