'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-xl">Higgsfield</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-white/70 text-sm">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="hidden md:block">
          <Button size="sm" onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}>
            Get Early Access
          </Button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 px-6 py-6 flex flex-col gap-4">
          {['features', 'showcase', 'how-it-works', 'pricing'].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-white/70 hover:text-white capitalize transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {id.replace('-', ' ')}
            </a>
          ))}
          <Button size="sm" className="w-full mt-2" onClick={() => { setMenuOpen(false); document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }) }}>
            Get Early Access
          </Button>
        </div>
      )}
    </nav>
  )
}
