import { parseAvailableTrucks } from './trucks.js'

const DIRECT_URL = import.meta.env.VITE_SHEETS_TRUCKS_API_URL?.trim()
const CSV_URL = import.meta.env.VITE_SHEETS_TRUCKS_CSV_URL?.trim()
export const truckFeedConfigured = Boolean(DIRECT_URL || CSV_URL)

export async function fetchAvailableTrucks(signal) {
  const source = DIRECT_URL || CSV_URL
  if (!source) throw new Error('Truck feed is not configured.')
  const url = new URL(source)
  if (DIRECT_URL) url.searchParams.set('resource', 'available-trucks')
  url.searchParams.set('_request', crypto.randomUUID())
  // Do not fall back to a potentially stale published CSV if the direct feed fails.
  const response = await fetch(url, { signal, cache: 'no-store', redirect: 'follow' })
  if (!response.ok) throw new Error(`Truck feed request failed (${response.status}).`)
  return parseAvailableTrucks(await response.text())
}
