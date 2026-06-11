const COLS = [
  { title: 'Product', links: ['Aurora Series 01', 'Bands', 'Magnetic dock', 'Compare'] },
  { title: 'Company', links: ['About', 'Sustainability', 'Press', 'Careers'] },
  { title: 'Support', links: ['Help center', 'Warranty', 'Shipping', 'Contact'] },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a className="nav__brand" href="#top">
            <span className="nav__mark" />
            Aurora
          </a>
          <p>Precision wearable technology, engineered in Zürich.</p>
        </div>

        <div className="footer__cols">
          {COLS.map((c) => (
            <div className="footer__col" key={c.title}>
              <h4>{c.title}</h4>
              {c.links.map((l) => (
                <a key={l} href="#cta">
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="container footer__bar">
        <span>© {new Date().getFullYear()} Aurora Instruments AG</span>
        <div className="footer__legal">
          <a href="#cta">Privacy</a>
          <a href="#cta">Terms</a>
          <a href="#cta">Cookies</a>
        </div>
      </div>
    </footer>
  )
}
