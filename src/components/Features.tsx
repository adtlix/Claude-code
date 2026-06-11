import Reveal from './Reveal'

const FEATURES = [
  {
    k: '01',
    title: 'Monocoque titanium',
    body: 'A unibody shell milled from a single billet over 38 minutes — no seams, no glue, no compromise. 40% lighter than steel, twice as rigid.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 2 3 7v10l9 5 9-5V7z" />
        <path d="M3 7l9 5 9-5M12 12v10" />
      </svg>
    ),
  },
  {
    k: '02',
    title: 'Sapphire display',
    body: 'A lab-grown sapphire crystal at 9H hardness, anti-reflective on both faces, readable in full sun at 3,000 nits peak brightness.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M6 3h12l3 6-9 12L3 9z" />
        <path d="M3 9h18M9 3 6 9l6 12 6-12-3-6" />
      </svg>
    ),
  },
  {
    k: '03',
    title: 'Microsecond sensing',
    body: 'A 12-channel optical array samples 1,000× per second, fusing heart, motion and altitude data with an on-device neural core.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 12h4l2 6 4-14 2 8h6" />
      </svg>
    ),
  },
  {
    k: '04',
    title: 'Two-week endurance',
    body: 'A silicon-anode cell delivers 14 days on a charge and a full top-up in 22 minutes over the magnetic dock. Charge once a fortnight.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="2" y="7" width="16" height="10" rx="2" />
        <path d="M22 10v4M6 12h6" />
      </svg>
    ),
  },
]

export default function Features() {
  return (
    <section className="section features" id="features">
      <div className="container">
        <div className="section__head">
          <Reveal>
            <span className="eyebrow">The details</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="section__title">
              Obsessed over so you<br />never have to think about it.
            </h2>
          </Reveal>
        </div>

        <div className="features__grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.k} delay={i * 0.08} className="feature">
              <div className="feature__icon">{f.icon}</div>
              <span className="feature__k">{f.k}</span>
              <h3 className="feature__title">{f.title}</h3>
              <p className="feature__body">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
