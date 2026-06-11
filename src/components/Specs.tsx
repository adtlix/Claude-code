import Reveal from './Reveal'

const SPECS = [
  ['Case', 'Grade-5 titanium · 41mm'],
  ['Crystal', 'Sapphire · 9H · AR-coated'],
  ['Display', '480×480 LTPO · 3,000 nits'],
  ['Sensors', '12-channel optical array'],
  ['Battery', '14 days · 22-min fast charge'],
  ['Water', '10 ATM · MIL-STD-810H'],
  ['Connectivity', 'UWB · BT 5.4 · LTE'],
  ['Weight', '34 grams with band'],
]

export default function Specs() {
  return (
    <section className="section specs" id="specs">
      <div className="container specs__inner">
        <div className="specs__left">
          <Reveal>
            <span className="eyebrow">Technology</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="section__title">
              Every figure here<br />took a year to earn.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="specs__lead">
              Aurora is built around a custom silicon core and a thermally bonded
              sensor stack. The result is a wearable that measures more, more
              accurately, while sipping power.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="specs__badges">
              <span>Carbon-neutral build</span>
              <span>2-year warranty</span>
              <span>Free engraving</span>
            </div>
          </Reveal>
        </div>

        <div className="specs__right">
          {SPECS.map(([k, v], i) => (
            <Reveal key={k} delay={i * 0.05} className="spec-row">
              <span className="spec-row__k">{k}</span>
              <span className="spec-row__v">{v}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
