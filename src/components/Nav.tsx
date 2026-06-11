import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LINKS = [
  { label: 'Design', href: '#features' },
  { label: 'Technology', href: '#specs' },
  { label: 'Gallery', href: '#showcase' },
  { label: 'Reviews', href: '#reviews' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container nav__inner">
        <a className="nav__brand" href="#top" aria-label="Aurora home">
          <span className="nav__mark" />
          Aurora
        </a>

        <nav className="nav__links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <a className="btn btn--ghost nav__cta" href="#cta">
          Pre-order
          <span className="btn__arrow">→</span>
        </a>
      </div>
    </motion.header>
  )
}
