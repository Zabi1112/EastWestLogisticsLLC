import { parseCsvTable } from './csv.js'

const REQUIRED_HEADERS = ['Truck ID', 'Company Name', 'Company MC', 'Equipment Type', 'Empty State', 'Empty City', 'Available Date', 'Available Time', 'Time Zone', 'Availability', 'Preferred Destination', 'Dispatcher Name', 'Dispatcher Phone', 'Last Updated']

export function phoneLink(value) {
  const digits = value.replace(/[^0-9]/g, '')
  if (digits.length < 10 || digits.length > 15) return null
  return `tel:${value.trim().startsWith('+') ? '+' : ''}${digits}`
}

export function parseAvailableTrucks(csv) {
  if (/^\s*</.test(csv)) throw new Error('Expected CSV, received an HTML page.')
  const { headers, records } = parseCsvTable(csv)
  if (!REQUIRED_HEADERS.every(header => headers.includes(header))) {
    throw new Error('The truck feed does not contain the expected column headers.')
  }
  return records.filter(row => row.Availability?.trim().toLowerCase() === 'available')
    .filter(row => row['Truck ID'] && row['Company Name'] && row['Empty State'] && row['Empty City'])
    .map(row => ({
      id: row['Truck ID'], company: row['Company Name'], mc: row['Company MC'],
      equipment: row['Equipment Type'], state: row['Empty State'].toUpperCase(),
      city: row['Empty City'], date: row['Available Date'], time: row['Available Time'],
      zone: row['Time Zone'], destination: row['Preferred Destination'],
      dispatcher: row['Dispatcher Name'], phone: row['Dispatcher Phone'], updated: row['Last Updated'],
    }))
}

export function displayDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return value || 'Confirm with dispatcher'
  const [, year, month, day] = match
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}
