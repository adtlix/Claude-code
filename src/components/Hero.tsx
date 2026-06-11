import { ReactNode } from 'react'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

function Word({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="hero__word">
      <motion.span
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease, delay }}
        style={{ display: 'inline-block' }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export default function Hero({ scene }: { scene: ReactNode }) {
  return (
    <section className="hero" id="top">
      <div className="hero__canvas">{scene}</div>
      <div className="hero__glow" />

      <div className="container hero__inner">
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          Introducing Aurora · Series 01
        </motion.span>

        <h1 className="hero__title">
          <Word delay={0.18}>Precision,</Word>{' '}
          <Word delay={0.28}>
            <span className="gradient-text">reimagined.</span>
          </Word>
        </h1>

        <motion.p
          className="hero__sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.5 }}
        >
          Machined from a single block of aerospace-grade titanium, Aurora pairs a
          sapphire-glass display with a sensor array accurate to the microsecond.
          Engineering you can feel in the hand.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.62 }}
        >
          <a className="btn btn--primary" href="#cta">
            Reserve yours
            <span className="btn__arrow">→</span>
          </a>
          <a className="btn btn--ghost" href="#features">
            Explore the design
          </a>
        </motion.div>

        <motion.div
          className="hero__stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease, delay: 0.85 }}
        >
          <div>
            <strong>0.1ms</strong>
            <span>Sensor latency</span>
          </div>
          <div>
            <strong>14 days</strong>
            <span>Battery life</span>
          </div>
          <div>
            <strong>100m</strong>
            <span>Water resistance</span>
          </div>
        </motion.div>
      </div>

      <div className="hero__scroll">
        <span>Scroll</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  )
}
