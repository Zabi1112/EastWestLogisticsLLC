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

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        field += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  const [header, ...dataRows] = rows.filter((r) => r.some((cell) => cell.trim() !== ''))
  if (!header) return []

  return dataRows.map((cells) => {
    const record = {}
    header.forEach((key, idx) => {
      record[key.trim()] = (cells[idx] ?? '').trim()
    })
    return record
  })
}
