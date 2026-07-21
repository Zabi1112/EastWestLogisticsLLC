import { useEffect, useState } from 'react'
import { fetchApprovedCarriers } from '../lib/sheets'
import './CarrierDirectory.css'

export default function CarrierDirectory() {
  const [carriers, setCarriers] = useState([])

  useEffect(() => {
    let cancelled = false

    fetchApprovedCarriers()
      .then((records) => {
        if (!cancelled) setCarriers(records)
      })
      .catch((err) => console.error('Failed to load carrier directory:', err))

    return () => {
      cancelled = true
    }
  }, [])

  if (carriers.length === 0) return null

  return (
    <section id="our-carriers" className="section carrier-directory">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Our Network</span>
          <h2>Carriers Running With Us</h2>
          <p>These are some of the owner-operators and fleets currently dispatching through East West Logistics.</p>
        </div>

        <div className="carrier-directory__grid">
          {carriers.map((carrier, i) => (
            <CarrierCard key={`${carrier['Company Name']}-${i}`} carrier={carrier} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CarrierCard({ carrier }) {
  const name = carrier['Company Name']
  if (!name) return null

  const tags = [carrier['Truck Type'], carrier['Home Base']].filter(Boolean)

  return (
    <div className="carrier-directory__card">
      <div className="carrier-directory__badge">{name.charAt(0)}</div>
      <strong>{name}</strong>
      {tags.length > 0 && <span>{tags.join(' · ')}</span>}
    </div>
  )
}
