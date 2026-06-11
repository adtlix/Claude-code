const ITEMS = ['WIRED', 'The Verge', 'Hodinkee', 'Monocle', 'GQ', 'Bloomberg', 'Wallpaper*']

export default function Marquee() {
  return (
    <section className="marquee" aria-label="As featured in">
      <div className="marquee__track">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span className="marquee__item" key={i}>
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}
