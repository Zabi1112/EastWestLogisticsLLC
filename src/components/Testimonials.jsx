import './Testimonials.css'

const TESTIMONIALS = [
  {
    quote:
      "Since switching to East West Logistics, I'm running fewer empty miles and my average rate per mile went up noticeably. My dispatcher actually picks up the phone.",
    name: 'Marcus T.',
    role: 'Owner-Operator, Dry Van',
  },
  {
    quote:
      "I manage a 4-truck fleet and used to spend half my day on the phone with brokers. Now the dispatch team handles it and I get a clean weekly summary. Huge time saver.",
    name: 'Elena R.',
    role: 'Fleet Owner, Reefer',
  },
  {
    quote:
      'No pressure, no hidden fees, and they actually negotiate. First dispatch service that has felt like a real partner instead of a middleman.',
    name: 'Devon W.',
    role: 'Owner-Operator, Flatbed',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="section testimonials">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Trusted By Drivers</span>
          <h2>What Our Carriers Say</h2>
          <p>
            We measure success by the businesses we help grow. Here's what
            owner-operators and fleet owners have to say about working with us.
          </p>
        </div>

        <div className="testimonials__grid">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="testimonials__card">
              <QuoteIcon />
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <div className="testimonials__avatar">{t.name.charAt(0)}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function QuoteIcon() {
  return (
    <svg width="34" height="26" viewBox="0 0 34 26" fill="none">
      <path
        d="M14.5 0v10.4c0 8.9-4.6 13.7-12.7 15.6L0 22.4C4.7 21 6.9 18 7.1 13.9H0V0h14.5zm19.5 0v10.4c0 8.9-4.6 13.7-12.7 15.6l-1.8-3.6C24.2 21 26.4 18 26.6 13.9h-7.1V0H34z"
        fill="var(--orange-100)"
      />
    </svg>
  )
}
