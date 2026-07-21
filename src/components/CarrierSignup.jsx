import { useState } from 'react'
import { sendEmail } from '../lib/emailjs'
import { submitCarrierSignup } from '../lib/sheets'
import './CarrierSignup.css'

const BENEFITS = [
  'Dedicated dispatcher who learns your lanes and preferences',
  'Top-of-market rate negotiation on every load',
  'Paperwork, invoicing, and broker calls handled for you',
  'Weekly settlement reports — no surprises',
  'No long-term contract, cancel anytime',
]

const TRUCK_TYPES = ['Dry Van', 'Reefer', 'Flatbed', 'Power Only', 'Box Truck', 'Other']

const initialForm = {
  name: '',
  company: '',
  mcNumber: '',
  phone: '',
  email: '',
  truckType: TRUCK_TYPES[0],
  homeBase: '',
  message: '',
}

export default function CarrierSignup() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

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
        title: 'New Carrier Signup Request',
        message: [
          `Company: ${form.company || '-'}`,
          `MC/DOT #: ${form.mcNumber || '-'}`,
          `Phone: ${form.phone || '-'}`,
          `Truck Type: ${form.truckType}`,
          `Home Base: ${form.homeBase || '-'}`,
          '',
          form.message || 'No additional notes.',
        ].join('\n'),
      })
      setSubmitted(true)
    } catch {
      setError('Something went wrong sending your request. Please try again or call us directly.')
      setSending(false)
      return
    }

    // Best-effort: log the application in the Signups sheet for approval
    // tracking. Failure here shouldn't affect the user-facing success state.
    submitCarrierSignup({
      name: form.name,
      company: form.company,
      mcNumber: form.mcNumber,
      phone: form.phone,
      email: form.email,
      truckType: form.truckType,
      homeBase: form.homeBase,
      notes: form.message,
    }).catch((err) => console.error('Sheets signup log failed:', err))

    setSending(false)
  }

  return (
    <section id="carriers" className="section carriers">
      <div className="container carriers__inner">
        <div className="carriers__copy">
          <span className="eyebrow tag-pill--light">For Carriers</span>
          <h2>Ready to Run With Us?</h2>
          <p>
            Tell us about your truck and your lanes. A dispatcher will reach out
            within one business day to walk you through onboarding — no
            commitment required.
          </p>

          <ul className="carriers__benefits">
            {BENEFITS.map((benefit) => (
              <li key={benefit}>
                <CheckIcon />
                {benefit}
              </li>
            ))}
          </ul>

          <div className="carriers__contact-alt">
            <span>Prefer to talk now?</span>
            <a href="tel:+14092482002">(409) 248-2002</a>
          </div>
        </div>

        <div className="carriers__form-wrap">
          {submitted ? (
            <div className="carriers__success">
              <CheckCircleIcon />
              <h3>Request Received</h3>
              <p>
                Thanks, {form.name.split(' ')[0] || 'there'}! A dispatcher will
                contact you shortly at {form.phone || form.email || 'the info you provided'}.
              </p>
              <button className="btn btn-outline" onClick={() => { setForm(initialForm); setSubmitted(false) }}>
                Submit Another
              </button>
            </div>
          ) : (
            <form className="carriers__form" onSubmit={handleSubmit}>
              <div className="carriers__form-row">
                <Field label="Full Name" name="name" value={form.name} onChange={handleChange} required />
                <Field label="Company Name" name="company" value={form.company} onChange={handleChange} />
              </div>

              <div className="carriers__form-row">
                <Field label="MC / DOT Number" name="mcNumber" value={form.mcNumber} onChange={handleChange} />
                <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
              </div>

              <div className="carriers__form-row">
                <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required />
                <Field label="Home Base (City, State)" name="homeBase" value={form.homeBase} onChange={handleChange} />
              </div>

              <label className="carriers__field">
                <span>Truck Type</span>
                <select name="truckType" value={form.truckType} onChange={handleChange}>
                  {TRUCK_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>

              <label className="carriers__field">
                <span>Anything else we should know?</span>
                <textarea
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Preferred lanes, availability, current pain points..."
                />
              </label>

              {error && <p className="carriers__error">{error}</p>}
              <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
                {sending ? 'Sending...' : 'Request a Callback'}
              </button>
              <p className="carriers__disclaimer">
                By submitting, you agree to be contacted by East West Logistics LLC regarding dispatch services.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({ label, name, value, onChange, type = 'text', required = false }) {
  return (
    <label className="carriers__field">
      <span>{label}{required && <em>*</em>}</span>
      <input type={type} name={name} value={value} onChange={onChange} required={required} />
    </label>
  )
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 12.5l5 5L20 6" stroke="var(--orange-400)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="var(--orange-100)" />
      <path d="M7 12.5l3 3 7-7" stroke="var(--orange-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
