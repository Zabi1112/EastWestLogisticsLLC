import { useState } from 'react'
import './FAQ.css'

const FAQS = [
  {
    q: 'What does a truck dispatcher actually do?',
    a: 'Your dispatcher finds available loads that match your truck and lanes, negotiates the rate with the broker or shipper, handles the booking paperwork, and stays in communication throughout the trip. You keep control over which loads you accept — we just do the legwork.',
  },
  {
    q: 'How much does dispatching cost?',
    a: 'We charge a flat percentage of each load, only when you get paid. There are no upfront fees, monthly minimums, or costs if you have no loads moving. Contact us for our current rate.',
  },
  {
    q: 'Do I have to sign a long-term contract?',
    a: "No. We work month-to-month. If you're not happy with the service, you can cancel at any time — we earn your business load by load.",
  },
  {
    q: 'What kind of trucks and freight do you work with?',
    a: 'We dispatch dry van, reefer, flatbed, power only, and box truck operations. Whether you run one truck or manage a small fleet, we can build a lane strategy around your equipment.',
  },
  {
    q: 'How do I get paid?',
    a: 'You get paid directly by the broker or factoring company per your normal payment terms. We never touch your freight payments — we only invoice you our dispatch fee.',
  },
  {
    q: 'How quickly can I get started?',
    a: 'Most carriers are onboarded and booking loads within 24-48 hours of signing up. Fill out the carrier form above and a dispatcher will reach out the same business day.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="section faq">
      <div className="container faq__inner">
        <div className="section-head">
          <span className="eyebrow">Common Questions</span>
          <h2>Frequently Asked Questions</h2>
          <p>
            Everything you need to know about working with East West Logistics
            LLC. Don't see your question here? Reach out and we'll answer it
            directly.
          </p>
        </div>

        <div className="faq__list">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div key={item.q} className={`faq__item ${isOpen ? 'is-open' : ''}`}>
                <button
                  className="faq__question"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  {item.q}
                  <PlusIcon open={isOpen} />
                </button>
                <div className="faq__answer" style={{ maxHeight: isOpen ? '240px' : '0px' }}>
                  <p>{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function PlusIcon({ open }) {
  return (
    <svg className={`faq__icon ${open ? 'is-open' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
