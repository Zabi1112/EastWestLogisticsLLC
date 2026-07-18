import { useState } from 'react'
import { sendEmail } from '../lib/emailjs'
import './Contact.css'

const CONTACT_EMAIL = 'truckingservice48@gmail.com'

const CARDS = [
  {
    icon: PhoneCardIcon,
    title: 'Call Us',
    lines: ['(409) 248-2002', 'Mon - Fri, 8am - 6pm EST'],
  },
  {
    icon: MailCardIcon,
    title: 'Email Us',
    lines: [CONTACT_EMAIL, 'We reply within 24 hours'],
  },
  {
    icon: PinCardIcon,
    title: 'Office',
    lines: ['5 Hillcrest Dr', 'Downingtown, PA 19335'],
  },
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      await sendEmail({
        name: form.name,
        email: form.email,
        title: form.subject || 'New message from website',
        message: form.message,
      })
      setSent(true)
    } catch {
      setError('Something went wrong sending your message. Please try again or call us directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Get In Touch</span>
          <h2>Let's Talk About Your Freight</h2>
          <p>
            Questions about our dispatching service, rates, or how we work?
            Send us a message or give us a call — a real person picks up.
          </p>
        </div>

        <div className="contact__cards">
          {CARDS.map(({ icon: Icon, title, lines }) => (
            <div key={title} className="contact__card">
              <div className="contact__card-icon">
                <Icon />
              </div>
              <strong>{title}</strong>
              {lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          ))}
        </div>

        <div className="contact__form-wrap">
          {sent ? (
            <div className="contact__success">
              <h3>Message Sent</h3>
              <p>Thanks for reaching out — we'll get back to you within one business day.</p>
              <button className="btn btn-outline" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit}>
              <div className="contact__form-row">
                <label className="contact__field">
                  <span>Your Name</span>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required />
                </label>
                <label className="contact__field">
                  <span>Email Address</span>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </label>
              </div>
              <label className="contact__field">
                <span>Subject</span>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} />
              </label>
              <label className="contact__field">
                <span>Message</span>
                <textarea name="message" rows={5} value={form.message} onChange={handleChange} required />
              </label>
              {error && <p className="contact__error">{error}</p>}
              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function PhoneCardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" fill="currentColor" />
    </svg>
  )
}

function MailCardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 6l8.5 7 8.5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PinCardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 22s7-7.4 7-12.6A7 7 0 105 9.4C5 14.6 12 22 12 22z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="9.4" r="2.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}
