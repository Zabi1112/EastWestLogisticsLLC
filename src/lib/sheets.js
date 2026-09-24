import { parseCsv } from './csv.js'

const SIGNUP_URL = import.meta.env.VITE_SHEETS_SIGNUP_URL
const DIRECTORY_CSV_URL = import.meta.env.VITE_SHEETS_DIRECTORY_CSV_URL

export function submitCarrierSignup(fields) {
  if (!SIGNUP_URL) {
    return Promise.reject(new Error('Google Sheets signup endpoint is not configured. Set VITE_SHEETS_SIGNUP_URL in .env'))
  }

  // Apps Script web apps don't return CORS headers we can read, so this is a
  // fire-and-forget request: 'no-cors' plus a "simple" content type avoids a
  // blocked preflight, at the cost of not being able to read the response.
  return fetch(SIGNUP_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(fields),
  })
}

export async function fetchApprovedCarriers() {
  if (!DIRECTORY_CSV_URL) return []

  const res = await fetch(DIRECTORY_CSV_URL)
  if (!res.ok) throw new Error(`Carrier directory request failed (${res.status})`)

  return parseCsv(await res.text())
}

