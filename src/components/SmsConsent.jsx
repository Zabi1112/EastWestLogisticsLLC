import { useState } from 'react'
import { sendEmail } from '../lib/emailjs'
import './SmsConsent.css'

const BASE = import.meta.env.BASE_URL
const PRIVACY_URL = `${BASE}privacy.html`
const TERMS_URL = `${BASE}terms.html`

const CONSENT_TEXT =
  'I agree to receive SMS/text messages from East West Fulfillments regarding truck ' +
  'dispatch and logistics services, service updates, follow-ups, notifications, and ' +
  'promotional offers. Message frequency may vary. Message and data rates may apply. ' +
  'Reply STOP to unsubscribe. Reply HELP for assistance. Consent is voluntary and is ' +
  'not a condition of purchasing any goods or services.'

const initialForm = {
  name: '',
  company: '',
  phone: '',
  email: '',
  mcNumber: '',
  consent: false,
}

export default function SmsConsent() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.consent) {
      setError('Please check the box to confirm your consent before submitting.')
      return
    }

    setSending(true)
    try {
      await sendEmail({
        name: form.name,
        email: form.email,
        title: 'New SMS Consent Opt-In',
        message: [
          'SMS/TEXT MESSAGING CONSENT — East West Fulfillments',
          '',
          `Full Name:      ${form.name}`,
          `Company Name:    ${form.company || '-'}`,
          `Phone Number:    ${form.phone}`,
          `Email Address:   ${form.email}`,
          `MC / DOT Number: ${form.mcNumber || '-'}`,
          '',
          `Consent given:   YES`,
          `Submitted (UTC): ${new Date().toISOString()}`,
          '',
          'Consent language shown to the user:',
          CONSENT_TEXT,
          '',
          'The user also acknowledged the Privacy Policy and Terms of Service.',
        ].join('\n'),
      })
      setSubmitted(true)
    } catch {
      setError('Something went wrong sending your form. Please try again or call us directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="sms-signup" className="section sms">
      <div className="container sms__inner">
        <div className="sms__head">
          <span className="eyebrow">EAST WEST FULFILLMENTS</span>
          <h2>Truck Dispatch &amp; Logistics Services</h2>
          <p>
            Fill out the form below and opt in to receive text messages so our
            dispatch team can keep you updated on loads, rates, and service
            notifications.
          </p>
        </div>

        <div className="sms__card">
          {submitted ? (
            <div className="sms__success">
              <CheckCircleIcon />
              <h3>Thank You</h3>
              <p>
                Your consent has been recorded. You&apos;ll start receiving text
                updates from East West Fulfillments shortly. Reply STOP at any
                time to unsubscribe.
              </p>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setForm(initialForm)
                  setSubmitted(false)
                }}
              >
                Submit Another
              </button>
            </div>
          ) : (
            <form className="sms__form" onSubmit={handleSubmit}>
              <Field label="Full Name" name="name" value={form.name} onChange={handleChange} required />
              <Field label="Company Name" name="company" value={form.company} onChange={handleChange} />
              <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
              <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required />
              <Field label="MC / DOT Number" name="mcNumber" value={form.mcNumber} onChange={handleChange} />

              <label className="sms__consent">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={handleChange}
                />
                <span>{CONSENT_TEXT}</span>
              </label>

              <p className="sms__ack">
                By submitting this form, I acknowledge that I have reviewed the{' '}
                <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                {' '}and{' '}
                <a href={TERMS_URL} target="_blank" rel="noopener noreferrer">Terms of Service</a>.
              </p>

              {error && <p className="sms__error">{error}</p>}

              <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
                {sending ? 'Submitting...' : 'Submit'}
              </button>

              <div className="sms__legal-links">
                <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                <span aria-hidden="true">|</span>
                <a href={TERMS_URL} target="_blank" rel="noopener noreferrer">Terms of Service</a>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({ label, name, value, onChange, type = 'text', required = false }) {
  return (
    <label className="sms__field">
      <span>{label}{required && <em>*</em>}</span>
      <input type={type} name={name} value={value} onChange={onChange} required={required} />
    </label>
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
