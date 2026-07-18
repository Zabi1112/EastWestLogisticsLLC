import './Hero.css'

const STATS = [
  { value: '250+', label: 'Loads Dispatched Monthly' },
  { value: '48', label: 'States Covered' },
  { value: '97%', label: 'On-Time Delivery' },
  { value: '24/7', label: 'Dispatch Support' },
]

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__route hero__route--1" />
        <div className="hero__route hero__route--2" />
        <div className="hero__glow" />
      </div>

      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="tag-pill">Licensed &amp; Insured Dispatch Service</span>
          <h1>
            We Keep Your Wheels Turning, <span>Coast to Coast.</span>
          </h1>
          <p>
            East West Logistics LLC is a full-service truck dispatching company. We
            find the loads, negotiate the rates, and handle the paperwork — so you
            can stay focused on the road and grow your business.
          </p>

          <div className="hero__actions">
            <a href="#carriers" className="btn btn-primary">
              Join as a Carrier
            </a>
            <a href="#contact" className="btn btn-secondary hero__btn-dark">
              Talk to a Dispatcher
            </a>
          </div>

          <div className="hero__stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="hero__stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__art">
          <div className="hero__art-card">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="East West Logistics LLC" />
          </div>
          <div className="hero__badge hero__badge--top">
            <span>MC #000000</span>
            Verified Broker Network
          </div>
          <div className="hero__badge hero__badge--bottom">
            <span>Avg. Rate Increase</span>
            +18% per load
          </div>
        </div>
      </div>
    </section>
  )
}
