import Reveal from './Reveal'

const REVIEWS = [
  {
    quote:
      'The most resolved piece of wearable hardware I have handled this decade. It feels like a tool that will outlive its owner.',
    name: 'Marisa Cole',
    role: 'Senior Editor, Hodinkee',
  },
  {
    quote:
      'Aurora does the rare thing of disappearing on the wrist while quietly being more accurate than anything in its class.',
    name: 'Dev Anand',
    role: 'Reviews, The Verge',
  },
  {
    quote:
      'A genuine flagship. The titanium finish and the sapphire dome put it in a category most brands never reach.',
    name: 'Lena Forsberg',
    role: 'Design Director, Wallpaper*',
  },
]

export default function Showcase() {
  return (
    <>
      <section className="section showcase" id="showcase">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Gallery</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="section__title">Designed to be looked at.</h2>
          </Reveal>

          <div className="showcase__grid">
            <Reveal className="shot shot--tall" delay={0.05}>
              <div className="shot__inner shot__a">
                <span className="shot__tag">Titanium · Graphite</span>
              </div>
            </Reveal>
            <Reveal className="shot" delay={0.1}>
              <div className="shot__inner shot__b">
                <span className="shot__tag">Sapphire dome</span>
              </div>
            </Reveal>
            <Reveal className="shot" delay={0.15}>
              <div className="shot__inner shot__c">
                <span className="shot__tag">Aurora · Aqua</span>
              </div>
            </Reveal>
            <Reveal className="shot shot--wide" delay={0.2}>
              <div className="shot__inner shot__d">
                <span className="shot__tag">Magnetic dock</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section reviews" id="reviews">
        <div className="container">
          <Reveal>
            <span className="eyebrow">The reception</span>
          </Reveal>
          <div className="reviews__grid">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.1} className="review">
                <p className="review__quote">“{r.quote}”</p>
                <div className="review__by">
                  <strong>{r.name}</strong>
                  <span>{r.role}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
