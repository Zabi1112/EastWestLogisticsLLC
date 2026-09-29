import { useEffect, useState } from 'react'
import './CarrierPerformance.css'
import { validateEarnings } from '../lib/earnings.js'
const EARNINGS_URL = import.meta.env.VITE_SHEETS_EARNINGS_API_URL?.trim()

const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

export default function CarrierPerformance() {
  const [period, setPeriod] = useState('weekly')
  const [selected, setSelected] = useState(null)
  const [feed, setFeed] = useState(null)
  const [failed, setFailed] = useState(false)
  const [reportId, setReportId] = useState('')
  useEffect(() => {
    if (!EARNINGS_URL) return
    let disposed = false
    let controller = null
    const refresh = async () => {
      if (controller || document.hidden) return
      controller = new AbortController()
      const timeout = setTimeout(() => controller?.abort(), 30000)
      try {
        const url = new URL(EARNINGS_URL)
        url.searchParams.set('_request', crypto.randomUUID())
        const response = await fetch(url, { signal: controller.signal, cache: 'no-store' })
        if (!response.ok) throw new Error('Report unavailable')
        const data = validateEarnings(await response.json())
        if (!disposed) { setFeed(data); setFailed(false); setSelected(null) }
      } catch {
        if (!disposed) setFailed(true)
      } finally { clearTimeout(timeout); controller = null }
    }
    refresh()
    const timer = setInterval(refresh, 60000)
    document.addEventListener('visibilitychange', refresh)
    return () => { disposed = true; clearInterval(timer); document.removeEventListener('visibilitychange', refresh); controller?.abort() }
  }, [])
  const reports = feed?.[period] || []
  const report = reports.find(item => item.id === reportId) || reports[0]
  if (failed || !report) {
    return <section className="section performance" id="carrier-performance"><div className="container"><h2>Carrier gross overview</h2><p role="status">{failed || !EARNINGS_URL ? 'The earnings report is temporarily unavailable. Please check back shortly.' : !feed ? 'Loading carrier earnings...' : 'No completed loads are recorded for this period.'}</p></div></section>
  }
  const gross = report.rows.reduce((total, row) => total + row.gross, 0)
  const loads = report.rows.reduce((total, row) => total + row.loads, 0)
  const active = selected === null ? null : report.rows[selected] || null
  const maximum = Math.max(5000, Math.ceil(Math.max(...report.rows.map(row => row.gross)) / 5000) * 5000)
  const plot = { left: 66, top: 25, width: 674, height: 215 }
  const step = plot.width / report.rows.length

  return (
    <section className="section performance" id="carrier-performance" aria-labelledby="performance-title">
      <div className="container">
        <div className="performance__intro">
          <div><span className="eyebrow">The work behind the miles</span><h2 id="performance-title">A clearer view of carrier earnings.</h2><p>Weekly activity. Monthly perspective. A snapshot of gross revenue from dispatched loads.</p></div>
        </div>
        <div className="performance__dashboard" aria-describedby="performance-note">
          <div className="performance__toolbar">
            <div><h3>Carrier gross overview</h3><p>Gross revenue overview &middot; USD</p></div>
            <div className="performance__switch" role="group" aria-label="Report period">
              {['weekly', 'monthly'].map(option => <button key={option} aria-pressed={period === option} onClick={() => { setPeriod(option); setSelected(null); setReportId('') }}>{option === 'weekly' ? 'Weekly' : 'Monthly'}</button>)}
            </div>
          </div>
          {EARNINGS_URL && <div className="performance__period-picker"><label>Choose {period === 'weekly' ? 'week' : 'month'} <select value={report.id} onChange={event => { setReportId(event.target.value); setSelected(null) }}>{reports.map(item => <option key={item.id} value={item.id}>{item.period}</option>)}</select></label><span>Updated {new Date(feed.generatedAt).toLocaleString()}</span></div>}
          <div className="performance__body">
            <aside className="performance__summary" aria-live="polite">
              <span className="performance__label">{report.title}</span><strong className="performance__total">{money(gross)}</strong><span className="performance__date">{report.period}</span>
              <div className="performance__metrics"><div><span>Loads</span><strong>{loads}</strong></div><div><span>Average gross / load</span><strong>{money(loads ? gross / loads : 0)}</strong></div></div>
              <p>Gross revenue before fuel, driver pay, dispatch fees, and other operating costs.</p>
            </aside>
            <div className="performance__chart-panel">
              <div className="performance__chart-heading"><strong>Gross revenue</strong><span><i /> Gross (USD)</span></div>
              <svg className="performance__chart" viewBox="0 0 770 280" role="group" aria-label={`${report.title} chart, completed load totals. Select a bar to see its gross and loads.`}>
                {[0, 1, 2, 3].map(tick => {
                  const y = plot.top + plot.height * tick / 3
                  return <g key={tick}><line x1={plot.left} x2="750" y1={y} y2={y} stroke="#e4e9f0" strokeDasharray="4 5" /><text x="52" y={y + 4} textAnchor="end" fill="#657086" fontSize="12">${Math.round(maximum * (3 - tick) / 3 / 1000)}k</text></g>
                })}
                {report.rows.map((row, index) => {
                  const height = row.gross / maximum * plot.height
                  const x = plot.left + index * step + step * 0.23
                  return <g key={row.label} className="performance__bar" role="button" tabIndex="0" aria-label={`${row.label}: ${money(row.gross)} gross, ${row.loads} loads`} aria-pressed={selected === index} onClick={() => setSelected(index)} onFocus={() => setSelected(index)} onMouseEnter={() => setSelected(index)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelected(index) } }}>
                    <title>{row.label}: {money(row.gross)}, {row.loads} loads</title>
                    <rect x={x} y={plot.top + plot.height - height} width={step * 0.54} height={height} rx="6" fill={selected === index ? '#d9622f' : '#1c3f7a'} />
                    <text x={plot.left + index * step + step / 2} y="266" textAnchor="middle" fill="#536176" fontSize="12">{row.label}</text>
                  </g>
                })}
              </svg>
              <div className="performance__selection" aria-live="polite">{active ? <><strong>{active.label}</strong><span>{money(active.gross)} gross</span><span>{active.loads} loads</span></> : <span>Select a bar to view revenue and loads.</span>}</div>
              <details className="performance__table"><summary>View report as a table</summary><table><caption>{report.title}</caption><thead><tr><th scope="col">{report.unit}</th><th scope="col">Gross (USD)</th><th scope="col">Loads</th></tr></thead><tbody>{report.rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td>{money(row.gross)}</td><td>{row.loads}</td></tr>)}</tbody></table></details>
            </div>
          </div>
          <p className="performance__disclosure" id="performance-note">Combined booking rates for loads marked DONE, grouped by load date. Weeks run Monday to Sunday; monthly totals follow calendar months. Gross is before operating costs.</p>
        </div>
      </div>
    </section>
  )
}
