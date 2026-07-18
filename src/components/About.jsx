import './About.css'

const POINTS = [
  {
    title: 'Owner-Operator Focused',
    text: "We work exclusively in your interest — no games between you and the broker's dispatcher.",
  },
  {
    title: 'Real Rate Negotiation',
    text: 'Every load is negotiated to the top of the market before you ever see it.',
  },
  {
    title: 'Transparent Reporting',
    text: 'Weekly settlement summaries and a live view of every load in progress.',
  },
  {
    title: 'No Long-Term Contracts',
    text: 'Month-to-month service. We keep your business by earning it, not locking you in.',
  },
]

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container about__inner">
        <div className="about__art">
          <div className="about__art-frame">
            <img src="/logo.png" alt="East West Logistics LLC truck icon" />
          </div>
          <div className="about__art-stat">
            <strong>7+ Years</strong>
            <span>Dispatching Experience</span>
          </div>
        </div>

        <div className="about__copy">
          <span className="eyebrow">Who We Are</span>
          <h2>Your Dedicated Dispatch Team, Not Just a Service.</h2>
          <p>
            East West Logistics LLC was built by people who understand the truck
            dispatching business inside and out. We handle load searching, rate
            negotiation, paperwork, and broker communication for owner-operators
            and small fleets across the country — so drivers can spend less time
            on the phone and more time behind the wheel.
          </p>
          <p>
            Whether you run a single truck or manage a growing fleet, our team
            plugs in as an extension of your business, matching you with quality
            freight and keeping your trucks loaded, mile after mile.
          </p>

          <ul className="about__points">
            {POINTS.map((point) => (
              <li key={point.title}>
                <CheckIcon />
                <div>
                  <strong>{point.title}</strong>
                  <p>{point.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="var(--orange-100)" />
      <path d="M7 12.5l3 3 7-7" stroke="var(--orange-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
