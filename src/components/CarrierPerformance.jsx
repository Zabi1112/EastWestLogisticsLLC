import { useState } from 'react'
import './CarrierPerformance.css'

// DEMO DATA ONLY. Replace these period records with the approved reporting feed
// when it is ready. Keep the demo disclosure until real data is connected.
const DEMO_REPORTS = {
  weekly: {
    title: 'Weekly gross', period: 'Sep 21 - 27, 2026', unit: 'Day',
    rows: [
      { label: 'Mon', gross: 8200, loads: 4 }, { label: 'Tue', gross: 9600, loads: 5 },
      { label: 'Wed', gross: 7100, loads: 4 }, { label: 'Thu', gross: 11200, loads: 6 },
      { label: 'Fri', gross: 8900, loads: 4 }, { label: 'Sat', gross: 4800, loads: 3 },
      { label: 'Sun', gross: 3200, loads: 2 },
    ],
  },
  monthly: {
    title: 'Monthly gross', period: 'September 2026', unit: 'Period',
    rows: [
      { label: 'Sep 1-6', gross: 38500, loads: 20 },
      { label: 'Sep 7-13', gross: 49200, loads: 25 },
      { label: 'Sep 14-20', gross: 46800, loads: 24 },
      { label: 'Sep 21-27', gross: 53000, loads: 28 },
      { label: 'Sep 28-30', gross: 18500, loads: 10 },
    ],
  },
}
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

export default function CarrierPerformance() {
  const [period, setPeriod] = useState('weekly')
  const [selected, setSelected] = useState(null)
  const report = DEMO_REPORTS[period]
  const gross = report.rows.reduce((total, row) => total + row.gross, 0)
  const loads = report.rows.reduce((total, row) => total + row.loads, 0)
  const active = selected === null ? null : report.rows[selected]
  const maximum = Math.ceil(Math.max(...report.rows.map(row => row.gross)) / 5000) * 5000
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
              {['weekly', 'monthly'].map(option => <button key={option} aria-pressed={period === option} onClick={() => { setPeriod(option); setSelected(null) }}>{option === 'weekly' ? 'Weekly' : 'Monthly'}</button>)}
            </div>
          </div>
          <div className="performance__body">
            <aside className="performance__summary" aria-live="polite">
              <span className="performance__label">{report.title}</span><strong className="performance__total">{money(gross)}</strong><span className="performance__date">{report.period}</span>
              <div className="performance__metrics"><div><span>Loads</span><strong>{loads}</strong></div><div><span>Average gross / load</span><strong>{money(gross / loads)}</strong></div></div>
              <p>Gross revenue before fuel, driver pay, dispatch fees, and other operating costs.</p>
            </aside>
            <div className="performance__chart-panel">
              <div className="performance__chart-heading"><strong>Gross revenue</strong><span><i /> Gross (USD)</span></div>
              <svg className="performance__chart" viewBox="0 0 770 280" role="group" aria-label={`${report.title} chart, illustrative figures. Select a bar to see its gross and loads.`}>
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
          <p className="performance__disclosure" id="performance-note">Figures shown are illustrative examples, not actual carrier earnings. Actual results vary.</p>
        </div>
      </div>
    </section>
  )
}
