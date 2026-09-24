import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchAvailableTrucks, truckFeedConfigured } from '../lib/truck-feed.js'
import { displayDate, phoneLink } from '../lib/trucks.js'
import './AvailableTrucks.css'

const HOME = import.meta.env.BASE_URL

export default function AvailableTrucks() {
  const [trucks, setTrucks] = useState([])
  const [loading, setLoading] = useState(truckFeedConfigured)
  const [error, setError] = useState(false)
  const [checked, setChecked] = useState(null)
  const [state, setState] = useState('')
  const [equipment, setEquipment] = useState('')
  const [search, setSearch] = useState('')
  const request = useRef(null)

  const refresh = useCallback(async () => {
    if (!truckFeedConfigured || request.current) return
    const controller = new AbortController()
    request.current = controller
    setLoading(true)
    const timeout = window.setTimeout(() => controller.abort(), 20000)
    try {
      const records = await fetchAvailableTrucks(controller.signal)
      if (request.current !== controller) return
      setTrucks(records)
      setError(false)
      setChecked(new Date())
    } catch {
      if (request.current === controller) setError(true)
    } finally {
      window.clearTimeout(timeout)
      if (request.current === controller) {
        request.current = null
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    refresh()
    const tick = () => { if (!document.hidden) refresh() }
    const timer = window.setInterval(tick, 60000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', tick)
      const controller = request.current
      request.current = null
      controller?.abort()
    }
  }, [refresh])

  const states = [...new Set([...trucks.map(truck => truck.state), state].filter(Boolean))].sort()
  const equipmentTypes = [...new Set([...trucks.map(truck => truck.equipment), equipment].filter(Boolean))].sort()
  const query = search.trim().toLowerCase()
  const visible = trucks.filter(truck => (!state || truck.state === state) &&
    (!equipment || truck.equipment === equipment) &&
    [truck.city, truck.state, truck.company, truck.mc, truck.id].join(' ').toLowerCase().includes(query))
  const clearFilters = () => { setState(''); setEquipment(''); setSearch('') }

  return (
    <div className="truck-page">
      <a className="truck-skip" href="#truck-listings">Skip to available trucks</a>
      <header className="truck-header">
        <div className="container truck-header__inner">
          <a className="truck-brand" href={HOME}>
            <img src={`${HOME}logo.png`} alt="" />
            <span>East West<strong>Logistics LLC</strong></span>
          </a>
          <nav aria-label="Broker navigation">
            <a href={HOME}>Our website <span aria-hidden="true">&#8599;</span></a>
            <a className="truck-header__phone" href="tel:+14092482002">(409) 248-2002</a>
          </nav>
        </div>
      </header>
      <main>
        <section className="truck-hero">
          <div className="container truck-hero__inner">
            <div>
              <span className="eyebrow">For freight brokers</span>
              <h1>Your next load.<br /><span>Our available trucks.</span></h1>
              <p>Find the right equipment, check where it empties, and connect directly with its dispatcher to arrange the next load.</p>
            </div>
            <aside className="truck-hero__note">
              <span className="truck-dot" /> Open for advance booking
              <p>Planning ahead? Check each truck's empty date and time. Call to confirm availability and book.</p>
            </aside>
          </div>
        </section>
        <section id="truck-listings" className="container truck-board" aria-labelledby="truck-board-title">
          <div className="truck-board__heading">
            <div><h2 id="truck-board-title">Available trucks</h2><p>Availability times are local to each truck's listed time zone.</p></div>
            <div className="truck-refresh">
              {checked && <span>Last checked {checked.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>}
              <button className="btn btn-outline" onClick={refresh} disabled={loading || !truckFeedConfigured}>{loading ? 'Checking...' : 'Refresh listings'}</button>
            </div>
          </div>
          <div className="truck-filters" role="search" aria-label="Filter available trucks">
            <label>Search<input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="City, company, MC or truck ID" /></label>
            <label>Empty state<select value={state} onChange={event => setState(event.target.value)}><option value="">All states</option>{states.map(item => <option key={item}>{item}</option>)}</select></label>
            <label>Equipment<select value={equipment} onChange={event => setEquipment(event.target.value)}><option value="">All equipment</option>{equipmentTypes.map(item => <option key={item}>{item}</option>)}</select></label>
            <button className="truck-clear" onClick={clearFilters} disabled={!state && !equipment && !search}>Clear filters</button>
          </div>
          <div aria-live="polite" role="status">
            {!truckFeedConfigured ? <div className="truck-empty"><h3>Truck listings are coming soon</h3><p>Call our dispatch team for current availability.</p><a className="btn btn-primary" href="tel:+14092482002">Call dispatch</a></div>
              : error ? <div className="truck-empty truck-error"><h3>We couldn't confirm current availability</h3><p>Please refresh the listings or call (409) 248-2002. We've hidden earlier results until availability can be checked again.</p><button className="btn btn-outline" onClick={refresh} disabled={loading}>Try again</button></div>
              : !checked && loading ? <div className="truck-empty"><h3>Finding available trucks...</h3><p>Checking the latest listings from our dispatch team.</p></div>
              : <p className="truck-count"><strong>{visible.length}</strong> {visible.length === 1 ? 'truck' : 'trucks'}{state || equipment || query ? ' matching your search' : ' available'} <span>&middot; Automatically checks every minute</span></p>}
          </div>
          {truckFeedConfigured && checked && !error && (visible.length ?
            <div className="truck-grid">{visible.map((truck, index) => <TruckCard key={`${truck.id}-${index}`} truck={truck} />)}</div> :
            <div className="truck-empty"><h3>{trucks.length ? 'No trucks match those filters' : 'No trucks are currently listed as available'}</h3><p>{trucks.length ? 'Try another state or equipment type.' : 'Check back soon, or call our dispatch team about upcoming availability.'}</p>{trucks.length ? <button className="btn btn-outline" onClick={clearFilters}>Clear filters</button> : <a className="btn btn-primary" href="tel:+14092482002">Call dispatch</a>}</div>)}
          <p className="truck-board__footnote">Listings may change as loads are booked. A listing is not a reservation; confirm equipment, carrier approval, and timing with the dispatcher.</p>
        </section>
      </main>
      <footer className="truck-footer"><div className="container"><span>&copy; {new Date().getFullYear()} East West Logistics LLC</span><div><a href={HOME}>Home</a><a href={`${HOME}privacy.html`}>Privacy</a><a href={`${HOME}terms.html`}>Terms</a></div></div></footer>
    </div>
  )
}

function TruckCard({ truck }) {
  const telephone = phoneLink(truck.phone)
  return (
    <article className="truck-card">
      <div className="truck-card__top"><span className="truck-status"><span className="truck-dot" />Available</span><span>Truck {truck.id}</span></div>
      <div className="truck-card__location"><span className="truck-label">Empty location</span><h3>{truck.city}, {truck.state}</h3><span className="truck-equipment">{truck.equipment || 'Confirm equipment'}</span></div>
      <div className="truck-card__schedule"><span className="truck-label">Available from</span><strong>{displayDate(truck.date)}{truck.time && ` \u00b7 ${truck.time}`}</strong><span>{truck.zone || 'Confirm time zone with dispatcher'}</span></div>
      <dl className="truck-card__details"><div><dt>Carrier</dt><dd>{truck.company}</dd></div><div><dt>Company MC</dt><dd>{truck.mc ? `MC ${truck.mc.replace(/^MC[-#\s]*/i, '')}` : 'Ask dispatcher'}</dd></div><div><dt>Preferred destination</dt><dd>{truck.destination || 'Ask dispatcher'}</dd></div></dl>
      <div className="truck-card__contact"><div><span className="truck-label">Your dispatcher</span><strong>{truck.dispatcher || 'Dispatch team'}</strong>{telephone && <span>{truck.phone}</span>}</div><a className="btn btn-primary" href={telephone || 'tel:+14092482002'} aria-label={`Call ${telephone ? truck.dispatcher || 'dispatcher' : 'dispatch team'} about truck ${truck.id}`}>{telephone ? 'Call dispatcher' : 'Contact dispatch'} <span aria-hidden="true">&#8599;</span></a></div>
      <p className="truck-card__updated">{truck.updated ? `Listing updated ${truck.updated} (dispatch office time)` : 'Update time not provided - confirm with dispatcher'}</p>
    </article>
  )
}
