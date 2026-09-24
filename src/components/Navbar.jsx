import { useEffect, useState } from 'react'
import './Navbar.css'

const LINKS = [
  { href: `${import.meta.env.BASE_URL}available-trucks/`, label: 'Available Trucks' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#our-carriers', label: 'Our Carriers' },
  { href: '#carriers', label: 'For Carriers' },
  { href: '#sms-signup', label: 'SMS Sign-Up' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = () => setOpen(false)

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a href="#home" className="navbar__brand" onClick={handleNavClick}>
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="East West Logistics LLC" />
          <span className="navbar__brand-text">
            <strong>East West</strong>
            <em>Logistics LLC</em>
          </span>
        </a>

        <nav className={`navbar__links ${open ? 'is-open' : ''}`}>
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={handleNavClick}>
              {link.label}
            </a>
          ))}
          <a href="tel:+14092482002" className="navbar__phone-mobile" onClick={handleNavClick}>
            (409) 248-2002
          </a>
        </nav>

        <div className="navbar__actions">
          <a href="tel:+14092482002" className="navbar__phone">
            <PhoneIcon />
            (409) 248-2002
          </a>
          <a href="#carriers" className="btn btn-primary navbar__cta">
            Get a Free Quote
          </a>
        </div>

        <button
          className={`navbar__toggle ${open ? 'is-open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"
        fill="currentColor"
      />
    </svg>
  )
}
