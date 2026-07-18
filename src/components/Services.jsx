import './Services.css'

const SERVICES = [
  {
    title: 'Load Booking & Sourcing',
    text: 'We source and vet the best-paying loads from our broker and shipper network that match your lanes and equipment.',
    icon: BoxIcon,
  },
  {
    title: 'Rate Negotiation',
    text: 'Our dispatchers negotiate every rate confirmation to get you the highest possible payout per mile.',
    icon: HandshakeIcon,
  },
  {
    title: 'Paperwork & Invoicing',
    text: 'Rate confirmations, BOLs, and invoicing handled for you — accurate, organized, and submitted on time.',
    icon: DocIcon,
  },
  {
    title: 'Route Planning',
    text: 'Efficient routing that minimizes deadhead miles and keeps your truck moving toward the next paying load.',
    icon: RouteIcon,
  },
  {
    title: 'Broker & Shipper Relations',
    text: 'We manage communication with brokers and shippers directly, so problems get resolved before they cost you time.',
    icon: PhoneIcon,
  },
  {
    title: '24/7 Dispatch Support',
    text: 'Round-the-clock support means help is always a phone call away, wherever your route takes you.',
    icon: ClockIcon,
  },
]

export default function Services() {
  return (
    <section id="services" className="section services">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">What We Offer</span>
          <h2>Full-Service Truck Dispatching</h2>
          <p>
            From finding the load to getting you paid, we manage the details so
            you can focus on driving. Here's everything included in our
            dispatching service.
          </p>
        </div>

        <div className="services__grid">
          {SERVICES.map(({ title, text, icon: Icon }) => (
            <div key={title} className="services__card">
              <div className="services__icon">
                <Icon />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BoxIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M3 7l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3 7v10l9 4 9-4V7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 11v10" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function HandshakeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M2 12l4-4 4 3 3-3 4 4-3 3-4-3-4 4-4-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M13 8l3-3 4 4-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DocIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M6 2h9l5 5v15H6V2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M15 2v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 13h6M9 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function RouteIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="19" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6.8 7.6C10 11 8 13 12 14s2 5 5.4 5.6" stroke="currentColor" strokeWidth="1.8" strokeDasharray="2.4 2.4" strokeLinecap="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
