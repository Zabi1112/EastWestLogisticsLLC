import { parseAvailableTrucks } from './trucks.js'

export const truckFeedConfigured = Boolean(import.meta.env.VITE_SHEETS_TRUCKS_CSV_URL?.trim())

export async function fetchAvailableTrucks(signal) {
  const url = import.meta.env.VITE_SHEETS_TRUCKS_CSV_URL?.trim()
  if (!url) throw new Error('Truck feed is not configured.')
  const response = await fetch(url, { signal, cache: 'no-store' })
  if (!response.ok) throw new Error(`Truck feed request failed (${response.status}).`)
  return parseAvailableTrucks(await response.text())
}
