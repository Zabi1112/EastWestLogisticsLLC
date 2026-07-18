import './Footer.css'

const YEAR = new Date().getFullYear()

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#carriers', label: 'For Carriers' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
]

const SERVICE_LINKS = [
  'Load Booking & Sourcing',
  'Rate Negotiation',
  'Paperwork & Invoicing',
  'Route Planning',
  '24/7 Dispatch Support',
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#home" className="footer__logo">
            <span className="footer__logo-badge">
              <img src="/logo.png" alt="East West Logistics LLC" />
            </span>
          </a>
          <p>
            Full-service truck dispatching for owner-operators and small
            fleets. We find the loads, negotiate the rates, and handle the
            paperwork.
          </p>
          <div className="footer__socials">
            <a href="#" aria-label="Facebook"><FacebookIcon /></a>
            <a href="#" aria-label="Instagram"><InstagramIcon /></a>
            <a href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Navigate</h4>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}><a href={link.href}>{link.label}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Services</h4>
          <ul>
            {SERVICE_LINKS.map((label) => (
              <li key={label}><a href="#services">{label}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Contact</h4>
          <ul className="footer__contact">
            <li>(409) 248-2002</li>
            <li>truckingservice48@gmail.com</li>
            <li>5 Hillcrest Dr<br />Downingtown, PA 19335</li>
            <li>MC #000000 &middot; DOT #0000000</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>&copy; {YEAR} East West Logistics LLC. All rights reserved.</span>
          <div className="footer__legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M15 8.5h2.5V5h-2.7C12 5 11 6.6 11 9v2H9v3.5h2V21h3.5v-6.5h2.4l.6-3.5h-3V9c0-.6.3-1 1.5-1z" fill="currentColor" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.5 10v7M7.5 7.2v.1M11.5 17v-4.5c0-1.4 1-2.3 2.3-2.3 1.3 0 2.2.9 2.2 2.3V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
