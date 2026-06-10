'use client'

import { useEffect, useState, useRef } from 'react'
import WaitlistForm from '@/components/shared/WaitlistForm'

export default function Waitlist() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    fetch('/api/waitlist/count')
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {})
  }, [])

  return (
    <section id="waitlist" ref={sectionRef} className="py-40 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#150a2e] to-[#0a0a0f]" />
      <div className="orb w-[600px] h-[600px] bg-purple-600 top-[-100px] left-[-200px]" />
      <div className="orb w-[500px] h-[500px] bg-blue-600 bottom-[-100px] right-[-150px]" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {count !== null && count > 0 && (
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-white/70 text-sm mb-8 backdrop-blur-sm">
              <span className="flex -space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border-2 border-[#0a0a0f]" />
                ))}
              </span>
              <span className="text-purple-300 font-semibold">{count.toLocaleString()}</span> people already waiting
            </div>
          )}

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Be first to
            <br />
            <span className="text-gradient">experience it</span>
          </h2>
          <p className="text-xl text-white/50 mb-12 max-w-xl mx-auto">
            Join the waitlist and get exclusive early access before the public launch. No credit card required.
          </p>

          <div className="flex justify-center">
            <WaitlistForm />
          </div>

          <p className="text-white/30 text-sm mt-6">
            By joining you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  )
}
