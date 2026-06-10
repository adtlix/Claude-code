'use client'

import { useRef, useEffect, useState } from 'react'
import { PenLine, Sliders, Sparkles, Share2 } from 'lucide-react'

const steps = [
  { icon: PenLine, step: '01', title: 'Describe your vision', description: 'Write a prompt describing your video — the scene, mood, style, and motion you want to see.' },
  { icon: Sliders, step: '02', title: 'Choose your style', description: 'Pick from dozens of cinematic styles, aspect ratios, and duration settings.' },
  { icon: Sparkles, step: '03', title: 'AI generates your video', description: 'Our AI processes your request in seconds, creating a professional-quality video.' },
  { icon: Share2, step: '04', title: 'Export & share', description: 'Download in 4K or share directly to social media, right from your dashboard.' },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" ref={sectionRef} className="py-32 px-6 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-20 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block bg-teal-600/10 border border-teal-500/20 rounded-full px-4 py-1.5 text-teal-400 text-sm font-medium mb-6">
            Simple process
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            From idea to video
            <br />
            <span className="text-gradient">in 4 steps</span>
          </h2>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.step}
                className={`relative text-center transition-all duration-700 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto">
                    <step.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
