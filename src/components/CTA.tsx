import Reveal from './Reveal'

export default function CTA() {
  return (
    <section className="section cta" id="cta">
      <div className="container">
        <Reveal className="cta__card">
          <div className="cta__glow" />
          <span className="eyebrow">Series 01 · Limited release</span>
          <h2 className="cta__title">
            Reserve your Aurora<br />before the first run sells out.
          </h2>
          <p className="cta__sub">
            $40 deposit, fully refundable. Ships spring 2026 with free worldwide
            delivery and complimentary engraving.
          </p>

          <form
            className="cta__form"
            onSubmit={(e) => {
              e.preventDefault()
              const btn = e.currentTarget.querySelector('button')
              if (btn) btn.textContent = 'Reserved ✓'
            }}
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              aria-label="Email address"
            />
            <button className="btn btn--primary" type="submit">
              Reserve now
              <span className="btn__arrow">→</span>
            </button>
          </form>

          <span className="cta__fine">
            From $599 · 0% financing available · 30-day returns
          </span>
        </Reveal>
      </div>
    </section>
  )
}
